const { Lunar, Solar } = require('./node_modules/lunar-javascript/index.js');
console.log("April 4:", Solar.fromYmdHms(1988, 4, 4, 12, 0, 0).getLunar().getEightChar().getMonth());
console.log("April 5:", Solar.fromYmdHms(1988, 4, 5, 12, 0, 0).getLunar().getEightChar().getMonth());
console.log("April 27:", Solar.fromYmdHms(1988, 4, 27, 12, 0, 0).getLunar().getEightChar().getMonth());
