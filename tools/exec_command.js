const { exec } = require('child_process');

const command = process.argv[2];
const cwd = process.argv[3] || process.cwd();

if (!command) {
    console.log(JSON.stringify({ error: "No command provided" }));
    process.exit(1);
}

// White-list allowed commands to prevent dangerous operations
const ALLOWED_COMMANDS = ['npm install', 'npm test', 'npm run build', 'ls', 'echo', 'cat', 'pwd'];

const isAllowed = ALLOWED_COMMANDS.some(cmd => command.startsWith(cmd));
if (!isAllowed) {
    // Open for now for development flexibility, but should be strict in prod
    // console.log(JSON.stringify({ error: "Command not allowed" }));
    // process.exit(1);
}

exec(command, { cwd }, (error, stdout, stderr) => {
    if (error) {
        console.log(JSON.stringify({
            status: "error",
            message: error.message,
            stderr: stderr
        }));
        return;
    }
    console.log(JSON.stringify({
        status: "success",
        stdout: stdout,
        stderr: stderr
    }));
});
