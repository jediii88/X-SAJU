const fs = require('fs');
// Load libs
const { Solar, Lunar } = require('./lunar.js');
const { HAN_COLOR, HAN_KOR, STEM_YANG, BRANCH_YANG, WUXING_ORDER, RELATION_LABELS, UNSUNG_MAP, BRANCH_HIDDEN, BRANCH_ANIMAL } = require('./constants.js');

// Mock getSipseong and get12Shinsal and getAllShinsal and calculateHealthScore
function getSipseong(dayStem, target) { return '십성'; }
function get12Shinsal(db, tb) { return '신살'; }
function getAllShinsal(p, ec, u) { return {}; }
function calculateHealthScore(w) { return 100; }

// The function
const code = fs.readFileSync('calculation_engine.js', 'utf8');
eval(code);

const result = calculateEightChar("Master", "19880312", "0104", "M", true, false, "KST", false, true);
console.log("Solar Result:", result.pillars.map(p => p.h.join('')).join(' '));

const result2 = calculateEightChar("Master", "19880125", "0104", "M", false, false, "KST", false, true);
console.log("Lunar Result:", result2.pillars.map(p => p.h.join('')).join(' '));
