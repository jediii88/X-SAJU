const https = require('https');
const fs = require('fs');

const content = fs.readFileSync('X-SAJU_ALL_IN_ONE_v8.html', 'utf8');
const data = "content=" + encodeURIComponent(content) + "&syntax=html";

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