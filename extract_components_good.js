const fs = require('fs');
const html = fs.readFileSync('old_good.html', 'utf8');
const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/g);
if (cssMatch) {
    fs.writeFileSync('good_css.txt', cssMatch.join('\n'));
}