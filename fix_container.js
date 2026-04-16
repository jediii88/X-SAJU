const fs = require('fs');
let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

// Remove .container rule
html = html.replace(/\.container\s*\{[\s\S]*?\}/, '');

fs.writeFileSync('X-SAJU_MASTER.html', html);