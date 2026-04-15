const { Lunar } = require('lunar-javascript');
const ec = Lunar.fromYmdHms(1988, 3, 12, 1, 4, 0).getEightChar();
const yun = ec.getYun(1);
const dayun = yun.getDaYun();
console.log(dayun[0].getStartAge());
console.log(dayun[1].getStartAge());
