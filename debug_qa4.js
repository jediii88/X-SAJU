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

    // Check if di in window matches what we set
    const birthDateEl = window.document.getElementById('birth-date');
    birthDateEl.value = '19880312';
    
    inject(`console.log('di.value from window scope:', di ? di.value : 'di is null');`);
    
    // Patch showLoading to run sync
    inject(`
        function showLoading(msg, cb) {
            try { cb(); } catch(e) { console.error('CB Error:', e.message); }
        }
    `);
    
    inject(`
        var dVal = di ? di.value.replace(/\\D/g, '') : 'NOT FOUND';
        console.log('dVal check:', dVal, 'length:', dVal.length);
    `);
    
    try {
        window.runAnalysis();
        console.log("After runAnalysis - dayStem:", window.globalSajuData?.dayStem);
    } catch(e) {
        console.log("ERROR:", e.message);
    }
}

runQA().catch(e => console.error("Fatal:", e));
