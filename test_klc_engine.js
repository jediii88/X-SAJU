// KLC 엔진 검증 테스트
const KoreanLunarCalendar = require('korean-lunar-calendar');
const { klcGetEightChar, klcLunarToSolar, klcSolarToLunar } = require('./klc_engine');

const klc = new KoreanLunarCalendar();

console.log('='.repeat(60));
console.log('KLC 엔진 사주 계산 검증');
console.log('='.repeat(60));

let pass = 0, fail = 0;

function check(label, got, expect) {
    const ok = JSON.stringify(got) === JSON.stringify(expect);
    console.log(`${ok ? '✅' : '❌'} ${label}`);
    if (!ok) {
        console.log(`   결과: ${JSON.stringify(got)}`);
        console.log(`   예상: ${JSON.stringify(expect)}`);
    }
    ok ? pass++ : fail++;
}

// ── 사주 계산 검증 ──
// 주인님: 1988-03-12 01:04 양력, 경도보정 ON → 戊辰 乙卯 丙寅 戊子
const p1 = klcGetEightChar(1988, 3, 12, 1, 4, true, false, klc);
check('주인님 년주 戊辰', p1.year, ['戊','辰']);
check('주인님 월주 乙卯', p1.month, ['乙','卯']);
check('주인님 일주 丙寅', p1.day, ['丙','寅']);
check('주인님 시주 戊子', p1.hour, ['戊','子']);
check('주인님 음력 1월 24일', { m: p1.lunarMonth, d: p1.lunarDay }, { m: 1, d: 24 });

// 손흥민: 1992-07-08 경도보정 없음 → 壬申 丁未 乙酉
const p2 = klcGetEightChar(1992, 7, 8, 0, 0, false, true, klc);
check('손흥민 년주 壬申', p2.year, ['壬','申']);
check('손흥민 월주 丁未', p2.month, ['丁','未']);
check('손흥민 일주 乙酉', p2.day, ['乙','酉']);

// 아이유: 1993-05-16 → 癸酉 丁巳 丁酉
const p3 = klcGetEightChar(1993, 5, 16, 0, 0, false, true, klc);
check('아이유 년주 癸酉', p3.year, ['癸','酉']);
check('아이유 월주 丁巳', p3.month, ['丁','巳']);
check('아이유 일주 丁酉', p3.day, ['丁','酉']);

// 유재석: 1972-08-14 → 壬子 戊申 丁丑
const p4 = klcGetEightChar(1972, 8, 14, 0, 0, false, true, klc);
check('유재석 년주 壬子', p4.year, ['壬','子']);
check('유재석 월주 戊申', p4.month, ['戊','申']);
check('유재석 일주 丁丑', p4.day, ['丁','丑']);

// ── 양력↔음력 변환 검증 ──
console.log('\n-- 음양력 변환 --');
const l1 = klcSolarToLunar(1988, 3, 12, klc);
check('1988-03-12 양력→음력 1월 24일', { m: l1.month, d: l1.day }, { m: 1, d: 24 });

const s1 = klcLunarToSolar(1988, 1, 24, false, klc);
check('음1988-01-24 → 양력 1988-03-12', s1, { year: 1988, month: 3, day: 12 });

const s2 = klcLunarToSolar(2023, 1, 1, false, klc);
check('음2023-01-01 → 양력 2023-01-22', s2, { year: 2023, month: 1, day: 22 });

const s3 = klcLunarToSolar(2020, 4, 1, true, klc);
check('음2020-04-01(윤) → 양력 2020-05-23', s3, { year: 2020, month: 5, day: 23 });

console.log('\n' + '='.repeat(60));
console.log(`결과: ${pass}통과 / ${fail}실패 (총 ${pass+fail})`);
console.log(`정확도: ${Math.round(pass/(pass+fail)*100)}%`);
