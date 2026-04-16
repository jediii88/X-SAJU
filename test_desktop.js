const fs = require('fs');

let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
html = html.replace('.container {\n        max-width: 600px;\n        margin: 0 auto;\n        padding-bottom: 50px;\n    }', '.container {\n        width: 100%;\n        max-width: 1000px;\n        margin: 0 auto;\n        padding-bottom: 50px;\n    }');

fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log("Updated max-width for desktop friendliness.");