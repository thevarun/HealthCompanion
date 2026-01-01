---
name: agent-creator
description: Creates custom Claude Code sub-agents for project tasks. Use when the user wants to create specialized agents, design agent workflows, or needs help breaking down complex tasks into agent-based solutions. All created agents use tmp- prefix for easy identification and cleanup.
tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch
---

# Agent Creator Skill

Create custom Claude Code sub-agents tailored to your project's needs. All agents are prefixed with `tmp-` for easy identification and cleanup.

## Workflow Overview

This skill follows a 5-step interactive process:

0. **Memory Check** - Check registry for reusable patterns (may skip to step 4)
1. **Context Assessment** - Analyze project and task requirements
2. **Agent Design** - Determine needed agents and their specialties
3. **Community Research** - Reference GitHub repos for patterns and inspiration
4. **Agent Creation** - Generate and validate agent specification files
5. **Deployment & Registry** - Save files, verify, and optionally save to registry

---

## Quick Create Mode

**For simple requests, skip Steps 1-3 and go directly to Step 4.**

### When to Use Quick Create
- User requests a single agent for a specific task
- User says "just create a quick..." or "simple agent for..."
- A saved template exists in `.claude/skills/agent-creator/templates/`
- The registry has a successful pattern for this type

### Important: Use Claude's Built-in Agents First
Before creating custom agents, consider if Claude Code's built-in agents suffice:
- **Explore** - Codebase exploration and research
- **general-purpose** - Multi-step complex tasks
- **Plan** - Implementation planning

Only create custom `tmp-` agents when you need:
- Project-specific knowledge baked in
- Custom tool restrictions
- Specialized workflows not covered by built-ins

### Quick Create Flow
1. Check registry for existing pattern: `cat .claude/skills/agent-creator/REGISTRY.yaml`
2. Check templates: `ls .claude/skills/agent-creator/templates/`
3. If match exists: Load it, ask for customizations
4. Skip directly to Step 4 (Agent Creation)
5. Complete Step 5 (Validation)

### Templates Directory
Templates are for **project-specific** patterns that worked well and were saved for reuse.
This directory starts empty and fills up as you save successful patterns.

Ask user: "Would you like Quick Create (reuse existing pattern) or Full Workflow (design from scratch)?"

---

## Step 0: Memory Check (Always First)

**Check the registry for existing patterns before designing from scratch.**

### Load Registry
```bash
cat .claude/skills/agent-creator/REGISTRY.yaml
```

### Check for Matches
1. Review `successful_agents` for patterns matching the current task
2. Check `recommended_combinations` for common task types
3. Note any `failed_patterns` to avoid

### If Match Found
- Present the existing pattern to the user
- Ask: "I found a previously successful pattern for [X]. Would you like to reuse it (with optional modifications)?"
- If yes: Skip to Step 4 with the existing template
- If no: Continue to Step 1

### If No Match
- Continue to Step 1 for fresh analysis

---

## Step 1: Context Assessment

Before creating agents, gather comprehensive context:

### Project Analysis
```bash
# Understand project structure (use ls if tree not available)
ls -la . && ls -la src/ 2>/dev/null

# Check existing agents
ls -la .claude/agents/ 2>/dev/null || echo "No agents directory yet"

# Check existing templates in registry
ls -la .claude/skills/agent-creator/templates/ 2>/dev/null || echo "No templates yet"
```

Also read these files for context:
- `CLAUDE.md` - Project instructions
- `README.md` - Project overview
- `package.json` - Dependencies and scripts (if exists)

### Task Analysis Questions
Ask the user:
- What is the main task or goal you want to accomplish?
- Are there specific technologies or frameworks involved?
- What is the expected complexity (simple fix, feature, refactor, new project)?
- Do you have preferences for how work should be divided?

### CHECKPOINT 1
Present findings to user:
- Project type and tech stack identified
- Task scope and complexity assessed
- Proposed number of agents needed

**Wait for user approval before proceeding.**

## Step 2: Agent Design

Based on context, design the agent architecture:

### Common Agent Patterns

| Agent Type | Use Case | Key Tools |
|------------|----------|-----------|
| `tmp-explorer` | Codebase research, file discovery | Read, Glob, Grep |
| `tmp-implementer` | Code writing, feature development | Read, Write, Edit, Bash |
| `tmp-tester` | Test creation and execution | Read, Write, Bash |
| `tmp-reviewer` | Code review, quality checks | Read, Grep, Glob |
| `tmp-documenter` | Documentation updates | Read, Write |
| `tmp-debugger` | Bug investigation, fixing | Read, Edit, Bash, Grep |
| `tmp-refactorer` | Code restructuring | Read, Edit, Glob, Grep |
| `tmp-api-integrator` | External API integration | Read, Write, WebFetch |

### Design Considerations
- Each agent should have a single, clear responsibility
- Agents should be composable (can work together)
- Tool access should follow principle of least privilege
- Model selection: use `haiku` for simple tasks, `sonnet` for complex reasoning

### CHECKPOINT 2
Present agent design to user:
- List of proposed agents with names and descriptions
- Each agent's specialty and tool access
- How agents will collaborate (if applicable)

**Wait for user approval before proceeding.**

## Step 3: Community Research

**IMPORTANT: Reference the detailed guide at `.claude/skills/agent-creator/COMMUNITY-REPOS.md`**

### Research Limits (Mandatory)

| Activity | Maximum |
|----------|---------|
| GitHub repo searches | 3 queries |
| Repos to evaluate in detail | 5 repos |
| Web searches | 2 queries |
| Total research time | 10 minutes |

### Curated Repos (Check First)

| Repository | URL |
|------------|-----|
| claude-code-templates | https://github.com/davila7/claude-code-templates |
| wshobson/agents | https://github.com/wshobson/agents |
| claude-flow | https://github.com/ruvnet/claude-flow |
| awesome-claude-code | https://github.com/hesreallyhim/awesome-claude-code |
| SuperClaude Framework | https://github.com/SuperClaude-Org/SuperClaude_Framework |
| compound-engineering-plugin | https://github.com/EveryInc/compound-engineering-plugin |
| claude-code-workflows | https://github.com/OneRedOak/claude-code-workflows |

### Evaluation Criteria

Before using patterns from a repo, verify:
1. **Recent Activity**: Last commit < 30 days (ideal) or < 90 days (acceptable)
2. **Stars**: 50+ preferred, 10+ minimum
3. **Relevance**: Directly applicable to the task

```bash
# Quick repo check (if gh CLI available)
gh repo view {owner}/{repo} --json stargazerCount,pushedAt

# Fallback if gh CLI not available - use WebFetch
# WebFetch("https://api.github.com/repos/{owner}/{repo}")
```

### CHECKPOINT 3
Share research findings:
- Which repos were checked (max 5)
- Relevant patterns found
- Adaptations proposed for this project

**Wait for user approval before proceeding.**

## Step 4: Agent Creation

Create agent files following Claude Code's native format:

### Agent File Template
```markdown
---
name: tmp-{agent-name}
description: {Clear description of when/why to use this agent. Be specific about triggers.}
tools: {Comma-separated list of allowed tools}
model: {sonnet|haiku|opus|inherit}
---

# Role & Purpose

You are a {role description} specialized in {specialty}.

## When to Activate

This agent should be used when:
- {Trigger condition 1}
- {Trigger condition 2}

## Core Responsibilities

1. {Primary responsibility}
2. {Secondary responsibility}

## Workflow

1. {First step}
2. {Second step}
3. {Continue as needed}

## Output Format

{Describe expected output structure}

## Constraints

- {Limitation 1}
- {Limitation 2}
```

### File Naming Convention
- Location: `.claude/agents/tmp-{name}.md`
- Naming: lowercase, hyphens only, `tmp-` prefix
- Examples: `tmp-explorer.md`, `tmp-api-integrator.md`

### Pre-Save Validation
Before presenting to user, validate each agent:

1. **Name format**: Must be `tmp-{lowercase-alphanumeric-hyphens}`
   - Valid: `tmp-api-client`, `tmp-db-migrator`
   - Invalid: `tmp_test`, `TMP-Agent`, `my-agent`

2. **Tools list**: Only valid Claude Code tools
   - Valid: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch, Task, LSP
   - Invalid: AskUserQuestion, CustomTool

3. **Model**: Must be one of: `sonnet`, `haiku`, `opus`, `inherit`

4. **Description**: Should be 20-300 characters, specific enough to trigger correctly

5. **No duplicates**: Check `.claude/agents/` for existing agent with same name

### CHECKPOINT 4
For each agent, show:
- Complete agent file content
- File path where it will be saved
- Validation status (all checks passed)

**Wait for user approval of each agent before saving.**

## Step 5: Validation & Deployment

### Save Agent Files
```bash
# Ensure agents directory exists
mkdir -p .claude/agents

# Write each approved agent file
# (Done via Write tool after user approval)
```

### Verify Installation
```bash
# List created agents
ls -la .claude/agents/tmp-*.md

# Show agent count
echo "Created $(ls .claude/agents/tmp-*.md 2>/dev/null | wc -l) temporary agents"
```

### Usage Instructions
After creation, agents work in two ways:
- **Automatic**: When your task matches the agent's description, Claude may use it automatically
- **Explicit**: Reference the agent by name in your prompt, e.g., "Use the tmp-tester agent to..."

### Cleanup Instructions
When agents are no longer needed:
```bash
# Remove all temporary agents
rm .claude/agents/tmp-*.md

# Or remove specific agent
rm .claude/agents/tmp-{name}.md
```

### CHECKPOINT 5 (Final)
Present summary:
- All agents created successfully
- How to use them
- How to clean them up later

**Ask user**: "Would you like to save this pattern to the registry for future reuse?"

### If User Wants to Save Pattern
Update `.claude/skills/agent-creator/REGISTRY.yaml`:

1. Add entry to `successful_agents`:
```yaml
- name: {agent-name-without-tmp}
  purpose: What task/specialization it handles
  tools: [list of tools]
  model: model used
  created: YYYY-MM-DD
  project_context: What project/task it was created for
```

2. Optionally save template file:
```bash
mkdir -p .claude/skills/agent-creator/templates
cp .claude/agents/tmp-{name}.md .claude/skills/agent-creator/templates/{name}.md
```

3. Update `stats.total_agents_created`

### If Agent Doesn't Work (Later Feedback)
If user reports issues later, record in `failed_patterns`:
```yaml
- name: agent-name
  reason: Why it failed
  lesson: What to do differently
```

**Confirm completion with user.**

## Quick Reference

### Minimal Agent Template
```markdown
---
name: tmp-{name}
description: {When to use this agent}
tools: Read, Glob, Grep
model: sonnet
---

You are a {role}. Your job is to {primary task}.

When invoked:
1. {Step 1}
2. {Step 2}
3. {Step 3}
```

### Available Tools Reference
| Tool | Purpose |
|------|---------|
| `Read` | Read file contents |
| `Write` | Create new files |
| `Edit` | Modify existing files |
| `Glob` | Find files by pattern |
| `Grep` | Search file contents |
| `Bash` | Run shell commands |
| `WebFetch` | Fetch web content |
| `WebSearch` | Search the web |
| `Task` | Delegate to subagents |
| `LSP` | Code intelligence |

### Model Selection Guide
| Model | Best For | Cost |
|-------|----------|------|
| `haiku` | Simple, fast tasks | Lowest |
| `sonnet` | Balanced reasoning | Medium |
| `opus` | Complex reasoning | Highest |
| `inherit` | Match parent model | Varies |
