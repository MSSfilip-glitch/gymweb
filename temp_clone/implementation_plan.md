# AI Workflow Setup - Implementation Plan

## Phase 1: Local Agent Controller [COMPLETE]

All Phase 1 code has been implemented and verified with a dry-run smoke test.

### What was built
- `agent/controller.py` - Main orchestrator: CLI, Planner -> Executor -> Verifier -> Git pipeline
- `agent/tools/fs.py` - Filesystem tool: read, write, append, list (path-validated)
- `agent/tools/git.py` - Git tool: status, add, commit (with `[AI]` prefix), diff
- `agent/tools/browser.py` - Web tool: URL fetch + DuckDuckGo search (httpx + BeautifulSoup)
- `agent/tools/python_exec.py` - Python execution: subprocess with 30s timeout
- `agent/tools/__init__.py` - Tool registry + 10 OpenAI-compatible function schemas
- `agent/prompts/planner.md` - Planner system prompt (structured JSON action plans)
- `agent/prompts/executor.md` - Executor system prompt (single tool calls)
- `agent/prompts/verifier.md` - Verifier system prompt (approve/reject + commit message)
- `agent/requirements.txt` - Python dependencies
- `.gitignore` - Excludes `.obsidian/`, `__pycache__/`, etc.

### Testing status
- [x] Dry-run passed: `python -m agent.controller --project ai_workflow_setup --dry-run`
- [ ] Live LM Studio test (next step)

---

## Phase 2: Live Testing & Validation [CURRENT]

### Step 1: LM Studio Live Test
> **Where**: Terminal (your PC) + LM Studio
> **NOT in Antigravity** - this tests your local Python code against your local LM Studio.

1. Open LM Studio
2. Load any model (start with something small/fast like a 7B-14B for testing)
3. Ensure the server is running at `http://localhost:1234`
4. Run:
   ```
   python -m agent.controller --project ai_workflow_setup --task "List all current todo items"
   ```
5. Check that `chat.log.md` was updated with the interaction
6. Check git log to see if an `[AI]` commit was created

**What to look for**: Does the Planner produce valid JSON? Does the Executor correctly call the `read_file` tool? Does the Verifier approve the result?

### Step 2: Obsidian Integration
> **Where**: Obsidian (your PC)
> **NOT in Antigravity** - Obsidian reads the files from disk directly.

1. Open Obsidian
2. "Open folder as vault" -> select `E:\Users\Filip\ai-workspace`
3. Install recommended plugins: Dataview, Tasks, Git
4. Browse `projects/ai_workflow_setup/` - you should see summary, todo, decisions, chat log rendered beautifully
5. After running the agent (Step 1), refresh Obsidian to see the agent's changes to `chat.log.md`

### Step 3: Prompt Iteration
> **Where**: Mix of Antigravity (editing prompts) and Terminal (testing changes)

The prompts in `agent/prompts/` control how the LLMs behave. After the live test:
- If the Planner doesn't produce valid JSON -> edit `planner.md`
- If the Executor misunderstands tool arguments -> edit `executor.md`
- If the Verifier is too strict/lenient -> edit `verifier.md`

This is iterative: edit prompt -> run agent -> check output -> repeat.

---

## Phase 3: Extended Capabilities [FUTURE]

### Step 4: Voice Interface
> **Where**: Primarily your PC (Python scripts + Whisper model)
> **Antigravity role**: Can help write the Python script and integration code

- Local Whisper model for speech-to-text
- Global hotkey to record
- Correction prompt before sending to agent
- Pipe corrected text to `controller.py --task`

### Step 5: Playwright Browser
> **Where**: Your PC (Python, replaces current httpx browser tool)
> **Antigravity role**: Can write the Playwright integration code

- Replace `browser.py` with full Playwright headless Chrome
- Enable JavaScript rendering, form filling, screenshots
- Add `pip install playwright` to requirements

### Step 6: Multi-Agent & UI
> **Where**: Your PC for backend, potentially a web UI
> **Antigravity role**: Can scaffold the web UI and backend

- Parallel agent execution
- Web-based chat interface (optional, beyond Obsidian)
- Agent memory across sessions (vector DB)

---

## What happens in Antigravity vs on your PC

| Task | Antigravity | Your PC |
|------|-------------|---------|
| Writing/editing Python code | Yes - primary tool | Run and test it |
| Editing prompts (`.md`) | Yes | View in Obsidian |
| Running the agent | No | `python -m agent.controller ...` |
| Testing LM Studio | No | LM Studio must be running locally |
| Browsing Obsidian | No | Open vault locally |
| Git operations | Yes (commits code changes) | Also from terminal |
| Installing pip packages | Yes (can run commands) | Also from terminal |
