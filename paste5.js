const https = require('https');
const fs = require('fs');

const content = fs.readFileSync('X-SAJU_v8.tar');
// Try to generate single file HTML for direct viewing
let html = fs.readFileSync('X-SAJU_MASTER_v8.html', 'utf8');
const constants = fs.readFileSync('constants.js', 'utf8');
const lunar = fs.readFileSync('lunar.js', 'utf8');
const sajuDb = fs.readFileSync('saju_database_v8.js', 'utf8');
const calc = fs.readFileSync('calculation_engine.js', 'utf8');
const report = fs.readFileSync('report_engine_v8.js', 'utf8');

html = html.replace('<script src="constants.js"></script>', `<script>\n${constants}\n</script>`);
html = html.replace('<script src="lunar.js"></script>', `<script>\n${lunar}\n</script>`);
html = html.replace('<script src="saju_database_v8.js"></script>', `<script>\n${sajuDb}\n</script>`);
html = html.replace('<script src="calculation_engine.js"></script>', `<script>\n${calc}\n</script>`);
html = html.replace('<script src="report_engine_v8.js"></script>', `<script>\n${report}\n</script>`);

fs.writeFileSync('X-SAJU_ALL_IN_ONE_v8.html', html);