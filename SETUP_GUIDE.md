# 🛠️ System Setup & Connection Guide

Follow these steps to finish setting up your Multi-Agent system.

## 1. Accessing n8n
Ensure your Docker container is running:
```bash
docker-compose up -d
```
Then visit: [http://localhost:5678](http://localhost:5678)

## 2. Importing Agent Workflows
We have provided two essential templates in `n8n_templates/`:
- `agent_tools.json`: Pre-configured nodes for file system, browser debugging, and Git.
- `agent_logic_starter.json`: A skeleton for the Multi-Agent loop (Architect -> Coder -> Tester).

**To Import:**
1. In n8n, click **Workflows** -> **New**.
2. Click the three dots (top right) -> **Import from file**.
3. Select the `.json` files from this project.

## 3. Connecting to Ollama (Local AI)
Since n8n is running in Docker and Ollama is running on your Mac, use the special Docker host address:

**Ollama Node Settings:**
- **Ollama URL**: `http://host.docker.internal:11434`
- **Model**: `llama3.1` (or `deepseek-coder`)

## 4. Configuring Agent Prompts
The agents use prompts stored in `agent_config/roles/`. In the `agent_logic_starter.json`, the nodes use the `read_file.js` tool to load these prompts dynamically.

- **Architect**: `architect.md`
- **Coder**: `coder.md`
- **Tester**: `tester.md`
- **Debugger**: `debugger.md`

## 5. First Run
1. Start the workflow in n8n.
2. Provide a prompt via the **Webhook** or a **Chat Trigger**.
3. Watch the `workspace/` folder for changes.

---
**Note on JSON Mode:** 
Ensure "JSON Mode" is enabled in your Ollama node settings (if using the latest n8n) to ensure the agents' output can be parsed by the workflow logic.
