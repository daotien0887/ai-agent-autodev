# n8n Workflow Import Guide

## 🔐 Authorization Note

n8n REST API requires authentication via login cookies or API keys. For workflow import, **using the Web UI is the recommended approach** rather than dealing with API authentication.

## ✅ Quick Import Steps

### Step 1: Access n8n
- **URL**: http://localhost:5678
- **Login**: Use your existing credentials (daotien0887@gmail.com)

### Step 2: Import Flow 2 (Code and Test)

1. In n8n UI, click **"Workflows"** in the left sidebar
2. Click the **"+" button** or **"Add Workflow"**
3. Click **menu (⋮)** → **"Import from File"**
4. Select file: **`workspace/n8n_import/flow2_execution_fixed.json`**
5. Click **"Save"** after import
6. Toggle the workflow to **"Active"** (switch in top right)

### Step 3: Import Flow 3 (Deployment)

1. Create another new workflow
2. Click **menu (⋮)** → **"Import from File"**
3. Select file: **`workspace/n8n_import/flow3_deploy_fixed.json`**
4. Click **"Save"** after import
5. Toggle the workflow to **"Active"**

### Step 4: Verify Webhooks

After import, check that all webhooks are registered:

```bash
# Test Flow 1 (already active)
curl -X POST http://localhost:5678/webhook/analyze-project \
  -H "Content-Type: application/json" \
  -d '{"test": "connection"}'

# Test Flow 2 (after import)
curl -X POST http://localhost:5678/webhook/execute-tasks \
  -H "Content-Type: application/json" \
  -d '{"test": "connection"}'

# Test Flow 3 (after import)
curl -X POST http://localhost:5678/webhook/deploy-local \
  -H "Content-Type: application/json" \
  -d '{"test": "connection"}'
```

## 🔧 Alternative: API Authentication (Advanced)

If you need to use the REST API for automation:

### Option 1: Using API Key (Recommended for automation)

1. In n8n UI, go to **Settings** → **API**
2. Generate an **API Key**
3. Use it in requests:
   ```bash
   curl -X GET http://localhost:5678/rest/workflows \
     -H "X-N8N-API-KEY: your_api_key_here"
   ```

### Option 2: Using Session Cookie

```bash
# Login and get cookie
COOKIE=$(curl -c - -X POST http://localhost:5678/rest/login \
  -H "Content-Type: application/json" \
  -d '{"email":"daotien0887@gmail.com","password":"your_password"}' \
  | grep -i n8n | awk '{print $7"="$8}')

# Use cookie for API calls
curl -X GET http://localhost:5678/rest/workflows \
  -H "Cookie: $COOKIE"
```

### Option 3: Disable Auth for Local Dev (Not Recommended)

Add to `docker-compose.yml`:
```yaml
environment:
  - N8N_BASIC_AUTH_ACTIVE=false
```

⚠️ **This exposes n8n without authentication - only for local testing!**

## 📊 Import Status

| Workflow | File | Status | Webhook |
|----------|------|--------|---------|
| Flow 1: Analytic | flow1_analytic_fixed.json | ✅ Imported | /webhook/analyze-project |
| Flow 2: Code & Test | flow2_execution_fixed.json | ⏳ Manual Import | /webhook/execute-tasks |
| Flow 3: Deployment | flow3_deploy_fixed.json | ⏳ Manual Import | /webhook/deploy-local |

## 🎯 Why Manual Import is Better

1. **No authentication complexity** - UI handles sessions
2. **Visual verification** - See all nodes and connections
3. **Immediate activation** - One-click to enable workflows
4. **Error detection** - UI shows node configuration issues
5. **Fast** - Takes only 2-3 minutes total

---

**Recommendation**: Use the Web UI import method. It's simpler, faster, and more reliable than API-based import.
