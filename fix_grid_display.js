const fs = require('fs');

let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

// Looking for the table generation logic in renderDashboard
// The image shows the grid is missing the contents and text!
// Let's check what renderDashboard actually renders for "manse-table"

const manseRegex = /document\.getElementById\('manse-table'\)\.innerHTML = /;
if (!html.includes("document.getElementById('manse-table').innerHTML")) {
    console.log("MANSE TABLE RENDER LOGIC MISSING!");
} else {
    console.log("MANSE TABLE EXISTS");
}
