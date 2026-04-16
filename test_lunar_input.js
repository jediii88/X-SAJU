// 음력 입력 → 사주 계산 정확도 최종 검증
const fs = require('fs');
const { JSDOM } = require('jsdom');

async function test() {
    const html = fs.readFileSync('X-SAJU_MASTER.html', 'utf8');
    const lunarJs = fs.readFileSync('lunar.js', 'utf8');
    const klcJs = fs.readFileSync('klc.min.js', 'utf8');

    const dom = new JSDOM(html, { runScripts: 'dangerously' });
    const { window } = dom;
    window.scrollTo = () => {};
    window.alert = (msg) => { throw new Error('Alert: ' + msg); };

    function inject(c) { const s = window.document.createElement('script'); s.textContent = c; window.document.head.appendChild(s); }
    inject(lunarJs);
    inject(klcJs);
    inject(`function showLoading(msg,cb){try{cb()}catch(e){window.__err=e.message}} Object.defineProperty(window,'__d',{get:function(){return globalSajuData}});`);

    await new Promise(r => setTimeout(r, 300));

    let pass = 0, fail = 0;

    async function calcLunar(ly, lm, ld, hr, mn, isLeap) {
        window.__err = null;
        window.document.getElementById('birth-date').value = `${ly}${String(lm).padStart(2,'0')}${String(ld).padStart(2,'0')}`;
        window.document.getElementById('birth-time').value = `${String(hr).padStart(2,'0')}${String(mn).padStart(2,'0')}`;
        window.document.getElementById('cal-type').value = 'L';
        window.document.getElementById('is-leap').value = isLeap ? 'true' : 'false';
        window.document.getElementById('adj-l').checked = false;
        window.runAnalysis();
        await new Promise(r => setTimeout(r, 200));
        if (window.__err) throw new Error(window.__err);
        return window.__d;
    }

    function ph(p) { return Array.isArray(p.h) ? p.h.join('') : (p.h || ''); }

    function check(label, got, expect) {
        const ok = got === expect;
        console.log(`${ok ? '✅' : '❌'} ${label}: ${got} ${ok ? '' : '(예상: ' + expect + ')'}`);
        ok ? pass++ : fail++;
    }

    console.log('='.repeat(60));
    console.log('음력 입력 → 사주 계산 최종 검증 (KLC 기반)');
    console.log('='.repeat(60));

    // 주인님: 음1988-01-24 → 양1988-03-12 → 戊辰 乙卯 丙寅
    const p1 = await calcLunar(1988, 1, 24, 0, 0, false);
    if (p1) {
        check('주인님(음1988-01-24) 년주', ph(p1.pillars[3]), '戊辰');
        check('주인님(음1988-01-24) 월주', ph(p1.pillars[2]), '乙卯');
        check('주인님(음1988-01-24) 일주', ph(p1.pillars[1]), '丙寅');
    }

    // 설날 2023: 음2023-01-01 → 양2023-01-22
    const p2 = await calcLunar(2023, 1, 1, 12, 0, false);
    if (p2) {
        check('2023 설날(음01-01) 년주', ph(p2.pillars[3]), '癸卯');
    }

    // 윤달 테스트: 음2020-04-01(윤) → 양2020-05-23
    const p3 = await calcLunar(2020, 4, 1, 0, 0, true);
    if (p3) {
        check('2020 윤4월 1일 년주', ph(p3.pillars[3]), '庚子');
    }

    // 잘못된 날짜 방어: 음1988-02-30 (존재하지 않는 날짜)
    try {
        const p4 = await calcLunar(1988, 2, 30, 0, 0, false);
        console.log('❌ 잘못된 날짜: 오류 미발생 (방어 코드 없음)');
        fail++;
    } catch(e) {
        console.log('✅ 잘못된 날짜 방어: 오류 감지됨 (' + e.message.slice(0,40) + ')');
        pass++;
    }

    console.log('\n' + '='.repeat(60));
    console.log(`결과: ${pass}통과 / ${fail}실패`);
}

test().catch(e => console.error('Fatal:', e));
