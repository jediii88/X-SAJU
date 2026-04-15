const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function runQA() {
    console.log("--- AXE AUTOMATED QA START ---");
    const html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
    const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
    const { window } = dom;
    
    // Polyfill for scrollTo
    window.scrollTo = () => {};

    let results = { A: 'FAIL', B: 'FAIL', C: 'FAIL', D: 'FAIL' };

    // Wait for scripts (especially Lunar/Solar)
    await new Promise(r => setTimeout(r, 1500));

    try {
        // [Test A] 1인 입력
        window.document.getElementById('birth-date').value = '19880312';
        window.document.getElementById('birth-time').value = '0104';
        
        // Manual trigger
        const btn = window.document.querySelector('button[onclick="runAnalysis()"]');
        if (btn) btn.click();
        else window.runAnalysis();
        
        await new Promise(r => setTimeout(r, 1000));

        if (window.globalSajuDataArray && window.globalSajuDataArray.length >= 1) {
            results.A = 'PASS';
            console.log("Test A: PASS (1-user calc success)");
        } else {
            console.log("Test A: FAIL (Array empty or missing)");
        }
    } catch (e) { console.error("Test A Error:", e.message); }

    try {
        // [Test B] N인 폼
        if (typeof window.addUserForm === 'function') {
            window.addUserForm();
            if (window.userCount >= 2) {
                results.B = 'PASS';
                console.log("Test B: PASS (Dynamic form creation success)");
            }
        } else {
            console.log("Test B: FAIL (addUserForm not found)");
        }
    } catch (e) { console.error("Test B Error:", e.message); }

    try {
        // [Test C] Report Engine
        if (window.globalSajuDataArray && window.globalSajuDataArray.length > 0) {
            window.generateDeepReport(window.globalSajuDataArray);
            const container = window.document.getElementById('report-container');
            if (container && container.innerHTML.length > 500) {
                results.C = 'PASS';
                console.log("Test C: PASS (Report Engine generation success)");
            }
        }
    } catch (e) { console.error("Test C Error:", e.message); }

    try {
        // [Test D] UI Functions
        if (typeof window.go === 'function' && typeof window.scrollToSec === 'function') {
            results.D = 'PASS';
            console.log("Test D: PASS (Core UI functions exist)");
        }
    } catch (e) { console.error("Test D Error:", e.message); }

    console.log("FINAL RESULTS:", results);
    if (Object.values(results).every(v => v === 'PASS')) {
        console.log("QA STATUS: SUCCESS");
        process.exit(0);
    } else {
        console.log("QA STATUS: CRITICAL FAILURE");
        process.exit(1);
    }
}

runQA();
