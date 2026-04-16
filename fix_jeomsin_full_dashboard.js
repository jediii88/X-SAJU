const fs = require('fs');
const jeom = fs.readFileSync('jeomsin_old.html', 'utf8');
let current = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

const jeomDashMatch = jeom.match(/function renderDashboard\(data\) \{[\s\S]*?(?=function renderLuckSection)/);
const currDashMatch = current.match(/function renderDashboard\(data\) \{[\s\S]*?(?=function renderLuckSection)/);

if (jeomDashMatch && currDashMatch) {
    current = current.replace(currDashMatch[0], jeomDashMatch[0]);
    fs.writeFileSync('X-SAJU_MASTER.html', current);
    console.log("Full renderDashboard replaced with Jeomsin version.");
} else {
    console.log("Could not find renderDashboard.");
}