const fs = require('fs');
let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
const loadCss = fs.readFileSync('ui_loading.css', 'utf8');

html = html.replace(/<\/style>/, loadCss + '\n</style>');
fs.writeFileSync('X-SAJU_MASTER.html', html);