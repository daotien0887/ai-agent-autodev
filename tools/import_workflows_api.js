#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const http = require('http');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYTM5MzU5Yy1mNjQ0LTRjZGYtOGUyOS1iODIxMTA2NDQ1M2EiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzcwOTQ4MTU1fQ.ABLfIf43GptW-vS1b3tdMTUTMt8WYA4g6Qfd0Xi8etc';
const N8N_URL = 'http://localhost:5678';

const WORKFLOWS = [
    'workspace/n8n_import/flow2_execution_fixed.json',
    'workspace/n8n_import/flow3_deploy_fixed.json'
];

async function importWorkflow(filepath) {
    return new Promise((resolve, reject) => {
        // Read the workflow file
        const workflowData = JSON.parse(fs.readFileSync(filepath, 'utf8'));

        // Remove read-only fields that cause errors on import
        delete workflowData.active;
        delete workflowData.id;

        // Ensure required fields
        if (!workflowData.settings) {
            workflowData.settings = {
                executionOrder: 'v1'
            };
        }

        const postData = JSON.stringify(workflowData);

        const options = {
            hostname: 'localhost',
            port: 5678,
            path: '/api/v1/workflows',
            method: 'POST',
            headers: {
                'X-N8N-API-KEY': API_KEY,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    const result = JSON.parse(data);
                    resolve(result);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

async function activateWorkflow(workflowId) {
    return new Promise((resolve, reject) => {
        const patchData = JSON.stringify({ active: true });

        const options = {
            hostname: 'localhost',
            port: 5678,
            path: `/api/v1/workflows/${workflowId}`,
            method: 'PATCH',
            headers: {
                'X-N8N-API-KEY': API_KEY,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(patchData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(patchData);
        req.end();
    });
}

async function main() {
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║     📥 n8n Workflow Auto-Import with API Key        ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');

    for (const filepath of WORKFLOWS) {
        try {
            const filename = filepath.split('/').pop();
            console.log(`📦 Importing: ${filename}`);

            const result = await importWorkflow(filepath);
            console.log(`   ✅ Imported: ${result.name}`);
            console.log(`   📌 ID: ${result.id}`);

            // Activate the workflow
            await activateWorkflow(result.id);
            console.log(`   🟢 Activated!\n`);

        } catch (error) {
            console.error(`   ❌ Error: ${error.message}\n`);
        }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Import Complete!\n');
    console.log('Test webhooks:');
    console.log('  curl -X POST http://localhost:5678/webhook/execute-tasks');
    console.log('  curl -X POST http://localhost:5678/webhook/deploy-local');
}

main().catch(console.error);
