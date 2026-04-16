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

    await new Promise(r => setTimeout(r, 200));

    // Test A - runAnalysis debug
    console.log("=== TEST A DETAILED ===");
    const birthDate = window.document.getElementById('birth-date');
    const birthTime = window.document.getElementById('birth-time');
    
    birthDate.value = '19880312';
    birthTime.value = '0104';
    
    // Check what runAnalysis does
    try {
        // Try direct calculateEightChar first
        const result = window.calculateEightChar('19880312', '0104', 'M', 'S', false, 'KST', true);
        console.log("calculateEightChar result:", JSON.stringify({
            name: result?.name,
            dayStem: result?.dayStem, 
            dayBranch: result?.dayBranch,
            pillars: result?.pillars?.map(p => p?.h?.join(''))
        }));
    } catch(e) {
        console.log("calculateEightChar ERROR:", e.message);
    }

    // Now try runAnalysis
    try {
        window.runAnalysis();
        await new Promise(r => setTimeout(r, 2000));
        
        // Check globalSajuData (not array)
        console.log("globalSajuData type:", typeof window.globalSajuData);
        console.log("globalSajuDataArray type:", typeof window.globalSajuDataArray);
        
        // Find the report container  
        const reportContainer = window.document.getElementById('report-container');
        console.log("report-container exists:", !!reportContainer);
        console.log("report-container innerHTML length:", reportContainer?.innerHTML?.length || 0);
        
        // Check current active page
        const activePage = window.document.querySelector('.page.active');
        console.log("active page id:", activePage?.id);
    } catch(e) {
        console.log("runAnalysis ERROR:", e.message, e.stack?.split('\n')[1]);
    }
}

runQA().catch(e => console.error("Fatal:", e));
