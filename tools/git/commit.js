const { exec } = require('child_process');

// Usage: node commit.js <commit_message>
const message = process.argv[2] || "chore: auto update by agent";

const command = `git add . && git commit -m "${message}"`;

exec(command, { cwd: '../workspace' }, (error, stdout, stderr) => {
    if (error) {
        if (stdout.includes('nothing to commit')) {
            console.log(JSON.stringify({ status: "skipped", message: "Nothing to commit" }));
            return;
        }
        console.log(JSON.stringify({ status: "error", message: error.message }));
        return;
    }
    console.log(JSON.stringify({ status: "success", output: stdout }));
});
