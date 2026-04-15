const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

let html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

dom.window.alert = (msg) => console.log('ALERT:', msg);
dom.window.console.log = (...args) => console.log('LOG:', ...args);
dom.window.console.error = (...args) => console.error('ERROR:', ...args);
dom.window.scrollTo = () => {};

setTimeout(() => {
    try {
        console.log("Setting values...");
        dom.window.document.getElementById('birth-date').value = '19880312';
        dom.window.document.getElementById('birth-time').value = '0104';
        
        console.log("Calling runAnalysis...");
        dom.window.runAnalysis();
        
        setTimeout(() => {
            console.log("After runAnalysis:");
            console.log("Step 1 class:", dom.window.document.getElementById('step-1').className);
            console.log("Step 2 class:", dom.window.document.getElementById('step-2').className);
        }, 1000);
        
    } catch(e) {
        console.error("CAUGHT EXCEPTION in test:", e);
    }
}, 2000);
