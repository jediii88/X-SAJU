const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;
const document = window.document;

try {
    console.log("Calling addUserForm...");
    window.addUserForm();
    console.log("User count:", window.userCount);
} catch (e) {
    console.error("Error in addUserForm:", e);
}

try {
    document.getElementById('birth-date').value = '19880312';
    document.getElementById('birth-time').value = '0104';
    console.log("Calling runAnalysis...");
    window.runAnalysis();
    console.log("Success runAnalysis");
} catch (e) {
    console.error("Error in runAnalysis:", e);
}
