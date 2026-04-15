const fs = require('fs');
let html = fs.readFileSync('test_output.html', 'utf8');
// remove style tags
html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
// remove scripts
html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
// replace <br> with newline
html = html.replace(/<br\s*[\/]?>/gi, '\n');
// replace </p> and </div> with newline
html = html.replace(/<\/(p|div|h[1-6]|li|ul)>/gi, '\n');
// remove remaining tags
html = html.replace(/<[^>]+>/g, '');
// unescape html entities
html = html.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
// remove excessive newlines
html = html.replace(/\n\s*\n/g, '\n\n').trim();

console.log(html);