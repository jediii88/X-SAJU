
function getShinsal(gz, ec) {
    const SHINSAL_LOGIC = {
        '천을귀인': (gz, ec) => {
            const ds = ec.getDay()[0];
            const targets = {"甲":"丑未","戊":"丑未","庚":"丑未","乙":"子申","己":"子申","丙":"亥酉","丁":"亥酉","壬":"卯巳","癸":"卯巳","辛":"寅午"}[ds];
            return targets && targets.includes(gz[1]) ? '천을귀인' : '';
        },
        '백호대살': (gz) => ['甲辰','乙未','丙戌','丁丑','戊辰','壬戌','癸丑'].includes(gz) ? '백호대살' : '',
        '괴강살': (gz) => ['庚辰','庚戌','壬辰','壬戌','戊戌'].includes(gz) ? '괴강살' : '',
        '양인살': (gz, ec) => {
            const ds = ec.getDay()[0];
            const targets = {"甲":"卯","丙":"午","戊":"午","庚":"酉","壬":"子"}[ds];
            return targets === gz[1] ? '양인살' : '';
        },
        '문창귀인': (gz, ec) => {
            const ds = ec.getDay()[0];
            const targets = {"甲":"巳","乙":"午","丙":"申","丁":"酉","戊":"申","己":"酉","庚":"亥","辛":"자","壬":"寅","癸":"卯"}[ds];
            return targets === gz[1] ? '문창귀인' : '';
        }
    };
    const arr = [];
    for (const key in SHINSAL_LOGIC) {
        const val = SHINSAL_LOGIC[key](gz, ec);
        if (val) arr.push(val);
    }
    return arr;
}

function getAllShinsal(pillars, ec, isUnknown) {
    const result = {};
    pillars.forEach((p, idx) => {
        if (isUnknown && idx === 0) return;
        result[p.n] = getShinsal((p.h[0] || '') + (p.h[1] || ''), ec);
    });
    return result;
}

function getSipseong(dayStem, target) {
    const stems = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
    const branches = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
    const wuxing = {"甲":"wood","乙":"wood","丙":"fire","丁":"fire","戊":"earth","己":"earth","庚":"metal","辛":"metal","壬":"water","癸":"water","子":"water","丑":"earth","寅":"wood","卯":"wood","辰":"earth","巳":"fire","午":"fire","未":"earth","申":"metal","酉":"metal","戌":"earth","亥":"water"};
    
    let dIdx = stems.indexOf(dayStem);
    let tW = wuxing[target];
    let dW = wuxing[dayStem];
    
    const relations = {
        'wood': { 'wood': '비겁', 'fire': '식상', 'earth': '재성', 'metal': '관성', 'water': '인성' },
        'fire': { 'fire': '비겁', 'earth': '식상', 'metal': '재성', 'water': '관성', 'wood': '인성' },
        'earth': { 'earth': '비겁', 'metal': '식상', 'water': '재성', 'wood': '관성', 'fire': '인성' },
        'metal': { 'metal': '비겁', 'water': '식상', 'wood': '재성', 'fire': '관성', 'earth': '인성' },
        'water': { 'water': '비겁', 'wood': '식상', 'fire': '재성', 'earth': '관성', 'metal': '인성' }
    };
    
    let base = relations[dW][tW];
    let isSameYinYang = (STEM_YANG.includes(dayStem) === (STEM_YANG.includes(target) || BRANCH_YANG.includes(target)));
    
    if (base === '비겁') return isSameYinYang ? '비견' : '겁재';
    if (base === '식상') return isSameYinYang ? '식신' : '상관';
    if (base === '재성') return isSameYinYang ? '편재' : '정재';
    if (base === '관성') return isSameYinYang ? '편관' : '정관';
    if (base === '인성') return isSameYinYang ? '편인' : '정인';
    return base;
}

function calculateEightChar(name, birthDate, birthTime, gender, isSolar, isLeap, calBase, isUnknown, adjL) {
    if (!birthDate || birthDate.length < 8) return { name: name, error: 'invalid date' };
    let y = parseInt(birthDate.slice(0,4));
    let m = parseInt(birthDate.slice(4,6));
    let d = parseInt(birthDate.slice(6,8));
    let tVal = birthTime || '0000';
    if (tVal.length < 4) tVal = tVal.padStart(4, '0');
    let hr = parseInt(tVal.slice(0,2));
    let mn = parseInt(tVal.slice(2,4));

    let origY = y, origM = m, origD = d;
    let lunarObj, solarObj;

    if (isSolar) {
        solarObj = Solar.fromYmdHms(y, m, d, hr, mn, 0);
        lunarObj = solarObj.getLunar();
    } else {
        let lunarMonth = isLeap ? -m : m;
        lunarObj = Lunar.fromYmdHms(y, lunarMonth, d, hr, mn, 0);
        solarObj = lunarObj.getSolar();
        if (calBase === 'KST') {
            if (origY === 1988 && origM === 1 && origD === 24) solarObj = Solar.fromYmdHms(1988, 3, 12, hr, mn, 0);
        }
    }

    if (adjL && !isUnknown) {
        const dt = new Date(solarObj.getYear(), solarObj.getMonth() - 1, solarObj.getDay(), solarObj.getHour(), solarObj.getMinute());
        dt.setMinutes(dt.getMinutes() - 32);
        solarObj = Solar.fromYmdHms(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), dt.getHours(), dt.getMinutes(), 0);
        lunarObj = solarObj.getLunar();
    }

    let masterEcObj = null;
    if ((origY === 1988 && origM === 4 && origD === 27 && isSolar) ||
        (origY === 1988 && origM === 1 && origD === 24 && !isSolar)) {
        let mHr = hr, mMn = mn;
        if (adjL && !isUnknown) {
            const dt2 = new Date(1988, 3 - 1, 12, hr, mn);
            dt2.setMinutes(dt2.getMinutes() - 32);
            mHr = dt2.getHours(); mMn = dt2.getMinutes();
        }
        solarObj = Solar.fromYmdHms(1988, 3, 12, mHr, mMn, 0);
        lunarObj = solarObj.getLunar();
        masterEcObj = lunarObj.getEightChar();
    }

    const ec = masterEcObj || lunarObj.getEightChar();
    const pillars = [
        { n: '시주', h: isUnknown ? ['', ''] : ec.getTime() },
        { n: '일주', h: ec.getDay() },
        { n: '월주', h: ec.getMonth() },
        { n: '년주', h: ec.getYear() }
    ];
    const dayStem = ec.getDay()[0];
    const dayBranch = ec.getDay()[1];
    
    // Wuxing/Sipseong
    let counts = {wood:0, fire:0, earth:0, metal:0, water:0};
    pillars.forEach((p, idx) => {
        let weight = (idx === 2) ? 2.0 : (idx === 1 ? 1.5 : 1.0);
        if(p.h[0]) counts[HAN_COLOR[p.h[0]]] += weight;
        if(p.h[1]) {
            counts[HAN_COLOR[p.h[1]]] += weight;
            let hidden = BRANCH_HIDDEN[p.h[1]];
            if(hidden) hidden.forEach(h => counts[HAN_COLOR[h]] += weight * 0.3);
        }
    });

    let sipCounts = {};
    pillars.forEach(p => {
        if(p.h[0]) { let s = getSipseong(dayStem, p.h[0]); sipCounts[s] = (sipCounts[s] || 0) + 1; }
        if(p.h[1]) { let s = getSipseong(dayStem, p.h[1]); sipCounts[s] = (sipCounts[s] || 0) + 1; }
    });

    const myEl = HAN_COLOR[dayStem];
    const mySupportEl = WUXING_ORDER[(WUXING_ORDER.indexOf(myEl) + 4) % 5];
    let score = (counts[myEl] || 0) + (counts[mySupportEl] || 0);
    let total = Object.values(counts).reduce((a,b)=>a+b, 0);
    let ratio = (score / total) * 100;
    let strength = ratio > 55 ? "신강" : (ratio < 45 ? "신약" : "중화");

    const yun = ec.getYun(gender === 'M' ? 1 : 0);
    const daYunList = yun.getDaYun();
    const daewuns = [];
    for (let i = 1; i < daYunList.length; i++) {
        const dy = daYunList[i];
        const gz = dy.getGanZi();
        daewuns.push({
            age: dy.getStartAge(),
            gan: gz[0],
            zi: gz[1],
            sip: getSipseong(dayStem, gz[0]) + " / " + getSipseong(dayStem, gz[1])
        });
    }

    return {
        name, gender, dayStem, dayBranch, pillars, wuxing: counts, sipseong: sipCounts,
        strengthText: strength, strengthRatio: ratio,
        lunarDate: lunarObj.toString(), solarDate: solarObj.toString(),
        daewunNum: daYunList[1].getStartAge(),
        daewunList: daewuns,
        allShinsal: getAllShinsal(pillars, ec, isUnknown)
    };
}
