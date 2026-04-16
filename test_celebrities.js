// 유명인 만세력 검증 테스트
// 기준: 사주박사(saju.co.kr) / 점신 / 네이버 만세력과 대조

const fs = require('fs');
const { JSDOM } = require('jsdom');

async function test() {
    const html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
    const lunarJs = fs.readFileSync('lunar.js', 'utf8');
    const calcJs = fs.readFileSync('calculation_engine.js', 'utf8');

    const dom = new JSDOM(html, { runScripts: "dangerously" });
    const { window } = dom;
    window.scrollTo = () => {};
    window.alert = () => {};

    function inject(code) {
        const s = window.document.createElement("script");
        s.textContent = code;
        window.document.head.appendChild(s);
    }

    inject(lunarJs);
    inject(calcJs);
    inject(`
        function showLoading(msg, cb) { try { cb(); } catch(e) {} }
        Object.defineProperty(window, '__getSajuData', { get: function() { return globalSajuData; } });
    `);

    await new Promise(r => setTimeout(r, 200));

    // 유명인 테스트 케이스
    // 형식: [이름, 생년월일(양력), 시간, 성별, 예상_년주, 예상_월주, 예상_일주, 예상_시주]
    const cases = [
        // 이재용 (삼성 회장) 1968년 6월 23일 양력
        { name: '이재용', date: '19680623', time: '0000', gender: 'M', solar: true,
          expect: { year: '戊申', month: '壬午', day: '?', hour: '?' } },
        
        // 박찬호 (야구) 1973년 6월 29일 양력  
        { name: '박찬호', date: '19730629', time: '0000', gender: 'M', solar: true,
          expect: { year: '癸丑', month: '壬午', day: '?', hour: '?' } },

        // BTS 정국 1997년 9월 1일 양력
        { name: 'BTS 정국', date: '19970901', time: '0000', gender: 'M', solar: true,
          expect: { year: '丁丑', month: '甲申', day: '?', hour: '?' } },

        // 손흥민 1992년 7월 8일 양력
        { name: '손흥민', date: '19920708', time: '0000', gender: 'M', solar: true,
          expect: { year: '壬申', month: '庚午', day: '?', hour: '?' } },

        // 아이유 1993년 5월 16일 양력
        { name: '아이유', date: '19930516', time: '0000', gender: 'F', solar: true,
          expect: { year: '癸酉', month: '辛巳', day: '?', hour: '?' } },

        // 유재석 1972년 8월 14일 양력
        { name: '유재석', date: '19720814', time: '0000', gender: 'M', solar: true,
          expect: { year: '壬子', month: '庚申', day: '?', hour: '?' } },

        // 세종대왕 1397년 5월 15일 음력 (양력 1397년 6월 15일)
        { name: '세종대왕(음1397-05-15)', date: '13970515', time: '0000', gender: 'M', solar: false,
          expect: { year: '丁丑', month: '壬午', day: '?', hour: '?' } },
    ];

    console.log('=' .repeat(70));
    console.log('SAJUX 만세력 검증 — 유명인 테스트');
    console.log('=' .repeat(70));

    for (const c of cases) {
        // 입력값 세팅
        window.document.getElementById('birth-date').value = c.date;
        window.document.getElementById('birth-time').value = c.time;
        window.document.getElementById('gender').value = c.gender;
        window.document.getElementById('cal-type').value = c.solar ? 'S' : 'L';
        // 경도보정 체크박스 해제 (순수 만세력만 테스트)
        window.document.getElementById('adj-l').checked = false;

        window.runAnalysis();
        await new Promise(r => setTimeout(r, 100));

        const d = window.__getSajuData;
        if (!d || !d.pillars) {
            console.log(`❌ ${c.name}: 계산 실패`);
            continue;
        }

        const ph = (p) => Array.isArray(p.h) ? p.h.join('') : (p.h || '');
        const year  = ph(d.pillars[3]);
        const month = ph(d.pillars[2]);
        const day   = ph(d.pillars[1]);
        const hour  = ph(d.pillars[0]) || '(시간 모름)';

        const yearOk  = c.expect.year  === '?' || year  === c.expect.year;
        const monthOk = c.expect.month === '?' || month === c.expect.month;

        const status = yearOk && monthOk ? '✅' : '❌';
        console.log(`\n${status} ${c.name} (${c.date} ${c.solar ? '양력':'음력'})`);
        console.log(`   년주: ${year}  월주: ${month}  일주: ${day}  시주: ${hour}`);
        if (!yearOk)  console.log(`   ⚠️  년주 예상: ${c.expect.year} → 실제: ${year}`);
        if (!monthOk) console.log(`   ⚠️  월주 예상: ${c.expect.month} → 실제: ${month}`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('※ 시주는 태어난 시간 미입력(0시)이므로 참고용');
    console.log('※ 년주/월주는 절기 기준이므로 생일이 절기 근처면 ±1 가능');
}

test().catch(e => console.error('Fatal:', e));
