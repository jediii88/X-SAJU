const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function runQA() {
    console.log("--- AXE AUTOMATED QA START (FINAL) ---");
    const html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
    const lunarJs = fs.readFileSync('lunar.js', 'utf8');
    const constantsJs = fs.readFileSync('constants.js', 'utf8');
    const calcJs = fs.readFileSync('calculation_engine.js', 'utf8');
    const dbJs = fs.readFileSync('saju_database.js', 'utf8');
    const engineJs = fs.readFileSync('report_engine.js', 'utf8');
    
    const dom = new JSDOM(html, { runScripts: "dangerously" });
    const { window } = dom;
    
    // Polyfills
    window.scrollTo = () => {};
    window.alert = (msg) => console.log("Window Alert:", msg);

    // Inject scripts manually to avoid loading issues in JSDOM
    function inject(code) {
        const script = window.document.createElement("script");
        script.textContent = code;
        window.document.head.appendChild(script);
    }

    inject(lunarJs);
    inject(constantsJs);
    inject(calcJs);
    inject(dbJs);
    inject(engineJs);

    let results = { A: 'FAIL', B: 'FAIL', C: 'FAIL', D: 'FAIL', E: 'FAIL' };

    try {
        // [Test D] Core Functions existence
        if (typeof window.go === 'function' && typeof window.addUserForm === 'function' && typeof window.calculateEightChar === 'function') {
            results.D = 'PASS';
            console.log("Test D: PASS (Functions exist)");
        } else {
            console.log("Test D: FAIL (Functions missing)", typeof window.go, typeof window.addUserForm, typeof window.calculateEightChar);
        }
    } catch(e) {}

    try {
        // [Test B] Add User
        window.addUserForm();
        if (window.userCount === 2 && window.document.getElementById('user-form-2')) {
            results.B = 'PASS';
            console.log("Test B: PASS (Add user success)");
        }
    } catch(e) { console.log("Test B Error:", e.message); }

    try {
        // [Test A] Calculation
        window.document.getElementById('birth-date').value = '19880312';
        window.document.getElementById('birth-time').value = '0104';
        window.runAnalysis();
        
        // Wait for analysis setTimeout
        await new Promise(r => setTimeout(r, 1000));
        
        if (window.globalSajuDataArray && window.globalSajuDataArray.length > 0) {
            const res = window.globalSajuDataArray[0];
            if (res.dayStem === '丙') {
                results.A = 'PASS';
                console.log("Test A: PASS (Calculation success)");
            } else {
                console.log("Test A: FAIL (Wrong result)", res.dayStem);
            }
        }
    } catch(e) { console.log("Test A Error:", e.message); }

    try {
        // [Test C] Report
        if (results.A === 'PASS') {
            window.generateDeepReport(window.globalSajuDataArray);
            const content = window.document.getElementById('report-container').innerHTML;
            if (content.length > 100) {
                results.C = 'PASS';
                console.log("Test C: PASS (Report success)");
            }
        }
    } catch(e) { console.log("Test C Error:", e.message); }

    try {
        // [Test E] Leap Month UI
        const calL = window.document.querySelector('button[data-val="L"]');
        if (calL) {
            calL.click();
            const leapWrap = window.document.getElementById('leap-wrap');
            if (leapWrap && leapWrap.style.display === 'block') {
                results.E = 'PASS';
                console.log("Test E: PASS (Leap month UI functionality)");
            } else {
                console.log("Test E: FAIL (Leap wrap not visible)");
            }
        } else {
            console.log("Test E: FAIL (Lunar button not found)");
        }
    } catch(e) { console.log("Test E Error:", e.message); }

    console.log("FINAL RESULTS:", results);
    if (results.A === 'PASS' && results.B === 'PASS' && results.D === 'PASS' && results.E === 'PASS') {
        console.log("QA STATUS: SUCCESS");
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runQA();
