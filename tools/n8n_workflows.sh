#!/bin/bash
# n8n Workflow Management Script
# Uses environment variables from .env file

set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ .env file not found"
    exit 1
fi

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to list all workflows
list_workflows() {
    echo "📋 Listing all workflows..."
    curl -s -X GET "${N8N_URL}/api/v1/workflows" \
        -H "X-N8N-API-KEY: ${N8N_API_KEY}" \
        | jq -r '.data[] | "\(.id) | \(.name) | Active: \(.active)"' \
        | column -t -s '|'
}

# Function to activate a workflow
activate_workflow() {
    local workflow_id=$1
    echo "🟢 Activating workflow: ${workflow_id}..."
    
    # First get the workflow details
    workflow=$(curl -s -X GET "${N8N_URL}/api/v1/workflows/${workflow_id}" \
        -H "X-N8N-API-KEY: ${N8N_API_KEY}")
    
    # Update it with active=true
    echo "$workflow" | jq '.active = true' | \
    curl -s -X PUT "${N8N_URL}/api/v1/workflows/${workflow_id}" \
        -H "X-N8N-API-KEY: ${N8N_API_KEY}" \
        -H "Content-Type: application/json" \
        -d @- > /dev/null
    
    echo "   ✅ Activated!"
}

# Function to deactivate a workflow
deactivate_workflow() {
    local workflow_id=$1
    echo "🔴 Deactivating workflow: ${workflow_id}..."
    
    workflow=$(curl -s -X GET "${N8N_URL}/api/v1/workflows/${workflow_id}" \
        -H "X-N8N-API-KEY: ${N8N_API_KEY}")
    
    echo "$workflow" | jq '.active = false' | \
    curl -s -X PUT "${N8N_URL}/api/v1/workflows/${workflow_id}" \
        -H "X-N8N-API-KEY: ${N8N_API_KEY}" \
        -H "Content-Type: application/json" \
        -d @- > /dev/null
    
    echo "   ✅ Deactivated!"
}

# Function to activate all workflows
activate_all() {
    echo "🟢 Activating all workflows..."
    workflow_ids=$(curl -s -X GET "${N8N_URL}/api/v1/workflows" \
        -H "X-N8N-API-KEY: ${N8N_API_KEY}" \
        | jq -r '.data[].id')
    
    for id in $workflow_ids; do
        activate_workflow "$id"
    done
}

# Function to test webhooks
test_webhooks() {
    echo ""
    echo "🧪 Testing workflow webhooks..."
    echo ""
    
    echo "1. Testing Flow 1: Analytic Project Request"
    response=$(curl -s -X POST ${N8N_URL}/webhook/analyze-project \
        -H "Content-Type: application/json" \
        -d '{"test": "connection"}')
    echo "   Response: $response"
    
    echo ""
    echo "2. Testing Flow 2: Code and Test"
    response=$(curl -s -X POST ${N8N_URL}/webhook/execute-tasks \
        -H "Content-Type: application/json" \
        -d '{"test": "connection"}')
    echo "   Response: $response"
    
    echo ""
    echo "3. Testing Flow 3: Deployment"
    response=$(curl -s -X POST ${N8N_URL}/webhook/deploy-local \
        -H "Content-Type: application/json" \
        -d '{"test": "connection"}')
    echo "   Response: $response"
}

# Main menu
case "${1:-list}" in
    list)
        list_workflows
        ;;
    activate)
        if [ -z "$2" ]; then
            echo "Usage: $0 activate <workflow_id>"
            exit 1
        fi
        activate_workflow "$2"
        ;;
    deactivate)
        if [ -z "$2" ]; then
            echo "Usage: $0 deactivate <workflow_id>"
            exit 1
        fi
        deactivate_workflow "$2"
        ;;
    activate-all)
        activate_all
        ;;
    test)
        test_webhooks
        ;;
    *)
        echo "Usage: $0 {list|activate <id>|deactivate <id>|activate-all|test}"
        echo ""
        echo "Commands:"
        echo "  list          - List all workflows"
        echo "  activate      - Activate a specific workflow"
        echo "  deactivate    - Deactivate a specific workflow"
        echo "  activate-all  - Activate all workflows"
        echo "  test          - Test all webhook endpoints"
        exit 1
        ;;
esac
