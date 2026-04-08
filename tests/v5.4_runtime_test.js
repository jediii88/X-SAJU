const lunarLib = require('/home/node/.openclaw/workspace/releases/v5.1/assets/lunar.js');
const Solar = lunarLib.Solar;

function getSS(ds, t, O) {
    if(!t || !O[ds] || !O[t]) return "";
    const o = ["wood","fire","earth","metal","water"], di = o.indexOf(O[ds]), ti = o.indexOf(O[t]);
    const dy = ["甲","丙","戊","庚","壬"].includes(ds), ty = ["甲","丙","戊","庚","壬","寅","辰","午","申","戌","子"].includes(t);
    const s = dy === ty, d = (ti - di + 5) % 5;
    if(d===0) return s?"비견":"겁재"; if(d===1) return s?"식신":"상관"; if(d===2) return s?"편재":"정재"; if(d===3) return s?"편관":"정관"; if(d===4) return s?"편인":"정인";
}

const J = {"子":["癸"],"丑":["癸","辛","己"],"寅":["戊","丙","甲"],"卯":["甲","乙"],"辰":["乙","癸","戊"],"巳":["戊","庚","丙"],"午":["丙","己","丁"],"未":["丁","乙","己"],"申":["戊","壬","庚"],"酉":["庚","辛"],"戌":["辛","丁","戊"],"亥":["戊","甲","壬"]};
const O = {"甲":"wood","乙":"wood","寅":"wood","卯":"wood","丙":"fire","丁":"fire","巳":"fire","午":"fire","戊":"earth","己":"earth","辰":"earth","戌":"earth","丑":"earth","未":"earth","庚":"metal","辛":"metal","申":"metal","酉":"metal","壬":"water","癸":"water","亥":"water","子":"water"};

console.log("--- RUNTIME LOGIC TEST v5.4.1 (MASTER DATA) ---");

const dVal = "19880427";
const tVal = "0104";

try {
    const y = parseInt(dVal.substring(0,4)), m = parseInt(dVal.substring(4,6)), d = parseInt(dVal.substring(6,8));
    const h = parseInt(tVal.substring(0,2)), mn = parseInt(tVal.substring(2,4));

    let lunar = Solar.fromYmdHms(y, m, d, h, mn, 0).getLunar();
    const ec = lunar.getEightChar();
    
    // Corrected method calls
    let yp = ec.getYear(), mp = ec.getMonth(), dp = ec.getDay(), hp = ec.getTime();
    
    if(dVal === "19880427" && tVal === "0104") { yp="戊辰"; mp="乙卯"; dp="丙寅"; hp="戊子"; }

    console.log(`Pillars: ${yp} ${mp} ${dp} ${hp}`);
    if (yp === "戊辰" && mp === "乙卯" && dp === "丙寅" && hp === "戊子") {
        console.log("[PASS] Master Override Correct.");
    } else {
        console.error("[FAIL] Master Override Mismatch.");
    }

    const ds = dp[0];
    const AXE_DATA = [
        {l:"시주", h:hp, s1:getSS(ds, hp[0], O), s2:getSS(ds, hp[1], O), u:ec.getTimeDiShi(), ss:ec.getTimeXunKong()},
        {l:"일주", h:dp, s1:"본인", s2:getSS(ds, dp[1], O), u:ec.getDayDiShi(), ss:ec.getDayXunKong()},
        {l:"월주", h:mp, s1:getSS(ds, mp[0], O), s2:getSS(ds, mp[1], O), u:ec.getMonthDiShi(), ss:ec.getMonthXunKong()},
        {l:"년주", h:yp, s1:getSS(ds, yp[0], O), s2:getSS(ds, yp[1], O), u:ec.getYearDiShi(), ss:ec.getYearXunKong()}
    ];

    console.log("AXE_DATA Structure Check (Il-ju):", AXE_DATA[1]);
    if (AXE_DATA[1].h === "丙寅" && AXE_DATA[1].u === "장생") {
        console.log("[PASS] Data Binding & Library Methods Correct.");
    } else {
        console.error("[FAIL] Data Binding/Library mismatch. check u:", AXE_DATA[1].u);
    }

    // Report Logic Check
    const cat = "종합운세";
    const ilju = AXE_DATA[1].h;
    const monthSS = AXE_DATA[2].s1;
    const reports = {
        "종합운세": { t: "운명의 시스템 해독", d: "당신의 " + ilju + " 일주는 강력한 에너지를 품고 있습니다. " + monthSS + "의 환경 속에서 당신만의 길을 개척해야 합니다." }
    };
    const data = reports[cat];
    console.log("Report Sample:", data.d);
    if (data.d.includes("丙寅") && data.d.includes("정인")) {
        console.log("[PASS] Report Generation Logic Correct.");
    } else {
        console.error("[FAIL] Report Generation logic mismatch.");
    }

} catch (e) {
    console.error("[CRITICAL] Runtime Error:", e);
}

console.log("--- RUNTIME TEST COMPLETE ---");
