# AI Workspace

A local, filesystem-backed agentic workspace for AI-assisted projects. Inspired by Manus/Antigravity - fully local, fully hackable, fully yours.

> [!TIP]
> **New to the workspace?** Read the [Obsidian User Guide](OBSIDIAN_GUIDE.md) to set up your command center.

## Architecture

```
ai-workspace/
+-- projects/            <- Each project has summary.md, todo.md, decisions.md, chat.log.md
|   +-- _template/       <- Copy this to create a new project
|   +-- ai_workflow_setup/
|   +-- game_dev/
|   +-- writing_book/
+-- agent/               <- Python agent controller
|   +-- controller.py    <- Main orchestrator (Planner -> Executor -> Verifier)
|   +-- config.yaml      <- Model roles + tool toggles
|   +-- prompts/         <- System prompts for each LLM role
|   +-- tools/           <- Sandboxed tools (filesystem, git, browser, python)
|   +-- requirements.txt
+-- logs/                <- (future) structured agent logs
+-- implementation_plan.md
+-- README.md
```

## Setup

```bash
# Install Python dependencies (use --index-url if you have a custom pip config)
pip install --index-url https://pypi.org/simple -r agent/requirements.txt

# Make sure LM Studio is running at http://localhost:1234
```

## Usage

```bash
# Dry run - load project context without calling LLMs
python -m agent.controller --project ai_workflow_setup --dry-run

# Full run - agent reads context, plans, executes, verifies, commits
python -m agent.controller --project ai_workflow_setup --task "List all current todo items"
```

## How It Works

1. **Load** - Reads the project's `summary.md`, `todo.md`, and recent `chat.log.md`
2. **Plan** - Planner LLM (DeepSeek R1) proposes a structured action plan (JSON)
3. **Execute** - Executor LLM (Qwen2.5) carries out each action via sandboxed tools
4. **Verify** - Verifier LLM checks for correctness, hallucinations, and scope
5. **Commit** - If approved, auto-commits with `[AI]`-prefixed message
6. **Log** - Appends the interaction to `chat.log.md`

## Available Tools

| Tool | Functions | Description |
|------|-----------|-------------|
| `fs.py` | read_file, write_file, append_file, list_dir | Filesystem ops, restricted to `projects/` |
| `git.py` | git_status, git_add, git_commit, git_diff | Git operations with `[AI]` commit prefix |
| `browser.py` | browse_url, search_web | Web fetch + DuckDuckGo search |
| `python_exec.py` | run_python | Sandboxed Python subprocess (30s timeout) |

## Creating a New Project

1. Copy `projects/_template/` to `projects/<your-project-name>/`
2. Edit `summary.md` with your project's goal and constraints
3. Add initial items to `todo.md`
4. Run the agent: `python -m agent.controller --project <your-project-name> --task "..."`

## Hardware

- CPU: Ryzen 7 9800X3D
- RAM: 64GB
- GPU: RTX 5090 (32GB VRAM)
- LM Studio for local model serving

## Development Notes

- Code editing happens in Antigravity (or any editor)
- Testing/running happens locally (terminal + LM Studio + Obsidian)
- If pip points to a stale devpi index, use `--index-url https://pypi.org/simple`
