const fs = require('fs');
let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

// Inject .page CSS right after body
html = html.replace(/body\s*\{[\s\S]*?\}/, `$&
    .page { display: none; }
    .page.active { display: block; }`);

fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log("Ultimate fix applied.");