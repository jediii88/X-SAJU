// 양력↔음력 변환 정확도 검증
// 기준: 한국천문연구원(KASI) 음양력 변환 표 / 네이버 음력변환

const fs = require('fs');
const { JSDOM } = require('jsdom');

async function test() {
    const html = '<html><body></body></html>';
    const lunarJs = fs.readFileSync('lunar.js', 'utf8');
    const dom = new JSDOM(html, { runScripts: 'dangerously' });
    const { window } = dom;
    function inject(c) { const s = window.document.createElement('script'); s.textContent = c; window.document.head.appendChild(s); }
    inject(lunarJs);
    await new Promise(r => setTimeout(r, 100));

    // 검증 케이스: [설명, 양력날짜, 예상음력, 윤달여부]
    // 출처: 한국천문연구원 음양력 변환
    const cases = [
        // 양력 → 음력 변환 검증
        { label: '1988-03-12 양력 → 음력',   solar: [1988,3,12],  expectLunar: [1988,1,24,false] },
        { label: '1900-01-31 양력 → 음력',   solar: [1900,1,31],  expectLunar: [1900,1,1,false]  },
        { label: '2000-02-05 양력 → 음력',   solar: [2000,2,5],   expectLunar: [2000,1,1,false]  },
        { label: '2023-01-22 양력 → 음력',   solar: [2023,1,22],  expectLunar: [2023,1,1,false]  }, // 설날
        { label: '2024-02-10 양력 → 음력',   solar: [2024,2,10],  expectLunar: [2024,1,1,false]  }, // 설날
        { label: '1993-05-16 양력 → 음력',   solar: [1993,5,16],  expectLunar: [1993,3,25,false] }, // 아이유
        { label: '1972-08-14 양력 → 음력',   solar: [1972,8,14],  expectLunar: [1972,7,5,false]  }, // 유재석
        // 윤달 케이스
        { label: '2020-05-23 양력 → 음력(윤4월)', solar: [2020,5,23], expectLunar: [2020,4,1,true] }, // 2020 윤4월 1일
        // 음력 → 양력 변환 검증
        { label: '음1988-01-24 → 양력',  lunar: [1988,1,24,false], expectSolar: [1988,3,12] },
        { label: '음2023-01-01 → 양력',  lunar: [2023,1,1,false],  expectSolar: [2023,1,22] },
        { label: '음2024-01-01 → 양력',  lunar: [2024,1,1,false],  expectSolar: [2024,2,10] },
        { label: '음1993-03-25 → 양력',  lunar: [1993,3,25,false], expectSolar: [1993,5,16] },
        { label: '음2020-04-01(윤) → 양력', lunar: [2020,4,1,true], expectSolar: [2020,5,23] },
    ];

    let pass = 0, fail = 0;
    console.log('='.repeat(60));
    console.log('양력↔음력 변환 정확도 검증');
    console.log('='.repeat(60));

    for (const c of cases) {
        try {
            if (c.solar) {
                // 양력 → 음력
                const sol = window.Solar.fromYmd(...c.solar);
                const lun = sol.getLunar();
                const y = lun.getYear();
                const m = Math.abs(lun.getMonth());
                const d = lun.getDay();
                const isLeap = lun.getMonth() < 0;
                const [ey, em, ed, el] = c.expectLunar;
                const ok = y===ey && m===em && d===ed && isLeap===el;
                console.log(`${ok?'✅':'❌'} ${c.label}`);
                console.log(`   결과: 음력 ${y}-${m}-${d} ${isLeap?'(윤달)':'(평달)'}`);
                if (!ok) console.log(`   예상: 음력 ${ey}-${em}-${ed} ${el?'(윤달)':'(평달)'}`);
                ok ? pass++ : fail++;
            } else {
                // 음력 → 양력
                const [ly, lm, ld, ll] = c.lunar;
                const lun = window.Lunar.fromYmd(ly, ll ? -lm : lm, ld);
                const sol = lun.getSolar();
                const sy = sol.getYear(), sm = sol.getMonth(), sd = sol.getDay();
                const [ey, em, ed] = c.expectSolar;
                const ok = sy===ey && sm===em && sd===ed;
                console.log(`${ok?'✅':'❌'} ${c.label}`);
                console.log(`   결과: 양력 ${sy}-${sm}-${sd}`);
                if (!ok) console.log(`   예상: 양력 ${ey}-${em}-${ed}`);
                ok ? pass++ : fail++;
            }
        } catch(e) {
            console.log(`❌ ${c.label} — ERROR: ${e.message}`);
            fail++;
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`결과: ${pass}개 통과 / ${fail}개 실패 (총 ${pass+fail}개)`);
    console.log(`정확도: ${Math.round(pass/(pass+fail)*100)}%`);
}

test().catch(e => console.error('Fatal:', e));
