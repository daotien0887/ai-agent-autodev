# 🤖 AI Multi-Agent AutoDev System (V2)

A comprehensive autonomous software development system using a Multi-Agent architecture, orchestrated by n8n and powered by a Hybrid AI model (Ollama + Cloud LLMs).

## 🚀 System Overview
This is more than just an AI chatbot; it is a complete **Agentic Workflow**. The system is capable of understanding requirements, planning, coding, self-testing, and autonomous debugging (Self-Healing) directly within a browser environment.

## 🏗️ Multi-Agent Architecture
The system consists of specialized "virtual personnel":

- **Architect (Brain)**: Analyzes the project and generates a 5-step implementation plan in JSON format.
- **Senior Coder (Doer)**: Directly executes code changes into the file system (`write_file`).
- **QA/Tester (Reviewer)**: Writes unit tests and runs automated test suites.
- **Browser Debugger (Eyes)**: Launches Puppeteer to capture console errors and take UI screenshots.
- **DevOps (Pipeline)**: Manages Git flow, branches, and deployment processes.
- **n8n (Orchestrator)**: Manages state transitions and handles the feedback loops.

## 🛠️ Tech Stack
- **Core Orchestration**: [n8n](https://n8n.io/)
- **AI Models**: 
  - **Local**: **Ollama** (Llama 3.1 / DeepSeek) for fast, cost-effective tasks.
  - **Cloud**: **Gemini 1.5 Pro / GPT-4o** for complex architectural reasoning.
- **Backend/Frontend**: Node.js (NestJS), Next.js (PWA), TailwindCSS.
- **Automation Tools**: 
  - `tools/browser`: Puppeteer (Web Debugging/Screenshots).
  - `tools/fs`: Safe Read/Write/List files.
  - `tools/git`: Auto Commit, Push, Checkout.
  - `tools/exec_command.js`: Run shell commands.
- **Communication Protocol**: JSON Mode (Strict structured data).

## 🔄 Development Workflow
1. **User Trigger**: Requirements received via Chat or Webhook.
2. **Planning**: The Architect scans the codebase and generates a structured Plan.
3. **Execution Loop**: 
   - Coder implements the features.
   - Tester runs unit tests.
   - **Debugger** inspects the UI for visual or console errors.
   - If an error is detected → AI automatically reads logs/screenshots and fixes the code (**Self-Correction**).
4. **Finalization**: Tasks are completed and pushed to GitHub via `gh cli`.

## ⚙️ Setup Instructions

### 1. Prerequisites
- Docker & Docker Compose
- Node.js & npm
- [Ollama](https://ollama.com/) (Running Llama3 or DeepSeek locally)
- [GitHub CLI (gh)](https://cli.github.com/)

### 2. Launch n8n with Docker
```bash
docker run -it --rm --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -v $(pwd)/workspace:/data/workspace \
  n8nio/n8n
```

### 4. Import n8n Templates
We have prepared a template with pre-configured Tool Nodes:
1. Open n8n at `http://localhost:5678`.
2. Create a new Workflow.
3. Import the file from your local path: `n8n_templates/agent_tools.json`.
4. Connect the nodes to your AI Agents.

## 📈 Featured "Senior Level" Capabilities
- **Hybrid AI Model Strategy**: Prioritizes local processing for data privacy and significant cost reduction.
- **Strict JSON Mode**: Ensures 100% reliable communication between Agents and workflows.
- **Vision-based Debugging**: Uses screenshots and DOM snippets to analyze UI failures.
- **Shared Workspace**: Agents interact with the same physical project directory, simulating a real-world development team.

---
*This project is designed to simulate a professional software engineering lifecycle driven by Agentic AI.*
