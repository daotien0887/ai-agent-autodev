const fs = require('fs');
const http = require('http');
const path = require('path');

const WORKSPACE = '/data/workspace/banle';
const DOCS_DIR = path.join(WORKSPACE, 'docs');
// Reduced file set for testing logic
const FILES = ['FEATURES.md', 'DATABASE_ARCHITECTURE.md'];

async function callOllama(systemPrompt, userPrompt) {
    return new Promise((resolve, reject) => {
        const payload = {
            model: 'qwen3-coder:480b-cloud',
            system: systemPrompt,
            prompt: userPrompt,
            stream: false
        };
        const data = JSON.stringify(payload);

        const options = {
            hostname: 'host.docker.internal',
            port: 11434,
            path: '/api/generate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        console.log(`Payload size: ${(data.length / 1024).toFixed(2)} KB`);

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    return reject(`Error ${res.statusCode}: ${responseData}`);
                }
                try {
                    const json = JSON.parse(responseData);
                    resolve(json.response);
                } catch (e) {
                    reject('Failed to parse response: ' + responseData);
                }
            });
        });

        req.on('error', (e) => reject('Ollama Connection Failed: ' + e.message));
        req.write(data);
        req.end();
    });
}

async function runTest() {
    try {
        console.log('--- 🧠 STARTING PILOT TEST (REDUCED) ---');

        // 1. Read Role Prompts
        const memoryRole = fs.readFileSync('/data/agent_config/roles/memory_specialist.md', 'utf8');
        const architectRole = fs.readFileSync('/data/agent_config/roles/architect.md', 'utf8');

        // 2. Read Documentation (Partial)
        console.log('Reading project documentation (Partial: FEATURES + DB)...');
        let combinedDocs = '';
        for (const file of FILES) {
            const content = fs.readFileSync(path.join(DOCS_DIR, file), 'utf8');
            combinedDocs += `\n\n--- FILE: ${file} ---\n${content}`;
        }

        // 3. Phase 1: Memory Compression
        console.log('AI Step 1: Memory Specialist...');
        const compressedMemory = await callOllama(memoryRole, combinedDocs);
        console.log('Compressed Memory Sample:', compressedMemory.substring(0, 100) + '...');

        // 4. Phase 2: Architect Task Generation
        console.log('AI Step 2: Architect...');
        const architectOutput = await callOllama(architectRole, compressedMemory);

        console.log('--- ✅ SUCCESS ---');
        console.log('Outcome:', architectOutput.substring(0, 500));

        const outputPath = path.join(WORKSPACE, 'TASKS_TEST.md');
        fs.writeFileSync(outputPath, architectOutput);

    } catch (err) {
        console.error('--- ❌ PILOT TEST FAILED ---');
        console.error(err);
    }
}

runTest();
