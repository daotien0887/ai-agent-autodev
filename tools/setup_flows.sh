#!/bin/bash
echo "🛑 Stopping n8n container to release database lock..."
docker-compose stop n8n

echo "📥 Importing Workflows (Analytic, Execution, Deploy)..."
# Override entrypoint to ensure we can run shell commands freely
# Using full path to n8n just in case, but usually n8n is enough if PATH is set.
# But better use `n8n` command if PATH is set.
# The `docker-entrypoint.sh` is causing the "Command not found" because it doesn't recognize our input.
docker-compose run --rm --entrypoint /bin/sh n8n -c "n8n import:workflow --input=/data/workspace/n8n_import/flow1_analytic.json"
docker-compose run --rm --entrypoint /bin/sh n8n -c "n8n import:workflow --input=/data/workspace/n8n_import/flow2_execution.json"
docker-compose run --rm --entrypoint /bin/sh n8n -c "n8n import:workflow --input=/data/workspace/n8n_import/flow3_deploy.json"

echo "✅ Import Complete!"
echo "🚀 Starting n8n container..."
docker-compose up -d n8n

echo "⏳ Waiting for n8n to be ready (20s)..."
sleep 20 

echo "🔥 Triggering Flow 1: Analyze Project..."
# Using the test webhook URL might be safer if not active via UI, but active: true is set so prod URL should work
curl -X POST http://localhost:5678/webhook/analyze-project

echo ""
echo "🎉 Done! Check workspace/banle/TASKS.md shortly."
