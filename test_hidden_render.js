const { Lunar, Solar } = require('./node_modules/lunar-javascript/index.js');
const BRANCH_HIDDEN = {
    '子': ['壬','癸'], '丑': ['癸','辛','己'], '寅': ['戊','丙','甲'], '卯': ['甲','乙'],
    '辰': ['乙','癸','戊'], '巳': ['戊','庚','丙'], '午': ['丙','己','丁'], '未': ['丁','乙','己'],
    '申': ['戊','壬','庚'], '酉': ['庚','辛'], '戌': ['辛','丁','戊'], '亥': ['戊','甲','壬']
};
const HAN_COLOR = {"甲":"wood","乙":"wood","寅":"wood","卯":"wood","丙":"fire","丁":"fire","巳":"fire","午":"fire","戊":"earth","己":"earth","辰":"earth","戌":"earth","丑":"earth","未":"earth","庚":"metal","辛":"metal","申":"metal","酉":"metal","壬":"water","癸":"water","亥":"water","子":"water"};
const WUXING_ORDER = ['wood','fire','earth','metal','water'];
function isYang(ch) { return ["甲","丙","戊","庚","壬","子","寅","辰","午","申","戌"].includes(ch); }

function getSipseong(dayStem, target) {
    if (!dayStem || !target) return '';
    const t = target[0];
    const dIdx = WUXING_ORDER.indexOf(HAN_COLOR[dayStem]);
    const tIdx = WUXING_ORDER.indexOf(HAN_COLOR[t]);
    if (dIdx === -1 || tIdx === -1) return '';
    const diff = (tIdx - dIdx + 5) % 5;
    const same = isYang(dayStem) === isYang(t);
    return [["비견","겁재"],["식신","상관"],["편재","정재"],["편관","정관"],["편인","정인"]][diff][same ? 0 : 1];
}

function getHidden(branch, dayStem) {
    return (BRANCH_HIDDEN[branch] || []).map(ch => {
        const ss = getSipseong(dayStem, ch);
        return `<div style="margin-bottom:4px;"><span class="${HAN_COLOR[ch]}">${ch}</span> <span style="font-size:10px; color:#777; background:#111; padding:2px 4px; border-radius:3px;">${ss}</span></div>`;
    }).join('');
}

console.log(getHidden('寅', '丙').replace(/<br>/g, ''));