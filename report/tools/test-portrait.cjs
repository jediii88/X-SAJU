'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const corePath = path.join(__dirname, '..', 'report-core.js');
const code = fs.readFileSync(corePath, 'utf8');

const mockData = {
  name: '테스트',
  dayStem: '甲',
  dayBranch: '子',
  monthBranch: '寅',
  yearBranch: '辰',
  strengthText: '신강',
  yong: 'water', hee: 'wood', gi: 'metal', goo: 'earth',
  sipseong: { '비견': 1, '편재': 2, '정관': 1 },
  wuxing: { wood: 2, fire: 1, earth: 2, metal: 1, water: 2 },
  coverSolarY: 1990,
  birthYear: 1990,
  daeunRows: [
    { name: '乙丑', age: 8 },
    { name: '丙寅', age: 18 },
    { name: '丁卯', age: 28 },
    { name: '戊辰', age: 38 },
    { name: '己巳', age: 48 },
    { name: '庚午', age: 58 },
    { name: '辛未', age: 68 },
    { name: '壬申', age: 78 },
  ],
  pillars: [
    { h: ['癸', '亥'] },
    { h: ['甲', '子'] },
    { h: ['丙', '寅'] },
    { h: ['戊', '辰'] },
  ],
};

const sandbox = {
  console,
  document: { getElementById: () => ({ innerHTML: '', style: {} }) },
  ILJU_60_DB: {},
  HAN_KOR: { '甲': '갑', '子': '자', '寅': '인', '辰': '진' },
  Solar: undefined,
  addEventListener: function () {},
  removeEventListener: function () {},
  location: { href: 'http://localhost/' },
  print: function () {},
};
sandbox.window = sandbox;
sandbox.ILJU_60_DB['甲子'] = {
  image: '큰 바다 위의 소나무',
  strength: '끈기',
  weakness: '고집',
  career: '기획',
};

vm.createContext(sandbox);
try {
  vm.runInContext(code, sandbox, { filename: 'report-core.js', timeout: 15000 });
} catch (e) {
  console.error('LOAD FAIL', e.message);
  process.exit(1);
}

function safeCall(fn, label) {
  try {
    var out = fn() || '';
    if (typeof out === 'string' && out.indexOf('undefined') !== -1) {
      console.warn(label + ': HAS undefined -> safeCall would return EMPTY');
      return '';
    }
    return out;
  } catch (e) {
    console.error(label + ': THREW', e.message);
    return '';
  }
}

const card = safeCall(() => sandbox.buildIljuProfileCard(mockData), 'ilju');
const inner = safeCall(() => sandbox.buildPersonalPortraitInnerHtml(mockData), 'inner');
const pano = safeCall(() => sandbox.buildLifePanoramaSection(mockData), 'pano');

console.log('inner length', inner.length, 'has 한 줄기', inner.includes('한 줄기'));
console.log('card length', card.length, 'has narrative', card.includes('personal-portrait'));
console.log('pano length', pano.length);
if (!inner.length) console.log('INNER EMPTY');
if (inner.includes('undefined')) console.log('INNER has undefined literal');
