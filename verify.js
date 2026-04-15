const { Lunar, Solar } = require('./node_modules/lunar-javascript/index.js');
let s = Solar.fromYmdHms(1988, 3, 12, 1, 4, 0);
console.log("Solar:", s.getLunar().getEightChar().toString());
let l = Lunar.fromYmdHms(1988, 3, 12, 1, 4, 0);
console.log("Lunar:", l.getEightChar().toString());