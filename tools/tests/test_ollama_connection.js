const http = require('http');

const options = {
    hostname: 'host.docker.internal',
    port: 11434,
    path: '/api/tags',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Connection Successful!');
        console.log('Status:', res.statusCode);
        console.log('Models found:', JSON.parse(data).models.map(m => m.name).join(', '));
    });
});

req.on('error', (e) => {
    console.error('Connection Failed:', e.message);
});

req.end();
