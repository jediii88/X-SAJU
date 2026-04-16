const fs = require('fs');

let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
html = html.replace(/<script src="report_engine_v7\.js"><\/script>/g, '<script src="report_engine.js"></script>');
html = html.replace(/<script src="report_engine_v6\.js"><\/script>/g, '<script src="report_engine.js"></script>');
html = html.replace(/<script src="report_engine_v8\.js"><\/script>/g, '<script src="report_engine.js"></script>');
html = html.replace(/<script src="saju_database_v8\.js"><\/script>/g, '<script src="saju_database.js"></script>');
html = html.replace(/<script src="saju_database_v6\.js"><\/script>/g, '<script src="saju_database.js"></script>');
fs.writeFileSync('X-SAJU_MASTER.html', html);
console.log("HTML script links restored.");

let db = fs.readFileSync('saju_database_v8.js', 'utf8');
fs.writeFileSync('saju_database.js', db);

let report = fs.readFileSync('report_engine_v8.js', 'utf8');
fs.writeFileSync('report_engine.js', report);
console.log("JS files restored to standard names.");