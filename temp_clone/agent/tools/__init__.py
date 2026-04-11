"""
Tool registry for the AI Agent.

Each tool is a class exposing methods that the LLM can call.
The TOOL_REGISTRY maps action names to (tool_instance, method_name) pairs
so the controller can dispatch LLM-requested actions dynamically.
"""

from agent.tools.fs import FilesystemTool
from agent.tools.git import GitTool
from agent.tools.browser import BrowserTool
from agent.tools.python_exec import PythonExecTool


def build_tool_registry(workspace_root, config):
    """Build and return the tool registry dict based on config."""
    registry = {}
    enabled_tools = config.get("tools", {})

    if enabled_tools.get("filesystem") == "enabled":
        fs = FilesystemTool(workspace_root)
        registry["read_file"] = (fs, "read_file")
        registry["write_file"] = (fs, "write_file")
        registry["append_file"] = (fs, "append_file")
        registry["list_dir"] = (fs, "list_dir")

    if enabled_tools.get("git") == "enabled":
        git = GitTool(workspace_root)
        registry["git_status"] = (git, "git_status")
        registry["git_add"] = (git, "git_add")
        registry["git_commit"] = (git, "git_commit")
        registry["git_diff"] = (git, "git_diff")

    if enabled_tools.get("browser") == "enabled":
        browser = BrowserTool()
        registry["browse_url"] = (browser, "browse_url")
        registry["search_web"] = (browser, "search_web")

    if enabled_tools.get("python_exec") == "enabled":
        py_exec = PythonExecTool(workspace_root)
        registry["run_python"] = (py_exec, "run_python")

    return registry


def get_tool_schemas():
    """Return OpenAI-compatible function/tool definitions for all tools.

    These are sent to the LLM so it knows what actions are available.
    """
    return [
        {
            "type": "function",
            "function": {
                "name": "read_file",
                "description": "Read the contents of a file in the workspace.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "path": {"type": "string", "description": "Relative path from workspace root."}
                    },
                    "required": ["path"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "write_file",
                "description": "Write content to a file (creates or overwrites). Restricted to projects/ folder.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "path": {"type": "string", "description": "Relative path from workspace root (must start with projects/)."},
                        "content": {"type": "string", "description": "The full content to write."},
                    },
                    "required": ["path", "content"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "append_file",
                "description": "Append content to an existing file. Useful for chat.log.md and decisions.md.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "path": {"type": "string", "description": "Relative path from workspace root."},
                        "content": {"type": "string", "description": "Content to append."},
                    },
                    "required": ["path", "content"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "list_dir",
                "description": "List files and subdirectories in a directory.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "path": {"type": "string", "description": "Relative path from workspace root."}
                    },
                    "required": ["path"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "git_status",
                "description": "Show the current git status of the workspace.",
                "parameters": {"type": "object", "properties": {}},
            },
        },
        {
            "type": "function",
            "function": {
                "name": "git_add",
                "description": "Stage files for commit.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "paths": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "List of paths to stage. Defaults to ['.'] (all).",
                        }
                    },
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "git_commit",
                "description": "Commit staged changes with a message. Message will be auto-prefixed with [AI].",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "message": {"type": "string", "description": "Commit message."}
                    },
                    "required": ["message"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "browse_url",
                "description": "Fetch and read the text content of a web page.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "url": {"type": "string", "description": "The URL to fetch."}
                    },
                    "required": ["url"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "search_web",
                "description": "Search the web via DuckDuckGo and return top results.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "Search query."}
                    },
                    "required": ["query"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "run_python",
                "description": "Execute a Python script in a sandboxed subprocess with a 30s timeout.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "code": {"type": "string", "description": "Python source code to execute."}
                    },
                    "required": ["code"],
                },
            },
        },
    ]
