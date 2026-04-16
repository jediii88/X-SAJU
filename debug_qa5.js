const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function runQA() {
    const html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
    const lunarJs = fs.readFileSync('lunar.js', 'utf8');
    const calcJs = fs.readFileSync('calculation_engine.js', 'utf8');
    const engineJs = fs.readFileSync('report_engine.js', 'utf8');
    
    const dom = new JSDOM(html, { runScripts: "dangerously" });
    const { window } = dom;
    
    window.scrollTo = () => {};
    window.alert = (msg) => console.log("Alert:", msg);

    function inject(code) {
        const script = window.document.createElement("script");
        script.textContent = code;
        window.document.head.appendChild(script);
    }

    inject(lunarJs);
    inject(calcJs);
    inject(engineJs);

    await new Promise(r => setTimeout(r, 300));

    const birthDateEl = window.document.getElementById('birth-date');
    birthDateEl.value = '19880312';
    const birthTimeEl = window.document.getElementById('birth-time');
    birthTimeEl.value = '0104';
    
    // Override showLoading to catch errors and expose them
    inject(`
        function showLoading(msg, cb) {
            try { 
                cb(); 
            } catch(e) { 
                window.__lastError = e.message + ' | ' + (e.stack || '').split('\\n')[1];
                console.error('CALLBACK ERROR:', e.message);
            }
        }
        window.__lastError = null;
    `);
    
    // Run and check error
    inject(`
        try {
            runAnalysis();
        } catch(e) {
            window.__lastError = 'runAnalysis outer: ' + e.message;
        }
    `);
    
    await new Promise(r => setTimeout(r, 200));
    
    console.log("Error captured:", window.__lastError);
    console.log("globalSajuData:", JSON.stringify(window.globalSajuData));
}

runQA().catch(e => console.error("Fatal:", e));
