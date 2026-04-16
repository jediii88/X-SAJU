const fs = require('fs');
const html = fs.readFileSync('old_5e.html', 'utf8');
const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (cssMatch) {
    fs.writeFileSync('5e_css.txt', cssMatch[1]);
}