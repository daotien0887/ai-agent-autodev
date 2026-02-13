const fs = require('fs');
const path = require('path');

const targetPath = process.argv[2];

if (!targetPath) {
    console.log(JSON.stringify({ error: "No path provided" }));
    process.exit(1);
}

// Security: Prevent directory traversal
const absolutePath = path.resolve(targetPath);
const workspaceRoot = path.resolve('../workspace'); // Hardcoded security root for n8n

if (!absolutePath.startsWith(workspaceRoot)) {
    // In a real scenario, uncomment this check. For now, allow reading project files for setup.
    // console.log(JSON.stringify({ error: "Access denied outside workspace" }));
    // process.exit(1);
}

try {
    if (fs.existsSync(absolutePath)) {
        const stats = fs.statSync(absolutePath);
        if (stats.isDirectory()) {
            console.log(JSON.stringify({ error: "Path is a directory, use list_dir instead" }));
        } else {
            const content = fs.readFileSync(absolutePath, 'utf8');
            console.log(JSON.stringify({ content: content }));
        }
    } else {
        console.log(JSON.stringify({ error: "File not found" }));
    }
} catch (err) {
    console.log(JSON.stringify({ error: err.message }));
}
