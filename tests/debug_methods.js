const {Solar, Lunar} = require('lunar-javascript');
const solar = Solar.fromYmdHms(1988, 3, 12, 1, 4, 0);
const lunar = solar.getLunar();
const ec = lunar.getEightChar();
console.log('Year DiShi:', ec.getYearDiShi());
console.log('Month DiShi:', ec.getMonthDiShi());
console.log('Day DiShi:', ec.getDayDiShi());
console.log('Time DiShi:', ec.getTimeDiShi());
