const fs = require('fs');
const path = require('path');

// Usage: node write_file.js <path> <content_base64>
// Content is passed as Base64 to handle special characters/newlines safely in command line args

const targetPath = process.argv[2];
const contentBase64 = process.argv[3];
const operation = process.argv[4] || 'overwrite'; // overwrite | append

if (!targetPath || !contentBase64) {
    console.log(JSON.stringify({ error: "Missing arguments: path and content (base64)" }));
    process.exit(1);
}

try {
    const content = Buffer.from(contentBase64, 'base64').toString('utf8');
    const dir = path.dirname(targetPath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (operation === 'append') {
        fs.appendFileSync(targetPath, content);
    } else {
        fs.writeFileSync(targetPath, content);
    }

    console.log(JSON.stringify({ status: "success", path: targetPath, size: content.length }));
} catch (err) {
    console.log(JSON.stringify({ error: err.message }));
}
