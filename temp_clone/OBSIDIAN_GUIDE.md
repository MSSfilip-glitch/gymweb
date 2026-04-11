# 📓 Obsidian User Guide: Agentic Workspace

Welcome to your locally-backed agentic workspace. This guide helps you turn Obsidian into a command center for your AI agents.

## 1. Getting Started
1. **Open the Vault**: In Obsidian, click "Open folder as vault" and select `E:\Users\Filip\ai-workspace`.
2. **Explore Projects**: Browse the `projects/` folder. Each subfolder is a project with:
    - `summary.md`: The mission statement.
    - `todo.md`: The roadmap.
    - `decisions.md`: Append-only history of major choices.
    - `chat.log.md`: Automatically updated agent interaction history.
    - `talk.md`: Your "staging area" for requests.

## 2. Integrated "Shell Bridge" (Recommended)
You can trigger your agent directly from Obsidian without opening a terminal.

1. **Install Plugin**: Go to **Settings** > **Community Plugins** > **Search** > **"Shell Commands"**.
2. **Add Run Agent Command**:
    - Go to **Settings** > **Shell Commands** > **Add**.
    - **Command**: `python -m agent.controller --project {{FOLDER_NAME}}`
3. **Set Working Directory**: Ensure the "Working directory" is set to `E:\Users\Filip\ai-workspace`.
4. **Assign Hotkey**: Go to **Settings** > **Hotkeys** > Search for "Shell Commands" and assign `Ctrl+Alt+R`.

## 3. Recommended Plugins for UX
- **Dataview**: For creating cross-project dashboards.
- **Tasks**: For better management of items in `todo.md`.
- **Kanban**: For a visual view of your project pipelines.
- **Recent Files**: To quickly jump between active project notes.

## 4. The Loop
1. **Plan**: Open a project (e.g., `projects/game_dev/`).
2. **Input**: Write what you want in `talk.md` (e.g., "Create a file named ideas.md with 3 game hook ideas").
3. **Execute**: Press your hotkey (`Ctrl+Alt+R`).
4. **Observe**: Watch the terminal output (or Obsidian log) and see files update in real-time.
5. **Review**: Check `chat.log.md` for the agent's reasoning.

## 5. Security Note
Your agent can only **read** text files and **write** inside the `/projects` directory. It cannot modify its own core code or prompts without your direct intervention in Antigravity.
