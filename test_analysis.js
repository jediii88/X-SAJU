const {JSDOM} = require('jsdom');
const fs = require('fs');
const html = fs.readFileSync('/home/node/.openclaw/workspace/X-SAJU_MASTER.html','utf-8');

const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'https://sajux.com',
    virtualConsole: (() => {
        const vc = new (require('jsdom').VirtualConsole)();
        vc.on('error', () => {});
        return vc;
    })()
});

const win = dom.window;
setTimeout(() => {
    try {
        win.document.getElementById('user-name').value = '테스트';
        win.document.getElementById('birth-date').value = '19880312';
        win.document.getElementById('birth-time').value = '0104';
        win.document.getElementById('cal-type').value = 'L';
        win.document.getElementById('gender').value = 'M';

        // showLoading 오버라이드
        win.showLoading = function(msg, cb) {
            try { cb(); console.log('=== 분석 완료 ==='); }
            catch(e) {
                console.log('=== 분석 오류 ===');
                console.log(e.message);
                e.stack.split('\n').slice(0,5).forEach(l => console.log(l));
            }
        };
        win.alert = (m) => console.log('ALERT:', m);

        win.runAnalysis();

        // step-2 확인
        setTimeout(() => {
            const step2 = win.document.getElementById('step-2');
            console.log('step-2 active:', step2 && step2.classList.contains('active'));
        }, 300);
    } catch(e) {
        console.log('Setup error:', e.message);
    }
}, 2000);
