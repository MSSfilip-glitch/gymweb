import subprocess
import os

class GitTool:
    """Git status, add and commit operations."""
    
    def __init__(self, workspace_root):
        self.root = os.path.abspath(workspace_root)

    def _run_git_command(self, args):
        """Runs a git command in the workspace root."""
        try:
            result = subprocess.run(
                ["git"] + args,
                cwd=self.root,
                capture_output=True,
                text=True,
                check=False  # Allow us to handle errors manually
            )
            return {
                "stdout": result.stdout,
                "stderr": result.stderr,
                "exit_code": result.returncode
            }
        except Exception as e:
            return {"error": str(e)}

    def git_status(self):
        """Show current git status."""
        return self._run_git_command(["status"])

    def git_add(self, paths=["."]):
        """Stage specific paths or all by default."""
        return self._run_git_command(["add"] + paths)

    def git_commit(self, message):
        """Commit staged changes as an AI."""
        # Ensure we always prefix AI commits for accountability
        ai_message = f"[AI] {message}"
        return self._run_git_command(["commit", "-m", ai_message])

    def git_diff(self, path=None):
        """Return the current diff of staged or all changes."""
        args = ["diff", "--cached"] if path is None else ["diff", "--cached", path]
        return self._run_git_command(args)
