#!/bin/bash
set -e

echo "🛑 Stopping all n8n containers..."
docker-compose down 2>/dev/null || true
docker stop $(docker ps -q --filter ancestor=n8nio/n8n:latest) 2>/dev/null || true
sleep 2

echo "📥 Importing workflow 1/3: flow1_analytic.json..."
docker-compose run --rm --entrypoint /bin/sh n8n -c "n8n import:workflow --input=/data/workspace/n8n_import/flow1_analytic.json"
echo "✅ Flow 1 imported!"

echo "📥 Importing workflow 2/3: flow2_execution.json..."
docker-compose run --rm --entrypoint /bin/sh n8n -c "n8n import:workflow --input=/data/workspace/n8n_import/flow2_execution.json"
echo "✅ Flow 2 imported!"

echo "📥 Importing workflow 3/3: flow3_deploy.json..."
docker-compose run --rm --entrypoint /bin/sh n8n -c "n8n import:workflow --input=/data/workspace/n8n_import/flow3_deploy.json"
echo "✅ Flow 3 imported!"

echo ""
echo "🚀 Starting n8n service..."
docker-compose up -d n8n

echo "⏳ Waiting for n8n to initialize (30s)..."
sleep 30

echo ""
echo "✅ All workflows imported successfully!"
echo "🌐 Access n8n at: http://localhost:5678"
echo ""
echo "🔥 To test Flow 1, run:"
echo "   curl -X POST http://localhost:5678/webhook/analyze-project"
