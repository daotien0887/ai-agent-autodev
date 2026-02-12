const http = require('http');

const data = JSON.stringify({
    model: 'qwen3-coder:480b-cloud',
    prompt: 'Say "Connection successful" if you can read this.',
    stream: false
});

const options = {
    hostname: 'host.docker.internal',
    port: 11434,
    path: '/api/generate',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => { responseData += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(responseData);
            console.log('Model Response:', json.response);
            console.log('Status:', res.statusCode);
        } catch (e) {
            console.error('Failed to parse response:', responseData);
        }
    });
});

req.on('error', (e) => {
    console.error('Connection Failed:', e.message);
});

req.write(data);
req.end();
