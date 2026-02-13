# n8n Ollama Node Error - Analysis & Solutions

## 🔴 Error
```
Problem running workflow
Unrecognized node type: n8n-nodes-base.ollama
```

## 🔍 Root Cause

The workflows (`flow1_analytic.json`, `flow2_execution.json`, `flow3_deploy.json`) are using a node type `"n8n-nodes-base.ollama"` that **does not exist** in n8n version 2.1.4.

### Why This Happened
1. **Incorrect Node Type:**  The workflows specify `"type": "n8n-nodes-base.ollama"` which is not a valid node identifier
2. **Version Mismatch:** n8n 2.1.4 may use different node types for Ollama integration (likely via LangChain or a different identifier)
3. **Missing Community Node:** If this was intended as a community node, it was never installed

## ✅ Solutions

### Solution 1: Use HTTP Request Nodes (Recommended for current setup)

Replace the Ollama nodes with HTTP Request nodes that call the Ollama API directly.

**Pros:**
- Works immediately without additional installations
- Full control over API parameters
- No dependency on specific n8n versions

**Cons:**
- More verbose configuration
- Have to manually handle Ollama API format

**Implementation:**
I've created a fixed version: `workspace/n8n_import/flow1_analytic_fixed.json`

Key changes:
```json
{
    "name": "AI: Memory Specialist (HTTP)",
    "type": "n8n-nodes-base.httpRequest",
    "parameters": {
        "method": "POST",
        "url": "http://host.docker.internal:11434/api/generate",
        "sendBody": true,
        "bodyParameters": {
            "parameters": [
                { "name": "model", "value": "qwen3-coder:480b-cloud" },
                { "name": "prompt", "value": "Your prompt here" },
                { "name": "stream", "value": "false" }
            ]
        }
    }
}
```

### Solution 2: Upgrade n8n to Latest Version

Newer versions of n8n have better Ollama integration via LangChain nodes.

**Steps:**
```bash
# Update docker-compose.yml
services:
  n8n:
    image: n8nio/n8n:latest  # Already using latest

# Pull the newest version
docker-compose pull n8n
docker-compose up -d n8n
```

**Pros:**
- Access to latest features
- Better Ollama integration
- More AI/LLM nodes available

**Cons:**
- May have breaking changes
- Need to verify workflows still work

### Solution 3: Use LangChain Ollama Node

If available in n8n 2.1.4, use the proper LangChain Ollama integration:

```json
{
    "name": "AI: Memory Specialist",
    "type": "@n8n/n8n-nodes-langchain.lmChatOllama",
    "parameters": {
        "model": "qwen3-coder:480b-cloud",
        "baseUrl": "http://host.docker.internal:11434",
        "options": {
            "systemPrompt": "You are a Memory Specialist..."
        }
    }
}
```

**Note:** This requires checking if the LangChain nodes are available.

### Solution 4: Install Community Ollama Node (If Available)

Check npm registry for community Ollama nodes:

```bash
# Inside n8n container
docker exec -it n8n_agent_orchestrator sh
npm search n8n-nodes ollama

# If a package exists, install it via n8n UI:
# Settings -> Community Nodes -> Install
# Or manually:
cd /home/node/.n8n/nodes
npm install <package-name>
```

## 🔧 Recommended Action Plan

### Immediate Fix (Option A): Use Fixed Workflow

1. **Test the fixed workflow:**
   ```bash
   docker-compose down
   docker-compose run --rm --entrypoint /bin/sh n8n -c \
     "n8n import:workflow --input=/data/workspace/n8n_import/flow1_analytic_fixed.json"
   docker-compose up -d n8n
   ```

2. **Verify Ollama is running and accessible:**
   ```bash
   curl http://localhost:11434/api/tags
   ```

3. **Test the workflow webhook:**
   ```bash
   curl -X POST http://localhost:5678/webhook/analyze-project
   ```

### Long-term Fix (Option B): Update Workflows Properly

1. **Check what AI/LLM nodes are available in n8n UI:**
   - Log in to http://localhost:5678
   - Create a new workflow
   - Search for "Ollama" or "LLM" nodes
   - Note the correct node type

2. **Update all 3 workflows with the correct node types**

3. **Re-import the corrected workflows**

## 📋 Ollama API Reference

For HTTP Request approach, here's the Ollama API format:

### Generate Endpoint
```bash
POST http://localhost:11434/api/generate
Content-Type: application/json

{
  "model": "qwen3-coder:480b-cloud",
  "prompt": "Your prompt here",
  "stream": false,
  "options": {
    "temperature": 0.7,
    "top_p": 0.9
  }
}
```

### Response Format
```json
{
  "model": "qwen3-coder:480b-cloud",
  "created_at": "2026-02-12T05:47:00Z",
  "response": "The generated text response...",
  "done": true
}
```

Access the response in n8n: `{{ $json.response }}`

## ✅ Verification Checklist

- [ ] Ollama is running: `curl http://localhost:11434/api/tags`
- [ ] n8n can reach Ollama: Use `host.docker.internal:11434` in Docker
- [ ] Model is pulled: `docker exec ollama ollama list | grep qwen3-coder`
- [ ] Workflow imported successfully
- [ ] Webhook endpoint responds: `curl -X POST http://localhost:5678/webhook/analyze-project`
- [ ] Workflow execution completes without errors

## 🎯 Next Steps

1. **Choose your solution** (I recommend Solution 1 for immediate fix)
2. **Test the fixed workflow** 
3. **Update flow2 and flow3** similarly
4. **Document the correct node types** for future reference

Would you like me to:
- Create fixed versions of flow2 and flow3?
- Help test the Ollama connection?
- Check if there are alternative AI nodes available?
