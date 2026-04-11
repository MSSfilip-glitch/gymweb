# 🌉 Obsidian Shell Commands Bridge

To talk to your agents directly from Obsidian, follow these steps:

## 1. Install "Shell Commands" Plugin
- Open Obsidian **Settings** > **Community Plugins** > **Browse**.
- Search for **"Shell Commands"** and install/enable it.

## 2. Create the "Run Agent" Command
- Go to **Settings** > **Shell Commands**.
- Click **Add Command**.
- Use the following command string:
  ```powershell
  python -m agent.controller --project {{FOLDER_NAME}}
  ```
- *Optional*: Set the **Working Directory** to your workspace root (`E:\Users\Filip\ai-workspace`).

## 3. Configure Hotkey
- Go to Obsidian **Settings** > **Hotkeys**.
- Search for "Shell Commands" and find the command you just created.
- Assign a hotkey (e.g., `Ctrl+Enter` or `Alt+A`).

## 4. Usage
1. Open any project folder in Obsidian.
2. Open the `talk.md` file.
3. Write your request and **Save** the file (`Ctrl+S`).
4. Press your assigned hotkey.
5. The agent will run, execute your task, and clear `talk.md` automatically.
