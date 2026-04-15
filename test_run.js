const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

// Wait for scripts to load
dom.window.document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        try {
            console.log("Solar exists?", !!dom.window.Solar);
            dom.window.document.getElementById('birth-date').value = '19880312';
            dom.window.document.getElementById('birth-time').value = '0104';
            
            // click run analysis
            dom.window.document.querySelector('button[onclick="runAnalysis()"]').click();
            
            console.log("After runAnalysis...");
        } catch (e) {
            console.error("Error:", e);
        }
    }, 1000);
});
