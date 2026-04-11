# Architecture Notes for Controller

The controller is an AI agent system that uses a three-role LLM pipeline (Planner, Executor, Verifier) with tool dispatch capabilities.

It processes user requests by having the Planner generate JSON action plans based on context and recent history.

Executor carries out these actions step-by-step using tools like file operations or code execution, while Verifier ensures safety before committing changes to git.