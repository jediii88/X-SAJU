const S = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const B = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

// Precise Jeolgi Entry Times (Simplified for 1980-2000 range)
function getJeolgiIdx(y, m, d, hh) {
    const dates = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7]; // Approx days for each month start
    let idx = m - 1;
    if (d < dates[idx]) idx--;
    if (idx < 0) idx = 11;
    return idx;
}

function calculate(y, m, d, hh, mm) {
    // 1. Year Pillar
    let y_base = y;
    if (m < 2 || (m === 2 && d < 4)) y_base--; 
    let y_idx = (y_base - 4) % 60; if(y_idx < 0) y_idx += 60;
    const yp = S[y_idx % 10] + B[y_idx % 12];

    // 2. Month Pillar
    let m_idx = getJeolgiIdx(y, m, d, hh);
    const mb_idx = (m_idx + 2) % 12;
    const ms_start = ((y_idx % 10 % 5) * 2 + 2) % 10;
    const ms_idx = (ms_start + m_idx) % 10;
    const mp = S[ms_idx] + B[mb_idx];

    // 3. Day Pillar (Reference: 1988-03-12 Lunar -> 1988-04-27 Solar is 丙寅)
    const refDate = new Date(1988, 3, 27); 
    const targetDate = new Date(y, m - 1, d);
    if (hh === 23 && mm >= 30) targetDate.setDate(targetDate.getDate() + 1);
    const diffDays = Math.round((targetDate - refDate) / 86400000);
    let d_idx = (2 + diffDays) % 60; if(d_idx < 0) d_idx += 60;
    const dp = S[d_idx % 10] + B[d_idx % 12];

    // 4. Hour Pillar
    const totalMin = hh * 60 + mm;
    let hb_idx;
    if (totalMin >= 1410 || totalMin < 90) hb_idx = 0; 
    else hb_idx = Math.floor((totalMin - 90) / 120 + 1) % 12;
    const hs_start = ((d_idx % 10 % 5) * 2) % 10;
    const hs_idx = (hs_start + hb_idx) % 10;
    const hp = S[hs_idx] + B[hb_idx];

    return [yp, mp, dp, hp];
}

// TEST 1
const p1 = calculate(1988, 4, 27, 1, 4);
console.log("PINOKI (1988-04-27 01:04):", p1.join(" "));

// TEST 2 (Brother: 1987-12-24 06:30 Solar)
// Jeong-Myo(4) Im-Ja(49) Jeong-Mi(44) Gye-Myo(40)
const p2 = calculate(1987, 12, 24, 6, 30);
console.log("BROTHER (1987-12-24 06:30):", p2.join(" "));
