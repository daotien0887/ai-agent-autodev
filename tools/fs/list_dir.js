const fs = require('fs');
const path = require('path');

const targetPath = process.argv[2] || '.';

try {
    // Recursively list files, ignoring node_modules and .git
    function listFiles(dir, fileList = []) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
                    listFiles(filePath, fileList);
                }
            } else {
                fileList.push(filePath);
            }
        });
        return fileList;
    }

    const allFiles = listFiles(targetPath);
    console.log(JSON.stringify({ files: allFiles }));
} catch (err) {
    console.log(JSON.stringify({ error: err.message }));
}
