#!/usr/bin/env python3
"""
Claude Code Context Monitor
Real-time context usage monitoring with visual indicators and session analytics
https://code.claude.com/docs/en/statusline
"""

import json
import sys
import os
import re

# DEFAULT_CONTEXT_LIMIT = 200_000


# def get_context_limit(model_identifier):
#     """
#     Return an approximate context window for the given model id/name.
#     Keeps logic simple and offline: detect known extended windows by substring,
#     otherwise fall back to the standard 200k.
#     """
#     if not model_identifier:
#         return DEFAULT_CONTEXT_LIMIT

#     ident = str(model_identifier).lower()

#     if "1m" in ident or "1000000" in ident:
#         return 1_000_000
#     if "500k" in ident:
#         return 500_000

#     # Default for most Claude 3 / 3.5 / 4 / 4.1 models
#     return DEFAULT_CONTEXT_LIMIT


def context_window_info(window):
    """
    Build context info from the statusline `context_window` payload.
    Expected shape:
    {
        "context_window_size": int,
        "current_usage": {
            "input_tokens": int,
            "output_tokens": int,
            "cache_creation_input_tokens": int,
            "cache_read_input_tokens": int
        }
    }
    """
    if not isinstance(window, dict):
        return None

    size = window.get("context_window_size")
    if not size or size <= 0:
        return None

    usage = window.get("current_usage")

    # If no calls yet, usage may be null; treat as 0% used.
    if usage is None:
        return {
            "percent": 0,
            "tokens": 0,
            "method": "context_window",
        }

    if not isinstance(usage, dict):
        return None

    tokens = (
        usage.get("input_tokens", 0)
        + usage.get("output_tokens", 0)
        + usage.get("cache_creation_input_tokens", 0)
        + usage.get("cache_read_input_tokens", 0)
    )

    percent = (tokens / size) * 100 if size > 0 else 0

    return {
        "percent": max(0, min(100, percent)),
        "tokens": tokens,
        "method": "context_window",
    }


# def read_tail_lines(path, max_bytes=8192):
#     """Read approximately the last max_bytes of a file, returning a list of lines."""
#     with open(path, "rb") as f:
#         try:
#             f.seek(-max_bytes, os.SEEK_END)
#         except OSError:
#             f.seek(0)
#         data = f.read().decode("utf-8", errors="replace")
#     return data.splitlines()


# def parse_context_from_transcript(transcript_path, context_limit):
#     """Parse context usage from transcript file."""
#     if not transcript_path or not os.path.exists(transcript_path):
#         return None

#     context_limit = context_limit or DEFAULT_CONTEXT_LIMIT
#     if context_limit <= 0:
#         context_limit = DEFAULT_CONTEXT_LIMIT

#     try:
#         lines = read_tail_lines(transcript_path)
#         if not lines:
#             return None

#         context_warning = None
#         total_tokens = 0
#         assistant_seen = 0

#         for line in reversed(lines):
#             try:
#                 data = json.loads(line.strip())

#                 msg_type = data.get("type")

#                 # Prefer explicit system warnings
#                 if msg_type in {"system", "system_message"}:
#                     content = data.get("content", "")

#                     match = re.search(r"Context left until auto-compact: (\d+)%", content)
#                     if match:
#                         percent_left = int(match.group(1))
#                         context_warning = {
#                             "percent": max(0, min(100, 100 - percent_left)),
#                             "warning": "auto-compact",
#                             "method": "system",
#                         }
#                         break

#                     match = re.search(r"Context low \((\d+)% remaining\)", content)
#                     if match:
#                         percent_left = int(match.group(1))
#                         context_warning = {
#                             "percent": max(0, min(100, 100 - percent_left)),
#                             "warning": "low",
#                             "method": "system",
#                         }
#                         break

#                 # Otherwise accumulate assistant usage to approximate window fill
#                 if msg_type == "assistant":
#                     message = data.get("message", {})
#                     usage = message.get("usage", {})
#                     if usage:
#                         input_tokens = usage.get("input_tokens", 0)
#                         output_tokens = usage.get("output_tokens", 0)
#                         cache_read = usage.get("cache_read_input_tokens", 0)
#                         cache_creation = usage.get("cache_creation_input_tokens", 0)
#                         total_tokens += input_tokens + output_tokens + cache_read + cache_creation
#                         assistant_seen += 1

#                     # Stop early if we already exceed the context limit or processed enough messages
#                     if total_tokens >= context_limit or assistant_seen >= 30:
#                         break

#             except (json.JSONDecodeError, KeyError, ValueError):
#                 continue

#         if context_warning:
#             return context_warning

#         if total_tokens > 0:
#             percent_used = max(0, min(100, (total_tokens / context_limit) * 100))
#             return {
#                 "percent": percent_used,
#                 "tokens": total_tokens,
#                 "method": "usage",
#             }

#         return None

#     except (FileNotFoundError, PermissionError):
#         return None

def get_context_display(context_info):
    """Generate context display with visual indicators."""
    if not context_info:
        return "🔵 ???"
    
    percent = context_info.get('percent', 0)
    percent = max(0, min(100, percent))
    warning = context_info.get('warning')
    
    # Color and icon based on usage level
    if percent >= 95:
        icon, color = "🚨", "\033[31;1m"  # Blinking red
        alert = "CRIT"
    elif percent >= 90:
        icon, color = "🔴", "\033[31m"    # Red
        alert = "HIGH"
    elif percent >= 75:
        icon, color = "🟠", "\033[91m"   # Light red
        alert = ""
    elif percent >= 50:
        icon, color = "🟡", "\033[33m"   # Yellow
        alert = ""
    else:
        icon, color = "🟢", "\033[32m"   # Green
        alert = ""
    
    # Create progress bar
    segments = 8
    filled = int((percent / 100) * segments)
    bar = "█" * filled + "▁" * (segments - filled)
    
    # Special warnings
    if warning == 'auto-compact':
        alert = "AUTO-COMPACT!"
    elif warning == 'low':
        alert = "LOW!"
    
    reset = "\033[0m"
    alert_str = f" {alert}" if alert else ""
    
    return f"{icon}{color}{bar}{reset} {percent:.0f}%{alert_str}"

def get_directory_display(workspace_data):
    """Get directory display name."""
    current_dir = workspace_data.get('current_dir', '')
    project_dir = workspace_data.get('project_dir', '')
    cwd = workspace_data.get('cwd', '')

    if current_dir and project_dir:
        if current_dir.startswith(project_dir):
            rel_path = current_dir[len(project_dir):].lstrip('/')
            return rel_path or os.path.basename(project_dir)
        else:
            return os.path.basename(current_dir)
    elif project_dir:
        return os.path.basename(project_dir)
    elif cwd:
        return os.path.basename(cwd)
    elif current_dir:
        return os.path.basename(current_dir)
    else:
        return "unknown"

def get_session_metrics(cost_data):
    """Get session metrics display."""
    if not cost_data:
        return ""
    
    metrics = []
    
    # Cost
    cost_usd = cost_data.get('total_cost_usd', 0)
    if cost_usd > 0:
        if cost_usd >= 0.10:
            cost_color = "\033[31m"  # Red for expensive
        elif cost_usd >= 0.05:
            cost_color = "\033[33m"  # Yellow for moderate
        else:
            cost_color = "\033[32m"  # Green for cheap
        
        cost_str = f"{cost_usd*100:.0f}¢" if cost_usd < 0.01 else f"${cost_usd:.3f}"
        metrics.append(f"{cost_color}💰 {cost_str}\033[0m")
    
    # # Duration
    # duration_ms = cost_data.get('total_duration_ms', 0)
    # if duration_ms > 0:
    #     minutes = duration_ms / 60000
    #     if minutes >= 30:
    #         duration_color = "\033[33m"  # Yellow for long sessions
    #     else:
    #         duration_color = "\033[32m"  # Green
        
    #     if minutes < 1:
    #         duration_str = f"{duration_ms//1000}s"
    #     else:
    #         duration_str = f"{minutes:.0f}m"
        
    #     metrics.append(f"{duration_color}⏱ {duration_str}\033[0m")
    
    # # Lines changed
    # lines_added = cost_data.get('total_lines_added', 0)
    # lines_removed = cost_data.get('total_lines_removed', 0)
    # if lines_added > 0 or lines_removed > 0:
    #     net_lines = lines_added - lines_removed
        
    #     if net_lines > 0:
    #         lines_color = "\033[32m"  # Green for additions
    #     elif net_lines < 0:
    #         lines_color = "\033[31m"  # Red for deletions
    #     else:
    #         lines_color = "\033[33m"  # Yellow for neutral
        
    #     sign = "+" if net_lines >= 0 else ""
    #     metrics.append(f"{lines_color}📝 {sign}{net_lines}\033[0m")
    
    return f" \033[90m|\033[0m {' '.join(metrics)}" if metrics else ""

def main():
    try:
        # Read JSON input from Claude Code
        data = json.load(sys.stdin)
        
        # Extract information
        model_data = data.get('model', {})
        model_name = model_data.get('display_name') or model_data.get('name') or model_data.get('id') or 'Claude'
        model_id = model_data.get('id') or model_data.get('name') or model_name

        workspace = data.get('workspace', {})
        # Include top-level cwd if provided (present in statusline payloads)
        # workspace_with_cwd = {**workspace, 'cwd': data.get('cwd', '')}
        # transcript_path = data.get('transcript_path', '')
        cost_data = data.get('cost', {})
        context_window = data.get('context_window') or {}
        # context_limit = context_window.get('context_window_size') or get_context_limit(model_id)
        
        # Prefer direct context_window data, fall back to transcript parsing for warnings/usage
        # window_info = context_window_info(context_window)
        # transcript_info = parse_context_from_transcript(transcript_path, context_limit)

        # if transcript_info and transcript_info.get("warning"):
        #     context_info = transcript_info
        # elif window_info:
        #     context_info = window_info
        # else:
        #     context_info = transcript_info
        
        # Build status components
        context_info = context_window_info(context_window)        
        context_display = get_context_display(context_info)
        directory = get_directory_display(workspace)
        session_metrics = get_session_metrics(cost_data)
        
        # Model display with context-aware coloring
        # if context_info:
        #     percent = context_info.get('percent', 0)
        #     if percent >= 90:
        #         model_color = "\033[31m"  # Red
        #     elif percent >= 75:
        #         model_color = "\033[33m"  # Yellow
        #     else:
        #         model_color = "\033[32m"  # Green
            
        #     model_display = f"{model_color}[{model_name}]\033[0m"
        # else:
        model_display = f"\033[94m[{model_name}]\033[0m"
        
        # Combine all components
        status_line = f"{model_display} \033[93m📁 {directory}\033[0m 🧠 {context_display}{session_metrics}"
        
        print(status_line)
        
    except Exception as e:
        # Fallback display on any error
        print(f"\033[94m[Claude]\033[0m \033[93m📁 {os.path.basename(os.getcwd())}\033[0m 🧠 \033[31m[Error: {str(e)[:20]}]\033[0m")

if __name__ == "__main__":
    main()
