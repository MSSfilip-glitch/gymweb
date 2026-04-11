# Immutable Decision Log

## Hardware
- **Decision**: RTX 5090 chosen over dual 5070 Ti.
- **Rationale**: VRAM was considered critical for LLM performance, balancing tokens/sec relative to human reading speed.

## Local LLM Setup
- **Decision**: Use LM Studio
- **Rationale**: Provides an optimal self-contained structure for local models. Torch is not required for the LM Studio workflow, though CUDA 13.1 compatibility was discussed.

## Workspace Architecture
- **Decision**: Git-trackable, directory-based structured memory.
- **Rationale**: Provides persistent state outside ephemeral chat. The AI will write directly to specific contract files (`summary.md`, `todo.md`, `decisions.md`, `chat.log.md`).

## Agent Controller Architecture (2026-02-26)
- **Decision**: Three-role LLM pipeline (Planner -> Executor -> Verifier) with tool dispatch.
- **Rationale**: Separation of concerns prevents a single LLM from both deciding and executing without review. Verifier acts as safety gate before git commits.

## Browser Tool - Phase 1
- **Decision**: Use httpx + BeautifulSoup instead of Playwright for Phase 1 browser tool.
- **Rationale**: Playwright adds significant installation complexity. httpx is lightweight and sufficient for fetching web pages and DuckDuckGo search. Playwright deferred to Phase 2.

## Agent Write Permissions
- **Decision**: Agent can only write files within `projects/` directory.
- **Rationale**: Prevents the agent from modifying its own code, prompts, or system files. Human retains full control over the agent's behavior.

## AI Commit Prefix
- **Decision**: All AI git commits are prefixed with `[AI]`.
- **Rationale**: Clear provenance in git log. Easy to filter human vs AI changes. Accountability.

## Development Tooling
- **Decision**: Use Antigravity for code writing/editing; use local terminal/LM Studio/Obsidian for testing.
- **Rationale**: Antigravity excels at writing and editing files but cannot run the agent or LM Studio. Local testing is required for end-to-end validation.
