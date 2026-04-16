const https = require('https');
const fs = require('fs');

const fileContent = fs.readFileSync('test_output.html');
const boundary = '--------------------------' + Math.random().toString(16);

const options = {
  hostname: 'file.io',
  port: 443,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=' + boundary
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data);
  });
});

req.write('--' + boundary + '\r\n');
req.write('Content-Disposition: form-data; name="file"; filename="test_output.html"\r\n');
req.write('Content-Type: text/html\r\n\r\n');
req.write(fileContent);
req.write('\r\n--' + boundary + '--\r\n');
req.end();