const fs = require('fs');
global.window = {};
global.document = {
    getElementById: function(id) {
        if (!global.elements) global.elements = {};
        if (!global.elements[id]) {
            global.elements[id] = { innerHTML: '', style: {} };
        }
        return global.elements[id];
    },
    querySelector: function(sel) {
        return { style: {} };
    }
};

const lunarLib = require('lunar-javascript');
global.Solar = lunarLib.Solar;
global.Lunar = lunarLib.Lunar;

try {
    const s2 = fs.readFileSync('constants.js', 'utf8');
    const s3 = fs.readFileSync('saju_database.js', 'utf8');
    const s4 = fs.readFileSync('calculation_engine.js', 'utf8');

    let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
    const renderDashMatch = html.match(/function renderDashboard\(data\) \{[\s\S]*?(?=function renderLuckSection)/);
    
    const combined = s2 + "\n" + s3 + "\n" + s4 + "\n" + renderDashMatch[0] + "\n" + `
        window.SAJU_DB = SAJU_DB;
        const data = calculateEightChar("장경현", "19880312", "0104", "M", true, false, "1", false, -32);
        renderDashboard(data);
    `;
    
    eval(combined);
    console.log("AV DESC:");
    console.log(global.elements['av-desc'].innerHTML);
    console.log("\nMANSE TABLE:");
    console.log(global.elements['manse-table'].innerHTML);
} catch (e) {
    console.error("ERROR: ", e);
}