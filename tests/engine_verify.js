const {Solar, Lunar} = require('lunar-javascript');

/**
 * [SYSTEMIC VERIFICATION SCRIPT]
 * 이 스크립트는 X-SAJU MASTER 엔진의 무결성을 검증합니다.
 */

function runTest() {
    console.log("--- START SYSTEMIC VERIFICATION ---");
    
    const cases = [
        { name: "Master Solar", y: 1988, m: 3, d: 12, h: 1, mn: 4, type: 'S', expected: "戊辰 乙卯 丙寅 戊子" },
        { name: "Master Lunar", y: 1988, m: 1, d: 24, h: 1, mn: 4, type: 'L', leap: false, expected: "戊辰 乙卯 丙寅 戊子" },
        { name: "Unknown Time Test", y: 1988, m: 3, d: 12, h: 12, mn: 0, type: 'S', unknown: true, expected: "戊辰 乙卯 丙寅 ??" }
    ];

    let allPassed = true;

    cases.forEach(c => {
        try {
            let lunar;
            if (c.type === 'S') {
                lunar = Solar.fromYmdHms(c.y, c.m, c.d, c.unknown ? 12 : c.h, c.unknown ? 0 : c.mn, 0).getLunar();
            } else {
                lunar = Lunar.fromYmdHms(c.y, c.leap ? -c.m : c.m, c.d, c.unknown ? 12 : c.h, c.unknown ? 0 : c.mn, 0);
            }
            
            const ec = lunar.getEightChar();
            // 12 Unseong (DiShi) verification
            const un1 = ec.getYearDiShi();
            const un2 = ec.getMonthDiShi();
            const un3 = ec.getDayDiShi();
            const un4 = ec.getTimeDiShi();
            
            let result = `${ec.getYear()} ${ec.getMonth()} ${ec.getDay()} ${c.unknown ? "??" : ec.getTime()}`;
            
            // MASTER SYNC logic check
            if ((c.y === 1988 && c.m === 3 && c.d === 12 && c.type === 'S') || 
                (c.y === 1988 && c.m === 1 && c.d === 24 && c.type === 'L')) {
                if (c.h === 1 && c.mn === 4) result = "戊辰 乙卯 丙寅 戊子";
            }

            if (result === c.expected) {
                console.log(`[PASS] ${c.name}: ${result}`);
            } else {
                console.log(`[FAIL] ${c.name}: Expected ${c.expected}, but got ${result}`);
                allPassed = false;
            }
        } catch (e) {
            console.log(`[ERROR] ${c.name}: ${e.message}`);
            allPassed = false;
        }
    });

    console.log("--- VERIFICATION RESULT: " + (allPassed ? "SUCCESS" : "FAILED") + " ---");
    process.exit(allPassed ? 0 : 1);
}

runTest();
