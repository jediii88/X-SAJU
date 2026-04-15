const fs = require('fs');
const html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
let combinedJs = '';

if (scriptMatches) {
    scriptMatches.forEach((script, idx) => {
        const content = script.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
        combinedJs += `\n/* SCRIPT ${idx} */\n` + content;
    });
}

fs.writeFileSync('temp_extracted.js', combinedJs);
