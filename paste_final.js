const https = require('https');
const fs = require('fs');

const constants = fs.readFileSync('constants.js', 'utf8');
const lunar = fs.readFileSync('lunar.js', 'utf8');
const sajuDb = fs.readFileSync('saju_database.js', 'utf8');
const calc = fs.readFileSync('calculation_engine.js', 'utf8');
const report = fs.readFileSync('report_engine.js', 'utf8');
let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

html = html.replace('<script src="constants.js"></script>', `<script>\n${constants}\n</script>`);
html = html.replace('<script src="lunar.js"></script>', `<script>\n${lunar}\n</script>`);
html = html.replace('<script src="saju_database.js"></script>', `<script>\n${sajuDb}\n</script>`);
html = html.replace('<script src="calculation_engine.js"></script>', `<script>\n${calc}\n</script>`);
html = html.replace('<script src="report_engine.js"></script>', `<script>\n${report}\n</script>`);

const data = "content=" + encodeURIComponent(html) + "&syntax=html";

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
    console.log("FINAL URL:", resData);
  });
});

req.write(data);
req.end();