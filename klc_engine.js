/**
 * KLC Engine — Korean Lunar Calendar 기반 사주 계산 엔진
 * lunar.js(중국기준) 대체용. KASI(한국천문연구원) 데이터 기반.
 * 
 * 브라우저 환경에서는 번들링 필요. Node 환경에서는 require() 사용.
 * 
 * 핵심 함수:
 *   klcGetEightChar(solarYear, solarMonth, solarDay, hour, minute, isAdjL, isUnknown)
 *     → { year:[간,지], month:[간,지], day:[간,지], hour:[간,지], lunarDate, isLeap }
 *   
 *   klcSolarToLunar(y, m, d) → { year, month, day, intercalation }
 *   klcLunarToSolar(y, m, d, intercalation) → { year, month, day }
 */

// ── 1. 시지(時支) 조견표 ──────────────────────────────────────
const KLC_ZHI_ORDER = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

function klcHourToZhi(hr) {
    if (hr === 23) return '子';
    const idx = Math.floor(hr / 2);
    return KLC_ZHI_ORDER[idx] || '子';
}

// ── 2. 시주 천간 조견표 (일간 기준 자시부터 12지) ──────────────
const KLC_HOUR_GAN = {
    '甲':['甲','乙','丙','丁','戊','己','庚','辛','壬','癸','甲','乙'],
    '己':['甲','乙','丙','丁','戊','己','庚','辛','壬','癸','甲','乙'],
    '乙':['丙','丁','戊','己','庚','辛','壬','癸','甲','乙','丙','丁'],
    '庚':['丙','丁','戊','己','庚','辛','壬','癸','甲','乙','丙','丁'],
    '丙':['戊','己','庚','辛','壬','癸','甲','乙','丙','丁','戊','己'],
    '辛':['戊','己','庚','辛','壬','癸','甲','乙','丙','丁','戊','己'],
    '丁':['庚','辛','壬','癸','甲','乙','丙','丁','戊','己','庚','辛'],
    '壬':['庚','辛','壬','癸','甲','乙','丙','丁','戊','己','庚','辛'],
    '戊':['壬','癸','甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
    '癸':['壬','癸','甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
};

function klcGetHourGan(dayGan, hourZhi) {
    const table = KLC_HOUR_GAN[dayGan];
    if (!table) return '?';
    return table[KLC_ZHI_ORDER.indexOf(hourZhi)] || '?';
}

// ── 3. 핵심: 양력 날짜 → 사주 팔자 ────────────────────────────
/**
 * @param {number} sy  양력 연도
 * @param {number} sm  양력 월
 * @param {number} sd  양력 일
 * @param {number} hr  시간 (0~23)
 * @param {number} mn  분 (0~59)
 * @param {boolean} adjL  경도 보정 여부 (-32분)
 * @param {boolean} isUnknown  시간 모름 여부
 * @param {KoreanLunarCalendar} klcInstance  외부에서 주입받는 KLC 인스턴스
 */
function klcGetEightChar(sy, sm, sd, hr, mn, adjL, isUnknown, klcInstance) {
    // 경도 보정
    let adjHr = hr, adjMn = mn;
    if (adjL && !isUnknown) {
        const dt = new Date(sy, sm - 1, sd, hr, mn);
        dt.setMinutes(dt.getMinutes() - 32);
        sy = dt.getFullYear();
        sm = dt.getMonth() + 1;
        sd = dt.getDate();
        adjHr = dt.getHours();
        adjMn = dt.getMinutes();
    }

    // KLC로 간지 계산
    klcInstance.setSolarDate(sy, sm, sd);
    const gapja = klcInstance.getChineseGapja();
    const lunar = klcInstance.getLunarCalendar();

    // 간지 파싱: "戊辰年" → ['戊','辰']
    const yearP  = [gapja.year[0],  gapja.year[1]];
    const monthP = [gapja.month[0], gapja.month[1]];
    const dayP   = [gapja.day[0],   gapja.day[1]];

    // 시주 계산
    let hourP = ['', ''];
    if (!isUnknown) {
        const hourZhi = klcHourToZhi(adjHr);
        const hourGan = klcGetHourGan(dayP[0], hourZhi);
        hourP = [hourGan, hourZhi];
    }

    return {
        year:  yearP,
        month: monthP,
        day:   dayP,
        hour:  hourP,
        lunarYear:  lunar.year,
        lunarMonth: lunar.month,
        lunarDay:   lunar.day,
        isLeap:     lunar.intercalation,
    };
}

// ── 4. 음력 → 양력 변환 ────────────────────────────────────────
function klcLunarToSolar(ly, lm, ld, isLeap, klcInstance) {
    klcInstance.setLunarDate(ly, lm, ld, isLeap);
    return klcInstance.getSolarCalendar(); // { year, month, day }
}

// ── 5. 양력 → 음력 변환 ───────────────────────────────────────
function klcSolarToLunar(sy, sm, sd, klcInstance) {
    klcInstance.setSolarDate(sy, sm, sd);
    return klcInstance.getLunarCalendar(); // { year, month, day, intercalation }
}

// Node.js export (테스트용)
if (typeof module !== 'undefined') {
    module.exports = { klcGetEightChar, klcLunarToSolar, klcSolarToLunar, klcHourToZhi, klcGetHourGan, KLC_ZHI_ORDER };
}
