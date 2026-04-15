const { Lunar, Solar } = require('./node_modules/lunar-javascript/index.js');

function test(y1, m1, d1, y2, m2, d2, hr, mn) {
    // Solar input
    let solar1 = Solar.fromYmdHms(y1, m1, d1, hr, mn, 0);
    let lunar1 = solar1.getLunar();
    let ec1 = lunar1.getEightChar();
    console.log(`Solar ${y1}-${m1}-${d1} => Lunar ${lunar1.getYear()}-${lunar1.getMonth()}-${lunar1.getDay()}`);
    console.log(`Pillars (from Solar): ${ec1.getYear()} ${ec1.getMonth()} ${ec1.getDay()} ${ec1.getTime()}`);

    // Lunar input
    let lunar2 = Lunar.fromYmdHms(y2, m2, d2, hr, mn, 0);
    let solar2 = lunar2.getSolar();
    let ec2 = lunar2.getEightChar();
    console.log(`Lunar ${y2}-${m2}-${d2} => Solar ${solar2.getYear()}-${solar2.getMonth()}-${solar2.getDay()}`);
    console.log(`Pillars (from Lunar): ${ec2.getYear()} ${ec2.getMonth()} ${ec2.getDay()} ${ec2.getTime()}`);
}

// 2024-04-09 Solar is Lunar 2024-03-01
test(2024, 4, 9, 2024, 3, 1, 12, 0);
