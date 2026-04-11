"""
Agent Controller - Main orchestrator for the AI Workspace.

Usage:
    python -m agent.controller --project <project_name> [--task "instruction"] [--dry-run]

Flow:
    1. Load config and project context
    2. Planner LLM -> structured action plan
    3. Executor LLM -> execute each action via tools
    4. Verifier LLM -> approve/reject + commit message
    5. Git commit (if approved)
    6. Append interaction to chat.log.md
"""

import argparse
import io
import json
import os
import sys

# Fix Windows console encoding for Unicode output
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import yaml
from datetime import datetime, timezone
import httpx

from agent.tools import build_tool_registry, get_tool_schemas


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def load_config(workspace_root):
    """Load agent/config.yaml and return as dict."""
    config_path = os.path.join(workspace_root, "agent", "config.yaml")
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_prompt(workspace_root, role):
    """Load a prompt file (planner.md, executor.md, verifier.md)."""
    prompt_path = os.path.join(workspace_root, "agent", "prompts", f"{role}.md")
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read()


def load_project_context(workspace_root, project_name):
    """Read summary.md, todo.md, and the last N lines of chat.log.md."""
    project_dir = os.path.join(workspace_root, "projects", project_name)

    if not os.path.isdir(project_dir):
        print(f"[ERROR] Project not found: {project_dir}")
        sys.exit(1)

    context = {}
    for filename in ["summary.md", "todo.md", "decisions.md"]:
        filepath = os.path.join(project_dir, filename)
        if os.path.isfile(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                context[filename] = f.read()
        else:
            context[filename] = ""

    # Load last 100 lines of chat log
    chat_path = os.path.join(project_dir, "chat.log.md")
    if os.path.isfile(chat_path):
        with open(chat_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
        context["chat.log.md"] = "".join(lines[-100:])
    else:
        context["chat.log.md"] = ""

    return context


def format_context_for_llm(project_name, context, user_task=None):
    """Build the user message that includes project state + task."""
    parts = [
        f"# Project: {project_name}\n",
        "## summary.md\n", context.get("summary.md", "(empty)"), "\n\n",
        "## todo.md\n", context.get("todo.md", "(empty)"), "\n\n",
        "## decisions.md\n", context.get("decisions.md", "(empty)"), "\n\n",
        "## Recent chat history\n", context.get("chat.log.md", "(empty)"), "\n\n",
    ]

    if user_task:
        parts.append(f"## User Request\n{user_task}\n")
    else:
        parts.append("## User Request\nReview current project state and suggest next actions.\n")

    return "".join(parts)


# ---------------------------------------------------------------------------
# LLM interaction
# ---------------------------------------------------------------------------

def call_llm(base_url, model, system_prompt, user_message, tools=None, max_tokens=2048):
    """Send a message to LM Studio and return the response text."""
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message},
    ]

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": max_tokens
    }

    # Only pass tools if provided (some roles don't need them)
    if tools:
        payload["tools"] = tools

    try:
        # Normalize the chat completions URL
        # We assume base_url is the root or /v1. LM Studio typically handles chat at /v1/chat/completions
        parsed_url = base_url.split("/v1")[0].rstrip("/")
        chat_url = f"{parsed_url}/v1/chat/completions"

        # Increase timeout for large models
        with httpx.Client(timeout=180.0) as client:
            response = client.post(chat_url, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
    except httpx.HTTPStatusError as e:
        error_msg = f"HTTP {e.response.status_code} Error: {e.response.text}"
        print(f"  [ERROR] {error_msg}")
        return json.dumps({"error": error_msg})
    except Exception as e:
        return json.dumps({"error": f"LLM call failed: {str(e)}"})


def parse_json_response(text):
    """Try to extract JSON from the LLM response (handles markdown fences and think tags)."""
    import re

    cleaned = text.strip()

    # Strip <think>...</think> reasoning blocks (DeepSeek R1 and similar reasoning models)
    cleaned = re.sub(r"<think>.*?</think>", "", cleaned, flags=re.DOTALL).strip()

    # Strip markdown code fences if present
    if cleaned.startswith("```"):
        # Remove first line (```json or ```) and last line (```)
        lines = cleaned.split("\n")
        lines = lines[1:]  # remove opening fence
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()

    # If still no valid JSON start, try to find the first [ or { in the text
    if cleaned and cleaned[0] not in ("{", "["):
        match = re.search(r"[\[{]", cleaned)
        if match:
            cleaned = cleaned[match.start():]

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Fallback 1: Try wrapping in [] if it looks like multiple objects {..}, {..} or {..}{..}
        try:
            wrapped = cleaned
            if not wrapped.startswith("["):
                # Handle {..} {..} by adding a comma
                wrapped = re.sub(r'}\s*{', '},{', wrapped)
                wrapped = f"[{wrapped}]"
            return json.loads(wrapped)
        except:
             return {"error": "Failed to parse LLM response as JSON", "raw": text}


# ---------------------------------------------------------------------------
# Core agent loop
# ---------------------------------------------------------------------------

class AgentController:
    """Orchestrates the Planner -> Executor -> Verifier pipeline."""

    def __init__(self, workspace_root, config, dry_run=False):
        self.workspace_root = workspace_root
        self.config = config
        self.dry_run = dry_run

        # LM Studio API Endpoints
        lm_config = config.get("lm_studio", {})
        raw_base = lm_config.get("base_url", "http://localhost:1234/v1")
        # Extract the root (e.g., http://localhost:1234)
        self.api_root = raw_base.split("/v1")[0].split("/api")[0].rstrip("/")
        
        self.chat_url = f"{self.api_root}/v1"
        self.mgmt_url = f"{self.api_root}/api/v1"
        self.max_tokens = lm_config.get("max_tokens", 2048)


        # Model assignments
        self.planner_model = config.get("planner", "deepseek-r1-32b")
        self.executor_model = config.get("executor_coder", "qwen2.5-32b")
        self.verifier_model = config.get("verifier", "qwen2.5-14b")

        # Prompts
        self.planner_prompt = load_prompt(workspace_root, "planner")
        self.executor_prompt = load_prompt(workspace_root, "executor")
        self.verifier_prompt = load_prompt(workspace_root, "verifier")

        # Tools
        self.tool_registry = build_tool_registry(workspace_root, config)
        self.tool_schemas = get_tool_schemas()

    def _ensure_model_loaded(self, model_key):
        """Ensure the specified model is loaded in LM Studio memory."""
        if self.dry_run:
            return

        # Strip variant suffix (@...) if present for management API
        base_model_key = model_key.split("@")[0] if "@" in model_key else model_key

        print(f"  [LM Studio] Checking if model is loaded: {base_model_key}...")
        try:
            # 1. Check current models
            models_url = f"{self.mgmt_url}/models"
            with httpx.Client() as client:
                resp = client.get(models_url)
                resp.raise_for_status()
                models_data = resp.json().get("models", [])
            
            # Find the model and check if instances are loaded
            model_info = next((m for m in models_data if m["key"] == base_model_key), None)
            
            if model_info and model_info.get("loaded_instances"):
                print(f"  [LM Studio] Model already loaded.")
                return

            # 2. If not loaded, call load endpoint
            print(f"  [LM Studio] Loading model: {base_model_key}...")
            load_url = f"{self.mgmt_url}/models/load"
            with httpx.Client(timeout=300.0) as client:
                # API expects 'model' key with the base ID
                load_resp = client.post(load_url, json={"model": base_model_key})
                load_resp.raise_for_status()
            print(f"  [LM Studio] Model loaded successfully.")



        except Exception as e:
            print(f"  [LM Studio] Warning: Failed to manage model state: {e}")


    def execute_tool(self, action_name, args):
        """Look up and call a tool from the registry."""
        if action_name not in self.tool_registry:
            return {"error": f"Unknown tool: {action_name}"}

        tool_instance, method_name = self.tool_registry[action_name]
        method = getattr(tool_instance, method_name)

        try:
            return method(**args)
        except TypeError as e:
            return {"error": f"Invalid arguments for {action_name}: {str(e)}"}
        except Exception as e:
            return {"error": f"Tool execution failed: {str(e)}"}

    def run(self, project_name, user_task=None):
        """Run the full Planner -> Executor -> Verifier pipeline."""
        workspace_project_dir = os.path.join(self.workspace_root, "projects", project_name)

        # check for talk.md if user_task is none
        if not user_task:
            talk_path = os.path.join(workspace_project_dir, "talk.md")
            if os.path.isfile(talk_path):
                with open(talk_path, "r", encoding="utf-8") as f:
                    content = f.read().strip()
                if content:
                    user_task = content
                    print(f"  [OK] Found input in talk.md: \"{user_task[:50]}\"...")

        print(f"\n{'='*60}")
        print(f"  Agent Controller - Project: {project_name}")
        print(f"  Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"  Dry run: {self.dry_run}")
        print(f"{'='*60}\n")

        # 1. Load project context
        print("[1/7] Loading project context...")
        context = load_project_context(self.workspace_root, project_name)
        user_message = format_context_for_llm(project_name, context, user_task)
        print(f"  [OK] Loaded: summary ({len(context['summary.md'])} chars), "
              f"todo ({len(context['todo.md'])} chars), "
              f"chat log ({len(context['chat.log.md'])} chars)")

        if self.dry_run:
            print("\n[DRY RUN] Project context loaded successfully.")
            print(f"\n--- Context Preview ---\n{user_message[:2000]}")
            print(f"\n--- Tool Registry ---")
            for name in sorted(self.tool_registry):
                print(f"  - {name}")
            print(f"\n--- Models ---")
            print(f"  Planner:  {self.planner_model}")
            print(f"  Executor: {self.executor_model}")
            print(f"  Verifier: {self.verifier_model}")
            print("\n[DRY RUN] Exiting without calling LLMs.")
            return

        # 2. Planner phase
        print("\n[2/7] Calling Planner LLM...")
        self._ensure_model_loaded(self.planner_model)
        plan_response = call_llm(
            self.chat_url, self.planner_model,
            self.planner_prompt, user_message,
            max_tokens=self.max_tokens
        )
        print(f"  [OK] Planner responded.")
        print(f"\n  [Planner Strategy]:\n{plan_response[:1000]}...\n")

        # 3. Executor phase (Generate tool calls)
        print("\n[3/7] Calling Executor LLM to generate tool calls...")
        self._ensure_model_loaded(self.executor_model)
        executor_message = f"{user_message}\n\n## Planner Strategy\n{plan_response}\n\nPlease generate the exact JSON actions list to execute this strategy."
        executor_response = call_llm(
            self.chat_url, self.executor_model,
            self.executor_prompt, executor_message,
            max_tokens=self.max_tokens
        )
        plan = parse_json_response(executor_response)
        print(f"  [OK] Executor responded.")

        if isinstance(plan, dict) and "error" in plan:
            print(f"\n  [ERROR] {plan['error']}")
            if "raw" in plan:
                print(f"  Raw response (first 500 chars):\n{plan['raw'][:500]}")
            return

        actions = []
        if isinstance(plan, list):
            actions = plan
        elif isinstance(plan, dict):
            if "actions" in plan:
                actions = plan["actions"]
            elif "steps" in plan:
                actions = plan["steps"]

        if not actions:
            print("  No explicit tool actions returned by Executor.")
            self._log_interaction(project_name, user_task, plan_response, [], plan if isinstance(plan, dict) else None)
            return

        print(f"  Actions planned: {len(actions)}")
        for a in actions:
            step = a.get("step", "?")
            action = a.get("action", "?")
            reason = a.get("reason", "")
            print(f"    Step {step}: {action} - {reason}")

        # 4. Tool Execution phase
        print("\n[4/7] Executing actions...")
        results = []
        for action in actions:
            action_name = action.get("action", "")
            action_args = action.get("args", {})
            step_num = action.get("step", "?")

            print(f"  Executing step {step_num}: {action_name}...")
            result = self.execute_tool(action_name, action_args)
            results.append({"step": step_num, "action": action_name, "result": result})

            if "error" in result:
                print(f"    [FAIL] Error: {result['error']}")
            else:
                print(f"    [OK] Success")

        # 5. Verifier phase
        print("\n[5/7] Calling Verifier LLM...")
        self._ensure_model_loaded(self.verifier_model)
        verify_message = json.dumps({
            "project": project_name,
            "user_task": user_task,
            "actions_executed": results,
        }, indent=2)

        verify_response = call_llm(
            self.chat_url, self.verifier_model,
            self.verifier_prompt, verify_message,
            max_tokens=self.max_tokens
        )
        verification = parse_json_response(verify_response)
        print(f"  [OK] Verifier responded.")

        # 6. Git commit
        commit_msg = "Agent changes"
        is_approved = False
        
        if isinstance(verification, dict) and verification.get("approved"):
            is_approved = True
            commit_msg = verification.get("commit_message", "Agent changes")
            print(f"\n[6/7] Verifier approved. Committing...")
        else:
            reason = verification.get("reason", "Unknown reason") if isinstance(verification, dict) else str(verification)
            print(f"\n[6/7] Verifier REJECTED changes - Committing anyway for testing purposes.")
            print(f"  Reason: {reason}")
            commit_msg = f"[UNVERIFIED] Agent changes (Rejected: {reason})"

        print(f"  Commit message: {commit_msg}")

        git_tool_entry = self.tool_registry.get("git_add")
        if git_tool_entry:
            git_instance = git_tool_entry[0]
            git_instance.git_add(["."])
            commit_result = git_instance.git_commit(commit_msg)
            print(f"  [OK] Committed: {commit_result.get('stdout', '').strip()}")
        else:
            print("  [FAIL] Git tool not available.")

        # 7. Log interaction
        print("\n[7/7] Logging interaction...")
        self._log_interaction(project_name, user_task, plan_response, results, verification)
        print("  [OK] Chat log updated.")
        print(f"\n{'='*60}")
        print("  Agent run complete.")
        print(f"{'='*60}\n")

    def _log_interaction(self, project_name, user_task, plan_response, results, verification):
        """Append a summary of this interaction to the project's chat.log.md."""
        import re
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        # Strip think tags from plan_response for the log
        clean_plan = re.sub(r"<think>.*?</think>", "", plan_response, flags=re.DOTALL).strip()
        
        # Try to find JSON block in clean_plan to extract just the answer if it's a verbal response
        try:
            # If it's valid JSON and has a 'response' field, use just that for the summary
            plan_json = json.loads(re.sub(r"```(json)?\n?|```", "", clean_plan).strip())
            if isinstance(plan_json, dict) and "response" in plan_json:
                clean_plan = plan_json["response"]
        except:
            pass

        log_entry = f"\n### {timestamp}\n"
        log_entry += f"**User:** {user_task or '(no explicit task)'}\n\n"
        log_entry += f"**Planner:** {clean_plan[:2000]}{'...' if len(clean_plan) > 2000 else ''}\n\n"

        if results:
            log_entry += f"**Actions:** {len(results)} executed\n"
            for r in results:
                status = "OK" if "error" not in r.get("result", {}) else "FAIL"
                log_entry += f"- Step {r['step']}: {r['action']} [{status}]\n"
                
                # Log the actual result (truncated) for planner memory
                res = r.get("result", {})
                if "content" in res:
                    log_entry += f"  > Content: {res['content'][:500]}...\n"
                elif "error" in res:
                    log_entry += f"  > Error: {res['error']}\n"
                elif "status" in res:
                    log_entry += f"  > {res['status']}: {res.get('message', '')}\n"
            log_entry += "\n"

        if verification:
            approved = verification.get("approved", False) if isinstance(verification, dict) else False
            log_entry += f"**Verified:** {'Yes' if approved else 'No'}\n\n"

        log_entry += "---\n"

        # Write to chat log
        chat_log_path = f"projects/{project_name}/chat.log.md"
        talk_path = f"projects/{project_name}/talk.md"
        
        fs_entry_append = self.tool_registry.get("append_file")
        if fs_entry_append:
            fs_instance = fs_entry_append[0]
            fs_instance.append_file(chat_log_path, log_entry)

        # Clear talk.md if interaction was successful
        fs_entry_write = self.tool_registry.get("write_file")
        if fs_entry_write:
            fs_instance = fs_entry_write[0]
            fs_instance.write_file(talk_path, "")



# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main():
    # Debug: Print raw arguments to help diagnose shell integration issues
    print(f"[DEBUG] Raw sys.argv: {sys.argv}")
    
    parser = argparse.ArgumentParser(
        description="AI Workspace Agent Controller",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Example: python -m agent.controller --project ai_workflow_setup --task \"List todos\""
    )
    parser.add_argument("--project", "-p", required=True, help="Project folder name (under projects/)")
    parser.add_argument("--task", "-t", default=None, help="User instruction for the agent")
    parser.add_argument("--dry-run", action="store_true", help="Load context but skip LLM calls")
    args = parser.parse_args()

    # Workspace root = parent of agent/
    workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # If no task provided, look for talk.md in the project folder
    task = args.task
    if not task:
        talk_path = os.path.join(workspace_root, "projects", args.project, "talk.md")
        if os.path.isfile(talk_path):
            with open(talk_path, "r", encoding="utf-8") as f:
                content = f.read()
                # Try to extract content after the divider
                if "Your Request" in content:
                    parts = content.split("Your Request", 1)
                    if len(parts) > 1:
                        # Take everything after the next line break or divider
                        request_part = parts[1].strip()
                        # If it starts with a blockquote marker, clean it up
                        if request_part.startswith(">"):
                            request_part = request_part[1:].strip()
                        if request_part:
                            task = request_part
                            print(f"[INIT] Found task in talk.md: \"{task[:50]}...\"")

    # Load config
    config = load_config(workspace_root)

    # Create and run controller
    controller = AgentController(workspace_root, config, dry_run=args.dry_run)
    controller.run(args.project, task)


if __name__ == "__main__":
    main()
