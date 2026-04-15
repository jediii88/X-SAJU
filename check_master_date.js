const {Solar, Lunar} = require('lunar-javascript');

function check() {
    // Master's input: 1988-03-12 (Lunar) 01:04
    let lunar = Lunar.fromYmdHms(1988, 3, 12, 1, 4, 0);
    let solar = lunar.getSolar();
    console.log("Solar Date:", solar.toFullString());

    // Corrected time (-32m)
    let y = solar.getYear(), m = solar.getMonth(), d = solar.getDay(), hr = solar.getHour(), mn = solar.getMinute();
    let dt = new Date(y, m-1, d, hr, mn);
    dt.setMinutes(dt.getMinutes() - 32);
    
    let solarCorr = Solar.fromYmdHms(dt.getFullYear(), dt.getMonth()+1, dt.getDate(), dt.getHours(), dt.getMinutes(), 0);
    let lunarCorr = solarCorr.getLunar();
    let ec = lunarCorr.getEightChar();

    console.log("Pillars (Corrected Solar 00:32):");
    console.log("Year: ", ec.getYear());
    console.log("Month:", ec.getMonth());
    console.log("Day:  ", ec.getDay());
    console.log("Hour: ", ec.getTime());
}

check();
