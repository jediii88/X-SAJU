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

    // Wait for DOM scripts to settle
    await new Promise(r => setTimeout(r, 200));

    // Test B debug
    console.log("=== TEST B DEBUG ===");
    console.log("userCount before:", window.userCount);
    console.log("addUserForm type:", typeof window.addUserForm);
    const step1 = window.document.getElementById('step-1');
    console.log("step-1 exists:", !!step1);
    const addBtn = window.document.querySelector('button[onclick="addUserForm()"]');
    console.log("addUserForm button exists:", !!addBtn);
    
    try {
        window.addUserForm();
        console.log("addUserForm() called OK");
        console.log("userCount after:", window.userCount);
        const form2 = window.document.getElementById('user-form-2');
        console.log("user-form-2 exists:", !!form2);
    } catch(e) {
        console.log("addUserForm ERROR:", e.message, e.stack);
    }

    // Test A debug
    console.log("\n=== TEST A DEBUG ===");
    const birthDate = window.document.getElementById('birth-date');
    console.log("birth-date input exists:", !!birthDate);
    const birthTime = window.document.getElementById('birth-time');
    console.log("birth-time input exists:", !!birthTime);
    console.log("runAnalysis type:", typeof window.runAnalysis);
    
    try {
        if (birthDate) birthDate.value = '19880312';
        if (birthTime) birthTime.value = '0104';
        window.runAnalysis();
        await new Promise(r => setTimeout(r, 1500));
        console.log("globalSajuDataArray:", JSON.stringify(window.globalSajuDataArray?.map(d => ({name: d?.name, dayStem: d?.dayStem}))));
    } catch(e) {
        console.log("runAnalysis ERROR:", e.message);
    }
}

runQA().catch(e => console.error("Fatal:", e));
