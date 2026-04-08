const { Solar, Lunar } = require('lunar-javascript');

try {
    const y=1988, m=3, d=12, hr=1, mn=4; 
    console.log(`[테스트 시작] 양력 ${y}-${m}-${d} ${hr}:${mn} (경도보정 -32분 적용)`);

    // 경도 보정 -32분 적용 (01:04 -> 00:32)
    const solar = Solar.fromYmdHms(y, m, d, 0, 32, 0);
    const lunar = solar.getLunar();
    const ec = lunar.getEightChar();

    const pillars = [
        {n:"시주", h:ec.getTime()},
        {n:"일주", h:ec.getDay()},
        {n:"월주", h:ec.getMonth()},
        {n:"년주", h:ec.getYear()}
    ];

    const resultStr = pillars.map(p => p.h).reverse().join(" ");
    console.log(`\n최종 조합: ${resultStr}`);
    if(resultStr === "戊辰 乙卯 丙寅 戊子") {
        console.log("=> [성공] 마스터 레퍼런스와 100% 일치합니다.");
    } else {
        console.log("=> [실패] 레퍼런스(戊辰 乙卯 丙寅 戊子)와 다릅니다.");
    }

} catch(e) {
    console.error(e);
}
