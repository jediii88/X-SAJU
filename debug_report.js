const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function run() {
    const html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
    const lunarJs = fs.readFileSync('lunar.js', 'utf8');
    const calcJs = fs.readFileSync('calculation_engine.js', 'utf8');
    const engineJs = fs.readFileSync('report_engine.js', 'utf8');
    
    const dom = new JSDOM(html, { runScripts: "dangerously" });
    const { window } = dom;
    window.scrollTo = () => {};
    window.alert = () => {};

    function inject(code) {
        const s = window.document.createElement("script");
        s.textContent = code;
        window.document.head.appendChild(s);
    }

    inject(lunarJs);
    inject(calcJs);
    inject(engineJs);
    inject(`
        function showLoading(msg, cb) { try { cb(); } catch(e) { window.__qaError = e.message; } }
        Object.defineProperty(window, '__getSajuData', { get: function() { return globalSajuData; } });
    `);

    await new Promise(r => setTimeout(r, 200));

    window.document.getElementById('birth-date').value = '19880312';
    window.document.getElementById('birth-time').value = '0104';
    window.runAnalysis();
    
    await new Promise(r => setTimeout(r, 200));
    
    const data = window.__getSajuData;
    console.log("Data keys:", data ? Object.keys(data) : 'null');
    console.log("Data sample:", JSON.stringify({
        name: data?.name,
        dayStem: data?.dayStem,
        dayBranch: data?.dayBranch,
        animal: data?.animal,
        pillarsLength: data?.pillars?.length
    }));
    
    // Try generateDeepReport and catch slice error
    try {
        window.generateDeepReport(data);
        const content = window.document.getElementById('report-container')?.innerHTML;
        console.log("Report length:", content?.length);
    } catch(e) {
        console.log("generateDeepReport ERROR:", e.message);
        console.log("Stack:", e.stack?.split('\n').slice(0,5).join('\n'));
    }
}

run().catch(e => console.error("Fatal:", e));
