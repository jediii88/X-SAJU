'use strict';
/**
 * 12신살·삼합 기반 신살 규칙 스모크 테스트 (만세력 엔진 lunar.js + report-core.js 신살 스니펫).
 * 실행: node report/tools/verify-shinsal.cjs
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { Lunar, Solar } = require('../lunar.js');

const corePath = path.join(__dirname, '..', 'report-core.js');
const full = fs.readFileSync(corePath, 'utf8');
const startA = full.indexOf('var BRANCH_RING = ');
const endA = full.indexOf('\nfunction go(');
const startB = full.indexOf('window.TWELVE_SHINSAL_KEYS');
const endB = full.indexOf('\nfunction buildRelationLines(');
if (startA < 0 || endA < 0 || startB < 0 || endB < 0) {
  throw new Error('report-core.js: 신살 추출 마커를 찾지 못했습니다.');
}
const snippet = full.slice(startA, endA) + '\n' + full.slice(startB, endB);

const sandbox = { console, window: {} };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInNewContext(snippet, sandbox);

const getTwelveShinsal = sandbox.getTwelveShinsal;
const getExtraShinsal = sandbox.getExtraShinsal;
const sanHePackFromBranch = sandbox.sanHePackFromBranch;

if (typeof getTwelveShinsal !== 'function') throw new Error('getTwelveShinsal not loaded');

/** 삼합 국별 표준 역마·도화·화개·겁·망신·장성 지지 (연지 또는 일지 기준 동일) */
const SANHE = {
  waters: { branches: ['申', '子', '辰'], yeoma: '寅', dohwa: '酉', hwagae: '辰', geop: '巳', mangsin: '亥', jangseong: '子' },
  wood: { branches: ['亥', '卯', '未'], yeoma: '巳', dohwa: '子', hwagae: '未', geop: '申', mangsin: '寅', jangseong: '卯' },
  fire: { branches: ['寅', '午', '戌'], yeoma: '申', dohwa: '卯', hwagae: '戌', geop: '亥', mangsin: '巳', jangseong: '午' },
  metal: { branches: ['巳', '酉', '丑'], yeoma: '亥', dohwa: '午', hwagae: '丑', geop: '寅', mangsin: '申', jangseong: '酉' },
};

function mockEc(yearBranch, dayBranch) {
  const y = `甲${yearBranch}`;
  const d = `甲${dayBranch}`;
  return {
    getYear: () => y,
    getMonth: () => '丙寅',
    getDay: () => d,
    getTime: () => '甲子',
  };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

for (const group of Object.values(SANHE)) {
  for (const ref of group.branches) {
    const ec = mockEc(ref, ref); // 년·일 같은 삼합 지지로 교차 일지 간섭 제거
    const checks = [
      ['역마살', group.yeoma],
      ['도화살', group.dohwa],
      ['화개살', group.hwagae],
      ['겁살', group.geop],
      ['망신살', group.mangsin],
      ['장성살', group.jangseong],
    ];
    for (const [name, ji] of checks) {
      const gz = `甲${ji}`;
      const twelve = getTwelveShinsal(gz, ec);
      assert(twelve.includes(name), `${name}: 년지=${ref} pillar=${gz} got=[${twelve.join(',')}]`);
    }
  }
}

// 반안·재살·월살: 일지 기준 sanHePack와 일치하는지
(function () {
  const ec = mockEc('戌', '亥'); // 년지 영향 최소
  const db = ec.getDay()[1];
  const pack = sanHePackFromBranch(db);
  assert(pack, 'sanHePackFromBranch(亥)');
  const ban = `戊${pack.banAn}`;
  const wo = `戊${pack.woSal}`;
  const jae = `戊${pack.jaeSal}`;
  const tBan = getTwelveShinsal(ban, ec);
  const tWo = getTwelveShinsal(wo, ec);
  const tJae = getTwelveShinsal(jae, ec);
  assert(tBan.includes('반안살'), `반안살 expected at ${pack.banAn}`);
  assert(tWo.includes('월살'), `월살 expected at ${pack.woSal}`);
  assert(tJae.includes('재살'), `재살 expected at ${pack.jaeSal}`);
})();

// 급각살: 일지 충 방향 (표본 일지子 → 미지)
(function () {
  const ec = mockEc('戌', '子');
  const gz = '戊未';
  const t = getTwelveShinsal(gz, ec);
  assert(t.includes('급각살'), `급각살 일지子 pillar未`);
})();

// 기타신살 스모크: 천을귀인 일간 기준
(function () {
  const ec = {
    getYear: () => '庚申',
    getMonth: () => '戊寅',
    getDay: () => '甲子',
    getTime: () => '甲子',
  };
  const ex = getExtraShinsal('乙丑', ec); // 일간 甲 → 천을 축·미
  assert(ex.includes('천을귀인'), `천을귀인 甲일 축지`);
})();

console.log('verify-shinsal: OK');
