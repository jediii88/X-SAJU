const fs = require('fs');
const html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

const opens = html.match(/<div/g).length;
const closes = html.match(/<\/div>/g).length;
console.log(`DIV tags - Open: ${opens}, Close: ${closes}`);