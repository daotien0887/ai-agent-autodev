const { exec } = require('child_process');

// Usage: node checkout.js <branch_name> [-b]
const branch = process.argv[2];
const isNew = process.argv[3] === '-b';

if (!branch) {
    console.log(JSON.stringify({ error: "No branch specified" }));
    process.exit(1);
}

const command = isNew ? `git checkout -b ${branch}` : `git checkout ${branch}`;

exec(command, { cwd: '../workspace' }, (error, stdout, stderr) => {
    if (error) {
        console.log(JSON.stringify({ status: "error", message: error.message }));
        return;
    }
    console.log(JSON.stringify({ status: "success", output: stdout }));
});
