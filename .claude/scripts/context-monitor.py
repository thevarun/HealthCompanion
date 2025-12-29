#!/usr/bin/env python3
"""
Claude Code Context Monitor
Real-time context usage monitoring with visual indicators and session analytics
https://code.claude.com/docs/en/statusline
"""

import json
import sys
import os


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
        cost_data = data.get('cost', {})
        context_window = data.get('context_window') or {}

        
        # Build status components
        context_info = context_window_info(context_window)        
        context_display = get_context_display(context_info)
        directory = get_directory_display(workspace)
        session_metrics = get_session_metrics(cost_data)
        

        model_display = f"\033[94m[{model_name}]\033[0m"
        
        # Combine all components
        status_line = f"{model_display} \033[93m📁 {directory}\033[0m 🧠 {context_display}{session_metrics}"
        
        print(status_line)
        
    except Exception as e:
        # Fallback display on any error
        print(f"\033[94m[Claude]\033[0m \033[93m📁 {os.path.basename(os.getcwd())}\033[0m 🧠 \033[31m[Error: {str(e)[:20]}]\033[0m")

if __name__ == "__main__":
    main()
