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
        // After multi-user update, the IDs have -1 suffix
        if(dom.window.document.getElementById('birth-date-1')) {
            dom.window.document.getElementById('birth-date-1').value = '1988-03-12';
            dom.window.document.getElementById('birth-time-1').value = '01:04';
        } else {
            dom.window.document.getElementById('birth-date').value = '1988-03-12';
            dom.window.document.getElementById('birth-time').value = '01:04';
        }
        
        console.log("Calling runAnalysis...");
        dom.window.runAnalysis();
        
        setTimeout(() => {
            console.log("Step 2 class:", dom.window.document.getElementById('step-2').className);
            console.log("Calling startReport...");
            dom.window.startReport();
            
            setTimeout(() => {
                let htmlOutput = dom.window.document.getElementById('report-container').innerHTML;
                console.log("Report Container length:", htmlOutput.length);
                console.log("Step 3 class:", dom.window.document.getElementById('step-3').className);
            }, 1000);
        }, 1000);
        
    } catch(e) {
        console.error("CAUGHT EXCEPTION in test:", e);
    }
}, 2000);
