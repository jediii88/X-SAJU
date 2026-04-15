

function get12Shinsal(dayBranch, targetBranch) {
    const table = {
        "申": ["지살","연살","월살","망신","장성","반안","역마","육해","화개","겁살","재살","천살"],
        "子": ["지살","연살","월살","망신","장성","반안","역마","육해","화개","겁살","재살","천살"],
        "辰": ["지살","연살","월살","망신","장성","반안","역마","육해","화개","겁살","재살","천살"],
        "亥": ["지살","연살","월살","망신","장성","반안","역마","육해","화개","겁살","재살","천살"],
        "卯": ["지살","연살","월살","망신","장성","반안","역마","육해","화개","겁살","재살","천살"],
        "未": ["지살","연살","월살","망신","장성","반안","역마","육해","화개","겁살","재살","천살"],
        "寅": ["지살","연살","월살","망신","장성","반안","역마","육해","화개","겁살","재살","천살"],
        "午": ["지살","연살","월살","망신","장성","반안","역마","육해","화개","겁살","재살","천살"],
        "戌": ["지살","연살","월살","망신","장성","반안","역마","육해","화개","겁살","재살","천살"],
        "巳": ["지살","연살","월살","망신","장성","반안","역마","육해","화개","겁살","재살","천살"],
        "酉": ["지살","연살","월살","망신","장성","반안","역마","육해","화개","겁살","재살","천살"],
        "丑": ["지살","연살","월살","망신","장성","반안","역마","육해","화개","겁살","재살","천살"]
    };
    // 실제 12신살 조견표 로직 (삼합 기준)
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
    let startBranch = startIdx[base];
    let offset = branches.indexOf(targetBranch) - branches.indexOf(startBranch);
    if(offset < 0) offset += 12;
    return shinsalList[offset];
}


function calculateHealthScore(wuxing) {
    let score = 100;
    const total = Object.values(wuxing).reduce((a,b)=>a+b, 0);
    for(let k in wuxing) {
        let per = (wuxing[k] / total) * 100;
        if(per > 40) score -= (per - 40) * 2; // 태과(과다)
        if(per < 5) score -= (10 - per) * 3;  // 고립(결핍)
    }
    return Math.max(0, Math.round(score));
}

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
    if (!birthDate || birthDate.length < 8) 
    const healthScore = calculateHealthScore(counts);
    const shinsal12 = pillars.map(p => p.h[1] ? get12Shinsal(dayBranch, p.h[1]) : '-');

    return {
        name, gender, dayStem, dayBranch, pillars, wuxing: counts, sipseong: sipCounts,
        strengthText: strength, strengthRatio: ratio,
        gongmang: ec.getDayXunKong(),
        healthScore: healthScore,
        shinsal12: shinsal12,
        lunarDate: lunarObj.toString(), solarDate: solarObj.toString(),
        daewunNum: daYunList[1].getStartAge(),
        daewunList: daewuns,
        allShinsal: getAllShinsal(pillars, ec, isUnknown)
    };
}

