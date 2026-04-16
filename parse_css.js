const fs = require('fs');
const html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];

let opens = (css.match(/\{/g) || []).length;
let closes = (css.match(/\}/g) || []).length;
console.log(`CSS braces - Open: ${opens}, Close: ${closes}`);