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
    // Capture console.error from inside JSDOM
    window.console = {
        log: (...args) => console.log("[JSDOM]", ...args),
        error: (...args) => console.error("[JSDOM ERR]", ...args),
        warn: (...args) => console.warn("[JSDOM WARN]", ...args),
    };

    function inject(code) {
        const script = window.document.createElement("script");
        script.textContent = code;
        window.document.head.appendChild(script);
    }

    inject(lunarJs);
    inject(calcJs);
    inject(engineJs);

    await new Promise(r => setTimeout(r, 300));

    // Set values
    const birthDate = window.document.getElementById('birth-date');
    const birthTime = window.document.getElementById('birth-time');
    birthDate.value = '19880312';
    birthTime.value = '0104';

    // Check loading element
    const loadingEl = window.document.getElementById('loading');
    console.log("loading el exists:", !!loadingEl);

    // Patch showLoading to run synchronously for testing
    window.document.head.appendChild(Object.assign(window.document.createElement('script'), {
        textContent: `
        window.__origShowLoading = showLoading;
        function showLoading(msg, cb) {
            try { cb(); } catch(e) { console.error('showLoading callback error:', e.message, e.stack); }
        }
        `
    }));

    try {
        window.runAnalysis();
        console.log("runAnalysis called");
        console.log("globalSajuData dayStem:", window.globalSajuData?.dayStem);
        console.log("globalSajuData name:", window.globalSajuData?.name);
    } catch(e) {
        console.log("runAnalysis ERROR:", e.message, e.stack?.split('\n').slice(0,3).join('\n'));
    }
}

runQA().catch(e => console.error("Fatal:", e));
