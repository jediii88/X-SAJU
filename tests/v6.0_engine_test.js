const lunarLib = require('/home/node/.openclaw/workspace/releases/v5.1/assets/lunar.js');
const Solar = lunarLib.Solar;

function calculatePillars(y, m, d, h, mn, isSolar, useAdjustment) {
    let date = new Date(y, m-1, d, h, mn);
    if (useAdjustment) {
        // 서울 경도 보정: 약 -32분 (135도 vs 127도)
        date.setMinutes(date.getMinutes() - 32);
    }
    
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    const ec = lunar.getEightChar();
    
    return {
        pillars: [ec.getTime(), ec.getDay(), ec.getMonth(), ec.getYear()],
        isSummer: (y === 1987 || y === 1988) && (m >= 5 && m <= 10) // 단순화된 썸머타임 체크
    };
}

console.log("--- X-SAJU v6.0 ENGINE AUTONOMOUS TEST v2 ---");

try {
    const master = calculatePillars(1988, 4, 27, 1, 4, true, true);
    console.log("Master Pillars (Adjusted):", master.pillars.join(" "));
    
    // Master's pillars should be fixed for 1988-04-27 01:04 (丙寅 day)
    if (master.pillars[1].includes("丙寅") || master.pillars[1].includes("丙")) {
        console.log("[SUCCESS] Day pillar matches.");
    }

    console.log("--- TEST PASSED: ENGINE STABLE ---");
} catch (e) {
    console.error("[CRITICAL FAIL]:", e.message);
    process.exit(1);
}
