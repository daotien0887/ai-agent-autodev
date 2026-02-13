#!/bin/bash

echo "🔍 n8n Status Check"
echo "==================="
echo ""

# Check if n8n container is running
if docker ps | grep -q n8n_agent_orchestrator; then
    echo "✅ n8n container is RUNNING"
    
    # Check health endpoint
    if curl -s http://localhost:5678/healthz | grep -q "ok"; then
        echo "✅ n8n is HEALTHY"
    else
        echo "⚠️  n8n container running but not responding"
    fi
else
    echo "❌ n8n container is NOT running"
    echo "   Run: docker-compose up -d n8n"
    exit 1
fi

echo ""
echo "📊 Database Status:"
echo "   Location: ./n8n_data/database.sqlite"
if [ -f "n8n_data/database.sqlite" ]; then
    DB_SIZE=$(du -h n8n_data/database.sqlite | cut -f1)
    echo "   Size: $DB_SIZE"
    echo "✅ Database file exists"
else
    echo "❌ Database file not found"
fi

echo ""
echo "📁 Workflows in database folder:"
ls -1 n8n_data/workflows/*.json 2>/dev/null | while read file; do
    NAME=$(basename "$file")
    SIZE=$(du -h "$file" | cut -f1)
    echo "   - $NAME ($SIZE)"
done

echo ""
echo "🌐 Access n8n at: http://localhost:5678"
echo ""
echo "🔗 Webhook endpoints:"
echo "   - POST http://localhost:5678/webhook/analyze-project"
echo "   - POST http://localhost:5678/webhook/execute-task"
echo "   - POST http://localhost:5678/webhook/deploy-code"
