const https = require('https');
const fs = require('fs');

const content = fs.readFileSync('test_output.txt', 'utf8');
const data = "content=" + encodeURIComponent(content);

const options = {
  hostname: 'dpaste.com',
  port: 443,
  path: '/api/v2/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  let resData = '';
  res.on('data', (chunk) => {
    resData += chunk;
  });
  res.on('end', () => {
    console.log("URL:", resData);
  });
});

req.write(data);
req.end();