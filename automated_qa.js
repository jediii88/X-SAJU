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
    // constants.js and saju_database.js are already embedded in X-SAJU_MASTER.html
    // Injecting them again causes "already declared" errors with const.
    // Only inject calc engine and report engine which are NOT in the HTML.
    inject(calcJs);
    inject(engineJs);
    // Expose let-scoped globals to window for QA inspection
    // (JSDOM does not expose let/const to window, only var does)
    inject(`
        // Override showLoading to run synchronously in test environment
        function showLoading(msg, cb) {
            try { cb(); } catch(e) { window.__qaError = e.message; }
        }
        // Proxy globalSajuData assignment to window
        Object.defineProperty(window, '__getSajuData', { get: function() { return globalSajuData; } });
    `);

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
        // userCount is declared with let inside a script block, not exposed on window in JSDOM
        // So we check for the DOM element instead
        if (window.document.getElementById('user-form-2')) {
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
        
        // globalSajuData is declared with let, use proxy accessor
        const res = window.__getSajuData;
        if (res && res.dayStem === '丙') {
            results.A = 'PASS';
            console.log("Test A: PASS (Calculation success)");
        } else if (res && res.dayStem) {
            console.log("Test A: FAIL (Wrong dayStem)", res.dayStem);
        } else {
            console.log("Test A: FAIL (globalSajuData empty)", window.__qaError || 'no error captured');
        }
    } catch(e) { console.log("Test A Error:", e.message); }

    try {
        // [Test C] Report
        if (results.A === 'PASS') {
            window.generateDeepReport(window.__getSajuData);
            const content = window.document.getElementById('report-container').innerHTML;
            if (content.length > 100) {
                results.C = 'PASS';
                console.log("Test C: PASS (Report success)");
            } else {
                console.log("Test C: FAIL (Report content too short)", content.length);
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
