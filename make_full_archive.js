const fs = require('fs');
const child_process = require('child_process');

// Bundle everything into one standalone file that actually has the fix
const constants = fs.readFileSync('constants.js', 'utf8');
const lunar = fs.readFileSync('lunar.js', 'utf8');
const sajuDb = fs.readFileSync('saju_database_v6.js', 'utf8');
const calc = fs.readFileSync('calculation_engine.js', 'utf8');
const report = fs.readFileSync('report_engine_v7.js', 'utf8');
let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

html = html.replace('<script src="constants.js"></script>', `<script>\n${constants}\n</script>`);
html = html.replace('<script src="lunar.js"></script>', `<script>\n${lunar}\n</script>`);
html = html.replace('<script src="saju_database_v6.js"></script>', `<script>\n${sajuDb}\n</script>`);
html = html.replace('<script src="calculation_engine.js"></script>', `<script>\n${calc}\n</script>`);
html = html.replace('<script src="report_engine_v7.js"></script>', `<script>\n${report}\n</script>`);

fs.writeFileSync('X-SAJU_PREVIEW_FINAL.html', html);
console.log("Standalone HTML FINAL created.");