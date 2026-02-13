#!/bin/bash
# Force cleanup to remove any hanging containers holding locks
echo "STOPPING..."
docker-compose down

echo "ENSURING CLEANUP..."
docker ps -a -q --filter "name=n8n" | xargs -r docker rm -f

echo "IMPORTING..."
# Using the n8n entrypoint directly to avoid shell issues
# Mapping files directly into the container
# Using node user inside container

docker run --rm \
  -v "$(pwd)/n8n_data:/home/node/.n8n" \
  -v "$(pwd)/n8n_templates:/templates" \
  --user node \
  n8nio/n8n:latest \
  n8n import:workflow --input=/templates/flow1_analytic.json

docker run --rm \
  -v "$(pwd)/n8n_data:/home/node/.n8n" \
  -v "$(pwd)/n8n_templates:/templates" \
  --user node \
  n8nio/n8n:latest \
  n8n import:workflow --input=/templates/flow2_execution.json

docker run --rm \
  -v "$(pwd)/n8n_data:/home/node/.n8n" \
  -v "$(pwd)/n8n_templates:/templates" \
  --user node \
  n8nio/n8n:latest \
  n8n import:workflow --input=/templates/flow3_deploy.json

echo "RESTARTING..."
docker-compose up -d

echo "WAITING..."
sleep 20

echo "TRIGGERING..."
curl -X POST http://localhost:5678/webhook/analyze-project
