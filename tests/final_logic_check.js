const S = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const B = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

function getSipseong(dayStem, target) {
    const ELEMENTS = {"甲":"wood","乙":"wood","寅":"wood","卯":"wood","丙":"fire","丁":"fire","巳":"fire","午":"fire","戊":"earth","己":"earth","辰":"earth","戌":"earth","丑":"earth","未":"earth","庚":"metal","辛":"metal","申":"metal","酉":"metal","壬":"water","癸":"water","亥":"water","子":"water"};
    const order = ["wood","fire","earth","metal","water"];
    const di = order.indexOf(ELEMENTS[dayStem]), ti = order.indexOf(ELEMENTS[target]);
    const dy = ["甲","丙","戊","庚","壬"].includes(dayStem), ty = ["甲","丙","戊","庚","壬","寅","辰","午","申","戌","子"].includes(target);
    const diff = (ti - di + 5) % 5;
    if(diff===0) return (dy===ty)?"비견":"겁재"; if(diff===1) return (dy===ty)?"식신":"상관"; if(diff===2) return (dy===ty)?"편재":"정재"; if(diff===3) return (dy===ty)?"편관":"정관"; if(diff===4) return (dy===ty)?"편인":"정인";
}

function calculate(y, m, d, hh, mm) {
    // 1. Year Pillar (Corrected Ipchun logic)
    let y_base = y;
    if (m < 2 || (m === 2 && d < 4)) y_base--; // Simple Ipchun approx
    let y_idx = (y_base - 4) % 60; if(y_idx < 0) y_idx += 60;
    const yp = S[y_idx % 10] + B[y_idx % 12];

    // 2. Month Pillar (Corrected Jeolgi Table)
    const jeolgi = [5, 4, 5, 5, 5, 5, 7, 7, 7, 8, 7, 7]; // Approx Jeolgi days for Jan-Dec
    let m_idx = m - 1;
    if (d < jeolgi[m_idx]) m_idx--;
    if (m_idx < 0) m_idx = 11;
    const mb = B[(m_idx + 2) % 12];
    const ms = S[((y_idx % 10 % 5) * 2 + 2 + m_idx) % 10];
    const mp = ms + mb;

    // 3. Day Pillar (Reference: 2000-01-01 is Mu-Oh 戊午)
    const targetDate = new Date(y, m - 1, d);
    if (hh === 23 && mm >= 30) targetDate.setDate(targetDate.getDate() + 1);
    const baseDate = new Date(2000, 0, 1);
    const diffDays = Math.floor((targetDate - baseDate) / 86400000);
    let d_idx = (54 + diffDays) % 60; if(d_idx < 0) d_idx += 60;
    const dp = S[d_idx % 10] + B[d_idx % 12];

    // 4. Hour Pillar
    const totalMin = hh * 60 + mm;
    let h_branch_idx;
    if (totalMin >= 1410 || totalMin < 90) h_branch_idx = 0; // Jasi
    else h_branch_idx = Math.floor((totalMin - 90) / 120 + 1) % 12;
    const hs = S[((d_idx % 10 % 5) * 2 + h_branch_idx) % 10];
    const hp = hs + B[h_branch_idx];

    return [yp, mp, dp, hp];
}

// TEST CASE 1: Pinoki (1988-04-27 01:04 Solar) -> Expected: Mu-Jin, Eul-Myo, Byeong-In, Mu-Ja
const t1 = calculate(1988, 4, 27, 1, 4);
console.log("TEST 1 (1988-04-27 01:04):", t1.join(" "));
const match1 = (t1[0]==="戊辰" && t1[1]==="乙卯" && t1[2]==="丙寅" && t1[3]==="戊子");
console.log("MATCH 1:", match1 ? "PASS" : "FAIL");

// TEST CASE 2: Brother (1987-12-24 06:30 Solar) -> Expected: Jeong-Myo, Im-Ja, Jeong-Mi, Gye-Myo
const t2 = calculate(1987, 12, 24, 6, 30);
console.log("TEST 2 (1987-12-24 06:30):", t2.join(" "));
const match2 = (t2[0]==="丁卯" && t2[1]==="壬子" && t2[2]==="丁未" && t2[3]==="癸卯");
console.log("MATCH 2:", match2 ? "PASS" : "FAIL");
