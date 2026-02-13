# Workflow Node Comparison: Before & After

## Flow 2: Code and Test - Node Changes

### ❌ BEFORE (Broken) - AI: Coder Specialist

```json
{
    "parameters": {
        "model": "qwen3-coder:480b-cloud",
        "options": {
            "systemPrompt": "You are a Coder. Identify the next 'To Do' task from TASKS.md and implement the code according to the architecture docs."
        }
    },
    "name": "AI: Coder Specialist",
    "type": "n8n-nodes-base.ollama",  ← DOES NOT EXIST!
    "typeVersion": 1,
    "position": [800, 300]
}
```

**Error:** `Unrecognized node type: n8n-nodes-base.ollama`

---

### ✅ AFTER (Fixed) - AI: Coder Specialist (HTTP)

```json
{
    "parameters": {
        "method": "POST",
        "url": "http://host.docker.internal:11434/api/generate",
        "sendBody": true,
        "bodyParameters": {
            "parameters": [
                {
                    "name": "model",
                    "value": "qwen3-coder:480b-cloud"
                },
                {
                    "name": "prompt",
                    "value": "=You are a Coder. Identify the next 'To Do' task from TASKS.md and implement the code according to the architecture docs.\n\nTasks:\n{{ $json.tasks }}\n\nArchitecture:\n{{ $json.architecture }}\n\nReturn a JSON response with the following structure:\n{\n  \"filename\": \"path/to/file.js\",\n  \"code\": \"the complete source code\"\n}"
                },
                {
                    "name": "stream",
                    "value": "false"
                }
            ]
        },
        "options": {}
    },
    "name": "AI: Coder Specialist (HTTP)",
    "type": "n8n-nodes-base.httpRequest",  ← WORKS!
    "typeVersion": 4.1,
    "position": [800, 300]
}
```

**Result:** ✅ Calls Ollama API directly, no errors!

---

## Complete Workflow Node Mapping

| Original Node | Type | Fixed Node | Type |
|--------------|------|------------|------|
| **Flow 1: Analytic Project Request** |
| AI: Memory Specialist | `ollama` ❌ | AI: Memory Specialist (HTTP) | `httpRequest` ✅ |
| AI: Architect | `ollama` ❌ | AI: Architect (HTTP) | `httpRequest` ✅ |
| **Flow 2: Code and Test** |
| AI: Coder Specialist | `ollama` ❌ | AI: Coder Specialist (HTTP) | `httpRequest` ✅ |
| AI: Tester Specialist | `ollama` ❌ | AI: Tester Specialist (HTTP) | `httpRequest` ✅ |
| **Flow 3: Local Deployment** |
| AI: Deploy Verification | `ollama` ❌ | AI: Deploy Verification (HTTP) | `httpRequest` ✅ |

---

## Key Differences

### 1. Node Type
- **Before:** `"type": "n8n-nodes-base.ollama"`
- **After:** `"type": "n8n-nodes-base.httpRequest"`

### 2. Configuration Structure
- **Before:** Simple `model` and `systemPrompt` parameters
- **After:** Full HTTP request with method, URL, and body parameters

### 3. Prompt Format
- **Before:** `"systemPrompt": "Your prompt here"`
- **After:** `"prompt": "=Your prompt with {{ expressions }}"`

### 4. Accessing Previous Data
- **Before:** Automatic context passing (if it existed)
- **After:** Explicit `{{ $json.field }}` expressions in prompt

### 5. Response Format
- **Before:** Direct AI response (if it worked)
- **After:** Ollama API response: `{ "response": "text", "done": true }`

---

## Why This Works

1. **`n8n-nodes-base.httpRequest` is a core n8n node** - always available
2. **Ollama API is simple REST API** - easy to call with HTTP requests
3. **`host.docker.internal:11434`** - allows n8n container to reach host Ollama
4. **No dependencies** - doesn't require community nodes or specific n8n versions
5. **Full control** - can customize all Ollama API parameters

---

## Testing the Fix

### Before Import - Check Ollama
```bash
# Verify Ollama is accessible
curl http://localhost:11434/api/tags

# Should return list of models including qwen3-coder:480b-cloud
```

### After Import - Test Workflow
```bash
# Test Flow 2 webhook
curl -X POST http://localhost:5678/webhook/execute-tasks

# Should trigger the workflow and generate code
```

### In n8n UI
1. Open Flow 2: Code and Test (Fixed)
2. Click on "AI: Coder Specialist (HTTP)"
3. You should see:
   - Method: POST
   - URL: http://host.docker.internal:11434/api/generate
   - Body parameters configured
4. Click "Test step" to verify it works

---

## Benefits of HTTP Request Approach

✅ **Works immediately** - no waiting for n8n to add Ollama support  
✅ **Version independent** - works on any n8n version  
✅ **Transparent** - can see exact API calls being made  
✅ **Flexible** - can customize all Ollama parameters  
✅ **Portable** - easy to adapt to other LLM APIs  

---

## Limitations

⚠️ **More verbose** - requires more configuration than a dedicated node  
⚠️ **Manual API formatting** - need to know Ollama API structure  
⚠️ **No built-in validation** - n8n won't validate Ollama-specific parameters  

---

**Conclusion:** The HTTP Request approach is a robust workaround that gives you full control over Ollama integration while avoiding the "Unrecognized node type" error. Once n8n adds official Ollama support (or you find the correct node type), you can always migrate these workflows later.
