const fs = require('fs');
let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
const modalCss = fs.readFileSync('ui_modal.css', 'utf8');

html = html.replace(/<\/style>/, modalCss + '\n</style>');
fs.writeFileSync('X-SAJU_MASTER.html', html);