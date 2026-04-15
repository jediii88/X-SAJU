const fs = require('fs');

global.window = {};
global.document = {
    getElementById: function(id) {
        return {
            set innerHTML(val) {
                fs.writeFileSync('test_output.html', val);
            },
            scrollIntoView: () => {}
        };
    }
};

const lunarLib = require('lunar-javascript');
global.Solar = lunarLib.Solar;
global.Lunar = lunarLib.Lunar;

try {
    const s2 = fs.readFileSync('constants.js', 'utf8');
    const s3 = fs.readFileSync('saju_database.js', 'utf8');
    const s4 = fs.readFileSync('calculation_engine.js', 'utf8');
    const s5 = fs.readFileSync('report_engine.js', 'utf8');

    const combined = s2 + "\n" + s3 + "\n" + s4 + "\n" + s5 + "\n" + `
        window.SAJU_DB = SAJU_DB;
        const data = calculateEightChar("장경현", "19880312", "0104", "M", true, false, "1", false, -32);
        generateDeepReport(data);
    `;
    
    eval(combined);
    
    const html = fs.readFileSync('test_output.html', 'utf8');
    console.log("SUCCESS. HTML Length: " + html.length);
    console.log("--- PREVIEW START ---");
    console.log(html.substring(0, 1000));
    console.log("--- PREVIEW END ---");
} catch (e) {
    console.error("ERROR: ", e);
}
