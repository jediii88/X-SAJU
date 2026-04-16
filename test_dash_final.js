const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });

// Polyfill
dom.window.Solar = require('lunar-javascript').Solar;
dom.window.Lunar = require('lunar-javascript').Lunar;

try {
    const s2 = fs.readFileSync('constants.js', 'utf8');
    const s3 = fs.readFileSync('saju_database.js', 'utf8');
    const s4 = fs.readFileSync('calculation_engine.js', 'utf8');

    dom.window.eval(s2 + '\n' + s3 + '\n' + s4);
    dom.window.eval(`
        window.SAJU_DB = SAJU_DB;
        const data = calculateEightChar("장경현", "19880312", "0104", "M", true, false, "1", false, -32);
        renderDashboard(data);
    `);
    console.log("AV DESC:");
    console.log(dom.window.document.getElementById('av-desc').innerHTML);
    console.log("MANSE TABLE:");
    console.log(dom.window.document.getElementById('manse-table').innerHTML.substring(0,200) + "...");
    console.log("SUCCESS");
} catch (e) {
    console.error("ERROR: ", e);
}