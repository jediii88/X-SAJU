const fs = require('fs');
let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

html = html.replace(/\.container\s*\{\s*width:\s*100%;\s*max-width:\s*800px;\s*margin:\s*0\s*auto;\s*padding:\s*20px;\s*\}/, '');

fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log("Container CSS removed. Back to 100% pure d31c46c styling.");