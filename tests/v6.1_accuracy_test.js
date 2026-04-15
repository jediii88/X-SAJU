const lunarLib = require('/home/node/.openclaw/workspace/releases/v5.1/assets/lunar.js');
const Solar = lunarLib.Solar;

// Test for 1988-04-27 01:04 with -32m adjustment
const d = new Date(1988, 3, 27, 1, 4); // Month is 0-indexed
d.setMinutes(d.getMinutes() - 32);
console.log("Adjusted Date:", d.toLocaleString());

const solar = Solar.fromDate(d);
const lunar = solar.getLunar();
const ec = lunar.getEightChar();

console.log("Pillars:", ec.getYear(), ec.getMonth(), ec.getDay(), ec.getTime());
