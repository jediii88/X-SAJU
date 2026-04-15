const {Solar, Lunar} = require('lunar-javascript');

function getSipseong(dayStem, target) {
    const HAN_COLOR = {"甲":"wood","乙":"wood","寅":"wood","卯":"wood","丙":"fire","丁":"fire","巳":"fire","午":"fire","戊":"earth","己":"earth","辰":"earth","戌":"earth","丑":"earth","未":"earth","庚":"metal","辛":"metal","申":"metal","酉":"metal","壬":"water","癸":"water","亥":"water","子":"water"};
    if(!target || !dayStem) return "";
    const order = ["wood","fire","earth","metal","water"];
    const dIdx = order.indexOf(HAN_COLOR[dayStem]), tIdx = order.indexOf(HAN_COLOR[target[0]]);
    if(dIdx === -1 || tIdx === -1) return "";
    const diff = (tIdx - dIdx + 5) % 5;
    const isSameYang = ["甲","丙","戊","庚","壬"].includes(dayStem) === ["甲","丙","戊","庚","壬","寅","辰","午","申","戌","子"].includes(target[0]);
    return [["비견","겁재"],["식신","상관"],["편재","정재"],["편관","정관"],["편인","정인"]][diff][isSameYang ? 0 : 1];
}

try {
    const y=1988, m=3, d=12, hr=1, mn=4;
    let lunar = Solar.fromYmdHms(y, m, d, hr, mn, 0).getLunar();
    const ec = lunar.getEightChar();
    
    console.log("Year:", ec.getYear().getGanZhi());
    console.log("Month:", ec.getMonth().getGanZhi());
    console.log("Day:", ec.getDay().getGanZhi());
    console.log("Time:", ec.getTime().getGanZhi());
    
    const pillars = [
        {n:"시주", h:ec.getTime().getGanZhi()},
        {n:"일주", h:ec.getDay().getGanZhi()},
        {n:"월주", h:ec.getMonth().getGanZhi()},
        {n:"년주", h:ec.getYear().getGanZhi()}
    ];
    const ds = pillars[1].h[0];
    console.log("Day Stem:", ds);
    
    pillars.forEach(p => {
        const h1 = p.h[0], h2 = p.h[1];
        console.log(`${p.n}: ${h1}${h2}, Sipseong1: ${getSipseong(ds, h1)}, Sipseong2: ${getSipseong(ds, h2)}`);
    });

    const yun = ec.getYun();
    const daYuns = yun.getDaYun();
    for(let i=0; i<8; i++) {
        const dy = daYuns[i];
        const gz = dy.getGanZhi();
        console.log(`Daeun ${i}: Age ${dy.getStartAge()}, Pillar ${gz}, Sipseong: ${getSipseong(ds, gz[0])}`);
    }
} catch(e) {
    console.error(e);
}
