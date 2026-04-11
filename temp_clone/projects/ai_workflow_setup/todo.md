# Actionable Items

## Phase 1 - COMPLETE
- [x] Initialize git repo for `ai-workspace` and commit initial folder state
- [x] Implement `agent/controller.py` (Planner -> Executor -> Verifier pipeline)
- [x] Implement base tools: `fs.py`, `git.py`, `browser.py`, `python_exec.py`
- [x] Implement tool registry with OpenAI-compatible function schemas
- [x] Write system prompts for Planner, Executor, Verifier roles
- [x] Install Python dependencies
- [x] Pass dry-run smoke test

## Phase 2 - Live Testing & Validation
- [x] Load a model in LM Studio and run live test against `ai_workflow_setup`
- [x] Verify Planner produces valid JSON action plans
- [x] Verify Executor correctly calls tools
- [x] Verify chat.log.md is updated after agent run
- [x] Verify git auto-commit with `[AI]` prefix works
- [ ] Open Obsidian vault and confirm rendered project views
- [ ] Iterate on prompts based on actual LLM output quality

## Phase 3 - Extended Capabilities (Future)
- [ ] Develop Voice Interface (Whisper speech-to-text, correction UI)
- [ ] Replace httpx browser with Playwright headless Chrome
- [ ] Implement AI suggesting commit messages for human commits
- [ ] Explore multi-agent parallelism
- [ ] Consider web-based chat UI beyond Obsidian
- [ ] Confirm Antigravity agent demonstrated critical mass.