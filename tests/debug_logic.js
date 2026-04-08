const S = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const B = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

function calculate(y, m, d, hh, mm) {
    // 1. Year Pillar
    let y_base = y;
    if (m < 2 || (m === 2 && d < 4)) y_base--; 
    let y_idx = (y_base - 4) % 60; if(y_idx < 0) y_idx += 60;
    const yp = S[y_idx % 10] + B[y_idx % 12];

    // 2. Month Pillar (Crucial Fix: Need proper offset and stem calculation)
    const jeolgi = [5, 4, 5, 5, 5, 5, 7, 7, 7, 8, 7, 7];
    let m_idx = m - 1;
    if (d < jeolgi[m_idx]) m_idx--;
    if (m_idx < 0) m_idx = 11;
    
    // Month Branch: Feb(Ipchun) is In(2)
    const mb_idx = (m_idx + 2) % 12;
    const mb = B[mb_idx];
    
    // Month Stem: Starts from Year Stem
    const ms_start = ((y_idx % 10 % 5) * 2 + 2) % 10;
    const ms = S[(ms_start + m_idx) % 10];
    const mp = ms + mb;

    // 3. Day Pillar (Reference: 1988-04-27 is Byeong-In 丙寅)
    // Reference 1988-04-27 -> Index: Byeong(2) In(2) -> 60-cycle: 2
    const refDate = new Date(1988, 3, 27); // Month is 0-indexed
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
    const hs = S[(hs_start + hb_idx) % 10];
    const hp = hs + B[hb_idx];

    return [yp, mp, dp, hp];
}

console.log("PINOKI (1988-04-27 01:04):", calculate(1988, 4, 27, 1, 4).join(" "));
console.log("BROTHER (1987-12-24 06:30):", calculate(1987, 12, 24, 6, 30).join(" "));
