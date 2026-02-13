#!/bin/bash
set -e

echo "🔧 Importing Fixed n8n Workflows (with HTTP Request nodes for Ollama)"
echo "======================================================================"
echo ""

echo "🛑 Stopping all n8n containers..."
docker-compose down 2>/dev/null || true
docker stop $(docker ps -q --filter ancestor=n8nio/n8n:latest) 2>/dev/null || true
sleep 2

echo ""
echo "📥 Importing Fixed Workflows..."
echo ""

echo "1️⃣  Importing Flow 1: Analytic Project Request (Fixed)..."
docker-compose run --rm --entrypoint /bin/sh n8n -c "n8n import:workflow --input=/data/workspace/n8n_import/flow1_analytic_fixed.json"
if [ $? -eq 0 ]; then
    echo "   ✅ Flow 1 imported successfully!"
else
    echo "   ❌ Flow 1 import failed"
fi

echo ""
echo "2️⃣  Importing Flow 2: Code and Test (Fixed)..."
docker-compose run --rm --entrypoint /bin/sh n8n -c "n8n import:workflow --input=/data/workspace/n8n_import/flow2_execution_fixed.json"
if [ $? -eq 0 ]; then
    echo "   ✅ Flow 2 imported successfully!"
else
    echo "   ❌ Flow 2 import failed"
fi

echo ""
echo "3️⃣  Importing Flow 3: Local Deployment (Fixed)..."
docker-compose run --rm --entrypoint /bin/sh n8n -c "n8n import:workflow --input=/data/workspace/n8n_import/flow3_deploy_fixed.json"
if [ $? -eq 0 ]; then
    echo "   ✅ Flow 3 imported successfully!"
else
    echo "   ❌ Flow 3 import failed"
fi

echo ""
echo "🚀 Starting n8n service..."
docker-compose up -d n8n

echo ""
echo "⏳ Waiting for n8n to initialize (30s)..."
sleep 30

echo ""
echo "🎉 All Fixed Workflows Imported!"
echo "================================"
echo ""
echo "🌐 Access n8n at: http://localhost:5678"
echo ""
echo "🔗 Webhook Endpoints:"
echo "   1. POST http://localhost:5678/webhook/analyze-project"
echo "   2. POST http://localhost:5678/webhook/execute-tasks"
echo "   3. POST http://localhost:5678/webhook/deploy-local"
echo ""
echo "🧪 Test Flow 1:"
echo "   curl -X POST http://localhost:5678/webhook/analyze-project"
echo ""
echo "✅ All workflows now use HTTP Request nodes to call Ollama directly!"
echo "   No more 'Unrecognized node type' errors!"
