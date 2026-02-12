const { exec } = require('child_process');

// Usage: node push.js <branch_name>
const branch = process.argv[2] || "main";

const command = `git push origin ${branch}`;

exec(command, { cwd: '../workspace' }, (error, stdout, stderr) => {
    if (error) {
        console.log(JSON.stringify({ status: "error", message: error.message }));
        return;
    }
    console.log(JSON.stringify({ status: "success", output: stdout }));
});
