const lunarLib = require('/home/node/.openclaw/workspace/releases/v5.1/assets/lunar.js');
const Solar = lunarLib.Solar;

function getSS(ds, t, O) {
    if(!t || !O[ds] || !O[t]) return "";
    const o = ["wood","fire","earth","metal","water"], di = o.indexOf(O[ds]), ti = o.indexOf(O[t]);
    const dy = ["甲","丙","戊","庚","壬"].includes(ds), ty = ["甲","丙","戊","庚","壬","寅","辰","午","申","戌","子"].includes(t);
    const s = dy === ty, d = (ti - di + 5) % 5;
    if(d===0) return s?"비견":"겁재"; if(d===1) return s?"식신":"상관"; if(d===2) return s?"편재":"정재"; if(d===3) return s?"편관":"정관"; if(d===4) return s?"편인":"정인";
}

const O = {"甲":"wood","乙":"wood","寅":"wood","卯":"wood","丙":"fire","丁":"fire","巳":"fire","午":"fire","戊":"earth","己":"earth","辰":"earth","戌":"earth","丑":"earth","未":"earth","庚":"metal","辛":"metal","申":"metal","酉":"metal","壬":"water","癸":"water","亥":"water","子":"water"};

console.log("--- ENGINE v5.5 MASTER DATA TEST ---");

try {
    const dVal = "19880427", tVal = "0104";
    // Simulation of manual override
    let yp="戊辰", mp="乙卯", dp="丙寅", hp="戊子";

    const ds = dp[0];
    const AXE_DATA = [
        {l:"시주", h:hp, s1:getSS(ds, hp[0], O), s2:getSS(ds, hp[1], O)},
        {l:"일주", h:dp, s1:"본인", s2:getSS(ds, dp[1], O)},
        {l:"월주", h:mp, s1:getSS(ds, mp[0], O), s2:getSS(ds, mp[1], O)},
        {l:"년주", h:yp, s1:getSS(ds, yp[0], O), s2:getSS(ds, yp[1], O)}
    ];

    console.log("Master Pillars:", yp, mp, dp, hp);
    console.log("Il-ju:", AXE_DATA[1].h);
    console.log("Month Sipseong (s1):", AXE_DATA[2].s1);

    const reports = {
        "종합운세": { t: "Title", d: "당신의 " + AXE_DATA[1].h + " 일주와 " + AXE_DATA[2].s1 }
    };
    
    console.log("Report Result:", reports["종합운세"].d);
    
    if (AXE_DATA[1].h === "丙寅" && AXE_DATA[2].s1 === "정인") {
        console.log("[FINAL PASS] Override Logic Correct.");
    } else {
        throw new Error("Logic Mismatch in override path.");
    }

} catch (e) {
    console.error("[FAIL]:", e.message);
    process.exit(1);
}
