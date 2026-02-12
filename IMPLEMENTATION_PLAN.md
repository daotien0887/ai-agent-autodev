# 📋 Implementation Plan: AI Multi-Agent Coding System

This document tracks the step-by-step implementation progress of the system designed in `system_design_v2.md`.

**Current Status**: 🟡 In Progress
**Last Updated**: 2026-02-12

---

## Phase 1: Foundation & Environment Setup 🏗️
*Goal: Create a stable environment where Agents can live and work.*

- [x] **1.1. Directory Structure Setup**
    - Create `workspace/` (Shared volume for code).
    - Create `agent_config/` (Prompts & Rules).
    - Create `tools/` (Scripts).
- [x] **1.2. Docker Environment**
    - Create `docker-compose.yml` with n8n and volume mounts.
    - Validate n8n container startup.
    - Ensure n8n can read/write to `workspace/`.
- [x] **1.3. Version Control Initialization**
    - Initialize Git repository.
    - Push to GitHub (`ai-agent-autodev`).

## Phase 2: Agent "Brain" Configuration 🧠
*Goal: Define the personality, rules, and instructions for each Agent.*

- [x] **2.1. Global Rules**
    - Define `global_rules.md` (Security, coding standards, JSON mode).
- [x] **2.2. Role Templates**
    - Define `architect.md` (Planning logic).
    - Define `coder.md` (Implementation logic).
    - Define `tester.md` (QA logic).
    - Define `debugger.md` (Browser inspection logic).

## Phase 3: Tooling Infrastructure 🛠️
*Goal: Give Agents the "hands" to manipulate files and systems.*

- [x] **3.1. Browser Debugging Tools**
    - Create `tools/browser/inspect.js` (Puppeteer script).
- [x] **3.2. File System Tools**
    - Create `tools/fs/read_file.js` (Safe file reading).
    - Create `tools/fs/write_file.js` (Safe file writing).
    - Create `tools/fs/list_dir.js` (Directory tree listing).
    - Create `tools/exec_command.js` (Shell execution wrapper).
- [x] **3.3. Git Automation Tools**
    - Create `tools/git/commit.js` (Auto commit).
    - Create `tools/git/push.js` (Auto push).
    - Create `tools/git/checkout.js` (Branch management).

## Phase 4: n8n Workflow Orchestration 🔄
*Goal: Connect the components into a running logic loop.*

- [x] **4.1. Planning Workflow (Templates)**
    - Created `n8n_templates/agent_tools.json` containing core Tool nodes.
    - Setup "Execute Command" nodes mapped to `/data/tools/...`.
- [ ] **4.2. Execution Loop (Logic)**
    - *Action Required*: Import `agent_tools.json` into n8n and connect Logic nodes (IF/Switch).
- [ ] **4.3. Visual Debugging Integration**
    - Node: Trigger `tools/browser/inspect.js`.
    - Node: Vision AI analysis of screenshot.
    - Feedback loop to Coder if UI is broken.

## Phase 5: Testing & Validation ✅
*Goal: Verify the system works on a real task.*

- [x] **5.1. Tool Verification**
    - Verified `read_file.js`: Success.
    - Verified `list_dir.js`: Success.
    - Verified `write_file.js`: Success (via creation of test.txt).
- [ ] **5.2. Integration Test**
    - *Action Required*: Run n8n Docker container and test full loop.
- [ ] **5.3. End-to-End Pilot**
    - Input: "Create a simple To-Do List app with Next.js".
    - Verify: Plan created -> Code written -> Tests passed -> UI verified.

---

## 🛑 Blockers & Risks
- [ ] **Ollama JSON Mode**: Need to verify if local models (Llama3) strictly adhere to JSON schemas.
- [ ] **Docker Permissions**: Ensure the `node` user inside n8n container has write access to host directory `workspace/`.

## 📝 Notes
- Keep `STATE.json` in `workspace/` to manage workflow interruptions.
- Use `n8n-nodes-langchain` if standard HTTP requests are too complex.
