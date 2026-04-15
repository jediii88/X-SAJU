const {Solar, Lunar} = require('lunar-javascript');

function test() {
    // 1988-03-12 01:04
    let y = 1988, m = 3, d = 12, hr = 1, mn = 4;
    
    // Apply -32m correction (as in the HTML)
    let dt = new Date(y, m-1, d, hr, mn);
    dt.setMinutes(dt.getMinutes() - 32);
    
    let y2 = dt.getFullYear();
    let m2 = dt.getMonth() + 1;
    let d2 = dt.getDate();
    let hr2 = dt.getHours();
    let mn2 = dt.getMinutes();

    console.log(`Corrected Time: ${y2}-${m2}-${d2} ${hr2}:${mn2}`);

    let solar = Solar.fromYmdHms(y2, m2, d2, hr2, mn2, 0);
    let lunar = solar.getLunar();
    let ec = lunar.getEightChar();

    console.log("Pillars:");
    console.log("Year: ", ec.getYear());
    console.log("Month:", ec.getMonth());
    console.log("Day:  ", ec.getDay());
    console.log("Hour: ", ec.getTime());

    const expected = {
        year: "戊辰",
        month: "乙卯",
        day: "丙寅",
        hour: "戊子"
    };

    let pass = true;
    if (ec.getYear() !== expected.year) pass = false;
    if (ec.getMonth() !== expected.month) pass = false;
    if (ec.getDay() !== expected.day) pass = false;
    if (ec.getTime() !== expected.hour) pass = false;

    if (pass) {
        console.log("SUCCESS: Logic matches Master Reference.");
    } else {
        console.log("FAILURE: Logic mismatch!");
    }
}

test();
