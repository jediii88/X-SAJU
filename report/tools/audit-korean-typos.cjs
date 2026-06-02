'use strict';
/**
 * 한국어 서사 오타·이중 종결 스모크 테스트
 * 실행: node report/tools/audit-korean-typos.cjs
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const corePath = path.join(__dirname, '..', 'report-core.js');
const full = fs.readFileSync(corePath, 'utf8');
const fnStart = full.indexOf('function fixKoreanNarrativeGlitch(s)');
const fnEnd = full.indexOf('\nSAJUX_VOICE.sipseongModernPrompt', fnStart);
if (fnStart < 0 || fnEnd < 0) {
  console.error('fixKoreanNarrativeGlitch not found');
  process.exit(1);
}
const sandbox = {};
vm.runInNewContext(full.slice(fnStart, fnEnd), sandbox);
const fix = sandbox.fixKoreanNarrativeGlitch;
if (typeof fix !== 'function') {
  console.error('fixKoreanNarrativeGlitch export failed');
  process.exit(1);
}

const cases = [
  ['이중 종결', '좋은 흐름입니다입니다.', '좋은 흐름입니다.'],
  ['구어+격식', '편해요입니다.', '편해요.'],
  ['호칭 중복', '장경현님의의 사주', '장경현님의 사주'],
  ['월운 오타', '3월은 균형 결의 달이군요.', '3월은 균형 흐름의 달이군요.'],
  ['비겹', '비겹 기운', '비견 기운'],
  ['풍요롭은', '풍요롭은 관계', '풍요로운 관계'],
  ['괄호 조사', '홍길동(이)가 간다', '홍길동 간다'],
];

let fail = 0;
for (const [label, input, expect] of cases) {
  const out = fix(input);
  if (out !== expect) {
    console.error('FAIL', label, '\n  in:', input, '\n  got:', out, '\n  want:', expect);
    fail++;
  } else {
    console.log('ok', label);
  }
}

const scanBody = full.slice(0, fnStart) + full.slice(fnEnd);
const badInSource = [
  [/결의\s*달이군요/g, '결의 달 (템플릿 오타)'],
  [/님의의/g, '님의의'],
  [/비겹/g, '비겹'],
  [/황혘/g, '황혘'],
  [/입니다입니다/g, '입니다입니다'],
];
for (const [re, label] of badInSource) {
  const m = scanBody.match(re);
  if (m && m.length) {
    console.error('SOURCE still has', label, '×', m.length);
    fail++;
  }
}

if (fail) {
  console.error('\n' + fail + ' issue(s)');
  process.exit(1);
}
console.log('\nAll typo checks passed.');
