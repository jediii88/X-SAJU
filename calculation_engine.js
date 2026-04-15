
function get12Shinsal(dayBranch, targetBranch) {
    const samhap = {
        "寅": "火", "午": "火", "戌": "火",
        "申": "水", "子": "水", "辰": "水",
        "巳": "金", "酉": "金", "丑": "金",
        "亥": "木", "卯": "木", "未": "木"
    };
    const startIdx = { "火": "寅", "水": "申", "金": "巳", "木": "亥" };
    const branches = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
    const shinsalList = ["겁살","재살","천살","지살","연살","월살","망신","장성","반안","역마","육해","화개"];
    
    let base = samhap[dayBranch];
    if(!base) return "-";
    let startBranch = startIdx[base];
    let offset = branches.indexOf(targetBranch) - branches.indexOf(startBranch);
    if(offset < 0) offset += 12;
    return shinsalList[offset];
}

function calculateHealthScore(wuxing) {
    let score = 100;
    const total = Object.values(wuxing).reduce((a,b)=>a+b, 0) || 1;
    for(let k in wuxing) {
        let per = (wuxing[k] / total) * 100;
        if(per > 40) score -= (per - 40) * 2; 
        if(per < 5) score -= (10 - per) * 3;  
    }
    return Math.max(0, Math.round(score));
}

function getAllShinsal(pillars, ec, isUnknown) {
    const ds = pillars[1].h[0]; // 일간
    const result = {};
    const TARGETS = {
        '천을귀인': {"甲":"丑未","戊":"丑未","庚":"丑未","乙":"子申","己":"子申","丙":"亥酉","丁":"亥酉","壬":"卯巳","癸":"卯巳","辛":"寅午"},
        '문창귀인': {"甲":"巳","乙":"午","丙":"申","丁":"酉","戊":"申","己":"酉","庚":"亥","辛":"子","壬":"寅","癸":"卯"},
        '학당귀인': {"甲":"亥","乙":"午","丙":"寅","丁":"酉","戊":"寅","己":"酉","庚":"巳","辛":"子","壬":"申","癸":"卯"},
        '천복귀인': {"甲":"酉","乙":"申","丙":"子","丁":"亥","戊":"卯","己":"寅","庚":"午","辛":"巳","壬":"辰","癸":"미"},
        '암록': {"甲":"亥","乙":"戌","丙":"申","丁":"未","戊":"申","己":"未","庚":"巳","辛":"辰","壬":"寅","癸":"丑"},
        '태극귀인': {"甲":"子午","乙":"子午","丙":"卯酉","丁":"卯酉","戊":"辰戌丑未","己":"辰戌丑未","庚":"寅亥","辛":"寅亥","壬":"巳申","癸":"巳申"}
    };
    pillars.forEach((p, idx) => {
        if (isUnknown && idx === 0) return;
        const arr = [];
        const gz = (p.h[0] || '') + (p.h[1] || '');
        const branch = p.h[1];
        if(['甲辰','乙未','丙戌','丁丑','戊辰','壬戌','癸丑'].includes(gz)) arr.push('백호대살');
        if(['庚辰','庚戌','壬辰','壬戌','戊戌'].includes(gz)) arr.push('괴강살');
        for(let key in TARGETS) {
            let target = TARGETS[key][ds];
            if(target && target.includes(branch)) arr.push(key);
        }
        const hong = {"甲":"午","乙":"午","丙":"寅","丁":"未","戊":"辰","己":"辰","庚":"戌","辛":"酉","壬":"申","癸":"申"}[ds];
        if(hong === branch) arr.push('홍염살');
        result[p.n] = arr;
    });
    return result;
}

function getSipseong(dayStem, target) {
    const stems = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
    const wuxing = {"甲":"wood","乙":"wood","丙":"fire","丁":"fire","戊":"earth","己":"earth","庚":"metal","辛":"metal","壬":"water","癸":"water","子":"water","丑":"earth","寅":"wood","卯":"wood","辰":"earth","巳":"fire","午":"fire","未":"earth","申":"metal","酉":"metal","戌":"earth","亥":"water"};
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
    if (!birthDate || birthDate.length < 8) return { name, error: 'invalid' };
    let y = parseInt(birthDate.slice(0,4));
    let m = parseInt(birthDate.slice(4,6));
    let d = parseInt(birthDate.slice(6,8));
    let tVal = birthTime || '0000';
    let hr = parseInt(tVal.slice(0,2));
    let mn = parseInt(tVal.slice(2,4));

    let lunarObj, solarObj;
    if (isSolar) {
        solarObj = Solar.fromYmdHms(y, m, d, hr, mn, 0);
        lunarObj = solarObj.getLunar();
    } else {
        lunarObj = Lunar.fromYmdHms(y, isLeap ? -m : m, d, hr, mn, 0);
        solarObj = lunarObj.getSolar();
    }

    if (adjL && !isUnknown) {
        const dt = new Date(solarObj.getYear(), solarObj.getMonth() - 1, solarObj.getDay(), solarObj.getHour(), solarObj.getMinute());
        dt.setMinutes(dt.getMinutes() - 32);
        solarObj = Solar.fromYmdHms(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), dt.getHours(), dt.getMinutes(), 0);
        lunarObj = solarObj.getLunar();
    }

    const ec = lunarObj.getEightChar();
    const dayStem = ec.getDay()[0];
    const dayBranch = ec.getDay()[1];
    const pillars = [
        { n: '시주', h: isUnknown ? ['', ''] : ec.getTime() },
        { n: '일주', h: ec.getDay() },
        { n: '월주', h: ec.getMonth() },
        { n: '년주', h: ec.getYear() }
    ];

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
    
    const yun = ec.getYun(gender === 'M' ? 1 : 0);
    const daYunList = yun.getDaYun();
    const daewuns = [];
    for (let i = 1; i < daYunList.length; i++) {
        const dy = daYunList[i];
        const gz = dy.getGanZhi();
        daewuns.push({ age: dy.getStartAge(), gan: gz[0], zi: gz[1], sip: getSipseong(dayStem, gz[0]) + " / " + getSipseong(dayStem, gz[1]) });
    }

    return {
        name, gender, dayStem, dayBranch, pillars, wuxing: counts, sipseong: sipCounts,
        strengthText: ratio > 55 ? "신강" : (ratio < 45 ? "신약" : "중화"), strengthRatio: ratio,
        gongmang: ec.getDayXunKong(),
        healthScore: calculateHealthScore(counts),
        shinsal12: pillars.map(p => p.h[1] ? get12Shinsal(dayBranch, p.h[1]) : '-'),
        lunarDate: lunarObj.toString(), solarDate: solarObj.toString(),
        daewunNum: daYunList[1].getStartAge(), daewunList: daewuns,
        allShinsal: getAllShinsal(pillars, ec, isUnknown)
    };
}
