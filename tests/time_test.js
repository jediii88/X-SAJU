const { Solar } = require('lunar-javascript');
const s = Solar.fromYmdHms(1988, 3, 12, 1, 4, 0);
const l = s.getLunar();
const ec = l.getEightChar();
console.log('Year:', ec.getYear());
console.log('Month:', ec.getMonth());
console.log('Day:', ec.getDay());
console.log('Time:', ec.getTime());
