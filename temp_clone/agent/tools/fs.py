import os
import shutil

class FilesystemTool:
    """Read, write, and list directories within authorized project folders."""
    
    def __init__(self, workspace_root, allowed_dirs=None):
        self.root = os.path.abspath(workspace_root)
        if allowed_dirs is None:
            self.allowed_dirs = ["projects", "agent"]
        else:
            self.allowed_dirs = allowed_dirs

    def _validate_path(self, path):
        """Ensure the path stays within allowed subdirectories."""
        abs_path = os.path.abspath(os.path.join(self.root, path))
        if not abs_path.startswith(self.root):
            raise Exception(f"Access denied: {path} is outside the workspace root.")
        
        rel_path = os.path.relpath(abs_path, self.root)
        top_dir = rel_path.split(os.sep)[0]
        
        if top_dir not in self.allowed_dirs:
            raise Exception(f"Access denied: directory '{top_dir}' is not authorized for tool access.")
        
        return abs_path

    def read_file(self, path):
        """Reads file content if it is a markdown file or in agent/prompts."""
        full_path = self._validate_path(path)
        if not os.path.isfile(full_path):
            return {"error": f"File not found: {path}"}
        
        # Security/Efficiency check: These files are already provided in the system context
        filename = os.path.basename(path)
        if filename in ["summary.md", "todo.md", "decisions.md"]:
             return {"error": f"Redundant read: '{filename}' is already provided in your context headers. Use the text from the ## context to plan your edit directly. Do not re-read."}

        # Security check: only allow reading text files (mostly markdown for now)
        if not (path.endswith(('.md', '.yaml', '.txt', '.py')) or 'prompts' in path):
            return {"error": "Unauthorized file type. Currently restricted to configuration, code and notes."}

        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                return {"content": f.read()}
        except Exception as e:
            return {"error": str(e)}

    def write_file(self, path, content):
        """Writes or overwrites file content."""
        full_path = self._validate_path(path)
        
        # Restriction: Agent only writes within projects/
        if not path.startswith("projects/"):
             return {"error": f"Permission denied: Agent can only write content inside the /projects folder. Path provided: '{path}'. Full relative path required, e.g., 'projects/my_project/file.md'."}

        try:
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return {"status": "success", "message": f"File written successfully: {path}"}
        except Exception as e:
            return {"error": str(e)}

    def append_file(self, path, content):
        """Appends to a file (useful for chat.log.md)."""
        full_path = self._validate_path(path)
        
        if not path.startswith("projects/"):
             return {"error": f"Permission denied: Agent can only append content inside the /projects folder. Path provided: '{path}'. Full relative path required, e.g., 'projects/my_project/chat.log.md'."}

        try:
            with open(full_path, 'a', encoding='utf-8') as f:
                f.write(content)
            return {"status": "success", "message": f"Appended content to: {path}"}
        except Exception as e:
            return {"error": str(e)}

    def list_dir(self, path=""):
        """Lists files and directories."""
        full_path = self._validate_path(path)
        try:
            items = os.listdir(full_path)
            result = []
            for item in items:
                item_path = os.path.join(full_path, item)
                result.append({
                    "name": item,
                    "is_dir": os.path.isdir(item_path),
                    "size": os.path.getsize(item_path) if not os.path.isdir(item_path) else None
                })
            return {"items": result}
        except Exception as e:
            return {"error": str(e)}
