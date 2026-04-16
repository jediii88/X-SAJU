const fs = require('fs');
let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

// Inject .container CSS right after .page
html = html.replace(/\.page\.active\s*\{\s*display:\s*block;\s*\}/, `$&
    .container { width: 100%; max-width: 800px; margin: 0 auto; padding: 20px; }`);

fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log("Container CSS added.");