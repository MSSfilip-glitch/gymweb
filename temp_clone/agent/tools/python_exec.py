import subprocess
import os
import tempfile
import time

class PythonExecTool:
    """Safe execution of generated Python scripts in a subprocess."""
    
    def __init__(self, workspace_root=None):
        # We can optionally set a specific temp dir or use system default
        self.workspace_root = workspace_root

    def run_python(self, code, timeout=30):
        """Writes given code to a temporary file and runs it with a timeout."""
        with tempfile.NamedTemporaryFile(suffix=".py", delete=True, mode='w', encoding='utf-8') as tmp_file:
            tmp_file.write(code)
            tmp_file.flush()
            
            try:
                # Security note: This still runs python in a native shell.
                # However, isolating it to a subprocess ensures it doesn't crash the controller.
                # And since we're local, we rely on standard system permissions.
                
                start_time = time.time()
                result = subprocess.run(
                    ["python", tmp_file.name], 
                    capture_output=True, 
                    text=True, 
                    timeout=timeout,
                    cwd=self.workspace_root if self.workspace_root else os.getcwd()
                )
                duration = time.time() - start_time
                
                return {
                    "stdout": result.stdout,
                    "stderr": result.stderr,
                    "exit_code": result.returncode,
                    "duration_seconds": round(duration, 3)
                }
            except subprocess.TimeoutExpired:
                return {"error": f"Execution timed out after {timeout} seconds."}
            except Exception as e:
                return {"error": str(e)}
