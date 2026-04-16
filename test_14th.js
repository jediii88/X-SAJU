const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('14th_state.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
dom.window.Solar = require('lunar-javascript').Solar;
dom.window.Lunar = require('lunar-javascript').Lunar;

try {
    dom.window.eval(`
        const data = calculateEightChar("장경현", "19880312", "0104", "M", true, false, "1", false, -32);
        renderDashboard(data);
    `);
    console.log("MANSE TABLE:");
    console.log(dom.window.document.getElementById('manse-table').innerHTML.substring(0,100) + "...");
    console.log("SUCCESS");
} catch(e) {
    console.log(e);
}