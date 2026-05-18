/* report-core.js — 리포트·만세력 공통 엔진 (tools/sync_report_core.py, view.html 기준 추출) */
/* 로드 순서: lunar.js → klc.min.js → 본 파일 */
/*
 * [멘토 서사 공통 — 3단 빌드업] 템플릿·동적 문구 작성 시 준수:
 * Step1 심리적 어루만짐(인정·위로, 고객 편에 선 단정) → Step2 명리적 원인(비유·납득, 탓이 아님을 분명히)
 * → Step3 단호한 실행(짧은 문장·<strong>으로 핵심 한 줄 고정). 톤: 벨벳 장갑을 낀 도끼, 합쇼체 유지.
 * 동적 고객명: 「〇〇님」+ 은/는·이/가·의·을/를·께·께는·에게는 하드코딩 금지 — nmDnim / nmEunNeun / nmIGa / nmUi / nmEulReul / nmKke / nmKkeEunNeun / nmEge. 간지 연도 문자열(yk) 뒤 은/는·이/가는 getJosa(yk, …) 사용.
 */

/** 명리학 22글자 한글 표기용 조사(은/는·이/가·과/와) — 천간·지지 한글 한 글자에 강제 적용 */
var JOSA_MAP_22 = {
    '갑': { i: '이', wa: '과' }, '을': { i: '이', wa: '과' }, '병': { i: '이', wa: '과' }, '정': { i: '이', wa: '과' },
    '무': { i: '가', wa: '와' }, '기': { i: '가', wa: '와' }, '경': { i: '이', wa: '과' }, '신': { i: '이', wa: '과' },
    '임': { i: '이', wa: '과' }, '계': { i: '가', wa: '와' }, '자': { i: '가', wa: '와' }, '축': { i: '이', wa: '과' },
    '인': { i: '이', wa: '과' }, '묘': { i: '가', wa: '와' }, '진': { i: '이', wa: '과' }, '사': { i: '가', wa: '와' },
    '오': { i: '가', wa: '와' }, '미': { i: '가', wa: '와' }, '유': { i: '가', wa: '와' }, '술': { i: '이', wa: '과' }, '해': { i: '가', wa: '와' }
};

/** ─────────────────────────────────────────
 *  오행 색 단일 소스 (Single Source of Truth)
 *  명조(나무) 녹·불 적·흙 황·금 회·물 현색(玄, 검정)
 * ───────────────────────────────────────── */
var SAJUX_OH_COLORS = {
    wood:  '#4a9e6a',
    fire:  '#e05a2b',
    earth: '#c8a050',
    metal: '#8898aa',
    water: 'var(--water)'
};
var SAJUX_STEM_OH = {
    '甲':'wood','乙':'wood','丙':'fire','丁':'fire',
    '戊':'earth','己':'earth','庚':'metal','辛':'metal',
    '壬':'water','癸':'water'
};
var SAJUX_BRANCH_OH = {
    '子':'water','亥':'water',
    '寅':'wood','卯':'wood',
    '巳':'fire','午':'fire',
    '丑':'earth','辰':'earth','未':'earth','戌':'earth',
    '申':'metal','酉':'metal'
};
function sajuxStemColor(stem) {
    var oh = SAJUX_STEM_OH[stem];
    return SAJUX_OH_COLORS[oh] || 'var(--gold)';
}
function sajuxBranchColor(branch) {
    var oh = SAJUX_BRANCH_OH[branch];
    return SAJUX_OH_COLORS[oh] || 'var(--gold)';
}
function sajuxIsWaterChar(ch) {
    return SAJUX_STEM_OH[ch] === 'water' || SAJUX_BRANCH_OH[ch] === 'water';
}
/** 수 오행 한자용 인라인 스타일. 명리 정통 검정 + 다크 모드 한정 흰 윤곽으로
 *  "잉크가 종이 위에 떠오르듯" 가시성을 확보합니다. 라이트 모드에서는
 *  --water-stroke의 alpha를 0으로 두어 윤곽이 보이지 않습니다. */
function sajuxHanjaInlineStyle(ch, sizeStyle, weight) {
    var col = SAJUX_STEM_OH[ch] ? sajuxStemColor(ch) : sajuxBranchColor(ch);
    var sw  = sajuxIsWaterChar(ch);
    var base = "font-family:'Noto Sans KR','Noto Sans SC',sans-serif;"
             + "font-weight:" + (weight || 300) + ";"
             + "color:" + col + ";";
    if (sizeStyle) base += "font-size:" + sizeStyle + ";";
    if (sw) base += "-webkit-text-stroke:0.75px var(--water-stroke, rgba(255,255,255,0.85));paint-order:stroke fill;";
    return base;
}

/** 부록 B 등 세운 상세 직전 4대 지표 블록 — 2×2(모바일)·4열(넓은 화면) 그리드 */
function buildYearlyIndicatorsHtml(ykw) {
    var w = ykw || { wealth: '-', career: '-', doc: '-', love: '-' };
    function esc(t) {
        return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    var kw = function (x) {
        return esc(typeof clampKeyword10 === 'function' ? clampKeyword10(x) : String(x == null ? '' : x).substring(0, 10));
    };
    var cell = function (icon, label, val) {
        return '<div class="yearly-ind-cell" style="box-sizing:border-box;min-width:0;padding:10px 8px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);">'
            + '<div style="font-size:10px;color:#8a8278;margin-bottom:6px;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + icon + ' ' + label + '</div>'
            + '<div class="yearly-ind-val" style="font-size:13px;font-weight:700;color:#e8dcc8;line-height:1.4;word-break:keep-all;" title="' + kw(val) + '">' + kw(val) + '</div></div>';
    };
    return '<div class="yearly-indicators sajux-panel-plain" style="width:100%;max-width:100%;box-sizing:border-box;margin-bottom:12px;padding:12px 10px;background:transparent;border-radius:6px;border:1px solid rgba(199,167,106,0.32);border-left:3px solid #8b6914;">'
        + '<div class="yearly-indicators-grid" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 10px;width:100%;">'
        + cell('💰', '재물·투자', w.wealth)
        + cell('🏢', '직업·합격', w.career)
        + cell('📝', '문서·계약', w.doc)
        + cell('❤', '애정·대인', w.love)
        + '</div></div>';
}
/** 마지막 음절 받침 기준 조사. ㄹ 받침은 은/는·이/가·을/를·과/와 에서 받침 없는 쪽(는/가/를/와)을 사용합니다. */
function getJosa(word, pair) {
    if (word == null || word === '') return '';
    var s = String(word).replace(/\s+$/, '');
    if (!s.length) return '';
    var last = s.charAt(s.length - 1);
    if (JOSA_MAP_22[last] && (pair === '이/가' || pair === '과/와')) {
        return pair === '이/가' ? JOSA_MAP_22[last].i : JOSA_MAP_22[last].wa;
    }
    var c = last.charCodeAt(0);
    var jong = 0;
    if (c >= 0xAC00 && c <= 0xD7A3) jong = (c - 0xAC00) % 28;
    var hasCons = jong !== 0;
    var isRieul = jong === 8;
    var parts = String(pair).split('/');
    if (parts.length !== 2) return pair;
    var withC = parts[0];
    var noC = parts[1];
    if (pair === '으로/로') return (!hasCons || isRieul) ? noC : withC;
    if (pair === '은/는' || pair === '이/가' || pair === '을/를' || pair === '과/와' || pair === '이라/라') {
        if (isRieul) return noC;
        return hasCons ? withC : noC;
    }
    return hasCons ? withC : noC;
}

/**
 * 괄호 한자/병기 표기를 가진 단어(예: "금(金)", "토(土)") 뒤 조사 판단.
 * 끝의 "(…)" 괄호 한자를 떼어내고 한글 마지막 음절 받침으로 판단합니다.
 * — 일반 텍스트에서는 그대로 getJosa와 동일하게 동작.
 */
function getJosaFlex(word, pair) {
    var s = String(word == null ? '' : word).replace(/\s+$/, '');
    if (!s) return '';
    var stripped = s.replace(/\s*\([^)]*\)\s*$/, '').replace(/\s+$/, '');
    if (stripped.length === 0) stripped = s;
    return getJosa(stripped, pair);
}

/**
 * 십성(두 글자 명) 뒤 조사 — 비견·겁재·식신·상관·편인·정인·편관·정관은 이/은/과/을 쪽,
 * 편재·정재만 가/는/와/를 쪽(리포트 톤 통일용; 일반 한글 받침 규칙과 의도적으로 다를 수 있음).
 */
function getJosaSipseong(sip, pair) {
    sip = String(sip == null ? '' : sip).replace(/\s+$/, '');
    if (!sip.length) return '';
    var weak = sip === '편재' || sip === '정재';
    var parts = String(pair).split('/');
    if (parts.length !== 2) return getJosa(sip, pair);
    var withC = parts[0];
    var noC = parts[1];
    if (pair === '으로/로') return getJosa(sip, pair);
    if (pair === '은/는' || pair === '이/가' || pair === '을/를' || pair === '과/와' || pair === '이라/라') {
        return weak ? noC : withC;
    }
    return getJosa(sip, pair);
}

/** 고객 호칭(〇〇님) + 조사 — 빈 이름은 「고객님」으로 통일 */
function nmNormalize(name) {
    var n = String(name == null ? '' : name).replace(/^\s+/, '').replace(/\s+$/, '');
    return n === '' ? '고객' : n;
}
function nmDnim(name) {
    return nmNormalize(name) + '님';
}
function nmEunNeun(name) {
    var t = nmDnim(name);
    return t + getJosa(t, '은/는');
}
function nmIGa(name) {
    var t = nmDnim(name);
    return t + getJosa(t, '이/가');
}
function nmUi(name) {
    return nmDnim(name) + '의';
}
function nmKke(name) {
    return nmNormalize(name) + '님께';
}
function nmKkeEunNeun(name) {
    var t = nmKke(name);
    return t + getJosa(t, '은/는');
}
function nmEge(name) {
    return nmDnim(name) + '에게';
}
function nmEulReul(name) {
    var t = nmDnim(name);
    return t + getJosa(t, '을/를');
}
function nmDnimEun(name) {
    return nmNormalize(name) + '님은';
}

/**
 * 사주아이형 어투 가이드 (프리미엄 + 따뜻한 2인칭).
 * - 은유 제목 · 님은 호칭 · 명리 용어 유지 · 행동 지침은 구체적으로
 */
var SAJUX_VOICE = {
    endings: { observe: ['입니다', '입니다', '보입니다', '것 같습니다'], advise: '하십시오' },
    mingliBridge: ['명리학적으로 보면', '사주 구조만 놓고 보면', '원국을 짚어보면']
};

/** 일주 image 뒤쪽 형용사(풍요롭다 등) → 관형사(풍요로운) */
function dictAdjToModifier(word) {
    var w = String(word || '').trim();
    if (!w) return w;
    if (/롭다$/.test(w)) return w.replace(/롭다$/, '로운');
    if (/스럽다$/.test(w)) return w.replace(/스럽다$/, '스러운');
    if (/답다$/.test(w)) return w.replace(/답다$/, '다운');
    if (/갑다$/.test(w)) return w.replace(/갑다$/, '가운');
    if (/하다$/.test(w)) return w.replace(/하다$/, '한');
    if (/나다$/.test(w)) return w.replace(/나다$/, '난');
    if (/다$/.test(w) && w.length > 2) return w.replace(/다$/, '은');
    return w;
}
function normalizeIljuTraitForHook(trait) {
    var t = String(trait || '').replace(/\s+/g, ' ').trim();
    if (!t) return '';
    return t.split(/(\s+(?:하고|이며|및)\s+)/).map(function (seg) {
        if (/^\s*(?:하고|이며|및)\s*$/.test(seg)) return seg.replace(/\s+/g, ' ').trim() ? seg.replace(/\s+/g, ' ').trim() + ' ' : '';
        return dictAdjToModifier(seg.trim());
    }).join('').replace(/\s+/g, ' ').trim();
}
function getIljuImageParts(data) {
    var prof = (typeof getIljuProfile === 'function')
        ? getIljuProfile(data.dayStem, data.dayBranch) : null;
    var img = prof && prof.image ? String(prof.image).trim() : '';
    if (!img) return { scene: '', trait: '' };
    var parts = img.split(/[—\-–]/);
    return {
        scene: (parts[0] || img).replace(/\s+/g, ' ').trim(),
        trait: normalizeIljuTraitForHook(parts[1] || '')
    };
}
function getIljuScenePhrase(data) {
    return getIljuImageParts(data).scene;
}
/** 60일주 물상 → 사주아이식 한 줄 훅 제목 (표지·프리미엄 브리프 1회용) */
function buildMetaphorHookTitle(data) {
    var parts = getIljuImageParts(data);
    if (!parts.scene) {
        var nm = nmNormalize(data.name || '') || '당신';
        return nm + '의 원국 — 겉과 속이 교차하는 지점';
    }
    // 제목은 물상(scene)만 — 짧고 선명하게
    return parts.scene;
}
/** 인생 일대기 등 — 은유 훅과 겹치지 않는 섹션 제목 */
function buildLifePanoramaTitle(data) {
    return '인생 일대기';
}

/** 명리 브릿지 한 줄 + 본문 */
function voiceMingliLine(body) {
    var bridge = SAJUX_VOICE.mingliBridge[Math.abs(hashSeed(body || '')) % SAJUX_VOICE.mingliBridge.length];
    return bridge + ' ' + (body || '');
}

function pickVoiceLine(arr, seed) {
    if (!arr || !arr.length) return '';
    return arr[Math.abs(hashSeed(String(seed || ''))) % arr.length];
}

function voiceObserveEnd(seed) {
    return pickVoiceLine(SAJUX_VOICE.endings.observe, seed || '');
}

/** 큰 제목 한 줄 + 아래 부제(금색·작게). 빈 부제는 생략 */
function buildChapterHeadMainSub(mainTitle, subTitle, opts) {
    opts = opts || {};
    var extra = opts.extraStyle || '';
    var sub = (subTitle && String(subTitle).trim())
        ? '<p class="ch-sub-under-main" style="font-size:11px;letter-spacing:0.10em;color:rgba(199,167,106,0.72);margin:0 0 14px;font-weight:700;line-height:1.45;">' + escHtmlAttr(subTitle) + '</p>'
        : '';
    return '<div class="ch-head-main-sub" style="margin-bottom:16px;' + extra + '">'
        + '<h2 class="ch-main-heading-xl" style="font-family:\'Noto Sans KR\',sans-serif;font-size:clamp(22px,5vw,28px);font-weight:800;line-height:1.2;margin:0 0 8px;color:var(--text,rgba(255,255,255,0.96));">' + escHtmlAttr(mainTitle) + '</h2>'
        + sub
        + '</div>';
}

/** 챕터 제목(은유) + 작은 부제 */
function buildChapterHead(metaphorTitle, sectionLabel, opts) {
    opts = opts || {};
    var extra = opts.extraStyle || '';
    var mt = (metaphorTitle != null && String(metaphorTitle).trim()) ? String(metaphorTitle).trim() : '';
    // 큰 제목 자리가 비어 있으면 부제만 크게 — 빈 h3 방지
    if (!mt && sectionLabel) {
        return buildChapterHeadMainSub(sectionLabel, '', opts);
    }
    // 섹션 라벨(넘버·카테고리)은 위에 작게, 핵심 제목은 크게
    return (sectionLabel ? '<p class="ch-section-label" style="font-size:10px;letter-spacing:0.14em;color:rgba(199,167,106,0.65);margin:0 0 6px;font-weight:700;text-transform:uppercase;">' + escHtmlAttr(sectionLabel) + '</p>' : '')
        + '<h3 class="ch-title" style="font-family:\'Noto Sans KR\',sans-serif;font-size:22px;font-weight:800;line-height:1.3;margin:0 0 14px;' + extra + '">'
        + escHtmlAttr(mt) + '</h3>';
}

/** 챕터 헤더 — 주제명을 가장 크게(오행·십성 등). 번호·부제는 제목 아래 작게, 은유는 한 단계 더 낮춤 */
function buildChapterHeadTopicFirst(mainTitle, eyebrowLabel, leadHook, opts) {
    opts = opts || {};
    var hookHtml = '';
    if (leadHook) {
        hookHtml = '<p class="ch-hook-after-title" style="font-size:12.5px;font-weight:500;line-height:1.62;color:rgba(255,255,255,0.66);margin:0 0 14px;">'
            + escHtmlAttr(leadHook) + '</p>';
    }
    var subHtml = eyebrowLabel
        ? '<p class="ch-section-label ch-topic-sub-under-main" style="font-size:10px;letter-spacing:0.08em;color:rgba(199,167,106,0.45);margin:0 0 12px;font-weight:600;line-height:1.5;">' + escHtmlAttr(eyebrowLabel) + '</p>'
        : '';
    var extra = opts.extraStyle || '';
    return '<div class="ch-head-topic-first" style="margin-bottom:16px;' + extra + '">'
        + '<h2 class="ch-main-topic-title" style="font-family:\'Noto Sans KR\',sans-serif;font-size:clamp(17px,3.9vw,21px);font-weight:800;line-height:1.25;margin:0 0 6px;color:var(--text,rgba(255,255,255,0.96));">' + escHtmlAttr(mainTitle) + '</h2>'
        + subHtml
        + hookHtml
        + '</div>';
}

// SAJUX_SURFACE_LINES: 프리미엄 브리프·챕터 도입 등에서 사용되는 짧은 도입문.
// 사용자 피드백 — 매크로 인사("겉으로는 듬직해 보이지만, 속으로는 누구보다 치열하게…")는 폐기.
// 챕터 다리(buildChapterBridge) + 프리미엄 브리프 자체 도입문이 그 역할을 대신함.
var SAJUX_SURFACE_LINES = [''];

function getWuxingPctMap(data) {
    var wx = data.wuxing || {};
    var total = Object.keys(wx).reduce(function (s, k) { return s + (Number(wx[k]) || 0); }, 0) || 1;
    var out = {};
    Object.keys(wx).forEach(function (k) { out[k] = Math.round((Number(wx[k]) || 0) / total * 100); });
    return out;
}

function getMinMaxOh(data) {
    var pct = getWuxingPctMap(data);
    var keys = ['wood', 'fire', 'earth', 'metal', 'water'];
    var maxW = keys[0], minW = keys[0], maxP = -1, minP = 101;
    keys.forEach(function (k) {
        var p = pct[k] || 0;
        if (p > maxP) { maxP = p; maxW = k; }
        if (p < minP) { minP = p; minW = k; }
    });
    return { maxW: maxW, minW: minW, pct: pct };
}

function getDominantSipseong(data) {
    var sip = data.sipseong || {};
    var sorted = Object.keys(sip).sort(function (a, b) { return (sip[b] || 0) - (sip[a] || 0); });
    return sorted[0] || '정재';
}

/** 주제별 섹션 제목 — 2~5단어 명사구, ~이네요/~이시군요 금지 */
function buildTopicMetaphorTitle(topic, data) {
    var oh = getMinMaxOh(data);
    var OH_KR = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' };
    var mainSip = getDominantSipseong(data);
    var isStrong = (data.strengthText || '').indexOf('신강') >= 0 || (data.strengthText || '').indexOf('강') >= 0;

    // 손님이 보는 챕터 제목 — 기술 표기(○○ 과다 · ○○ 부재) 대신 결론·은유 위주 자연어로.
    // 풀이 안쪽 본문에서 수치·근거를 풀어 주므로, 제목은 손님이 한 번에 알아챌 수 있는 결로 잡는다.
    var titles = {
        basic:    function() { return buildMetaphorHookTitle(data); }, // 일주 물상 — 짧게
        wuxing:   function() {
            var maxK = OH_KR[oh.maxW] || '';
            var minK = OH_KR[oh.minW] || '';
            // 다섯 기운 중 어느 결이 두텁고, 어느 결이 비어 있는지를 자연어로
            var maxLabel = { wood:'나무', fire:'불', earth:'흙', metal:'금', water:'물' }[oh.maxW] || (maxK + '의 기운');
            var minLabel = { wood:'나무', fire:'불', earth:'흙', metal:'금', water:'물' }[oh.minW] || (minK + '의 기운');
            return maxLabel + '의 기운은 두텁고, ' + minLabel + '의 기운은 얇은 분';
        },
        sipseong: function() { return mainSip + ' — 일하실 때 가장 자주 꺼내 쓰시는 카드'; },
        wealth:   function() { return '재물 전략'; },
        career:   function() { return '직업 · 소명'; },
        love:     function() { return '애정 · 인연'; },
        health:   function() { return '건강 · 회복'; },
        hidden:   function() { return '지장간 · 내면'; },
        daeun:    function() { return '대운 — 10년 계절의 지도'; },
        seyun:    function() { return '세운 분석'; },
        monthly:  function() { return '월운 지도'; },
        remedy:   function() { return '개운법'; },
        current:  function() { return '현재 운세 종합'; },
        master:   function() { return '원국 요약'; },
        relation: function() { return '합 · 충 · 형 · 파'; },
        shinsal:  function() { return '신살'; },
        strength: function() { return isStrong ? '신강(身强) 원국' : '신약(身弱) 원국'; },
        ziwei:    function() { return '자미두수 청사진'; },
        appendix: function() { return '성향 분석'; }
    };
    var fn = titles[topic];
    if (fn) return fn();
    return buildMetaphorHookTitle(data);
}

var SAJUX_SECTION_LABELS = {
    basic: '01. 원국 해부 — 태어난 순간의 별자리 지도',
    wuxing: '오행의 강약과 균형',
    sipseong: '십성 분포와 역할',
    wealth: '04. 재물 전략 — 돈의 흐름과 지키는 법',
    career: '05. 직업·소명 — 무대와 권한의 방향',
    love: '06. 애정·인연 — 마음이 머무는 자리',
    health: '08. 건강·회복 — 몸이 보내는 신호',
    hidden: '07. 지장간·내면 — 보이지 않는 뿌리',
    daeun: '대운 — 10년 계절의 지도',
    seyun: '10. 세운 — 앞으로 10년의 바람',
    monthly: '13. 월운 — 12개월의 리듬',
    remedy: '09. 개운법 — 일상에 옮기기',
    current: '현재 대운·세운·월운 종합',
    master: '원국 한눈에 — 성격·돈·일·사랑·몸',
    relation: '합·충·형·파 — 관계의 힘',
    shinsal: '신살 — 바람의 이름',
    strength: '신강·신약 — 체력의 바탕',
    ziwei: '별첨 — 자미두수 청사진',
    appendix: '부록 — 성향의 온도'
};

/** ─────────────────────────────────────────
 *  챕터 다리(transition bridge) — 매 챕터 첫 머리에 들어가는 1~2문장.
 *  - 이전 흐름과 자연스럽게 연결
 *  - "OO님은 일주 ~의 기운을 타고나" 같은 매크로 인사를 챕터마다 반복하지 않음
 *  - 첫 챕터(basic)에만 풀 인사. 이후 챕터는 흐름 다리로 연결.
 * ───────────────────────────────────────── */
function _sajuxChapterCount(reset) {
    if (typeof window === 'undefined') {
        _sajuxChapterCount._n = reset ? 0 : (_sajuxChapterCount._n || 0) + 1;
        return _sajuxChapterCount._n;
    }
    if (reset || typeof window._sajuxChapterIdx !== 'number') window._sajuxChapterIdx = 0;
    if (!reset) window._sajuxChapterIdx += 1;
    return window._sajuxChapterIdx;
}
function buildChapterBridge(topic, data) {
    var nm = nmNormalize((data && data.name) || '') || '고객';
    var bridges = {
        basic:    null, // 첫 챕터 — 풀 인사로 처리
        wuxing:   '원국 글자를 다섯 오행 비율로 읽어 보겠습니다.',
        sipseong: '같은 기질이라도 사람마다 쓰는 방식이 다릅니다. 십성의 무늬를 살펴보겠습니다.',
        wealth:   nmUi(nm) + ' 타고난 결을 보았으니, 이제 그 결이 돈의 흐름과 어떻게 맞물리는지 짚어보겠습니다.',
        career:   '직업은 단순히 직함이 아니라 ' + nmUi(nm) + ' 에너지가 가장 빛나는 자리입니다. 그 자리부터 살펴보겠습니다.',
        love:     '관계와 애정은 ' + nmUi(nm) + ' 가장 깊은 부분과 맞닿아 있습니다. 어떤 사람과 어떤 리듬으로 만나는지 살피겠습니다.',
        health:   '몸은 거짓말을 하지 않습니다. ' + nmUi(nm) + ' 사주가 알려주는 체질의 신호를 차분히 풀어보겠습니다.',
        daeun:    '여기까지가 ' + nmUi(nm) + ' 타고난 모습이었다면, 이제부터는 시간 위에 펼쳐진 흐름을 살펴보겠습니다.',
        seyun:    '큰 계절(대운)을 보았으니, 이제 그 안에서 올해 한 해는 어떤 색깔로 흐르는지 들여다보겠습니다.',
        monthly:  '한 해의 큰 흐름을 보았으니, 이번에는 달마다 무게가 어떻게 달라지는지 짚어보겠습니다.',
        remedy:   '여기까지 사주의 결과 흐름을 살펴봤습니다. 이제 ' + nmIGa(nm) + ' 일상에서 어떻게 운을 다듬어 갈 수 있을지 정리해 드리겠습니다.',
        hidden:   '겉으로 드러난 모습 너머에 숨어 있는 ' + nmUi(nm) + ' 또 다른 결, 지장간을 들여다보겠습니다.',
        relation: '사주의 글자들은 서로 끌어당기거나 부딪히며 살아 움직입니다. ' + nmUi(nm) + ' 원국 안에서 일어나는 이 움직임을 살펴보겠습니다.',
        shinsal:  '신살은 두려워할 이름이 아니라, 삶의 결을 알려주는 신호입니다. ' + nmUi(nm) + ' 신살이 어떤 결을 만드는지 풀어보겠습니다.',
        strength: nmUi(nm) + ' 에너지가 강한 편인지 섬세한 편인지, 그 바탕부터 차분히 짚어보겠습니다.',
        current:  '지금 이 시기, ' + nmKke(nm) + ' 어떤 흐름이 겹쳐 있는지 함께 살펴보겠습니다.',
        master:   nmUi(nm) + ' 사주를 다섯 갈래로 나눠 풀어드리겠습니다. 서두르지 않으셔도 됩니다.',
        ziwei:    '명리와는 별개의 학문인 자미두수로도 ' + nmUi(nm) + ' 그림을 한 번 더 비춰봅니다. 참고 자료로 가볍게 읽으셔도 됩니다.',
        appendix: '아래는 본문에서 다룬 내용을 더 깊이 살피고 싶을 때 참고할 수 있는 자료입니다.'
    };
    return bridges[topic] === undefined ? null : bridges[topic];
}
function buildChapterIntroHtml(data, topic) {
    var idx = _sajuxChapterCount();
    var bridge = buildChapterBridge(topic, data);
    var text;
    if (idx <= 1 || topic === 'basic' || bridge === null) {
        // 첫 챕터(또는 basic) — 풀 인사
        var inner = buildTopicOpenerInner(topic, data);
        text = buildSajuKidStyleOpener(data, inner);
    } else {
        // 그 외 — 다리 한 줄 + 토픽별 한 줄
        var inner2 = buildTopicOpenerInner(topic, data);
        text = bridge + (inner2 ? ' ' + inner2 : '');
    }
    return '<p class="ch-text ch-voice-opener" style="margin-bottom:16px;line-height:1.95;font-size:14px;">'
         + boldStarsToStrong(voicePolishParagraph(data, text))
         + '</p>';
}

/** 만세력 인라인 풀이 블록 상단 — 주제 제목을 가장 크게, 은유는 한 단계 아래 */
function voiceInlineInterpHeader(topic, data) {
    var label = SAJUX_SECTION_LABELS[topic] || '';
    var hook = buildTopicMetaphorTitle(topic, data);
    if (topic === 'basic') {
        return buildChapterHeadTopicFirst('원국 해부', '01 · 태어난 순간의 별자리 지도', hook) + buildChapterIntroHtml(data, topic);
    }
    if (topic === 'wuxing') {
        return buildChapterHeadTopicFirst('오행 — 다섯 기운의 짜임', label, hook) + buildChapterIntroHtml(data, topic);
    }
    if (topic === 'relation') {
        return buildChapterHeadTopicFirst('합 · 충 · 형 · 파', label, '') + buildChapterIntroHtml(data, topic);
    }
    if (topic === 'shinsal') {
        return buildChapterHeadTopicFirst('신살', label, hook === '신살' ? '' : hook) + buildChapterIntroHtml(data, topic);
    }
    if (topic === 'strength') {
        return buildChapterHeadTopicFirst('신강 · 신약', label, hook) + buildChapterIntroHtml(data, topic);
    }
    return buildChapterHead(hook, label) + buildChapterIntroHtml(data, topic);
}

/** ═══ 궁합(2인) — 사주아이형 톤 (couple · compatibility 공용) ═══ */
var SAJUX_COMPAT_SECTION_LABELS = {
    overview: '궁합 총평 — 두 격이 만나는 자리',
    personality: '성격·기질 — 타고난 온도',
    lover: '연인 — 마음의 리듬',
    married: '부부 — 삶의 설계',
    friend: '우정 — 오래 가는 거리',
    business: '동업 — 역할과 돈',
    spouse: '배우자궁 — 끌림의 방향',
    wuxing: '오행 대칭 — 에너지 보완',
    strategy: '관계 전략 — 소통·동업·친밀',
    timeline: '시기 — 대운·세운 싱크',
    caution: '취급 주의 — 지키면 오래 갑니다',
    brief: '관계 브리프 — 한눈에 보는 핵심'
};

function buildCompatMetaphorTitle(ctx) {
    ctx = ctx || {};
    var nA = nmNormalize(ctx.aName || (ctx.a && ctx.a.name)) || '한 분';
    var nB = nmNormalize(ctx.bName || (ctx.b && ctx.b.name)) || '한 분';
    var a = ctx.a || {};
    var b = ctx.b || {};
    var profA = (typeof getIljuProfile === 'function') ? getIljuProfile(a.dayStem, a.dayBranch) : null;
    var profB = (typeof getIljuProfile === 'function') ? getIljuProfile(b.dayStem, b.dayBranch) : null;
    var imgA = profA && profA.image ? String(profA.image).split(/[—\-–]/)[0].trim() : '';
    var imgB = profB && profB.image ? String(profB.image).split(/[—\-–]/)[0].trim() : '';
    if (imgA && imgB) {
        return nA + '님은 ' + imgA + ', ' + nB + '님은 ' + imgB + ' — 두 격이 한 방에 맞닿은 형상이네요';
    }
    if (ctx.isHap) return nA + '님과 ' + nB + '님, 배우자궁이 맞물리는 인연이시군요';
    if (ctx.isChung) return nA + '님과 ' + nB + '님, 각도는 세지만 끌림도 강한 만남이네요';
    var sc = ctx.score;
    if (sc >= 75) return nA + '님과 ' + nB + '님, 서로의 빈칸을 채우는 보완형 궁합이네요';
    if (sc >= 55) return nA + '님과 ' + nB + '님, 노력하면 깊어지는 균형형 인연이시군요';
    return nA + '님과 ' + nB + '님, 다름을 인정할 때 빛나는 조율형 궁합이에요';
}

function buildCompatTopicMetaphor(topic, ctx) {
    ctx = ctx || {};
    var nA = nmNormalize(ctx.aName) || '한 분';
    var nB = nmNormalize(ctx.bName) || '한 분';
    var seed = nA + nB + (topic || '');
    var pools = {
        overview: function () {
            return pickVoiceLine([
                nA + '님과 ' + nB + '님, 겉으로는 다른데 속 리듬이 맞는 조합이네요',
                '두 분의 사주가 겹치는 지점이 분명한, 인연 지도가 열린 격이시군요',
                nA + '님과 ' + nB + '님, 만남 자체가 우연이 아니라 구조로 읽히는 궁합이에요'
            ], seed);
        },
        personality: function () {
            return nA + '님과 ' + nB + '님, 타고난 온도 차이가 관계의 색을 만드는 구간이네요';
        },
        lover: function () {
            return pickVoiceLine([
                '애정은 만남 횟수보다 **약속 리듬**이 먼저인, 연인 궁합이시군요',
                nA + '님과 ' + nB + '님, 마음이 붙는 속도와 지키는 속도가 다른 편이네요'
            ], seed + 'lv');
        },
        married: function () {
            return '부부로 가면 돈·집·자녀 숫자가 같은 주에 몰릴 때가 관건인 궁합이에요';
        },
        friend: function () {
            return nA + '님과 ' + nB + '님, 오래 가려면 **공통 취미 한 가지**가 닻이 되는 우정이네요';
        },
        business: function () {
            return '동업은 친함보다 **역할 문장**이 먼저인, 비즈니스 궁합이시군요';
        },
        spouse: function () {
            return voiceMingliLine('일지는 배우자궁, 무의식적으로 끌리는 형상입니다.') + ' 두 사람의 일지 관계가 끌림의 온도를 정합니다.';
        },
        wuxing: function () {
            return nA + '님과 ' + nB + '님, 오행 막대가 말해 주는 **보완과 과잉**을 먼저 보시면 됩니다.';
        },
        strategy: function () {
            return '소통·돈·친밀 — 세 전장에서 승부가 갈리는 시기가 분명한 궁합이네요';
        },
        timeline: function () {
            return voiceMingliLine('대운은 10년짜리 계절입니다.') + ' 두 사람 계절이 겹칠 때만 크게 움직이십시오.';
        },
        caution: function () {
            return nA + '님과 ' + nB + '님, 지치는 날에 내리는 **즉석 합의**가 가장 비싼 실수가 되기 쉬운 조합이에요';
        },
        brief: function () {
            return nA + '님과 ' + nB + '님, 한 줄 목표만 맞춰도 마찰이 줄어드는 관계 브리프네요';
        }
    };
    var fn = pools[topic];
    if (fn) return fn();
    return buildCompatMetaphorTitle(ctx);
}

function buildCompatOpenerInner(topic, ctx) {
    ctx = ctx || {};
    var nA = nmNormalize(ctx.aName) || '한 분';
    var nB = nmNormalize(ctx.bName) || '한 분';
    var pools = {
        overview: [
            voiceMingliLine('일간·일지·오행이 동시에 말할 때 궁합 점수가 의미를 갖습니다.') + ' 숫자만 보지 말고 아래 패널 순서대로 읽어 보세요.',
            '두 분 다 바쁜데 마음이 엇갈릴 때가 있다면, 그건 성격 탓이 아니라 **기운 각도** 때문일 수 있어요.'
        ],
        personality: [
            '성격 카드는 비난이 아니라 **서로의 기본 온도**예요. 맞추려 하기보다 먼저 이름 붙이면 편해집니다.',
            voiceMingliLine('신강·신약은 혼자 버티는 힘의 양이 아니라, 관계에서 주도권이 어디로 가는지도 말합니다.')
        ],
        lover: [
            voiceMingliLine('일간 상생·상극은 애정 표현 방식의 차이로 나타납니다.') + ' 사랑의 언어가 다르면 오해가 커져요.',
            '도화살·합·충은 연애 사건의 **속도**를 바꿉니다. 빠르다고 나쁜 건 아니에요.'
        ],
        married: [
            '결혼 후엔 로맨스보다 **생활 숫자**가 먼저예요. 돈·집·육아 일정을 달력에 같이 적어 두십시오.',
            voiceMingliLine('대운이 겹치는 해는 관계의 계절이 바뀝니다.') + ' 그해에 큰 결정을 몰아넣지 마세요.'
        ],
        friend: [
            '우정은 자주 만날수록만 깊어지는 게 아니에요. **공통 관심사 한 가지**가 오래 가게 합니다.',
            '충(冲)이 있어도 우정은 깨지지 않아요. 다만 말버릇을 조심할 시기가 따로 있을 뿐이에요.'
        ],
        business: [
            voiceMingliLine('재성·관성 균형은 돈과 책임의 분담을 말합니다.') + ' 계약은 친함 다음에 적으십시오.',
            '역할을 나눌 때 직함 말고 **결정권 범위**를 문장으로 쓰면 마찰이 줄어요.'
        ],
        spouse: [
            '배우자궁은 이상형이 아니라 **무의식적으로 끌리는 온도**예요. 상대가 그림과 다르면 당황할 수 있어요.',
            voiceMingliLine('일지 합은 편안함, 충은 자극입니다.') + ' 둘 다 흉이 아니라 비용 구조에 가깝습니다.'
        ],
        wuxing: [
            '좌우 막대는 겉 비교용이에요. 한쪽이 과하면 그 오행 **생활 루틴**부터 맞추십시오.',
            nA + '님과 ' + nB + '님, 부족한 오행을 **같이 채우는 습관**이 궁합 점수를 올립니다.'
        ],
        strategy: [
            '소통은 감정 맞추기보다 **일정·돈 숫자**부터 맞출 때 비용이 줄어요.',
            '동업은 역할 한 줄, 친밀은 피로 주 **휴식 슬롯** — 세 가지를 따로 관리하십시오.'
        ],
        timeline: [
            voiceMingliLine('대운 싱크는 두 사람의 10년 계절이 겹치는지 봅니다.') + ' 초록·빨강 카드만 골라 일정을 잡으세요.',
            '안정기에는 관계 점검, 조율기에는 큰 말 줄이기 — 타임라인 색이 행동 지침입니다.'
        ],
        caution: [
            '지친 날 **즉석 합의**는 나중에 되돌리기 어렵습니다. 결론은 내일 아침으로 미루십시오.',
            '제3자에게 돈·험담을 맡기면 둘 사이 비용이 커져요. 직접 대화 한 통이 낫습니다.'
        ],
        brief: [
            '브리프는 예쁜 말이 아니라 **이번 달에 지킬 한 줄**이에요. 냉장고에 붙여 두셔도 좋습니다.',
            nA + '님과 ' + nB + '님, 공동 목표를 문장으로 고정하면 시너지가 커져요.'
        ]
    };
    var pool = pools[topic];
    if (!pool || !pool.length) return '';
    return pool[Math.abs(hashSeed(nA + nB + topic + 'cop')) % pool.length];
}

function buildCompatSajuKidOpener(ctx, innerLine) {
    ctx = ctx || {};
    var nA = nmNormalize(ctx.aName) || '한 분';
    var nB = nmNormalize(ctx.bName) || '한 분';
    var surface = pickVoiceLine(SAJUX_SURFACE_LINES, nA + nB + 'compatOpener');
    var open = surface + ' ' + nA + '님과 ' + nB + '님은 ';
    if (innerLine) return open + innerLine;
    return open + '서로 다른 기운이 맞닿을 때 시너지가 커지는 구조입니다.';
}

function _sajuxCompatChapterCount(reset) {
    if (typeof window === 'undefined') {
        _sajuxCompatChapterCount._n = reset ? 0 : (_sajuxCompatChapterCount._n || 0) + 1;
        return _sajuxCompatChapterCount._n;
    }
    if (reset || typeof window._sajuxCompatChapterIdx !== 'number') window._sajuxCompatChapterIdx = 0;
    if (!reset) window._sajuxCompatChapterIdx += 1;
    return window._sajuxCompatChapterIdx;
}
function buildCompatBridge(topic, ctx) {
    var nA = nmNormalize((ctx && ctx.aName) || '') || '한 분';
    var nB = nmNormalize((ctx && ctx.bName) || '') || '다른 한 분';
    var bridges = {
        overview:    null, // 첫 챕터 — 풀 인사
        personality: '두 분의 관계를 풀기 전에, 먼저 ' + nA + '님과 ' + nB + '님 각자의 결을 짚어 보겠습니다.',
        lover:       '서로의 결을 보았으니, 이제 두 분이 연인으로서 어떤 리듬을 만드는지 살피겠습니다.',
        married:     '연인의 호흡을 살폈으니, 부부로서 함께 살아가는 그림은 어떻게 그려지는지 풀어 보겠습니다.',
        friend:      '관계의 무게를 잠시 내려놓고, 두 분이 친구·동료로서는 어떤 거리를 지키면 좋은지 봅니다.',
        business:    '감정의 자리에서 한 발 비켜서서, 함께 일하거나 동업할 때의 그림을 짚어 보겠습니다.',
        child:       '두 분 사이에 새 식구가 더해진다면 어떤 결이 어우러지는지, 자녀와의 관계도 살펴봅니다.',
        spouse:      '배우자궁(일지)이 서로 어떻게 닿는지, 두 분의 가장 깊은 자리를 들여다봅니다.',
        crisis:      '관계에는 흐름이 있습니다. 어떤 시기가 같이 있기 좋은 시절이고, 어떤 시기에 한 발 거리를 두는 것이 좋은지 짚겠습니다.',
        timeline:    '대운(10년 흐름)이 두 분에게서 어떻게 겹치는지, 함께 갈 길의 색지도를 살펴봅니다.',
        caution:     '관계를 오래 지키려면 지뢰를 미리 알아두는 것이 좋습니다. 두 분이 특히 조심해야 할 자리를 정리해 드립니다.',
        wuxing:      '두 분의 에너지가 서로를 어떻게 채우는지, 오행의 균형을 함께 살펴봅니다.',
        strategy:    '관계의 결과 흐름을 보았으니, 일상에서 어떻게 호흡을 맞춰 갈지 정리해 드립니다.',
        brief:       '두 분의 관계를 한 장으로 요약합니다. 뒤에 이어지는 풀이의 길잡이로 봐주세요.'
    };
    return bridges[topic] === undefined ? null : bridges[topic];
}

function buildCompatChapterIntro(ctx, topic) {
    var idx = _sajuxCompatChapterCount();
    var bridge = buildCompatBridge(topic, ctx);
    var text;
    if (idx <= 1 || topic === 'overview' || bridge === null) {
        text = buildCompatSajuKidOpener(ctx, buildCompatOpenerInner(topic, ctx));
    } else {
        var inner = buildCompatOpenerInner(topic, ctx);
        text = bridge + (inner ? ' ' + inner : '');
    }
    var fakeData = { name: ctx && ctx.aName };
    return '<p class="ch-text ch-voice-opener compat-voice-opener" style="margin:0 0 16px;font-size:13.5px;line-height:1.95;color:rgba(255,255,255,0.78);">'
         + boldStarsToStrong(voicePolishParagraph(fakeData, text)) + '</p>';
}

/** 궁합 섹션 상단 — 은유 제목 + 사주아이형 도입 (ctx: a,b,aName,bName,isHap,isChung,score,…) */
function buildCompatVoiceSection(topic, ctx) {
    var label = SAJUX_COMPAT_SECTION_LABELS[topic] || '';
    return buildChapterHead(buildCompatTopicMetaphor(topic, ctx), label, { extraStyle: 'color:#f5f0e6;' })
        + buildCompatChapterIntro(ctx, topic);
}

function buildVipModuleTitles(data, daeunLabel, curY, curM) {
    return [
        '지금 내 에너지의 방향',
        daeunLabel + ' — 이 10년의 과제',
        curY + '년에 집중할 것',
        curM + '월 행동 지침'
    ];
}

function buildInlineIljuSummaryHtml(data) {
    var iljuKey = (data.dayStem || '') + (data.dayBranch || '');
    var db = getIljuDbEntry(data, iljuKey);
    var prof = getIljuProfilePolished(data, data.dayStem, data.dayBranch);
    var metaphor = buildMetaphorHookTitle(data);
    var core = db.core || (prof && prof.core) || '원국에 쌓인 기운이 삶의 방향을 이끕니다.';
    var inner = pickVoiceLine([
        String(core).split('.')[0] + '이라고 볼 수 있습니다.',
        voiceMingliLine('일주는 하루의 중심 기둥입니다.') + ' ' + String(core).split('.')[0] + '의 결이 느껴집니다.'
    ], iljuKey + 'ilju');
    var opener = buildSajuKidStyleOpener(data, inner);
    return voiceInlineInterpHeader('basic', data)
        + '<div class="inline-interp"><div class="ii-label">✦ 일주 해석</div>'
        + '<div class="ii-title">' + escHtmlAttr(metaphor) + '</div>'
        + '<div class="ii-text"><p class="ch-voice-opener" style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">' + boldStarsToStrong(opener) + '</p></div></div>';
}

function buildInlineWuxingSummaryHtml(data) {
    if (!data.wuxing) return '';
    var maxW = Object.keys(data.wuxing).reduce(function (a, b) { return data.wuxing[a] > data.wuxing[b] ? a : b; });
    var ohKr = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' }[maxW] || maxW;
    var excessText = window.SAJU_DB?.WUXING_EXCESS?.[maxW] || '';
    var inner = pickVoiceLine([
        ohKr + ' 기운이 삶의 중심을 잡고 있어요. ' + voiceMingliLine('부족한 오행은 습관으로 채웁니다.'),
        '에너지가 ' + ohKr + ' 쪽으로 기울어 있다고 볼 수 있어요.'
    ], maxW + 'wx');
    var body = buildSajuKidStyleOpener(data, inner) + (excessText ? ' ' + voicePolishParagraph(data, excessText) : '');
    return voiceInlineInterpHeader('wuxing', data)
        + '<div class="inline-interp"><div class="ii-label">✦ 오행 해석</div>'
        + '<div class="ii-title">' + escHtmlAttr(ohKr + ' 오행 — 에너지 분포') + '</div>'
        + '<div class="ii-text"><p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">' + boldStarsToStrong(body) + '</p></div></div>';
}

function buildInlineStrengthSummaryHtml(data) {
    if (!data.strengthText) return '';
    var isStrong = (data.strengthText || '').indexOf('신강') >= 0 || (data.strengthText || '').indexOf('강') >= 0;
    var inner = pickVoiceLine([
        isStrong
            ? '에너지가 넘칠 때는 방향만 틀려도 마찰이 커질 수 있어요. 자율이 보장된 자리에서 빛나는 구조예요.'
            : '혼자 짊어지다 지치기 쉬운 구조라, 맞는 파트너·환경이 곁에 있을 때 배가 됩니다.',
        voiceMingliLine(isStrong ? '신강은 기운의 양입니다.' : '신약은 연결의 민감도입니다.')
            + (isStrong ? ' 팀 없이 독주하면 비용이 커져요.' : ' 귀인을 가까이 두는 것이 전략의 핵심이에요.')
    ], (data.strengthText || '') + 'st');
    var body = buildSajuKidStyleOpener(data, inner);
    return voiceInlineInterpHeader('strength', data)
        + '<div class="inline-interp"><div class="ii-label">✦ 신강·신약 해석</div>'
        + '<div class="ii-title">' + escHtmlAttr(data.strengthText) + '</div>'
        + '<div class="ii-text"><p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">' + boldStarsToStrong(body) + '</p></div></div>';
}

function compatNm(ctx, side) {
    var p = side === 'b' ? ctx.b : ctx.a;
    var raw = side === 'b' ? ctx.bName : ctx.aName;
    return nmNormalize(raw || (p && p.name)) || (side === 'b' ? '두 번째 분' : '첫 번째 분');
}

function compatStrengthVoice(strength, name, seed) {
    var nm = nmNormalize(name) || '한 분';
    if (strength === '신강') {
        return pickVoiceLine([
            nm + '님은 방향만 잡히면 속도가 붙는, 주도형 기질이에요.',
            nm + '님에게는 자율이 보장된 자리에서 힘이 살아나요.',
            voiceMingliLine('신강은 나쁜 것이 아니라 에너지의 양입니다.') + ' ' + nm + '님은 혼자 끌고 가는 편이 낫습니다.'
        ], seed);
    }
    return pickVoiceLine([
        nm + '님은 맞는 사람·환경과 맞물릴 때 결과가 배가 되는, 협력형 기질이에요.',
        nm + '님에게는 좋은 파트너가 곁에 있을 때 안정이 커져요.',
        voiceMingliLine('신약은 나약함이 아닙니다.') + ' ' + nm + '님은 혼자 밀기보다 손을 잡을 때 빛나요.'
    ], seed);
}

function compatStrengthCaution(strength, name, seed) {
    var nm = nmNormalize(name) || '한 분';
    if (strength === '신강') {
        return pickVoiceLine([
            '고집이 세질 때 관계 비용이 커져요. 이번 주엔 “내가 따를게” 한 번만 말해 보십시오.',
            '에너지를 여러 갈래로 쓰면 마찰이 납니다. 메인 한 가지만 달력에 박아 두십시오.'
        ], seed + 'c');
    }
    return pickVoiceLine([
        '결정 순간에 둘 다 망설이면 기회가 스쳐 지나갈 수 있어요. “우리가 원하는 것”을 문장으로 적어 두십시오.',
        '타인 말에 흔들리기 쉬운 날입니다. 중요한 약속은 하루만 미루고 다시 맞추십시오.'
    ], seed + 'c');
}

function buildCompatPersonalityPanelHtml(ctx, aChar, bChar) {
    var aName = compatNm(ctx, 'a');
    var bName = compatNm(ctx, 'b');
    var a = ctx.a || {};
    var b = ctx.b || {};
    var aDB = a.dayBranch || '';
    var bDB = b.dayBranch || '';
    var combo = pickVoiceLine([
        a.strength === b.strength && a.strength === '신강'
            ? '두 분 다 주도형이라 에너지는 넘치지만, 같은 방식을 고집하면 충돌 비용이 커져요. 한 사람이 “오늘은 내가 따를게”라고 말하는 날을 정해 두십시오.'
            : a.strength === b.strength && a.strength === '신약'
            ? '두 분 다 섬세해서 공감은 쉬운데, 결정은 늦어질 수 있어요. “우리가 원하는 것”을 한 문장으로 적는 날을 잡으십시오.'
            : (a.strength === '신강' ? aName : bName) + '님이 앞에서 이끌고 ' + (a.strength === '신약' ? aName : bName) + '님이 조율하는 구조가 가장 자연스러워요.',
        voiceMingliLine('신강·신약은 역할 분담의 힌트입니다.') + ' 서로의 강점을 이름 붙이면 편해집니다.'
    ], aName + bName + 'combo');
    return [
        '<div class="insight-card" style="border-left:3px solid var(--gold);">',
        '<div class="tag">💛 ' + escHtmlAttr(aName) + '님 — 타고난 성격과 기질</div><br>',
        '<span style="font-size:12px;color:#888;">일주: ' + escHtmlAttr((a.dayStem || '') + aDB) + ' · ' + escHtmlAttr(a.strength || '') + '</span><br><br>',
        aChar,
        '<br><br><span style="font-size:12.5px;color:#bbb;line-height:1.85;">',
        escHtmlAttr(compatStrengthVoice(a.strength, aName, aName + 'a')) + '<br>',
        escHtmlAttr(compatStrengthCaution(a.strength, aName, aName + 'ac')),
        '</span></div>',
        '<div class="insight-card" style="border-left:3px solid var(--gold-soft);">',
        '<div class="tag" style="background:rgba(199,167,106,0.12);color:var(--gold-soft);">✦ ' + escHtmlAttr(bName) + '님 — 타고난 성격과 기질</div><br>',
        '<span style="font-size:12px;color:#888;">일주: ' + escHtmlAttr((b.dayStem || '') + bDB) + ' · ' + escHtmlAttr(b.strength || '') + '</span><br><br>',
        bChar,
        '<br><br><span style="font-size:12.5px;color:#bbb;line-height:1.85;">',
        escHtmlAttr(compatStrengthVoice(b.strength, bName, bName + 'b')) + '<br>',
        escHtmlAttr(compatStrengthCaution(b.strength, bName, bName + 'bc')),
        '</span></div>',
        '<div class="insight-card"><div class="tag">🔀 두 사람의 성격 조합</div><br>',
        '<p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">' + boldStarsToStrong(combo) + '</p></div>'
    ].join('');
}

function buildCompatLoverPanelHtml(ctx) {
    var aName = compatNm(ctx, 'a');
    var bName = compatNm(ctx, 'b');
    var a = ctx.a || {};
    var b = ctx.b || {};
    var badges = [];
    if (ctx.aDohwa) badges.push('<span class="sp-badge g">🌸 ' + escHtmlAttr(aName) + ' 도화살</span>');
    if (ctx.bDohwa) badges.push('<span class="sp-badge g">🌸 ' + escHtmlAttr(bName) + ' 도화살</span>');
    if (!ctx.aDohwa && !ctx.bDohwa) badges.push('<span class="sp-badge n">도화살 없음</span>');
    if (ctx.isHap) badges.push('<span class="sp-badge g">💞 일지 합 — 강한 끌림</span>');
    if (ctx.isChung) badges.push('<span class="sp-badge r">⚡ 일지 충 — 마찰 주의</span>');
    var sync = ctx.shengAB
        ? escHtmlAttr(aName) + '님이 ' + escHtmlAttr(bName) + '님을 자연스럽게 감싸 이끄는 구조예요. 애정 표현에서 주도권이 뚜렷합니다.'
        : ctx.shengBA
        ? escHtmlAttr(bName) + '님이 ' + escHtmlAttr(aName) + '님에게 정서적 안정을 주는 구조예요. 유대감이 깊어지기 쉬운 조합이에요.'
        : ctx.aOh === ctx.bOh
        ? '같은 오행의 비화 관계라 이해는 쉬운데, 새 자극이 필요할 때가 있어요.'
        : '서로 다른 매력으로 끌리는, 상보형 애정 리듬이에요.';
    var marry = pickVoiceLine([
        a.strength === '신강' && b.strength === '신약'
            ? escHtmlAttr(aName) + '님의 추진과 ' + escHtmlAttr(bName) + '님의 조율이 결혼 후 집안 리듬을 잡기 좋아요.'
            : a.strength === '신약' && b.strength === '신강'
            ? escHtmlAttr(bName) + '님의 추진과 ' + escHtmlAttr(aName) + '님의 지지가 균형을 이뤄요.'
            : '두 분 에너지가 비슷하면, 용신·대운이 겹치는 해에 큰 결정을 맞추는 편이 낫습니다.',
        voiceMingliLine('배우자궁 합·충은 속도를 바꿉니다.') + ' 서두르기보다 약속 리듬을 맞추십시오.'
    ], aName + bName + 'marry');
  var hapBlock = ctx.isHap
        ? '<div class="insight-card"><div class="tag green">✨ 일지 합</div><br><p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">'
            + voiceMingliLine('일지 합은 배우자궁이 맞물리는 신호입니다.') + ' 처음부터 편안함이 오는 인연이라, **작은 약속을 지키는 습관**이 관계를 오래 가게 합니다.</p></div>'
        : ctx.isChung
        ? '<div class="insight-card"><div class="tag red">⚡ 일지 충</div><br><p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">'
            + escHtmlAttr(a.dayBranch || '') + '·' + escHtmlAttr(b.dayBranch || '') + ' 충은 생활 방식의 각도가 맞닿는다는 뜻이에요. 다름을 인정하는 **하루 쿨다운 규칙**을 정해 두십시오.</p></div>'
        : '';
    return '<div class="special-badges">' + badges.join('') + '</div>'
        + '<div class="insight-card"><div class="tag">💕 애정 싱크</div><br><p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">'
        + boldStarsToStrong(sync) + '</p></div>'
        + '<div class="insight-card"><div class="tag">💍 결혼·전환 타이밍</div><br><p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">'
        + boldStarsToStrong(marry) + '</p></div>'
        + hapBlock;
}

function buildCompatFriendPanelHtml(ctx) {
    var aName = compatNm(ctx, 'a');
    var bName = compatNm(ctx, 'b');
    var aDB = (ctx.a && ctx.a.dayBranch) || '';
    var bDB = (ctx.b && ctx.b.dayBranch) || '';
    var e1 = ctx.isChung
        ? pickVoiceLine(['의견이 부딪혀도 서로 자극이 되는 우정이에요. 싸운 날은 결론을 내일로 미루십시오.', '충(冲)은 끊김이 아니라 각도 조정 비용입니다.'], aName + 'fr1')
        : ctx.isHap
        ? pickVoiceLine(['대화가 자연스럽고 오해가 적은, 오래 가는 우정이에요.', '합(合)은 편안함 — 가끔 새 자극이 필요할 뿐이에요.'], aName + 'fr2')
        : pickVoiceLine(['관심사가 달라도 강점이 보완되는 우정이에요.', '에너지 차이는 있어도 서로 다른 시각이 도움이 됩니다.'], aName + 'fr3');
    var e2 = (ctx.samhapScore > 0)
        ? voiceMingliLine('삼합은 같은 방향 에너지입니다.') + ' 공통 목표 하나만 잡아도 우정이 깊어져요.'
        : (ctx.score >= 60)
        ? escHtmlAttr(aName) + '님과 ' + escHtmlAttr(bName) + '님은 서로에게 영감을 주는 장기 인연이에요.'
        : '연락 리듬을 정해 두면 우정이 오래 갑니다. **한 달에 한 번, 같은 취미**만이라도 고정하십시오.';
    return '<div class="insight-card"><div class="tag">🤝 에너지 진단</div><br><p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">'
        + boldStarsToStrong(e1) + '</p></div>'
        + '<div class="insight-card"><div class="tag">📅 장기 지속성</div><br><p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">'
        + boldStarsToStrong(e2) + '</p></div>';
}

function buildCompatBizPanelHtml(ctx) {
    var aName = compatNm(ctx, 'a');
    var bName = compatNm(ctx, 'b');
    var wealth = pickVoiceLine([
        ctx.shengAB
            ? escHtmlAttr(aName) + '님이 방향을 잡고 ' + escHtmlAttr(bName) + '님이 실행하는 분담이 맞아요.'
            : ctx.shengBA
            ? escHtmlAttr(bName) + '님이 전략을 세우고 ' + escHtmlAttr(aName) + '님이 밀어붙이는 구조가 좋아요.'
            : '동등 파트너십이면 **역할·돈·결정권**을 문장으로 나누지 않으면 비용이 커져요.',
        voiceMingliLine('상생 관계는 누가 앞서가느냐의 문제입니다.') + ' 계약은 친함 다음에 적으십시오.'
    ], aName + bName + 'biz');
    function styleDesc(st, nm, seed) {
        if (st === '신강') return pickVoiceLine([nm + '님은 큰 그림을 먼저 보는 추진형이에요.', nm + '님에게는 속도가 곧 경쟁력입니다.'], seed);
        if (st === '신약') return pickVoiceLine([nm + '님은 리스크를 먼저 보는 신중형이에요.', nm + '님에게는 합의가 곧 안전입니다.'], seed);
        return nm + '님은 상황에 맞게 유연하게 결정하는 균형형이에요.';
    }
    var a = ctx.a || {};
    var b = ctx.b || {};
    var dec = a.strength !== b.strength
        ? '결정 스타일이 달라 보완이 됩니다. 중요한 일은 **서면으로 역할**을 먼저 맞추십시오.'
        : '스타일이 비슷해 합의는 빠르지만, 외부 검토 한 번이 비용을 줄여요.';
    return '<div class="insight-card"><div class="tag">💰 재물·동업 리듬</div><br><p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">'
        + boldStarsToStrong(wealth) + '</p></div>'
        + '<div class="insight-card"><div class="tag">🧠 의사결정 스타일</div><br><p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">'
        + escHtmlAttr(aName) + '님: ' + escHtmlAttr(styleDesc(a.strength, aName, 'as')) + '<br>'
        + escHtmlAttr(bName) + '님: ' + escHtmlAttr(styleDesc(b.strength, bName, 'bs')) + '<br><br>'
        + boldStarsToStrong(dec) + '</p></div>';
}

function buildCompatSpousePanelHtml(ctx, aSpouse, bSpouse) {
    var aName = compatNm(ctx, 'a');
    var bName = compatNm(ctx, 'b');
    var a = ctx.a || {};
    var b = ctx.b || {};
    var aDB = a.dayBranch || '';
    var bDB = b.dayBranch || '';
    var why = ctx.isHap
        ? voiceMingliLine('배우자궁 합은 이상형에 가깝게 끌리는 신호입니다.') + ' “이 사람이다”는 느낌이 강할 수 있어요.'
        : ctx.isChung
        ? '다름이 강한 자극으로 끌리는 구조예요. **다툰 날 규칙**을 미리 정해 두십시오.'
        : '직접 합충은 없어도 오행 보완으로 서로의 빈칸을 채우는 인연이에요.';
    return [
        '<div class="insight-card" style="border-left:3px solid var(--gold);">',
        '<div class="tag">💛 ' + escHtmlAttr(aName) + '님이 끌리는 이성</div><br>',
        '<strong>일지: ' + escHtmlAttr(aDB) + '</strong><br><br>',
        '<p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">' + polishCompatLine(ctx, 'a', aSpouse) + '</p>',
        '<br><span style="font-size:11px;color:#777;">※ 배우자궁은 무의식적으로 끌리는 온도입니다.</span></div>',
        '<div class="insight-card" style="border-left:3px solid var(--gold-soft);">',
        '<div class="tag">✦ ' + escHtmlAttr(bName) + '님이 끌리는 이성</div><br>',
        '<strong>일지: ' + escHtmlAttr(bDB) + '</strong><br><br>',
        '<p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">' + polishCompatLine(ctx, 'b', bSpouse) + '</p></div>',
        '<div class="insight-card"><div class="tag">🔄 두 사람이 끌리는 이유</div><br>',
        '<p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">' + boldStarsToStrong(why) + '</p></div>'
    ].join('');
}

function buildCompatMarriedWealthHtml(ctx) {
    var aName = compatNm(ctx, 'a');
    var bName = compatNm(ctx, 'b');
    var a = ctx.a || {};
    var b = ctx.b || {};
    var ac = a.counts || {};
    var bc = b.counts || {};
    var aLine = (ac.metal > 1 || ac.earth > 1)
        ? escHtmlAttr(aName) + '님은 재성·관성 기운이 있어 **생활 숫자**를 먼저 맞추는 편이에요.'
        : escHtmlAttr(aName) + '님은 돈보다 관계·성장 리듬을 먼저 보는 편이에요.';
    var bLine = (bc.metal > 1 || bc.earth > 1)
        ? escHtmlAttr(bName) + '님도 쌓는 쪽 기운이 있어 함께 자산을 쌓기 좋아요.'
        : escHtmlAttr(bName) + '님은 정서적 유대를 먼저 챙기는 편이에요.';
    var act = pickVoiceLine([
        voiceMingliLine('재성·관성은 돈과 책임의 분담을 말합니다.') + ' **통장·지출 카테고리**를 한 번만 같이 적어 보십시오.',
        '부부는 로맨스보다 **생활 숫자**가 먼저예요. 이번 달 고정지출만 맞춰도 마찰이 줄어요.'
    ], aName + bName + 'mw');
    return '<div class="insight-card"><div class="tag">💍 재성·관성 균형</div><br><p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">'
        + aLine + ' ' + bLine + ' ' + boldStarsToStrong(act) + '</p></div>';
}

function buildCompatChildHtml(ctx, score) {
    var aName = compatNm(ctx, 'a');
    var bName = compatNm(ctx, 'b');
    var a = ctx.a || {};
    var b = ctx.b || {};
    var ac = a.counts || {};
    var bc = b.counts || {};
    var warm = (ac.wood + ac.fire > 3) || (bc.wood + bc.fire > 3);
    var late = (ac.water + ac.metal > 3) || (bc.water + bc.metal > 3);
    var open = warm
        ? '목화(木火) 기운이 풍부해 자녀 인연이 따뜻하게 열리기 쉬운 편이에요. '
        : '';
    if (late) open += '금수(金水)가 강하면 인연이 늦게 느껴질 수 있어요. 서두르지 마세요. ';
    var tail = pickVoiceLine([
        '자녀는 **계획보다 리듬**이 먼저예요. 두 분이 피로하지 않은 해를 골라 보십시오.',
        score >= 65 ? '인연은 비교적 순탄한 편이에요. 다만 양육 방식은 미리 한 줄로 맞추십시오.' : '인연은 노력형이에요. **같은 메시지**를 아이 앞에서 유지하십시오.'
    ], aName + bName + 'ch');
    return '<div class="insight-card"><div class="tag">👶 자녀운</div><br><p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">'
        + boldStarsToStrong(open + tail) + '</p></div>';
}

function compatCrisisNarrative(oh, isGood, isBad, seed) {
    var good = {
        wood: '새 도전 에너지가 넘칩니다. **함께 시작할 일 한 가지**만 정하십시오.',
        fire: '활력이 커지는 시기예요. **여행·새 경험**을 같이 넣으면 유대가 깊어져요.',
        earth: '자산·집안 리듬을 잡기 좋아요. **큰 결정은 서면**으로만 하십시오.',
        metal: '정리·본질에 집중하기 좋아요. 진지한 대화 한 통이 관계를 단단하게 해요.',
        water: '직관이 살아나요. **감정을 글로** 먼저 나누면 오해가 줄어요.'
    };
    var caution = {
        wood: '한쪽만 크게 바뀌려 할 때 불안이 커져요. 변화 속도를 맞추십시오.',
        fire: '충동 지출·이사를 서두르지 마세요. **하루 유예** 후 결정하십시오.',
        earth: '권태·재정 갈등이 생기기 쉬워요. 고정지출부터 점검하십시오.',
        metal: '원칙 충돌이 커져요. 작은 일도 **내일 아침**으로 미루십시오.',
        water: '불안·의심이 커지기 쉬워요. 사소한 숨김도 비용이 큽니다.'
    };
    var neutral = '큰 사건 없이 **관계 점검**하기 좋은 시기예요. 공통 목표 한 줄만 재확인하십시오.';
    if (isGood) return good[oh] || good.earth;
    if (isBad) return caution[oh] || caution.earth;
    return neutral;
}

function compatTimelineLine(cls, seed) {
    var pools = {
        good: [
            '두 분 에너지가 같은 방향으로 흐르는 시기예요. 함께 시작한 일을 **한 줄로 적고** 같이 밀어 보십시오.',
            '외부 기회가 동시에 오는 해입니다. 혼자 잡지 말고 **역할을 나눠** 잡으십시오.',
            '이 시기에 내린 약속이 10년 뒤를 만듭니다. 중요한 결정만 골라 실행하세요.'
        ],
        hard: [
            '대운 각도가 맞지 않으면 작은 말도 크게 들릴 수 있어요. **하루 쿨다운**을 먼저 쓰십시오.',
            '한쪽만 힘든 시기면 지지가 관계를 지킵니다. 비난보다 일정 조정이 먼저예요.',
            '외부 스트레스가 안으로 들어오기 쉬워요. 큰 결정은 잠시 보류하십시오.'
        ],
        half: [
            '큰 기복 없이 루틴을 쌓기 좋은 시기예요. **공통 취미 한 가지**만 고정하십시오.',
            '사건운보다 일상의 리듬이 중요한 해입니다. 약속 시간을 지키는 것만으로도 충분해요.',
            '관계 점검·목표 재확인에 좋은 구간입니다. 긴 대화 한 번이면 됩니다.'
        ]
    };
    var arr = pools[cls] || pools.half;
    return pickVoiceLine(arr, seed);
}

function buildTopicOpenerInner(topic, data) {
    var nm = nmNormalize(data.name || '') || '고객';
    var mainSip = getDominantSipseong(data);
    var oh = getMinMaxOh(data);
    var OH_KR = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' };
    var pools = {
        wuxing: [
            '오행 중 ' + (OH_KR[oh.maxW] || '') + ' 기운이 삶의 중심을 잡고 있어요. ' + voiceMingliLine('부족한 쪽을 채우는 습관이 체감을 바꿉니다.'),
            '에너지 분포를 보면 ' + (OH_KR[oh.maxW] || '') + ' 쪽으로 쏠려 있다고 볼 수 있어요.'
        ],
        sipseong: [
            '십성으로 보면 ' + mainSip + ' 축이 먼저 움직이는 구조예요. ' + voiceMingliLine('같은 묶음 안의 두 십성은 합산해 읽습니다.'),
            '일하는 방식의 핵심은 ' + mainSip + ' 쪽 반응이에요.'
        ],
        wealth: [
            voiceMingliLine('재성의 흐름은 감이 아니라 리듬에 가깝습니다.') + ' 쌓는 해와 지키는 해가 갈립니다.',
            '돈은 한 번에 오기보다 반복된 습관에서 남는 경우가 많아요.'
        ],
        career: [
            '직함보다 **서면에 남는 권한**이 커리어의 핵심이에요.',
            voiceMingliLine('관성 축이 강할수록 평판이 수입보다 먼저 움직입니다.')
        ],
        love: [
            '애정은 만난 횟수보다, **약속이 지켜지는 속도와 결**이 더 중요해요.',
            voiceMingliLine('일지 성향과 세운 자극이 겹칠 때 관계 사건이 빨라집니다.')
        ],
        health: [
            '몸은 갑자기 무너지기보다 **작은 신호**로 먼저 말해요.',
            voiceMingliLine('용신 오행과 맞는 생활 리듬이 회복 속도를 바꿉니다.')
        ],
        hidden: [
            voiceMingliLine('지장간은 겉 지지 너머의 잠재 에너지입니다.') + ' 대운·세운에 같은 지지가 올 때 순서대로 깨어납니다.',
            '내면의 끌림은 종종 지장간에서 옵니다.'
        ],
        daeun: [
            voiceMingliLine('대운은 10년짜리 기후입니다.') + ' 계절을 모르면 옷을 잘못 입게 됩니다.',
            '지금 지나는 10년은 인생 계절표의 한 칸이에요.'
        ],
        seyun: [
            voiceMingliLine('세운은 그해의 날씨입니다.') + ' 길·흉보다 무엇을 할지 고르는 편이 낫습니다.',
            '연도마다 돈·서류·사람의 무게가 달라집니다.'
        ],
        monthly: [
            voiceMingliLine('월운은 그달의 시간대입니다.') + ' 맞는 달에 밀고, 부딪히는 달엔 일정을 비우세요.',
            '한 해 안에서도 호흡은 달마다 달라집니다.'
        ],
        remedy: [
            '개운법은 장식이 아니라 **이번 주부터 지킬 루틴**이에요.',
            voiceMingliLine('용신·희신은 몸에 맞는 기운, 기신은 부담이 큰 기운으로 읽습니다.')
        ],
        basic: [
            function () {
                var prof = getIljuProfilePolished(data, data.dayStem, data.dayBranch);
                if (prof && prof.core) return String(prof.core).split('.')[0] + '이라고 볼 수 있어요.';
                return '원국에 쌓인 기운이 삶의 방향을 이끕니다.';
            }
        ],
        current: [
            nm + '님에게 지금 겹치는 흐름은 **대운·세운·월운** 세 겹이에요. 숫자와 약속이 같은 주에 몰리면 하루만 쪼개도 충분합니다.'
        ],
        master: [
            nm + '님 원국을 성격·돈·일·사랑·몸 다섯 갈래로 나눠 읽을 거예요. 서두르지 않아도 됩니다.'
        ],
        relation: [
            voiceMingliLine('합은 뭉치고 충은 방향을 바꿉니다.') + ' 둘이 같이 오면 우선순위를 먼저 정하세요.'
        ],
        shinsal: [
            '신살은 공포가 아니라 **바람의 이름**에 가깝습니다.',
            voiceMingliLine('같은 신살이라도 걸린 기둥에 따라 의미가 달라집니다.')
        ],
        strength: [
            function () {
                var st = (data.strengthText || '').indexOf('신강') >= 0;
                return st
                    ? '신강에 가깝다면 에너지가 넘칠 때 방향만 틀려도 마찰이 커질 수 있어요. 그건 성격이 나빠서가 아니라 구조 때문이에요.'
                    : '신약에 가깝다면 혼자 끌어가다 지친 적이 있을 수 있어요. 맞는 손·환경이 붙을 때 체감이 달라집니다.';
            }
        ],
        relation: [
            voiceMingliLine('합은 빨리 붙고 충은 각도가 정면입니다.') + ' 둘 다 흉복이 아니라 비용 구조에 가깝습니다.',
            '사람·돈·약속이 같은 주에 겹치면 하루만 쪼개도 충돌 비용이 줄어듭니다.'
        ],
        shinsal: [
            '신살은 공포가 아니라 바람의 이름에 가깝습니다. 길성은 무기, 신살은 훈련장이에요.',
            voiceMingliLine('같은 신살도 걸린 기둥에 따라 체감이 달라집니다.') + ' 이름만 보고 겁먹지 마세요.'
        ]
    };
    var pool = pools[topic];
    if (!pool) return '';
    var pick = pool[Math.abs(hashSeed(nm + topic + 'op')) % pool.length];
    return typeof pick === 'function' ? pick(data) : pick;
}

/** 기존 buildSajuKidStyleOpener — 겉/속 문장 로테이션 */
function buildSajuKidStyleOpener(data, innerLine) {
    var nm = nmNormalize(data.name || '') || '고객';
    var ds = data.dayStem || '';
    var db = data.dayBranch || '';
    var HK = { '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무', '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계' };
    var JK = { '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사', '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해' };
    var iljuKr = (HK[ds] || ds) + (JK[db] || db);
    var surface = pickVoiceLine(SAJUX_SURFACE_LINES, nm + 'opener');
    var open = surface + ' ' + nm + '님은 일주 ' + iljuKr + '의 기운을 타고나, ';
    if (innerLine) return open + innerLine;
    var prof = getIljuProfilePolished(data, ds, db);
    if (prof && prof.core) {
        var coreShort = String(prof.core).split('.')[0];
        return open + coreShort + '이라고 볼 수 있습니다.';
    }
    return open + '원국에 쌓인 기운이 삶의 방향을 이끕니다.';
}

/** 세운 연도별 4분야(재물·직업·문서·애정) 동적 키워드 — 용신/기신 점수·세운 십성 반영 */
function yearlyFourDomainKeywords(score, sewSip) {
    var sip = sewSip || '';
    var w, cr, doc, love;
    if (score >= 3) {
        w = '큰 변동 구간 — 잃을 수 있는 범위 안에서만 움직이십시오';
        cr = '외부 이미지·역할 확장에 유리한 시기, 이직·승진 신호';
        doc = /식신|상관|편재|정재/.test(sip) ? '계약·저작권·장기 약정 체결에 유리한 때입니다' : '메일·문서 증빙만 정리해도 큰 실속입니다';
        love = /식신|편재|정재|비견/.test(sip) ? '소개·모임에서 새 인연이 닿을 수 있습니다' : '추천 모임에서 천천히 신뢰를 쌓으십시오';
    } else if (score >= 1) {
        w = '나눠서 투자·배당 수익 우선, 가격이 크게 오르내리는 자산은 소액만';
        cr = '야근·경쟁 속에서도 실적을 꼼꼼히 정리해 두는 시기입니다';
        doc = /식신|상관|편인/.test(sip) ? '요구사항을 먼저 정리해두면 승인이 빨라집니다' : '계약 조항과 증빙을 꼭 확인하고 서명하십시오';
        love = /정재|편관|정관/.test(sip) ? '직장·소개 경로에서 만날 때는 조건을 먼저 적어 두십시오' : '영상 통화 한 번 후 대면 — 기본 정보를 확인하십시오';
    } else if (score === 0) {
        w = '빚을 써서 키우는 투자는 쉬고, 현금과 안전한 자산을 유지하십시오';
        cr = '지금 자리를 지키며 자격증 하나만 집중하십시오';
        doc = '세금·증빙 서류를 정리해 두는 루틴을 만드십시오';
        love = '단체 채팅보다 한 사람씩 깊이 경청하십시오';
    } else if (score >= -2) {
        w = '가격이 크게 오르내리는 자산 비중을 줄이고, 안전한 펀드로 재편하십시오';
        cr = '불필요한 내부 갈등 노출을 피하고, 위험 요소를 미리 목록으로 관리하십시오';
        doc = '구독·자동연장 조항과 해지일을 점검하십시오';
        love = '새 소개·단체 초대를 한꺼번에 늘리는 것은 잠시 멈추십시오';
    } else {
        w = '손실을 막는 기준선과 최소 생활비를 먼저 확보하십시오';
        cr = '조직 갈등에서는 거리를 두고, 규정에 따라 선제적으로 대응하십시오';
        doc = '법무·세무 전문가의 조언을 미리 받아두십시오';
        love = '알림을 정리하고, 중요한 관계부터 다시 정돈하십시오';
    }
    return { wealth: w, career: cr, doc: doc, love: love };
}

/** 4대 인디케이터용 짧은 키워드(명사형, 최대 10자) — UI 줄바꿈 방지 */
function clampKeyword10(t) {
    var s = String(t == null ? '' : t).trim().replace(/\s+/g, ' ');
    if (s.length <= 10) return s;
    return s.substring(0, 10);
}
function escHtmlAttr(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** 긴 문단을 짧은 호흡으로 — 멘토 톤 유지용 (고정 템플릿 문자열에만 사용) */
function mentorBreakSentences(htmlish) {
    return String(htmlish || '').replace(/\. /g, '.</p><p style="margin:0 0 8px;line-height:1.85;color:#ddd;">');
}
/** `**강조**` → <strong> (리포트 본문 HTML에 삽입할 때만 사용) */
/**
 * 본문 텍스트 중 단독으로 박혀 있는 천간/지지 한자를 발견하면 오행색 span으로 감싸 줌.
 * - 이미 <span class="hwood ...">…</span>처럼 색이 입혀진 한자는 건드리지 않음.
 * - <strong>·<b>·<em>·<i>·<u>·<a> 같은 인라인 강조 안에 든 한자는 색칠 OK.
 * - 차원이 다른 큰 디스플레이 한자(20px 이상)는 sajuxHanjaInlineStyle을 따로 쓰므로 영향 없음.
 */
function colorizeHanjaInline(html) {
    if (!html) return '';
    var s = String(html);
    var STEM_OH = { '甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water' };
    var BRANCH_OH = { '子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water' };
    var COLOR = { wood:'var(--wood, #6FBF73)', fire:'var(--fire, #E76F51)', earth:'var(--earth, #C8A45C)', metal:'var(--metal, #C9CDD2)', water:'var(--water, #181828)' };
    var HAN_RE = /[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/g;

    // 보호할 영역(이미 색/스타일이 들어간 곳)을 placeholder로 치환했다가 마지막에 복원
    var protects = [];
    function protect(m) { protects.push(m); return '\x00P' + (protects.length - 1) + '\x01'; }

    // 1) <span ...>…</span> 중 class에 hwood/hfire/hearth/hmetal/hwater 가 있거나
    //    style에 color: 가 명시된 경우 보호
    s = s.replace(/<span\b[^>]*?(?:class\s*=\s*["'][^"']*\bh(?:wood|fire|earth|metal|water)\b[^"']*["']|style\s*=\s*["'][^"']*color\s*:[^"']*["'])[^>]*>[\s\S]*?<\/span>/g, protect);
    // 2) <div … style="…color:…" … >…</div>도 한 번 보호 (대형 디스플레이 한자 카드 등)
    s = s.replace(/<(div|p)\b[^>]*style\s*=\s*["'][^"']*color\s*:[^"']*["'][^>]*>[\s\S]*?<\/\1>/g, protect);
    // 3) <table>·<style>·<script>는 통째 보호 (만세력 표는 자체 색 시스템)
    s = s.replace(/<(table|style|script)[\s\S]*?<\/\1>/gi, protect);

    // 한자 단일 글자에 span 입히기
    s = s.replace(HAN_RE, function (ch) {
        var oh = STEM_OH[ch] || BRANCH_OH[ch];
        if (!oh) return ch;
        var col = COLOR[oh];
        var stroke = (oh === 'water') ? ';-webkit-text-stroke:0.5px rgba(255,255,255,0.65);paint-order:stroke fill' : '';
        return '<span class="hanja-oh h' + oh + '" style="color:' + col + ';font-family:\'Noto Sans KR\',sans-serif;font-weight:500' + stroke + '">' + ch + '</span>';
    });

    // 보호 영역 복원
    s = s.replace(/\x00P(\d+)\x01/g, function (_, i) { return protects[+i]; });
    return s;
}

function boldStarsToStrong(s) {
    var html = String(s == null ? '' : s).replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');
    return colorizeHanjaInline(html);
}

/** 사주아이형 톤 정리 — VIP·카드·고정문 공통 (【】·당신→님은·IT슬랭 완화) */
function voicePolishParagraph(data, text) {
    var s = String(text == null ? '' : text);
    var nm = nmNormalize(data && data.name) || '고객';
    s = s.replace(/【/g, '**').replace(/】/g, '**');
    s = s.replace(/당신의/g, nmUi(nm));
    s = s.replace(/당신은/g, nmDnim(nm) + '은');
    s = s.replace(/당신이/g, nmIGa(nm));
    s = s.replace(/당신을/g, nmEulReul(nm));
    s = s.replace(/당신께/g, nmKke(nm));
    s = s.replace(/당신께는/g, nmKkeEunNeun(nm));
    s = s.replace(/당신(?![은이가을의께는])/g, nmDnim(nm));
    s = s.replace(/\bIT\b/g, '전문');
    s = s.replace(/파이프라인/g, '수입 줄기');
    s = s.replace(/메시지·문의/g, '문의·연락');
    s = s.replace(/메시지·댓글/g, '문자·댓글');
    s = s.replace(/온라인 실험/g, '새 시도');
    s = s.replace(/온라인에 배치/g, '밖으로 드러나');
    s = s.replace(/온라인 모임/g, '모임');
    s = s.replace(/KPI/g, '역할 한 줄');
    s = s.replace(/고변동/g, '변동 큰');
    s = s.replace(/테마 성격 자산/g, '변동 큰 자산');
    s = s.replace(/새 온라인 채널/g, '새 소개 경로');
    s = s.replace(/플랫폼/g, '무대');
    s = s.replace(/유년기부터\s*만년까지/g, '유년기부터 말년까지');
    s = s.replace(/풍요롭은/g, '풍요로운');
    s = s.replace(/풍요로운의/g, '풍요로움의');
    s = s.replace(/([가-힣]+)롭은(?=\s|분|것|형|인|자|때|데|며|고|\.|,|$)/g, '$1로운');
    // Remove a known repeated/macro sentence if present (defensive).
    s = s.replace(/겉으로는 듬직해 보이지만, 속으로는 누구보다 치열하게 고민하는 편[^\n\<\>]{0,120}/g, '');

    // ── 명리 DB 어투 자연어화 — "~ 상(象)." 같은 한자식 종결을 부드럽게 풀어 줍니다.
    //   예) "촛불이 여름 대지 위에서 풍요롭게 타오르는 상(象)." → "촛불이 여름 대지 위에서 풍요롭게 타오르는 모습입니다."
    //   ※ 따옴표(", ") 안에 들어 있는 비유 라벨(image 텍스트 등)은 건드리지 않도록 lookahead로 보호.
    s = s.replace(/는\s*상\s*\(\s*象\s*\)\s*\./g, '는 모습입니다.');
    s = s.replace(/하는\s*상\s*\(\s*象\s*\)\s*\./g, '하는 모습입니다.');
    s = s.replace(/된\s*상\s*\(\s*象\s*\)\s*\./g, '된 모습입니다.');
    s = s.replace(/인\s*상\s*\(\s*象\s*\)\s*\./g, '인 모습입니다.');
    // 남은 일반 패턴 — "○○ 상(象)." 끝맺음을 형상입니다로
    s = s.replace(/([가-힣A-Za-z])\s*상\s*\(\s*象\s*\)\s*\./g, '$1 형상입니다.');

    // ─── 한자(漢字) 괄호 → 한글 풀이 일관화 ───
    // 데이터에 박혀 있는 "○○(漢字)" 표기는 한자를 모르면 막막하므로,
    // 10대도 알 수 있게 한글 풀이로 통일합니다.
    //   예) "편재(偏財)와 정재가" → "편재(흐름이 큰 재물 기운)와 정재가"
    //   ※ 그 다음 단계의 풀이 규칙이 "정재(...)"도 같은 한글 풀이로 보충해 줘서
    //     "편재(...)와 정재(...)"의 비대칭이 사라집니다.
    s = s.replace(/편재\s*\(\s*偏財\s*\)/g, '편재(흐름이 큰 재물 기운)');
    s = s.replace(/정재\s*\(\s*正財\s*\)/g, '정재(꾸준히 쌓이는 재물 기운)');
    s = s.replace(/편관\s*\(\s*偏官\s*\)/g, '편관(나를 강하게 단련시키는 기운)');
    s = s.replace(/정관\s*\(\s*正官\s*\)/g, '정관(원칙·책임을 부여하는 기운)');
    s = s.replace(/식신\s*\(\s*食神\s*\)/g, '식신(즐거움을 만들어내는 표현 기운)');
    s = s.replace(/상관\s*\(\s*傷官\s*\)/g, '상관(말과 재능이 빛나는 기운)');
    s = s.replace(/편인\s*\(\s*偏印\s*\)/g, '편인(직관·창의가 깊어지는 기운)');
    s = s.replace(/정인\s*\(\s*正印\s*\)/g, '정인(나를 든든히 받쳐주는 기운)');
    s = s.replace(/비견\s*\(\s*比肩\s*\)/g, '비견(나와 같은 기운의 사람·동료)');
    s = s.replace(/겁재\s*\(\s*劫財\s*\)/g, '겁재(경쟁을 부르는 같은 기운)');
    s = s.replace(/식상\s*\(\s*食傷[^\)]*\)/g, '식상(표현·창작 기운)');
    s = s.replace(/관성\s*\(\s*官星[^\)]*\)/g, '관성(책임·권위 기운)');
    s = s.replace(/재성\s*\(\s*財星[^\)]*\)/g, '재성(재물·현실 감각)');
    s = s.replace(/인성\s*\(\s*印星[^\)]*\)/g, '인성(배움·수용의 기운)');
    s = s.replace(/비겁\s*\(\s*比劫[^\)]*\)/g, '비겁(자아·동료 기운)');
    s = s.replace(/칠살\s*\(\s*七殺\s*\)/g, '칠살(나를 단련시키는 강한 기운)');
    // 오행 한자 → 한글
    s = s.replace(/목\s*\(\s*木\s*\)/g, '목(나무)');
    s = s.replace(/화\s*\(\s*火\s*\)/g, '화(불)');
    s = s.replace(/토\s*\(\s*土\s*\)/g, '토(흙)');
    s = s.replace(/금\s*\(\s*金\s*\)/g, '금(쇠)');
    s = s.replace(/수\s*\(\s*水\s*\)/g, '수(물)');

    // ─── 전문 용어 쉬운 풀이 (일반 독자용) ───
    // ※ (?<![가-힣]) — 앞이 한글 음절일 때는 단어 내부 우연 일치이므로 풀이하지 않습니다.
    //   예) "달라지지만" 안의 "지지", "일주일" 안의 "일주", "신약품" 안의 "신약" 등을 보호.
    s = s.replace(/(?<![가-힣])기신(?!\s*[\(（])/g, '기신(나를 지치게 하는 기운)');
    s = s.replace(/(?<![가-힣])용신(?!\s*[\(（])/g, '용신(나를 돕는 핵심 기운)');
    s = s.replace(/(?<![가-힣])십성(?!\s*[\(（])/g, '십성(사주 속 나의 역할과 관계 방식)');
    s = s.replace(/(?<![가-힣])구신(?!\s*[\(（])/g, '구신(기신을 더 강하게 만드는 기운)');
    s = s.replace(/(?<![가-힣])일주(?![일\s]*[가-힣\(（])/g, '일주(태어난 날의 두 글자)');
    s = s.replace(/(?<![가-힣])대운(?!\s*[\(（수])/g, '대운(10년 단위로 바뀌는 운의 흐름)');
    s = s.replace(/(?<![가-힣])세운(?!\s*[\(（])/g, '세운(그해 한 해의 운)');
    s = s.replace(/(?<![가-힣])월운(?!\s*[\(（])/g, '월운(그달의 운)');
    s = s.replace(/(?<![가-힣])원국(?!\s*[\(（])/g, '원국(태어날 때 정해진 나의 사주 구조)');
    s = s.replace(/(?<![가-힣])일간(?!\s*[\(（])/g, '일간(사주에서 나를 나타내는 글자)');
    s = s.replace(/(?<![가-힣])일지(?!\s*[\(（])/g, '일지(태어난 날의 아래 글자, 배우자궁)');
    s = s.replace(/(?<![가-힣])신강(?!\s*[\(（])/g, '신강(타고난 에너지가 강한 편)');
    s = s.replace(/(?<![가-힣])신약(?!\s*[\(（])/g, '신약(타고난 에너지가 섬세한 편)');
    s = s.replace(/(?<![가-힣])격국(?!\s*[\(（])/g, '격국(사주의 큰 그림·구조)');
    s = s.replace(/(?<![가-힣])통근(?!\s*[\(（])/g, '통근(천간이 지지에 뿌리내린 상태)');
    s = s.replace(/(?<![가-힣])조후(?!\s*[\(（])/g, '조후(사주 속 온도와 습도 균형)');
    s = s.replace(/(?<![가-힣])공망(?!\s*[\(（])/g, '공망(채워도 채워지지 않는 빈자리)');
    s = s.replace(/(?<![가-힣])지장간(?!\s*[\(（])/g, '지장간(겉 글자 안에 숨은 또 다른 기운)');
    s = s.replace(/(?<![가-힣])천간(?!\s*[\(（])/g, '천간(사주의 위 네 글자, 겉으로 드러난 역할)');
    s = s.replace(/(?<![가-힣])지지(?![가-힣]|\s*[\(（])/g, '지지(사주의 아래 네 글자, 속에 자리 잡은 본성)');
    s = s.replace(/(?<![가-힣])편관(?!\s*[\(（])/g, '편관(나를 강하게 단련시키는 기운)');
    s = s.replace(/(?<![가-힣])정관(?!\s*[\(（])/g, '정관(원칙·책임을 부여하는 기운)');
    s = s.replace(/(?<![가-힣])편재(?!\s*[\(（])/g, '편재(흐름이 큰 재물 기운)');
    s = s.replace(/(?<![가-힣])정재(?!\s*[\(（])/g, '정재(꾸준히 쌓이는 재물 기운)');
    s = s.replace(/(?<![가-힣])식신(?!\s*[\(（])/g, '식신(즐거움을 만들어내는 표현 기운)');
    s = s.replace(/(?<![가-힣])상관(?!\s*[\(（])/g, '상관(말과 재능이 빛나는 기운)');
    s = s.replace(/(?<![가-힣])편인(?!\s*[\(（])/g, '편인(직관·창의가 깊어지는 기운)');
    s = s.replace(/(?<![가-힣])정인(?!\s*[\(（])/g, '정인(나를 든든히 받쳐주는 기운)');
    s = s.replace(/(?<![가-힣])비견(?!\s*[\(（])/g, '비견(나와 같은 기운의 사람·동료)');
    s = s.replace(/(?<![가-힣])겁재(?!\s*[\(（])/g, '겁재(경쟁을 부르는 같은 기운)');

    // ─── 어려운 표현 → 쉬운 말 ───
    s = s.replace(/레버리지/g, '빚을 써서 키우는 투자');
    s = s.replace(/포지션/g, '현재 위치·역할');
    s = s.replace(/리스크/g, '위험');
    s = s.replace(/고변동\s*자산/g, '가격이 크게 오르내리는 자산');
    s = s.replace(/손절/g, '손실을 막기 위한 정리');
    s = s.replace(/분할 매입/g, '나눠서 사기');
    s = s.replace(/배당/g, '배당(투자한 회사가 주는 수익)');

    // ─── 10대 친화 어휘 정리: 한자식 추상어 → 일상어 ───
    // ※ '천간/지지/십성/지장간/일주/대운/세운/월운/원국/일간/일지/조후/공망/통근'
    //   같은 명리학 기본 용어는 .cursorrules에 의해 보호되며 위쪽 풀이 단계에서
    //   괄호로 풀어 줍니다. 이 블록은 오직 '주변 일상 어휘'만 손봅니다.

    // 라벨로 굳어진 표현은 보호 (예: '압박·마감', '거래·기회: 편재' 같은 표 라벨)
    s = s.replace(/압박·마감/g, '\u0000PRESS_DEADLINE\u0000');

    // 사주식 어구가 부자연스럽게 끊긴 경우 자연어로
    s = s.replace(/환경이\s*나를\s*압박,/g, '환경이 나를 밀어붙이는 흐름,');

    // ── '~적' 형용사 묶음 — '인/이고/이면/이라/인지/인데/이나' 어미까지 한 번에 정리
    s = s.replace(/(?<![가-힣])장기적인\s*/g, '오래 두고 보면 좋은 ');
    s = s.replace(/(?<![가-힣])장기적\s/g, '오래 두고 봐도 좋은 ');
    s = s.replace(/(?<![가-힣])단기적인\s*/g, '당장의 ');
    s = s.replace(/(?<![가-힣])단기적\s/g, '당장 눈에 보이는 ');
    s = s.replace(/(?<![가-힣])중장기적인\s*/g, '꽤 오래 가는 ');
    s = s.replace(/(?<![가-힣])중장기\s/g, '꽤 오래 가는 ');
    s = s.replace(/(?<![가-힣])보수적인\s*/g, '조심스러운 ');
    s = s.replace(/(?<![가-힣])보수적\s/g, '조심스러운 ');
    s = s.replace(/(?<![가-힣])진취적인\s*/g, '앞으로 치고 나가는 ');
    s = s.replace(/(?<![가-힣])진취적\s/g, '앞으로 치고 나가는 ');

    // ── 합성 명사 (긴 형태 먼저)
    s = s.replace(/(?<![가-힣])깊은\s+통찰력/g, '깊은 안목');
    s = s.replace(/(?<![가-힣])통찰력/g, '꿰뚫어 보는 안목');
    s = s.replace(/(?<![가-힣])사사로운\s*/g, '개인적인 ');
    s = s.replace(/(?<![가-힣])허심탄회/g, '솔직');
    s = s.replace(/(?<![가-힣])명실상부/g, '이름값에 딱 맞');
    s = s.replace(/(?<![가-힣])불가피/g, '어쩔 수 없');
    s = s.replace(/(?<![가-힣])불가결/g, '꼭 필요');

    // ── 단독 명사·부사
    s = s.replace(/(?<![가-힣])국면/g, '시기');
    s = s.replace(/(?<![가-힣])깊은\s+통찰(?![력])/g, '깊이 꿰뚫어 보는 시선');
    s = s.replace(/(?<![가-힣])통찰(?![력])/g, '꿰뚫어 보는 시선');
    // 협업·협력은 (1) 동사형 먼저, (2) 명사를 수식하는 경우(공백+한글)는 '~하는'형으로,
    //   (3) 그 외(조사·문장부호·문장끝)는 명사형으로 정리합니다.
    s = s.replace(/(?<![가-힣])협업하/g, '함께 일하');
    s = s.replace(/(?<![가-힣])협업(?=\s+[가-힣])/g, '함께 일하는');
    s = s.replace(/(?<![가-힣])협업/g, '함께 일하는 일');
    s = s.replace(/(?<![가-힣])협력하/g, '서로 손발을 맞추');
    s = s.replace(/(?<![가-힣])협력(?=\s+[가-힣])/g, '함께 손잡는');
    s = s.replace(/(?<![가-힣])협력/g, '함께 손잡는 일');
    s = s.replace(/(?<![가-힣])압박/g, '부담');
    s = s.replace(/(?<![가-힣])이른바\s*/g, '흔히 말하는 ');
    s = s.replace(/(?<![가-힣])깊은\s*숙고\s*끝에/g, '한참 곰곰이 생각한 끝에');
    s = s.replace(/(?<![가-힣])숙고\s/g, '곰곰이 생각 ');
    // 권태/권태로운/권태로움 깨짐 방지 (긴 형태 먼저)
    s = s.replace(/(?<![가-힣])권태로운/g, '지루한');
    s = s.replace(/(?<![가-힣])권태로움/g, '지루함');
    s = s.replace(/(?<![가-힣])권태/g, '지루함');
    s = s.replace(/(?<![가-힣])응당/g, '당연히');
    s = s.replace(/(?<![가-힣])도리어/g, '오히려');
    s = s.replace(/(?<![가-힣])모름지기/g, '마땅히');
    s = s.replace(/(?<![가-힣])왕성(?=한|히|함)/g, '활발');
    s = s.replace(/(?<![가-힣])왕왕/g, '가끔');
    s = s.replace(/(?<![가-힣])작금/g, '요즘');
    s = s.replace(/(?<![가-힣])차후/g, '앞으로');
    s = s.replace(/(?<![가-힣])차제/g, '이참');
    s = s.replace(/(?<![가-힣])범상(?=하|치)/g, '평범');
    s = s.replace(/(?<![가-힣])희박(?=하|함|해)/g, '낮');
    s = s.replace(/(?<![가-힣])소위\s*/g, '흔히 말하는 ');
    s = s.replace(/(?<![가-힣])약진/g, '쑥쑥 성장');
    s = s.replace(/(?<![가-힣])답보/g, '제자리걸음');
    s = s.replace(/(?<![가-힣])견인(?![차])/g, '끌어 주는 힘');
    s = s.replace(/(?<![가-힣])대두(?=되|함)/g, '떠오름');
    s = s.replace(/(?<![가-힣])견지(?=하|함)/g, '지켜 가');
    s = s.replace(/(?<![가-힣])감속/g, '속도 줄이기');
    s = s.replace(/(?<![가-힣])도모(?=하|함)/g, '챙기');
    s = s.replace(/(?<![가-힣])강구(?=하|함)/g, '마련하');
    s = s.replace(/(?<![가-힣])단행(?=하|함)/g, '실행에 옮기');
    s = s.replace(/(?<![가-힣])만전/g, '빈틈없이');
    s = s.replace(/(?<![가-힣])만끽(?=하|함)/g, '마음껏 누리');
    s = s.replace(/(?<![가-힣])영위(?=하|함)/g, '꾸려 가');
    s = s.replace(/(?<![가-힣])차치(?=하|함)/g, '잠시 두');
    s = s.replace(/(?<![가-힣])천명(?=하|함)/g, '분명히 말하');
    s = s.replace(/(?<![가-힣])양해(?=를|해)/g, '이해를');
    s = s.replace(/(?<![가-힣])타진(?=하|함)/g, '살펴 보');
    s = s.replace(/(?<![가-힣])모색(?=하|함)/g, '찾아 보');
    s = s.replace(/(?<![가-힣])피력(?=하|함)/g, '드러내');
    s = s.replace(/(?<![가-힣])피습(?=하|당)/g, '공격받');
    s = s.replace(/(?<![가-힣])형국/g, '모양새');
    s = s.replace(/(?<![가-힣])판국/g, '판');
    s = s.replace(/(?<![가-힣])일익(?=을|이|을\s)/g, '한 부분');
    s = s.replace(/(?<![가-힣])일례/g, '한 가지 예');
    s = s.replace(/(?<![가-힣])일환/g, '한 부분');
    s = s.replace(/(?<![가-힣])파급/g, '퍼지는 힘');
    s = s.replace(/(?<![가-힣])관건/g, '가장 중요한 점');
    s = s.replace(/(?<![가-힣])관망/g, '지켜보기');
    s = s.replace(/(?<![가-힣])견책/g, '꾸중');
    s = s.replace(/(?<![가-힣])귀결/g, '결론');
    s = s.replace(/(?<![가-힣])필두(?=로)/g, '시작으로');

    // ── 자주 등장하는 한자어를 일상어로
    s = s.replace(/(?<![가-힣])유예하십시오/g, '미뤄 두세요');
    s = s.replace(/(?<![가-힣])유예\s*후/g, '미루고 난 뒤');
    s = s.replace(/(?<![가-힣])유예하/g, '미루');
    s = s.replace(/(?<![가-힣])유예/g, '미루기');
    // '서면 + 조사' 변환 (받침이 사라지므로 조사도 함께 바꿉니다)
    s = s.replace(/(?<![가-힣])서면으로/g, '문서로');
    s = s.replace(/(?<![가-힣])서면은/g, '문서는');
    s = s.replace(/(?<![가-힣])서면이/g, '문서가');
    s = s.replace(/(?<![가-힣])서면을/g, '문서를');
    s = s.replace(/(?<![가-힣])서면에서/g, '문서에서');
    s = s.replace(/(?<![가-힣])서면에/g, '문서에');
    s = s.replace(/(?<![가-힣])서면/g, '문서');
    s = s.replace(/(?<![가-힣])심층\s+(분석|해부|풀이|가이드|서사|이야기)/g, '깊이 보는 $1');
    s = s.replace(/(?<![가-힣])심층/g, '깊이 보는');
    s = s.replace(/(?<![가-힣])철회/g, '취소');
    s = s.replace(/(?<![가-힣])삼가/g, '피하');

    // 라벨 복원
    s = s.replace(/\u0000PRESS_DEADLINE\u0000/g, '압박·마감');

    // ─── 추상·은유 표현 → 구체적 한국어 ───
    //   사용자 피드백: "확인을 거듭하다 보면 상대만 굳어 보이실 수 있어요" 같은 문장이
    //   무슨 말인지 한 번에 안 들어옵니다. 비슷한 모호 표현을 일괄로 풀어 씁니다.
    s = s.replace(/확인을\s*거듭하다\s*보면\s*상대만\s*굳어\s*보이실?\s*수\s*있(어요|습니다)/g, '여러 번 다시 확인하시다 보면, 그 사이에 상대방이 답답해져 마음을 먼저 닫아 버리실 수 있어요');
    s = s.replace(/확인을\s*거듭하다\s*보면\s*상대만\s*굳어\s*보이기도\s*합니다/g, '여러 번 다시 확인하다 보면, 그 사이에 상대방이 답답해져 먼저 마음을 닫아 버리기도 합니다');
    s = s.replace(/머릿속\s*정리가\s*길어지면\s*행동이\s*늦어지고/g, '머릿속에서 생각만 길어지면 정작 행동으로 옮기는 시점이 늦어지고');
    s = s.replace(/머릿속\s*정리가\s*길어지면\s*몸이\s*움직이는\s*시점이\s*늦어지고/g, '머릿속에서 생각만 길어지면 정작 행동으로 옮기는 시점이 늦어지고');
    s = s.replace(/(?<![가-힣])에너지\s*공명/g, '결이 비슷한 사람끼리 자연스럽게 끌어당기는 힘');
    s = s.replace(/(?<![가-힣])약속의\s*리듬을/g, '약속이 지켜지는 속도를');
    s = s.replace(/(?<![가-힣])약속의\s*리듬이/g, '약속이 지켜지는 속도가');
    s = s.replace(/(?<![가-힣])약속의\s*리듬은/g, '약속이 지켜지는 속도는');
    s = s.replace(/(?<![가-힣])약속의\s*리듬에/g, '약속이 지켜지는 속도에');
    s = s.replace(/(?<![가-힣])약속의\s*리듬/g, '약속이 지켜지는 속도');
    s = s.replace(/(?<![가-힣])손에\s*쥐는\s*결과(?![가-힣])/g, '직접 만들어 낸 결과물');
    s = s.replace(/(?<![가-힣])손에\s*쥐는\s*일(?![가-힣])/g, '직접 만들어 내는 일');
    s = s.replace(/(?<![가-힣])손에\s*잡히는\s*돈의\s*흐름(?![가-힣])/g, '바로바로 들어오고 나가는 돈의 움직임');
    s = s.replace(/(?<![가-힣])판이\s*선명해집니다/g, '상황이 또렷이 보입니다');
    s = s.replace(/(?<![가-힣])판이\s*선명해/g, '상황이 또렷이 보여');
    s = s.replace(/(?<![가-힣])시동이\s*잘\s*안\s*걸리는\s*거예요/g, '쉽게 시작이 잘 안 되는 것뿐이에요');
    s = s.replace(/(?<![가-힣])시동이\s*잘\s*안\s*걸리/g, '쉽게 시작이 잘 안 되');
    s = s.replace(/(?<![가-힣])통로가\s*좁다/g, '그쪽으로 표현이 잘 안 나오는 것');
    s = s.replace(/(?<![가-힣])통로가\s*좁/g, '그쪽으로 표현이 잘 안 나오는 길이 좁');
    s = s.replace(/(?<![가-힣])평가가\s*엇갈리/g, '평가가 사람마다 다르게 나오');
    s = s.replace(/같은\s*결의\s*사람/g, '비슷한 성향의 사람');
    s = s.replace(/다른\s*결의\s*사람/g, '다른 성향의 사람');
    s = s.replace(/(?<=[는은이가을를도])\s*결의\s*사람(?![가-힣])/g, ' 성향의 사람');
    s = s.replace(/한\s*박자\s*늦추/g, '한 번 더 천천히 가시');
    s = s.replace(/한\s*박자\s*쉬고/g, '잠깐 멈추고');
    s = s.replace(/한\s*박자\s*늦/g, '조금 더 천천히 가');
    s = s.replace(/한\s*박자\s*만/g, '잠깐만');
    s = s.replace(/연료로\s*몸을\s*태우지\s*마세요/g, '의지력만으로 버티지 마세요');
    s = s.replace(/짧은\s*위로지만/g, '잠깐은 위로가 되지만');
    s = s.replace(/위가\s*살아납니다/g, '소화가 편해집니다');
    s = s.replace(/폐가\s*“감정을\s*한\s*번\s*비워달라”라고\s*말하는\s*중입니다/g, '폐가 “감정을 한 번 비워 달라”고 신호를 보내는 중이에요');
    s = s.replace(/신장이\s*“충전이\s*필요하다”라고\s*말하는\s*중입니다/g, '신장이 “쉬어 가야 할 때”라고 신호를 보내는 중이에요');
    s = s.replace(/심장\s*쪽이\s*한\s*박자\s*쉬어달라는\s*신호/g, '심장이 한 번 쉬어 가자고 보내는 신호');
    s = s.replace(/비위가\s*“결정\s*좀\s*내려달라”라고\s*말하는\s*중입니다/g, '비위(소화기)가 “결정을 미루지 말아 달라”고 신호를 보내는 중이에요');
    // 추가 모호 표현
    s = s.replace(/(?<![가-힣])통제로\s*읽힐\s*수\s*있는\s*각도(?![가-힣])/g, '상대에게는 통제받는 느낌으로 다가올 수 있는 인상');
    s = s.replace(/(?<![가-힣])거리와\s*자율이\s*숨이\s*트입니다/g, '각자의 자리와 자유가 보장될 때 마음이 편해지세요');
    s = s.replace(/(?<![가-힣])나와\s*에너지가\s*보완되는\s*사람/g, '내가 부족한 자리를 자연스럽게 채워 주는 사람');
    s = s.replace(/(?<![가-힣])정반대로\s*끌리는\s*타입/g, '나와 성향이 완전히 반대인 사람');
    s = s.replace(/(?<![가-힣])체감을\s*바꿉니다/g, '일상에서 느끼는 무게가 달라집니다');
    s = s.replace(/(?<![가-힣])체감을\s*바꾸/g, '일상의 무게를 바꾸');
    s = s.replace(/(?<![가-힣])반복되기\s*쉬운\s*흐름/g, '비슷한 일이 자꾸 반복되기 쉬운 흐름');
    s = s.replace(/같은\s*결의\s*흐름이\s*이어집니다/g, '비슷한 흐름이 그대로 이어집니다');
    s = s.replace(/같은\s*결의\s*흐름/g, '비슷한 흐름');
    s = s.replace(/(?<![가-힣])연애\s*각도(?![가-힣])/g, '연애에서 끌리는 사람의 모습');
    s = s.replace(/반복되는\s*연애\s*각도/g, '반복해서 끌리는 사람의 모습');
    s = s.replace(/(?<![가-힣])접점이\s*열리/g, '인연의 시작이 열리');
    s = s.replace(/(?<![가-힣])관계의\s*속도가\s*붙/g, '관계가 빠르게 진전되');
    s = s.replace(/(?<![가-힣])일지\s*합이\s*맞으면/g, '일지(태어난 날의 아래 글자)와 어울리는 글자가 들어오면');
    s = s.replace(/(?<![가-힣])일지의\s*합이\s*맞으면/g, '일지와 어울리는 글자가 들어오면');
    s = s.replace(/(?<![가-힣])공식화하기\s*쉽습니다/g, '정식으로 매듭짓기가 쉬워집니다');
    s = s.replace(/(?<![가-힣])공식화하/g, '정식으로 매듭짓');
    s = s.replace(/(?<![가-힣])억지보다\s*흐름을\s*타십시오/g, '억지로 밀어붙이지 마시고 흐름이 트인 시기에 맞추십시오');
    s = s.replace(/“선언되는\s*일”과\s*“손에\s*쥐는\s*일”의\s*간격이\s*벌어져\s*보이니/g, '“보고서·발표로 인정받는 일”과 “실제로 손에 잡히는 결과가 들어오는 일” 사이의 간격이 벌어져 보이니');
    s = s.replace(/(?<![가-힣])완성시켜\s*주는\s*사람/g, '내가 부족한 자리를 채워 주는 사람');
    s = s.replace(/(?<![가-힣])성장형\s*독서/g, '나를 키워 주는 독서');
    s = s.replace(/(?<![가-힣])성장형\s/g, '나를 키워 주는 ');
    s = s.replace(/(?<![가-힣])접점(?=을|이|이라|을\s)/g, '인연의 시작점');
    s = s.replace(/(?<![가-힣])네트워킹/g, '인맥 만들기');
    s = s.replace(/(?<![가-힣])커뮤니티(?![가-힣])/g, '소모임');
    s = s.replace(/(?<![가-힣])공명(?![가-힣])/g, '울림');
    // '체감' — 한자어라 10대 독자에겐 익숙하지 않아 풀어 줍니다.
    //  단, '체감지수'·'체감 점수'·'체감기온' 같은 합성 라벨은 그대로 둡니다.
    s = s.replace(/(?<![가-힣])체감을\s*바꿉니다/g, '일상에서 느끼는 무게를 바꿉니다');
    s = s.replace(/(?<![가-힣])체감을\s*바꾸/g, '일상의 무게를 바꾸');
    s = s.replace(/(?<![가-힣])체감이\s*달라집니다/g, '일상에서 느끼는 변화가 달라집니다');
    s = s.replace(/(?<![가-힣])체감이\s*큽니다/g, '일상에서 느끼는 변화가 큽니다');
    s = s.replace(/(?<![가-힣])체감이\s*어긋나/g, '실제로 받는 보상이 어긋나');
    s = s.replace(/(?<![가-힣])체감이\s*납니다/g, '일상에서 느끼는 변화가 있습니다');
    s = s.replace(/(?<![가-힣])체감\s*속도/g, '느껴지는 속도');
    s = s.replace(/(?<![가-힣])체감\s*방식(?![가-힣])/g, '느껴지는 방식');
    s = s.replace(/(?<![가-힣])체감\s*점수를\s*올릴\s*수\s*있/g, '실제 점수를 올릴 수 있');
    s = s.replace(/(?<![가-힣])체감되는\s*변화/g, '실생활에서 느껴지는 변화');
    s = s.replace(/(?<![가-힣])체감되/g, '실생활에서 느껴지');
    // 자주 박힌 부자연 조합 — "결로 흐르다" / "결의 결과가" 등
    s = s.replace(/(?<![가-힣])결로\s*흐릅니다/g, '흐름으로 갑니다');
    s = s.replace(/(?<![가-힣])결로\s*흐르(?![가-힣])/g, '흐름으로 가');
    s = s.replace(/(?<![가-힣])결로\s*흐르는지/g, '흐름으로 가는지');
    s = s.replace(/(?<![가-힣])결의\s*결과가/g, '그 흐름의 결실이');
    s = s.replace(/(?<![가-힣])방어가\s*선명/g, '방어가 또렷');
    s = s.replace(/(?<![가-힣])숨이\s*트이/g, '마음이 편해지');
    // 자주 사용되는 어색 조합 — "한 발 떨어져"는 자연어라 OK, 그대로 둠.

    // ※ 과거에 있던 "캐주얼 → 격식" 어미 일괄 변환 블록은 제거했습니다.
    //   ~네요·~군요·~이시군요·~것 같아요·~좋아요·~돼요 등 따뜻한 구어체 어미를
    //   ~입니다·~합니다로 강제 변환하던 로직이 .cursorrules의 톤 가이드와 충돌했고,
    //   본문 어디서나 동일하게 톤이 평탄해지는 부작용이 있었습니다. 이제는 템플릿이
    //   고른 어미를 그대로 살리고, 격식이 필요한 곳에서는 템플릿 단계에서 결정합니다.
    return s;
}

function voicePolishHtml(data, html) {
    return String(html == null ? '' : html);
}

/** 만세력·대운 카드 등 HTML 삽입용 — 【】·당신·IT슬랭 정리 + strong */
function voicePolishReportHtml(data, text) {
    return boldStarsToStrong(voicePolishParagraph(data, text));
}

/** 궁합 패널 — a/b 이름 각각 polish */
function polishCompatLine(ctx, who, text) {
    var nm = compatNm(ctx, who);
    return voicePolishParagraph({ name: nm }, text);
}

/** 세운 본문 등에 남은 고정 변명 문구(옛 입력·캐시 잔재) 제거 */
function stripSeYunMacroLeaks(html) {
    var s = String(html == null ? '' : html);
    s = s.replace(/이는\s*성격\s*탓이\s*아니라,\s*그\s*해의\s*기운이\s*원국과\s*맞물린\s*결과입니다\.?/gi, '');
    s = s.replace(/그\s*해의\s*기운이\s*원국과\s*맞물린\s*결과입니다\.?/gi, '');
    s = s.replace(/성격\s*탓이\s*아니라,\s*그\s*해의\s*기운이\s*원국과\s*맞물린/gi, '');
    return s;
}
/** 반복 조언(캘린더·주간 한 장 등) 완곡 제거 — HTML 일부만 대상 */
/** 세운·타임라인 본문 좀비 매크로(겉으로 드러나는 일… 등) */
function stripSeyunZombiePhrases(html) {
    var s = String(html == null ? '' : html);
    s = s.replace(/그\s*해는\s*겉으로\s*드러나는\s*일보다[\s\S]*?(\.(?=\s|<|$)|$)/gi, '');
    s = s.replace(/그\s*해에는\s*겉으로\s*드러나는\s*일보다[\s\S]*?(\.(?=\s|<|$)|$)/gi, '');
    s = s.replace(/겉으로\s*드러나는\s*일보다[\s\S]{0,120}?말할\s*수[\s\S]*?(\.(?=\s|<|$)|$)/gi, '');
    s = s.replace(/성격\s*탓이\s*아니라[\s\S]{0,160}?(\.(?=\s|<|$)|$)/gi, '');
    return s;
}
/** LLM·프롬프트 잔여 브래킷 태그 — UI·PDF에 노출 금지 */
function stripPromptBracketTags(html) {
    var s = String(html == null ? '' : html);
    s = s.replace(/\[(?:공감|팩트|실행)(?:\s*[·•\/]\s*[^\]]+)?\]/gi, '');
    s = s.replace(/\[1\s*공감[^\]]*\]/gi, '');
    s = s.replace(/\[2\s*(?:명리|팩트)[^\]]*\]/gi, '');
    s = s.replace(/\[3\s*(?:단호한\s*)?실행[^\]]*\]/gi, '');
    return s;
}
function stripTimelineMacroLeaks(html) {
    var s = stripPromptBracketTags(stripSeYunMacroLeaks(html));
    s = s.replace(/캘린더에\s*표시해\s*두십시오/gi, '');
    s = s.replace(/주간\s*한\s*장에만\s*적어\s*두면/gi, '일정 겹침을 줄이려면');
    s = s.replace(/통장·캘린더\s*숫자/gi, '통장·지출 숫자');
    s = s.replace(/캘린더에\s*고정/gi, '일정표에 고정');
    s = s.replace(/캘린더에\s*(?:먼저\s*)?(?:박|적|찍)/gi, '메모에 ');
    s = s.replace(/고정비·회수·수면\s*슬롯을[^\n<]*?(\.|$)/gi, '');
    s = s.replace(/현금이\s*먼저\s*나가는\s*조건[^\n<]*?(\.|$)/gi, '');
    s = s.replace(/먼저\s*통장에서\s*빠져나가는\s*조건[^\n<]*?(\.|$)/gi, '');
    s = s.replace(/고정비·미수·회수만\s*주간\s*점검[^\n<]*?(\.|$)/gi, '');
    s = s.replace(/생활\s*리듬과\s*지출·회수의\s*균형을[\s\S]*?(\.(?=\s|<|$)|$)/gi, '');
    s = s.replace(/선납·연대·지분처럼[\s\S]*?(\.(?=\s|<|$)|$)/gi, '');
    s = stripSeyunZombiePhrases(s);
    return s;
}
function stripReportMacroLeaks(html) {
    return stripTimelineMacroLeaks(html);
}
/** 월간지·천간지지 → 달의 대표 오행(지지 우선) */
function monthDominantOh(mGanHj, mJiHj) {
    var STEM_OH = { '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire', '戊': 'earth', '己': 'earth', '庚': 'metal', '辛': 'metal', '壬': 'water', '癸': 'water' };
    var BRANCH_OH = { '子': 'water', '丑': 'earth', '寅': 'wood', '卯': 'wood', '辰': 'earth', '巳': 'fire', '午': 'fire', '未': 'earth', '申': 'metal', '酉': 'metal', '戌': 'earth', '亥': 'water' };
    return BRANCH_OH[mJiHj] || STEM_OH[mGanHj] || 'earth';
}
var WOLUN_NEUTRAL_BY_OH = {
    wood: [
        '이번 달은 새 일을 벌이기보다 **이미 시작한 일의 마무리**에 무게를 두면 실속이 남습니다.',
        '목(木) 기운 달에는 **일정을 두 줄로 줄이고**, 남는 시간에만 새 제안을 검토하십시오.',
        '확장보다 **연락·미팅 정리**가 먼저입니다. 끊을 약속부터 적어 보십시오.',
        '아이디어가 많아지는 달입니다. **메모는 하되 실행은 하나**만 달력에 넣으십시오.'
    ],
    fire: [
        '화(火) 기운 달에는 **대외 일정**이 늘기 쉽습니다. 밤 일정은 주 2회 상한으로 두십시오.',
        '인정받고 싶은 마음이 앞설 수 있습니다. **중요한 말은 아침에**, 감정적인 답장은 다음 날로 미루십시오.',
        '노출이 늘면 지출도 따라옵니다. **이번 달 외식·모임비 상한**을 숫자로 먼저 정하십시오.',
        '열이 오를 때 **운동·수면 리듬**을 지키는 것이 돈보다 먼저입니다.'
    ],
    earth: [
        '토(土) 기운 달에는 **고정비·구독·할부** 목록을 한 번만 펼쳐 보십시오. 끊을 항목에만 체크하십시오.',
        '안정을 쌓는 달입니다. **통장 잔고와 카드값**을 월초·월말 두 번만 맞추십시오.',
        '약속을 많이 잡기보다 **집·사무실 정리 한 코너**를 끝내는 쪽이 체감이 큽니다.',
        '서두르지 않아도 됩니다. **이미 맡은 계약의 조건**만 다시 읽어도 손실이 줄어듭니다.'
    ],
    metal: [
        '금(金) 기운 달에는 **서류·견적·승인**이 먼저 옵니다. 구두 합의는 같은 날 메일로만 고정하십시오.',
        '기준이 높아지기 쉬운 달입니다. **완벽보다 80% 제출**로 마감을 지키십시오.',
        '잘라내기가 이깁니다. **이번 달에 끊을 일 한 가지**를 적고 실행하십시오.',
        '결정을 미루면 기회만 지나갑니다. **오전 한 시간**만 서명·회신에 쓰십시오.'
    ],
    water: [
        '수(水) 기운 달에는 **정보가 많아 혼선**이 옵니다. 읽을 자료는 하루 45분으로 끊으십시오.',
        '생각이 길어지기 쉽습니다. **다음 행동 한 줄**을 적은 뒤에만 자료를 더 보십시오.',
        '감정이 몸으로 내려오기 쉽습니다. **산책·수면**을 먼저 맞추고 큰 결정은 주말 이후로 미루십시오.',
        '미수·회수·답장 밀림을 **월요일 오전 한 블록**으로만 처리하십시오.'
    ]
};
var FORTUNE_ACTION_CAUTIOUS_BY_OH = {
    wood: [
        '이번 달은 **새 동업·선납 조건**이 붙은 제안을 서명 목록에서 먼저 빼십시오.',
        '목 기운 달에는 **동시에 여는 일**이 체력을 깎습니다. 손에 쥔 프로젝트는 세 개 이하로 두십시오.',
        '확장 제안이 들어와도 **이번 달은 검토만** 하고 실행은 다음 달 첫 주로 미루십시오.'
    ],
    fire: [
        '감정이 올라온 날 **큰 지출·보증·야간 송금**은 금지하십시오. 영업일 점심 이전에만 처리하십시오.',
        '화 기운 달에는 **충동 구매·과한 모임비**가 새어 나가기 쉽습니다. 이번 주 외식 횟수를 먼저 정하십시오.',
        '대외 약속이 겹치면 돈도 새어 나갑니다. **주 2회 상한**으로 잡고 나머지는 다음 주로 넘기십시오.'
    ],
    earth: [
        '**선납·연대·지분 약속**이 붙은 계약은 이번 달 서명하지 마십시오. 조건은 영업일 이틀 뒤에만 검토하십시오.',
        '토 기운 달에는 **구독·자동이체**를 한 번만 점검하십시오. 그날은 새 결제 수단을 열지 마십시오.',
        '안정만 추구하다 기회를 놓치지 않으려면, **검토할 제안은 메모만** 하고 답은 이틀 뒤에 하십시오.'
    ],
    metal: [
        '**보증·레버리지·야간 송금**은 이번 달 전부 금지하고, 꼭 필요한 지출은 영업일 점심 이전에만 하십시오.',
        '금 기운 달에는 **조항을 읽지 않은 서명**이 손해로 이어지기 쉽습니다. 해지·한도 조항부터 확인하십시오.',
        '고변동 투자 **충동 매수**는 금지 — **지수형 정기 적립**만 허용하십시오.'
    ],
    water: [
        '말로만 합의된 **돈·투자·동업**은 서류 없이 진행하지 마십시오. 카톡·메일을 PDF로만 모으십시오.',
        '수 기운 달에는 **불안으로 지갑이 열리기** 쉽습니다. “이만큼만” 숫자를 적고 그 위로는 움직이지 마십시오.',
        '정보가 많을수록 손이 빨라집니다. **새 지출 앱·자동이체**는 이번 달 열지 마십시오.'
    ]
};
/** 대운·세운 카드용 애정 한 줄 — 점수·간지 시드로 로테이션 */
function pickLoveAdviceByScore(sc, seedKey) {
    var hi = [
        '취미·직무가 맞는 **소규모 모임**에 월 한두 번만 나가 보십시오. 첫 만남에서 돈·투자 이야기가 나오면 그날은 관계만으로 끊으십시오.',
        '지인 소개나 독서·운동 모임처럼 **대화가 자연스럽게 이어지는 자리**에만 시간을 쓰십시오. 상대의 일과 가치관을 묻는 질문 두 가지를 미리 적어 가십시오.',
        '만남이 잦아지는 시기입니다. **주말 오후 한 슬롯**만 연애용으로 비우고, 나머지 약속은 일·휴식으로 채우십시오.'
    ];
    var mid = [
        '안정 국면입니다. **영상통화 한 번**으로 분위기를 확인한 뒤, 편한 카페에서 천천히 만나 보십시오.',
        '연락이 잦을수록 오해가 쌓입니다. **대화 시간을 주 2회**로 고정하고, 그 밖의 시간에는 답장을 짧게 유지하십시오.',
        '관계를 지키려면 속도보다 **약속 이행**이 먼저입니다. 약속한 시간·장소를 바꿀 때는 하루 전에 말로 확인하십시오.'
    ];
    var low = [
        '오해가 쌓이기 쉬운 때입니다. **감정이 올라온 날**에는 헤어짐·동거·결혼 얘기를 하지 마십시오.',
        '단체 대화방·전 연인·지인에게 **돈·투자 이야기**를 하지 마십시오. “지금은 답 못 준다” 한 문장만 반복하십시오.',
        '말이 통하지 않았다고 자책하지 마십시오. **중요한 말은 다음 날 아침**에 짧은 문자로 정리하십시오.'
    ];
    var pool = sc >= 2 ? hi : sc >= 0 ? mid : low;
    return pool[Math.abs(hashSeed(String(seedKey || 'love'))) % pool.length];
}
/** 십성 코드 → 고객 면 산업/일 방식(한글 명칭 비노출, **볼드** 유지) */
function sipToIndustryWorkStyle(sip) {
    var m = {
        '비견': '**동료·경쟁이 겹치는 제품·세일즈**',
        '겁재': '**선납·동업·승부가 붙는 영업·투자 현장**',
        '식신': '**콘텐츠·디자인·기획**처럼 아이디어가 바로 산출물로 이어지는 일',
        '상관': '**법무·감사·CS·브랜드 방어**처럼 말과 기준이 곧 평가로 찍히는 일',
        '편재': '**외주·사업개발·거래·부업**처럼 통로가 여럿 열리는 일',
        '정재': '**급여·정산·재무·운영**처럼 숫자·루틴이 중심인 일',
        '편관': '**마감·현장·위기대응**처럼 압박이 곧 성과표로 붙는 일',
        '정관': '**조직·직책·평가**가 공개적으로 매겨지는 대기업·공공형 일',
        '편인': '**연구·자격·이직 준비**처럼 겉에 잘 안 보이는 몫',
        '정인': '**계약·정책·컴플라이언스**가 앞서는 일'
    };
    return m[sip] || '**본인의 손끝·말·숫자가 곧 성과로 연결되는 일**';
}
/** 리포트 서술용 — 직군 나열 대신 ‘어떤 하루인지’ 생활 언어로 (대운 재물 흐름 등) */
function sipToEverydayWorkRhythm(sip) {
    var m = {
        '비견': '동료와 겹치는 일·실력으로 순위가 갈리는 현장',
        '겁재': '돈이 먼저 나가거나 승부가 붙는 영업·동업 쪽',
        '식신': '기획·글·영상·코드처럼 손으로 만든 결과가 곧 평가로 붙는 일',
        '상관': '기준·클레임·말싸움이 잦아 말 한마디가 곧바로 평가로 남는 일',
        '편재': '외주·부업·거래처가 늘고 입금·미수 문자가 잦아지는 일',
        '정재': '월급·정산·장부·고정비처럼 숫자 맞추는 일이 중심인 일',
        '편관': '마감·야근·현장 책임처럼 압박이 곧 성과표로 붙는 일',
        '정관': '직급·평가·대외 자리처럼 조직 안에서 이름이 박히는 일',
        '편인': '공부·자격·이직 준비처럼 겉에 잘 안 보이는 준비 쪽',
        '정인': '계약·규정·승인처럼 서류와 절차가 앞서는 일'
    };
    return m[sip] || '내가 직접 결과를 내고 그게 곧 평가로 이어지는 일';
}
/** 만세력 표·운세 카드 배지 — 정통 십성 한글명(비견·식신 등). 예전 축약 라벨(동료·경쟁 등)도 여기서 십성으로 복원 */
function sipToManseBadge(sip, isIlwon) {
    if (isIlwon || sip === '일원') return '일원';
    if (!sip || sip === '-') return '-';
    var legacy = {
        '동료·경쟁': '비견', '지출·승부': '겁재', '창작·산출': '식신', '기준·방어': '상관',
        '거래·기회': '편재', '정산·루틴': '정재', '압박·마감': '편관', '조직·평가': '정관',
        '학습·준비': '편인', '문서·자격': '정인', '실행': '식신'
    };
    if (legacy[sip]) return legacy[sip];
    return sip;
}
/** 세운 챕터 제목 — 핵심 행동 한 줄 */
function formatSeYunChapterH3(partNo, yr, sc, evLabel) {
    var isXing = (evLabel === '흥(興)');
    var isZhuyi = (evLabel && (evLabel.indexOf('주의') >= 0 || evLabel === '주의가 필요한 해'));
    var core = isXing && sc >= 2 ? '선택·증빙·단가 조항을 먼저 고정'
        : isXing ? '확장은 한 축만, 검증은 길게'
        : isZhuyi ? '연대·보증·감정 합의는 유예'
        : sc >= 0 ? '반복 지출·미수·회수만 가볍게 점검'
        : '현금 버퍼·서면 범위를 최우선';
    return yr + '년 세운 — ' + core;
}
function formatNextYearsChapterH3(y1, pack1, y2, pack2) {
    var z1 = pack1 && (pack1.ev2.l.indexOf('주의') >= 0);
    var z2 = pack2 && (pack2.ev2.l.indexOf('주의') >= 0);
    var core = (z1 && z2) ? '두 해 모두 방어·증빙 우선'
        : (z1 || z2) ? '주의 해에는 계약·지출을 분리'
        : '앞선 두 해는 한 번에 한 축만 확장';
    return y1 + '·' + y2 + '년 — ' + core;
}
/** 세운 연도 카드 상단 — 핵심 결론 1줄(제목·내용 정합) */
function formatSeYunCardOneLineConclusion(evLabel, sc) {
    var s = Number(sc) || 0;
    var isXing = (evLabel === '흥(興)');
    var isZhuyi = (evLabel && (evLabel.indexOf('주의') >= 0 || evLabel === '주의가 필요한 해'));
    if (isXing && s >= 2) return '선택·증빙·단가 조항을 먼저 고정한 뒤 확장하십시오.';
    if (isXing) return '확장은 한 축만, 검증은 길게 가져가십시오.';
    if (isZhuyi) return '연대·보증·감정 합의는 유예하고 방어부터 쌓으십시오.';
    if (s >= 0) return '반복 지출·미수금·회수 일정을 한 번씩만 점검해도 실속이 남습니다.';
    return '현금 버퍼·서면 범위를 최우선으로 두십시오.';
}
/** 월운 카드 — 핵심 결론 1줄(점수 + 월간 오행으로 로테이션) */
function formatWolunCardOneLineConclusion(score, mGanHj, mJiHj, monthNo) {
    var s = Number(score) || 0;
    var oh = monthDominantOh(mGanHj, mJiHj);
    var seed = (mGanHj || '') + (mJiHj || '') + '|' + String(monthNo || 0) + '|' + oh;
    if (s >= 3) return '대외·계약·런칭에 속도를 올려도 되는 달입니다. 단, 증빙·한도는 먼저 고정하십시오.';
    if (s >= 1) return '검증된 축만 밀고, 새로운 확장은 한 갈래로만 가져가십시오.';
    if (s >= 0) {
        var pool = WOLUN_NEUTRAL_BY_OH[oh] || WOLUN_NEUTRAL_BY_OH.earth;
        return pool[Math.abs(hashSeed(seed + '|n')) % pool.length];
    }
    if (s >= -2) return '빌린 돈으로 버는 투자·보증·감정으로 내리는 큰 결정은 줄이고, 통장·빚부터 정리하는 쪽에 무게를 두십시오.';
    return '손실 한도 안에서만 움직이고, 신규 확장은 즉시 멈추십시오.';
}
/** 제1부 서사 — 현실 심리/행동 패턴(Deep Hook). 의학 명칭 비사용. */
function chartHasGongmangPillar(data) {
    var ds = data.dayStem;
    var db = data.dayBranch;
    if (!ds || !db || typeof getGongmang !== 'function') return false;
    var gmK = getGongmang(ds + db);
    if (!gmK || gmK.length < 2) return false;
    var KR2HJ = { '자': '子', '축': '丑', '인': '寅', '묘': '卯', '진': '辰', '사': '巳', '오': '午', '미': '未', '신': '申', '유': '酉', '술': '戌', '해': '亥' };
    var g1 = KR2HJ[gmK[0]];
    var g2 = KR2HJ[gmK[1]];
    if (!g1 || !g2) return false;
    var pillars = data.pillars || [];
    for (var i = 0; i < pillars.length; i++) {
        var br = pillars[i] && pillars[i].h && pillars[i].h[1];
        if (br === g1 || br === g2) return true;
    }
    return false;
}
function chartHasGwimunPillar(data) {
    var db = data.dayBranch;
    if (!db) return false;
    var map = { '子': '酉', '丑': '午', '寅': '未', '卯': '申', '辰': '亥', '巳': '戌', '午': '丑', '未': '寅', '申': '卯', '酉': '子', '戌': '巳', '亥': '辰' };
    var need = map[db];
    if (!need) return false;
    var pillars = data.pillars || [];
    for (var j = 0; j < pillars.length; j++) {
        var br = pillars[j] && pillars[j].h && pillars[j].h[1];
        if (br === need) return true;
    }
    return false;
}
function johoMergeRiskFromData(data) {
    var j = data.johu || '';
    if (!j) return false;
    return /(없으면|절실히\s*필요|필수\s*조후|마릅니다|증발|초조하고)/.test(j);
}
/** 공망 — 원리 설명 없이, 걸린 자리별 결과·행동만 */
function buildGongmangDeepHookCopy(data) {
    var name = (data && data.name) || '당신';
    var gm = (data && data.gongmang) || [];
    var pillars = (data && data.pillars) || [];
    if (!gm.length) return '';
    var hit = [];
    for (var i = 0; i < pillars.length; i++) {
        var p = pillars[i];
        if (!p || !p.h) continue;
        var br = typeof p.h === 'string' ? p.h[1] : p.h[1];
        if (br && gm.indexOf(br) !== -1) hit.push(p);
    }
    if (!hit.length) return '';
    var tagByN = {'년주': '년지(가문·출발)', '월주': '월지(부모·직업)', '일주': '일지(배우자·자아)', '시주': '시지(자녀·말년)'};
    var order = {'년주': 0, '월주': 1, '일주': 2, '시주': 3};
    hit.sort(function (a, b) { return (order[a.n] || 9) - (order[b.n] || 9); });
    var pillarTags = hit.map(function (p) { return tagByN[p.n] || p.n; }).join('·');
    var resultByPillar = {
        '년주': '**년지** — 인정·지지를 끌어와도 금방 허전해지고, 억지로 채울수록 형식만 남기 쉽습니다.',
        '월주': '**월지** — 노력 대비 보상 체감이 어긋나고, 더 메우려 할수록 비어 보이는 날이 반복됩니다.',
        '일주': '**일지** — 관계·약속을 늘려도 속이 차지 않는 감각이 길어지기 쉽습니다. 간격을 두는 편이 낫습니다.',
        '시주': '**시지** — 자녀·말년·성과가 겉과 속이 다르게 읽히고, 끝맺음이 애매하게 남을 수 있습니다.'
    };
    var lines = [];
    for (var j = 0; j < hit.length; j++) {
        var key = hit[j].n || '';
        if (resultByPillar[key]) lines.push(resultByPillar[key]);
    }
    if (!lines.length) return '';
    return nmDnimEunNeun(name) + ' **' + pillarTags + '**에서 공망이 읽혀요. '
        + lines.join(' ')
        + ' **이번 달은 한 축만** 비워 두고, 인맥·일정·지출로 구멍을 억지로 메우지 마십시오. 대운·세운이 이 기운을 강하게 밟을 때는 중요한 결정을 서두르지 않는 편이 낫습니다.';
}
function computeDeepHookSignals(data) {
    var sip = data.sipseong || {};
    var ss = (Number(sip['식신']) || 0) + (Number(sip['상관']) || 0);
    var inn = (Number(sip['정인']) || 0) + (Number(sip['편인']) || 0);
    var inseokWeak = inn <= 1;
    var sikExcess = ss >= 3;
    var gongmang = chartHasGongmangPillar(data);
    var triggerFocusScatter = (ss >= 3) || ((inn <= 1) && (ss >= 2));
    var triggerVoidWave = gongmang || chartHasGwimunPillar(data) || johoMergeRiskFromData(data);
    return {
        triggerFocusScatter: triggerFocusScatter,
        triggerVoidWave: triggerVoidWave,
        triggerUnifiedEmpathy: inseokWeak || sikExcess || gongmang
    };
}
function buildPart1DeepHookHTML(data) {
    var sig = computeDeepHookSignals(data);
    if (!sig.triggerUnifiedEmpathy && !sig.triggerFocusScatter && !sig.triggerVoidWave) return '';
    var box = 'margin-top:22px;padding:18px 20px;border-radius:14px;border:1px solid rgba(199,167,106,0.32);background:transparent;break-inside:avoid;page-break-inside:avoid;';
    var titleSt = 'font-size:11px;letter-spacing:0.14em;color:rgba(199,167,106,0.95);font-weight:800;margin-bottom:10px;';
    var bodySt = 'font-size:13.5px;color:#ddd;line-height:1.95;margin:0;';
    var bodyStMult = bodySt + 'white-space:pre-line;';
    var gmParagraph = buildGongmangDeepHookCopy(data);
    var focusParagraph = '';
    if (sig.triggerFocusScatter) {
        focusParagraph = '집중력이 부족한 것이 아니라, 뇌의 회전이 빨라 활자보다 직관적인 정보를 선호하는 편입니다. 긴 글보다 요약·도표·한 화면에 정리된 근거를 택하면 같은 에너지로 훨씬 더 잘 흡수됩니다.';
    }
    var unifiedParts = [];
    if (focusParagraph) unifiedParts.push(focusParagraph);
    if (gmParagraph) unifiedParts.push(gmParagraph);
    var unified = unifiedParts.length ? unifiedParts.join('\n\n') : '한곳에만 매달리기보다 리듬을 바꿔 보십시오.';
    var T1 = '집중력이 부족한 것이 아니라, 뇌의 회전이 빨라 활자보다 직관적인 정보를 선호하는 것입니다. 긴 글보다 요약·도표·한 화면에 정리된 근거를 택하면 같은 에너지로 훨씬 더 잘 흡수됩니다.';
    var T2 = '이유 없는 공허함이나 불안이 들 때, 원인을 끝까지 캐내려 하기보다 **몸의 리듬(수면·빛·이동)**을 먼저 바꿔 보십시오. 사주에서 말하는 빈자리(공망·귀문 등)는 성격 결함이 아니라, **채우려 할수록 형식만 남기 쉬운 자리**로 읽는 경우가 많습니다.';
    var html = '';
    function _vp(t){ return voicePolishParagraph(data, String(t || '')); }
    if (sig.triggerUnifiedEmpathy) {
        if (focusParagraph) {
            html += '<div class="deep-hook-panel card glass-panel" style="' + box + 'margin-bottom:14px;"><p style="' + bodySt + '">' + boldStarsToStrong(_vp(focusParagraph)) + '</p></div>';
        }
        if (gmParagraph) {
            html += '<div style="' + titleSt + 'margin-top:22px;">공망이 걸린 자리</div>';
            html += '<div class="deep-hook-panel card glass-panel sajux-gongmang-note" style="' + box + '"><p style="' + bodyStMult + '">' + boldStarsToStrong(_vp(gmParagraph)) + '</p></div>';
        }
        if (!gmParagraph && !focusParagraph) {
            html += '<div class="deep-hook-panel card glass-panel" style="' + box + '"><p style="' + bodySt + '">' + boldStarsToStrong(_vp(unified)) + '</p></div>';
        }
    } else {
        if (sig.triggerFocusScatter) {
            html += '<div class="deep-hook-panel card glass-panel" style="' + box + 'margin-bottom:14px;"><p style="' + bodySt + '">' + boldStarsToStrong(_vp(T1)) + '</p></div>';
        }
        if (sig.triggerVoidWave) {
            var voidBody = gmParagraph || T2;
            html += '<div class="deep-hook-panel card glass-panel sajux-gongmang-note" style="' + box + '"><p style="' + bodyStMult + '">' + boldStarsToStrong(_vp(voidBody)) + '</p></div>';
        }
    }
    return html;
}
/** 연도별 용신/기신 점수 묶음 (세운 카드·제목 공용) */
function computeSeYunScorePack(data, yr) {
    if (typeof Solar === 'undefined') return null;
    var yong = data.yong || 'wood';
    var gi = data.gi || 'metal';
    var hee = data.hee || '';
    var goo = data.goo || '';
    var dayStemY = data.dayStem || '甲';
    var GA = { '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire', '戊': 'earth', '己': 'earth', '庚': 'metal', '辛': 'metal', '壬': 'water', '癸': 'water' };
    var JA = { '子': 'water', '丑': 'earth', '寅': 'wood', '卯': 'wood', '辰': 'earth', '巳': 'fire', '午': 'fire', '未': 'earth', '申': 'metal', '酉': 'metal', '戌': 'earth', '亥': 'water' };
    var GK = { '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무', '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계' };
    var JK = { '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사', '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해' };
    var info = { goh: 'earth', joh: 'earth', kor: '', g: '', j: '' };
    try {
        var L = Solar.fromYmd(yr, 6, 15).getLunar();
        var gz = L.getYearInGanZhi();
        info.g = gz[0];
        info.j = gz[1];
        info.kor = (GK[info.g] || info.g) + (JK[info.j] || info.j);
        info.goh = GA[info.g] || 'earth';
        info.joh = JA[info.j] || 'earth';
    } catch (e1) { return null; }
    var evUp = info.goh === yong || info.joh === yong;
    var evDn = info.goh === gi || info.joh === gi;
    var ev2 = evUp ? { l: '흥(興)', c: '#c7a76a' } : (evDn ? { l: '주의', c: '#e08080' } : { l: '평온', c: '#aaa' });
    var sc = 0;
    if (info.goh === yong || info.goh === hee) sc += 2;
    if (info.goh === gi || info.goh === goo) sc -= 2;
    if (info.joh === yong || info.joh === hee) sc += 2;
    if (info.joh === gi || info.joh === goo) sc -= 2;
    var sewSip = (typeof getSipseong === 'function' && info.g) ? (getSipseong(dayStemY, info.g) || '') : '';
    return { info: info, ev2: ev2, sc: sc, sewSip: sewSip };
}
function yearlyFourDomainIndicators(score, sewSip) {
    var sip = sewSip || '';
    var w, cr, doc, love;
    if (score >= 3) {
        w = '수입·지출 겹침';
        cr = '역할·야근 경쟁';
        doc = /식신|상관/.test(sip) ? '전자계약' : '증빙 정리';
        love = '소개·모임 인연';
    } else if (score >= 1) {
        w = '분할·배당 우선';
        cr = '업무 설계 정비';
        doc = '요구조건 확인';
        love = '필터된 소개';
    } else if (score === 0) {
        w = '현금 코어';
        cr = '내실 유지';
        doc = '감사 로그';
        love = '경청 우선';
    } else if (score >= -2) {
        w = '투기 축소';
        cr = '노출 축소';
        doc = '구독 해지 점검';
        love = '새 접점 중단';
    } else {
        w = '청산·방어';
        cr = '규정 선제';
        doc = '법무선제';
        love = '차단정돈';
    }
    return { wealth: clampKeyword10(w), career: clampKeyword10(cr), doc: clampKeyword10(doc), love: clampKeyword10(love) };
}

/** 세운 본문용 재물·직업·애정·건강 — 3단 멘토 톤: 짧은 문장·재물/직업은 공감 선행 후 실행선 */
function yearlyDomainStrategicAdvices(score) {
    var sc = score;
    return {
        wealth: sc >= 2
            ? '이번 해에는 “한 번에 크게” 제안이 들어오기 쉽습니다. 여기서 말하는 것은 **주식·코인처럼 가격이 크게 오르내리는 쪽**이나, **남의 돈까지 끌어다 쓰는 큰 승부**를 뜻합니다. 부탁을 받으면 **“이만큼 잃어도 괜찮다”는 숫자**를 종이에 먼저 적고, 그 위로는 움직이지 마십시오. 같은 주에 **새 투자·새 사업 제안은 한 가지**만 남기고 나머지는 다음 주로 미루십시오.'
            : sc >= 0
            ? '벌기보다 **고정으로 나가는 돈**(휴대폰·구독·할부·보험료)이 조용히 불어나는 패턴에 가깝습니다. 통장 앱에서 **매달 자동 이체 목록**만 한 번 펼쳐 적으십시오. “다들 한다”는 이유로 새 상품에 들어가지 말고, **예금에 가깝게 안전한 통장** 비중을 조금 올리십시오. **하루아침에 크게 오르는 쪽**(유행 테마 주식 등)은 전체 자산에서 **아주 작은 비율**만 남기십시오.'
            : '누군가 말로 지갑을 열게 만들기 쉬운 해입니다. **친구·가족 이름으로 대출 돕기**, **같이 하자는 투자**, **서류도 없이 말로만 잡는 동업**은 올해는 거절하십시오. 꼭 필요하면 **변호사·세무사가 본 뒤**에만 다음 장을 넘기십시오.',
        career: sc >= 2
            ? '승진 이름보다 **남는 결과**(보고서 한 건, 매출 한 줄, 고객 칭찬 문자)가 먼저 쌓일 때 이깁니다. **반복 업무를 줄이는 방법**(표·자동화 등) 가운데 하나만 골라 이번 분기 목표로 정하십시오. 연봉 이야기가 나오면 **맡을 일 범위·누구 밑인지·야근이 있는지**를 메일로 받아 둔 뒤에만 답하십시오.'
            : sc >= 0
            ? '조용히 해도 일만 늘었다면 **역할이 흐린 자리**에 선 경우가 많습니다. 회의가 끝날 때마다 **“나는 여기까지” 한 줄**만 남기고, 분기마다 **내가 한 일 한 가지**를 문서로 적어 두십시오. 상사가 바뀌거나 일이 합쳐질 때는, **새 일을 잡기 전에 범위를 다시 적게** 하십시오.'
            : '속으로는 여러 번 그만두고 싶었을 수 있습니다. 그래도 버틴 것입니다. **구직 사이트는 비공개**로만 열고, 연차나 병가로 숨을 돌린 뒤 **내가 만든 결과(숫자·파일·후기) 한 가지**를 종이로 남기십시오. 그다음에만 내부 전배나 이직을 이야기하십시오.',
        love: pickLoveAdviceByScore(sc, 'seyun-love|' + sc),
        health: sc >= 2
            ? '몸이 따라주지 않는다고 느꼈을 수 있습니다. 그건 나약함이 아니라, 불이 너무 밝았기 때문입니다. **운동은 주 4회 이상 늘리지 마십시오.** 밤 11시 이후 집중 근무를 끊으면 체력이 바로 붙습니다.'
            : sc >= 0
            ? '검진을 미루며 “괜찮겠지”라고 했을지 모릅니다. 그건 방치가 아니라, 숨 돌릴 틈이 없었기 때문입니다. **점심 이후 카페인을 끊고**, 주 한 번은 반나절을 비우십시오. 검진은 한 번에 두 기관만 예약하십시오.'
            : '몸이 먼저 신호를 보냈는데 무시했을 수 있습니다. 그래도 늦지 않았습니다. **밤샘 두 번이면 다음 날은 반차**를 쓰십시오. 음주는 주 2회 이하로 줄이고, 수치가 튀는 달에는 회식을 거절하십시오.'
    };
}

/** 세운 연도 본문: 메타·이론 0, 사건·조건·행동만 */
var SEYUN_SIP_LENS = {
    '비견': '회의 안건이 비슷한 직급끼리 겹치고, 같은 조건으로 승패가 갈리는 자리가 잦아집니다',
    '겁재': '돈이 먼저 나가는 일(선납·대납·모임비·공동구매)이 붙어 나가기 쉽고, 누군가가 “같이 하자”며 지갑을 열라고 합니다',
    '식신': '기획서·원고·코드·영상처럼 손에 쥐는 결과물이 평가 기준이 되고, 발표·내부 공유 일정이 몰립니다',
    '상관': '지적·감사·클레임 대응으로 말의 날이 세워지고, “왜 그렇게 했냐”는 질문이 반복됩니다',
    '편재': '외주·부업·미수 회수·투자 제안 문자가 연달아 오고, 통장 입금 알림이 잦아집니다',
    '정재': '급여·정기 매출·고정비 줄이기가 화두가 되고, 장부 맞추기에 시간이 빼앗깁니다',
    '편관': '마감·야근·상사 지시량이 늘고, 책임 전가가 생기기 쉽습니다',
    '정관': '직함·평가·승진 서류가 눈에 띄게 매겨지고, 대외 자리에 세워질 일이 많아집니다',
    '편인': '자격·이직 준비·학습처럼 겉으로 안 보이는 데 힘 쓰는 일이 늘어납니다',
    '정인': '계약서·가이드·정책을 읽고 받아쓰는 일이 잦아지고, 서류 검토가 길어집니다'
};

/** 세운 멘토 서사: [1 공감·인정] → [2 명리적 원인·비유] → [3 단호한 실행]. 벨벳 장갑을 낀 도끼 톤, 합쇼체 유지. */
var SEYUN_SIP_SOUL_METAPHOR = {
    '비견': '원국에 비슷한 힘이 여럿 서 있어, 양보 없이 실력으로만 겨루는 장면이 반복되기 쉽습니다.',
    '겁재': '같은 방향으로 달리는 말들이 붙어 있어, 출발선에서 발이 겹치기 쉬운 해입니다.',
    '식신': '손끝으로 만드는 결과물이 곧 평가 기준이 되어, “보여준 것”만이 남는 해입니다.',
    '상관': '말과 기준이 날카롭게 세워져, 오해를 산 채로도 진실을 말해야 하는 자리가 잦습니다.',
    '편재': '돈의 문이 여러 곳에서 동시에 두드려져, 손이 분산되기 쉬운 해입니다.',
    '정재': '정해진 루틴과 장부가 삶을 지배해, 숫자에 쫓기는 느낌이 들기 쉽습니다.',
    '편관': '마감과 책임이 몰려 오르는 압박이 커져, 몸보다 먼저 맘이 지치기 쉽습니다.',
    '정관': '서열과 체면이 먼저 매겨져, 한 걸음마다 평가받는 느낌이 드는 해입니다.',
    '편인': '겉으로는 조용해도 안에서 준비와 경계가 동시에 돌아가, 혼자서 버티는 시간이 깁니다.',
    '정인': '문서와 규정이 먼저 앞을 가로막아, 감정보다 절차가 앞서는 해입니다.'
};

function buildYearStrategicNarrative(name, yr, kor, evLabel, sc, sewSip, ohTag, domainFour) {
    var _polishData = { name: name };
    function _vp(t){ return voicePolishParagraph(_polishData, String(t || '')); }
    var sip = sewSip || '정재';
    var nm = name || '고객';
    var yk = kor ? (yr + '년 ' + kor + '년') : (yr + '년');
    var lens = SEYUN_SIP_LENS[sip] || '견적·정산·승인선이 동시에 걸리는 일정이 잦아집니다';
    var soul = SEYUN_SIP_SOUL_METAPHOR[sip] || (yr + '년에는 ' + sipToEverydayWorkRhythm(sip) + ' 쪽 리듬이 겹쳐, 같은 일정도 체감 속도가 달라집니다.');
    var stemCode = (kor && kor.length) ? ((kor.charCodeAt(0) + kor.charCodeAt(kor.length - 1)) | 0) : (yr | 0);
    var mix = (yr * 7 + (sip || '').length * 3 + Math.abs(sc) * 11 + stemCode) % 4;
    var deferM = ((yr % 12) + 1);
    if (deferM > 12) deferM = 2;
    var df = domainFour || {};
    var isXing = (evLabel === '흥(興)');
    var isZhuyi = (evLabel && (evLabel.indexOf('주의') >= 0 || evLabel === '주의가 필요한 해'));

    var step1 = '';
    if (isXing && sc >= 2) {
        var a = [
            nmEunNeun(nm) + ' 기회를 놓칠까 봐 잠을 줄였을 수 있습니다. 겉으로는 당당해 보였을지라도, 속으로는 늘 시계를 보고 계셨을 것입니다.',
            nmKkeEunNeun(nm) + ' “지금 아니면 안 된다”는 말이 귀에 박혔을 수 있습니다. 그 말에 끌려가며, 정작 쉬는 법은 잊어버리셨을지 모릅니다.',
            nmEunNeun(nm) + ' 주변을 챙기느라 정작 본인의 숫자는 뒤로 미뤘을 수 있습니다. 그런데도 당신이 이기적인 사람이었던 것은 아닙니다.',
            nmKkeEunNeun(nm) + ' 인정받고 싶은 마음이 커서, 손해 보는 자리에도 앉아 있었을 수 있습니다. 그건 약함이 아니라, 믿음이 컸기 때문입니다.'
        ];
        step1 = a[mix];
    } else if (isXing) {
        var b = [
            nmEunNeun(nm) + ' 분명히 앞서가려 했을 것입니다. 그런데도 속으로는 “이만하면 됐나” 하는 불안이 끊기지 않았을 수 있습니다.',
            nmKke(nm) + ' 좋은 소식이 왔을 때조차, 먼저 오는 건 걱정이었을지 모릅니다. 그 마음이 이상한 게 아닙니다.',
            nmEunNeun(nm) + ' 웃으며 받아들였을지 모릅니다. 그러나 밤에는 혼자서 숫자를 다시 셌을 수 있습니다.',
            nmKkeEunNeun(nm) + ' “한 번만 더”가 쌓여, 어느새 어깨가 굳었을 것입니다. 그건 당신이 못나서가 아닙니다.'
        ];
        step1 = b[mix];
    } else if (isZhuyi) {
        var c = [
            nmEunNeun(nm) + ' 말 한마디에 책임이 몰려, 억울한 밤을 보냈을 수 있습니다. 당신을 오해한 사람들이 있었을 것입니다. 그러나 당신은 틀리지 않았습니다.',
            nmKkeEunNeun(nm) + ' “왜 나만”이 목구멍까지 올라왔을 수 있습니다. 그 감정을 숨기느라 더 지치셨을지 모릅니다.',
            nmEunNeun(nm) + ' 조용히 버텼을 수 있습니다. 그런데도 마음속으로는 이미 여러 번 무너졌을 수 있습니다.',
            nmKkeEunNeun(nm) + ' 미안함이 먼저 올라와, 본인의 몫을 줄였을 수 있습니다. 그건 착해서입니다, 무능해서가 아닙니다.'
        ];
        step1 = c[mix];
    } else {
        var d = [
            nmKkeEunNeun(nm) + ' 큰 드라마보다, 잔잔한 불안이 더 오래 남았을 수 있습니다. 겉으로는 괜찮다고 했을지라도, 속으로는 늘 점검 목록이 돌았을 것입니다.',
            nmEunNeun(nm) + ' “별일 없다”는 말을 믿고 싶었을 수 있습니다. 그런데도 몸은 먼저 긴장하고 있었을지 모릅니다.',
            nmKkeEunNeun(nm) + ' 변화가 조용히 와서, 나중에야 알아챘을 수 있습니다. 늦게 깨달았다고 해서 잘못된 것은 아닙니다.',
            nmEunNeun(nm) + ' 사람 좋다는 말을 많이 들었을 수 있습니다. 그 말이 때로는 족쇄처럼 느껴졌을지 모릅니다.'
        ];
        step1 = d[mix];
    }

    var step2Tails = [
        '<strong>' + nmKkeEunNeun(nm) + ' 이때는 일정 겹침을 줄이려면, **요일별로 “메인 한 줄”만** 남기고 나머지는 다음 주로 미루십시오.</strong>',
        '<strong>계약·송금·대면이 같은 주에 몰리지 않게, **중요한 건 화·목만** 열어 두십시오.</strong>',
        '<strong>‘나중에’ 대신 **구체 날짜 한 줄**로 미루는 습관만 있어도 손실이 줄어듭니다.</strong>',
        '<strong>이 해에는 **통장·지출 숫자**를 먼저 맞추는 쪽이, 감정의 기복보다 실속이 남습니다.</strong>',
        '<strong>' + nmKkeEunNeun(nm) + ' **겹치는 약속을 두 줄로 쪼개** 한 줄은 이메일로만 확정하십시오.</strong>',
        '<strong>독촉·회수·제안이 겹칠 때는 **오전 한 타임**만 열고 그 외 시간은 닫으십시오.</strong>',
        '<strong>같은 주에 **사람·돈·서류 중 하나**만 “승부”로 두고 나머지는 보류하십시오.</strong>',
        '<strong>이 시기에는 **견적 회신 48시간 유예**만 지켜도 마찰이 크게 줄어듭니다.</strong>'
    ];
    var tailPick = (mix + yr * 3 + Math.abs(sc)) % step2Tails.length;
    var step2 = yk + '에는 ' + lens + ' ' + soul + ' ' + step2Tails[tailPick];

    var stanceLine = '';
    if (sc >= 2) {
        stanceLine = '이제 선을 긋되, 정중하게 밀어내십시오. **검증된 통장으로만 받으십시오.** 새 앱 결제는 월 한 번으로 묶으십시오. 계약에는 “추가 업무 시 단가” 한 줄을 넣거나 넣게 요구하십시오.';
    } else if (sc >= 0) {
        stanceLine = '이제는 속도보다 리듬을 먼저 고정하십시오. **고정비·미수·카드값 세 줄만** 매주 금요일에 적으십시오. 새 프로젝트는 기간·인력·예산이 적힌 페이지가 있을 때만 착수하십시오.';
    } else {
        stanceLine = '이제는 희생을 멈추고 방패를 드십시오. **연대보증·지분·대출 서명은 올해 안에 하지 마십시오.** 책임만 넓히는 재배치가 오면, 이메일로 범위를 좁히는 답장을 먼저 보내십시오.';
    }

    var actionBank = [
        yr + '년에는 모든 계약에 “중도 해지·인출 조건” 두 줄을 필기로 적어 받으십시오. 동업 권유는 즉답하지 말고, 적어도 ' + deferM + '월 이후로 미루며 그 사이 전문가 한 곳만 확인하십시오.',
        yr + '년 상반기 제안에는 “6월 말까지 실행 없으면 무효” 탈출 조항을 넣으십시오. 신규 법인·계좌·카드는 한 해에 하나만 열고 나머지는 내년으로 미루십시오.',
        yr + '년에는 미수 독촉 문자 템플릿을 만들되, **오전 10시 한 번만** 보내십시오. “내일 현금” 약속은 문자로만 받고, 입금된 날에만 일을 넘기십시오.',
        yr + '년에는 서명 문서는 PDF로 날짜까지 파일명에 붙이십시오. **밤 10시 이후 서명·송금은 다음 날 아침**으로 미루십시오.'
    ];
    var action = actionBank[mix];

    var riskOne = [
        yr + '년 가장 비싼 실수는 믿는 사람과의 연대보증입니다. 자동이체 목록을 캡처하고, 불필요한 구독부터 끊으십시오.',
        yr + '년 감정이 올라온 날의 카톡 합의가 분쟁의 씨앗이 됩니다. 중요한 약속은 이메일 한 줄로 고정하십시오.',
        yr + '년 피로가 쌓이면 작은 손해를 한꺼번에 감수하려 합니다. 손해 한도를 숫자로 적어 지갑에 넣으십시오.',
        yr + '년 큰 지출은 한 분기에 하나만 허용하십시오.'
    ][(mix + sc + 4) % 4];

    var monthTie = [
        yr + '년 월운 표에서 색이 강한 달에만 계약·발표를 걸고, 옅은 달에는 세금·증빙만 하십시오.',
        yr + '년 분기 첫 달에 지출을 몰고, 마지막 달에는 회수·독촉만 하십시오.',
        yr + '년 매달 “사람·돈·서류 중 하나”만 메인으로 정하십시오.',
        yr + '년 월초·월말 두 번만이라도 통장 숫자를 맞추고, 그날 밤에는 지출 앱을 열지 마십시오.'
    ][(mix + (isXing ? 1 : (isZhuyi ? 2 : 0))) % 4];

    var integr = [
        nmEunNeun(nm) + ' ' + yr + '년 상반기에 끝낼 일 두 가지만 적으십시오. 끝나기 전에는 새 동업 미팅에 가지 마십시오.',
        nmEunNeun(nm) + ' ' + yr + '년에 고정비·저축·외상 한도 숫자 한 장만 맞추면 싸움이 줄어듭니다. 숫자 맞춘 날에는 술자리를 피하십시오.',
        nmEunNeun(nm) + ' ' + yr + '년 외부에 드러낼 축을 하나만 정하십시오. 나머지는 조용히 지키는 편이 돈이 덜 샙니다.',
        nmEunNeun(nm) + ' ' + yr + '년 말에 서명 문서 스크린샷 한 폴더만 만들어도 다음 해가 편해집니다.'
    ][(mix + yr) % 4];

    var wcBlock = '';
    if (df.wealth || df.career) {
        wcBlock = '<div style="margin:14px 0 10px;padding:12px 14px;border-radius:10px;border:1px solid rgba(199,167,106,0.28);background:rgba(199,167,106,0.06);">'
            + '<div style="font-size:12px;font-weight:800;color:#d4af37;font-family:Noto Sans KR,serif;letter-spacing:0.04em;margin-bottom:10px;">[ ' + yr + '년 재물운 및 직업운 상세 풀이 ]</div>'
            + (df.wealth ? '<p style="margin:0 0 8px;line-height:1.85;color:#ddd;">' + boldStarsToStrong(_vp(df.wealth)) + '</p>' : '')
            + (df.career ? '<p style="margin:0;line-height:1.85;color:#ddd;">' + boldStarsToStrong(_vp(df.career)) + '</p>' : '')
            + '</div>';
    }

    return stripSeyunZombiePhrases(stripReportMacroLeaks('<div class="seyun-year-body" style="font-size:12.5px;color:#ccc;line-height:1.9;">'
        + '<p style="margin:0 0 10px;line-height:1.85;">' + _vp(step1) + '</p>'
        + '<p style="margin:0 0 10px;line-height:1.85;">' + _vp(step2) + '</p>'
        + '<p style="margin:0 0 10px;line-height:1.85;"><strong>실행 선언.</strong> ' + boldStarsToStrong(_vp(stanceLine)) + '</p>'
        + '<p style="margin:0 0 10px;line-height:1.85;">' + boldStarsToStrong(_vp(action)) + '</p>'
        + '<p style="margin:0 0 10px;line-height:1.85;">' + _vp(riskOne) + '</p>'
        + '<p style="margin:0 0 10px;line-height:1.85;">' + _vp(integr) + '</p>'
        + '<p style="margin:0 0 12px;line-height:1.85;">' + _vp(monthTie) + '</p>'
        + wcBlock
        + '</div>'));
}

/** 연도별 간지 정보 (Solar 필요) */
function sajuYearGanZhiInfo(y) {
    var GA = { '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire', '戊': 'earth', '己': 'earth', '庚': 'metal', '辛': 'metal', '壬': 'water', '癸': 'water' };
    var JA = { '子': 'water', '丑': 'earth', '寅': 'wood', '卯': 'wood', '辰': 'earth', '巳': 'fire', '午': 'fire', '未': 'earth', '申': 'metal', '酉': 'metal', '戌': 'earth', '亥': 'water' };
    var GK = { '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무', '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계' };
    var JK = { '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사', '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해' };
    var g = '', j = '', go = 'earth', jo = 'earth', k = '';
    try {
        if (typeof Solar === 'undefined') return { goh: go, joh: jo, kor: k, g: g, j: j };
        var L = Solar.fromYmd(y, 6, 15).getLunar();
        var gz = L.getYearInGanZhi();
        g = gz[0];
        j = gz[1];
        k = (GK[g] || g) + (JK[j] || j);
        go = GA[g] || 'earth';
        jo = JA[j] || 'earth';
    } catch (e) { }
    return { goh: go, joh: jo, kor: k, g: g, j: j };
}

// ── 신살 상세 설명 DB ──
window.SHINSAL_DESC = {
    '천을귀인': {
        cat: '길성', color: '#c7a76a',
        short: '최고의 귀인성. 위기 때마다 구원자가 나타난다.',
        detail: '일생에서 가장 귀하게 여기는 신살입니다. 천을귀인이 있는 사람은 위기와 역경이 찾아올 때마다 가능하면 도와주는 귀인이 나타납니다. 대인관계가 원만하고 어떤 환경에서도 구원의 손길이 닿는 복력을 타고났습니다.'
    },
    '문창귀인': {
        cat: '길성', color: '#c7a76a',
        short: '학문·기획·글쓰기에서 두각. 시험운이 강하다.',
        detail: '학문과 예술, 기획 능력이 뛰어납니다. 시험이나 자격증 취득에 유리하며 글쓰기와 언어 능력이 탁월합니다. 지적 능력으로 사회적 성공을 이루는 별입니다.'
    },
    '문곡귀인': {
        cat: '길성', color: '#c7a76a',
        short: '문학·예술적 재능. 창의적 표현력이 강하다.',
        detail: '문창귀인과 함께 있으면 학문적 성취가 배가됩니다. 특히 문학, 예술, 음악 등 감성적 창작 분야에서 두각을 나타냅니다. 직관과 영감이 뛰어납니다.'
    },
    '문창귀인': {
        cat: '길성', color: '#c7a76a',
        short: '학문·기획·글쓰기에서 두각. 시험운 강함.',
        detail: '시험운이 강하고 학문적 성취와 연관됩니다.'
    },
    '천관귀인': {
        cat: '길성', color: '#c7a76a',
        short: '조직·직책 운이 강하다. 승진·명예에 유리.',
        detail: '조직 내 직책·권한 운이 뛰어납니다. 빠른 승진과 명예를 얻을 수 있으며, 권위 있는 자리에 오르는 힘을 가진 귀인성입니다.'
    },
    '천덕귀인': {
        cat: '길성', color: '#c7a76a',
        short: '하늘의 덕. 액운을 막고 귀인의 도움을 받습니다.',
        detail: '하늘의 덕스러운 기운으로 액운을 막아주는 강력한 보호막입니다. 어떤 흉살이 있어도 천덕귀인이 있으면 그 흉함이 크게 감소합니다.'
    },
    '월덕귀인': {
        cat: '길성', color: '#c7a76a',
        short: '달의 덕성. 재물운과 건강운을 보호합니다.',
        detail: '달의 덕스러운 기운으로 재물과 건강을 지켜줍니다. 특히 여성에게 이로우며, 흉살의 흉함을 완화하는 보호 기운입니다.'
    },
    '천의성': {
        cat: '길성', color: '#c7a76a',
        short: '의료·치유·상담 재능. 사람을 살리는 별.',
        detail: '의학, 치유, 상담, 종교 분야에서 특별한 재능을 발휘합니다. 이 별이 있는 사람은 타인을 치유하고 돕는 직업에서 큰 보람을 느끼며 사회적으로도 존경받습니다.'
    },
    '학당귀인': {
        cat: '길성', color: '#c7a76a',
        short: '학업·교육 환경이 따른다. 스승·멘토를 만난다.',
        detail: '배움의 기운이 강한 별입니다. 좋은 스승을 만나고 교육 환경이 잘 갖춰집니다. 공부가 재물과 명예로 이어지는 구조입니다.'
    },
    '역마살': {
        cat: '동살', color: '#4e87d9',
        short: '이동·여행·변동이 많다. 해외 인연이 강하다.',
        detail: '항상 움직이고 변화하는 기운입니다. 한 곳에 정착하기 어렵고 이동과 여행이 많습니다. 해외 인연이나 타 지역으로의 이동에서 기회를 잡습니다. 운수업, 무역, 해외 관련 직종에 유리합니다.'
    },
    '도화살': {
        cat: '도화', color: '#e879a0',
        short: '매력·인기·이성 인연이 강하다. 예술적 감각.',
        detail: '복숭아꽃처럼 사람을 끌어당기는 매력과 인기를 상징합니다. 이성 인연이 강하고 사람들이 자연스럽게 모여듭니다. 예술, 연예, 서비스 분야에서 강점을 발휘합니다. 단, 이성 문제로 인한 구설을 조심해야 합니다.'
    },
    '화개살': {
        cat: '고독살', color: '#8b7ca8',
        short: '예술·종교·철학 재능. 고독을 즐기는 기운.',
        detail: '화려한 덮개라는 뜻으로, 예술적 재능과 종교적 감수성이 뛰어납니다. 고독 속에서 깊은 사색을 즐기며 창작 활동에서 두각을 나타냅니다. 중년 이후 종교나 철학에 깊이 빠질 수 있습니다.'
    },
    '양인살': {
        cat: '흉살', color: '#e74c3c',
        short: '날카로운 의지력. 과감하지만 충동적 행동 주의.',
        detail: '양의 날카로운 뿔과 같은 기운입니다. 강한 의지력과 추진력을 가지고 있지만, 충동적이고 과격한 행동으로 인한 사고나 다툼을 조심해야 합니다. 군인, 경찰, 의사, 요리사 등 날카로운 도구를 다루는 직업에 유리합니다.'
    },
    '겁살': {
        cat: '흉살', color: '#e74c3c',
        short: '강탈·손재수. 재물과 건강의 갑작스런 손실.',
        detail: '갑작스러운 손실과 위기를 의미합니다. 재물의 손실, 건강 문제, 인간관계의 갑작스러운 단절이 발생할 수 있습니다. 큰 약속·보증 전에는 이틀 숙고 루틴을 고정하십시오. 이 살이 있는 해에는 충동적인 투자와 보증을 특히 조심해야 합니다.'
    },
    '망신살': {
        cat: '흉살', color: '#e74c3c',
        short: '체면·명예 손상. 구설수·망신의 위험.',
        detail: '몸을 망치는 살입니다. 체면이 깎이거나 구설수에 오르는 일이 생깁니다. 비밀 누설, 불륜, 사기 등으로 인한 사회적 명예 손상을 주의해야 합니다.'
    },
    '천살': {
        cat: '흉살', color: '#e74c3c',
        short: '하늘의 재앙. 예측 불가능한 재난.',
        detail: '하늘로부터 오는 재앙을 의미합니다. 자연재해, 사고, 갑작스러운 질병 등 예측하기 어려운 재난을 상징합니다. 이 살이 강한 시기에는 안전에 특히 주의해야 합니다.'
    },
    '지살': {
        cat: '흉살', color: '#e74c3c',
        short: '땅의 재앙. 이동·이사 시 문제 발생.',
        detail: '땅으로부터 오는 재앙으로, 이동과 이사에서 문제가 생길 수 있습니다. 부동산 투자나 이사 계획 시 신중하게 검토해야 합니다.'
    },
    '백호대살': {
        cat: '흉살', color: '#e74c3c',
        short: '피·수술·사고. 강렬한 에너지이지만 위험도 높다.',
        detail: '백호는 서방의 맹수로, 강력하고 위험한 에너지를 상징합니다. 피를 보는 사고, 수술, 폭력적인 사건과 연관됩니다. 그러나 이 살을 가진 사람은 동시에 강인한 생명력과 투지를 가집니다. 의사, 군인, 경찰 등에서 두각을 나타내기도 합니다.'
    },
    '괴강살': {
        cat: '강살', color: '#e67e22',
        short: '강력한 개성과 카리스마. 극단적인 기질.',
        detail: '괴강살은 극단적인 강함을 상징합니다. 이 살이 있는 사람은 카리스마와 강렬한 개성이 있지만, 감정 기복이 크고 타협을 싫어합니다. 성공하면 크게 성공하고, 실패하면 크게 실패하는 극단적인 기질을 가집니다.'
    },
    '원진살': {
        cat: '관계살', color: '#8b7ca8',
        short: '인연의 원한. 가까운 사람과 갈등·반목.',
        detail: '원한과 다툼을 부르는 살입니다. 가장 가까운 사람들과 오해와 갈등이 생기기 쉽습니다. 특히 부부·동업자·직장 상하관계에서 반목이 발생할 수 있습니다. 감정이 고조된 날의 문자·통화는 하루 미루십시오. 의사소통에 각별한 주의가 필요합니다.'
    },
    '귀문관살': {
        cat: '관계살', color: '#8b7ca8',
        short: '귀신문. 신경질환·예민함·신비로운 직감.',
        detail: '귀신의 문이라는 뜻으로, 신경질환이나 심리적 불안과 연관됩니다. 그러나 동시에 초감각적 직관력과 예술적 영감을 줍니다. 무속인, 종교인, 심리상담사에게서 자주 발견됩니다.'
    },
    '홍염살': {
        cat: '도화', color: '#e879a0',
        short: '강렬한 이성 매력. 색정·바람기 주의.',
        detail: '붉은 불꽃처럼 강렬한 이성적 매력을 발산합니다. 이성에게 인기가 많지만 색정적 문제가 생길 수 있습니다. 관계 속도를 서면 합의 수준으로 조절하십시오. 연예인, 예술가에게 자주 나타납니다.'
    },
    '고신살': {
        cat: '고독살', color: '#8b7ca8',
        short: '외로움·독립심. 혼자 있는 시간이 필요하다.',
        detail: '홀로 서는 기운입니다. 가족과 인연이 멀거나 혼자 지내는 시간이 많습니다. 그러나 이 고독함이 오히려 강한 독립심과 자기 계발의 원동력이 됩니다.'
    },
    '과숙살': {
        cat: '고독살', color: '#8b7ca8',
        short: '여성의 고독살. 배우자와의 인연이 박하다.',
        detail: '주로 여성에게 적용되는 고독살입니다. 배우자와의 인연이 늦거나 박하고 혼자 지내는 시간이 많습니다. 그러나 강한 내면의 힘을 키우는 기운이기도 합니다.'
    },
    '금여록': {
        cat: '길성', color: '#c7a76a',
        short: '귀한 수레·배우자복. 재물과 인연이 따른다.',
        detail: '금으로 만든 귀한 수레라는 뜻입니다. 배우자 복이 있고 귀한 인연이 따르는 길성입니다. 이 별이 있는 사람은 의식주가 풍족하고 품위 있는 삶을 살 가능성이 높습니다.'
    },
    '현침살': {
        cat: '재능살', color: '#9b59b6',
        short: '날카로운 침. 의료·예술·기술직 재능.',
        detail: '바늘처럼 날카로운 기운입니다. 의사·침술사·외과의·예술가·장인 등 정밀함이 요구되는 직업에서 탁월한 능력을 발휘합니다. 손재주가 뛰어나고 세밀한 작업에서 빛을 발합니다.'
    },
    '금각살': {
        cat: '신살', color: '#8b7ca8',
        short: '뼈·관절 질환 주의. 사고수 조심.',
        detail: '뼈와 관절에 관련된 질환이 나타날 수 있는 살입니다. 교통사고나 외부 충격에 의한 부상을 조심해야 합니다. 특히 팔다리 관절과 척추 건강에 유의하십시오.'
    },
    '유하살': {
        cat: '도화', color: '#e879a0',
        short: '풍류·애교·예술적 감성이 넘친다.',
        detail: '물처럼 흐르는 여유로운 기운입니다. 풍류와 예술을 즐기며 애교가 넘칩니다. 이성에게 매력적으로 보이며 음악·미술·공연 분야에서 감각이 뛰어납니다.'
    },
    '천주귀인': {
        cat: '길성', color: '#c7a76a',
        short: '하늘의 주인. 권위·명예·귀한 신분.',
        detail: '하늘의 주인이라는 뜻의 귀인성입니다. 이 별이 있는 사람은 높은 지위와 명예를 얻을 가능성이 크며, 사회적으로 귀하게 대접받는 구조입니다.'
    },
    '재고귀인': {
        cat: '길성', color: '#c7a76a',
        short: '창고 재물. 부를 축적하는 능력이 강하다.',
        detail: '재물 창고의 귀인성입니다. 재물을 모으고 지키는 능력이 탁월하며, 부동산이나 저축을 통해 안정적인 자산을 구축합니다. 특히 토지·부동산과 인연이 깊습니다.'
    },
    '급각살': {
        cat: '신살', color: '#e74c3c',
        short: '갑작스러운 사고·급변. 다리·발 주의.',
        detail: '갑작스러운 사고나 급격한 변화를 암시합니다. 다리와 발 부위의 부상을 특히 조심해야 합니다. 이 살이 있으면 예상치 못한 변수에 대비하는 보험과 안전장치를 미리 갖추는 것이 중요합니다.'
    },
    '수옥살': {
        cat: '신살', color: '#8b7ca8',
        short: '관재수·구속. 법적 분쟁 주의.',
        detail: '물 감옥이라는 뜻으로 법적 분쟁, 소송, 구속과 관련된 살입니다. 이 살이 있으면 법적 계약에 특히 신중해야 하며, 보증이나 연대보증을 피해야 합니다. 규칙과 법령을 철저히 준수하십시오.'
    },
    '장성살': {
        cat: '재능살', color: '#4a9e6a',
        short: '강한 성격·리더십. 장군의 기운.',
        detail: '장군처럼 강인한 의지와 추진력을 가진 살입니다. 리더십이 강하고 어떤 상황에서도 굴하지 않는 기질이 있습니다. 경쟁이 치열한 분야에서 두각을 나타내며 조직을 이끄는 능력이 탁월합니다.'
    },
    '복성귀인': {
        cat: '길성', color: '#c7a76a',
        short: '복의 별. 타고난 행운과 복력.',
        detail: '복의 별이라는 뜻입니다. 태어날 때부터 행운이 따르며 큰 어려움 없이 삶이 흘러가는 경향이 있습니다. 주변 사람들에게 복을 나눠주는 존재로 인식됩니다.'
    },
    '철새개금': {
        cat: '신살', color: '#8b7ca8',
        short: '감옥·구속의 기운. 변동수 조심.',
        detail: '쇠창살의 기운입니다. 자유로운 활동이 제약받는 상황이 생길 수 있습니다. 갑작스러운 환경 변화나 이동이 잦을 수 있으므로 안정적인 기반을 확보하는 것이 중요합니다.'
    },
    '태극귀인': {
        cat: '길성', color: '#c7a76a',
        short: '큰 덕이 깔린 귀인. 흉살의 날카로움을 완화합니다.',
        detail: '천을·천덕과 함께 크게 꼽히는 길신입니다. 신성한 보호와 조상의 은덕, 재난에서 벗어나게 하는 힘으로 해석됩니다.'
    },
    '천복귀인': {
        cat: '길성', color: '#c7a76a',
        short: '하늘이 준 복록·안정. 조직·제도권의 도움.',
        detail: '태생적으로 안정된 복과 윗사람·조직의 후원을 받기 쉬운 귀인입니다. 관운·승진·신뢰와 연결되어 해석되는 경우가 많습니다.'
    },
    '상문살': {
        cat: '신살', color: '#e74c3c',
        short: '상가·이별·우환. 활인업으로 업상대체.',
        detail: '상문(喪門)은 슬픈 소식·이별·질병 이미지가 강한 살로 알려져 있습니다. 의료·복지·장례 등 타인의 아픔을 돕는 일로 기운을 돌리면 해석이 달라지기도 합니다.'
    },
    '조객살': {
        cat: '신살', color: '#8b7ca8',
        short: '조문·조문객. 상문과 짝을 이루는 기운.',
        detail: '조객(弔客)은 상문과 함께 거론되는 살로, 조문·위로·정리의 물상과 연결됩니다. 상문과 만나면 작용이 강해진다고 전해집니다.'
    },
    '격각살': {
        cat: '관계살', color: '#8b7ca8',
        short: '앞뒤 한 칸 건너 격해짐. 고립·이별수.',
        detail: '일지에서 두 칸 점프한 지지에 해당할 때 생기는 살입니다. 부모·형제·배우자·자녀와 물리적 거리나 마음의 거리가 생기기 쉽다고 풀이됩니다.'
    },
    '평두살': {
        cat: '형태살', color: '#95a5a6',
        short: '천간이 지지에 묻힌 형태. 일주별 물상.',
        detail: '특정 일주에서 천간이 지지에 깔린 형국으로 보는 살입니다. 명리 서적마다 일주 목록이 조금씩 다를 수 있습니다.'
    },
    '효신살': {
        cat: '신살', color: '#e74c3c',
        short: '인성·육친 이슈. 독립과 거리 조절.',
        detail: '전통적으로 어머니·배우자 육친과의 마찰 이미지가 강합니다. 현대에는 경제·정신적 독립으로 완화된다고도 합니다.'
    },
    '반안살': {
        cat: '길성', color: '#4a9e6a',
        short: '말 안장에 오름. 안정·출세·혜택.',
        detail: '삼합 왕지 다음 지지에 해당할 때 붙는 십이신살로, 번영·명예·적은 노력으로 얻는 혜택 등 긍정적으로 해석되는 경우가 많습니다.'
    },
    '육해살': {
        cat: '관계살', color: '#e67e22',
        short: '육해(六害). 마음 맞지 않는 관계.',
        detail: '두 지지가 서로 해(害)하는 조합입니다. 오해·구설·형제·부부 갈등 물상으로 이어지기 쉽다고 하며, 의식적 소통으로 완화합니다.'
    },
    '재살': {
        cat: '신살', color: '#e74c3c',
        short: '재앙·위기·구속 이미지. 전략과 생존력.',
        detail: '삼합 장성(왕지)과 충하는 지지에 해당합니다. 관재·구설·사고 이미지와 함께, 위기 돌파 전략·특수직 적성으로 긍정 전환되기도 합니다.'
    },
    '월살': {
        cat: '신살', color: '#e74c3c',
        short: '월살(月煞). 고갈·정체 이미지.',
        detail: '삼합 고지와 충하는 지지로 보는 십이신살입니다. 일이 막히거나 침체된다는 물상으로 전해지며, 택일·방위에서는 따로 쓰이기도 합니다.'
    }
};


// ═══════════════════════════════════════════════════
// 조후용신(調候用神) DB — 월지×일간 기준 온도/습도 균형
// ═══════════════════════════════════════════════════
window.JOHU_DB = {
    '甲':{
        '寅':'甲목이 寅월(이른 봄)에 태어났습니다. 아직 대지가 차갑고 나무가 막 움트는 시기입니다. 丙화(태양)의 온기가 가장 먼저 필요하고, 癸수(봄비)가 뿌리를 적셔야 성장이 가능합니다. 丙화와 癸수가 사주에 있으면 조후가 성립되어 삶이 순탄하게 흐릅니다.',
        '卯':'甲목이 卯월(한창 봄)에 태어났습니다. 목의 기운이 극성한 시기라 수분보다 햇볕이 더 시급합니다. 庚금으로 목을 다듬고 丙화로 방향을 밝혀야 나무가 쓸모 있는 재목이 됩니다.',
        '辰':'甲목이 辰월(늦봄)에 태어났습니다. 목이 쇠해가는 시기지만 토(土)가 두텁습니다. 壬수와 庚금이 조후용신이며, 이 둘이 투출하면 사회적 성공이 빠릅니다.',
        '巳':'甲목이 巳월(초여름)에 태어났습니다. 열기가 강해 나무가 말라가는 형국입니다. 癸수로 뿌리를 적시고 庚금으로 가지를 쳐야 합니다. 癸수가 제1 조후용신입니다.',
        '午':'甲목이 午월(한여름)에 태어났습니다. 뜨거운 태양 아래 나무가 수분을 잃습니다. 癸수비가 절실히 필요하며, 庚금으로 가지를 다듬어야 합니다.',
        '未':'甲목이 未월(늦여름)에 태어났습니다. 토가 건조하고 열기가 남아있습니다. 癸수와 丁화가 균형을 잡아야 합니다.',
        '申':'甲목이 申월(초가을)에 태어났습니다. 庚금이 甲목을 직접 극하는 계절입니다. 丁화로 금을 제어하고, 壬수로 목을 도와야 합니다.',
        '酉':'甲목이 酉월(한가을)에 태어났습니다. 금기가 극성하여 목이 상하기 쉽습니다. 丁화로 금을 제어하고 壬수로 목을 보호해야 합니다.',
        '戌':'甲목이 戌월(늦가을)에 태어났습니다. 壬癸수로 뿌리를 강화하고 丙화로 온기를 유지해야 합니다.',
        '亥':'甲목이 亥월(초겨울)에 태어났습니다. 丙화로 온기를 불어넣어야 나무가 살아납니다. 丙화가 제1 조후용신입니다.',
        '子':'甲목이 子월(한겨울)에 태어났습니다. 혹한에 뿌리가 얼어붙을 위기입니다. 丙화(태양)가 없으면 재능이 있어도 발휘되기 어렵고, 丙화가 있으면 역경을 딛고 크게 성장합니다.',
        '丑':'甲목이 丑월에 태어났습니다. 아직 겨울의 냉기가 강합니다. 丙화로 온기를 만들고 癸수로 뿌리를 유지해야 합니다. 봄이 오면 폭발적으로 성장하는 구조입니다.'
    },
    '乙':{
        '寅':'乙목이 寅월(봄)에 태어났습니다. 유연한 덩굴이 봄에 피어나는 형국입니다. 丙화로 온기를, 癸수로 수분을 채워야 합니다.',
        '卯':'乙목이 卯월에 태어났습니다. 목기가 극성한 시기입니다. 庚금으로 과잉된 목을 다듬고 丙화로 방향을 설정해야 합니다.',
        '辰':'乙목이 辰월에 태어났습니다. 토가 풍부하여 뿌리는 안정적이나 목의 힘이 약해집니다. 癸수와 丙화의 균형이 필요합니다.',
        '巳':'乙목이 巳월에 태어났습니다. 열기가 강해 을목이 빠르게 마릅니다. 癸수가 제1 조후용신입니다.',
        '午':'乙목이 午월에 태어났습니다. 한여름의 을목은 태양 아래 풀처럼 타들어갈 수 있습니다. 癸수가 절실히 필요합니다.',
        '未':'乙목이 未월에 태어났습니다. 건조한 토의 기운 속에 목이 약해집니다. 癸수와 丙화가 균형을 잡아야 합니다.',
        '申':'乙목이 申월에 태어났습니다. 금기의 계절에 음목은 특히 취약합니다. 丙화와 壬수가 보호막이 됩니다.',
        '酉':'乙목이 酉월에 태어났습니다. 금기 최강의 시기입니다. 丁화로 금을 억제하고 壬수로 목을 보호해야 합니다.',
        '戌':'乙목이 戌월에 태어났습니다. 조후 상 건조한 편입니다. 癸수와 丙화가 필요합니다.',
        '亥':'乙목이 亥월에 태어났습니다. 수분이 풍부하나 온기가 부족합니다. 丙화가 제1 조후용신입니다.',
        '子':'乙목이 子월에 태어났습니다. 한겨울의 을목입니다. 丙화의 온기가 가장 절실합니다. 사주에 화기가 있으면 사회적으로 크게 빛납니다.',
        '丑':'乙목이 丑월에 태어났습니다. 추운 겨울 끝자락의 음목입니다. 丙화와 庚금이 균형을 잡아줍니다. 봄이 오면 폭발적으로 성장합니다.'
    },
    '丙':{
        '寅':'丙화가 寅월(봄)에 태어났습니다. 목생화로 태양의 기운이 막 타오르기 시작합니다. 壬수가 조후용신으로 균형을 잡아줍니다.',
        '卯':'丙화가 卯월에 태어났습니다. 목이 화를 키워주는 구조입니다. 壬수가 필수 조후용신이며, 庚금이 보조입니다.',
        '辰':'丙화가 辰월에 태어났습니다. 壬수와 甲목이 균형을 잡아야 합니다.',
        '巳':'丙화가 巳월에 태어났습니다. 태양이 한창 떠오르는 시기입니다. 壬수로 열기를 식히고 庚금으로 단련해야 합니다.',
        '午':'丙화가 午월에 태어났습니다. 한여름 정오의 태양입니다. 壬수가 제1 조후용신으로 없으면 초조하고 충동적인 성향이 강해집니다.',
        '未':'丙화가 未월에 태어났습니다. 열기가 여전히 강한 시기입니다. 壬수와 甲목이 필요합니다.',
        '申':'丙화가 申월에 태어났습니다. 가을에 태양이 기울기 시작합니다. 壬수와 庚금이 조후용신입니다.',
        '酉':'丙화가 酉월에 태어났습니다. 甲목으로 화를 키우고 壬수로 균형을 잡습니다.',
        '戌':'丙화가 戌월에 태어났습니다. 甲목과 壬수가 필요합니다.',
        '亥':'丙화가 亥월에 태어났습니다. 甲목으로 화를 살리고 壬수를 적절히 통제해야 합니다.',
        '子':'丙화가 子월에 태어났습니다. 한겨울의 작은 촛불 같은 형국입니다. 甲목으로 불을 살리는 것이 급선무입니다.',
        '丑':'丙화가 丑월에 태어났습니다. 甲목이 화를 키워주고 壬수와 균형을 맞춰야 합니다.'
    },
    '丁':{
        '寅':'丁화가 寅월에 태어났습니다. 甲목으로 화를 키우고 庚금으로 갑목을 자극해야 합니다. 甲庚 모두 있으면 고급 기술자·의사·예술가의 기운입니다.',
        '卯':'丁화가 卯월에 태어났습니다. 목이 화를 강하게 키웁니다. 庚금이 甲목을 다듬어 정화(精火)를 만들어야 합니다.',
        '辰':'丁화가 辰월에 태어났습니다. 壬수와 甲목이 균형을 잡아야 합니다.',
        '巳':'丁화가 巳월에 태어났습니다. 음화지만 여름 기운에 힘이 강합니다. 庚금이 필요합니다.',
        '午':'丁화가 午월에 태어났습니다. 甲목과 庚금이 균형을 잡아줍니다.',
        '未':'丁화가 未월에 태어났습니다. 건조한 환경의 촛불입니다. 壬수와 甲목이 필요합니다.',
        '申':'丁화가 申월에 태어났습니다. 가을의 촛불은 庚금을 연단하기 좋습니다. 甲목이 불을 살리고 庚금이 제련됩니다.',
        '酉':'丁화가 酉월에 태어났습니다. 금기가 강한 가을에 촛불처럼 빛납니다. 甲목으로 화를 살려야 합니다.',
        '戌':'丁화가 戌월에 태어났습니다. 甲목과 壬수가 균형을 잡아야 합니다.',
        '亥':'丁화가 亥월에 태어났습니다. 甲목으로 화를 키우는 것이 급합니다.',
        '子':'丁화가 子월에 태어났습니다. 혹한에 촛불이 꺼질 위기입니다. 甲목과 庚금이 균형을 잡아주어야 합니다.',
        '丑':'丁화가 丑월에 태어났습니다. 甲목으로 화를 키우면 재능이 발휘됩니다.'
    },
    '戊':{
        '寅':'戊토가 寅월(봄)에 태어났습니다. 봄의 큰 산입니다. 丙화로 온기를 더하고 甲목을 통제할 庚금이 필요합니다.',
        '卯':'戊토가 卯월에 태어났습니다. 목이 강해 토를 극합니다. 庚금과 丙화로 균형을 잡아야 합니다.',
        '辰':'戊토가 辰월에 태어났습니다. 봄 끝의 두터운 땅입니다. 甲목과 丙화가 균형을 잡습니다.',
        '巳':'戊토가 巳월에 태어났습니다. 화토가 겹쳐 매우 건조합니다. 壬癸수가 절실히 필요합니다.',
        '午':'戊토가 午월에 태어났습니다. 한여름 뜨거운 땅입니다. 壬수로 열기를 식히는 것이 급선무입니다.',
        '未':'戊토가 未월에 태어났습니다. 화토가 극성합니다. 壬癸수와 甲목이 필요합니다.',
        '申':'戊토가 申월에 태어났습니다. 토생금으로 기운이 새어나갑니다. 丙화와 甲목으로 보완합니다.',
        '酉':'戊토가 酉월에 태어났습니다. 丙화와 甲목이 균형을 잡아야 합니다.',
        '戌':'戊토가 戌월에 태어났습니다. 甲목과 壬수가 필요합니다.',
        '亥':'戊토가 亥월에 태어났습니다. 丙화와 甲목으로 건조함을 유지해야 합니다.',
        '子':'戊토가 子월에 태어났습니다. 한겨울 수기 위의 땅입니다. 丙화가 제1 조후용신입니다.',
        '丑':'戊토가 丑월에 태어났습니다. 丙화로 온기를 확보해야 합니다.'
    },
    '己':{
        '寅':'己토가 寅월(봄)에 태어났습니다. 봄 밭의 음토입니다. 丙화와 癸수가 균형을 잡아야 합니다.',
        '卯':'己토가 卯월에 태어났습니다. 甲목이 기토를 극합니다. 丙화로 온기를 보완합니다.',
        '辰':'己토가 辰월에 태어났습니다. 丙화와 癸수가 필요합니다.',
        '巳':'己토가 巳월에 태어났습니다. 화기가 강해 토가 건조합니다. 癸수가 제1 조후용신입니다.',
        '午':'己토가 午월에 태어났습니다. 한여름의 밭은 갈라집니다. 癸수와 壬수가 절실합니다.',
        '未':'己토가 未월에 태어났습니다. 극도로 건조합니다. 癸수와 丙화의 균형이 필요합니다.',
        '申':'己토가 申월에 태어났습니다. 丙화와 癸수가 균형을 잡아야 합니다.',
        '酉':'己토가 酉월에 태어났습니다. 금기가 강해 토의 기운이 새어나갑니다. 丙화와 癸수가 필요합니다.',
        '戌':'己토가 戌월에 태어났습니다. 甲목으로 토를 다스리고 丙화로 온기를 유지해야 합니다.',
        '亥':'己토가 亥월에 태어났습니다. 수기가 강해 土가 젖어 무기력해질 수 있습니다. 丙화와 甲목이 필요합니다.',
        '子':'己토가 子월에 태어났습니다. 한겨울 수기 속 음토입니다. 丙화가 절실히 필요합니다.',
        '丑':'己토가 丑월에 태어났습니다. 얼어붙은 땅입니다. 丙화의 온기가 생명입니다.'
    },
    '庚':{
        '寅':'庚금이 寅월(봄)에 태어났습니다. 봄에 금기가 약합니다. 戊토로 금을 생하고 丁화로 제련해야 진가가 나옵니다.',
        '卯':'庚금이 卯월에 태어났습니다. 목이 강한 봄에 금기가 위협받습니다. 戊토와 丁화가 필요합니다.',
        '辰':'庚금이 辰월에 태어났습니다. 甲목과 丁화가 균형을 잡아야 합니다.',
        '巳':'庚금이 巳월에 태어났습니다. 화기가 금을 녹입니다. 壬수와 戊토가 균형을 잡아야 합니다.',
        '午':'庚금이 午월에 태어났습니다. 한여름 화기에 금이 용해되는 형국입니다. 壬수가 제1 조후용신입니다.',
        '未':'庚금이 未월에 태어났습니다. 화토의 건조한 환경입니다. 壬수와 甲목이 필요합니다.',
        '申':'庚금이 申월에 태어났습니다. 가을 금기가 극성합니다. 丁화로 제련하여 보검을 만들어야 합니다.',
        '酉':'庚금이 酉월에 태어났습니다. 금기 최강의 시기입니다. 丁화와 甲목이 균형을 잡아야 합니다.',
        '戌':'庚금이 戌월에 태어났습니다. 甲목과 壬수가 필요합니다.',
        '亥':'庚금이 亥월에 태어났습니다. 수기가 강해 금이 차갑습니다. 丁화와 甲목이 필요합니다.',
        '子':'庚금이 子월에 태어났습니다. 한겨울의 차가운 금입니다. 丁화로 온기를 주고 甲목이 보조합니다.',
        '丑':'庚금이 丑월에 태어났습니다. 丁화와 甲목이 절실합니다.'
    },
    '辛':{
        '寅':'辛금이 寅월(봄)에 태어났습니다. 봄에 약한 음금입니다. 己토와 壬수가 균형을 잡아야 합니다.',
        '卯':'辛금이 卯월에 태어났습니다. 壬수와 己토가 필요합니다.',
        '辰':'辛금이 辰월에 태어났습니다. 壬수와 甲목이 균형을 잡아야 합니다.',
        '巳':'辛금이 巳월에 태어났습니다. 화기가 강해 금이 위험합니다. 壬수와 庚금이 보호막이 됩니다.',
        '午':'辛금이 午월에 태어났습니다. 한여름의 가냘픈 보석입니다. 壬수와 庚금이 필수입니다.',
        '未':'辛금이 未월에 태어났습니다. 壬수와 庚금이 균형을 잡아야 합니다.',
        '申':'辛금이 申월에 태어났습니다. 가을 금기 속 보석입니다. 壬수와 甲목이 빛을 냅니다.',
        '酉':'辛금이 酉월에 태어났습니다. 금기가 극성합니다. 壬수와 甲목이 필요합니다.',
        '戌':'辛금이 戌월에 태어났습니다. 壬수와 甲목이 균형을 잡습니다.',
        '亥':'辛금이 亥월에 태어났습니다. 丙화와 壬수가 균형을 잡아야 합니다.',
        '子':'辛금이 子월에 태어났습니다. 丙화와 壬수가 필요합니다.',
        '丑':'辛금이 丑월에 태어났습니다. 丙화와 壬수가 절실합니다.'
    },
    '壬':{
        '寅':'壬수가 寅월(봄)에 태어났습니다. 봄에 수기가 약해지는 시기입니다. 庚금으로 수를 생하고 戊토로 제방을 만들어야 합니다.',
        '卯':'壬수가 卯월에 태어났습니다. 목이 수를 흡수합니다. 庚금과 甲목이 필요합니다.',
        '辰':'壬수가 辰월에 태어났습니다. 庚금과 戊토가 균형을 잡아야 합니다.',
        '巳':'壬수가 巳월에 태어났습니다. 화기가 강해 수가 증발합니다. 庚금이 제1 조후용신입니다.',
        '午':'壬수가 午월에 태어났습니다. 한여름에 수기가 위협받습니다. 庚금이 절실히 필요합니다.',
        '未':'壬수가 未월에 태어났습니다. 庚금과 甲목이 필요합니다.',
        '申':'壬수가 申월에 태어났습니다. 금생수로 수기가 강합니다. 戊토로 제방을 쌓아야 합니다.',
        '酉':'壬수가 酉월에 태어났습니다. 甲목과 戊토가 균형을 잡습니다.',
        '戌':'壬수가 戌월에 태어났습니다. 庚금과 甲목이 필요합니다.',
        '亥':'壬수가 亥월에 태어났습니다. 수기가 극성합니다. 戊토로 제방을 쌓고 庚금을 활용해야 합니다.',
        '子':'壬수가 子월에 태어났습니다. 수기가 가장 강한 시기입니다. 戊토가 제1 조후용신입니다.',
        '丑':'壬수가 丑월에 태어났습니다. 戊토와 庚금이 필요합니다.'
    },
    '癸':{
        '寅':'癸수가 寅월(봄)에 태어났습니다. 봄 빗물처럼 자연스럽습니다. 辛금과 庚금이 수를 생하고 丙화와 균형을 맞춰야 합니다.',
        '卯':'癸수가 卯월에 태어났습니다. 봄비 같은 형국입니다. 辛금과 庚금이 필요합니다.',
        '辰':'癸수가 辰월에 태어났습니다. 辛금과 庚금이 균형을 잡아야 합니다.',
        '巳':'癸수가 巳월에 태어났습니다. 여름에 빗물이 증발하는 형국입니다. 庚금이 절실히 필요합니다.',
        '午':'癸수가 午월에 태어났습니다. 가장 위험한 조합 중 하나입니다. 庚금이 없으면 인생이 매우 힘들어집니다. 庚금이 있으면 역경을 딛고 강해집니다.',
        '未':'癸수가 未월에 태어났습니다. 庚금과 辛금이 수를 보충해야 합니다.',
        '申':'癸수가 申월에 태어났습니다. 금생수로 수기를 보충받습니다. 丙화와 균형을 맞춰야 합니다.',
        '酉':'癸수가 酉월에 태어났습니다. 辛금이 수를 생합니다. 丙화와 均衡을 잡아야 합니다.',
        '戌':'癸수가 戌월에 태어났습니다. 건조한 환경입니다. 辛금과 庚금이 필요합니다.',
        '亥':'癸수가 亥월에 태어났습니다. 수기가 강합니다. 庚金과 丙화가 균형을 잡아야 합니다.',
        '子':'癸수가 子월에 태어났습니다. 수기가 극성합니다. 丙화와 庚금이 필요합니다.',
        '丑':'癸수가 丑월에 태어났습니다. 빙점의 수입니다. 丙화와 庚금이 절실합니다.'
    }
};

// ═══════════════════════════════════════════════════
// 격국(格局) DB — 월지 지장간이 천간에 투출하여 형성되는 사주 구조
// ═══════════════════════════════════════════════════
window.GEOKGUK_DB = {
    // 격국명 → 성격(成格) / 파격(破格) 판단 + 풀이 텍스트
    '정재격':{
        name:'정재격', type:'재성격', 
        success:'정재격이 성격(成格)되었습니다. 성실하고 꾸준한 노력으로 재물을 모으는 구조입니다. 규칙적인 수입, 안정적인 직장, 신뢰받는 인간관계가 삶의 핵심 자산이 됩니다. 식상이 재성을 생하면 일을 통한 수입이 자연스럽게 증가합니다. 관성이 뒷받침되면 사회적 안정과 재물이 함께 옵니다.',
        fail:'정재격이 파격(破格) 위기에 있습니다. 겁재(비견)가 재성을 탈취하거나, 인성이 식상을 극하는 구조입니다. 돈이 들어와도 나가는 흐름이 반복되거나, 파트너십에서 금전 분쟁이 발생하기 쉽습니다. 합법적 계약과 문서화가 필수입니다.',
        chars:'계획적, 현실적, 성실함, 신뢰감, 절약 정신'    },
    '편재격':{
        name:'편재격', type:'재성격',
        success:'편재격이 성격되었습니다. 고정 수입보다 사업, 투자, 무역 등 변동성 높은 분야에서 큰 재물을 움직이는 구조입니다. 식신이 편재를 생하면 아이디어가 곧 돈이 됩니다. 활동적이고 사교적인 성향으로 광범위한 인맥이 재물로 연결됩니다. 큰 판을 벌이는 것을 두려워하지 않는 사주입니다.',
        fail:'편재격이 파격 위기에 있습니다. 비겁이 재성을 극하거나 관성이 너무 강해 재성을 모두 설기시킵니다. 한번에 큰돈을 잃는 도박적 투자나, 사업 파트너와의 갈등으로 재물이 흩어질 수 있습니다.',
        chars:'대범함, 사교성, 도전정신, 유연성, 재물 감각'
    },
    '정관격':{
        name:'정관격', type:'관성격',
        success:'정관격이 성격되었습니다. 사회적 질서 안에서 인정받고 승진하는 구조입니다. 조직에서 두각을 나타내며 명예와 지위가 자연스럽게 따라옵니다. 재성이 관성을 생하면 재물과 명예가 동시에 옵니다. 법과 원칙을 지키는 삶이 결국 가장 큰 성공을 만듭니다.',
        fail:'정관격이 파격 위기에 있습니다. 상관이 정관을 극하거나, 칠살(편관)이 혼잡합니다. 직장에서 상사와의 갈등, 법적 분쟁, 사회적 명예 실추에 주의해야 합니다. 규칙을 어기는 행동이 돌이킬 수 없는 결과를 낳습니다.',
        chars:'준법정신, 책임감, 신중함, 명예욕, 사회적 인정욕'
    },
    '편관격':{
        name:'편관격', type:'관성격',
        success:'편관격이 성격되었습니다. 칠살이 식신에 의해 제화되면 강력한 추진력과 리더십이 빛납니다. 군인, 경찰, 법조인, 의사, 스포츠 선수처럼 강도 높은 경쟁 환경에서 두각을 나타냅니다. 도전적인 환경일수록 더 강해지는 사주입니다.',
        fail:'편관격이 파격 위기에 있습니다. 식신이 없어 칠살을 제어하지 못하면 충동, 공격성, 사고, 법적 문제가 반복됩니다. 화(火)가 너무 강하면 몸과 마음을 소진시킵니다. 가능하면 제어 장치가 필요합니다.',
        chars:'추진력, 담력, 경쟁심, 승부욕, 강한 의지'
    },
    '식신격':{
        name:'식신격', type:'식상격',
        success:'식신격이 성격되었습니다. 재능과 창의성으로 먹고 사는 구조입니다. 예술, 요리, 글쓰기, 기획, 교육 등 자신의 재능을 표현하는 분야에서 자연스럽게 수입이 따라옵니다. 재성이 있으면 재능이 곧 돈이 됩니다. 복식(福食)이라 하여 의식주가 풍족한 구조입니다.',
        fail:'식신격이 파격 위기에 있습니다. 편인이 식신을 극하면(효신탈식) 재능이 있어도 수입으로 연결되지 못합니다. 창의성이 막히거나, 건강 문제로 활동이 제한됩니다.',
        chars:'창의성, 낙관주의, 재능, 여유, 섬세한 감수성'
    },
    '상관격':{
        name:'상관격', type:'식상격',
        success:'상관격이 성격되었습니다. 기존 관념을 깨는 혁신적 사고와 탁월한 언변이 강점입니다. 재성이 있으면 상관이 재성을 생하여 큰 재물을 만들 수 있습니다. 예술가, 작가, 컨설턴트, 기업가처럼 독창성이 무기인 분야에서 빛납니다.',
        fail:'상관격이 파격 위기에 있습니다. 관성이 혼잡하거나 상관이 관성을 직접 극합니다. 상사·조직과의 갈등, 법적 문제, 자신의 독설로 인한 손해가 반복됩니다. 말 한마디가 인생을 바꿀 수 있습니다.',
        chars:'독창성, 비판적 사고, 언변, 반골 기질, 혁신 성향'
    },
    '편인격':{
        name:'편인격', type:'인성격',
        success:'편인격이 성격되었습니다. 학문, 기술, 종교, 예술 등 특화된 분야의 깊은 전문성이 핵심 포인트입니다. 관성이 인성을 생하면 사회적 명예와 지식이 결합됩니다. 독창적인 연구와 창작 활동에서 두각을 나타냅니다.',
        fail:'편인격이 파격 위기에 있습니다. 재성이 편인을 극하거나, 식신을 탈취합니다. 전문 분야에서 방해꾼이 생기거나, 노력의 결과가 다른 사람에게 돌아가는 상황이 반복됩니다.',
        chars:'독창성, 깊이 파고드는 사고, 직관, 전문성, 고독함'
    },
    '정인격':{
        name:'정인격', type:'인성격',
        success:'정인격이 성격되었습니다. 학문, 교육, 문서, 자격증으로 삶을 이끌어가는 구조입니다. 관성이 인성을 생하면 학문과 사회적 명예가 결합됩니다. 평생 배움을 멈추지 않으면 나이 들수록 가치가 높아지는 인생 구조입니다.',
        fail:'정인격이 파격 위기에 있습니다. 재성이 너무 강해 인성을 극합니다. 학업 중단, 자격증 취득 실패, 귀인의 배신이 반복됩니다.',
        chars:'학구열, 배려심, 직관, 모성애, 지식 축적'
    },
    '비겁격':{
        name:'비겁격', type:'비겁격',
        success:'비겁이 많은 구조에서 용신이 관살(官殺)이나 식재(食財)이면 강한 자아와 실행력으로 성공합니다. 독립 사업가, 스포츠 선수, 프리랜서로서 경쟁 속에서 빛납니다.',
        fail:'비겁이 많은데 관살이나 식재가 없으면 고집과 아집이 강해 조직 생활이 힘들고 인간관계에서 마찰이 잦습니다. 돈이 들어와도 나눠주거나 탈취당하는 패턴이 반복됩니다.',
        chars:'독립심, 자존심, 경쟁심, 실행력, 강한 자아'
    }
};

// ═══════════════════════════════════════════════════
// 격국 판별 함수 — 월지 지장간이 천간에 투출했는지 확인
// ═══════════════════════════════════════════════════
window.getGeokGuk = function(pillars, dayStem, ec) {
    if(!pillars || !ec) return null;
    const mb = ec.getMonth()[1]; // 월지
    // 월지별 지장간 (정기가 가장 중요)
    const MONTH_JIJANG = {
        '子':['壬','癸'],'丑':['己','癸','辛'],'寅':['戊','丙','甲'],
        '卯':['甲','乙'],'辰':['乙','癸','戊'],'巳':['戊','庚','丙'],
        '午':['丙','己','丁'],'未':['己','乙','丁'],'申':['戊','壬','庚'],
        '酉':['庚','辛'],'戌':['辛','丁','戊'],'亥':['戊','甲','壬']
    };
    const jijang = MONTH_JIJANG[mb] || [];
    // 천간에 투출한 지장간 찾기
    const stems = pillars.map(p=>p.h[0]).filter(Boolean);
    let touchu = jijang.find(j => stems.includes(j));
    if(!touchu) touchu = jijang[jijang.length-1]; // 투출 없으면 월지 정기
    
    // 투출 천간의 십성을 격국명으로 변환
    const STEM_OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    const dayOh = STEM_OH[dayStem]||'earth';
    const touchuOh = STEM_OH[touchu]||'earth';
    
    // 오행 관계로 십성 판별
    const SIP_BASE = {
        wood:{wood:'비견',fire:'식신',earth:'편재',metal:'편관',water:'편인'},
        fire:{fire:'비견',earth:'식신',metal:'편재',water:'편관',wood:'편인'},
        earth:{earth:'비견',metal:'식신',water:'편재',wood:'편관',fire:'편인'},
        metal:{metal:'비견',water:'식신',wood:'편재',fire:'편관',earth:'편인'},
        water:{water:'비견',wood:'식신',fire:'편재',earth:'편관',metal:'편인'}
    };
    const baseSip = (SIP_BASE[dayOh]||{})[touchuOh]||'비겁';
    const dayYin = ['乙','丁','己','辛','癸'].includes(dayStem);
    const tYin = ['乙','丁','己','辛','癸'].includes(touchu);
    const yinDiff = dayYin !== tYin;
    
    let sipName = baseSip;
    if(baseSip==='비견') sipName = yinDiff?'겁재':'비견';
    else if(baseSip==='식신') sipName = yinDiff?'상관':'식신';
    else if(baseSip==='편재') sipName = yinDiff?'정재':'편재';
    else if(baseSip==='편관') sipName = yinDiff?'정관':'편관';
    else if(baseSip==='편인') sipName = yinDiff?'정인':'편인';
    
    const geokName = sipName + '격';
    const geokInfo = window.GEOKGUK_DB[geokName] || window.GEOKGUK_DB['비겁격'];
    
    // 성격/파격 판별 (간단 로직: 용신이 격국을 보조하는지)
    // 겁재/상관이 격국을 파괴하는지 확인
    const hasSangGwan = stems.some(s => {
        const sOh = STEM_OH[s];
        return (SIP_BASE[dayOh]||{})[sOh]==='식신' && ['乙','丁','己','辛','癸'].includes(dayStem) !== ['乙','丁','己','辛','癸'].includes(s);
    });
    const hasGwan = stems.some(s => {
        const sOh = STEM_OH[s];
        return (SIP_BASE[dayOh]||{})[sOh]==='편관'||(SIP_BASE[dayOh]||{})[sOh]==='비견';
    });
    
    return {
        geokName: geokName,
        touchu: touchu,
        sipName: sipName,
        info: geokInfo
    };
};

window.SAJU_DB = {
    ILJU: {
    "갑자": {
        "title": "깊은 물 위에 우뚝 선 나무 — 갑자",
        "core": "갑은 뻗어오르는 생명력, 성장, 인자함을 상징하고, 자은 깊은 지혜, 유연성, 치밀함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 생하는 구조 — 수이 목를 강화입니다. 당신의 일갑이 담당하는 신체 취약 부위는 간·담낭·신경계이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 목 오행의 본질인 '뻗어오르는 생명력, 성장, 인자함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 자은 당신의 배우자궁입니다. 수 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "을축": {
        "title": "봄 나무가 대지에 뿌리를 내리다 — 을축",
        "core": "을은 뻗어오르는 생명력, 성장, 인자함을 상징하고, 축은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 극하는 구조 — 목이 토를 제압, 강한 자기주장입니다. 당신의 일을이 담당하는 신체 취약 부위는 간·담낭·신경계이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 목 오행의 본질인 '뻗어오르는 생명력, 성장, 인자함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 축은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "병인": {
        "title": "봄 나무가 태양을 더욱 밝히다 — 병인",
        "core": "병은 타오르는 열정, 표현, 밝음을 상징하고, 인은 뻗어오르는 생명력, 성장, 인자함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 생하는 구조 — 목이 화를 강화입니다. 당신의 일간(병)이 담당하는 신체 취약 부위는 심장·혈관·안구이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 화 오행의 본질인 '타오르는 열정, 표현, 밝음'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 인은 당신의 배우자궁입니다. 목 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "정묘": {
        "title": "봄 나무가 태양을 더욱 밝히다 — 정묘",
        "core": "정은 타오르는 열정, 표현, 밝음을 상징하고, 묘은 뻗어오르는 생명력, 성장, 인자함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 생하는 구조 — 목이 화를 강화입니다. 당신의 일간(정)이 담당하는 신체 취약 부위는 심장·혈관·안구이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 화 오행의 본질인 '타오르는 열정, 표현, 밝음'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 묘은 당신의 배우자궁입니다. 목 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "무진": {
        "title": "산 위에 또 산, 거대한 대지 — 무진",
        "core": "무은 안정된 포용력, 신용, 중후함을 상징하고, 진은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 비화 — 같은 오행이 겹쳐 에너지가 응집입니다. 당신의 일간(무)이 담당하는 신체 취약 부위는 위장·비장·소화기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 토 오행의 본질인 '안정된 포용력, 신용, 중후함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 진은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "기사": {
        "title": "불에 달궈지는 기름진 땅 — 기사",
        "core": "기은 안정된 포용력, 신용, 중후함을 상징하고, 사은 타오르는 열정, 표현, 밝음의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 생하는 구조 — 화이 토를 강화입니다. 당신의 일간(기)이 담당하는 신체 취약 부위는 위장·비장·소화기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 토 오행의 본질인 '안정된 포용력, 신용, 중후함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 사은 당신의 배우자궁입니다. 화 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "경오": {
        "title": "불꽃 속에서 빛나는 칼날 — 경오",
        "core": "경은 날카로운 결단력, 의리, 정밀함을 상징하고, 오은 타오르는 열정, 표현, 밝음의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 극하는 구조 — 환경이 나를 압박, 역경 속 성장입니다. 당신의 일간(경)이 담당하는 신체 취약 부위는 폐·대장·호흡기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 금 오행의 본질인 '날카로운 결단력, 의리, 정밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 오은 당신의 배우자궁입니다. 화 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "신미": {
        "title": "대지에서 캐낸 금속 — 신미",
        "core": "신은 날카로운 결단력, 의리, 정밀함을 상징하고, 미은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 생하는 구조 — 토이 금를 강화입니다. 당신의 일간(신)이 담당하는 신체 취약 부위는 폐·대장·호흡기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 금 오행의 본질인 '날카로운 결단력, 의리, 정밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 미은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "임신": {
        "title": "금속 위를 흐르는 맑은 물 — 임신",
        "core": "임은 깊은 지혜, 유연성, 치밀함을 상징하고, 신은 날카로운 결단력, 의리, 정밀함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 생하는 구조 — 금이 수를 강화입니다. 당신의 일간(임)이 담당하는 신체 취약 부위는 신장·방광·호르몬이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 수 오행의 본질인 '깊은 지혜, 유연성, 치밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 신은 당신의 배우자궁입니다. 금 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "계유": {
        "title": "금속 위를 흐르는 맑은 물 — 계유",
        "core": "계은 깊은 지혜, 유연성, 치밀함을 상징하고, 유은 날카로운 결단력, 의리, 정밀함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 생하는 구조 — 금이 수를 강화입니다. 당신의 일간(계)이 담당하는 신체 취약 부위는 신장·방광·호르몬이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 수 오행의 본질인 '깊은 지혜, 유연성, 치밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 유은 당신의 배우자궁입니다. 금 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "갑술": {
        "title": "봄 나무가 대지에 뿌리를 내리다 — 갑술",
        "core": "갑은 뻗어오르는 생명력, 성장, 인자함을 상징하고, 술은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 극하는 구조 — 목이 토를 제압, 강한 자기주장입니다. 당신의 일갑이 담당하는 신체 취약 부위는 간·담낭·신경계이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 목 오행의 본질인 '뻗어오르는 생명력, 성장, 인자함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 술은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "을해": {
        "title": "깊은 물 위에 우뚝 선 나무 — 을해",
        "core": "을은 뻗어오르는 생명력, 성장, 인자함을 상징하고, 해은 깊은 지혜, 유연성, 치밀함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 생하는 구조 — 수이 목를 강화입니다. 당신의 일을이 담당하는 신체 취약 부위는 간·담낭·신경계이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 목 오행의 본질인 '뻗어오르는 생명력, 성장, 인자함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 해은 당신의 배우자궁입니다. 수 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "병자": {
        "title": "뜨거운 불과 차가운 물의 충돌 — 병자",
        "core": "병은 타오르는 열정, 표현, 밝음을 상징하고, 자은 깊은 지혜, 유연성, 치밀함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 극하는 구조 — 환경이 나를 압박, 역경 속 성장입니다. 당신의 일간(병)이 담당하는 신체 취약 부위는 심장·혈관·안구이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 화 오행의 본질인 '타오르는 열정, 표현, 밝음'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 자은 당신의 배우자궁입니다. 수 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "정축": {
        "title": "타오르는 불 위에 굳건한 산 — 정축",
        "core": "정은 타오르는 열정, 표현, 밝음을 상징하고, 축은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 생하는 구조 — 화이 토에 에너지를 공급입니다. 당신의 일간(정)이 담당하는 신체 취약 부위는 심장·혈관·안구이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 화 오행의 본질인 '타오르는 열정, 표현, 밝음'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 축은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "무인": {
        "title": "대지를 뚫고 솟아오르는 나무 — 무인",
        "core": "무은 안정된 포용력, 신용, 중후함을 상징하고, 인은 뻗어오르는 생명력, 성장, 인자함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 극하는 구조 — 환경이 나를 압박, 역경 속 성장입니다. 당신의 일간(무)이 담당하는 신체 취약 부위는 위장·비장·소화기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 토 오행의 본질인 '안정된 포용력, 신용, 중후함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 인은 당신의 배우자궁입니다. 목 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "기묘": {
        "title": "대지를 뚫고 솟아오르는 나무 — 기묘",
        "core": "기은 안정된 포용력, 신용, 중후함을 상징하고, 묘은 뻗어오르는 생명력, 성장, 인자함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 극하는 구조 — 환경이 나를 압박, 역경 속 성장입니다. 당신의 일간(기)이 담당하는 신체 취약 부위는 위장·비장·소화기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 토 오행의 본질인 '안정된 포용력, 신용, 중후함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 묘은 당신의 배우자궁입니다. 목 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "경진": {
        "title": "대지에서 캐낸 금속 — 경진",
        "core": "경은 날카로운 결단력, 의리, 정밀함을 상징하고, 진은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 생하는 구조 — 토이 금를 강화입니다. 당신의 일간(경)이 담당하는 신체 취약 부위는 폐·대장·호흡기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 금 오행의 본질인 '날카로운 결단력, 의리, 정밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 진은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "신사": {
        "title": "불꽃 속에서 빛나는 칼날 — 신사",
        "core": "신은 날카로운 결단력, 의리, 정밀함을 상징하고, 사은 타오르는 열정, 표현, 밝음의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 극하는 구조 — 환경이 나를 압박, 역경 속 성장입니다. 당신의 일간(신)이 담당하는 신체 취약 부위는 폐·대장·호흡기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 금 오행의 본질인 '날카로운 결단력, 의리, 정밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 사은 당신의 배우자궁입니다. 화 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "임오": {
        "title": "불꽃과 맞서는 깊은 물 — 임오",
        "core": "임은 깊은 지혜, 유연성, 치밀함을 상징하고, 오은 타오르는 열정, 표현, 밝음의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 극하는 구조 — 수이 화를 제압, 강한 자기주장입니다. 당신의 일간(임)이 담당하는 신체 취약 부위는 신장·방광·호르몬이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 수 오행의 본질인 '깊은 지혜, 유연성, 치밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 오은 당신의 배우자궁입니다. 화 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "계미": {
        "title": "대지를 적시는 강물 — 계미",
        "core": "계은 깊은 지혜, 유연성, 치밀함을 상징하고, 미은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 극하는 구조 — 환경이 나를 압박, 역경 속 성장입니다. 당신의 일간(계)이 담당하는 신체 취약 부위는 신장·방광·호르몬이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 수 오행의 본질인 '깊은 지혜, 유연성, 치밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 미은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "갑신": {
        "title": "가을 칼날에 맞서는 봄의 나무 — 갑신",
        "core": "갑은 뻗어오르는 생명력, 성장, 인자함을 상징하고, 신은 날카로운 결단력, 의리, 정밀함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 극하는 구조 — 환경이 나를 압박, 역경 속 성장입니다. 당신의 일갑이 담당하는 신체 취약 부위는 간·담낭·신경계이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 목 오행의 본질인 '뻗어오르는 생명력, 성장, 인자함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 신은 당신의 배우자궁입니다. 금 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "을유": {
        "title": "가을 칼날에 맞서는 봄의 나무 — 을유",
        "core": "을은 뻗어오르는 생명력, 성장, 인자함을 상징하고, 유은 날카로운 결단력, 의리, 정밀함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 극하는 구조 — 환경이 나를 압박, 역경 속 성장입니다. 당신의 일을이 담당하는 신체 취약 부위는 간·담낭·신경계이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 목 오행의 본질인 '뻗어오르는 생명력, 성장, 인자함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 유은 당신의 배우자궁입니다. 금 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "병술": {
        "title": "타오르는 불 위에 굳건한 산 — 병술",
        "core": "병은 타오르는 열정, 표현, 밝음을 상징하고, 술은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 생하는 구조 — 화이 토에 에너지를 공급입니다. 당신의 일간(병)이 담당하는 신체 취약 부위는 심장·혈관·안구이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 화 오행의 본질인 '타오르는 열정, 표현, 밝음'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 술은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "정해": {
        "title": "뜨거운 불과 차가운 물의 충돌 — 정해",
        "core": "정은 타오르는 열정, 표현, 밝음을 상징하고, 해은 깊은 지혜, 유연성, 치밀함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 극하는 구조 — 환경이 나를 압박, 역경 속 성장입니다. 당신의 일간(정)이 담당하는 신체 취약 부위는 심장·혈관·안구이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 화 오행의 본질인 '타오르는 열정, 표현, 밝음'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 해은 당신의 배우자궁입니다. 수 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "무자": {
        "title": "깊은 물을 품은 대지 — 무자",
        "core": "무은 안정된 포용력, 신용, 중후함을 상징하고, 자은 깊은 지혜, 유연성, 치밀함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 극하는 구조 — 토이 수를 제압, 강한 자기주장입니다. 당신의 일간(무)이 담당하는 신체 취약 부위는 위장·비장·소화기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 토 오행의 본질인 '안정된 포용력, 신용, 중후함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 자은 당신의 배우자궁입니다. 수 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "기축": {
        "title": "산 위에 또 산, 거대한 대지 — 기축",
        "core": "기은 안정된 포용력, 신용, 중후함을 상징하고, 축은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 비화 — 같은 오행이 겹쳐 에너지가 응집입니다. 당신의 일간(기)이 담당하는 신체 취약 부위는 위장·비장·소화기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 토 오행의 본질인 '안정된 포용력, 신용, 중후함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 축은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "경인": {
        "title": "숲을 베는 도끼 — 경인",
        "core": "경은 날카로운 결단력, 의리, 정밀함을 상징하고, 인은 뻗어오르는 생명력, 성장, 인자함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 극하는 구조 — 금이 목를 제압, 강한 자기주장입니다. 당신의 일간(경)이 담당하는 신체 취약 부위는 폐·대장·호흡기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 금 오행의 본질인 '날카로운 결단력, 의리, 정밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 인은 당신의 배우자궁입니다. 목 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "신묘": {
        "title": "숲을 베는 도끼 — 신묘",
        "core": "신은 날카로운 결단력, 의리, 정밀함을 상징하고, 묘은 뻗어오르는 생명력, 성장, 인자함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 극하는 구조 — 금이 목를 제압, 강한 자기주장입니다. 당신의 일간(신)이 담당하는 신체 취약 부위는 폐·대장·호흡기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 금 오행의 본질인 '날카로운 결단력, 의리, 정밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 묘은 당신의 배우자궁입니다. 목 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "임진": {
        "title": "대지를 적시는 강물 — 임진",
        "core": "임은 깊은 지혜, 유연성, 치밀함을 상징하고, 진은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 극하는 구조 — 환경이 나를 압박, 역경 속 성장입니다. 당신의 일간(임)이 담당하는 신체 취약 부위는 신장·방광·호르몬이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 수 오행의 본질인 '깊은 지혜, 유연성, 치밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 진은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "계사": {
        "title": "불꽃과 맞서는 깊은 물 — 계사",
        "core": "계은 깊은 지혜, 유연성, 치밀함을 상징하고, 사은 타오르는 열정, 표현, 밝음의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 극하는 구조 — 수이 화를 제압, 강한 자기주장입니다. 당신의 일간(계)이 담당하는 신체 취약 부위는 신장·방광·호르몬이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 수 오행의 본질인 '깊은 지혜, 유연성, 치밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 사은 당신의 배우자궁입니다. 화 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "갑오": {
        "title": "봄 나무가 불꽃으로 피어오르다 — 갑오",
        "core": "갑은 뻗어오르는 생명력, 성장, 인자함을 상징하고, 오은 타오르는 열정, 표현, 밝음의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 생하는 구조 — 목이 화에 에너지를 공급입니다. 당신의 일갑이 담당하는 신체 취약 부위는 간·담낭·신경계이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 목 오행의 본질인 '뻗어오르는 생명력, 성장, 인자함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 오은 당신의 배우자궁입니다. 화 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "을미": {
        "title": "봄 나무가 대지에 뿌리를 내리다 — 을미",
        "core": "을은 뻗어오르는 생명력, 성장, 인자함을 상징하고, 미은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 극하는 구조 — 목이 토를 제압, 강한 자기주장입니다. 당신의 일을이 담당하는 신체 취약 부위는 간·담낭·신경계이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 목 오행의 본질인 '뻗어오르는 생명력, 성장, 인자함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 미은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "병신": {
        "title": "불꽃 속에서 단련되는 금속 — 병신",
        "core": "병은 타오르는 열정, 표현, 밝음을 상징하고, 신은 날카로운 결단력, 의리, 정밀함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 극하는 구조 — 화이 금를 제압, 강한 자기주장입니다. 당신의 일간(병)이 담당하는 신체 취약 부위는 심장·혈관·안구이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 화 오행의 본질인 '타오르는 열정, 표현, 밝음'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 신은 당신의 배우자궁입니다. 금 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "정유": {
        "title": "불꽃 속에서 단련되는 금속 — 정유",
        "core": "정은 타오르는 열정, 표현, 밝음을 상징하고, 유은 날카로운 결단력, 의리, 정밀함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 극하는 구조 — 화이 금를 제압, 강한 자기주장입니다. 당신의 일간(정)이 담당하는 신체 취약 부위는 심장·혈관·안구이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 화 오행의 본질인 '타오르는 열정, 표현, 밝음'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 유은 당신의 배우자궁입니다. 금 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "무술": {
        "title": "산 위에 또 산, 거대한 대지 — 무술",
        "core": "무은 안정된 포용력, 신용, 중후함을 상징하고, 술은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 비화 — 같은 오행이 겹쳐 에너지가 응집입니다. 당신의 일간(무)이 담당하는 신체 취약 부위는 위장·비장·소화기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 토 오행의 본질인 '안정된 포용력, 신용, 중후함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 술은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "기해": {
        "title": "깊은 물을 품은 대지 — 기해",
        "core": "기은 안정된 포용력, 신용, 중후함을 상징하고, 해은 깊은 지혜, 유연성, 치밀함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 극하는 구조 — 토이 수를 제압, 강한 자기주장입니다. 당신의 일간(기)이 담당하는 신체 취약 부위는 위장·비장·소화기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 토 오행의 본질인 '안정된 포용력, 신용, 중후함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 해은 당신의 배우자궁입니다. 수 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "경자": {
        "title": "금속이 빚어낸 맑은 물 — 경자",
        "core": "경은 날카로운 결단력, 의리, 정밀함을 상징하고, 자은 깊은 지혜, 유연성, 치밀함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 생하는 구조 — 금이 수에 에너지를 공급입니다. 당신의 일간(경)이 담당하는 신체 취약 부위는 폐·대장·호흡기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 금 오행의 본질인 '날카로운 결단력, 의리, 정밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 자은 당신의 배우자궁입니다. 수 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "신축": {
        "title": "대지에서 캐낸 금속 — 신축",
        "core": "신은 날카로운 결단력, 의리, 정밀함을 상징하고, 축은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 생하는 구조 — 토이 금를 강화입니다. 당신의 일간(신)이 담당하는 신체 취약 부위는 폐·대장·호흡기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 금 오행의 본질인 '날카로운 결단력, 의리, 정밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 축은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "임인": {
        "title": "깊은 물이 키우는 나무 — 임인",
        "core": "임은 깊은 지혜, 유연성, 치밀함을 상징하고, 인은 뻗어오르는 생명력, 성장, 인자함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 생하는 구조 — 수이 목에 에너지를 공급입니다. 당신의 일간(임)이 담당하는 신체 취약 부위는 신장·방광·호르몬이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 수 오행의 본질인 '깊은 지혜, 유연성, 치밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 인은 당신의 배우자궁입니다. 목 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "계묘": {
        "title": "깊은 물이 키우는 나무 — 계묘",
        "core": "계은 깊은 지혜, 유연성, 치밀함을 상징하고, 묘은 뻗어오르는 생명력, 성장, 인자함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 생하는 구조 — 수이 목에 에너지를 공급입니다. 당신의 일간(계)이 담당하는 신체 취약 부위는 신장·방광·호르몬이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 수 오행의 본질인 '깊은 지혜, 유연성, 치밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 묘은 당신의 배우자궁입니다. 목 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "갑진": {
        "title": "봄 나무가 대지에 뿌리를 내리다 — 갑진",
        "core": "갑은 뻗어오르는 생명력, 성장, 인자함을 상징하고, 진은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 극하는 구조 — 목이 토를 제압, 강한 자기주장입니다. 당신의 일갑이 담당하는 신체 취약 부위는 간·담낭·신경계이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 목 오행의 본질인 '뻗어오르는 생명력, 성장, 인자함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 진은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "을사": {
        "title": "봄 나무가 불꽃으로 피어오르다 — 을사",
        "core": "을은 뻗어오르는 생명력, 성장, 인자함을 상징하고, 사은 타오르는 열정, 표현, 밝음의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 생하는 구조 — 목이 화에 에너지를 공급입니다. 당신의 일을이 담당하는 신체 취약 부위는 간·담낭·신경계이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 목 오행의 본질인 '뻗어오르는 생명력, 성장, 인자함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 사은 당신의 배우자궁입니다. 화 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "병오": {
        "title": "두 불꽃이 만나 거대한 불길로 — 병오",
        "core": "병은 타오르는 열정, 표현, 밝음을 상징하고, 오은 타오르는 열정, 표현, 밝음의 기운을 품고 있습니다. 이 두 기운은 비화 — 같은 오행이 겹쳐 에너지가 응집입니다. 당신의 일간(병)이 담당하는 신체 취약 부위는 심장·혈관·안구이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 화 오행의 본질인 '타오르는 열정, 표현, 밝음'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 오은 당신의 배우자궁입니다. 화 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "정미": {
        "title": "타오르는 불 위에 굳건한 산 — 정미",
        "core": "정은 타오르는 열정, 표현, 밝음을 상징하고, 미은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 생하는 구조 — 화이 토에 에너지를 공급입니다. 당신의 일간(정)이 담당하는 신체 취약 부위는 심장·혈관·안구이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 화 오행의 본질인 '타오르는 열정, 표현, 밝음'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 미은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "무신": {
        "title": "대지가 품어낸 빛나는 금속 — 무신",
        "core": "무은 안정된 포용력, 신용, 중후함을 상징하고, 신은 날카로운 결단력, 의리, 정밀함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 생하는 구조 — 토이 금에 에너지를 공급입니다. 당신의 일간(무)이 담당하는 신체 취약 부위는 위장·비장·소화기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 토 오행의 본질인 '안정된 포용력, 신용, 중후함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 신은 당신의 배우자궁입니다. 금 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "기유": {
        "title": "대지가 품어낸 빛나는 금속 — 기유",
        "core": "기은 안정된 포용력, 신용, 중후함을 상징하고, 유은 날카로운 결단력, 의리, 정밀함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 생하는 구조 — 토이 금에 에너지를 공급입니다. 당신의 일간(기)이 담당하는 신체 취약 부위는 위장·비장·소화기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 토 오행의 본질인 '안정된 포용력, 신용, 중후함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 유은 당신의 배우자궁입니다. 금 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "경술": {
        "title": "대지에서 캐낸 금속 — 경술",
        "core": "경은 날카로운 결단력, 의리, 정밀함을 상징하고, 술은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 생하는 구조 — 토이 금를 강화입니다. 당신의 일간(경)이 담당하는 신체 취약 부위는 폐·대장·호흡기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 금 오행의 본질인 '날카로운 결단력, 의리, 정밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 술은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "신해": {
        "title": "금속이 빚어낸 맑은 물 — 신해",
        "core": "신은 날카로운 결단력, 의리, 정밀함을 상징하고, 해은 깊은 지혜, 유연성, 치밀함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 생하는 구조 — 금이 수에 에너지를 공급입니다. 당신의 일간(신)이 담당하는 신체 취약 부위는 폐·대장·호흡기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 금 오행의 본질인 '날카로운 결단력, 의리, 정밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 해은 당신의 배우자궁입니다. 수 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "임자": {
        "title": "두 강이 만나 대해로 — 임자",
        "core": "임은 깊은 지혜, 유연성, 치밀함을 상징하고, 자은 깊은 지혜, 유연성, 치밀함의 기운을 품고 있습니다. 이 두 기운은 비화 — 같은 오행이 겹쳐 에너지가 응집입니다. 당신의 일간(임)이 담당하는 신체 취약 부위는 신장·방광·호르몬이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 수 오행의 본질인 '깊은 지혜, 유연성, 치밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 자은 당신의 배우자궁입니다. 수 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "계축": {
        "title": "대지를 적시는 강물 — 계축",
        "core": "계은 깊은 지혜, 유연성, 치밀함을 상징하고, 축은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 극하는 구조 — 환경이 나를 압박, 역경 속 성장입니다. 당신의 일간(계)이 담당하는 신체 취약 부위는 신장·방광·호르몬이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 수 오행의 본질인 '깊은 지혜, 유연성, 치밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 축은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "갑인": {
        "title": "봄 숲에서 더욱 강하게 뻗는 나무 — 갑인",
        "core": "갑은 뻗어오르는 생명력, 성장, 인자함을 상징하고, 인은 뻗어오르는 생명력, 성장, 인자함의 기운을 품고 있습니다. 이 두 기운은 비화 — 같은 오행이 겹쳐 에너지가 응집입니다. 당신의 일갑이 담당하는 신체 취약 부위는 간·담낭·신경계이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 목 오행의 본질인 '뻗어오르는 생명력, 성장, 인자함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 인은 당신의 배우자궁입니다. 목 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "을묘": {
        "title": "봄 숲에서 더욱 강하게 뻗는 나무 — 을묘",
        "core": "을은 뻗어오르는 생명력, 성장, 인자함을 상징하고, 묘은 뻗어오르는 생명력, 성장, 인자함의 기운을 품고 있습니다. 이 두 기운은 비화 — 같은 오행이 겹쳐 에너지가 응집입니다. 당신의 일을이 담당하는 신체 취약 부위는 간·담낭·신경계이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 목 오행의 본질인 '뻗어오르는 생명력, 성장, 인자함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 묘은 당신의 배우자궁입니다. 목 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "병진": {
        "title": "타오르는 불 위에 굳건한 산 — 병진",
        "core": "병은 타오르는 열정, 표현, 밝음을 상징하고, 진은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일간이 일지를 생하는 구조 — 화이 토에 에너지를 공급입니다. 당신의 일간(병)이 담당하는 신체 취약 부위는 심장·혈관·안구이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 화 오행의 본질인 '타오르는 열정, 표현, 밝음'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 진은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "정사": {
        "title": "두 불꽃이 만나 거대한 불길로 — 정사",
        "core": "정은 타오르는 열정, 표현, 밝음을 상징하고, 사은 타오르는 열정, 표현, 밝음의 기운을 품고 있습니다. 이 두 기운은 비화 — 같은 오행이 겹쳐 에너지가 응집입니다. 당신의 일간(정)이 담당하는 신체 취약 부위는 심장·혈관·안구이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 화 오행의 본질인 '타오르는 열정, 표현, 밝음'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 사은 당신의 배우자궁입니다. 화 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "무오": {
        "title": "불에 달궈지는 기름진 땅 — 무오",
        "core": "무은 안정된 포용력, 신용, 중후함을 상징하고, 오은 타오르는 열정, 표현, 밝음의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 생하는 구조 — 화이 토를 강화입니다. 당신의 일간(무)이 담당하는 신체 취약 부위는 위장·비장·소화기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 토 오행의 본질인 '안정된 포용력, 신용, 중후함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 오은 당신의 배우자궁입니다. 화 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "기미": {
        "title": "산 위에 또 산, 거대한 대지 — 기미",
        "core": "기은 안정된 포용력, 신용, 중후함을 상징하고, 미은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 비화 — 같은 오행이 겹쳐 에너지가 응집입니다. 당신의 일간(기)이 담당하는 신체 취약 부위는 위장·비장·소화기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 토 오행의 본질인 '안정된 포용력, 신용, 중후함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 미은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "경신": {
        "title": "두 칼날이 부딪히는 긴장 — 경신",
        "core": "경은 날카로운 결단력, 의리, 정밀함을 상징하고, 신은 날카로운 결단력, 의리, 정밀함의 기운을 품고 있습니다. 이 두 기운은 비화 — 같은 오행이 겹쳐 에너지가 응집입니다. 당신의 일간(경)이 담당하는 신체 취약 부위는 폐·대장·호흡기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 금 오행의 본질인 '날카로운 결단력, 의리, 정밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 신은 당신의 배우자궁입니다. 금 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "신유": {
        "title": "두 칼날이 부딪히는 긴장 — 신유",
        "core": "신은 날카로운 결단력, 의리, 정밀함을 상징하고, 유은 날카로운 결단력, 의리, 정밀함의 기운을 품고 있습니다. 이 두 기운은 비화 — 같은 오행이 겹쳐 에너지가 응집입니다. 당신의 일간(신)이 담당하는 신체 취약 부위는 폐·대장·호흡기이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 금 오행의 본질인 '날카로운 결단력, 의리, 정밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 유은 당신의 배우자궁입니다. 금 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "임술": {
        "title": "대지를 적시는 강물 — 임술",
        "core": "임은 깊은 지혜, 유연성, 치밀함을 상징하고, 술은 안정된 포용력, 신용, 중후함의 기운을 품고 있습니다. 이 두 기운은 일지가 일간을 극하는 구조 — 환경이 나를 압박, 역경 속 성장입니다. 당신의 일간(임)이 담당하는 신체 취약 부위는 신장·방광·호르몬이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 수 오행의 본질인 '깊은 지혜, 유연성, 치밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 술은 당신의 배우자궁입니다. 토 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    },
    "계해": {
        "title": "두 강이 만나 대해로 — 계해",
        "core": "계은 깊은 지혜, 유연성, 치밀함을 상징하고, 해은 깊은 지혜, 유연성, 치밀함의 기운을 품고 있습니다. 이 두 기운은 비화 — 같은 오행이 겹쳐 에너지가 응집입니다. 당신의 일간(계)이 담당하는 신체 취약 부위는 신장·방광·호르몬이며, 이 기운이 과부하될 때 가장 먼저 신호를 보내옵니다.",
        "weapon": "당신의 핵심 무기는 수 오행의 본질인 '깊은 지혜, 유연성, 치밀함'입니다. 이 기운이 용신과 맞닿는 대운에 들어서는 순간, 당신의 진정한 능력이 폭발적으로 발현됩니다.",
        "love": "일지 해은 당신의 배우자궁입니다. 수 기운을 지닌 사람과 인연이 깊으며, 특히 당신의 용신 오행을 일간으로 가진 상대와 에너지 보완이 이루어집니다."
    }
    },
    DAEWUN_EVENTS: [
    "갑자 대운은 새로운 출발의 기운입니다. 수가 목을 키우는 최상의 상생 구조로, 막혔던 에너지가 폭발적으로 분출됩니다. 새로운 분야에 뛰어드는 용기가 보상받는 시기입니다. 인간관계에서 귀인이 등장하며, 당신의 잠재력을 알아보는 사람들이 주변에 모입니다.",
    "을축 대운은 겨울 흙 위에서 끈질기게 자라는 풀의 기운입니다. 외부 환경이 녹록지 않아 보이지만, 오히려 이 시기에 뿌리를 깊이 내리는 사람이 다음 도약을 준비합니다. 조급함을 버리고 실력을 쌓는 것이 이 10년의 핵심 전략입니다.",
    "병인 대운은 태양이 봄 숲을 밝히는 최강의 에너지입니다. 목이 화를 거세게 생하는 구조로, 하고자 하는 일에 폭발적인 추진력이 생깁니다. 사회적 존재감이 급격히 올라가며, 리더십과 선도력이 빛을 발합니다. 새로운 도전을 두려워하지 않는 편이 좋습니다.",
    "정묘 대운은 봄 숲 속에 타오르는 촛불의 기운입니다. 예민한 감수성과 통찰력이 극대화되는 시기로, 창작·교육·상담·기획 분야에서 두각을 드러냅니다. 조용하지만 강한 영향력으로 주변을 변화시킵니다.",
    "무진 대운은 거대한 산이 용을 품은 기운입니다. 토가 겹쳐 중후하고 안정적인 흐름이 형성됩니다. 이 시기에 쌓은 것은 쉽게 무너지지 않습니다. 부동산, 사업 기반, 인맥 등 장기 자산을 구축하기에 최적의 10년입니다.",
    "기사 대운은 불 위의 기름진 논밭 기운입니다. 화가 토를 달구는 구조로 생산력이 활성화됩니다. 실무 능력과 세밀한 실행력이 빛을 발하며, 꾸준한 노력이 눈에 보이는 성과로 결실을 맺는 시기입니다.",
    "경오 대운은 한여름 불꽃이 거친 금속을 달구는 기운입니다. 외부의 강한 압박이 당신을 더욱 날카롭게 벼립니다. 이 시기에 겪는 시련은 훗날 당신의 가장 큰 경쟁력이 됩니다. 묵직한 결단력으로 한 가지에 집중하십시오.",
    "신미 대운은 여름 들판의 정제된 보석 기운입니다. 그동안 갈고닦은 실력이 세상에 드러나는 시기입니다. 완성도 높은 결과물이 사회적 인정으로 이어지며, 전문가로서의 위치가 확립됩니다.",
    "임신 대운은 거대한 바다가 금속 산에서 솟아오르는 기운입니다. 금이 수를 생하는 완벽한 에너지 공급 구조입니다. 지적 능력과 기획력이 폭발하며, 새로운 분야를 개척하는 선구자 역할을 하게 됩니다. 넓은 시야로 세상을 보십시오.",
    "계유 대운은 가을 금속 위를 흐르는 맑은 샘물 기운입니다. 분석과 논리가 빛을 발하는 시기로, 복잡한 문제를 명쾌하게 해결하는 능력으로 주목받습니다. 말보다 실력으로 승부하는 조용한 전성기입니다.",
    "갑술 대운은 가을 땅을 파고드는 고목나무의 기운입니다. 환경이 척박할수록 더욱 깊이 뿌리를 내리는 불굴의 의지가 발동합니다. 이 시기에 버텨낸 사람이 결국 마지막 승자가 됩니다.",
    "을해 대운은 겨울 바다 위를 떠도는 부드러운 넝쿨 기운입니다. 수가 목을 완벽하게 생하는 구조로, 직관과 공감 능력이 극대화됩니다. 인간관계와 네트워크에서 풍성한 결실을 맺는 시기입니다.",
    "병자 대운은 한겨울 밤을 밝히는 태양 기운입니다. 물과 불의 충돌이 만드는 창의적 긴장감 속에서 독창적인 아이디어가 쏟아집니다. 역경이 오히려 창의성의 원천이 됩니다.",
    "정축 대운은 겨울 얼음 속에 꺼지지 않는 촛불 기운입니다. 외부 환경이 힘들수록 내면의 신념과 원칙이 더욱 강해지는 시기입니다. 묵묵히 자신의 길을 걷는 사람이 결국 빛을 발합니다.",
    "무인 대운은 호랑이를 품은 거대한 산 기운입니다. 큰 꿈과 강한 실행력이 결합되는 시기입니다. 스케일을 키우고 과감하게 도전하십시오. 이 10년에 쌓은 기반이 평생의 자산이 됩니다.",
    "기묘 대운은 봄 숲을 뚫고 자라는 풀 기운입니다. 유연한 적응력과 현실 감각으로 목표를 향해 차근차근 나아가는 시기입니다. 서두르지 않아도 됩니다. 당신의 페이스가 정답입니다.",
    "경진 대운은 용이 품은 광산의 금속 기운입니다. 겉으로는 조용해 보이지만 내면에 엄청난 에너지가 축적되는 시기입니다. 결정적인 순간을 위해 힘을 모으십시오.",
    "신사 대운은 불꽃 속에서 빛나는 보석 기운입니다. 화가 금을 단련시키는 구조로, 압박이 클수록 더욱 정밀해집니다. 전문성과 완성도로 승부하는 시기입니다.",
    "임오 대운은 뜨거운 여름 하늘을 가로지르는 강 기운입니다. 열정과 냉철함이 격렬하게 충돌하는 시기로, 이 긴장을 잘 다루면 탁월한 성취가 가능합니다. 냉정한 판단으로 뜨겁게 실행하십시오.",
    "계미 대운은 뜨거운 여름 땅 위의 안개비 기운입니다. 조용히 스며드는 전략이 가장 효과적입니다. 직접적인 대결보다 우회하여 목표를 달성하는 지혜가 필요한 시기입니다.",
    "갑신 대운은 가을 도끼가 봄 나무를 찍는 기운입니다. 극한의 압박이 찾아오는 시기이지만, 이 압박이 당신의 잠재력을 끌어냅니다. 위기를 기회로 전환하는 능력을 발휘할 때입니다.",
    "을유 대운은 가을 금속 정원에 핀 꽃 기운입니다. 사교적 능력과 유연한 전략이 빛을 발합니다. 인맥과 네트워크에서 뜻밖의 기회가 찾아오는 시기입니다.",
    "병술 대운은 가을 건조한 땅 위에서 타오르는 불꽃 기운입니다. 에너지가 폭발적이지만 조절이 필요합니다. 집중할 한 가지를 정하고 모든 에너지를 쏟아부으십시오.",
    "정해 대운은 겨울 바다 위를 비추는 별빛 기운입니다. 어둠 속에서도 방향을 잡아주는 나침반 같은 시기입니다. 내면의 신념을 굳건히 하고 먼 목표를 바라보십시오.",
    "무자 대운은 겨울 물 위에 솟은 거대한 산 기운입니다. 변화와 안정 사이의 균형을 찾아가는 시기입니다. 기반을 굳건히 하면서도 유연하게 변화에 대응하십시오.",
    "기축 대운은 겨울 흙이 겹친 안정의 기운입니다. 신중하고 꼼꼼한 접근이 최대 효율을 냅니다. 당신이 이 시기에 차곡차곡 쌓아올리는 것은 복리처럼 시간이 지날수록 커집니다.",
    "경인 대운은 봄 숲을 베는 도끼 기운입니다. 강한 추진력으로 장애물을 돌파하는 시기입니다. 망설이지 말고 실행하십시오. 빠른 결단이 10년을 지배합니다.",
    "신묘 대운은 봄 숲에 숨겨진 날카로운 칼 기운입니다. 겉으로는 온화하게 보이지만 내면에서 치밀하게 전략을 짜는 시기입니다. 상대가 방심할 때 정확히 승부수를 던지십시오.",
    "임진 대운은 용이 잠든 깊은 호수 기운입니다. 표면은 잔잔하지만 내부에 엄청난 에너지가 응축되는 시기입니다. 한 번에 폭발할 준비를 조용히 하십시오.",
    "계사 대운은 불 속을 헤쳐가는 지하수 기운입니다. 극도의 긴장과 압박 속에서 진정한 내공이 드러나는 시기입니다. 버텨내는 자가 승리합니다.",
    "갑오 대운은 한여름 태양 아래 곧게 선 나무 기운입니다. 폭발적인 에너지가 집중되는 시기로, 몰입하면 상상 이상의 성과가 나옵니다. 재충전도 잊지 않는 편이 좋습니다.",
    "을미 대운은 여름 들판의 유연한 풀 기운입니다. 친화력과 끈기로 목표를 달성하는 시기입니다. 모든 사람을 내 편으로 만드는 능력이 빛을 발합니다.",
    "병신 대운은 가을 금속을 녹이는 태양 기운입니다. 대외적 리더십과 내면의 전략적 사고가 결합되는 시기입니다. 팀을 이끌면서 최적의 판단을 내리는 능력을 발휘하십시오.",
    "정유 대운은 가을 금속 위를 비추는 별빛 기운입니다. 섬세함과 완성도가 극대화되는 시기입니다. 당신이 이 시기에 만들어내는 결과물은 오랫동안 가치를 인정받습니다.",
    "무술 대운은 가을의 거대한 바위산 기운입니다. 토가 겹쳐 중후한 신뢰의 기운이 형성됩니다. 이 시기에 쌓은 인간 관계와 신뢰 자본이 평생의 자산이 됩니다.",
    "기해 대운은 겨울 바다를 가로지르는 논밭 기운입니다. 공감 능력과 실용적 지혜가 결합되는 시기입니다. 주변 사람들에게 꼭 필요한 존재로 자리매김합니다.",
    "경자 대운은 겨울 물 속에 잠긴 금속 기운입니다. 강한 자존심과 내면의 성찰이 공존하는 시기입니다. 자기계발에 투자한 것이 가능하면 보상받습니다.",
    "신축 대운은 겨울 땅에 묻힌 보석 기운입니다. 숨겨진 가치가 서서히 세상에 드러나는 시기입니다. 늦게 빛나는 별이 더 오래 빛납니다.",
    "임인 대운은 봄 숲 속을 흐르는 강물 기운입니다. 넓은 시각과 강한 실행력이 결합되는 최고의 조합입니다. 큰 그림을 그리면서 구체적으로 실행하십시오.",
    "계묘 대운은 봄 숲 속의 맑은 샘 기운입니다. 창의성과 직관이 폭발하는 시기입니다. 예술, 창작, 기획 분야에서 두각을 드러냅니다.",
    "갑진 대운은 용을 품은 땅 위의 거목 기운입니다. 거대한 잠재력이 마침내 세상에 드러나는 시기입니다. 이 10년이 당신 인생의 황금기가 됩니다.",
    "을사 대운은 불 위에서 감아오르는 덩굴 기운입니다. 열정과 유연성이 결합되어 어떤 환경에서도 목표를 달성합니다.",
    "병오 대운은 두 불꽃이 만나 거대한 화염이 되는 기운입니다. 에너지가 극에 달하는 시기로, 집중력이 뒷받침된다면 엄청난 성취가 가능합니다. 번아웃 주의.",
    "정미 대운은 여름 흙 위에 타오르는 별빛 기운입니다. 감수성과 현실 감각의 균형이 잡히는 시기입니다. 내면의 풍요로움이 외부의 풍요로 이어집니다.",
    "무신 대운은 금속을 품은 거대한 산 기운입니다. 결단력과 포용력이 결합되는 시기입니다. 리더로서의 위치가 더욱 강화됩니다.",
    "기유 대운은 가을 금속 위의 논밭 기운입니다. 정밀함과 실용성이 결합되는 시기입니다. 세밀한 계획과 철저한 실행이 빛을 발합니다.",
    "경술 대운은 가을 산의 거친 금속 기운입니다. 강인함과 인내력이 극대화되는 시기입니다. 어떤 역경도 당신을 멈추지 못합니다.",
    "신해 대운은 겨울 바다 속의 보석 기운입니다. 깊은 내면의 가치가 드러나는 시기입니다. 자신의 진정한 가치를 세상에 선보이십시오.",
    "임자 대운은 두 강이 만나 대해로 흐르는 기운입니다. 지혜와 통찰이 최고조에 달하는 시기입니다. 넓고 깊게 세상을 바라보십시오.",
    "계축 대운은 겨울 흙 위를 흐르는 지하수 기운입니다. 조용하지만 끊임없이 흐르는 지속성이 강점입니다. 포기하지 않는 자가 승리합니다.",
    "갑인 대운은 봄의 첫 번째 나무가 우뚝 서는 기운입니다. 새로운 시대의 개막입니다. 선도자로서 앞장서는 용기가 큰 보상으로 돌아옵니다.",
    "을묘 대운은 봄 생명이 폭발하는 덩굴 기운입니다. 목이 겹쳐 생명력이 극대화됩니다. 새로운 시작과 성장이 가속화되는 시기입니다.",
    "병진 대운은 용이 잠든 땅 위에서 태양이 빛나는 기운입니다. 잠재된 에너지가 마침내 폭발하는 시기입니다. 준비된 자에게 기회가 찾아옵니다.",
    "정사 대운은 두 불꽃이 교차하는 강렬한 기운입니다. 열정과 직관이 극대화됩니다. 창의적인 분야에서 눈부신 성취가 가능합니다.",
    "무오 대운은 여름 태양이 산을 달구는 기운입니다. 강한 추진력과 안정감이 결합됩니다. 큰 일을 벌이기에 최적의 시기입니다.",
    "기미 대운은 여름 흙이 겹친 풍요의 기운입니다. 실용적 지혜가 빛을 발하는 시기입니다. 착실하게 쌓아온 것이 결실을 맺습니다.",
    "경신 대운은 두 금속이 만나는 강력한 기운입니다. 결단력과 실행력이 극대화됩니다. 한 번 마음먹으면 무조건 해내는 시기입니다.",
    "신유 대운은 두 보석이 빛나는 정밀함의 기운입니다. 전문성이 극에 달하는 시기입니다. 당신의 분야에서 타의 추종을 불허하는 권위를 쌓으십시오.",
    "임술 대운은 가을 산을 적시는 강 기운입니다. 지혜와 안정이 결합되는 시기입니다. 오랜 경험에서 나오는 통찰이 주변을 이끕니다.",
    "계해 대운은 두 강이 만나 대해로 흐르는 기운입니다. 수가 극도로 집중되어 깊은 통찰과 지혜가 완성되는 시기입니다. 인생의 완숙기, 당신이 쌓아온 모든 것이 빛을 발합니다."
    ],
    WUXING_EXCESS: {
        'wood': "숲이 너무 우거져 햇빛이 들지 않는 형국입니다. 머릿속에 생각과 계획은 폭발적으로 많지만, 정작 무엇부터 해야 할지 모르는 결정장애와 강박이 심해집니다. 간, 담낭, 편두통 리스크가 있습니다.",
        'fire': "통제할 수 없는 산불이 번지는 형국입니다. 감정 기복이 극에 달하며, 조급함 때문에 다 된 밥에 재를 빠뜨리는 실수를 조심해야 합니다. 심장혈관, 안압, 번아웃 증후군 리스크가 있습니다.",
        'earth': "거대한 산에 갇혀 길이 보이지 않는 형국입니다. 고집과 아집이 뼈에 새겨져 있어 남의 말을 듣지 않고 스스로를 고립시킬 위험이 큽니다. 위장장애, 소화불량, 만성피로 리스크가 있습니다.",
        'metal': "사방이 날카로운 칼날로 둘러싸인 형국입니다. 완벽주의와 결벽증이 자신과 타인을 동시에 찌릅니다. 유연함이 없으면 부러집니다. 폐, 대장, 호흡기 계통 리스크가 있습니다.",
        'water': "깊이를 알 수 없는 심해에 잠긴 형국입니다. 겉보기엔 평온하나 내면의 우울감, 편집증, 음험한 생각에 사로잡히기 쉽습니다. 신장, 방광, 호르몬, 생식기 계통 리스크가 있습니다."
    },
    SIPSEONG: {
        '비견': "주변에 나와 같은 힘을 가진 경쟁자가 많습니다. 동업보다는 독립적인 영역을 구축해야 뺏기지 않습니다.",
        '겁재': "치열한 쟁탈전의 룰렛 위에 서 있습니다. 남의 것을 빼앗거나 내 것을 빼앗기는 제로섬 게임에 능합니다.",
        '식신': "내가 가진 재능과 말씨가 곧 돈이 되는 사주입니다. 꾸준한 아웃풋이 평생의 자산을 만듭니다.",
        '상관': "기존의 규칙을 깨부수고 판을 엎어버리는 반항의 아이콘입니다. 언행으로 인한 구설수를 가장 조심해야 합니다.",
        '편재': "통제할 수 없는 거대한 돈의 흐름을 쫓습니다. 투기와 사업 확장에 능하지만, 한 방에 무너질 리스크도 큽니다.",
        '정재': "매달 꽂히는 월급처럼 안정적인 자산을 추구합니다. 리스크를 극도로 혐오하며 가계부 쓰듯 인생을 설계합니다.",
        '편관': "나를 극한으로 몰아붙이는 압박감 속에서 희열과 명예를 얻습니다. 호랑이 등에 올라탄 격입니다.",
        '정관': "명예와 체면, 사회적 시스템을 중시합니다. 틀을 벗어나는 것을 두려워하며 모범생의 길을 걷습니다.",
        '편인': "주류가 아닌 비주류, 형이상학, 예술, 철학에 꽂히는 기질입니다. 눈치와 직관력이 타의 추종을 불허합니다.",
        '정인': "어머니의 품처럼 나를 보호해 주는 문서와 학문적 결실이 있습니다. 사랑받는 것에 익숙합니다."
    },
    INTERACTION: {
        '충': "기존의 것을 박살 내고 새로운 판을 짜는 강력한 충돌(이직, 이사, 이별)이 발생합니다.",
        '합': "서로 다른 기운이 만나 끈끈하게 결합합니다. 계약, 동업, 혹은 피할 수 없는 인연(결혼/연애)이 묶이는 시기입니다.",
        '형': "스스로 피를 보거나 깎아내야 하는 조정의 시기입니다. 법적 분쟁, 수술수, 혹은 뼈를 깎는 구조조정이 일어납니다.",
        '원진': "이유 없이 밉고 꼬이는 감정의 쓰레기통이 됩니다. 대인관계에서 억울한 오해를 받기 쉬우니 거리를 두어야 합니다."
    }
};


// --- X-SAJU DEEP REPORT GENERATOR ENGINE (V4 - REAL DB INTEGRATION) ---

function getReportAssetUrl(file) {
    try {
        if (typeof window !== 'undefined' && window.location && window.location.href) {
            return new URL('assets/' + file, window.location.href).href;
        }
    } catch (e) { /* fall through */ }
    return 'https://sajux.com/report/assets/' + file;
}

function ensureSajuxReadablePanelStyles() {
    if (document.getElementById('sajux-readable-panels')) return;
    var st = document.createElement('style');
    st.id = 'sajux-readable-panels';
    st.textContent = [
        ".m-hanja,.vip-hanja,.report-pillar-hanja,.hanja-main,.f-hz .report-pillar-hanja,.sajux-hanja,.month-pillar-title,.monthly-card,.yearly-card,.seyun-year-card{font-family:'Noto Sans KR',sans-serif!important;}",
        ".month-pillar-title .sajux-hanja,.monthly-card .sajux-hanja,.yearly-card .sajux-hanja{font-family:'Noto Sans KR',sans-serif!important;font-weight:700;}",
        "@media screen{.sajux-panel-plain,.yearly-indicators,.deep-hook-panel,.premium-executive-summary,#sec-life-panorama.report-chapter,.sajux-gongmang-note{background:transparent!important;background-color:transparent!important;}}",
        "@media print{.sajux-panel-plain,.yearly-indicators,.deep-hook-panel,.premium-executive-summary,#sec-life-panorama.report-chapter,.sajux-gongmang-note{background:#ffffff!important;background-color:#ffffff!important;border:1px solid #dddddd!important;}}",
        "body:not(.light-mode) .deep-hook-panel p,html[data-theme=dark] .deep-hook-panel p,body:not(.light-mode) .sajux-gongmang-note p,html[data-theme=dark] .sajux-gongmang-note p{color:#ddd!important;}",
        "body:not(.light-mode) .yearly-indicators .yearly-ind-val,html[data-theme=dark] .yearly-indicators .yearly-ind-val{color:#e8dcc8!important;}",
        ".yearly-indicators-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px 10px!important;width:100%!important;}",
        "@media (min-width:520px){.yearly-indicators-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;}}",
        "body.light-mode .domain-summary-3box,html[data-theme=light] .domain-summary-3box{background:rgba(122,90,34,0.07)!important;border-color:rgba(122,90,34,0.28)!important;}",
        "body.light-mode .domain-summary-3box [style*=\"background:rgba(0,0,0,0.18)\"],html[data-theme=light] .domain-summary-3box [style*=\"background:rgba(0,0,0,0.18)\"]{background:#fff!important;border:1px solid rgba(28,24,18,0.1)!important;box-sizing:border-box;}",
        "body.light-mode .domain-summary-3box [style*=\"color:#9aa1ae\"],html[data-theme=light] .domain-summary-3box [style*=\"color:#9aa1ae\"]{color:rgba(28,34,46,0.58)!important;}",
        "body.light-mode .domain-summary-3box [style*=\"color:#e5d7b3\"],html[data-theme=light] .domain-summary-3box [style*=\"color:#e5d7b3\"]{color:#5c4520!important;}",
        "body.light-mode .domain-summary-3box [style*=\"color:#d7d7d7\"],html[data-theme=light] .domain-summary-3box [style*=\"color:#d7d7d7\"]{color:#1e2633!important;}",
        "body.light-mode .domain-summary-3box [style*=\"color:#ffb7a8\"],html[data-theme=light] .domain-summary-3box [style*=\"color:#ffb7a8\"]{color:#9c3d30!important;}",
        "body.light-mode .report-chapter [style*=\"color:#bbb\"],html[data-theme=light] .report-chapter [style*=\"color:#bbb\"]{color:rgba(28,34,46,0.78)!important;}",
        "body.light-mode .report-chapter [style*=\"color:#ddd\"],html[data-theme=light] .report-chapter [style*=\"color:#ddd\"]{color:rgba(28,34,46,0.9)!important;}",
        "body.light-mode .report-chapter [style*=\"color:#ccc\"],html[data-theme=light] .report-chapter [style*=\"color:#ccc\"]{color:rgba(28,34,46,0.85)!important;}",
        "body.light-mode .report-chapter [style*=\"color:#aaa\"],html[data-theme=light] .report-chapter [style*=\"color:#aaa\"]{color:rgba(28,34,46,0.72)!important;}",
        "body.light-mode .report-chapter b[style*=\"color:#ddd\"],html[data-theme=light] .report-chapter b[style*=\"color:#ddd\"]{color:#1e2633!important;}",
        "body.light-mode .report-chapter [style*=\"color:#ff8a80\"],html[data-theme=light] .report-chapter [style*=\"color:#ff8a80\"]{color:#b84a42!important;}",
        "body.light-mode .report-chapter [style*=\"color:#ffcc80\"],html[data-theme=light] .report-chapter [style*=\"color:#ffcc80\"]{color:#b87820!important;}",
        "body.light-mode .report-chapter [style*=\"color:rgba(255,120,120\"],html[data-theme=light] .report-chapter [style*=\"color:rgba(255,120,120\"]{color:#a63d32!important;}",
        "body.light-mode .report-chapter [style*=\"color:rgba(255,200,100\"],html[data-theme=light] .report-chapter [style*=\"color:rgba(255,200,100\"]{color:#9a6018!important;}",
        "body.light-mode .report-chapter [style*=\"background:rgba(255,255,255,0.04)\"],html[data-theme=light] .report-chapter [style*=\"background:rgba(255,255,255,0.04)\"]{background:rgba(122,90,34,0.05)!important;border:1px solid rgba(28,24,18,0.08)!important;}",
        "body.light-mode .report-chapter [style*=\"background:rgba(255,255,255,0.03)\"],html[data-theme=light] .report-chapter [style*=\"background:rgba(255,255,255,0.03)\"]{background:rgba(122,90,34,0.04)!important;border:1px solid rgba(28,24,18,0.07)!important;}"
    ].join('');
    document.head.appendChild(st);
}

function ensureSajuxPdfPrintForceStyles() {
    if (document.querySelector('link[href*="report-print.css"]')) return;
    if (document.getElementById('sajux-pdf-print-force') || document.getElementById('sajux-pdf-print-force-dynamic')) return;
    var st = document.createElement('style');
    st.id = 'sajux-pdf-print-force-dynamic';
    st.textContent = `/* =========================================
   [사주X PDF 인쇄 — 배경만 화이트닝, 오행 글자색 유지]
========================================= */
@media print {
  body, html {
    background: #ffffff !important;
    background-color: #ffffff !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    box-shadow: none !important;
  }

  /* 지장간, 십성 배지, 태그 — 배경만 */
  .jijanggan, .jijanggan span, .jijanggan div,
  .badge, .tag, .m-badge, .m-badge-shinsal, .m-badge--gongmang-hit,
  .highlight, [class*="badge"], [class*="tag"] {
    background: #ffffff !important;
    background-color: #ffffff !important;
    border: 1px solid #999999 !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* 카드·내부 박스 — 배경만 (글자색 건드리지 않음) */
  .card, .yearly-card, .monthly-card, .module-item,
  .inner-card, .detail-box, .content-box,
  .sajux-print-surface, .report-inner-box,
  .vip-evidence-block table,
  .manse-cell, .manse-table,
  [class*="box"]:not(.checkbox):not(.search-box),
  [class*="card"] {
    background: #ffffff !important;
    background-color: #ffffff !important;
    border: 1px solid #cccccc !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }

  /* report-core 인라인 반투명 박스 */
  #report-container div[style*="background:rgba(255,255,255"],
  #report-container div[style*="background:rgba(0,0,0"],
  #report-container div[style*="background:rgba(199,167,106"],
  #report-container div[style*="background:rgba(231,76,60"],
  .sajux-panel-plain, .deep-hook-panel, .premium-executive-summary,
  #sec-life-panorama, .sajux-gongmang-note {
    background: #ffffff !important;
    background-color: #ffffff !important;
    border: 1px solid #cccccc !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }

  .m-hanja, .vip-hanja, .report-pillar-hanja, .hanja-main {
    font-family: 'Noto Sans KR', sans-serif !important;
  }

  /* 오행 한자·천간지지 색상 보존 */
  .wood, .fire, .earth, .metal, .water,
  .m-hanja, .m-hanja.wood, .m-hanja.fire, .m-hanja.earth, .m-hanja.metal, .m-hanja.water,
  .rel-char span, [class*="han-"] {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* 단락 제목 고립 방지 */
  .section-title, .part-title, .part-header-label, .part-header-block,
  .report-chapter, .ch-title, h1, h2, h3, .title-card {
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    margin-bottom: 10px !important;
  }

  .report-container, #report-container, .print-container, .layout-wrapper,
  .seyun-premium-vertical, .part-header-block, .cover-page {
    display: block !important;
  }
  .manse-table { display: flex !important; flex-direction: column !important; gap: 4px !important; }
  .manse-row { display: grid !important; grid-template-columns: 60px repeat(4, 1fr) !important; gap: 4px !important; }
  .manse-cell { display: flex !important; flex-direction: column !important; align-items: center !important; }
  .part-header-block { page-break-before: auto !important; page-break-after: avoid !important; break-after: avoid !important; }
  .part-follow-content > *:first-child { page-break-before: avoid !important; break-before: avoid !important; }
  .yearly-indicators, .sajux-print-panel-inner, .daeun-decade-card, .seyun-year-card {
    background: #f7f7f7 !important; border-color: #cccccc !important;
  }
  .m-hangul, .yearly-ind-val, .vip-evidence-block td { color: #333333 !important; }

  table {
    border-collapse: collapse !important;
    width: 100% !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
  th, td {
    border: 1px solid #dee2e6 !important;
    padding: 10px !important;
    background-color: #ffffff !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .remedy-checklist-table,
  .remedy-checklist-table thead,
  .remedy-checklist-table tbody {
    display: table !important;
    width: 100% !important;
    border-collapse: collapse !important;
  }
  .remedy-checklist-table tr { display: table-row !important; }
  .remedy-checklist-table th,
  .remedy-checklist-table td {
    display: table-cell !important;
    vertical-align: top !important;
  }

  #floating-toc, #theme-toggle, #sticky-part-nav, #sajux-pdf-fab,
  .pdf-btn, .nav-floating, .sajux-pdf-wide-btn {
    display: none !important;
  }
  #sec-cover, .cover-page { background: #ffffff !important; }
  .cover-page .sajux-logo-cover-screen,
  .sajux-logo.dark { display: none !important; visibility: hidden !important; mix-blend-mode: normal !important; }
  .cover-page .sajux-logo-cover-print,
  .sajux-logo.light,
  .sajux-logo-cover-print {
    display: block !important;
    visibility: visible !important;
    mix-blend-mode: normal !important;
    opacity: 1 !important;
    filter: none !important;
    max-width: 520px !important;
    width: 72% !important;
    height: auto !important;
    margin: 0 auto 12px !important;
  }
  .sajux-logo-wrap img {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
`;
    document.body.appendChild(st);
}

/** 와이드 PDF 버튼 스타일 + 우하단 FAB (인쇄 시 숨김) */

function ensureCoverLogoForPrint() {
    if (window.__sajuxCoverPrintBound) return;
    window.__sajuxCoverPrintBound = true;
    function applyCoverLogo() {
        document.querySelectorAll('.sajux-logo-cover-screen, .cover-page .sajux-logo.dark').forEach(function (el) {
            el.style.setProperty('display', 'none', 'important');
        });
        document.querySelectorAll('.sajux-logo-cover-print, .cover-page .sajux-logo.light').forEach(function (el) {
            el.style.setProperty('display', 'block', 'important');
            el.style.setProperty('visibility', 'visible', 'important');
            el.style.setProperty('opacity', '1', 'important');
            el.style.setProperty('mix-blend-mode', 'normal', 'important');
        });
    }
    window.addEventListener('beforeprint', applyCoverLogo);
    if (window.matchMedia) {
        var mq = window.matchMedia('print');
        if (mq.addEventListener) mq.addEventListener('change', function (e) { if (e.matches) applyCoverLogo(); });
        else if (mq.addListener) mq.addListener(function (e) { if (e.matches) applyCoverLogo(); });
    }
}


function injectSajuxPdfUi() {
    if (!document.getElementById('sajux-report-ui-styles')) {
        var st = document.createElement('style');
        st.id = 'sajux-report-ui-styles';
        st.textContent = '.month-pillar-title{white-space:nowrap!important;display:inline-block!important;max-width:100%;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom;}.seyun-premium-vertical{display:flex!important;flex-direction:column!important;align-items:stretch!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;}.seyun-premium-vertical .seyun-year-card,.seyun-premium-vertical>div{width:100%!important;max-width:100%!important;box-sizing:border-box!important;flex:0 0 auto!important;}.yearly-card-container,.monthly-card-container{display:grid!important;grid-template-columns:1fr!important;width:100%!important;max-width:100%!important;gap:20px!important;box-sizing:border-box!important;}.yearly-card-container .fortune-scroll,.monthly-card-container .fortune-scroll{display:flex!important;flex-direction:column!important;overflow-x:visible!important;overflow-y:visible!important;scroll-snap-type:none!important;align-items:stretch!important;width:100%!important;max-width:100%!important;}.yearly-card-container .f-card,.monthly-card-container .f-card{flex:0 0 auto!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;}.vip-module-stack{display:flex;flex-direction:column;gap:0;}.vip-module-item{margin-bottom:16px;border-left:3px solid #d4af37;padding-left:14px;}.vip-module-title{color:#d4af37;font-weight:700;margin-bottom:6px;font-size:13.5px;font-family:Noto Sans KR,serif;}.vip-module-desc{color:#d8d3c9;line-height:1.88;font-size:13.5px;margin:0;}.yearly-ind-val{white-space:nowrap!important;text-overflow:ellipsis!important;overflow:hidden!important;max-width:100%!important;}.animal-symbol{font-size:15px;color:rgba(228,232,240,0.92);margin-top:10px;font-weight:500;line-height:1.55;}.cover-highlight{color:#d4af37;font-weight:700;}.birth-info{font-size:0.85em;color:#888;margin-top:8px;line-height:1.65;}.remedy-checklist-table{display:table!important;width:100%!important;border-collapse:collapse!important;table-layout:fixed!important;}.remedy-checklist-table thead{display:table-header-group!important;}.remedy-checklist-table tbody{display:table-row-group!important;}.remedy-checklist-table tr{display:table-row!important;}.remedy-checklist-table th,.remedy-checklist-table td{display:table-cell!important;vertical-align:top!important;}.badge,.tag,.jijanggan{background:rgba(128,128,128,0.08)!important;color:var(--text-primary)!important;border:none!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important;}.card,.yearly-card,.monthly-card,.module-item{background:rgba(var(--bg-rgb,128,128,128),0.06)!important;backdrop-filter:blur(22px)!important;-webkit-backdrop-filter:blur(22px)!important;border:none!important;}.sajux-pdf-wide-btn{cursor:pointer;box-sizing:border-box;border:none;font-family:inherit;font-weight:700;font-size:15px;padding:16px 22px;margin:16px 0 18px;border-radius:12px;background:linear-gradient(165deg,rgba(255,255,255,0.10),rgba(255,255,255,0.028))!important;color:rgba(245,240,232,0.94)!important;letter-spacing:0.02em;box-shadow:0 14px 44px rgba(0,0,0,0.38)!important;backdrop-filter:blur(26px) saturate(165%)!important;-webkit-backdrop-filter:blur(26px) saturate(165%)!important;width:100%;max-width:100%;transition:background .15s ease,color .15s ease;}.sajux-pdf-wide-btn:hover{background:linear-gradient(165deg,rgba(255,255,255,0.14),rgba(255,255,255,0.045))!important;}.sajux-pdf-wide-btn:active{transform:translateY(1px);}#sajux-pdf-fab{cursor:pointer;position:fixed;bottom:22px;right:18px;z-index:10001;font-family:inherit;font-weight:700;font-size:14px;padding:14px 20px;border-radius:999px;border:none;background:linear-gradient(165deg,rgba(255,255,255,0.11),rgba(255,255,255,0.028))!important;color:rgba(245,240,232,0.94)!important;box-shadow:0 14px 46px rgba(0,0,0,0.44)!important;backdrop-filter:blur(28px) saturate(168%)!important;-webkit-backdrop-filter:blur(28px) saturate(168%)!important;transition:background .15s ease;}#sajux-pdf-fab:hover{background:linear-gradient(165deg,rgba(255,255,255,0.15),rgba(255,255,255,0.045))!important;}@media(max-width:900px){#sajux-pdf-fab{bottom:calc(74px + env(safe-area-inset-bottom,0px));right:12px;padding:11px 16px;font-size:12px;z-index:10002}}';
        document.head.appendChild(st);
    }
    var oldFab = document.getElementById('sajux-pdf-fab');
    if (oldFab) oldFab.remove();
    var fab = document.createElement('button');
    fab.id = 'sajux-pdf-fab';
    fab.className = 'pdf-btn';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'PDF로 저장');
    fab.textContent = '🖨 PDF';
    fab.addEventListener('click', function () { window.print(); });
    document.body.appendChild(fab);
    try { ensureSajuxReadablePanelStyles(); ensureSajuxPdfPrintForceStyles(); ensureCoverLogoForPrint(); } catch (e) {}
}

function getDBText(category, key, fallback, data) {
    if(window.SAJU_DB && window.SAJU_DB[category] && window.SAJU_DB[category][key]) {
        let val = window.SAJU_DB[category][key];
        if(typeof val === 'object') {
            var t = val.core + " " + val.weapon;
            return data ? voicePolishParagraph(data, t) : t;
        }
        return data ? voicePolishParagraph(data, val) : val;
    }
    return fallback || "이 시기에는 잠재력을 발휘해야 합니다.";
}

function generateDeepReport(data) {
    if(!data || !data.dayStem) return;

    // 챕터 카운터 리셋 — 인사 중복 방지(첫 챕터에만 풀 인사)
    _sajuxChapterCount(true);

    function safeCall(fn, label) {
        try {
            var out = fn() || '';
            if (typeof out === 'string') {
                if (/\bundefined\b|undefined\)/.test(out)) {
                    out = out
                        .replace(/\bundefined\b/g, '')
                        .replace(/\(\s*\)/g, '')
                        .replace(/\s{2,}/g, ' ')
                        .replace(/>\s+</g, '><');
                }
                if (out.indexOf('undefined') !== -1) {
                    console.warn('generateDeepReport ' + label + ': stripped fragment with undefined');
                    return '';
                }
            }
            return out;
        }
        catch (e) {
            console.error('generateDeepReport ' + label + ':', e.message);
            return '';
        }
    }

    // ── 각 만세력 섹션 아래에 직접 주입 ──
    try { injectSectionInterpretations(data); } catch(e) { console.error('inject error:', e.message); }

    // ── 4부 구조 ──
    var html = '';

    // 인트로 구간 (커버·요약·목차)
    // ※ 이용 안내(법적·연령·보관 정책)·PDF 저장 버튼 등 유틸리티 컴포넌트는
    //   문서 최하단(buildReportFooterUtilities)으로 일괄 이동했습니다.
    //   인트로는 본문 몰입을 해치지 않도록 표지 → 고객 표지 → 목차 → 프리미엄 브리프 흐름만 유지합니다.
    html += safeCall(()=>buildCoverPage(data), 'cover');
    html += safeCall(()=>buildClientCoverPage(data), 'clientCover');
    html += safeCall(()=>buildTOC(data), 'toc');
    // ※ 프롤로그(buildPremiumExecutiveSummary)·5단계 인생 파노라마(buildLifePanoramaSection)는
    //   본문 1부의 buildPersonalPortrait(태어남~마지막 장면 통합 인생 스토리)로 흡수되었습니다.

    // ── 1부: 나라는 사람 ──
    var part1Body = '';
    // 손님 동선 (고객 의도 = "나는 어떤 사람인가"에 답하는 흐름):
    //   ① ★ 메인 인생 스토리 — 태어남부터 마지막 장면까지 한 흐름 (가장 큰 메인)
    //   ② 일주 프로필 — 한 줄 메타포·키워드 (보조 도입)
    //   ③ 만세력 안내 → 표 — 풀이의 근거 자료
    //   ④ 사주 기본 종합 풀이 — 보강
    //   ⑤·⑥ 오행·십성 — 참고 분석
    part1Body += safeCall(()=>buildPersonalPortrait(data)||'', 'personal-portrait');
    part1Body += safeCall(()=>buildIljuProfileCard(data)||'', 'ilju-card');
    part1Body += safeCall(()=>buildManseGuide(data)||'', 'manse-guide');
    part1Body += safeCall(()=>buildVipEvidenceBlock(data)||'', 'vip-evidence');
    part1Body += safeCall(()=>buildChapter1_Basic(data)||'', 'ch1-basic');
    part1Body += safeCall(()=>buildChapter2_Wuxing(data)||'', 'ch2-wuxing');
    part1Body += safeCall(()=>buildChapter3_Sipseong(data)||'', 'ch3-sip');
    html += safeCall(()=>wrapPartSection(
        buildPartHeader(1,'나라는 사람','원국 · 기질 · 타고난 패턴','sec-part1-narrative',{name:data.name}),
        part1Body
    ), 'part1section');

    // ── 2부: 지금 이 시절 ──
    //   ① 현재 대운/세운/월운 통합 카드 — 큰 제목「현재의 운세」가 먼저 보이도록 최상단
    //   ② 인생 80년 타임라인 (보조 도식 — 카드 다음)
    //   ③ 앞으로 올 대운 — 다음·그 다음 (각 200~300자)
    //   ④ 앞으로 올 세운 — 다음 해부터 10년 (각 200~300자)
    //   ⑤ 앞으로 올 월운 — 다음 달부터 11개월 (각 200~300자)
    //   ※ 옛 buildDaewunLoop / buildChapter8_NextDaewun / buildSewunLoop / buildChapter9_Monthly 는
    //     사용자 피드백("현재 대운/세운/월운은 디테일하게 한 카드로, 다음 시기들은 200~300자")에 따라
    //     buildCurrentPeriodCard + buildUpcoming{Daewun,Sewun,Wolun}Cards 로 교체되었습니다.
    var part2Body = '';
    part2Body += safeCall(()=>buildCurrentPeriodCard(data)||'', 'current-period-card');
    part2Body += safeCall(()=>buildDaeunTimeline(data)||'', 'daeun-timeline');
    // 앞으로의 운 도입(개념 설명) → 다가올 대운/세운/월운 카드
    part2Body += safeCall(()=>buildUpcomingFortuneIntro(data)||'', 'upcoming-intro');
    part2Body += safeCall(()=>buildUpcomingDaewunCards(data)||'', 'upcoming-daewun');
    part2Body += safeCall(()=>buildUpcomingSewunCards(data)||'', 'upcoming-sewun-10y');
    part2Body += safeCall(()=>buildUpcomingWolunCards(data)||'', 'upcoming-wolun-11m');
    html += safeCall(()=>wrapPartSection(
        buildPartHeader(2,'지금 이 시절','현재의 운세 · 앞으로의 운','sec-part2-now',{name:data.name}),
        part2Body
    ), 'part2section');

    // ── 3부: 삶의 영역 ──
    //   ① 애정(친구·애인·결혼·가정·자식)  ② 재물  ③ 합격(시험·취직·문서)
    //   ④ 직업(이직·사업·추천 직업)        ⑤ 건강(검진·정신건강·예방)
    var part3Body = '';
    part3Body += safeCall(()=>buildChapter6_Love(data)||'', 'ch6-love');
    part3Body += safeCall(()=>buildChapter4_Wealth(data)||'', 'ch4-wealth');
    part3Body += safeCall(()=>buildChapter_HapGyeok(data)||'', 'ch-hapgyeok');
    part3Body += safeCall(()=>buildChapter5_Career(data)||'', 'ch5-career');
    part3Body += safeCall(()=>buildChapter8_Health(data)||'', 'ch8-health');
    html += safeCall(()=>wrapPartSection(
        buildPartHeader(3,'삶의 영역','애정 · 재물 · 합격 · 직업 · 건강','sec-part3-life',{name:data.name}),
        part3Body
    ), 'part3section');

    // ── 4부: 지금부터의 선택 — 개운법 ──
    var part4Body = '';
    part4Body += safeCall(()=>buildChapter9_Remedy(data)||'', 'ch9-remedy');
    html += safeCall(()=>wrapPartSection(
        buildPartHeader(4,'지금부터의 선택','개운법 · 일상 적용','sec-part4-final',{name:data.name}),
        part4Body
    ), 'part4section');

    html += safeCall(()=>buildReviewCallout(data)||'', 'review-callout');

    // ── 본문 최종 안내: 이용 안내·열람 정책·면책 고지·PDF 저장 버튼 ──
    //   ※ 사용자 요청 흐름: 개운법 → 이용안내 → (서프라이즈) 자미두수
    html += safeCall(()=>buildReportFooterUtilities(data), 'footerUtilities');

    // ── 서프라이즈 인트로 + 부록: 자미두수 운명 청사진 (별도 학문) ──
    var ziweiBlock = safeCall(()=>buildZiWeiDestinyBlueprintSection(data)||'', 'ziwei');
    if (ziweiBlock) {
        html += safeCall(()=>buildZiweiSurpriseIntro(data)||'', 'ziwei-surprise-intro');
        html += '<div class="ziwei-appendix-block" style="margin-top:24px;padding-top:24px;border-top:1px dashed rgba(199,167,106,0.20);">'
              + '<div style="font-size:10px;letter-spacing:0.18em;color:rgba(199,167,106,0.65);margin-bottom:12px;font-weight:700;">[ 보너스 · 자미두수 별첨 ]</div>'
              + ziweiBlock
              + '</div>';
    }

    document.getElementById('report-container').innerHTML = html;

    try { injectSajuxPdfUi(); ensureCoverLogoForPrint(); } catch (e) { console.error('injectSajuxPdfUi', e.message); }

    // 기존 정적 만세력 섹션들 숨김 (report-container가 모든 내용을 포함하므로)
    var staticSecs = ['sec-manse','sec-relation','sec-shinsal','sec-wuxing',
        'sec-fortune','sec-yonghee','sec-daeun-graph','sec-lifecycle','sec-category','sec-legacy-inline-charts'];
    staticSecs.forEach(function(id){
        var el = document.getElementById(id);
        if(el) el.style.display = 'none';
    });

    // innerHTML 세팅 후 injectSection 한번 더 (DOM이 완성된 뒤)
    setTimeout(function(){ try { injectSectionInterpretations(data); } catch(e){} }, 50);
}

function injectSectionInterpretations(data) {
    function setEl(id, buildFn) {
        var el = document.getElementById(id);
        if(!el) return;
        try {
            var result = buildFn();
            if(result && result.trim()) {
                el.innerHTML = result;
                el.style.display = '';
            }
        } catch(e) {
            console.error('inject #'+id+':', e.message, e.stack);
            // 에러시 빈칸 유지 (숨기지 않음)
        }
    }
    // 1. 만세력 원국 아래
    setEl('manse-inline-summary', () => buildChapter1_Basic(data) + buildCurrentPeriodSummary(data) + buildMasterFullReading(data));
    // 2. 합충형파해 아래
    setEl('relation-inline-summary', () => buildRelationSummary(data));
    // 3. 신살 아래
    setEl('shinsal-inline-summary', () => buildShinsalSummary(data));
    // 4. 오행 아래
    setEl('wuxing-inline-summary', () => buildChapter2_Wuxing(data));
    // 5. 십성 아래
    setEl('sipseong-inline-summary', () => buildChapter3_Sipseong(data));
    // 6. 신강신약 아래
    setEl('strength-inline-summary', () => buildStrengthSummary(data));
    // 7. 용신/희신 아래 — 동적 풀이
    const OH_YG = {wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
    const yongKr = OH_YG[data.yong]||data.yong||'';
    const heeKr = OH_YG[data.hee]||data.hee||'';
    const giKr = OH_YG[data.gi]||data.gi||'';
    const gooKr = OH_YG[data.goo]||data.goo||'';
    const isStrongYG = (data.strengthText||'').includes('신강');
    const yongDetail = {
        wood: '목 기운을 메인으로 삼으면 성장 리듬이 살아납니다. 봄(2~4월), 갑·을년·갑·을 대운에 확장 신호가 강해집니다. 동쪽·초록·성장 업종이 길합니다. **간·담낭은 자정 전 취침**으로 먼저 지키십시오.',
        fire: '화 기운을 메인으로 삼으면 표현·노출이 살아납니다. 여름(5~7월), 병·정년·병·정 대운이 전성기 축입니다. 남쪽·붉은색·열정이 필요한 분야가 길합니다. **카페인은 점심 이후 끊으십시오.**',
        earth: '토 기운을 메인으로 삼으면 안정·정리가 살아납니다. 환절기(3·6·9·12월), 무·기년이 정비에 유리합니다. 중앙·황색·부동산·음식이 길합니다. **식사 시각만 고정**해도 흐름이 살아납니다.',
        metal: '금 기운을 메인으로 삼으면 결단·전문성이 살아납니다. 가을(8~10월), 경·신년·경·신 대운이 전성기 축입니다. 서쪽·흰색·법무·의료·정밀 직무가 길합니다. **돈·기간·분쟁이 크게 묶이는 계약(전세·근로·투자·가맹·연대보증 등)**은 감정이 오른 날 말고, 받은 날 곧바로 전자서명·날인하지 말고 **영업일 이틀만 비운 뒤** 같은 맥락으로 처리하십시오. 그 사이에는 조건·해지만 메모로 적어두면 됩니다. **소액 쇼핑·멤버십·일반 회원가입**은 여기 해당 없습니다.',
        water: '수 기운을 메인으로 삼으면 정보·회복이 살아납니다. 겨울(11~1월), 임·계년·임·계 대운이 전성기 축입니다. 북쪽·검정·물·무역·지식 산업이 길합니다. **물 2L와 수면 7시간**을 먼저 고정하십시오.'
    };
    setEl('yong-inline-summary', () => `<div class="inline-interp">
        <div class="ii-label">\u2756 나를 돕는 오행 vs 부담 오행</div>
        <div class="ii-title">생활에 붙일 에너지 축 — 전략의 핵심</div>
        <div class="ii-text">
            <p style="font-size:13.5px;color:#bbb;line-height:1.85;margin-bottom:16px;">아래 오행은 “운이 좋다/나쁘다”가 아니라 <strong>같은 하루도 어디에 힘을 줄지</strong>를 가르는 기준입니다. 바깥 기운이 바뀔 때마다 <strong>확장과 수비 중 하나만</strong> 먼저 고르십시오.</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
                <div style="background:rgba(199,167,106,0.08);border-radius:10px;padding:14px;border:1px solid var(--gold);">
                    <div style="font-size:11px;color:var(--gold);margin-bottom:6px;">✦ 수호 오행 — 메인으로 삼을 축</div>
                    <div style="font-size:18px;font-weight:800;color:var(--gold);">${yongKr}</div>
                    <p style="font-size:12px;color:#bbb;margin:8px 0 0;line-height:1.7;">${voicePolishParagraph(data, yongDetail[data.yong]||yongKr+' 기운을 생활·일정에 먼저 붙이십시오.')}</p>
                </div>
                <div style="background:rgba(74,158,106,0.08);border-radius:10px;padding:14px;border:1px solid rgba(74,158,106,0.4);">
                    <div style="font-size:11px;color:#4a9e6a;margin-bottom:6px;">✦ 보조 오행 — 함께 가져갈 축</div>
                    <div style="font-size:18px;font-weight:800;color:#4a9e6a;">${heeKr}</div>
                    <p style="font-size:12px;color:#bbb;margin:8px 0 0;line-height:1.7;">${heeKr} 기운이 붙는 시기에는 메인 축을 돕습니다. **보조는 한 가지**만 골라 집중하십시오.</p>
                </div>
                <div style="background:rgba(231,76,60,0.06);border-radius:10px;padding:14px;border:1px solid rgba(231,76,60,0.3);">
                    <div style="font-size:11px;color:#e74c3c;margin-bottom:6px;">⚠ 부담 오행 — 속도를 줄일 때</div>
                    <div style="font-size:18px;font-weight:800;color:#e74c3c;">${giKr}</div>
                    <p style="font-size:12px;color:#bbb;margin:8px 0 0;line-height:1.7;">${giKr} 기운이 두꺼운 시기에는 수비가 이깁니다. **큰 결정·투자는 유예**하십시오.</p>
                </div>
                <div style="background:rgba(255,152,0,0.05);border-radius:10px;padding:14px;border:1px solid rgba(255,152,0,0.3);">
                    <div style="font-size:11px;color:#ff9800;margin-bottom:6px;">⚠ 연쇄 부담 — 방어를 깎는 축</div>
                    <div style="font-size:18px;font-weight:800;color:#ff9800;">${gooKr}</div>
                    <p style="font-size:12px;color:#bbb;margin:8px 0 0;line-height:1.7;">${gooKr} 기운도 함께 오면 역풍이 거칩니다. **감정 약속은 줄이고 증빙만** 챙기십시오.</p>
                </div>
            </div>
            <div style="background:rgba(199,167,106,0.05);border-radius:10px;padding:14px 16px;border-left:3px solid var(--gold);">
                <div style="font-size:11px;color:var(--gold);margin-bottom:8px;">✦ 생활에 붙이는 순서</div>
                <p style="font-size:13px;color:#ddd;line-height:1.85;margin:0;">색·방위·동업 상대 선택에 메인 오행을 붙이십시오. **메인 오행이 실리는 대운·연도에만 큰 결정**을 실어 보내십시오.</p>
            </div>

        </div>
    </div>`);
    // 8. 인생 시기별 아래 → 재물+직업+애정
    setEl('lifecycle-inline-summary', () => buildChapter4_Wealth(data) + buildChapter5_Career(data) + buildChapter6_Love(data) + buildChapter8_Health(data));
}

function injectBelow(id, html_content) {
    const el = document.getElementById(id);
    if(el) { el.innerHTML = html_content; }
    else console.warn('injectBelow: #'+id+' not found');
}

function buildRelationSummary(data) {
    const interactions = data.interactions || [];
    const HAN_KOR_R = {'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계','子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    const toKrR = s => s ? [...s].map(c => HAN_KOR_R[c]||c).join('') : s;
    
    // 합충형파해 타입별 고객 개인화 설명 생성
    function getPersonalDesc(rel) {
        const chars = (rel.chars || []).filter(Boolean);
        let kr = chars.map(c => toKrR(c)).join('·');
        if(!kr || kr.includes('undefined')) kr = '해당';
        const type = rel.type || '합';
        const label = rel.label || '기본';
        function _rd(t) { return voicePolishParagraph(data, t); }
        
        if(type.includes('천간 합')) {
            return _rd(`원국에 ${kr} 천간 합(${label})이 있습니다. 끌림이 빠르게 붙습니다. 그건 낭만이 아니라 계약입니다. 기신을 키우는 합이면 집착·불필요한 동맹이 반복됩니다. **큰 약속은 서면으로 조건을 먼저** 적으십시오.`);
        }
        if(type.includes('지지 합')) {
            return _rd(`원국에 ${kr} 지지 합(${label})이 있습니다. 겉은 잔잔해도 안에서는 끌립니다. 용신 쪽이면 자산이, 기신 쪽이면 습관적 중독이 됩니다. **${chars[0]||''}·${chars[1]||''}가 놓인 궁**을 일지·직업축과 연결해 읽으십시오.`);
        }
        if(type.includes('지지 충')) {
            return _rd(`원국에 ${kr} 지지 충(${label})이 있습니다. 각도가 정면입니다. 이동·단절·갈등이 ‘사건’으로 터질 수 있습니다. 기신을 걷어내는 충이면 오히려 돌파구입니다. **충이 들어오는 해·달에는 일정 30%를 비워** 두십시오.`);
        }
        if(type.includes('지지 형')) {
            return _rd(`원국에 ${kr} 지지 형(${label})이 있습니다. 천천히 갉아먹는 마모입니다. 법·말·건강에서 누적형 사고가 납니다. **일지에 붙었다면 배우자·내 몸 축**을 우선 점검하십시오.`);
        }
        if(type.includes('방합') || type.includes('반합')) {
            return _rd(`원국에 ${kr} ${type}(${label})이 있습니다. 한 오행이 판을 집어삼킵니다. 용신 방향이면 특기, 기신 방향이면 전면전입니다. **그 오행과 같은 업·사람 밀도**를 의도적으로 조절하십시오.`);
        }
        // 기본 폴백
        return voicePolishParagraph(data, `${nmUi(data.name || '고객')} 원국에 ${kr} ${type}(${label}) 구조가 있습니다. 이 관계는 ${nmDnimEunNeun(data.name || '고객')} 살면서 반복적으로 경험하는 특정 패턴의 원형입니다. 이 에너지 구조를 이해하시면 비슷한 상황이 반복되는 이유와 변화가 일어나는 시기를 미리 파악하실 수 있습니다. 중요한 약속과 지출은 서면 조건을 먼저 확정하십시오.`);
    }
    
    if(!interactions || interactions.length === 0) {
        return voiceInlineInterpHeader('relation', data) + `<div class="inline-interp">
            <div class="ii-label">✦ 합·충·형·파·해 해석</div>
            <div class="ii-title">안정적인 원국 구조</div>
            <div class="ii-text">
                <p>${voicePolishParagraph(data, '겉으로 드러나는 합충형파해는 없습니다. 흔들림이 적은 판입니다. 그건 무미건조함이 아니라 **통제권이 당신에게 남는 구조**입니다.')}</p>
                <p style="margin-top:10px;color:#999;">합·충은 ‘운’이 아니라 반복 각도입니다. 없다고 아쉬워하지 마십시오. **한 달에 관계·돈 결정 한 번만** 크게 잡으십시오.</p>
            </div>
        </div>`;
    }
    
    const rows = interactions.map(rel => {
        const charsKr = (rel.chars||[]).map(c => (HAN_KOR_R[c]||c)).join('·');
        const desc = voicePolishReportHtml(data, getPersonalDesc(rel));
        const typeColor = rel.type&&rel.type.includes('충') ? '#ff8a80' : rel.type&&rel.type.includes('형') ? '#ffb74d' : rel.type&&rel.type.includes('합') ? '#80cbc4' : '#c7a76a';
        return `<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:14px 16px;margin-bottom:12px;border-left:3px solid ${typeColor};">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <span style="font-size:16px;font-weight:800;color:var(--gold);font-family:Noto Sans KR,serif;">${rel.chars?rel.chars.join('·'):''}</span>
                <span style="font-size:12px;color:#aaa;">(${charsKr})</span>
                <span style="font-size:11px;font-weight:700;color:${typeColor};padding:2px 8px;background:rgba(255,255,255,0.06);border-radius:10px;">${rel.label||rel.type||''}</span>
            </div>
            <p style="font-size:13px;color:#ccc;line-height:1.85;margin:0;">${desc}</p>
        </div>`;
    }).join('');
    
    return voiceInlineInterpHeader('relation', data) + `<div class="inline-interp">
        <div class="ii-label">❖ 합·충·형·파·해 해석</div>
        <div class="ii-title">원국의 충돌과 결합 — ${nmUi(data.name || '고객')} 삶의 반복 패턴</div>
        <div class="ii-text">
            ${rows}
            <p style="margin-top:12px;color:#999;font-size:13px;line-height:1.75;">합은 빨리 붙고, 충은 각도가 정면입니다. 둘 다 흉복이 아니라 **비용 구조**입니다. 합·충이 겹치는 해·달에는 계약 조항·인맥 거리를 먼저 정리하십시오.</p>
        </div>
    </div>`;
}

function buildShinsalSummary(data) {
    // allShinsal은 {시주:[...], 일주:[...], ...} 형태의 객체 — 배열로 펼침
    const raw = data.allShinsal || {};
    const shinsal = Array.isArray(raw) ? raw : Object.values(raw).reduce((acc, arr) => acc.concat(Array.isArray(arr) ? arr : []), []);
    const goodCats = ['길성'];
    if(!shinsal || shinsal.length === 0) {
        return voiceInlineInterpHeader('shinsal', data) + '<div class="inline-interp"><div class="ii-label">\u2756 신살\u00b7길성 분석</div><div class="ii-title">특별한 신살이 없는 순수한 원국</div><div class="ii-text"><p style="font-size:13.5px;color:#bbb;line-height:1.85;">' + voicePolishParagraph(data, nmUi(data.name || '고객') + ' 원국에는 특별한 신살이 검출되지 않았습니다. 신살이 없다는 것은 흉한 것이 아닙니다. 오히려 복잡한 에너지의 간섭 없이 일간의 본래 기질이 가장 맑고 순수하게 발현됩니다. ' + nmDnimEunNeun(data.name || '고객') + ' 삶은 특별한 충격이나 사건보다 꾸준함과 본인의 의지로 설계됩니다.') + '</p></div></div>';
    }
    const goodList = shinsal.filter(s => (window.SHINSAL_DESC?.[s]?.cat||'')=== '길성');
    const badList  = shinsal.filter(s => (window.SHINSAL_DESC?.[s]?.cat||'')=== '신살' || !(window.SHINSAL_DESC?.[s]?.cat) || window.SHINSAL_DESC?.[s]?.cat !== '길성');
    const personalTips = {
        '천을귀인':'당신의 사주에 천을귀인이 있습니다. 이는 평생 위기의 순간마다 귀인이 나타나 도움을 주는 구조입니다. 가장 막막한 순간에 의외의 사람이 결정적 도움을 줍니다. 귀인을 알아보는 눈을 키우십시오. 귀인은 대개 화려하지 않고 소박하게 나타납니다. 사람을 가볍게 여기지 말고 인연을 소중히 하는 삶이 이 길성을 최대한 활성화시킵니다.',
        '문곡귀인':'당신의 사주에 문곡귀인이 있습니다. 학문과 지식에서 남다른 재능이 있으며, 글쓰기·강의·컨설팅으로 사회적 인정과 재물을 얻을 수 있습니다. 자격증, 전문 지식, 저술 활동을 적극적으로 추진하십시오. 배움을 멈추지 않는 삶이 이 귀인을 평생 활성화시킵니다.',
        '역마살':'당신의 사주에 역마살이 있습니다. 한 곳에 오래 머물면 답답함을 느끼는 체질입니다. 이동, 출장, 해외, 여행이 삶에 끊임없이 따라옵니다. 억지로 한 곳에 묶어두면 오히려 더 큰 불운이 찾아옵니다. 이동과 변화를 직업으로 만드는 것이 최선의 전략입니다. 유통, 무역, 운송, 외교, 해외영업 분야가 특히 유리합니다.',
        '도화살':'당신의 사주에 도화살이 있습니다. 사람을 끌어당기는 자연스러운 매력이 있습니다. 이 에너지를 대인관계, 영업, 마케팅, 예술 분야에서 활용하면 천부적 재능이 됩니다. 매력을 비즈니스로 승화시키는 것이 현명한 전략입니다.',
        '화개살':'당신의 사주에 화개살이 있습니다. 예술, 종교, 철학, 영성에 깊은 관심이 있으며 창의적 분야에서 독보적 능력을 발휘합니다. 혼자 있는 시간을 사랑하며 고독 속에서 깊은 통찰이 나옵니다. 이 기운을 창작이나 정신적 성장에 쏟는 사람들이 가장 큰 성취를 이룹니다.',
        '천살':'당신의 사주에 천살이 있습니다. 예측 불가한 사건이 삶에 반복적으로 찾아옵니다. 그러나 준비된 자에게 천살은 오히려 더 큰 도약의 계기가 됩니다. 보험, 비상자금, 위기 대응 계획을 평소에 철저히 갖춰두십시오.',
        '백호대살':'당신의 사주에 백호대살이 있습니다. 강렬하고 급격한 사건 에너지입니다. 군인, 경찰, 외과의사, 소방관, 스포츠 선수 등 강인함이 요구되는 분야에서 탁월한 능력을 발휘하는 경우가 많습니다. 이 에너지를 사회적으로 인정받는 방향으로 분출하는 것이 핵심 포인트입니다.',
        '홍염살':'당신의 사주에 홍염살이 있습니다. 이성에게 매력적으로 보이는 강렬한 기운입니다. 연애 인연이 활발하지만 감정의 파도가 크게 휘몰아칩니다. 감정과 이성의 균형이 이 기운을 다스리는 열쇠입니다.',
        '천의성':'당신의 사주에 천의성이 있습니다. 의료, 치료, 상담, 구호 분야에서 천부적 재능을 발휘합니다. 이 방향으로 커리어를 설계하면 사회적 인정과 재물이 자연스럽게 따라옵니다.',
        '학당귀인':'당신의 사주에 학당귀인이 있습니다. 배움과 자기계발로 성취를 이루는 구조입니다. 평생 학습하는 자세가 당신의 가장 큰 경쟁력입니다. 자격증, 학위, 전문 교육이 직접적으로 삶의 수준을 높여줍니다.',
        '망신살':'당신의 사주에 망신살이 있습니다. 예기치 않은 망신, 실수, 구설이 반복될 수 있는 에너지입니다. 말과 행동을 신중히 하고 중요한 일에서는 한 번 더 확인하는 습관이 이 기운을 다스립니다.',
        '겁살':'당신의 사주에 겁살이 있습니다. 갑작스러운 손재수, 도난, 사기, 외부 충격이 반복됩니다. 재물 관리에 특히 신중하고, 보증이나 투자에서 충동적 결정을 피하십시오.',
    };
    const rows = shinsal.map(s => {
        const info = window.SHINSAL_DESC?.[s] || {cat:'신살', color:'#aaa', short:s, detail:''};
        const catColor = goodCats.includes(info.cat) ? '#c7a76a' : info.color || '#e74c3c';
        const isGood = goodCats.includes(info.cat);
        const personalTip = voicePolishParagraph(data, personalTips[s] || '');
        const baseDetail = info.detail || '';
        return `<div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:16px 18px;margin-bottom:14px;border-left:3px solid ${catColor};">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
                <span style="font-size:17px;font-weight:800;color:${catColor};">${s}</span>
                <span style="font-size:11px;background:rgba(255,255,255,0.07);color:${catColor};padding:2px 10px;border-radius:10px;">${isGood ? '\u2756 길성' : '\u26a0 신살'}</span>
                <span style="font-size:12px;color:#777;">${info.short||''}</span>
            </div>
            ${baseDetail ? `<p style="font-size:13.5px;color:#ccc;line-height:1.85;margin:0 0 10px;">${voicePolishParagraph(data, baseDetail)}</p>` : ''}
            ${personalTip ? `<div style="background:rgba(199,167,106,0.06);border-radius:8px;padding:12px 14px;border-left:2px solid ${catColor};"><p style="font-size:13.5px;color:#bbb;line-height:1.85;margin:0;">${personalTip}</p></div>` : ''}
        </div>`;
    }).join('');
    return voiceInlineInterpHeader('shinsal', data) + `<div class="inline-interp">
        <div class="ii-label">\u2756 신살 \u00b7 길성 상세 분석</div>
        <div class="ii-title">${nmUi(data.name || '고객')} 사주에 새겨진 특별한 에너지 코드 \u2014 총 ${shinsal.length}개</div>
        <div class="ii-text">
            <p style="font-size:13.5px;color:#bbb;line-height:1.85;margin-bottom:16px;">신살은 낙인이 아니라 **반복되는 각도의 이름**입니다. 길성은 무기, 신살은 훈련장입니다. 흉살도 통제하면 레버가 됩니다.</p>
            ${goodList.length > 0 ? `<div style="margin-bottom:10px;padding:12px 16px;background:rgba(199,167,106,0.07);border-radius:10px;border-left:3px solid var(--gold);"><div style="font-size:12px;color:var(--gold);margin-bottom:6px;">\u2756 길성 ${goodList.length}개 \u2014 선천적으로 타고난 무기</div><div style="font-size:14px;color:#ddd;font-weight:700;">${goodList.join(' \u00b7 ')}</div></div>` : ''}
            ${badList.length > 0 ? `<div style="margin-bottom:16px;padding:12px 16px;background:rgba(231,76,60,0.06);border-radius:10px;border-left:3px solid #e74c3c;"><div style="font-size:12px;color:#e74c3c;margin-bottom:6px;">\u26a0 신살 ${badList.length}개 \u2014 삶을 단련시키는 도전의 코드</div><div style="font-size:14px;color:#ddd;font-weight:700;">${badList.join(' \u00b7 ')}</div></div>` : ''}
            ${rows}
        </div>
    </div>`;
}

function buildStrengthSummary(data) {
    const isStrong = (data.strengthText||'').includes('신강') || (data.strengthText||'').includes('강');
    const yong = data.yong || 'metal';
    const gi = data.gi || 'wood';
    const OH = {wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
    const title = isStrong ? '신강 \u2014 넘치는 에너지, 주도적 인생 설계자' : '신약 \u2014 협력과 귀인으로 폭발하는 시너지형';
    const coreText = voicePolishParagraph(data, isStrong ? '기운이 충만한 신강 사주에 가깝습니다. 일간이 먼저 서 있어, 남의 지시 아래에서는 절반도 못 씁니다. 그건 거만함이 아니라 구조입니다. **자율이 보장된 자리에서만** 폭발합니다. 함정은 독단과 마찰입니다. 에너지를 사회적으로 인정받는 방향으로만 쏟으십시오.' : '에너지가 분산된 신약 사주에 가깝습니다. 혼자 짊어지다 지친 적이 있었을 수 있습니다. 그건 나약함이 아니라, 연결로 배가 되는 구조입니다. **용신 오행을 일간으로 둔 사람**을 파트너 후보에 넣으십시오.');
    const stratText = voicePolishParagraph(data, isStrong
        ? `\u2756 신강 핵심: 기신(${OH[gi]||gi})이 두꺼운 대운·세운에서는 **인간관계·수면을 먼저** 고정하십시오. 용신(${OH[yong]||yong}) 구간에서는 확장하되, 팀 없이 독주하지 마십시오.`
        : `\u2756 신약 핵심: 용신(${OH[yong]||yong}) 기운을 가진 귀인·환경을 가까이 두십시오. 조직·파트너와 함께일 때 결과가 더 크고 안정적입니다. **혼자 밀어붙이는 날짜를 달력에서 지우십시오.**`);
    return voiceInlineInterpHeader('strength', data) + `<div class="inline-interp">
        <div class="ii-label">\u2756 신강·신약 해석</div>
        <div class="ii-title">${title}</div>
        <div class="ii-text">
            <p style="font-size:13.5px;color:#bbb;line-height:1.9;margin-bottom:14px;">${coreText}</p>
            <div style="background:rgba(199,167,106,0.07);border-radius:10px;padding:14px 16px;border-left:3px solid var(--gold);">
                <p style="font-size:13px;color:#ddd;line-height:1.85;margin:0;">${stratText}</p>
            </div>
        </div>
    </div>`;
}

function injectInlineSummaries(data) {
    var manseInline = document.getElementById('manse-inline-summary');
    if (manseInline && data.dayStem && data.dayBranch) {
        manseInline.innerHTML = buildInlineIljuSummaryHtml(data);
        manseInline.style.display = 'block';
    }
    var wuxingInline = document.getElementById('wuxing-inline-summary');
    if (wuxingInline && data.wuxing) {
        var wxHtml = buildInlineWuxingSummaryHtml(data);
        if (wxHtml) {
            wuxingInline.innerHTML = wxHtml;
            wuxingInline.style.display = 'block';
        }
    }
    var strengthInline = document.getElementById('strength-inline-summary');
    if (strengthInline && data.strengthText) {
        strengthInline.innerHTML = buildInlineStrengthSummaryHtml(data);
        strengthInline.style.display = 'block';
    }
}
function buildSectionHeader(title) {
    return `<div style="margin: 60px 0 30px 0; padding-bottom: 15px; border-bottom: 2px solid var(--gold);">
            <h2 style="color: var(--gold); font-size: 24px; font-family: 'Noto Sans KR', sans-serif; letter-spacing: 2px;">${title}</h2>
        </div>`;
}


// ─── 현재 대운 + 올해 세운 + 이달 월운 요약 ───
function buildCurrentPeriodSummary(data) {
    const daeunRows = data.daeunRows || [];
    const aIdx = data.activeDaeunIdx || 0;
    const curDaeun = daeunRows[aIdx];
    const OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    const JO = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    const KN = {wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
    const sc = {wood:0,fire:0,earth:0,metal:0,water:0}; if(data.yong) sc[data.yong]+=2; if(data.hee) sc[data.hee]+=1; if(data.gi) sc[data.gi]-=2; if(data.goo) sc[data.goo]-=1;
    function gs(g,j){return (sc[OH[g]]||0)+(sc[JO[j]]||0);}
    function gc(s){return s>=3?'#c7a76a':s>=1?'#00C853':s===0?'#888':s>=-2?'#ff9800':'#e74c3c';}
    function gb(s){return s>=3?'🌟 대길':s>=1?'✦ 길':s===0?'— 평':s>=-2?'⚠ 주의':'❌ 흉';}

    // 현재 대운
    let daeunHtml = '';
    if(curDaeun) {
        const dg = curDaeun.gz ? curDaeun.gz[0] : (curDaeun.gan||'');
        const dj = curDaeun.gz ? curDaeun.gz[1] : (curDaeun.ji||'');
        const ds = gs(dg,dj);
        const dcol = gc(ds);
        const dOh = OH[dg]||'earth'; const djOh = JO[dj]||'earth';
        const dStrat = ds>=2
            ?`혼자서도 앞서가느라 숨이 찼을 수 있습니다. 그건 욕심이 아니라, 원국에 필요한 기운이 이 10년 대운에서 실려 오는 탓에 가깝습니다. <strong>한 번에 올인하지 말고 분할 실행만 허가하십시오.</strong>

💰 재물 — 새로 벌 통로(부업·거래·투자)를 열 때는 **①최대로 쓸 금액 ②돌려받을 날 ③중간에 멈출 때 조건** 세 줄을 종이에 적은 뒤에만 시작하십시오.

💼 직업 — 일이 늘어날수록 **맡은 일 범위와 보고 순서**를 메일 한 통으로만 고정하십시오. 속도보다 방향이 맞을수록 상승 구간이 깁니다.

❤️ 애정 — 인연의 문이 넓어질수록 <strong>첫 달 속도 제한(주 2회 만남)</strong>을 스스로 걸면 밀도가 살아납니다.

🏥 건강 — 성과와 함께 과부하가 옵니다. <strong>수면 착상 시각</strong>만 고정해도 다음 10년 체력 저축이 됩니다.`
            :ds>=0
            ?`겉으로는 조용해 보여도, 실력·자산·신뢰가 쌓이는 해에 가깝습니다. 드라마가 없다고 해서 멈춘 것이 아닙니다. <strong>이번 10년은 ‘증명’보다 ‘누적’이 이깁니다.</strong>

💰 재물 — **통장에서 매달 나가는 줄**과 **들어오는 줄**만 주말에 한 번 맞추어 보십시오. 크게 불리기보다 새는 구멍을 막는 쪽이 이깁니다.

💼 직업 — 화려한 이동보다 <strong>완성된 결과물 한 건</strong>이 다음 기회의 단가를 올립니다.

❤️ 애정 — 새 자극보다 <strong>대화 한 번의 질</strong>을 올리면 갈등 비용이 줄고 신뢰가 쌓입니다.

🏥 건강 — 규칙 루틴이 성과를 좌우합니다. <strong>기상·취침 시각만</strong> 고정해도 체력 바닥이 올라갑니다.`
            :`말 한마디에 책임이 몰려 억울한 밤이 있었을 수 있습니다. 그건 당신이 약해서가 아니라, 기신(나를 지치게 하는 기운)·구신(기신을 돕는 기운) 압력이 이 10년에 두껍게 깔린 탓에 가깝습니다. <strong>공격보다 손실 관리가 결과를 지킵니다.</strong>

💰 재물 — 큰 돈 나가는 투자·보증·월 고정비 늘리기는 잠시 멈추십시오. **비상금으로 쓸 생활비 몇 달 치**만 숫자로 적어 두십시오.

💼 직업 — 급격한 변화보다 기반을 지키며 실력을 축적하는 전략이 유리합니다. 갈등 비용을 줄이고 신뢰 자산을 쌓는 데 <strong>집중하십시오</strong>.

❤️ 애정 — 관계를 ‘결정’보다 ‘관리’ 관점으로 보면 손상을 줄일 수 있습니다. 감정이 올라올수록 <strong>결론은 이틀 늦추십시오</strong>.

🏥 건강 — 누적 피로가 커지기 쉬운 시기입니다. 정기 점검·수면·회복 루틴을 우선순위에 두면 다음 상승 구간 진입이 수월해집니다.`;
        const _dAge = parseInt(curDaeun.age)||0;
        const _by = data.birthYear || new Date(data.birthDate||'1988-01-01').getFullYear();
        const _dStartY = _by + _dAge - 1;
        const _dEndY = _dStartY + 9;
        daeunHtml = `<div style="margin-bottom:12px;padding:14px;background:rgba(199,167,106,0.06);border:1px solid var(--gold);border-radius:10px;">
            <div style="font-size:11px;color:var(--gold);font-weight:700;margin-bottom:8px;letter-spacing:1px;">▶ 현재 대운 — ${curDaeun.age}세~${curDaeun.age+9}세 · 지금 진행 중인 10년 운세</div>
            <div style="font-size:18px;font-weight:900;color:var(--gold);font-family:Noto Sans KR,serif;margin-bottom:6px;"><span style="font-family:Noto Sans KR,serif;">${formatGanzhiPair(dg, dj)}</span> <span style="font-size:13px;color:#bbb;font-weight:400;">${KN[dOh]||''}·${KN[djOh]||''}</span></div>
            <p style="font-size:13px;color:#ddd;line-height:1.8;margin:0 0 8px;">${voicePolishParagraph(data, dStrat)}</p>
            <span style="font-size:12px;font-weight:700;color:${dcol};">${gb(ds)}</span>
        </div>`;
    }

    // 올해 세운
    let sewunHtml = '';
    try {
        const curY = new Date().getFullYear();
        const yL = Solar.fromYmd(curY,6,15).getLunar();
        const gz = yL.getEightChar().getYear();
        const sg = gz[0]; const sj = gz[1];
        const ss = gs(sg,sj); const scol = gc(ss);
        const sOh = OH[sg]||'earth'; const sjOh = JO[sj]||'earth';
        const curDGan = curDaeun ? (curDaeun.gz ? curDaeun.gz[0] : curDaeun.gan||'') : '';
        const curDJi  = curDaeun ? (curDaeun.gz ? curDaeun.gz[1] : curDaeun.ji||'') : '';
        const daeunCtx = curDGan ? ('현재 ' + formatGanzhiPair(curDGan, curDJi) + ' 대운') : '현재 대운';
        const sAdv = ss>=2
            ?`올해 ${curY}년, 잠을 줄이며 기회를 붙잡으려 했을 수 있습니다. ${daeunCtx}과 올해 세운이 원국을 돕는 구조에 가깝습니다. <strong>오래 미뤄온 결정이 있다면 올해 안에 실행하되, 한 번에 올인은 금지하십시오.</strong>

💰 올해 재물운 — 부업·큰 지출·새 계약을 열 때는 **①최대 금액 ②끝낼 날 ③그만둘 때 조건**을 적은 뒤에만 움직이십시오. 번 것을 지키는 것이 전략입니다.

💼 올해 직업운 — 승진 요구·이직·창업 중 하나는 <strong>이메일로 범위를 고정한 뒤</strong> 진행하십시오. 구두 약속만으로는 손대지 마십시오.

❤️ 올해 애정운 — 인연이 빨라질수록 <strong>첫 달에는 돈·지분 이야기를 열지 마십시오.</strong> 관계만으로 두 번 만난 뒤에 이야기하십시오.

🏥 올해 건강운 — 활력과 과부하가 동시에 옵니다. <strong>동시에 세 가지 이상은 추진하지 마십시오.</strong> 수면 착상 시각만 고정해도 번아웃이 줄어듭니다.`
            :ss>=0
            ?`올해 ${curY}년, 큰 드라마보다 잔잔한 누적이 쌓이는 해입니다. ${daeunCtx}의 에너지와 세운이 크게 부딪치지 않습니다. <strong>이 해는 속도보다 리듬이 이깁니다.</strong>

💰 올해 재물운 — **매달 자동으로 나가는 돈** 목록만 줄이고, 통장에 **같은 요일·같은 금액**으로 들어가는 저축 한 줄만 만드십시오. 한 번에 크게 불리려 하지 마십시오.

💼 올해 직업운 — 화려한 이동보다 <strong>끝낸 프로젝트 한 건</strong>을 증거로 남기십시오. 자격·교육은 하나만 끝까지 완주하십시오.

❤️ 올해 애정운 — 새 인연보다 <strong>기존 관계의 약속 이행</strong>을 먼저 채우십시오. 말보다 **실제로 이행한 약속**이 신뢰를 만듭니다.

🏥 올해 건강운 — 평온할수록 작은 신호를 놓치기 쉽습니다. <strong>정기 검진 한 번·수면 시각 고정</strong>만 해도 충분합니다.`
            :`올해 ${curY}년, 속으로는 여러 번 무너졌을 수 있으나, 겉으로는 조용히 버티셨을 것입니다. ${daeunCtx}의 에너지와 세운이 기신을 자극하는 해입니다. <strong>당신의 잘못이 아닙니다.</strong> 이 해를 어떻게 보내느냐가 다음 상승기의 크기를 고릅니다.

💰 올해 재물운 — 신규 투자·보증·**금액·기간이 크게 묶이는 고정비 계약**은, 감정이 가라앉은 뒤 **영업일 이틀**을 비운 다음 **법적 효력이 붙는 서류·전자계약에만** 서명·송금하십시오. (일상 소액 결제·앱 체크아웃은 해당 없습니다.) 비상자금 비율을 숫자로 먼저 적으십시오.

💼 올해 직업운 — 불필요한 갈등에 끼어들지 마십시오. <strong>이직·창업 서류는 내년으로 미루고</strong>, 올해는 맡은 일의 범위를 이메일로만 좁히십시오.

❤️ 올해 애정운 — 오해가 생기기 쉽습니다. <strong>결혼·이별 결정은 최소 한 달 유예</strong>하십시오. 그동안은 문자보다 통화 한 번으로만 정리하십시오.

🏥 올해 건강운 — 쌓인 피로가 나중에 터질 수 있습니다. <strong>수면 7시간·음주 주 2회 이하·밤 11시 이후 근무 중단</strong>을 마지노선으로 삼으십시오.`;
        // 현재 대운과 세운의 교차 설명 추가
        // curDGan, curDJi는 sAdv에서 이미 선언됨
        const crossText = '';  // 교차 설명은 sAdv에 통합됨
        sewunHtml = `<div style="margin-bottom:12px;padding:14px;background:rgba(74,158,106,0.05);border:1px solid rgba(74,158,106,0.3);border-radius:10px;">
            <div style="font-size:11px;color:#4a9e6a;font-weight:700;margin-bottom:8px;letter-spacing:1px;">▶ ${formatYearWithGanzhi(curY, sg, sj)} 세운 · 지금 현재의 연운</div>
            <div style="font-size:17px;font-weight:900;color:#4a9e6a;font-family:Noto Sans KR,serif;margin-bottom:6px;"><span style="font-family:Noto Sans KR,serif;">${formatGanzhiPair(sg, sj)}</span> <span style="font-size:13px;color:#bbb;font-weight:400;">${KN[sOh]||''}·${KN[sjOh]||''}</span></div>
            ${crossText ? `<p style="font-size:12.5px;color:#aaa;line-height:1.75;margin:0 0 8px;border-left:2px solid #4a9e6a;padding-left:10px;">${crossText}</p>` : ''}
            <p style="font-size:13px;color:#ddd;line-height:1.8;margin:0 0 8px;">${voicePolishParagraph(data, sAdv)}</p>
            <span style="font-size:12px;font-weight:700;color:${scol};">${gb(ss)}</span>
        </div>`;
    } catch(e) {}

    // 이달 월운
    let wolunHtml = '';
    try {
        const curY2 = new Date().getFullYear();
        const curM2 = new Date().getMonth()+1;
        const mS = Solar.fromYmd(curY2,curM2,15);
        const gz2 = mS.getLunar().getEightChar().getMonth();
        const mg = gz2[0]; const mj = gz2[1];
        const ms = gs(mg,mj); const mcol = gc(ms);
        const mOh = OH[mg]||'earth'; const mjOh = JO[mj]||'earth';
        const WL = {
            '寅':'인월(봄의 문이 열리는 달)입니다. 새로운 시작, 인맥 확장, 대담한 첫걸음에 최적인 달입니다. 오래 망설이던 일의 첫 번째 실행을 이달에 하십시오.',
            '卯':'묘월(봄이 절정에 달하는 달)입니다. 성장과 협업의 기운이 강합니다. 파트너십, 공동 작업, 네트워킹이 이달 가장 큰 성과를 냅니다.',
            '辰':'진월(변화와 전환의 달)입니다. 예상치 못한 변수가 생기기 쉬운 달이지만, 유연하게 대응하면 오히려 더 좋은 방향으로 흐릅니다. 고집을 내려놓고 흐름을 따르십시오.',
            '巳':'사월(결단의 달)입니다. 오래 미뤄온 결정을 이달에 실행하십시오. 뱀이 허물을 벗듯 낡은 것을 과감히 버리고 새로운 방향으로 전환하는 달입니다.',
            '午':'오월(한여름 태양의 달)입니다. 활력과 추진력이 최고조에 달합니다. 적극적인 대외 활동, 발표, 협상에 최적입니다. 이달만큼은 적극적으로 나서십시오.',
            '未':'미월(관계와 감성의 달)입니다. 사람과의 연결에 집중하십시오. 인간관계에서 오는 기회가 이달 가장 큽니다. 따뜻한 배려와 진심 어린 소통이 문을 엽니다.',
            '申':'신월(실행력과 기민함의 달)입니다. 빠른 판단과 즉각적인 실행이 성과를 만드는 달입니다. 지체하면 기회가 달아납니다. 결정했으면 즉시 행동으로 옮기십시오.',
            '酉':'유월(마무리와 클로징의 달)입니다. 진행 중인 일들을 완성도 있게 마무리하십시오. 시작보다 마무리에 집중하는 달입니다. 완성된 결과물이 이달의 가장 큰 성과입니다.',
            '戌':'술월(정리와 통찰의 달)입니다. 불필요한 것들을 과감히 정리하십시오. 관계, 업무, 지출 — 핵심만 남기고 나머지를 쳐내는 달입니다. 깊은 성찰이 다음 도약을 만듭니다.',
            '亥':'해월(내공을 쌓는 달)입니다. 외부 활동보다 내면 성장에 집중하십시오. 학습, 연구, 계획 수립에 최적입니다. 조용히 준비한 것이 다음 달부터 폭발적으로 발현됩니다.',
            '子':'자월(지혜와 집중의 달)입니다. 혼자 깊이 생각하고 분석하는 능력이 최고조에 달합니다. 전략 수립, 자료 분석, 중요한 의사결정에 최적입니다.',
            '丑':'축월(인내와 저력의 달)입니다. 눈에 보이는 성과보다 보이지 않는 기반이 쌓이는 달입니다. 느리더라도 흔들리지 말고 꾸준히 나아가십시오. 봄이 오기 전 마지막 준비의 달입니다.'
        };
        const mAdv = ms>=2
            ?`이달은 기운이 앞으로 밀려오는 달입니다. 망설였던 첫 실행을 붙잡기엔 좋습니다. <strong>【중요 결정·협상·첫 실행은 이번 주 안에 하나의 고정 슬롯으로만】</strong> 묶으십시오. 감정으로 열린 약속은 다음 달로 미루십시오.`
            :ms>=0
            ?`평온하게 흐르는 달입니다. 새 도전보다 <strong>【진행 중인 일 한 건의 마감】</strong>에만 집중하십시오. 루틴을 깨는 일정 추가는 하지 마십시오.`
            :`주의가 필요한 달입니다. 큰 결정은 <strong>【영업일 이틀 유예】</strong>하십시오. 다툼·충동 지출·야간 문자는 이번 달 금지입니다. 내공은 수면으로만 쌓으십시오.`;
        wolunHtml = `<div style="padding:14px;background:rgba(74,114,198,0.05);border:1px solid rgba(74,114,198,0.3);border-radius:10px;">
            <div style="font-size:11px;color:#5b7fc4;font-weight:700;margin-bottom:8px;letter-spacing:1px;">▶ ${curY2}년 ${formatMonthWithGanzhi(curM2, mg, mj)} · 지금 이 달의 기운</div>
            <div style="font-size:16px;font-weight:900;color:#5b7fc4;font-family:Noto Sans KR,serif;margin-bottom:6px;"><span style="font-family:Noto Sans KR,serif;">${formatGanzhiPair(mg, mj)}</span> <span style="font-size:13px;color:#bbb;font-weight:400;">${KN[mOh]||''}·${KN[mjOh]||''}</span></div>
            <p style="font-size:13px;color:#ddd;line-height:1.8;margin:0 0 6px;">${WL[mj]||'이달의 기운입니다.'}</p>
            <p style="font-size:12.5px;color:#bbb;line-height:1.75;margin:0 0 8px;">${boldStarsToStrong(voicePolishParagraph(data, mAdv))}</p>
            <span style="font-size:12px;font-weight:700;color:${mcol};">${gb(ms)}</span>
        </div>`;
    } catch(e) {}

    if(!daeunHtml && !sewunHtml && !wolunHtml) return '';
    const nowDate = new Date();
    const nowY = nowDate.getFullYear();
    const nowM = nowDate.getMonth()+1;
    const nowD = nowDate.getDate();
    var chHeadCur = buildChapterHeadMainSub('현재의 운세', '대운 · 세운 · 월운 그리고 다섯 영역');
    var chIntroCur = buildChapterIntroHtml(data, 'current');
    return `<div class="report-chapter" style="border:2px solid var(--gold);border-radius:14px;padding:20px;background:rgba(199,167,106,0.04);">
        <div style="font-size:11px;color:var(--gold);letter-spacing:2px;margin-bottom:6px;">★ 지금 이 순간 — ${nowY}년 ${nowM}월 ${nowD}일 기준</div>
        ${chHeadCur}
        ${chIntroCur}
        <p class="ch-text">대운은 10년 기후, 세운은 한 해의 날씨, 월운은 이달의 날씨입니다. ${nowY}년 ${nowM}월 지금 이 순간, 숫자와 사람 약속이 겹치는 주만 메모해 두셔도 충분합니다.</p>
        ${daeunHtml}${sewunHtml}${wolunHtml}
    </div>`;
}


// ─── 대가 수준 전체 깊이 풀이 (원국 아래 종합연) — 톤: 멘토 3단·합쇼체 ───
function buildMasterFullReading(data) {
    const nm = data.name || '고객';
    const ds = data.dayStem||'병';
    const isStrong = (data.strengthText||'').includes('신강')||(data.strengthText||'').includes('강');
    const sip = data.sipseong||{};
    const hasGwan = (sip['정관']||0)+(sip['편관']||0) > 0;
    const hasJae = (sip['정재']||0)+(sip['편재']||0) > 0;
    const OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    const dayOh = OH[ds]||'fire';

    const CHAR_MAP = {
        wood: `${nm}님께는 앞장서 길을 여는 본능이 있습니다. 그 과정에서 주변과 부딪치며 외로웠을 수 있으나, 그건 오만함이 아니라 목(木) 기운이 길을 여는 방식입니다. <strong>당신의 앞서감은 틀리지 않았습니다.</strong> 이제는 멈출 때의 공백을 두려워하지 마십시오. 다음 목표 한 가지만 메모에 적고, 쉬는 날은 의도적으로 비우십시오.`,
        fire: `${nm}님께는 들어오는 순간 분위기를 살리는 열기가 있습니다. 젊은 시절에는 그 불덩이를 다루지 못해 기복이 컸을 수 있으나, 그건 결함이 아니라 추진력의 부작용에 가깝습니다. <strong>불을 끄라는 말이 아니라, 화로에 테두리를 두라는 말입니다.</strong> 사람 사이에서 에너지를 쓰되, 밤에는 말을 줄이고 수면 시각만 고정하십시오.`,
        earth: `${nm}님께는 겉으로 흔들려 보여도 중심을 붙잡는 묵직함이 있습니다. 다만 “조금만 더 확실해지면” 하다 타이밍을 놓친 적이 있었을 수 있습니다. <strong>100%를 기다리면 기회는 남의 손에 갑니다.</strong> 70%에서 한 번 밀어붙이는 연습을 하십시오. 느리지만 끝까지 가는 밀도가 결국 크게 먹힙니다.`,
        metal: `${nm}님께는 소음을 걷어내고 핵만 집어오는 눈이 있습니다. 그 절제가 ‘차갑다’는 오해로 돌아온 적이 있었을 수 있으나, 그건 냉정함이 아니라 낭비를 줄이려는 본능입니다. <strong>원칙을 세우는 것과 사람을 밀어내는 것은 다릅니다.</strong> 말 한 줄 앞에 “이유” 한 문장을 붙이십시오.`,
        water: `${nm}님께는 남보다 먼저 흐름을 읽는 감각이 있습니다. 생각이 앞서 발이 늦어져 시기를 놓친 적이 있었을 수 있으나, 감각 자체는 틀리지 않았습니다. <strong>완벽한 계획보다 먼저 한 걸음을 밟으십시오.</strong> 통찰은 움직인 뒤에 정리해도 늦지 않습니다.`
    };
    const charText = voicePolishReportHtml(data, CHAR_MAP[dayOh] || `${nm}님의 일간 기질이 인생의 줄거리를 끌고 갑니다. 위 오행 분류에 딱 맞지 않아도, 틀은 같습니다. <strong>지금의 선택이 다음 장면을 고릅니다.</strong> 한 가지 축만 정해 한 달을 보내 보십시오.`);
    const jaeText = voicePolishReportHtml(data, hasJae
        ? `돈의 냄새를 빨리 맡는 편이라, 기회만 보이면 지갑이 먼저 열렸을 수 있습니다. 그건 형편이 아니라 민감함입니다. <strong>이번 달 새 거래는 한 건만 열고, 나머지는 다음 주 월요일로만 미루십시오.</strong>`
        : `재성이 얇게 깔린 편이라, 돈은 이름·실력이 먼저 쌓인 뒤에 따라오는 구조에 가깝습니다. 당신이 느린 것이 아니라 순서가 그렇습니다. <strong>한 축의 전문성만 깊게 파고, 견적서 한 장을 완성도 있게 고정하십시오.</strong>`);
    const gwanText = voicePolishReportHtml(data, hasGwan
        ? `조직 안에서 인정받고 싶은 마음이 동력이 됩니다. 그 마음이 부끄러운 일이 아닙니다. <strong>직함보다 보고 라인·야근 조건을 먼저 이메일로 받아 두십시오.</strong> 구두 지시에는 날짜와 범위를 적어 달라고 하십시오.`
        : `관성이 약하게 깔린 편이라, 정장과 정시 출근만이 답은 아닐 수 있습니다. 프리·창업·전문 축이 숨은 통로인 경우가 많습니다. <strong>이력 한 줄보다 포트폴리오 한 건을 먼저 완성하십시오.</strong>`);
    const strongText = voicePolishReportHtml(data, isStrong
        ? `신강에 가깝습니다. 풀어줘야 잘 나가고, 옥죄이면 스트레스가 몸으로 옵니다. <strong>‘내 말대로 내 삶’이 맞더라도, 하루 한 번은 타인의 속도에 맞추십시오.</strong>`
        : `신약에 가깝습니다. 혼자 끙끙 앓기보다 믿을 사람 하나를 붙이면 배가 되는 구조입니다. <strong>본인에게 유리한 오행이 살아나는 환경·사람을 가까이 두십시오.</strong> 거절 한 번이 체력을 살립니다.`);

    var chHeadM = buildChapterHeadMainSub('원국 한눈에', '성격 · 돈 · 일 · 사랑 · 몸');
    var chIntroM = buildChapterIntroHtml(data, 'master');
    return `<div class="report-chapter">
        ${chHeadM}
        ${chIntroM}
        <p class="ch-text">${nm}님 원국을 한 바퀴 돌며, 어디가 세고 어디가 비는지부터 짚습니다. 서두르지 않아도 됩니다. 읽히는 대로 체크만 하시면 됩니다.</p>
        <div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:16px;margin-bottom:12px;border-left:3px solid var(--gold);">
            <div style="font-size:11px;color:var(--gold);letter-spacing:1px;margin-bottom:6px;">「성격·기질 」 일간 통변</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.85;margin:0;">${charText}</p>
        </div>
        <div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:16px;margin-bottom:12px;border-left:3px solid #c7a76a;">
            <div style="font-size:11px;color:#c7a76a;letter-spacing:1px;margin-bottom:6px;">「신강신약 」 일간 강약 판단</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.85;margin:0;">${strongText}</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:10px;">
            <div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:14px;">
                <div style="font-size:11px;color:#00C853;letter-spacing:1px;margin-bottom:6px;">「재물운 」</div>
                <p style="font-size:12.5px;color:#ddd;line-height:1.8;margin:0;">${jaeText}</p>
            </div>
            <div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:14px;">
                <div style="font-size:11px;color:#4a9e6a;letter-spacing:1px;margin-bottom:6px;">「직업운 」</div>
                <p style="font-size:12.5px;color:#ddd;line-height:1.8;margin:0;">${gwanText}</p>
            </div>
        </div>
    </div>`;
}
function formatReportAccessLine(data) {
    var days = 30;
    if (data && data.linkValidDays != null && !isNaN(parseInt(data.linkValidDays, 10))) {
        days = parseInt(data.linkValidDays, 10);
    }
    var iso = data && (data.reportExpiresAt || data.linkExpiresAt || data.accessUntil);
    if (iso) {
        var d = new Date(iso);
        if (!isNaN(d.getTime())) {
            return d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일까지 동일 링크에서 열람·PDF 저장이 가능합니다.';
        }
    }
    var issued = data && data.reportIssuedAt ? new Date(data.reportIssuedAt) : null;
    if (issued && !isNaN(issued.getTime())) {
        issued.setDate(issued.getDate() + days);
        return issued.getFullYear() + '년 ' + (issued.getMonth() + 1) + '월 ' + issued.getDate() + '일까지 (발행일 기준 ' + days + '일) 열람·PDF 저장이 가능합니다.';
    }
    return '본 링크는 발행 기준 ' + days + '일간 열람·PDF 저장이 가능합니다. (서버에서 발행일·만료일을 넘기면 이 문구가 자동으로 바뀝니다.)';
}

/** Date 보장 — ISO 문자열·타임스탬프·Date 객체 모두 허용 */
function ensureValidDate(val) {
    if (val instanceof Date && !isNaN(val.getTime())) return val;
    if (val != null && val !== '') {
        var raw = val;
        if (/^\d+$/.test(String(raw))) {
            var n = parseInt(String(raw), 10);
            if (String(raw).length === 10) raw = n * 1000;
        }
        var d = new Date(raw);
        if (!isNaN(d.getTime())) return d;
    }
    return new Date();
}

// 리포트 기준 시각(내부 시계): 서버가 넘긴 기준일이 있으면 우선 사용
function getReportBaseDate(data) {
    var raw = data && (data.reportBaseAt || data.reportIssuedAt || data.analysisAt || data.serverNow);
    return ensureValidDate(raw);
}

/** 리포트 기준일 시점 만 나이(양력 생일 기준 근사). */
function getClientAgeYearsAtReport(data) {
    if (!data) return 0;
    var ref = ensureValidDate(getReportBaseDate(data));
    var y = data.coverSolarY != null ? Number(data.coverSolarY) : (data.birthYear != null ? Number(data.birthYear) : (data.birthDate && String(data.birthDate).length >= 4 ? parseInt(String(data.birthDate).substring(0, 4), 10) : 1988));
    var m = data.coverSolarM != null ? Number(data.coverSolarM) : 1;
    var d = data.coverSolarD != null ? Number(data.coverSolarD) : 1;
    var birth = new Date(y, Math.max(0, m - 1), Math.max(1, d));
    if (isNaN(birth.getTime())) return 0;
    var age = ref.getFullYear() - birth.getFullYear();
    var dm = ref.getMonth() - birth.getMonth();
    if (dm < 0 || (dm === 0 && ref.getDate() < birth.getDate())) age--;
    return Math.max(0, age);
}

/** 과거 대운(10년 구간 종료 연령 < 현재 나이) 제외 */
function filterDaeunRowsByClientAge(rows, clientAge) {
    var list = rows || [];
    var ageNow = Number(clientAge) || 0;
    if (ageNow <= 0) return list;
    return list.filter(function (r) {
        var start = r.age !== undefined ? Number(r.age) : (Array.isArray(r) ? Number(r[0]) : 0);
        if (isNaN(start)) start = 0;
        return (start + 9) >= ageNow;
    });
}

/** UI·리포트 공통 — 만 나이 기준 안내 (한국식 세는 나이 아님) */
function getAgeBasisNoteHtml(style) {
    var text = '대운·세운·연령대에 나오는 ○○세 표기는 모두 만 나이(양력 생일 기준)입니다. 한국식 세는 나이와 숫자가 다를 수 있습니다.';
    if (style === 'disclaimer') return text;
    if (style === 'plain') return '※ ' + text;
    return '<p class="age-basis-note" style="margin:0 0 12px;font-size:11px;line-height:1.65;color:#888;">※ ' + text + '</p>';
}

/** 개운법 나이대 블록 — 이미 지난 연령대 조언은 숨김 (38세 → 20·30대 미표시, 40·50대만) */
function shouldShowRemedyAgeDecadeBand(clientAge, bandStart) {
    var age = Number(clientAge) || 0;
    var band = Number(bandStart) || 20;
    if (band === 20) return age < 30;
    if (band === 50) return age >= 40;
    return band >= Math.ceil((age + 1) / 10) * 10;
}

/** 개운법 — 현재·앞으로 해당하는 나이대 조언 HTML만 */
function buildRemedyAgeDecadeBandsHTML(data) {
    var age = getClientAgeYearsAtReport(data);
    var bands = [
        { start: 20, label: '20대', body: '한 분야로 이력서 한 장을 채우십시오. 통장은 **생활/저축 분리**, 카드는 **체크 한 장**으로 줄이십시오. 자격·포트폴리오는 **주말 반나절 고정 슬롯**에만 넣으십시오.' },
        { start: 30, label: '30대', body: '연봉·이직은 **직무·야근·지표가 적힌 문자**가 있을 때만 진행하십시오. 부동산·주식·동업은 **같은 해 두 가지 이상 금지**입니다. 배우자와는 **월 고정비 숫자 한 장**만 맞추고 그날은 술을 끊으십시오.' },
        { start: 40, label: '40대', body: '**검진·수면·주 3회 운동**을 먼저 달력에 박고 나머지 일정을 채우십시오. 인맥은 반으로 줄이고, **돈·계약 말 없는 날**을 주 1회 만드십시오. 사이드는 **세금·계좌 정리 후**에만 이름을 내십시오.' },
        { start: 50, label: '50대 이후', body: '현금 방어가 최우선입니다. 큰 지출·보증·지분은 **지인 말이 아니라 서류**로만 받으십시오. 남기고 싶은 것은 **강의 한 번·글 한 편**으로 끝내고, 몸이 허락하는 시간만 잡으십시오.' }
    ];
    var html = '';
    bands.forEach(function (b) {
        if (!shouldShowRemedyAgeDecadeBand(age, b.start)) return;
        html += '<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">'
            + '<div style="font-size:12px;color:var(--gold);font-weight:700;margin-bottom:6px;">' + b.label + '</div>'
            + '<p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">' + b.body + '</p></div>';
    });
    if (!html) {
        html = '<p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">지금 시기에 맞는 실행은 위 오행 루틴과 작은 반복부터 고정해 보십시오.</p>';
    }
    return html;
}

/** 표지·히어로·birthStr 한 줄. 시·분(coverSolarHH/MM)은 항상 사용자 입력(경도 −32분 보정 전)만 사용합니다. 만세력·시주 등 내부 연산은 별도로 보정 후 시각을 씁니다. */
function formatCoverBirthLine(data) {
    if (!data) return '';
    if (data.coverBirthLine) return data.coverBirthLine;
    var y = data.coverSolarY;
    var m = data.coverSolarM;
    var d = data.coverSolarD;
    if (y == null || m == null || d == null) return data.birthStr || '';
    var ly = data.coverLunarY;
    var lm = data.coverLunarM;
    var ld = data.coverLunarD;
    var lunarPart = '';
    if (ly != null && lm != null && ld != null) {
        lunarPart = ' (음력 ' + ly + '.' + lm + '.' + ld + (data.coverLunarLeap ? ' 윤' : '') + ')';
    }
    if (data.birthTimeKnown === false) {
        return '양력 ' + y + '년 ' + m + '월 ' + d + '일' + lunarPart + ' 생시 알 수 없음';
    }
    var hh = data.coverSolarHH != null ? Number(data.coverSolarHH) : 0;
    var mm = data.coverSolarMM != null ? Number(data.coverSolarMM) : 0;
    var pad2 = function (n) { return String(n).length < 2 ? '0' + n : String(n); };
    return '양력 ' + y + '년 ' + m + '월 ' + d + '일 ' + pad2(hh) + '시 ' + pad2(mm) + '분' + lunarPart;
}

/** 세운 카드 상단 한 줄 — 연도·간지 주어 고정, 12종 로테이션(동일 리포트 내 중복 최소화) */
function pickSeYunYearHookParagraph(name, yr, gHan, jHan, evLabel, sc) {
    var nm = name || '고객';
    var yk = formatYearWithGanzhi(yr, gHan, jHan);
    var tag = String(evLabel || '평온');
    var s = Number(sc) || 0;
    var salt = Math.abs((yr * 17 + (yk || '').length * 3 + tag.length * 5 + s * 11 + hashSeed(nm + (gHan || '') + (jHan || '')))) % 12;
    var hooks = [
        function () { return yk + '의 흐름은 **계약·송금·사람 약속**이 같은 주에 겹치기 쉬운 타입입니다. ' + nmEunNeun(nm) + ' 그 주 **첫 업무 블록 하나**만 메인 일정으로 먼저 잡으십시오.'; },
        function () { return '올해 ' + nmUi(nm) + ' 기조는, ' + yk + ' 에너지가 **우선순위 한 줄**을 강요하는 쪽에 가깝습니다. 화제가 많아 보여도 실행은 **돈·서류·회의** 세 갈래로만 나누십시오.'; },
        function () { return yk + '에는 **일의 줄기가 갈라지는 달**이 분명히 있습니다. ' + nmEunNeun(nm) + ' 그 달의 월요일 아침에만 “메인 한 가지”를 적고, 나머지 제안은 다음 주로 넘기십시오.'; },
        function () { return nmKke(nm) + ' ' + yk + getJosa(yk, '은/는') + ' 겉이 조용해도 **내부 정산·평가**가 도는 해에 가깝습니다. 숫자가 움직이는 주간만 알림을 켜 두십시오.'; },
        function () { return yk + '의 전개는 **“한 번에 다”가 아니라 “한 번에 셋”**에 가깝습니다. ' + nmEunNeun(nm) + ' 돈·서류·사람 중 **하나만 메인**으로 정한 주를 월 2회만 만드십시오.'; },
        function () { return nmUi(nm) + ' ' + yk + ' 체크포인트는 **책임·돈이 묶이는 서류를 손보는 주말**입니다. 금요일 저녁에 조건 세 줄을 적고, 월요일 오전에만 회신하십시오. (전세·근로·투자·가맹·연대보증 등 **법적 효력이 붙는 동의**를 말합니다.)'; },
        function () { return yk + '에는 **이동·역할 변경**과 지출 신호가 같이 오는 구간이 있습니다. ' + nmEunNeun(nm) + ' 비행기표·계약서·통장 알림이 같은 날 뜨면 그날은 결정을 쪼개십시오.'; },
        function () { return nmKke(nm) + ' ' + yk + getJosa(yk, '은/는') + ' **대외 일정**이 먼저 밀려오고 뒤늦게 내부 정리가 따라붙는 패턴입니다. 겉 일정표와 속 장부를 **월요일·목요일 두 번만** 맞추십시오.'; },
        function () { return yk + '의 흐름은 **짧은 급습**과 **긴 유지**가 교차합니다. ' + nmEunNeun(nm) + ' “이번 주 승부”와 “이번 분기 방어”를 번갈아 적어 두십시오.'; },
        function () { return nmUi(nm) + ' 올해 리듬은 ' + yk + getJosa(yk, '이/가') + ' **증빙·세무·보증** 쪽으로 먼저 손을 뻗는 해입니다. 새로운 지출 앱·자동이체는 **영업일 점심 이전**에만 열어보십시오.'; },
        function () { return yk + '에는 **말로 합의된 일**이 서류로 돌아오는 시기가 있습니다. ' + nmEunNeun(nm) + ' 카톡·메일을 PDF 한 폴더로만 모으고, 그 폴더 이름에 연도를 붙이십시오.'; },
        function () { return nmKke(nm) + ' ' + yk + getJosa(yk, '은/는') + ' **사람 약속**이 먼저 쌓이고 **돈 숫자**가 나중에 따라붙는 해입니다. 약속은 주 2회 고정 슬롯으로만 잡으십시오.'; }
    ];
    return hooks[salt]();
}

/** 세운 연도 카드 HTML — 올해(Ch.6)와 내년·내후년(Ch.7) 동일 레이아웃 */
function buildSeYunYearCardHtml(data, yr, opt) {
    opt = opt || {};
    var pack = computeSeYunScorePack(data, yr);
    if (!pack) return '';
    var name = data.name || '고객';
    var OH_KR7 = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' };
    var info = pack.info;
    var ev2 = pack.ev2;
    var sc = pack.sc;
    var sewSip = pack.sewSip;
    var ykw = yearlyFourDomainKeywords(sc, sewSip);
    var ykwInd = yearlyFourDomainIndicators(sc, sewSip);
    var strip = buildYearlyIndicatorsHtml(ykwInd);
    var yongTag = (OH_KR7[data.yong || 'wood'] || '목') + ' 기운이 유리한 편';
    var domAdvN = yearlyDomainStrategicAdvices(sc);
    var body = buildYearStrategicNarrative(name, yr, formatGanzhiPair(info.g, info.j), ev2.l, sc, sewSip, yongTag, domAdvN);
    var isThis = !!opt.isThisYear;
    var border = isThis ? 'var(--gold)' : 'rgba(255,255,255,0.06)';
    var bgA = isThis ? '0.05' : '0.03';
    var badge = isThis ? ' <span style="font-size:10px;background:rgba(199,167,106,0.10);color:var(--gold);border:1px solid rgba(199,167,106,0.40);padding:2px 8px;border-radius:8px;font-weight:600;letter-spacing:0.3px;">▶ 올해</span>' : '';
    var oneLine = formatSeYunCardOneLineConclusion(ev2.l, sc);
    return '<div class="yearly-card glass-panel" style="width:100%;max-width:100%;box-sizing:border-box;background:rgba(255,255,255,' + bgA + ');border-radius:12px;padding:18px 20px;border:1px solid ' + border + ';">'
        + '<div style="width:100%;display:flex;flex-direction:column;gap:10px;margin-bottom:12px;align-items:stretch;">'
        + '<div style="font-size:20px;font-weight:800;color:' + ev2.c + ';width:100%;line-height:1.35;font-family:\'Noto Sans KR\',sans-serif;letter-spacing:0.04em;">' + formatYearWithGanzhiHtml(yr, info.g, info.j) + badge + '</div>'
        + '<div style="font-size:13px;font-weight:700;color:#ebe4d6;line-height:1.5;margin:0;width:100%;">' + oneLine + '</div>'
        + '<div style="width:100%;"><span style="display:inline-block;font-size:12px;background:rgba(255,255,255,0.06);padding:6px 14px;border-radius:20px;color:' + ev2.c + ';font-weight:700;">' + ev2.l + '</span></div>'
        + '<p style="font-size:13.5px;color:#ccc;margin:0;line-height:1.85;width:100%;">' + boldStarsToStrong(pickSeYunYearHookParagraph(name, yr, info.g, info.j, ev2.l, sc)) + '</p></div>'
        + strip
        + '<div style="margin-top:4px;width:100%;">' + body + '</div>'
        + '</div>';
}

function buildPremiumExecutiveSummary(data) {
    var nm = data.name || '고객';
    var OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    var JO = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    var KN = {wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
    var sc = {};
    sc[data.yong] = 2; sc[data.hee] = 1; sc[data.gi] = -2; sc[data.goo] = -1;
    function gs(g, j) { return (sc[OH[g]] || 0) + (sc[JO[j]] || 0); }
    function hashText(t) {
        var h = 0;
        t = String(t || '');
        for (var i = 0; i < t.length; i++) h = ((h << 5) - h) + t.charCodeAt(i);
        return Math.abs(h);
    }
    function trendLabel(score) {
        if (score >= 2) return '공격';
        if (score >= 0) return '균형';
        return '방어';
    }
    var yongKr = KN[data.yong] || data.yong || '용신';
    var giKr = KN[data.gi] || data.gi || '기신';
    var isStrong = ((data.strengthText || '').indexOf('신강') >= 0 || (data.strengthText || '').indexOf('강') >= 0);
    var iljuKey = (data.dayStem || '') + (data.dayBranch || '');
    var ilju = (typeof ILJU_60_DB !== 'undefined' && ILJU_60_DB[iljuKey]) ? ILJU_60_DB[iljuKey] : null;
    var iljuScene = getIljuScenePhrase(data) || ('일주 ' + (HAN_KOR[data.dayStem] || data.dayStem) + (HAN_KOR[data.dayBranch] || data.dayBranch));
    var metaphorLead = buildMetaphorHookTitle(data);

    var PALACE = {
        '子':'지적·분석', '丑':'안정·축적', '寅':'도전·개척', '卯':'감성·인연',
        '辰':'변화·기회', '巳':'열정·집중', '午':'명예·인정', '未':'복록·조화',
        '申':'이동·변화', '酉':'완성·전문성', '戌':'철학·가치관', '亥':'지혜·내면'
    };
    var palaceBranch = data.yearBranch || '';
    var palaceLabel = PALACE[palaceBranch] || '변화·기회';

    var daeunRows = data.daeunRows || [];
    var curDaeun = daeunRows[data.activeDaeunIdx || 0] || null;
    var dg = curDaeun && (curDaeun.gz ? curDaeun.gz[0] : (curDaeun.gan || ''));
    var dj = curDaeun && (curDaeun.gz ? curDaeun.gz[1] : (curDaeun.ji || ''));
    var dScore = curDaeun ? gs(dg, dj) : 0;
    var dTrend = trendLabel(dScore);
    var daeunLabel = curDaeun ? (formatGanzhiPair(dg, dj) + ' 대운') : '현재 대운';

    var baseDate = getReportBaseDate(data);
    var curY = baseDate.getFullYear();
    var curM = baseDate.getMonth() + 1;
    var ygz = ['', ''];
    var mgz = ['', ''];
    try {
        if (typeof Solar !== 'undefined') {
            ygz = Solar.fromYmd(curY, 6, 15).getLunar().getEightChar().getYear();
            mgz = Solar.fromYmd(curY, curM, 15).getLunar().getEightChar().getMonth();
        }
    } catch (e) {}
    var yScore = gs(ygz[0], ygz[1]);
    var mScore = gs(mgz[0], mgz[1]);
    var yTrend = trendLabel(yScore);
    var mTrend = trendLabel(mScore);
    var yLabel = (HAN_KOR[ygz[0]] || ygz[0] || '-') + (HAN_KOR[ygz[1]] || ygz[1] || '-') + '년';

    var coreFusion = nmKkeEunNeun(nm) + ' 환경이 바뀔수록 해야 할 일이 한꺼번에 몰리는 구조가 있습니다. 이건 성격 문제가 아니라, ' + nmUi(nm) + ' 사주가 그렇게 설계되어 있기 때문입니다. <strong>지금 어디에 에너지를 쏟아야 할지를 이 리포트가 짚어드립니다.</strong>';

    var OH_KR2 = {wood:'목(木)', fire:'화(火)', earth:'토(土)', metal:'금(金)', water:'수(水)'};
    var yongFull = OH_KR2[data.yong] || (KN[data.yong] ? KN[data.yong]+' 기운' : '용신');
    var giFull   = OH_KR2[data.gi]   || (KN[data.gi]   ? KN[data.gi]  +' 기운' : '기신');

    // daeunLabel 뒤 조사 — getJosa로 안전 처리 (대부분 '은'이 맞지만 라벨 확장 대비)
    var dJosaEun = getJosa(daeunLabel, '은/는');
    var pools = [
        {
            m1: iljuScene + ' — 이 물상처럼 ' + nmUi(nm) + ' 에너지는 한 방향으로 모아질 때 비로소 진짜 힘이 나는 결이네요. 지금은 여러 갈래를 동시에 펼치시려는 분산만 살짝 줄여 두시면 충분해요.',
            m2: daeunLabel + dJosaEun + ' ' + dTrend + ' 국면이네요. 지금 이 10년은 다음 20년을 받쳐 줄 기반을 차곡차곡 다지는 시기로 보여요. 크게 벌리기보다 내 것을 단단하게 만드시는 쪽이 더 어울리는 흐름입니다.',
            m3: curY + '년은 ' + yTrend + ' 흐름의 한 해예요. 올해는 새로운 출발보다 이미 시작해 둔 일을 끝까지 마무리하는 데 손을 모아 보십시오. 결과가 한결 곱게 떨어집니다.',
            m4: curM + '월은 ' + mTrend + ' 결의 달이군요. 이달은 속도보다 정확도가 더 중요해요. 연락처·계약·결제 흐름을 한 번만 정돈해 두시고, 무리한 일정은 미리 걷어내 두십시오.'
        },
        {
            m1: iljuScene + ' — ' + nmUi(nm) + ' 추진력은 이미 차고 넘치는 편이세요. 지금 필요한 건 더 많이 벌리는 일이 아니라, 가장 중요한 한 가지에 손과 마음을 모으는 일입니다.',
            m2: daeunLabel + '의 핵심 방향은 ' + dTrend + ' 쪽으로 잡혀 있어요. 이 10년 동안 쌓아 두신 것이 앞으로 30년의 모양을 결정짓는 흐름이에요. 지금은 버티기만이 아니라, 다시 써먹을 수 있는 습관과 구조를 차분히 만들어 두시는 시기입니다.',
            m3: curY + '년은 ' + yTrend + ' 기운의 해예요. 계약·브랜드·핵심 관계 가운데 하나만 올해 안에 또렷이 정리해 두시면, 내년이 한결 가뿐해지실 거예요.',
            m4: curM + '월은 ' + mTrend + ' 흐름이네요. 이달은 새 일을 벌이기보다 이미 굴러가는 일을 마무리에 닿게 두시는 편이 더 좋습니다. 무리한 약속은 줄이시고, 체력과 수면부터 가장 먼저 챙기십시오.'
        },
        {
            m1: iljuScene + ' — ' + nmUi(nm) + ' 강점은 이미 또렷이 자리잡고 있어요. 다만 에너지가 여러 방향으로 흩어지는 점이 아쉬운 결인데, 가장 잘 해내실 수 있는 한 가지를 먼저 골라 보십시오.',
            m2: daeunLabel + dJosaEun + ' ' + dTrend + ' 구간이네요. 지금의 10년은 공격보다 내실을 다지는 흐름이 더 어울려요. 인력·원가·의사결정 흐름을 단순화하실수록 다음 도약이 한층 빨라집니다.',
            m3: curY + '년은 ' + yTrend + ' 전술 구간이에요. 올해는 시장에 자신을 자연스럽게 알리기 좋은 해입니다. 제안·가격·메시지 가운데 하나만 올해 안에 정돈해 두십시오.',
            m4: curM + '월은 ' + mTrend + ' 흐름이에요. 이달은 가속보다 정렬이 먼저예요. 연락처·계약·결제 흐름을 한 번 점검하시고, 체력을 무너뜨리는 일정은 가장 먼저 지워 두십시오.'
        }
    ];

    var pick = hashText([iljuKey, daeunLabel, curY, curM, palaceBranch].join('|')) % pools.length;
    var chosen = pools[pick];
    var vipTitles = buildVipModuleTitles(data, daeunLabel, curY, curM);
    var modules = [
        { title: vipTitles[0], body: chosen.m1 },
        { title: vipTitles[1], body: chosen.m2 },
        { title: vipTitles[2], body: chosen.m3 },
        { title: vipTitles[3], body: chosen.m4 }
    ];

    // 표지형 압축 — 메타포 제목 + 프롤로그(한눈에 보기) 카드만 남김.
    // PDF 저장 버튼·열람 안내·면책 고지·이용 안내 등 유틸리티 컴포넌트는 본문 렌더링이 끝난 뒤
    // 문서 최하단(buildReportFooterUtilities)에 모아 배치합니다. 진짜 본문 풀이는 1~4부에서 이어집니다.
    var trendNuance = function (t) {
        if (t === '공격') return '한 발 더 내디뎌도 좋은 흐름';
        if (t === '균형') return '들숨 날숨이 고르게 맞아 가는 흐름';
        return '한 박자 쉬어 가는 편이 좋은 흐름';
    };
    var monthFlavor = function (t) {
        if (t === '공격') return '속도를 한 단계 올려도 무리가 없는 달';
        if (t === '균형') return '리듬을 그대로 유지하기 좋은 달';
        return '욕심을 내려놓고 다듬어 가기 좋은 달';
    };
    // ─── 첫 페이지 인생 서사 한 단락 ───
    // 사주 이론(대운명·용신·기신·오행 이름)을 모르는 일반 독자가
    // "내가 어떤 환경에 태어나서, 어떤 시기를 지나, 지금 어디에 와 있는지,
    //  앞으로 어떻게 흘러갈지"를 한 단락으로 받아들 수 있게 결과적 표현만 씁니다.
    var openingNarrative = buildOpeningLifeNarrative(data);
    openingNarrative = voicePolishParagraph(data, openingNarrative);

    return '<div id="sec-premium-summary" class="report-chapter premium-executive-summary chapter-start sajux-panel-plain" style="margin-bottom:40px;padding:28px 22px;border-radius:14px;border:1px solid rgba(199,167,106,0.30);background:transparent;text-align:center;">' +
        '<div style="font-size:10.5px;letter-spacing:0.20em;color:rgba(199,167,106,0.72);margin-bottom:14px;font-weight:600;">사주X · 프리미엄 리포트</div>' +
        '<h2 style="font-family:\'Noto Sans KR\',sans-serif;font-size:24px;font-weight:700;color:var(--text, #f5f0e6);margin:0 0 8px;line-height:1.45;letter-spacing:-0.01em;">' + escHtmlAttr(metaphorLead) + '</h2>' +
        '<p style="font-size:11.5px;letter-spacing:0.14em;color:var(--text-dim, rgba(199,167,106,0.72));margin:0 0 22px;font-weight:500;">' + escHtmlAttr(nmUi(nm)) + ' 인생 한 편을 먼저 짧게 들려드릴게요</p>' +
        '<div class="brief-glance sajux-print-surface" style="text-align:left;margin:0;padding:18px 20px;border-radius:12px;background:rgba(199,167,106,0.06);border-left:3px solid var(--gold);">' +
        '<div style="font-size:10.5px;color:var(--gold);font-weight:700;letter-spacing:0.12em;margin-bottom:6px;">' + escHtmlAttr(nmUi(nm)) + ' 인생 한 흐름 — 태어남부터 마지막 모습까지</div>' +
        '<p style="font-size:11.5px;color:var(--text-dim, rgba(255,255,255,0.55));margin:0 0 12px;line-height:1.7;">본문에 들어가시기 전, ' + escHtmlAttr(nmUi(nm)) + ' 인생 전체의 큰 줄기를 한 단락으로 먼저 보여 드릴게요. 다음 페이지부터는 이 흐름이 시기별로 어떻게 펼쳐지는지 자세히 풀어 드립니다.</p>' +
        '<p style="font-size:14px;color:var(--text);line-height:2;margin:0;">' + boldStarsToStrong(openingNarrative) + '</p>' +
        '</div>' +
        '</div>';
}

/** ─── 첫 페이지용 인생 서사 한 단락 ───
 *  명리 용어(대운명·용신·기신·오행 한자)를 일절 쓰지 않고,
 *  "어떤 환경에 태어나서 → 청년기 흐름 → 지금 시기 → 앞으로 → 말년"을
 *  결과적·실용적 표현으로 풀어 한 단락으로 만듭니다.
 */
function buildOpeningLifeNarrative(data) {
    var nm = data.name || '고객';
    var mb = data.monthBranch || '';
    var curAge = Number(data.currentAge || data.userAge || data.age || 0);
    if (!curAge && data.birthYear) {
        try {
            var by = Number(data.birthYear);
            var nowY = (typeof getReportBaseDate === 'function') ? getReportBaseDate(data).getFullYear() : (new Date()).getFullYear();
            if (by > 1900 && by < 2200) curAge = Math.max(0, nowY - by);
        } catch (e) {}
    }
    var rows = data.daeunRows || data.daewunList || [];
    var yong = data.yong || ''; var hee = data.hee || '';
    var gi = data.gi || ''; var goo = data.goo || '';
    var STO = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    var BRO = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    function rowSc(g, j) {
        var s = 0;
        var go = STO[g]; var jo = BRO[j];
        if (go === yong || go === hee) s += 2;
        if (go === gi || go === goo) s -= 2;
        if (jo === yong || jo === hee) s += 2;
        if (jo === gi || jo === goo) s -= 2;
        return s;
    }
    var parsed = [];
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var gz = (r && (r.name || (r.gz && (r.gz[0] + r.gz[1])))) || '';
        var g = gz.charAt(0); var j = gz.charAt(1);
        var ag = r && (r.age != null ? r.age : r.startAge);
        ag = ag != null ? Number(ag) : i * 10;
        parsed.push({ age: ag, sc: gz.length > 1 ? rowSc(g, j) : 0 });
    }
    function avgOf(arr) { if (!arr.length) return 0; return arr.reduce(function(s,x){return s+(x.sc||0);},0) / arr.length; }
    function tone(a) { return a >= 1 ? 'tail' : (a <= -1 ? 'side' : 'mix'); }

    var childhoodByMb = {
        '子': '조용하고 규칙이 일찍 자리잡은 집안',
        '丑': '느리지만 성실함이 묵직하게 칭찬받던 환경',
        '寅': '도전을 부추기는 진취적인 분위기',
        '卯': '화창하고 따뜻한 봄날 같은 환경',
        '辰': '이사·전학 같은 변화가 잦았던 환경',
        '巳': '기대와 자존심이 함께 자란 환경',
        '午': '인정과 활기가 가득했던 환경',
        '未': '조용한 배려와 끈기가 깔린 환경',
        '申': '현실 감각이 일찍 자란 환경',
        '酉': '완성도와 체면을 중시하는 환경',
        '戌': '의리와 책임을 일찍 배운 환경',
        '亥': '감수성과 정이 깊었던 환경'
    };
    var childhood = childhoodByMb[mb] || '진중하고 묵직한 분위기의 집안';

    var youthTone = tone(avgOf(parsed.filter(function(x){ return x.age >= 15 && x.age <= 28; })));
    var youthPhrase = youthTone === 'tail'
        ? '운이 등 뒤에서 받쳐 주어 작은 성공이 자존감의 뼈대가 되는 청년기'
        : (youthTone === 'side'
            ? '진로와 관계 한 번씩 크게 흔들리며 자기 색을 또렷이 다듬는 청년기'
            : '작은 결정들이 차곡차곡 쌓여 방향을 잡아 가는 청년기');

    var currentPhase;
    if (curAge && curAge < 25) currentPhase = '진로·정체성을 정하는 결정들이 가장 굵직하게 몰리는 시기';
    else if (curAge && curAge < 45) currentPhase = '직업·결혼·재물의 자리잡기 결정이 가장 굵직하게 몰리는 시기';
    else if (curAge && curAge < 65) currentPhase = '책임의 무게와 후반전 정리가 동시에 펼쳐지는 시기';
    else if (curAge) currentPhase = '말년의 정리와 무엇을 남길지를 그려 가는 시기';
    else currentPhase = '인생 중심의 큰 결정이 모이는 자리';

    var nextLo = Math.max(curAge + 5, 25);
    var nextHi = Math.min(nextLo + 15, 75);
    var nextTone = tone(avgOf(parsed.filter(function(x){ return x.age >= nextLo && x.age <= nextHi; })));
    var nextPhrase = nextTone === 'tail'
        ? '바람이 등 뒤에서 밀어 주는 흐름'
        : (nextTone === 'side'
            ? '한 번 크게 정돈을 거치며 다듬어지는 흐름'
            : '담담히 깊이가 쌓여 가는 흐름');

    var lateTone = tone(avgOf(parsed.filter(function(x){ return x.age >= 60; })));
    var latePhrase = lateTone === 'tail'
        ? '이름과 신뢰가 한 번 더 빛나는 모습'
        : (lateTone === 'side'
            ? '몸을 우선하며 차분히 정리되는 모습'
            : '조용한 일상의 깊이로 마감되는 모습');

    var nowPiece = curAge
        ? '지금은 <strong>' + curAge + '세</strong> — ' + currentPhase + '에 들어와 계세요'
        : '지금은 ' + currentPhase + '에 들어와 계세요';

    return nmEunNeun(nm) + ' <strong>' + childhood + '</strong>에서 태어나신 분이세요. '
        + '<strong>' + youthPhrase + '</strong>를 지나, '
        + nowPiece + '. '
        + '앞으로 약 <strong>' + nextHi + '세</strong>까지는 <strong>' + nextPhrase + '</strong>이 이어지고, '
        + '<strong>60대 이후</strong>엔 <strong>' + latePhrase + '</strong>으로 정리되는 분이에요.';
}

// ══════════════════════════════════════════════════════
// ③ 60일주 핵심 특성 DB - 완전판
// ══════════════════════════════════════════════════════
var ILJU_60_DB = {
    // ── 갑목(甲) 일간 6개 ──
    '甲子': {core:'큰 나무가 깊은 물 위에 서 있는 상(象). 정인(正印)의 든든한 지지를 받아 지적 리더십이 강합니다. 겉은 당당하지만 내면에 섬세한 감수성이 있으며 배움과 성장에서 진정한 행복을 찾습니다.', strength:'지적 리더십·학문 성취·배움 본능', weakness:'완벽주의로 시작을 미루는 경향', love:'자신의 성장을 지지해주는 지적인 파트너', career:'교육·연구·기획·전략·컨설팅', image:'봄의 큰 나무가 지하수를 깊이 빨아올리며 성장'},
    '甲寅': {core:'큰 나무가 울창한 숲 속에 서 있는 상(象). 비겁(比劫)이 넘쳐 독립심이 매우 강합니다. 자신만의 왕국을 건설하려는 본능이 평생 지속되며 경쟁과 도전에서 에너지를 얻습니다.', strength:'독립심·선도적 기질·개척 정신·강한 자아', weakness:'타인과의 협력에서 주도권 다툼', love:'독립성을 존중해주는 파트너', career:'창업·독립사업·스포츠·개척형 직종', image:'숲의 왕 — 혼자서도 하늘을 향해 곧게 뻗는다'},
    '甲辰': {core:'큰 나무가 비옥한 대지에 깊이 뿌리내린 상(象). 편재(偏財)의 기운으로 현실적 감각과 리더십이 결합됩니다. 카리스마와 추진력이 동시에 강합니다.', strength:'현실적 리더십·추진력·재물 감각', weakness:'지나친 통제욕', love:'자신을 현실적으로 지지해주는 든든한 파트너', career:'경영·금융·부동산·사업가', image:'대지 위의 큰 나무 — 뿌리도 깊고 가지도 넓다'},
    '甲午': {core:'큰 나무가 타오르는 태양 빛을 받아 무성하게 자라는 상(象). 식신(食神)이 강해 창의성과 표현력이 폭발합니다. 화려한 무대에서 자연스럽게 빛납니다.', strength:'창의성·표현력·카리스마·긍정 에너지', weakness:'감정 기복·번아웃', love:'열정적이고 활기찬 관계', career:'교육·연예·기획·크리에이터·마케팅', image:'태양을 향해 가장 높이 뻗은 나무'},
    '甲申': {core:'큰 나무가 날카로운 도끼에 맞서는 상(象). 편관(偏官)의 강한 압박이 내공을 만듭니다. 극한 상황에서 오히려 강해지는 승부사적 기질이 있습니다.', strength:'강인함·승부욕·위기 돌파 능력', weakness:'지나친 긴장감·주변과의 마찰', love:'강한 카리스마로 이끌지만 부드러움 연습 필요', career:'군인·경찰·의사·스포츠·경쟁 분야', image:'도끼에 맞서 더 단단해지는 나무'},
    '甲戌': {core:'큰 나무가 가을 산에 우뚝 서 있는 상(象). 편재와 정재가 동시에 작용하여 재물 감각이 뛰어납니다. 원칙을 지키면서도 현실적인 리더입니다.', strength:'원칙적 리더십·재물 감각·신뢰', weakness:'보수적 판단으로 기회를 놓치는 경향', love:'신뢰와 헌신을 중시하는 안정적 관계', career:'금융·부동산·법률·행정', image:'가을 산의 큰 나무 — 묵직하고 믿음직'},
    // ── 을목(乙) 일간 6개 ──
    '乙丑': {core:'덩굴이 비옥한 겨울 대지에 뿌리내린 상(象). 정재(正財)의 지지로 꾸준하고 성실한 재물 축적이 강점입니다. 겉으로 부드럽지만 내면의 의지가 강합니다.', strength:'끈기·안정 추구·신뢰 기반', weakness:'변화를 두려워하다 기회를 놓치는 경향', love:'안정적이고 헌신적인 관계', career:'ESG·리얼에셋·FP&A·백오피스', image:'단단한 대지를 꼭 붙잡은 덩굴'},
    '乙卯': {core:'덩굴이 봄 숲 속에서 무성하게 자라는 상(象). 비겁이 넘쳐 독립적이면서도 사교적입니다. 인간관계를 통해 기회를 만드는 천부적 능력이 있습니다.', strength:'사교성·유연성·인맥 활용', weakness:'관계에서의 주도권 갈등', love:'따뜻하고 소통이 잘 되는 파트너', career:'영업·교육·상담·네트워킹', image:'모든 방향으로 유연하게 뻗어가는 덩굴'},
    '乙巳': {core:'덩굴이 따뜻한 불꽃 위에서 피어나는 상(象). 상관(傷官)의 기운으로 표현력과 지적 예리함이 뛰어납니다. 말과 글로 영향력을 발휘하는 타입입니다.', strength:'지적 표현력·분석력·혁신적 사고', weakness:'권위에 대한 반발·주변과의 마찰', love:'지적으로 자극하는 예리한 파트너', career:'작가·방송인·컨설턴트·스타트업', image:'불꽃 위에서 피어난 덩굴 — 뜨겁고 예리하다'},
    '乙未': {core:'덩굴이 여름 대지에서 만개하는 상(象). 정재와 편재가 함께 작용하여 재물 감각과 감성적 풍요가 공존합니다.', strength:'감성적 풍요·예술적 재능·재물 감각', weakness:'감정적 결정으로 재물을 잃는 경향', love:'감성적 교감이 깊은 파트너', career:'예술·인테리어·음식·커뮤니케이션', image:'여름 대지에서 풍성하게 피어난 덩굴'},
    '乙酉': {core:'덩굴이 서리 맺힌 가을에 버티는 상(象). 편관(偏官)의 압박이 강해 여러 번의 시련을 겪지만 그것이 내공이 됩니다.', strength:'끈질긴 생명력·위기 돌파·완성도', weakness:'압박에 의한 스트레스·건강 관리 중요', love:'안정적이고 이해심 깊은 파트너', career:'전문직·의료·법률·예술·수공예', image:'서리 속에서도 살아남는 덩굴의 생명력'},
    '乙亥': {core:'덩굴이 깊은 물 속에서 자라는 상(象). 정인(正印)의 강한 지지로 지적 감수성이 뛰어납니다. 통찰력과 예술적 직관이 결합됩니다.', strength:'깊은 통찰·예술적 감수성·학문 재능', weakness:'과잉 사색으로 실행을 미루는 패턴', love:'내면을 깊이 이해하는 정신적 교감', career:'연구·상담·예술·철학·문학', image:'깊은 물 속에서 자라는 덩굴 — 보이지 않는 내면이 강하다'},
    // ── 병화(丙) 일간 6개 ──
    '丙子': {core:'태양이 깊은 강물 위를 비추는 상(象). 정관(正官)의 기운으로 사회적 명예와 체면을 중시합니다. 화려한 외면 뒤에 섬세한 내면이 숨어 있습니다.', strength:'카리스마·사교성·명예 의식', weakness:'체면 때문에 실리를 놓치는 경향', love:'자신의 빛을 함께 즐기는 활기찬 파트너', career:'공직·금융·방송·정치·대기업', image:'강 위를 비추는 태양 — 빛나지만 내면은 깊다'},
    '丙寅': {core:'태양이 봄 숲 위에서 환하게 빛나는 상(象). 편인(偏印)의 지지로 창의성과 직관이 뛰어납니다. 어디서든 자연스럽게 중심이 되는 존재입니다.', strength:'자연스러운 카리스마·창의성·직관적 리더십', weakness:'즉흥적 결정·계획보다 감을 따르는 경향', love:'열정적이면서도 자신을 이해하는 파트너', career:'교육·예술·기획·독립사업·리더 역할', image:'봄 숲 위의 태양 — 존재 자체가 따뜻함'},
    '丙辰': {core:'태양이 비옥한 대지 위에 빛나는 상(象). 식신(食神)과 편재(偏財)가 결합되어 창의성과 재물 감각이 동시에 강합니다.', strength:'창의적 재물 감각·표현력·풍요 에너지', weakness:'과잉 소비·에너지 분산', love:'함께 풍요롭게 즐기는 활기찬 관계', career:'엔터테인먼트·사업·요식업·마케팅', image:'비옥한 대지를 풍요롭게 비추는 태양'},
    '丙午': {core:'태양이 한낮 하늘에서 작렬하는 상(象). 겁재(劫財)가 강해 에너지가 넘치고 승부욕이 강합니다. 극한의 경쟁 환경에서 진가를 발휘합니다.', strength:'폭발적 에너지·승부욕·열정', weakness:'과열되면 주변을 소진시키는 경향', love:'강렬하게 시작하지만 지속하는 노력 필요', career:'영업·스포츠·창업·경쟁 치열한 분야', image:'한낮의 태양 — 뜨겁고 강렬하다'},
    '丙申': {core:'태양이 서늘한 가을 하늘에 걸린 상(象). 편재(偏財)의 기운으로 현실적 감각이 강합니다. 화려함과 실속을 동시에 추구합니다.', strength:'현실적 감각·재물 본능·다양한 수입원', weakness:'분산된 에너지로 깊이가 부족해지는 경향', love:'현실적이고 경제적으로 안정된 파트너', career:'금융·무역·사업·투자·영업', image:'가을 하늘의 태양 — 빛나지만 실속이 있다'},
    '丙戌': {core:'태양이 석양 무렵 대지 위를 물들이는 상(象). 식신(食神)과 편재가 결합되어 창의적 재물 능력이 강합니다.', strength:'창의성·재물 감각·따뜻한 카리스마', weakness:'황혼 태양처럼 에너지가 빠르게 소진되는 경향', love:'서로를 따뜻하게 감싸주는 관계', career:'엔터테인먼트·교육·창업·마케팅', image:'석양의 태양 — 화려하게 빛나다 사라지지 않도록'},
    // ── 정화(丁) 일간 6개 ──
    '丁丑': {core:'촛불이 차가운 땅 속에서 타오르는 상(象). 정재(正財)의 기운으로 꾸준하고 안정적인 재물 축적이 강점입니다. 겉으로는 조용하지만 내면의 집착이 강합니다.', strength:'집중력·안정적 재물 관리·성실함', weakness:'변화를 두려워하는 경향', love:'안정적이고 신뢰할 수 있는 파트너', career:'회계·재무·은행·행정·안정적 전문직', image:'차가운 어둠 속에서도 꺼지지 않는 촛불'},
    '丁卯': {core:'촛불이 봄 숲 속에서 부드럽게 타오르는 상(象). 정인(正印)의 지지로 감성과 학문 능력이 뛰어납니다.', strength:'감성적 지성·배움 본능·따뜻한 통찰', weakness:'지나친 감상으로 현실적 판단이 흐려지는 경향', love:'깊은 감성 교감과 지적 대화가 되는 파트너', career:'교육·상담·글쓰기·예술·심리', image:'봄 숲 속의 촛불 — 부드럽고 따뜻하다'},
    '丁巳': {core:'촛불이 따뜻한 불꽃 위에 놓인 상(象). 비겁(比劫)이 강해 독립심과 에너지가 충만합니다.', strength:'열정·독립심·집중력·전문성', weakness:'에너지 과열로 인한 소진', love:'자신의 열정을 함께 나눌 수 있는 파트너', career:'전문직·연구·예술·컨설팅·독립사업', image:'불 위의 촛불 — 두 배로 타오른다'},
    '丁未': {core:'촛불이 여름 대지 위에서 풍요롭게 타오르는 상(象). 편재(偏財)와 정재가 결합되어 재물 감각이 강합니다.', strength:'재물 감각·감성적 풍요·예술적 재능', weakness:'감정적 결정으로 재물을 잃는 경향', love:'감성적이고 풍요로운 관계', career:'예술·음식·뷰티·엔터테인먼트', image:'여름 대지 위의 촛불 — 따뜻하고 풍요로운'},
    '丁酉': {core:'촛불이 날카로운 금속 위에서 타오르는 상(象). 편관(偏官)의 강한 압박이 전문성을 키웁니다.', strength:'집중력·전문성·섬세한 완성도', weakness:'압박으로 인한 스트레스·건강 관리 필요', love:'자신을 이해하고 지지하는 섬세한 파트너', career:'전문직·공예·의료·연구·예술', image:'금속 위의 촛불 — 압박받을수록 더 밝게 빛난다'},
    '丁亥': {core:'촛불이 깊은 물 위에서 흔들리며 타오르는 상(象). 정관(正官)의 기운으로 사회적 명예와 규범을 중시합니다.', strength:'사회적 감각·명예 의식·지속성', weakness:'흔들리는 감정 속에서 중심 잡기', love:'안정감을 주는 신뢰할 수 있는 파트너', career:'공직·금융·교육·상담·전통적 전문직', image:'물 위의 촛불 — 흔들려도 꺼지지 않는 의지'},
    // ── 무토(戊) 일간 6개 ──
    '戊子': {core:'큰 산이 깊은 강을 품은 상(象). 정재(正財)의 기운으로 안정적 재물 능력이 강합니다. 묵직하고 신뢰가 있으며 오래 함께할수록 진가가 드러납니다.', strength:'신뢰·안정·재물 관리·장기적 성취', weakness:'느린 결정으로 기회를 놓치는 경향', love:'오래도록 신뢰할 수 있는 안정적 파트너', career:'금융·부동산·행정·자산관리·건설', image:'깊은 강을 품은 큰 산 — 묵직하고 든든하다'},
    '戊寅': {core:'큰 산 위에 큰 나무가 자라는 상(象). 편관(偏官)의 기운으로 강인하고 도전적입니다. 원칙과 추진력이 결합된 강한 리더 기질이 있습니다.', strength:'강인한 리더십·원칙·도전 정신', weakness:'유연성 부족·고집', love:'자신의 강함을 부드럽게 보완해주는 파트너', career:'사업·건설·부동산·경영·군인·경찰', image:'산 위의 큰 나무 — 가장 높은 곳에 선다'},
    '戊辰': {core:'큰 산이 또 다른 대지 위에 솟은 상(象). 비겁(比劫)이 강해 자기 주도성이 강합니다. 강한 의지와 추진력으로 자신만의 왕국을 건설합니다.', strength:'강한 의지·추진력·자기 주도성', weakness:'타인과의 협력 어려움·고집', love:'자신의 독립성을 존중해주는 파트너', career:'창업·부동산·건설·사업·독립적 전문직', image:'산 위의 산 — 압도적인 존재감'},
    '戊午': {core:'큰 산이 뜨거운 태양 아래 서 있는 상(象). 정인(正印)의 기운으로 학문과 지식에서 강점이 있습니다.', strength:'지적 안정감·학문적 권위·신뢰', weakness:'보수적 사고로 새로운 것에 저항', love:'학식과 품격을 갖춘 파트너', career:'교육·연구·행정·공직·전통적 전문직', image:'태양 아래의 큰 산 — 드러날수록 더 위엄있다'},
    '戊申': {core:'큰 산이 날카로운 바위를 품은 상(象). 식신(食神)의 기운으로 창의성이 강합니다.', strength:'창의적 표현력·안정적 기반·현실감', weakness:'안정을 추구하다 창의성이 억눌리는 경향', love:'안정적이면서도 삶에 활력을 주는 파트너', career:'건설·엔지니어링·제조·기획·교육', image:'바위를 품은 큰 산 — 강하면서도 창의적'},
    '戊戌': {core:'큰 산 위에 또 다른 산이 겹친 상(象). 비겁이 강해 의지와 고집이 매우 강합니다.', strength:'강한 의지·원칙·권위', weakness:'유연성 부족·타인과의 갈등', love:'자신의 권위를 인정해주는 파트너', career:'경영·부동산·정치·리더십 포지션', image:'산 위의 산 — 넘을 수 없는 존재감'},
    // ── 기토(己) 일간 6개 ──
    '己丑': {core:'비옥한 농토가 단단한 대지 위에 있는 상(象). 비겁이 강해 꼼꼼하고 성실합니다. 현실적인 재물 관리와 안정을 추구합니다.', strength:'성실·꼼꼼함·안정적 재물 관리', weakness:'과도한 보수성·변화 저항', love:'안정적이고 성실한 파트너', career:'리얼에셋·재무·백오피스·데이터운영', image:'대지 위의 비옥한 농토 — 꾸준히 열매를 맺는다'},
    '己卯': {core:'비옥한 농토 위에 나무가 자라는 상(象). 편관(偏官)의 기운으로 압박 속에서 더 강해집니다. 섬세하지만 내면에 강한 의지가 있습니다.', strength:'섬세함·인내·강인한 내면', weakness:'스트레스 내재화·건강 주의', love:'자신을 이해해주는 따뜻한 파트너', career:'그린테크·헬스케어·상담·EdTech', image:'압박에도 꽃을 피우는 농토'},
    '己巳': {core:'비옥한 농토 위에 따뜻한 불꽃이 있는 상(象). 정인(正印)의 지지로 지식과 학문에 강점이 있습니다.', strength:'지적 성실함·배움 본능·실용적 지식', weakness:'이론과 실용 사이의 갈등', love:'지적 교감이 되는 성실한 파트너', career:'교육·연구·의료·상담·행정', image:'따뜻한 불이 비옥하게 하는 농토'},
    '己未': {core:'비옥한 농토가 여름 대지 위에 있는 상(象). 비겁이 강해 자기 확신이 강합니다.', strength:'자기 확신·안정 추구·실용성', weakness:'지나친 자아로 협력 어려움', love:'서로를 편안하게 해주는 안정적 관계', career:'음식·원예·부동산·자영업', image:'여름의 풍성한 농토 — 풍요롭다'},
    '己酉': {core:'비옥한 농토 위에 보석이 놓인 상(象). 식신(食神)의 기운으로 창의적 표현이 강합니다.', strength:'창의성·완성도·섬세한 표현', weakness:'완벽주의로 인한 과부하', love:'서로의 창의성을 인정하는 파트너', career:'공예·예술·요리·뷰티·디자인', image:'농토 위의 보석 — 섬세하고 아름답다'},
    '己亥': {core:'비옥한 농토 아래 깊은 물이 흐르는 상(象). 정재(正財)의 기운으로 안정적 재물 능력이 있습니다.', strength:'재물 관리·직관·현실적 통찰', weakness:'과잉 분석으로 결정이 늦어지는 경향', love:'안정적이고 깊이 있는 관계', career:'금융·부동산·투자·상담·행정', image:'지하수가 풍부한 비옥한 농토'},
    // ── 경금(庚) 일간 6개 ──
    '庚子': {core:'날카로운 도끼가 깊은 물 위에 있는 상(象). 상관(傷官)의 기운으로 혁신적 사고와 표현력이 강합니다.', strength:'혁신적 사고·날카로운 표현·독립성', weakness:'권위에 대한 반발·주변 마찰', love:'지적 자극을 주는 날카로운 파트너', career:'스타트업·기획·법률·전략·컨설팅', image:'물 위의 도끼 — 차갑고 날카롭다'},
    '庚寅': {core:'날카로운 도끼가 큰 나무를 만난 상(象). 편재(偏財)의 기운으로 현실적 재물 감각이 강합니다. 결단력 있게 기회를 포착합니다.', strength:'결단력·재물 감각·현실적 추진력', weakness:'지나친 직선적 소통으로 마찰', love:'현실적이고 강한 파트너', career:'금융·무역·사업·투자·영업', image:'나무를 만난 도끼 — 결단하면 가능하면 실행한다'},
    '庚辰': {core:'날카로운 도끼가 비옥한 대지를 파는 상(象). 편인(偏印)의 기운으로 독창적 사고가 강합니다.', strength:'독창성·결단력·현실 개혁 능력', weakness:'독불장군·협력 어려움', love:'자신의 독창성을 인정해주는 파트너', career:'혁신 사업·기술·연구·개혁 분야', image:'대지를 가르는 도끼 — 새로운 것을 만든다'},
    '庚午': {core:'날카로운 도끼가 뜨거운 불 속에 있는 상(象). 편관(偏官)의 압박과 재련 과정이 더 강한 도구를 만듭니다.', strength:'강인함·재련된 능력·압박 속 성장', weakness:'극한 압박으로 인한 건강 문제', love:'자신의 강인함을 이해하는 파트너', career:'군인·경찰·소방·외과·위기관리', image:'불 속에서 더 강해지는 도끼'},
    '庚申': {core:'날카로운 도끼가 날카로운 금속 위에 있는 상(象). 비겁이 강해 독립심과 경쟁심이 매우 강합니다.', strength:'강인한 독립심·경쟁력·결단력', weakness:'지나친 경쟁심으로 협력 어려움', love:'자신의 강함을 인정하는 파트너', career:'창업·독립사업·스포츠·경쟁 분야', image:'도끼 위의 도끼 — 가장 날카로운 존재'},
    '庚戌': {core:'날카로운 도끼가 가을 산 위에 있는 상(象). 식신(食神)의 기운으로 창의적 표현과 결단력이 결합됩니다.', strength:'창의적 결단력·완성도·실용성', weakness:'완벽주의로 인한 과부하', love:'서로를 완성시켜주는 파트너', career:'제조·엔지니어링·기획·디자인', image:'가을 산 위의 도끼 — 완성에 집착한다'},
    // ── 신금(辛) 일간 6개 ──
    '辛丑': {core:'보석이 비옥한 대지 속에 묻힌 상(象). 정재(正財)의 기운으로 착실하고 안정적입니다.', strength:'섬세함·안정적 재물 관리·완성도', weakness:'보수적이어서 기회를 놓침', love:'신뢰할 수 있고 섬세한 파트너', career:'보석·공예·재무·행정·전통 전문직', image:'땅 속의 보석 — 시간이 갈수록 빛난다'},
    '辛卯': {core:'보석이 봄 숲 속에 놓인 상(象). 편관(偏官)의 압박이 보석을 더 빛나게 만듭니다.', strength:'압박 속 성장·섬세한 완성도·예술성', weakness:'스트레스 내재화·건강 주의', love:'자신의 섬세함을 이해하는 파트너', career:'예술·공예·의료·패션·디자인', image:'숲 속의 보석 — 압박받을수록 빛난다'},
    '辛巳': {core:'보석이 따뜻한 불꽃 위에서 빛나는 상(象). 정인(正印)의 기운으로 지적 감수성이 뛰어납니다.', strength:'지적 감수성·학문 재능·섬세한 완성도', weakness:'이상과 현실 사이 갈등', love:'지적이고 감성적인 파트너', career:'연구·교육·예술·컨설팅', image:'불 위의 보석 — 지식이 빛나게 한다'},
    '辛未': {core:'보석이 여름 대지 위에서 빛나는 상(象). 편재(偏財)의 기운으로 미적 재물 감각이 있습니다.', strength:'미적 감각·재물 직관·섬세한 표현', weakness:'감정적 결정으로 재물을 잃음', love:'감성적이고 아름다운 관계', career:'패션·뷰티·예술·인테리어·마케팅', image:'여름 대지 위의 보석 — 화려하게 빛난다'},
    '辛酉': {core:'가장 완성된 보석이 완벽하게 세공된 상(象). 비겁이 강해 자기 기준이 매우 높습니다.', strength:'높은 완성도·전문성·미적 기준', weakness:'완벽주의로 인한 스트레스·주변 비판', love:'자신의 기준에 맞는 품격 있는 파트너', career:'공예·의료·법률·감정·전문 컨설팅', image:'완벽하게 세공된 보석 — 타협이 없다'},
    '辛亥': {core:'보석이 깊은 물 속에서 빛나는 상(象). 상관(傷官)의 기운으로 독창적 사고와 표현이 강합니다.', strength:'독창성·직관·혁신적 표현', weakness:'기존 틀에 대한 반발', love:'지적으로 자극하는 독창적 파트너', career:'연구·예술·글쓰기·컨설팅·스타트업', image:'깊은 물 속의 보석 — 숨겨진 독창성'},
    // ── 임수(壬) 일간 6개 ──
    '壬子': {core:'큰 강이 깊은 바다와 만나는 상(象). 비겁이 강해 통찰력과 지적 에너지가 넘칩니다.', strength:'통찰력·분석력·지적 깊이·적응력', weakness:'분석 과잉으로 실행을 미루는 패턴', love:'지적 교감이 깊은 파트너', career:'연구·분석·금융·전략·컨설팅', image:'강과 바다가 만나는 곳 — 끝없이 깊다'},
    '壬寅': {core:'큰 강이 봄 숲을 적시는 상(象). 식신(食神)의 기운으로 창의성과 지적 에너지가 결합됩니다.', strength:'창의적 통찰·표현력·적응력', weakness:'에너지 분산·집중력 부족', love:'지적이고 창의적인 파트너', career:'기획·마케팅·교육·전략·컨설팅', image:'봄 숲을 적시는 큰 강 — 창의적 에너지가 흐른다'},
    '壬辰': {core:'큰 강이 비옥한 대지를 가로지르는 상(象). 편관(偏官)의 기운으로 강한 리더십이 있습니다.', strength:'강한 리더십·통찰·현실 추진력', weakness:'지나친 통제욕·주변과의 마찰', love:'자신의 강한 리더십을 따를 수 있는 파트너', career:'경영·정치·금융·법률·전략', image:'대지를 가로지르는 큰 강 — 막을 수 없는 힘'},
    '壬午': {core:'큰 강이 뜨거운 태양 아래 증발하는 상(象). 정재(正財)의 기운으로 현실적 재물 감각이 강합니다.', strength:'현실적 재물 감각·안정 추구', weakness:'과열된 상황에서 에너지 소실', love:'안정적이고 현실적인 파트너', career:'금융·무역·부동산·자산관리', image:'태양 아래의 강 — 에너지를 지키는 것이 과제'},
    '壬申': {core:'큰 강이 금속 산을 흘러내리는 상(象). 편인(偏印)의 기운으로 독창적 사고가 강합니다.', strength:'독창성·통찰·빠른 적응력', weakness:'지나친 독자 노선으로 고립', love:'자신의 독창성을 인정하는 파트너', career:'연구·혁신 사업·전략·컨설팅', image:'산에서 흘러내리는 강 — 독창적 길을 만든다'},
    '壬戌': {core:'큰 강이 가을 산 속에 담긴 상(象). 편재(偏財)의 기운으로 재물 감각이 강합니다.', strength:'재물 감각·통찰·현실적 적응력', weakness:'감정적 결정으로 재물을 잃는 경향', love:'현실적이고 통찰력 있는 파트너', career:'금융·무역·사업·투자', image:'산 속의 큰 강 — 깊은 재물 통찰'},
    // ── 계수(癸) 일간 6개 ──
    '癸丑': {core:'지하수가 비옥한 대지 속을 흐르는 상(象). 비겁이 강해 섬세하고 끈질깁니다.', strength:'끈질긴 인내·섬세한 통찰·안정 추구', weakness:'소심한 결정·자기 표현 부족', love:'자신을 이해해주는 따뜻한 파트너', career:'바이오·연구·상담·데이터운영', image:'보이지 않는 곳에서 세상을 적시는 지하수'},
    '癸卯': {core:'봄비가 봄 숲을 촉촉하게 적시는 상(象). 식신(食神)의 기운으로 감성적 창의력이 뛰어납니다.', strength:'감성적 창의력·따뜻한 표현·치유 능력', weakness:'감정 기복·현실 감각 부족', love:'감성적 교감이 깊은 파트너', career:'예술·상담·교육·의료·사회복지', image:'봄 숲을 적시는 봄비 — 세상을 부드럽게 바꾼다'},
    '癸巳': {core:'지하수가 따뜻한 불꽃 아래 증발하는 상(象). 편관(偏官)의 강한 압박이 깊은 내공을 만듭니다.', strength:'깊은 통찰·내면의 강인함·분석력', weakness:'압박에 의한 건강 문제·스트레스', love:'자신을 깊이 이해하는 파트너', career:'연구·분석·의료·상담·법률', image:'불 아래의 지하수 — 보이지 않지만 강하다'},
    '癸未': {core:'봄비가 여름 대지를 적시는 상(象). 편재(偏財)의 기운으로 재물 감각이 있습니다.', strength:'감성적 재물 감각·창의성·적응력', weakness:'감정적 결정으로 재물을 잃음', love:'감성적이고 따뜻한 관계', career:'상담·예술·마케팅·뷰티·음식', image:'여름 대지의 봄비 — 따뜻하고 풍요롭다'},
    '癸酉': {core:'지하수가 정밀한 보석을 만나는 상(象). 정인(正印)의 기운으로 학문과 전문성이 강합니다.', strength:'전문성·섬세한 지적 감수성·완성도', weakness:'지나친 완벽주의', love:'지적이고 품격 있는 파트너', career:'연구·의료·법률·예술·전문직', image:'보석과 만난 지하수 — 정밀하고 섬세하다'},
    '癸亥': {core:'깊은 바다가 또 다른 깊은 물과 만나는 상(象). 비겁이 강해 직관과 통찰이 극대화됩니다.', strength:'깊은 통찰·직관·분석력·지혜', weakness:'과잉 사색으로 행동이 느림', love:'서로의 깊은 내면을 이해하는 파트너', career:'연구·철학·상담·전략', image:'바다와 바다가 만나는 곳 — 끝없는 깊이'}
};

// 일주 특성 조회 함수
function getIljuProfile(dayStem, dayBranch) {
    var key = (dayStem||'') + (dayBranch||'');
    return ILJU_60_DB[key] || null;
}

/** SAJU_DB.ILJU — 렌더 시 이름·톤 정리 */
function getIljuDbEntry(data, iljuKey) {
    var key = iljuKey || ((data && data.dayStem && data.dayBranch) ? (data.dayStem + data.dayBranch) : '');
    var raw = (window.SAJU_DB && window.SAJU_DB.ILJU && window.SAJU_DB.ILJU[key]) || {};
    if (!raw || typeof raw !== 'object') return {};
    var out = {};
    ['title', 'core', 'weapon', 'love'].forEach(function (f) {
        if (raw[f] != null && raw[f] !== '') out[f] = voicePolishParagraph(data, raw[f]);
    });
    return out;
}

/** ILJU_60_DB — 렌더 시 이름·톤 정리 */
function getIljuProfilePolished(data, dayStem, dayBranch) {
    var prof = getIljuProfile(dayStem, dayBranch);
    if (!prof) return null;
    var out = {};
    ['core', 'strength', 'weakness', 'love', 'career'].forEach(function (f) {
        if (prof[f] != null && prof[f] !== '') out[f] = voicePolishParagraph(data, prof[f]);
    });
    if (prof.image) out.image = prof.image;
    return out;
}


// ══════════════════════════════════════════════════════
// ② 십성 × 나이대 사건 예측 DB
// ══════════════════════════════════════════════════════
var SIPSEONG_AGE_EVENT = {
    '비견': {youth:'라이벌이 붙을 때마다 스스로를 끌어올리느라 숨이 찼을 수 있습니다. 그건 공격성이 아니라, 비견이 경쟁판을 인지하는 방식입니다. **패배를 두려워하지 마십시오. 한 시즌에 라이벌은 한 명만** 두십시오.',middle:'독립 기반이 굳어지는 시기입니다. 사업·자영업으로 판을 옮기는 결정이 올 수 있습니다. **동업은 서면 범위 없이 답하지 마십시오.**',late:'현역 경쟁이 길게 이어집니다. 후배의 도전이 부담이 아니라 갱신 신호로 오십시오. **멘토링 한 축만** 남기고 나머지는 거절하십시오.'},
    '겁재': {youth:'크게 잃고 다시 일어서는 파도를 겪었을 수 있습니다. 그건 나약함이 아니라, 겁재가 손익을 가르키는 방식입니다. **연대보증·지분 서명은 절대 혼자 하지 마십시오.**',middle:'재물과 사업에서 승부수가 보입니다. **손실 한도를 숫자로 적어 지갑에** 넣고 움직이십시오.',late:'실전 경험이 자산입니다. 위기 자문으로 수익이 열릴 수 있습니다. **조언은 유료로만** 고정하십시오.'},
    '식신': {youth:'“이것이 내 것이다”라는 확신이 드는 활동을 만납니다. 재능을 숨기느라 답답했을 수 있습니다. **좋아하는 것을 주 3시간 블록**으로만 먼저 지키십시오.',middle:'재능이 수입으로 연결됩니다. **저작권·계약서 한 장**을 먼저 갖추십시오.',late:'기술과 재능이 레거시가 됩니다. 후학은 **한 커리큘럼만** 완주시키십시오.'},
    '상관': {youth:'질서에 맞서는 경험이 반복됩니다. 상사와의 마찰이 억울했을 수 있습니다. 그건 반항이 아니라, 상관이 기준을 다시 쓰는 힘입니다. **말하기 전 1분 타이머**를 걸십시오.',middle:'영향력 무대가 열립니다. **발표·강의는 월 2회 상한**을 두십시오.',late:'살아온 방식이 기준이 됩니다. **글로 남길 주장은 한 가지 테마만** 고르십시오.'},
    '정재': {youth:'천천히 기반을 쌓는 시기입니다. 느리다고 자책하지 마십시오. **저축·기술 중 하나만** 메인으로 두십시오.',middle:'청년기의 누적이 자산으로 바뀝니다. **부동산·장기 계약은 이틀 유예** 후 서명하십시오.',late:'안정 구조 속에서 여유가 붙습니다. **현금 비중 분기마다** 한 번만 올리십시오.'},
    '편재': {youth:'돈의 기복이 컸을 수 있습니다. 그건 탐욕이 아니라, 편재가 흐름을 빨리 읽는 탓입니다. **한 번에 올인 금지, 채널은 세 개 이하**로 묶으십시오.',middle:'사업·투자의 결정적 타이밍이 옵니다. **핵심 2~3축만** 남기십시오.',late:'포트폴리오 관리가 본업이 됩니다. **분기 첫 주에만** 리밸런싱하십시오.'},
    '정관': {youth:'원칙과 서열을 배웁니다. 눈치를 보느라 지쳤을 수 있습니다. **약속은 이메일로만** 고정하십시오.',middle:'리더 자리가 자연스럽게 붙습니다. **직함 변경 시 R&R을 먼저** 받으십시오.',late:'명예가 자산입니다. **자문은 건당 조건을 글로** 남기십시오.'},
    '편관': {youth:'극한의 압박이 반복됩니다. 버티느라 몸이 먼저 갔을 수 있습니다. **밤 11시 이후 결정 금지**를 지키십시오.',middle:'위기 돌파력이 빛납니다. **책임 전가 오면 이메일로 범위 축소** 답장을 먼저 보내십시오.',late:'권위가 자연스럽게 생깁니다. **구조 조언만 받고 감정 사담은 끊으십시오.**'},
    '정인': {youth:'학업·자격에 몰입합니다. **자격은 한 번에 하나만** 끝내십시오.',middle:'전문성이 권위로 바뀝니다. **지식을 상품화할 때 가격표를 먼저** 적으십시오.',late:'지식이 빛납니다. **저술·강의는 한 궤적만** 유지하십시오.'},
    '편인': {youth:'남다른 방식으로 배웁니다. 이해받지 못했다고 자책하지 마십시오. **노하우는 폴더 하나에만** 모으십시오.',middle:'틈새 전문성이 빛납니다. **계약 없이 들어가지 마십시오.**',late:'비주류가 대세로 돌아옵니다. **브랜드 한 문장만** 고정하십시오.'}
};


// ══════════════════════════════════════════════════════
// ① 기둥 간 합충 구체 이벤트 DB + 감지 함수
// ══════════════════════════════════════════════════════
var PILLAR_HAP_DESC = {
    '子丑':'자축합(土) — 원국에서 자수와 축토가 합을 이룹니다. 재물과 학문이 결합되는 안정적 구조로, 이 합이 발동하는 대운·세운에 재물 기반이 강화됩니다.',
    '寅亥':'인해합(木) — 봄 나무의 기운이 강화되는 합입니다. 성장과 확장의 에너지가 증폭되며 새로운 시작과 도전에 특별한 힘이 실립니다.',
    '卯戌':'묘술합(火) — 목과 토가 합하여 화를 생성합니다. 표현력과 열정이 폭발하고 사교적 매력이 극대화됩니다.',
    '辰酉':'진유합(金) — 결단력과 전문성이 강화됩니다. 완성도에 대한 강박과 집중력이 동시에 나타납니다.',
    '巳申':'사신합(水) — 직관과 통찰력이 강화됩니다. 표면과 이면이 다른 복잡한 내면을 가질 수 있습니다.',
    '午未':'오미합(火土) — 안정적이면서도 따뜻한 에너지입니다. 인간관계에서 자연스럽게 중심이 되는 친화력이 있습니다.',
    '寅卯辰':'인묘진 방합(木局) — 원국에 목 기운이 최고조로 집중됩니다. 추진력·창의성·도전 본능이 극대화됩니다. 단 너무 빠른 확장으로 기반이 흔들릴 수 있습니다.',
    '巳午未':'사오미 방합(火局) — 열정·표현력·카리스마가 폭발합니다. 과열되지 않도록 냉정한 조절이 필요합니다.',
    '申酉戌':'신유술 방합(金局) — 결단력·추진력·완성도 추구가 극대화됩니다. 지나친 완벽주의를 조심하십시오.',
    '亥子丑':'해자축 방합(水局) — 통찰·지혜·적응력이 탁월합니다. 과잉 분석으로 실행을 미루는 패턴을 경계하십시오.',
    '子午':'자오충(水火冲) — 감성과 열정이 서로 충돌하는 구조입니다. 결정적 선택의 순간마다 극적인 변화가 따릅니다. 이 충이 발동하는 대운·세운에 거주지 이동·직업 변화·이별과 만남이 집중됩니다.',
    '丑未':'축미충(土土冲) — 안정을 원하지만 내부적으로 변화를 갈구하는 이중성이 있습니다. 20년 주기로 삶의 방향이 크게 흔들리는 사건이 찾아옵니다.',
    '寅申':'인신충(木金冲) — 성장 본능과 결단 본능이 충돌합니다. 시작하려는 힘과 마무리하려는 힘이 동시에 작용하여 진로 변경이 잦을 수 있습니다.',
    '卯酉':'묘유충(木金冲) — 창의성과 완성도가 충돌합니다. 관계에서 날카로운 갈등이 주기적으로 찾아옵니다.',
    '辰戌':'진술충(土土冲) — 새로운 것을 시작하고 싶은 욕구와 기존 것을 지키려는 욕구가 충돌합니다. 인생의 전환점마다 큰 고민이 따릅니다.',
    '巳亥':'사해충(火水冲) — 직관과 행동이 충돌합니다. 알면서도 실행하지 못하거나, 실행했지만 후회하는 패턴이 반복됩니다. 이 충이 발동하는 시기에 인생의 결정적 분기점이 찾아옵니다.'
};

function detectPillarInteractions(pillars) {
    var results = [];
    if(!pillars || pillars.length < 4) return results;
    var getH = function(p) { return p && p.h ? (typeof p.h==='string' ? p.h : p.h.join('')) : ''; };
    var branches = [getH(pillars[3])[1]||'', getH(pillars[2])[1]||'', getH(pillars[1])[1]||'', getH(pillars[0])[1]||''];
    var labels = ['년지','월지','일지','시지'];
    var HAP_PAIRS = [['子','丑'],['寅','亥'],['卯','戌'],['辰','酉'],['巳','申'],['午','未']];
    var CHUNG_PAIRS = [['子','午'],['丑','未'],['寅','申'],['卯','酉'],['辰','戌'],['巳','亥']];
    var BANGHAP = [['寅','卯','辰'],['巳','午','未'],['申','酉','戌'],['亥','子','丑']];
    BANGHAP.forEach(function(trio) {
        var hits = trio.filter(function(b){ return branches.indexOf(b)!==-1; });
        if(hits.length >= 3) {
            var desc = PILLAR_HAP_DESC[trio.join('')];
            if(desc) results.push({type:'방합', desc:desc});
        }
    });
    HAP_PAIRS.forEach(function(pair) {
        var i1=branches.indexOf(pair[0]), i2=branches.indexOf(pair[1]);
        if(i1!==-1 && i2!==-1 && i1!==i2) {
            var key=pair[0]+pair[1];
            var desc = PILLAR_HAP_DESC[key]||PILLAR_HAP_DESC[pair[1]+pair[0]]||null;
            if(desc) results.push({type:'지합', pos:labels[i1]+'+'+labels[i2], desc:desc});
        }
    });
    CHUNG_PAIRS.forEach(function(pair) {
        var i1=branches.indexOf(pair[0]), i2=branches.indexOf(pair[1]);
        if(i1!==-1 && i2!==-1 && i1!==i2) {
            var key=pair[0]+pair[1];
            var desc = PILLAR_HAP_DESC[key]||PILLAR_HAP_DESC[pair[1]+pair[0]]||null;
            if(desc) results.push({type:'충', pos:labels[i1]+'+'+labels[i2], desc:desc});
        }
    });
    return results;
}

function buildChapter1_Basic(data) {
    const name = data.name || '고객';
    const pillars = data.pillars || [];
    const iljuKey = (data.dayStem||'') + (data.dayBranch||'');
    const dbEntry = getIljuDbEntry(data, iljuKey);
    const isStrong = data.strengthText && (data.strengthText.includes('신강') || data.strengthText.includes('강'));
    const gongmangBranches = data.gongmang || [];
    const birthYear = data.birthYear || new Date(data.birthDate||'1988-01-01').getFullYear() || 1988;

    const OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    const ds = data.dayStem || '丙';
    const dayOh = OH[ds] || 'fire';
    const HK = {'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계','子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    const toKr = s => s ? [...s].map(c=>HK[c]||c).join('') : '';


    // ─── 나이대 기반 인생 기승전결 서사 (통합판) ───
    let _careerText = '', _loveText = '';
    let lifeNarr = (function() {
        var OH_KR = {'甲':'갑목','乙':'을목','丙':'병화','丁':'정화','戊':'무토','己':'기토','庚':'경금','辛':'신금','壬':'임수','癸':'계수'};
        var BRANCH_KR = {'子':'자수','丑':'축토','寅':'인목','卯':'묘목','辰':'진토','巳':'사화','午':'오화','未':'미토','申':'신금','酉':'유금','戌':'술토','亥':'해수'};
        var OH_ENG = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
        var BRANCH_ENG = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
        var GENERATES = {wood:'fire',fire:'earth',earth:'metal',metal:'water',water:'wood'};
        var CONTROLS  = {wood:'earth',fire:'metal',earth:'water',metal:'wood',water:'fire'};
        var generates = function(a,b){return GENERATES[a]===b;};
        var controls  = function(a,b){return CONTROLS[a]===b;};

        var ps = pillars || [];
        var getH = function(p) { return p && p.h ? (typeof p.h==='string' ? p.h : p.h.join('')) : ''; };
        var yH = getH(ps[3])||''; var mH = getH(ps[2])||''; var dH = getH(ps[1])||''; var hH = getH(ps[0])||'';
        var yStem=yH[0]||''; var yBr=yH[1]||'';
        var mStem=mH[0]||''; var mBr=mH[1]||'';
        var dStem=dH[0]||''; var dBr=dH[1]||'';
        var hStem=hH[0]||''; var hBr=hH[1]||'';
        var yOh=OH_ENG[yStem]||''; var mOh=OH_ENG[mStem]||'';
        var dOh=OH_ENG[dStem]||''; var hOh=OH_ENG[hStem]||'';
        var mBrOh=BRANCH_ENG[mBr]||''; var dBrOh=BRANCH_ENG[dBr]||'';

        var gm = data.gongmang || [];
        var gg = data.geokguk;
        var ggName = gg && gg.geokName ? gg.geokName : '';
        var sipseong = data.sipseong || {};
        var sortedSip = Object.entries(sipseong).sort(function(a,b){return b[1]-a[1];});
        var mainSip = sortedSip.length>0 ? sortedSip[0][0] : null;
        var iProf = (typeof getIljuProfilePolished === 'function') ? getIljuProfilePolished(data, dStem, dBr) : null;

        // 60일주 물상 핵심 한 줄
        var iljuImage = iProf ? iProf.image : '';
        var iljuCore = iProf ? iProf.core : '';

        // 신강/신약
        var strongText = isStrong
            ? nmDnimEun(name) + ' 사주는 신강(身强)에 가깝다고 볼 수 있어요. 에너지가 넘치면 방향만 틀려도 큰 마찰이 생깁니다. 그건 성격이 나빠서가 아니라, 일간의 기운이 원국에서 먼저 서 있기 때문입니다. **옳은 방향을 잡으면 폭발적인 성과가 나옵니다.** 소진이 빠르므로, 쉬는 날을 죄책감 없이 넣으십시오.'
            : nmDnimEun(name) + ' 사주는 신약(身弱)에 가깝다고 볼 수 있어요. 혼자 끌어가려다 지친 적이 있었을 수 있습니다. 그건 나약함이 아니라, 기운이 사람·환경과 맞물릴 때 배가 되는 구조입니다. **용신 쪽 기운이 있는 자리를 가까이 두면 체감이 달라집니다.**';

        // 오행 분포 핵심
        var wx = data.wuxing || {};
        var total = Object.values(wx).reduce(function(a,b){return a+b;},0)||1;
        var pct = function(k){return Math.round((wx[k]||0)/total*100);};
        var woodP=pct('wood'),fireP=pct('fire'),earthP=pct('earth'),metalP=pct('metal'),waterP=pct('water');
        var ohCore = '';
        if(woodP+fireP>=60) ohCore = '열정과 표현이 앞서는 구조입니다. 멈추면 가라앉는다고 느꼈을 수 있으나, 그건 결함이 아니라 속도의 부작용에 가깝습니다. **한 번에 세 가지 이상은 열지 마십시오.** 냉각 시간을 먼저 달력에 박으십시오.';
        else if(earthP+metalP>=60) ohCore = '안정과 결단이 삶의 축입니다. 변화가 두려워 타이밍을 놓친 적이 있었을 수 있습니다. 그건 비겁함이 아니라, 묵직함의 그림자입니다. **70%에서 한 번 밀어붙이는 연습**만 해도 기회가 살아납니다.';
        else if(waterP>=35) ohCore = '통찰이 먼저 옵니다. 분석이 완벽해질 때까지 기다리다 시기를 놓친 적이 있었을 수 있습니다. 감각은 틀리지 않았습니다. **완벽보다 먼저 한 걸음**을 밟는 날짜만 정하십시오.';
        else if(woodP>=35) ohCore = '성장과 도전 본능이 강합니다. 여러 갈래로 뻗다 핵심을 잃은 적이 있었을 수 있습니다. **이번 분기 메인 축은 하나만** 적고 나머지는 보류하십시오.';
        else if(metalP>=35) ohCore = '완성도와 기준이 높습니다. 완벽한 타이밍을 기다리다 기회를 놓친 적이 있었을 수 있습니다. **60% 확신에서 실행**으로만 규칙을 바꾸십시오.';

        // 격국 핵심 풀이
        var GG_LIFE = {
            '정재격':'꾸준히 자산을 쌓는 구조입니다. 화려한 한 방보다 복리와 신뢰가 이 사주의 재물 공식입니다. **고정비 한 줄을 매주 금요일에만** 열어보십시오.',
            '편재격':'사람과 기회 사이에서 흐름을 만드는 구조입니다. 한 축보다 여러 수입 줄이 맞습니다. **새 통장·새 계좌는 분기에 하나만** 허용하십시오.',
            '정관격':'조직과 원칙 안에서 올라가는 구조입니다. 명예가 수입보다 먼저 올 수 있습니다. **직함보다 보고 라인을 먼저** 고정하십시오.',
            '편관격':'압박이 클수록 단단해지는 구조입니다. 편안한 자리보다 긴장이 있는 판에서 진가가 납니다. **밤 11시 이후 결정은 다음 날 아침**으로만 미루십시오.',
            '식신격':'재능이 수입으로 이어지는 구조입니다. 좋아하는 것을 갈고닦을수록 돈이 따라옵니다. **포트폴리오 한 건을 끝까지** 보여주십시오.',
            '상관격':'틀을 새로 쓰는 힘이 있습니다. 조직보다 자율이 맞는 경우가 많습니다. **말하기 전 1초, 문자 보내기 전 1분**을 스스로 걸으십시오.',
            '편인격':'남들이 안 가는 길에서 전문성이 생깁니다. **지식재산·계약서 한 장**을 먼저 챙기십시오.',
            '정인격':'배울수록 가치가 오릅니다. 자격·신뢰가 장기 수입의 기둥입니다. **검증되지 않은 강의 투자는 유예**하십시오.',
            '비겁격':'자율이 보장될 때 능력이 폭발합니다. 독립과 경쟁이 키워드입니다. **동업 제안은 서면 범위 없이 답하지 마십시오.**'
        };
        var ggText = ggName ? (GG_LIFE[ggName]||ggName) : '';

        // 기둥 간 생극 — 인생 서사 연결
        var GENEK = {wood:{fire:'목생화',fire2:'불'},fire:{earth:'화생토'},earth:{metal:'토생금'},metal:{water:'금생수'},water:{wood:'수생목'}};
        var CTRL  = {wood:{earth:'목극토'},fire:{metal:'화극금'},earth:{water:'토극수'},metal:{wood:'금극목'},water:{fire:'수극화'}};
        var OH_NM = {wood:'나무',fire:'태양·불꽃',earth:'흙·산',metal:'쇠·금속',water:'물·강'};

        // 월지→일간 관계 (가장 중요 — 청년기)
        var mBrDRelation = '';
        if(generates(mBrOh,dOh)) {
            var genNm = (GENEK[mBrOh]&&GENEK[mBrOh][dOh])||('');
            mBrDRelation = '15~35세에는 든든한 멘토나 파트너를 만나면 능력이 배로 붙는 구조입니다. 혼자서 버티느라 지쳤을 수 있습니다. 그건 약함이 아니라, 아직 맞는 손을 못 잡았기 때문입니다. **도움을 청하는 연습을 먼저** 하십시오.';
        } else if(controls(mBrOh,dOh)) {
            mBrDRelation = '15~35세에는 직장·사회에서 압박이 반복될 수 있습니다. 능력이 부족해서가 아니라, 아직 맞는 환경을 찾지 못했기 때문에 가깝습니다. **이때 쌓인 내공은 이후 20년의 방패**가 됩니다.';
        } else if(controls(dOh,mBrOh)) {
            mBrDRelation = '15~35세에는 순응보다 자기 방식을 세우는 기질이 강합니다. 조직보다 독립 포지션에서 진가가 드러나기 쉽습니다. **R&R을 글로 남기는 습관**만으로도 마찰이 줄어듭니다.';
        } else {
            mBrDRelation = '15~35세에는 말·속도·돈 기준이 비슷한 사람들이 곁에 붙습니다. 감정 소모가 큰 관계는 길게 가기 어렵습니다. **만남은 주 2회로 줄이고, 약속은 같은 요일·같은 시간대**로만 잡으십시오.';
        }

        // 공망: 원국 네 기둥 중 지지가 일주 기준 공망에 해당할 때만 통변 문단에 포함 (일주만으로 정해지는 공망 두 지지 자체로는 글을 붙이지 않음)
        var gmText = '';
        var gmHitPillars = (ps||[]).filter(function(p){
            var h = getH(p);
            return h.length > 1 && gm.indexOf(h[1]) !== -1;
        });
        if(gmHitPillars.length > 0) {
            var BRKR={'子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
            var gmKr=gm.map(function(b){return (BRKR[b]||b);}).join('·');
            gmText = '\n\n⚠ '+nmUi(name)+' 사주에는 '+gmKr+' 기운이 공망입니다. 갈망이 큰 영역일수록 결정을 서두르고 싶어집니다. 그건 결핍이 아니라, 그 기운을 더 깊이 파고들라는 신호에 가깝습니다. **공망이 강하게 들어오는 대운·세운에는** 전세·근로·투자·가맹처럼 **한 번 동의하면 돈·기간이 묶이는 계약·전자서명**을 받은 당일 찍지 말고 **영업일 이틀만 비우십시오.** 그동안 조건·해지만 글로 점검하면 됩니다.';
        }

        // 십성 나이대별 사건
        var sipEventText = '';
        if(mainSip && SIPSEONG_AGE_EVENT[mainSip]) {
            var sev = SIPSEONG_AGE_EVENT[mainSip];
            sipEventText = '\n\n**['+mainSip+'] 기질로 본 나이대별 흐름:**\n• 15~35세: '+sev.youth+'\n• 35~55세: '+sev.middle+'\n• 55세~: '+sev.late;
        }

        // 기둥 합충 이벤트
        var pillarInts = (typeof detectPillarInteractions==='function') ? detectPillarInteractions(pillars) : [];
        var pillarIntText = '';
        if(pillarInts.length>0) {
            var HAPkr={'지합':'합','방합':'방합','충':'충'};
            pillarInts.forEach(function(r){
                var posText = (r && r.pos) ? r.pos : ((r && r.label) ? r.label : '');
                if(!posText) return;
                var descText = '';
                if (r && r.desc) {
                    var parts = String(r.desc).split('—');
                    descText = (parts[1] || parts[0] || '').trim();
                }
                var head = (r && r.type==='충')
                    ? ('원국에 '+posText+' 충(冲)이 있습니다.')
                    : '';
                var t = descText ? ((head ? (head + ' ') : '') + descText) : head;
                if(!t) return;
                pillarIntText += '\\n• '+t.trim();
            });
        }

        // ─── 서사 조립 ───
        var narr = '';

        // 1) 일주 핵심 — 물상 이미지로 소개 (한자 대신 그림 언어)
        var ILJU_IMG = {
            '甲子':{i:'대나무 숲을 달리는 쥐', d:'깊은 물기 위에서 쉼 없이 달리는 쥐처럼, 영리하고 재빠르게 기회를 잡는 형상입니다.'},
            '甲寅':{i:'원시림을 누비는 호랑이와 거목', d:'숲의 제왕 호랑이가 거대한 나무 사이를 당당히 누비는 형상입니다.'},
            '甲辰':{i:'용이 서린 산꼭대기의 소나무', d:'용의 기운을 품은 산 정상에 굳건히 자리한 소나무의 형상입니다.'},
            '甲午':{i:'태양 아래 뛰어오르는 말과 고목', d:'뜨거운 태양 아래 고목 옆에서 힘차게 달리는 말의 형상입니다.'},
            '甲申':{i:'절벽을 오르는 원숭이와 나무', d:'바위 절벽에서도 나무를 타고 자유롭게 오르내리는 원숭이의 형상입니다.'},
            '甲戌':{i:'가을 들판을 지키는 개와 거목', d:'황금빛 가을 들판에서 의리 있게 자리를 지키는 개와 거목의 형상입니다.'},
            '乙丑':{i:'겨울 논밭에서 일하는 소', d:'차가운 겨울 땅을 묵묵히 갈아엎는 소처럼 강인하고 성실한 형상입니다.'},
            '乙卯':{i:'봄 들판을 뛰어다니는 토끼', d:'봄기운 가득한 들판에서 자유롭게 뛰어노는 토끼처럼 생동감 넘치는 형상입니다.'},
            '乙巳':{i:'꽃을 감아 오르는 뱀', d:'따사로운 햇살 아래 피어난 꽃을 부드럽게 감아 오르는 뱀의 형상입니다.'},
            '乙未':{i:'꽃밭에서 노니는 양', d:'향기로운 여름 꽃밭에서 평화롭게 노니는 양의 형상입니다.'},
            '乙酉':{i:'서리 속에 우는 닭', d:'차가운 가을 서리 속에서도 새벽을 알리는 닭처럼 의연한 형상입니다.'},
            '乙亥':{i:'연못 위를 헤엄치는 돼지', d:'잔잔한 연못 수련 위를 여유롭게 노니는 돼지처럼 풍요로운 형상입니다.'},
            '丙子':{i:'겨울 밤 횃불 앞의 쥐', d:'어둡고 차가운 겨울 밤, 횃불 빛에 반짝이는 눈으로 기회를 노리는 쥐의 형상입니다.'},
            '丙寅':{i:'한낮 태양이 등에 탄 붉은 호랑이', d:'찬란한 태양 빛을 등에 두른 호랑이가 산을 달리는 형상입니다.'},
            '丙辰':{i:'구름 위로 솟아오르는 용', d:'두터운 구름을 뚫고 태양 빛을 등에 업은 용이 당당히 솟아오르는 형상입니다.'},
            '丙午':{i:'정오 태양 아래 달리는 천마', d:'하늘 한가운데 강렬한 태양 아래 천둥처럼 달리는 말의 형상입니다.'},
            '丙申':{i:'황금빛 노을을 달리는 원숭이', d:'석양의 붉은 빛 속에서 빠르고 영리하게 움직이는 원숭이의 형상입니다.'},
            '丙戌':{i:'석양 황야를 달리는 개', d:'붉게 물드는 저녁 노을 속에서 자유롭게 달리는 개의 형상입니다.'},
            '丁丑':{i:'겨울 화로 곁의 소', d:'혹독한 추위 속에서 화로 곁에 묵묵히 앉아 있는 소처럼 따뜻하고 강인한 형상입니다.'},
            '丁卯':{i:'봄밤 달빛 아래 토끼', d:'고요한 봄밤 달빛 아래 조용히 앉아 있는 토끼처럼 섬세하고 감성적인 형상입니다.'},
            '丁巳':{i:'촛불 주위를 감도는 뱀', d:'신비롭게 타오르는 촛불 주위를 천천히 감도는 뱀의 형상입니다.'},
            '丁未':{i:'달빛 아래 잠드는 양', d:'부드러운 여름 달빛 아래 풀밭에서 평화롭게 잠드는 양의 형상입니다.'},
            '丁酉':{i:'가을 달빛 속의 금빛 닭', d:'가을 달빛을 받아 황금빛으로 빛나는 닭처럼 정교하고 빛나는 형상입니다.'},
            '丁亥':{i:'깊은 물 속에서 빛나는 돼지별', d:'깊은 물 속에서도 꺼지지 않는 불꽃처럼, 돼지의 풍요로운 기운이 빛나는 형상입니다.'},
            '戊子':{i:'깊은 호수를 지키는 쥐와 산', d:'거대한 산이 쥐처럼 영리한 눈으로 호수를 품고 지키는 묵직한 형상입니다.'},
            '戊寅':{i:'호랑이가 서식하는 깊은 산', d:'생명력이 넘치는 산속에서 호랑이가 자유롭게 누비는 웅장한 형상입니다.'},
            '戊辰':{i:'용이 사는 깊은 산맥', d:'용이 구름 위를 오가는 거대하고 신비로운 산맥의 형상입니다.'},
            '戊午':{i:'사막 산을 달리는 말', d:'뜨거운 태양 아래 거대한 사막 산을 질주하는 말의 형상입니다.'},
            '戊申':{i:'바위산을 뛰노는 원숭이', d:'금속처럼 단단한 바위산에서 자유롭게 도약하는 원숭이의 형상입니다.'},
            '戊戌':{i:'황토 산을 지키는 개', d:'황금빛 노을 속에서 굳건히 산을 지키는 충직한 개의 형상입니다.'},
            '己丑':{i:'논밭을 가는 소', d:'비옥한 논밭을 묵묵히 갈아엎는 소처럼 성실하고 실용적인 형상입니다.'},
            '己卯':{i:'봄 들판을 뛰어다니는 토끼', d:'봄비를 맞으며 초록 들판을 생기 넘치게 뛰어다니는 토끼의 형상입니다.'},
            '己巳':{i:'햇살 가득한 들판의 뱀', d:'따뜻한 햇살 아래 들판을 유유히 가로지르는 뱀의 형상입니다.'},
            '己未':{i:'초록 목장을 노니는 양 떼', d:'풍요롭고 부드러운 초록 목장에서 양 떼가 평화롭게 노니는 형상입니다.'},
            '己酉':{i:'황금 들판의 닭', d:'가을 황금빛 들판에서 당당히 서 있는 닭처럼 풍요롭고 완성된 형상입니다.'},
            '己亥':{i:'강물 흐르는 논밭의 돼지', d:'차갑고 깊은 물이 흐르는 논밭에서 여유롭게 노니는 돼지처럼 풍요로운 형상입니다.'},
            '庚子':{i:'깊은 물 속 쥐가 지키는 보검', d:'영리한 쥐가 차가운 깊은 물 속에서 날카로운 보검을 지키는 형상입니다.'},
            '庚寅':{i:'호랑이가 문 날카로운 검', d:'호랑이의 날카로운 이빨처럼 강렬하고 두려운 검의 형상입니다.'},
            '庚辰':{i:'용의 비늘 같은 강철 갑옷', d:'용처럼 강인하고 눈부시게 빛나는 금속 갑옷의 형상입니다.'},
            '庚午':{i:'불 속에서 단련되는 명검과 말', d:'뜨거운 불꽃 속에서 달리는 말처럼 단련되며 더 강해지는 명검의 형상입니다.'},
            '庚申':{i:'원숭이가 든 번개 도끼', d:'번개처럼 빠른 원숭이가 날카로운 도끼를 휘두르는 형상입니다.'},
            '庚戌':{i:'개가 지키는 가을 황야의 철검', d:'서늘한 가을 황야에서 충직한 개가 날카로운 철검을 지키는 형상입니다.'},
            '辛丑':{i:'소가 캐낸 땅 속의 원석', d:'묵묵히 땅을 파는 소가 찾아낸 빛나는 원석처럼 숨겨진 가치의 형상입니다.'},
            '辛卯':{i:'토끼가 발견한 봄빛 보석', d:'봄 들판을 뛰어다니는 토끼가 발견한 햇빛 속 보석처럼 반짝이는 형상입니다.'},
            '辛巳':{i:'뱀의 비늘처럼 빛나는 은빛 장신구', d:'뱀의 비늘처럼 섬세하고 신비롭게 빛나는 은빛 장신구의 형상입니다.'},
            '辛未':{i:'양이 발견한 다이아몬드', d:'온순한 양이 풀밭에서 발견한 다이아몬드처럼 숨겨진 특별한 가치의 형상입니다.'},
            '辛酉':{i:'닭이 쪼아낸 완성된 백금 보석', d:'날카로운 닭의 부리로 정교하게 쪼아 완성한 백금 보석의 형상입니다.'},
            '辛亥':{i:'돼지가 찾은 깊은 바다의 진주', d:'깊은 바닷속에서 돼지의 복스러운 기운이 만들어낸 영롱한 진주의 형상입니다.'},
            '壬子':{i:'한겨울 밤 대양을 헤엄치는 쥐', d:'광활하고 깊은 겨울 대양을 두려움 없이 헤엄치는 쥐처럼 대담한 형상입니다.'},
            '壬寅':{i:'폭포를 거슬러 오르는 호랑이', d:'호랑이처럼 거침없이 산속 폭포를 거슬러 오르는 힘찬 강물의 형상입니다.'},
            '壬辰':{i:'용이 잠든 깊은 연못', d:'용이 잠든 신비롭고 깊은 연못처럼 헤아릴 수 없는 깊이를 품은 형상입니다.'},
            '壬午':{i:'불꽃 위를 달리는 붉은 말', d:'뜨거운 불기운 위를 달리는 말처럼 역동적이고 강렬한 에너지의 형상입니다.'},
            '壬申':{i:'원숭이가 노는 폭포', d:'금속 같은 바위를 타고 자유롭게 뛰어내리는 폭포 위의 원숭이 형상입니다.'},
            '壬戌':{i:'황혼 속 강을 달리는 개', d:'노을이 지는 하늘 아래 강물 따라 자유롭게 달리는 개의 형상입니다.'},
            '癸丑':{i:'겨울 논밭을 갈아엎는 소와 지하수', d:'차가운 땅 속 지하수처럼, 소가 묵묵히 갈아엎는 논밭 아래 숨겨진 생명력의 형상입니다.'},
            '癸卯':{i:'봄비 속 토끼', d:'봄비를 맞으며 새싹과 함께 기뻐하는 토끼처럼 생명력 넘치는 형상입니다.'},
            '癸巳':{i:'뱀 위의 이슬방울', d:'뜨거운 뱀의 몸 위에서도 사라지지 않는 맑고 강인한 이슬방울의 형상입니다.'},
            '癸未':{i:'소나기를 맞는 양 떼', d:'무더운 여름 시원한 소나기를 맞으며 기뻐하는 양 떼처럼 시원하고 강렬한 형상입니다.'},
            '癸酉':{i:'새벽 이슬을 터는 닭', d:'가을 새벽 첫 울음과 함께 나뭇잎 이슬을 터는 닭처럼 정화되고 섬세한 형상입니다.'},
            '癸亥':{i:'겨울 밤 빗속의 돼지', d:'겨울 밤 빗소리처럼 깊고 신비로운 돼지의 풍요로운 내면의 형상입니다.'}
        };
        var iljuImgData = ILJU_IMG[dStem+dBr] || null;
        if(iljuCore || iljuImgData) {
            var imgTxt = iljuImgData ? iljuImgData.i : (dStem+dBr);
            var descTxt = iljuImgData ? iljuImgData.d : '';
            narr += nmUi(name)+' 사주는 그림으로 표현하면 — 「'+imgTxt+'」입니다.\n';
            if(descTxt) narr += descTxt + '\n';
            if(iljuCore) narr += iljuCore + ' **일주의 무게를 탓하지 마십시오. 한 달에 바깥에 꺼낼 목표는 하나만 고르십시오.**\n\n';
        }

        // 2) 신강/신약 + 오행 핵심
        narr += strongText + '\n';
        if(ohCore) narr += ohCore + '\n';
        if(ggText) narr += '\n'+ggText+'\n';

        // 3) 나이대 흐름
        narr += '\n━━━━━━━━━━━━━━━━\n';
        narr += '🌱 유년기(0~15세) — '+nmUi(name)+' 뿌리\n';
        narr += '━━━━━━━━━━━━━━━━\n';
        var YEAR_LIFE_SIMPLE = {
            earth: nmUi(name)+' 0~15세는 안정을 중시하는 가정 환경 속에서 원칙과 책임감이 형성되는 시기입니다. 이 시기에 익힌 성실함과 인내가 평생의 중심축이 됩니다. ▸ 흥망: 이 시기를 어떻게 보냈느냐에 따라 평생의 안정 기반이 달라집니다. ▸ 보완: 너무 이른 책임감이 짐이 되지 않도록, 실패해도 된다는 경험을 쌓는 것이 중요합니다.',
            wood: nmUi(name)+' 0~15세는 개척적이고 주도적인 기질이 발현되는 시기입니다. 또래보다 먼저 무언가를 시작하려는 본능이 두드러집니다. ▸ 흥망: 이 에너지가 긍정적으로 발현되면 리더십으로, 억압되면 반항심으로 나타납니다. ▸ 보완: 새로운 것을 배울 기회를 충분히 주면 타고난 잠재력이 꽃을 피웁니다.',
            fire: nmUi(name)+' 0~15세는 표현력과 존재감이 남다른 시기입니다. 어릴 때부터 사람들 앞에 서는 것을 좋아하고 주목받는 경험이 자신감의 기초가 됩니다. ▸ 흥망: 표현과 인정의 경험이 풍부할수록 성인 이후 리더십이 강해집니다. ▸ 보완: 주목받지 못하면 크게 흔들릴 수 있으니, 작은 성취도 충분히 인정해주는 환경이 중요합니다.',
            metal: nmUi(name)+' 0~15세는 기준이 높고 완벽을 추구하는 기질이 형성되는 시기입니다. "왜?"라는 질문과 높은 완성도 의식이 어릴 때부터 나타납니다. ▸ 흥망: 이 기질이 잘 발달하면 탁월한 전문가로, 억압되면 완벽주의 함정에 빠집니다. ▸ 보완: 80점도 충분히 잘했다는 경험이 성인 이후 실행력을 높입니다.',
            water: nmUi(name)+' 0~15세는 섬세한 관찰력과 사색적 감수성이 형성되는 시기입니다. 남들보다 더 많이 느끼고 생각하는 내면의 풍부함이 이 시기에 뿌리를 내립니다. ▸ 흥망: 이 감수성이 잘 발달하면 깊은 통찰력으로, 너무 억압되면 사회 불안으로 발전할 수 있습니다. ▸ 보완: 감정을 말·일기·운동 등 건전한 통로로 바깥으로 보내는 습관을 어릴 때부터 익히는 것이 중요합니다.'
        };
        narr += (YEAR_LIFE_SIMPLE[yOh]||'') + '\n';

        narr += '\n━━━━━━━━━━━━━━━━\n';
        narr += '🔥 청년기(15~35세) — 방향을 찾는 시절\n';
        narr += '━━━━━━━━━━━━━━━━\n';
        narr += mBrDRelation + '\n';



        narr += '\n━━━━━━━━━━━━━━━━\n';
        narr += '⚡ 중년기(35~55세) — 꽃이 피는 시절\n';
        narr += '━━━━━━━━━━━━━━━━\n';
        var MID = {
            fire: nmUi(name)+' 35~55세는 【흥(興)의 절정기】입니다. 직업: 20~30대에 흩어졌던 에너지가 하나로 모이며, 처음으로 "내 힘으로 만든 결과"가 세상에 드러납니다. 이 시기에 사업 확장·직급 상승·사회적 인정이 집중됩니다. 재물: 가장 많이 벌고 가장 많이 쓰는 시기입니다. 수입이 늘어나는 만큼 장기 자산 구조를 잡아야 합니다. 보완: 과로와 건강 방치가 이 시기 최대 위험입니다. 연 1회 이상 정기 검진을 가능하면 받으십시오.',
            wood: nmUi(name)+' 35~55세는 방향이 잡히며 진짜 도약이 시작되는 시기입니다. 직업: 35세 전후 중요한 방향 전환 결정이 기다립니다. 이 결정이 이후 20년을 결정합니다. 늦었다고 느껴도 지금이 가장 빠른 시작입니다. 재물: 초기 투자·창업·신규 수입원 개척에 가장 강한 에너지를 받는 시기입니다. 보완: 너무 많은 방향으로 동시에 뻗으려는 충동을 제어하십시오. 하나에 집중해야 결과가 납니다.',
            earth: nmUi(name)+' 35~55세가 인생 전성기입니다. 직업: 지금까지 묵묵히 쌓아온 신뢰와 전문성이 가장 강력한 무기가 됩니다. 이 시기에 안정적 직위·사업 기반·사회적 신망이 확보됩니다. 재물: 부동산·장기 투자·안정적 자산 구축에 최적의 시기입니다. 보완: 너무 안정만 추구하다 기회를 놓치지 않도록, 계산된 리스크를 감수하는 용기가 필요합니다.',
            metal: nmUi(name)+' 35~55세는 전문성이 권위로 전환되는 시기입니다. 직업: 이 시기에 해당 분야에서 타의 추종을 불허하는 전문성이 완성됩니다. 누군가 의견을 구하는 사람이 되는 것이 목표입니다. 재물: 전문성 기반의 고수익 구조를 만드는 시기입니다. 컨설팅·강의·지식 판매 등 전문성을 상품화하십시오. 보완: 고집이 강해지는 시기입니다. 새로운 방식에 열린 태도를 의식적으로 유지하십시오.',
            water: nmUi(name)+' 35~55세는 오랜 축적이 가치로 전환되는 시기입니다. 직업: 분석력과 통찰이 인정받기 시작합니다. 자연스럽게 조언을 구하는 사람들이 모여드는 시기입니다. 재물: 정보와 지식이 돈으로 전환됩니다. 자신의 노하우를 체계화하면 장기적 수입원이 됩니다. 보완: 불안감이 커지기 쉬운 시기입니다. 행동하지 않으면 기회가 지나갑니다. 계획이 충분할 때에는 단계적으로 실행에 옮기십시오.'
        };
        narr += (MID[dOh]||nmUi(name)+' 35~55세는 인생의 꽃이 피는 시기입니다.') + '\n';

        // 일지 배우자궁 (중년기에 결합)
        var SPOUSE_SHORT = {
            '子':'배우자 관계에서 깊은 감성 교감이 핵심 포인트입니다. 대화가 통하는 지적인 파트너와 가장 잘 맞습니다.',
            '丑':'시간이 쌓일수록 더 든든해지는 관계를 만들어갑니다. 신뢰가 핵심 포인트입니다.',
            '寅':'서로의 독립성을 존중하는 것이 관계 지속의 열쇠입니다.',
            '卯':'소통과 감성적 연결이 핵심 포인트입니다. 대화가 잘 통하는 파트너와 최상의 관계가 됩니다.',
            '辰':'파트너를 통해 인생의 전환점이 찾아오는 구조입니다.',
            '巳':'지적 자극을 주는 관계여야 오래 갑니다. 함께 성장하는 파트너십이 맞습니다.',
            '午':'처음의 열정을 유지하는 것이 이 관계의 핵심 과제입니다.',
            '未':'서로를 부드럽게 감싸주는 따뜻한 관계가 맞습니다.',
            '申':'현실적 역할 분담과 능력 중심의 관계가 맞습니다.',
            '酉':'서로의 전문성을 인정하는 파트너십이 오래 갑니다.',
            '戌':'한번 맺은 관계를 오래 지키는 구조입니다. 의리가 핵심 포인트입니다.',
            '亥':'서로의 공간을 존중하는 지혜로운 관계가 맞습니다.'
        };
        if(SPOUSE_SHORT[dBr]) narr += '▸ 배우자·관계: '+SPOUSE_SHORT[dBr]+'\n';

        narr += '\n━━━━━━━━━━━━━━━━\n';
        narr += '🌙 말년(55세~) — 열매의 시절\n';
        narr += '━━━━━━━━━━━━━━━━\n';
        var LATE = {
            '子':'말년에 깊은 지혜가 주변 사람들을 모여들게 합니다. 조용하지만 영향력 있는 노년입니다.',
            '丑':'평생 쌓아온 것들이 든든한 울타리가 됩니다. 늦게 빛나는 시주로, 55세 이후가 가장 안정적인 시기입니다.',
            '寅':'말년에도 새로운 시작과 도전이 기다립니다. 노년에도 활동적인 삶이 계속됩니다.',
            '卯':'자녀·주변 사람들과의 풍성한 관계망이 노후를 지탱하는 가장 큰 자산입니다.',
            '辰':'예상치 못한 기회가 노년에도 찾아옵니다. 변화를 두려워하지 않으면 역동적인 노년이 됩니다.',
            '巳':'평생 쌓아온 전문성이 55세 이후 가장 빛납니다.',
            '午':'말년에도 에너지가 넘칩니다. 주변에 활력과 영감을 주는 어른이 됩니다.',
            '未':'감성과 따뜻함이 가득한 노년입니다. 예술·자연·인간적 온기가 삶을 풍요롭게 합니다.',
            '申':'빠른 변화 속에서도 현명한 판단력이 유지됩니다.',
            '酉':'평생의 전문성이 완전히 인정받는 시기입니다. 늦게 빛나는 유금의 속성대로 55세 이후가 전성기입니다.',
            '戌':'오래된 인연들이 노후를 지탱하는 가장 든든한 울타리가 됩니다.',
            '亥':'깊고 조용한 지혜가 빛나는 말년입니다. 영적·철학적 성숙이 이루어집니다.'
        };
        if(LATE[hBr]) narr += (LATE[hBr]||'') + '\n';

        // 합충 이벤트 (간략하게)
        if(pillarIntText) {
            narr += '\n━━━━━━━━━━━━━━━━\n';
            narr += '🔗 원국의 기운 특이점\n';
            narr += '━━━━━━━━━━━━━━━━\n';
            narr += pillarIntText + '\n';
        }

        // 십성 나이대 흐름 (간략하게)
        if(sipEventText) narr += sipEventText + '\n';

        // 공망
        if(gmText) narr += gmText + '\n';

        return narr;
    })();



    // 조후(태어난 계절 기운)와 격국(사주 구조)을 서사에 자연스럽게 녹임
    (function(){
        const johu = data.johu || '';
        const gg = data.geokguk;
        const mb = data.monthBranch || '';
        const SEASON_KR = {'寅':'이른 봄','卯':'한창 봄','辰':'늦봄','巳':'초여름','午':'한여름','未':'늦여름','申':'초가을','酉':'한가을','戌':'늦가을','亥':'초겨울','子':'한겨울','丑':'겨울 끝자락'};
        const seasonKr = SEASON_KR[mb] || '';

        // 조후 서사: "X월에 태어났다"는 식의 교과서 설명 제거 → 삶에 미치는 영향만 추출
        let johuNarr = '';
        if(johu && seasonKr) {
            // 조후 텍스트에서 핵심 균형 정보만 추출 (마지막 두 문장)
            const johuSentences = johu.replace(/[甲乙丙丁戊己庚辛壬癸]/g, '').split('。').join('.').split('.');
            const johuKey = johu.includes('절실히 필요') ? '절실히 필요한 기운이 있는 구조' :
                           johu.includes('없으면') ? '균형을 잡는 핵심 기운이 중요한 구조' :
                           johu.includes('폭발적') ? '봄이 오면 폭발적으로 성장하는 구조' :
                           johu.includes('황금기') ? '전성기가 뚜렷한 구조' : '균형이 잡히면 크게 도약하는 구조';
            johuNarr = `

${nmEunNeun(name)} ${seasonKr}에 태어났습니다. 이 계절의 기운이 사주 전체의 온도와 습도를 결정합니다. ${johu.split('.').slice(-3).join('.').trim()} 이 균형이 맞는 대운·세운이 찾아올 때 삶이 가장 크게 도약합니다.`;
        }

        // 격국 서사: "격국이 뭐야" 설명 없이 → 사회적 성취 방식만 서술
        let ggNarr = '';
        if(gg && gg.geokName && gg.info) {
            const GG_OH = {'정재격':'earth','편재격':'earth','정관격':'metal','편관격':'metal','식신격':'fire','상관격':'fire','편인격':'water','정인격':'water','비겁격':'wood'};
            const ggOh = GG_OH[gg.geokName] || '';
            const isSeong = data.yong && (data.yong === ggOh || data.hee === ggOh);
            const GG_NARR = {
                '정재격': isSeong
                    ? `재물에 관해 꼭 기억하셔야 할 것이 있습니다. ${nmIGa(name)} 돈을 버는 가장 강력한 방식은 화려한 한탕이 아닙니다. 한 사람 한 사람에게 쌓아온 신뢰가 결국 자산이 됩니다. 빠른 돈벌이를 좇아 이직을 반복하거나 충동적 투자에 뛰어드는 시기가 오면, 그때가 오히려 가장 위험한 순간입니다. 지금 있는 자리에서 신뢰를 쌓으십시오. 그것이 10년 후 가장 큰 자산이 됩니다.`
                    : `${nmDnim(name)}, 재물과 관련해서 반복되는 위험한 패턴이 있습니다. 가까운 사람에 의해 돈이 새거나 막히는 상황이 생깁니다. 이것을 막는 방법은 하나입니다 — 돈이 오고 가는 모든 관계에 계약서와 문서를 남기십시오. 감정이 있는 관계일수록 더 철저히 해야 합니다.`,
                '편재격': isSeong
                    ? `${nmEge(name)} 고정 월급만으로 사는 삶은 답답하실 수 있습니다. 검증된 부업·프로젝트 채널을 단계적으로 여시면 숨통이 트입니다. 사람과 사람 사이에서 기회를 만들어내고, 아이디어가 돈이 되는 방식이 이 사주에 맞는 구조입니다. 큰 판을 벌이는 것을 겁내지 않는 편이 좋습니다. 단, 한 번에 모든 것을 거는 도박은 피하십시오. 여러 판을 동시에 벌이는 것이 전략입니다.`
                    : `${nmEunNeun(name)} 재물을 크게 다루는 감각이 있지만, 한 번의 판단 실수로 크게 잃는 리스크가 함께 옵니다. 큰 투자 전에 가능하면 안전장치를 먼저 만드십시오. 잃어도 다시 시작할 수 있는 구조를 유지하는 것이 최우선입니다.`,
                '정관격': isSeong
                    ? `${nmIGa(name)} 사회에서 인정받는 방식은 분명합니다. 원칙을 지키고, 약속을 지키고, 자리에서 흔들리지 않는 것이 쌓이면 조직과 사람들이 먼저 당신을 찾아옵니다. 조급해하지 않는 편이 좋습니다. 꾸준히 쌓는 사람이 결국 가장 높은 곳에 올라가는 구조입니다.`
                    : `${nmDnim(name)}, 한 가지만 기억하십시오. 명예와 사회적 위치는 말 한마디, 행동 하나에 달려 있습니다. 감정이 격해지는 순간의 발언, 원칙을 조금만 어겨도 괜찮겠지라는 생각이 한순간에 모든 것을 무너뜨립니다. 평소에 지킨 원칙이 위기 때 당신을 지킵니다.`,
                '편관격': isSeong
                    ? `${nmUi(name)} 진짜 능력은 편한 환경에서 나오지 않습니다. 역경이 클수록, 경쟁이 치열할수록 더 강해지는 것이 이 사주의 특징입니다. 지금 힘들다면 — 그것은 당신이 맞는 자리에 있다는 신호일 수 있습니다. 버텨내는 것 자체가 당신의 무기입니다.`
                    : `${nmEge(name)} 가능하면 필요한 것이 있습니다 — 충동을 제어하는 구조. 강한 추진력이 방향 없이 폭발하면 사고, 갈등, 법적 문제로 이어질 수 있습니다. 당신을 냉정하게 붙잡아줄 수 있는 멘토나 파트너를 가능하면 옆에 두십시오.`,
                '식신격': isSeong
                    ? `${nmDnim(name)}, 좋아하는 일을 계속 파고드십시오. 재능과 수입이 연결되는 구조입니다. 예술, 요리, 교육, 기획, 창작 — 형태는 무엇이든 자신이 잘하고 즐기는 것을 업으로 삼으면 돈이 따라옵니다. 빠른 수익보다 재능의 깊이를 먼저 쌓으십시오.`
                    : `${nmDnim(name)}, 재능이 있어도 알리지 않으면 없는 것과 같습니다. 지금 당신에게 부족한 것은 능력이 아니라 알리는 방법입니다. 당신이 잘하는 것을 세상에 보여주는 방법을 찾는 것이 지금 가장 시급한 과제입니다.`,
                '상관격': isSeong
                    ? `${nmUi(name)} 가장 강력한 무기는 말과 생각입니다. 남들이 당연하다고 받아들이는 것에 "왜?"라고 묻는 능력이 당신을 차별화합니다. 조직 안에서 답답함을 느낀다면 독립적인 환경을 찾으십시오. 비판적 사고가 제약 없이 펼쳐질 때 가장 빛납니다.`
                    : `${nmDnim(name)}, 솔직히 말씀드립니다. 당신의 말이 때로 가장 중요한 관계를 끊습니다. 틀린 말이 아닐 수 있습니다. 그러나 맞는 말을 잘못된 방식으로 하면 결과는 같습니다. 말하기 전에 1초만 더 생각하십시오. 그 1초가 인생을 바꿉니다.`,
                '편인격': isSeong
                    ? `${nmEunNeun(name)} 남들이 가지 않은 길에서 나만의 전문성을 만들어내는 사람입니다. 기존의 방식을 답습하지 않는 편이 좋습니다. 독창적으로 파고든 분야에서 타의 추종을 불허하는 깊이가 만들어집니다. 고독하더라도 그 길을 가십시오. 그것이 당신만의 권위가 됩니다.`
                    : `${nmUi(name)} 전문성이 다른 사람에 의해 가로막히는 패턴이 반복됩니다. 내가 쌓아온 것을 지키는 것이 먼저입니다. 지식재산권, 계약 문서, 독립적 활동 환경을 가능하면 챙기십시오.`,
                '정인격': isSeong
                    ? `${nmEunNeun(name)} 배울수록 가치가 올라가는 사주입니다. 지금 당장의 돈보다 자격증, 학위, 공인된 전문성을 쌓는 것이 장기적으로 훨씬 더 큰 수입을 만들어냅니다. 배움을 멈추지 않는 편이 좋습니다. 노력이 배신하지 않는 구조입니다.`
                    : `${nmDnim(name)}, 배움에 대한 열망이 강한데 결실로 이어지지 않는 경험이 있으실 것입니다. 조심해야 할 것: 스승을 잘못 만나면 시간과 돈을 동시에 잃습니다. 검증되지 않은 교육 투자를 서두르지 않는 편이 좋습니다.`,
                '비겁격': isSeong
                    ? `${nmDnim(name)}, 조직 안에서 답답함을 느끼는 것은 당연합니다. 통제받는 환경보다 스스로 판을 벌이는 환경에서 진가가 나오는 사주입니다. 사업, 프리랜서, 전문직 — 방향은 달라도 독립이 핵심 포인트입니다. 언제 독립할 것인지를 항상 준비하십시오.`
                    : `${nmDnim(name)}, 혼자 다 하려 하지 않는 편이 좋습니다. 강한 자아가 오히려 더 큰 성과를 막고 있을 수 있습니다. 당신이 못하는 것을 잘하는 사람을 파트너로 두는 것이 지금 가장 필요한 전략입니다.`
            };
            ggNarr = '\n\n' + (GG_NARR[gg.geokName] || '');
        }

        if(johuNarr || ggNarr) {
            lifeNarr = lifeNarr + ggNarr + johuNarr;
        }

        // 재물/직업/애정/건강 단락 추가 — 아래 변수는 IIFE 바깥 스코프로 노출
        const OH2KR = {wood:'목(나무)',fire:'화(불)',earth:'토(흙)',metal:'금(쇠)',water:'수(물)'};
        const WX = data.wuxing || {};
        const maxOh2 = Object.keys(WX).length ? Object.keys(WX).reduce((a,b)=>WX[a]>WX[b]?a:b) : dayOh;

        const CAREER_MAP = {
            wood: isStrong ? nmEunNeun(name)+' 조직의 규칙이나 남이 정해놓은 틀 안에서는 반이 이하의 능력밖에 발휘하지 못합니다. 직접 기획하고, 개척하고, 처음 만들어나가는 자리에서 진짜 능력이 나옵니다. 창업, 신사업 기획, 1인 전문가, 선도자 — 이런 포지션이 맞습니다. 조직에 있다면 새로운 프로젝트를 먼저 제안하고 이끄는 역할을 찾으십시오.'
                : nmEunNeun(name)+' 강한 파트너나 든든한 조직의 지원을 받을 때 진짜 능력이 나옵니다. 혼자보다 팀으로, 독립보다 협력으로 직업적 성취를 쌓아가는 것이 이 사주의 전략입니다. 당신을 알아봐주는 리더 한 명을 찾는 것이 커리어의 분기점이 됩니다.',
            fire: isStrong ? nmEge(name)+' 무대가 없으면 에너지가 안으로 향합니다. 사람들 앞에 서고, 영향력을 발휘하고, 내 아이디어가 세상에 퍼지는 일 — 강연, 컨텐츠 창작, 세일즈, 리더십, 브랜딩이 천직입니다. 혼자 책상에 앉아 조용히 하는 일은 장기적으로 맞지 않습니다.'
                : nmEunNeun(name)+' 나를 알아봐 주는 환경에서 열정이 폭발합니다. 아직 그런 환경을 못 찾았다면, 지금이 바로 그것을 찾아야 할 시기입니다. 직업 선택보다 직장 환경과 상사 선택이 더 중요합니다.',
            earth: isStrong ? nmEunNeun(name)+' 장기적인 신뢰 관계를 기반으로 하는 직업에서 가장 빛납니다. 부동산, 금융, 컨설팅, 교육, 의료 — 오랫동안 같은 자리를 지키며 신뢰를 쌓아가는 직업이 맞습니다. 빠른 변화가 잦은 직종보다 안정적이고 깊이 있는 전문성을 쌓을 수 있는 분야를 선택하십시오.'
                : nmEge(name)+' 직업적 안정감은 선택이 아닌 필수 조건입니다. 수입이 들쭉날쭉한 환경은 실력과 상관없이 성과를 떨어뜨립니다. 기반을 먼저 만들고 그 위에서 도전하십시오.',
            metal: isStrong ? nmEunNeun(name)+' 전문성과 원칙이 인정받는 분야에서 타의 추종을 불허합니다. 법, 의학, 회계, 정밀 기술, 컨설팅 — 높은 기준이 요구되는 분야가 맞습니다. 하나의 전문 분야를 깊이 파고드는 전략이 넓게 아는 전략을 압도합니다.'
                : nmEunNeun(name)+' 능력이 있어도 그것을 인정받을 환경을 못 찾아 헤매는 시기가 길 수 있습니다. 환경 탓이 아니라 환경을 바꾸는 것이 답입니다. 지금의 직장이 당신의 기준을 알아봐 주지 않는다면, 그곳에서 소진되지 않는 편이 좋습니다.',
            water: isStrong ? nmUi(name)+' 직업적 강점은 통찰력과 전략적 사고입니다. 데이터 분석, 전략 기획, 투자, 연구, 컨설팅, 작가 — 깊이 생각하고 패턴을 읽어내는 능력이 핵심 경쟁력인 분야가 맞습니다. 단, 실행력을 의식적으로 끌어올리지 않으면 기회를 놓치는 패턴이 반복됩니다.'
                : nmEunNeun(name)+' 오랜 시간 준비하고 축적한 것이 한 번에 빛을 발하는 구조입니다. 조급해하지 않는 편이 좋습니다. 지금 쌓고 있는 것이 가능하면 결실이 됩니다.'
        };

        const LOVE_MAP = {
            wood: isStrong ? nmEunNeun(name)+' 연애와 결혼에서도 자신만의 방식을 고집하는 편입니다. 상대방이 내 방향성을 지지하고 함께 성장하려는 사람이어야 관계가 오래 갑니다. 내 길을 막거나 통제하려는 상대와는 가능하면 갈등이 생깁니다. 파트너를 선택할 때 "이 사람이 나의 성장을 응원하는가"를 가장 먼저 보십시오.'
                : nmEunNeun(name)+' 관계에서 헌신적이지만 그만큼 상처도 깊게 받는 구조입니다. 나를 지워가며 관계를 유지하는 패턴을 조심하십시오. 좋은 관계는 내가 나로 있을 수 있는 관계입니다.',
            fire: isStrong ? nmEunNeun(name)+' 연애에서 강렬하고 빠르게 타오릅니다. 그만큼 빠르게 식을 수도 있습니다. 처음의 뜨거운 감정이 식었을 때 진짜 감정이 무엇인지 스스로 물어보십시오. 장기적인 관계를 위해서는 상대방에게 공간을 주고 감정을 강요하지 않는 훈련이 필요합니다.'
                : nmEunNeun(name)+' 연애에서 상대방의 인정과 관심이 특히 필요합니다. 이것을 주는 사람을 찾는 것이 중요하지만, 그 필요 때문에 맞지 않는 관계에 오래 머무는 패턴도 조심하십시오.',
            earth: isStrong ? nmEunNeun(name)+' 신중하게 관계를 시작하고, 한번 마음을 주면 끝까지 지키는 스타일입니다. 이것이 가장 큰 강점이자 동시에 상처를 오래 품는 이유이기도 합니다. 관계에서 충분히 검증하는 것은 좋지만, 너무 오래 확인하다가 기회를 놓치지 않는 편이 좋습니다.'
                : nmEunNeun(name)+' 안정적인 관계에 대한 열망이 강합니다. 이 열망이 때로 맞지 않는 관계에도 매달리게 만듭니다. 관계의 안정보다 나 자신의 안정을 먼저 찾는 것이 순서입니다.',
            metal: isStrong ? nmEunNeun(name)+' 관계에서도 높은 기준을 적용합니다. 이상형이 구체적이고, 상대방에게 기대하는 것도 명확합니다. 이것이 잘 맞는 상대를 만나면 최고의 파트너십이 되지만, 현실의 사람에게 너무 높은 기준을 요구하면 외로워집니다. 완벽한 사람보다 함께 성장할 수 있는 사람을 찾으십시오.'
                : nmEunNeun(name)+' 연애에서 이상과 현실 사이에서 갈등하는 경우가 많습니다. 충분히 좋은 사람을 완벽하지 않다는 이유로 놓치지 않는 편이 좋습니다.',
            water: isStrong ? nmEunNeun(name)+' 상대방을 깊이 읽는 능력이 있습니다. 상대가 말하지 않은 것도 감지하는 예민함이 있습니다. 그러나 이 감각이 지나치면 관계에서 지나치게 분석하고, 상대의 작은 변화에 불안해하는 패턴이 생깁니다. 직관을 믿되, 결론을 너무 빨리 내리지 않는 편이 좋습니다.'
                : nmEunNeun(name)+' 관계에서 신중하고 천천히 마음을 여는 스타일입니다. 처음에는 느려 보여도 한번 깊어진 관계는 오래 갑니다. 마음을 여는 데 시간이 걸리는 자신을 탓하지 않는 편이 좋습니다. 그것이 당신의 방식입니다.'
        };

        // IIFE 반환값: career/love 텍스트 노출
        _careerText = CAREER_MAP[maxOh2] || CAREER_MAP[dayOh] || '';
        _loveText   = LOVE_MAP[maxOh2]   || LOVE_MAP[dayOh]   || '';
    })();



    const HAN_KOR_GM = {'子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    const BRANCH_OH_GM = {'子':'수','丑':'토','寅':'목','卯':'목','辰':'토','巳':'화','午':'화','未':'토','申':'금','酉':'금','戌':'토','亥':'수'};
    const PILLAR_NAME_GM = {'시주':'시주(말년·자녀)','일주':'일주(배우자·나 자신)','월주':'월주(부모·직업)','년주':'년주(조상·사회)'};
    // 공망이 있는 기둥 찾기
    const gongmangPillars = (pillars||[]).filter(p => p.h && gongmangBranches.includes(p.h[1]));
    const gmPillarNames = gongmangPillars.map(p => PILLAR_NAME_GM[p.n]||p.n).join(', ');
    const gmBranchNames = gongmangBranches.map(b => `${b}(${HAN_KOR_GM[b]||b}·${BRANCH_OH_GM[b]||''})`).join('·');
    // 공망 박스: 원국 8자에 실제로 공망 지지가 있는 경우만 표시
    const gongmangText = (() => {
        if (gongmangBranches.length === 0) return '';
        if (gongmangPillars.length === 0) return '';
        var gmCopy = buildGongmangDeepHookCopy({ name: name, gongmang: gongmangBranches, pillars: pillars });
        if (!gmCopy) return '';
        return `<div class="sajux-gongmang-note sajux-panel-plain" style="background:transparent;border-left:3px solid rgba(231,76,60,0.4);padding:14px 18px;border-radius:0 10px 10px 0;margin-top:16px;border:1px solid rgba(231,76,60,0.25);">
            <div style="font-size:11px;color:#e74c3c;margin-bottom:8px;font-weight:700;letter-spacing:1px;">⚠ 공망 — ${gmBranchNames}</div>
            <p style="font-size:13px;color:#ddd;line-height:1.85;margin:0;">${boldStarsToStrong(gmCopy)}</p>
        </div>`;
    })();

    const yPillar = pillars[3] || {};
    const mPillar = pillars[2] || {};
    const dPillar = pillars[1] || {};
    const hPillar = pillars[0] || {};
    const yH = yPillar.h ? (typeof yPillar.h==='string' ? yPillar.h : yPillar.h.join('')) : '';
    const mH = mPillar.h ? (typeof mPillar.h==='string' ? mPillar.h : mPillar.h.join('')) : '';
    const dH = dPillar.h ? (typeof dPillar.h==='string' ? dPillar.h : dPillar.h.join('')) : '';
    const hH = hPillar.h ? (typeof hPillar.h==='string' ? hPillar.h : hPillar.h.join('')) : '';

    var chHead = buildChapterHeadTopicFirst('원국 해부', '01 · 태어난 순간의 별자리 지도', buildTopicMetaphorTitle('basic', data));
    var chIntro = buildChapterIntroHtml(data, 'basic');
    return `<div class="report-chapter chapter-start">
        ${chHead}
        ${chIntro}
        <div style="background:rgba(199,167,106,0.06);border-left:3px solid var(--gold);padding:22px 24px;border-radius:0 12px 12px 0;margin:22px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:14px;letter-spacing:0.18em;font-weight:600;">${nmUi(name)} 인생을 한 흐름으로</div>
            ${lifeNarr.split('\n\n').map((para,i) => {
                if(!para.trim()) return '';
                const isHeader = para.startsWith('💼') || para.startsWith('❤') || para.startsWith('🌡') || para.startsWith('🏛');
                if(isHeader) {
                    const lines = para.split('\n');
                    var hdrPolished = voicePolishParagraph(data, lines.slice(1).join('\n')).replace(/\n/g,'<br>');
                    return '<div style="margin-top:22px;padding-top:18px;border-top:1px solid rgba(199,167,106,0.14);">'
                         + '<div style="font-size:12px;color:var(--gold);font-weight:700;margin-bottom:10px;letter-spacing:0.06em;">'+lines[0]+'</div>'
                         + '<p style="font-size:13.5px;color:#ddd;line-height:1.95;margin:0;">'+boldStarsToStrong(hdrPolished)+'</p>'
                         + '</div>';
                }
                return '<p style="font-size:'+(i===0?'14.5':'13.5')+'px;color:#ddd;line-height:'+(i===0?'2.1':'1.95')+';white-space:pre-line;margin:0 0 14px;">'+boldStarsToStrong(voicePolishParagraph(data, para))+'</p>';
            }).join('')}
        </div>



        ${gongmangText}

        ${(_careerText||_loveText) ? `
        <div class="ilju-career-love-block" style="margin-top:30px;border-top:1px solid rgba(199,167,106,0.16);padding-top:22px;">
            <p style="font-size:12.5px;color:var(--text-dim);margin:0 0 18px;line-height:1.85;font-style:italic;">위 흐름이 ${nmUi(name)} 큰 그림이라면, 같은 결이 일과 관계에서는 어떻게 드러나는지 한 발 더 들어가 보겠습니다.</p>
            ${_careerText ? `<div style="margin-bottom:22px;">
                <div style="font-size:11px;color:var(--gold);font-weight:700;letter-spacing:0.10em;margin-bottom:10px;">직업 방향 — 타고난 에너지가 빛나는 무대</div>
                <p style="font-size:13.5px;color:#ddd;line-height:2.0;margin:0;">${boldStarsToStrong(voicePolishParagraph(data, _careerText))}</p>
            </div>` : ''}
            ${_loveText ? `<div>
                <div style="font-size:11px;color:var(--gold);font-weight:700;letter-spacing:0.10em;margin-bottom:10px;">관계 패턴 — 마음이 열리는 방식</div>
                <p style="font-size:13.5px;color:#ddd;line-height:2.0;margin:0;">${boldStarsToStrong(voicePolishParagraph(data, _loveText))}</p>
            </div>` : ''}
        </div>` : ''}

    </div>`;
}



/** ─────────────────────────────────────────
 *  일주 프로파일 카드 — 1부 최상단 히어로 비주얼
 *  60일주 물상 + 핵심 키워드 배지 카드
 * ───────────────────────────────────────── */
function buildIljuProfileCard(data) {
    const ds = data.dayStem || '';
    const db = data.dayBranch || '';
    const iljuKey = ds + db;
    const prof = getIljuProfilePolished(data, ds, db);
    if (!prof) return '';

    const name = data.name || '고객';
    function iljuHanjaSpan(char, sizeStyle) {
        return `<div style="line-height:1.1;${sajuxHanjaInlineStyle(char, sizeStyle||'46px', 200)}">${char}</div>`;
    }
    const accentColor = sajuxStemColor(ds);

    // 키워드 배지 (strength에서 추출)
    const kwRaw = prof.strength || '';
    const kwList = kwRaw.split(/[·,·\s]+/).filter(k => k.length >= 2 && k.length <= 8).slice(0, 5);
    const kwBadges = kwList.map(k =>
        `<span class="ilju-kw-badge" style="display:inline-block;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.85);margin:3px 3px 3px 0;letter-spacing:0.5px;">${k}</span>`
    ).join('');

    const isStrong = data.strengthText && (data.strengthText.includes('신강')||data.strengthText.includes('강'));
    const strengthLabel = isStrong ? '에너지가 강한 편' : '에너지가 섬세한 편';
    const strengthBadge = data.strengthText
        ? `<span title="${isStrong?'신강(身强)':'신약(身弱)'}" style="font-size:10px;padding:3px 9px;border-radius:10px;background:rgba(199,167,106,0.10);color:var(--gold);border:1px solid rgba(199,167,106,0.30);font-weight:600;letter-spacing:0.2px;">${strengthLabel}</span>`
        : '';

    return `<div class="ilju-profile-card" style="display:flex;gap:20px;align-items:flex-start;background:linear-gradient(135deg,rgba(30,28,22,0.6),rgba(12,12,16,0.4));border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:22px 24px;margin-bottom:24px;position:relative;overflow:hidden;">
        <div class="ilju-hanja-col" style="flex:0 0 auto;text-align:center;min-width:72px;">
            ${iljuHanjaSpan(ds, '46px')}
            ${iljuHanjaSpan(db, '46px')}
            <div style="font-size:10px;color:rgba(255,255,255,0.32);margin-top:6px;letter-spacing:1px;">일간 · 일지</div>
        </div>
        <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
                <span style="font-size:15px;font-weight:800;color:rgba(255,255,255,0.95);letter-spacing:-0.3px;">${iljuKey} 일주</span>
                ${strengthBadge}
            </div>
            <div style="font-size:13px;color:${accentColor};font-style:italic;margin-bottom:12px;line-height:1.45;">${prof.image || ''}</div>
            <p style="font-size:13px;color:rgba(255,255,255,0.78);line-height:1.85;margin:0 0 14px;">${prof.core || ''}</p>
            <div style="line-height:1.8;">${kwBadges}</div>
        </div>
    </div>`;
}


/** ─────────────────────────────────────────
 *  ★ buildPersonalPortrait — 인물 초상 (메인 음식)
 *  "○○님은 이런 사람입니다" — 만세력 표 직후 1부의 진짜 메인.
 *  고객이 사주X에 의뢰하는 진짜 의도("나는 어떤 사람인가")에 답하는 핵심 챕터.
 *  
 *  구성: 첫인상↔속내 → 강점 → 약점 → 의사결정 → 관계 → 일 → 본질 한 줄
 * ───────────────────────────────────────── */
/** ─────────────────────────────────────────
 *  메인 인생 스토리 — 태어남부터 마지막 장면(120세)까지
 *
 *  기존 buildPersonalPortrait(인물 초상 7요소)와
 *  buildLifePanoramaSection(5단계 인생 파노라마)을 하나로 통합한
 *  "깊이 있는 한 편의 인생 스토리".
 *
 *  - 명리 용어(대운명·용신·기신·연주/월주/일주/시주 등) 일절 노출 없음
 *  - 120세 기준 12개 시기 카드, 각 카드는 진짜 인생의 한 단락처럼 풀어 줍니다
 *  - 인물 초상의 7요소(첫인상·속내·강점·과제·결정·관계·일·본질)는
 *    해당 시기에 자연스럽게 녹여 배치합니다
 * ───────────────────────────────────────── */
function buildPersonalPortrait(data) {
    var name = data.name || '고객';
    var ds = data.dayStem || '';
    var db = data.dayBranch || '';
    var mb = data.monthBranch || '';
    var iljuKey = ds + db;
    var ilju = (typeof ILJU_60_DB !== 'undefined' && ILJU_60_DB[iljuKey]) ? ILJU_60_DB[iljuKey] : null;
    var STEM_OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    var BRANCH_OH = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    var dayOh = STEM_OH[ds] || 'earth';
    var isStrong = (data.strengthText || '').indexOf('신강') >= 0 || (data.strengthText || '').indexOf('강') >= 0;

    // 십성 분포
    var sip = data.sipseong || {};
    var sipTotal = Object.keys(sip).reduce(function(s,k){ return s + (Number(sip[k]) || 0); }, 0) || 1;
    function sipPct(key) { return Math.round((Number(sip[key]) || 0) / sipTotal * 100); }
    var pctGwan = sipPct('편관') + sipPct('정관');
    var pctJae = sipPct('편재') + sipPct('정재');
    var pctIn = sipPct('편인') + sipPct('정인');
    var pctSig = sipPct('식신') + sipPct('상관');
    var pctBi = sipPct('비견') + sipPct('겁재');

    // 대운 흐름 파싱 (시기별 외부 운 톤 결정용)
    var yong = data.yong || ''; var hee = data.hee || '';
    var gi = data.gi || ''; var goo = data.goo || '';
    function rowSc(g, j) {
        var s = 0;
        var go = STEM_OH[g]; var jo = BRANCH_OH[j];
        if (go === yong || go === hee) s += 2;
        if (go === gi || go === goo) s -= 2;
        if (jo === yong || jo === hee) s += 2;
        if (jo === gi || jo === goo) s -= 2;
        return s;
    }
    var rows = data.daeunRows || data.daewunList || [];
    var parsed = [];
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var gz = (r && (r.name || (r.gz && (r.gz[0] + r.gz[1])))) || '';
        var ag = r && (r.age != null ? r.age : r.startAge);
        ag = ag != null ? Number(ag) : i * 10;
        parsed.push({ age: ag, sc: gz.length > 1 ? rowSc(gz.charAt(0), gz.charAt(1)) : 0 });
    }
    function avgOf(arr) { if (!arr.length) return 0; return arr.reduce(function(s,x){return s+(x.sc||0);},0) / arr.length; }
    function periodTone(lo, hi) {
        var a = avgOf(parsed.filter(function(x){ return x.age >= lo && x.age <= hi; }));
        if (a >= 1) return 'tail';   // 등 뒤에서 받쳐 주는
        if (a <= -1) return 'side';  // 자주 시험에 들게 하는
        return 'mix';                 // 번갈아
    }
    function tonePhrase(tone, t, s, m) {
        return tone === 'tail' ? t : (tone === 'side' ? s : m);
    }

    function _vp(t) { return voicePolishParagraph(data, t || ''); }

    // ─── 데이터 기반 풀이 조각들 ───
    var birthSceneByMonth = {
        '子': '깊은 밤의 정적 속에서 작은 불씨처럼 조심스레 이름을 알리신 분이세요. 부모님 사이에는 다정한 말보다 규칙이 먼저 자리잡은 분위기가 깔려 있었고, 그래서 어린 ' + nmDnim(name) + '은 일찍부터 어른들의 표정과 말투를 살피는 데에 능숙해지셨습니다',
        '丑': '얼음이 얇게 녹기 시작하는 땅 위에서, 조용히 호흡을 가다듬으며 세상에 첫 발을 내디디신 분이세요. 칭찬이 빠르게 돌아오지는 않았지만, 한 번 새겨진 신뢰는 오래 가는 환경에서 자라셨습니다',
        '寅': '아지랑이가 막 걷히는 숲길처럼, 보폭을 넓히고 싶은 마음이 어릴 적부터 몸을 깨운 분이세요. 부모님은 격려와 경계를 한꺼번에 주셨고, “나는 어디까지 갈 수 있을까”라는 질문을 늘 스스로에게 던지며 자라셨습니다',
        '卯': '만물이 생동하는 화창한 봄날에, 볕이 잘 드는 따뜻한 환경에서 큰 기대를 받으며 자란 분이세요. 부모님의 훈육은 엄정했지만 마음 깊은 곳엔 따뜻함이 깔려 있어서, 또래보다 한 박자 일찍 철이 드셨습니다',
        '辰': '바람이 방향을 자주 바꾸는 언덕 위 집안에서, 이동과 변화가 일찍부터 일상이 된 환경에서 자라신 분이세요. 겉으로는 유연해 보였지만 속으로는 늘 다음 수를 미리 그려야 했고, 그 시기에 판을 읽는 감각이 일찍 길러졌습니다',
        '巳': '한낮의 열기가 피부에 닿을 듯한 계절에 태어나, 보여 주는 삶과 끝까지 지켜야 할 자존심이 한데 섞인 환경에서 자라신 분이세요. 부모님은 기대를 숨기지 않으셨고, ' + nmDnim(name) + '은 그 기대를 등불 삼아 밤늦게까지 길을 잃지 않으려 애쓰셨습니다',
        '午': '햇살이 마당 끝까지 닿는 집에서, 당당함과 선의가 동시에 길러진 분이세요. 인정받고 싶은 마음이 컸지만 그만큼 실수에는 엄격한 분위기였고, ' + nmDnim(name) + '은 웃음 뒤에 감춘 긴장을 일찍부터 익히셨습니다',
        '未': '풀내음이 배인 언덕길처럼, 조용한 배려와 끈기가 집 안 공기로 스며든 환경에서 자라신 분이세요. 서두르지 않아도 미래를 준비하라는 메시지가 몸으로 전해졌고, ' + nmDnim(name) + '은 천천히 쌓아 올리는 방식에 익숙해지셨습니다',
        '申': '날이 갈라진 듯한 바람이 통하는 집에서, 변화와 이동이 낯설지 않은 어린 시절을 보내신 분이세요. 부모님은 현실적인 조언으로 길을 열어 주셨고, ' + nmDnim(name) + '은 감정보다 판단을 먼저 훈련하며 자라셨습니다',
        '酉': '해가 기울 때 소리가 맑아지는 마을처럼, 완성도와 체면이 집안 화법 속에 함께 깔린 환경에서 자라신 분이세요. 칭찬은 적어도 한 마디가 오래 남는 곳에서, 결과물로 마음을 증명하는 법을 일찍 배우셨습니다',
        '戌': '저녁 안개가 내려앉는 언덕에서, 의리와 책임을 이름붙이지 않고도 몸으로 가르치는 분위기 속에 자라신 분이세요. 혼자 지켜야 할 약속의 무게를 남들보다 먼저 짊어져 보신 분입니다',
        '亥': '물줄기가 모이는 하구처럼, 말없이 퍼 주는 정과 상상의 깊이가 함께 흐르는 집에서 자라신 분이세요. 감수성은 풍부했지만 표현은 서툴렀고, 속으로만 차오르는 파도를 다스리는 연습을 일찍 시작하셨습니다'
    };
    var birthScene = birthSceneByMonth[mb] || nmDnim(name) + '은 첫 호흡을 내쉰 그날의 공기가 차갑지도 뜨겁지도 않았지만, 집 안에는 분명한 품격과 규율이 깔린 환경에서 자라신 분이세요';

    // 첫인상 / 속내 / 강점 / 과제
    var firstImpression = {
        wood: '곧고 단단한 사람',
        fire: '환하고 따뜻한 사람',
        earth: '묵직하고 든든한 사람',
        metal: '깔끔하고 단정한 사람',
        water: '조용하고 깊이 있는 사람'
    }[dayOh];
    var inSelfNote = {
        wood: '겉으로는 단단해 보이셔도 속은 의외로 섬세하고, 남이 흘려보내는 한 마디에도 오래 머무르시는 편이세요',
        fire: '환한 겉모습 안쪽에는 의외로 깊이 가라앉으시는 시간이 길어, “회복하는 자기만의 시간”이 평생 따라붙는 분이세요',
        earth: '겉으로 든든해 보이실 만큼 속에서는 끊임없이 “이게 맞나” 저울질하시는 시간이 깊이 깔려 있어요',
        metal: '겉이 정리된 만큼 속에서는 한 번 다친 마음을 오래 곱씹으시고, 그 곱씹음이 ' + nmUi(name) + ' 깊이의 비밀이 됩니다',
        water: '조용한 겉모습 안쪽에는 의외로 뜨겁고 활발한 야망이 흐르고, ' + nmDnim(name) + '은 그걸 잘 드러내지 않으실 뿐이에요'
    }[dayOh];
    var coreLine = ilju && ilju.image ? ilju.image : '';
    var strengthRaw = ilju && ilju.strength ? ilju.strength : '타고난 기질';
    var weaknessRaw = ilju && ilju.weakness ? ilju.weakness : '같은 기질이 만들어 내는 그늘';
    var careerRaw = ilju && ilju.career ? ilju.career : '';

    var dominantSip = '';
    if (pctSig >= 30) dominantSip = '생각을 글과 말, 작품으로 풀어내는 일에서 진가가 발휘되는 분';
    else if (pctGwan >= 30) dominantSip = '책임지는 자리에서 가장 빛나는 분 — 위에서 시키지 않아도 스스로 책임을 짊어지시는 분';
    else if (pctJae >= 30) dominantSip = '추상보다 구체, 이상보다 실리에 강한 — 현실 감각이 또렷한 분';
    else if (pctIn >= 30) dominantSip = '한 분야를 끝까지 파고드시며 깊이를 쌓아 가시는 분';
    else if (pctBi >= 30) dominantSip = '자기 색이 또렷하고, 누구의 그늘 아래보다 스스로의 자리를 만들고 싶어 하시는 분';
    else dominantSip = '한 가지에 깊이 들어가시는 — 자기만의 결이 또렷한 분';

    var emptyNote = '';
    if (pctSig === 0) emptyNote = '마음에 담은 것을 밖으로 풀어내지 않고 안에 쌓아두시는 패턴이 있어서, 의식적으로 글이나 말로 표현하는 작은 통로 하나를 두시는 편이 평생 도움이 됩니다';
    else if (pctGwan === 0) emptyNote = '외부의 규율·체계 안에 들어가시는 게 의외로 답답하실 수 있어서, 스스로 만든 “나만의 규칙” 하나는 꼭 두시는 편이 좋습니다';
    else if (pctJae === 0) emptyNote = '현실의 숫자·돈 흐름이 마음에 잘 안 잡히시는 편이라, 가계부나 자산 정리 같은 “돈에 대한 기록 습관” 하나를 의식적으로 만드시는 편이 좋습니다';
    else if (pctIn === 0) emptyNote = '깊게 파고드는 학습보다 빠른 실행이 더 편하실 수 있어서, 한 분야는 “끝까지 파는 시간”을 의식적으로 두셔야 깊이가 쌓입니다';

    // 관계 안에서의 위치 (이후 30~50대 시기에 자연스럽게 녹임)
    var relationLine;
    if (pctGwan >= pctSig && pctGwan >= pctJae) relationLine = '“책임을 지는 어른”의 자리에 자연스럽게 서게 됩니다 — 가족 안에서는 어른 역할을, 친구들 사이에서는 중재자 역할을, 일터에서는 위로 올라가시는 흐름이 또렷해요';
    else if (pctSig >= pctJae && pctSig >= pctIn) relationLine = '“이야기를 풀어내는 사람”의 자리에 서십니다 — 만남을 따뜻하게 만드시고, 사람들이 ' + nmUi(name) + ' 곁에서 마음을 여는 흐름이에요';
    else if (pctJae >= pctIn) relationLine = '“현실을 챙겨 주는 사람”의 자리에 서십니다 — 가족·친구가 곤란할 때 ' + nmIGa(name) + ' 실제로 도움이 되는 분이라, 사람들이 자연스럽게 ' + nmKke(name) + ' 의지하게 됩니다';
    else relationLine = '“깊이 들어가는 사람”의 자리에 서십니다 — 많은 사람과 얕게 만나기보다 한두 사람과 깊이 만나시는 방식이고, 그 한두 사람이 평생 가장 큰 자산이 됩니다';

    var decisionLine = isStrong
        ? '직관과 추진력으로 빠르게 결정하시는 분 — “이거다” 싶으면 바로 움직이시고, 그 추진력이 ' + nmUi(name) + ' 평생 가장 큰 동력입니다. 다만 한 번씩 너무 빠른 결정이 큰 비용으로 돌아오기도 해서, 큰 결정에서는 “하루 자고 다시 보기”라는 작은 안전장치를 두시는 편이 좋습니다'
        : '여러 각도에서 충분히 살펴보고 천천히 결정하시는 분 — 빠른 결정을 강요받으시면 큰 스트레스를 받으시고, 시간을 충분히 두실 때 가장 좋은 결정을 내리세요. 그 신중함이 ' + nmUi(name) + ' 진짜 강점이라, “결정이 늦다”는 외부 압박에 흔들리지 않으셔도 됩니다';

    var workLine = isStrong
        ? '“스스로 결정하고 끝까지 책임지는” 방식'
        : '“충분히 살피고 함께 만들어 가는” 방식';

    // ─── 7개 인생 단계 시나리오 ───
    //   유년기 → 청소년기 → 청년기 → 장년기 → 중년기 → 노년기 → 말년
    //   카드 박싱 없이 한 편의 글로 이어서 풀어 줍니다.
    var tYou = periodTone(0, 13);       // 유년기
    var tChu = periodTone(14, 19);      // 청소년기
    var tCh  = periodTone(20, 34);      // 청년기
    var tJ   = periodTone(35, 49);      // 장년기
    var tM   = periodTone(50, 69);      // 중년기
    var tN   = periodTone(70, 89);      // 노년기
    var tMan = periodTone(90, 120);     // 말년

    // 유년기 — 첫 풍경 + 또래 첫 만남
    var pYou = '<strong>유년기</strong> — ' + nmDnim(name) + '은 ' + birthScene + '. ' + (firstImpression ? '그 시절의 ' + nmDnim(name) + '은 어른들의 눈에 “' + firstImpression + '” 같은 인상이었을 가능성이 큽니다. ' : '')
        + tonePhrase(tYou,
            '큰 사고나 떠들썩한 사건은 거의 없었고, 가족의 따뜻한 시선이 ' + nmEulReul(name) + ' 든든히 받쳐 줍니다. 그때 받은 작은 칭찬 한 줄이 사실 평생 가는 자존감의 가장 깊은 바닥에 깔립니다. ',
            '이사·전학·집안 사정의 변화가 한두 번 따라왔을 수 있어요. 안정보다 변화에 먼저 적응해야 했던 그 시기 덕분에 — ' + nmDnim(name) + '은 또래보다 일찍 어른의 표정을 읽는 법을 익히셨습니다. ',
            '잔잔한 시기였지만, 그 잔잔함 속에서 어린 ' + nmDnim(name) + '은 “나는 어떤 사람일까”라는 물음을 이미 마음 한구석에 품기 시작하셨습니다. ')
        + '초등학교에 들어가신 뒤로는 또래 사이에서 “조용하지만 속이 깊은 아이”로 기억되셨을 가능성이 큽니다. 친구들이 떠들썩하게 어울릴 때도 한 발 떨어져 그 흐름을 지켜보는 편이었고, 그 자리에서 또래보다 한 박자 일찍 “사람의 마음”에 눈을 뜨셨어요. 작은 일에서도 의미를 캐내는 그 습관이, 사실 평생 ' + nmUi(name) + ' 깊이 보는 안목의 첫 뿌리가 됩니다.';

    // 청소년기 — 자아의 출발 + 첫인상/속내
    var pChu = '<strong>청소년기</strong>에 접어드시면 ' + nmUi(name) + ' 자아가 본격적으로 첫 모습을 드러냅니다. 겉으로 보기엔 ' + (firstImpression || '진중한 분') + '의 이미지가 굳어 가지만, 속내는 한참 달랐어요. ' + (inSelfNote || '겉과 속이 다른 이중성을 일찍부터 안고 사신 시기') + '. '
        + tonePhrase(tChu,
            '이 시기에 학교든 동아리든 아르바이트든 — ' + nmEulReul(name) + ' 알아봐 주는 어른이나 선배가 한 명 등장하고, 그분의 한 마디가 첫 진로 선택을 빠르게 만들어요. 또래 친구 중 한 명은 평생을 같이 가는 인연이 되는 시기이기도 합니다. ',
            '진로 선택을 두고 부모님과 한 번 깊게 부딪치셨을 가능성이 큽니다. 가고 싶은 길과 부모님이 원하시는 길이 어긋났을 수 있고, 첫 사랑이나 첫 친한 친구 관계에서도 한 번 크게 다치셨을 수 있어요. 그 흔들림이 결국 ' + nmUi(name) + ' 세상을 보는 눈을 깊이 만듭니다. ',
            '큰 풍파 없이도 “나는 어떤 사람인가”라는 질문을 일찍부터 마음에 품기 시작하시고, 답을 빨리 내리지 않으셔도 그 질문 자체가 평생 ' + nmEulReul(name) + ' 받치는 축이 됩니다. ')
        + '“관심 있는 한 가지에는 폭발적으로 빠지고, 그 외에는 적당히 흘려보내는” 패턴이 이 무렵 또렷해지고, 그 패턴은 평생 ' + nmUi(name) + ' 본 모습으로 따라옵니다.';

    // 청년기 — 사회 진출 + 강점 발견
    var pCh = '<strong>청년기</strong>로 접어드시면 비로소 사회의 문 앞에 서시게 됩니다. ' + nmUi(name) + ' 가장 큰 강점이 “' + strengthRaw + '”이라는 것이 이 시기에 처음 시장에서 확인되고, ' + nmDnim(name) + '은 ' + dominantSip + '이세요. 이 강점은 누가 가르쳐 준 것이 아니라 태어나실 때 이미 안에 새겨져 있던 자질이라, 노력으로 키운 능력과는 질감 자체가 다릅니다. '
        + tonePhrase(tCh,
            '첫 직장·첫 자취·첫 큰 연애 — 굵직한 결정들이 의외로 ' + nmEulReul(name) + ' 받쳐 줍니다. 작은 성공 하나가 “나는 이 길로 가도 되겠구나”라는 확신을 키워 주고, 그 확신이 다음 단계 자리잡기의 토양이 됩니다. ',
            '첫 사회 진입에서 한 번 크게 흔들리시거나, 첫 직장이 오래 가지 못할 수 있어요. 그때의 학습이 다음 단계에 진짜 자기 자리를 찾을 때의 가장 큰 자산이 되니, 그 흔들림은 부끄러운 일이 아닙니다. ',
            '큰 도약보다 작은 결정들이 차곡차곡 쌓이는 흐름이에요. 한 번에 자리잡지는 못하셔도, 이 10여 년 동안 만난 사람·해 본 일들이 다음 단계의 진짜 정착을 위한 재료가 됩니다. ')
        + decisionLine + '. 큰 결정의 무게가 점점 늘어나는 시기라, 이 패턴을 일찍 알아채시는 것만으로도 평생의 자산이 됩니다.';

    // 장년기 — 자리잡기·결혼 + 인생의 중간점·재정의
    var pJ = '<strong>장년기</strong>에 들어서면 ' + nmUi(name) + ' 본 모습이 사회에서 가장 활발하게 펼쳐집니다. 직업·결혼·이주·창업·자녀 같은 굵직한 결정이 한꺼번에 몰려와요. ' + relationLine + '. '
        + tonePhrase(tJ,
            '평생 일군 노력이 처음으로 또렷한 결실로 돌아오고, 30대 후반에서 40대 후반 사이에 ' + nmUi(name) + ' 이름이 적힌 통장·집·작품 가운데 하나가 자리를 잡습니다. ' + (careerRaw ? '특히 ' + careerRaw + ' 분야의 일이 ' + nmUi(name) + ' 기질과 가장 잘 맞아, 그 안에서 두 배쯤 빠르게 자리를 잡으십니다. ' : ''),
            '결혼이 늦춰지거나 한 번 깊은 학습을 거쳐 진짜 짝을 만나시는 흐름일 수 있어요. 직장에서도 “이게 정말 내 자리인가”를 자주 묻게 되시지만, 그 학습이 장년기 후반의 단단한 안착을 가능하게 합니다. ',
            '화려한 도약보다 한 걸음씩 자기 자리를 다지는 흐름이고, 이 시기를 다 지나고 나서야 비로소 ' + nmDnim(name) + '만의 색이 시장에서 인정받기 시작합니다. 그때가 사실상의 “진짜 시작”이에요. ')
        + '동시에 이 시기는 인생의 중간점 — ' + nmIGa(name) + ' 자주 부딪히시는 벽인 “' + weaknessRaw + '”이 가장 또렷이 모습을 드러내는 자리이기도 합니다. ' + (emptyNote ? emptyNote + '. ' : '') + '강한 기질의 뒷면에는 늘 그 그늘이 따라오니, 약점이라며 부끄러워하실 일은 아니에요. 미리 알아채시는 것만으로도 그 그늘은 절반쯤 약해집니다.';

    // 중년기 — 책임의 무게 + 자유 회복
    var pM = '<strong>중년기</strong>에 들어서면 인생에서 가장 어깨가 무거운 자리에 서시게 됩니다. 자녀가 있다면 그 진로 결정, 부모님의 건강, 본업의 마무리·전환, 재정의 큰 줄기가 한꺼번에 몰려와요. 위로는 부모님 세대의 마무리를 봐 드리고, 아래로는 후배·자녀의 자리를 받쳐 주셔야 하는 — 인생에서 가장 무거운 어깨의 시기입니다. '
        + tonePhrase(tM,
            '평생 일군 평판이 한꺼번에 결실로 돌아오는 흐름이라, 50대 후반·60대 초반에 “이름이 적힌 한 줄” — 한 권의 책, 한 사람의 제자, 한 채의 집 — 그 결과가 손에 잡힙니다. ',
            '건강과 가족을 동시에 챙기셔야 하는 시기예요. 50대 초반의 건강 검진을 절대 미루지 마시고, 한 가지 만성 신호가 보이면 그때부터 “관리의 습관”으로 넘어가셔야 합니다. ',
            '안쪽보다 바깥에서 새 무대가 한 번 더 열리는 흐름이라, 50대에 시작한 일이 60대의 명함이 될 수 있어요. 너무 일찍 “다 끝났다”고 마음 놓지 마십시오. ')
        + '이 시기의 후반에 접어들면 자녀(있다면)가 독립하고 회사도 자리를 정리하면서, 비로소 “진짜 ' + nmUi(name) + ' 시간”이 다시 돌아옵니다. 평생 “나만의 색을 인정받는 자리”를 가장 중요하게 여겨 오신 분이라, 이때야말로 그 색이 처음으로 자유로워지는 자리예요.';

    // 노년기 — 본 모습이 자연스러워지고 본질이 또렷이 드러남
    var pN = '<strong>노년기</strong>에 접어드시면 외부의 책임이 한 발 멀어지고, ' + nmDnim(name) + '의 진짜 본 모습이 가장 자연스럽게 드러납니다. 일을 대하실 때 늘 ' + workLine + '으로 살아오신 분이라, 이 시기에도 한가하게 흘려보내기보다는 “덜 무거운, 그러나 의미 있는 한 가지”에 손을 두십니다. '
        + tonePhrase(tN,
            '몸이 따라 주는 만큼, 후배·자녀·제자 한 명에게 ' + nmDnim(name) + '의 한 마디가 인생을 바꾸는 일이 일어납니다. 그 일이 평생 가장 큰 보람이 되어 줘요. ',
            '몸의 신호가 본격적으로 시작되니, 무리한 일정보다 회복의 시간이 가장 큰 자산이 됩니다. 작은 산책·일정한 식사·짧은 낮잠 같은 단순한 리듬이 ' + nmEulReul(name) + ' 가장 오래 가게 합니다. ',
            '큰 행사 없이 일상의 깊이가 ' + nmUi(name) + ' 노년을 빛냅니다. 한 권의 책, 한 사람과의 산책, 한 끼의 정성스러운 식사 — 그런 작은 일들이 사실 평생의 결실입니다. ')
        + '시간이 더 지나면 외부 무대는 거의 정리되고, ' + nmDnim(name) + '의 진짜 본질이 풍경처럼 펼쳐집니다. ' + (coreLine ? '“' + coreLine + '” — ' + nmDnim(name) + '을 한 줄로 정리하는 이 인상이 이때만큼 ' + nmEulReul(name) + ' 닮은 적이 없습니다. ' : '') + '이 시기에 ' + nmEulReul(name) + ' 찾아오는 사람들은 더 이상 ' + nmUi(name) + ' 직책이나 성취가 아니라 ' + nmUi(name) + ' “사람 그 자체”를 보러 옵니다.';

    // 말년 — 말년의 깊이 + 마지막 장면·유산
    var pMan = '<strong>말년</strong>에 닿으시면 시간이 천천히 흐르고, 작은 일 하나하나가 큰 의미가 됩니다. 평생 ' + nmUi(name) + ' 마음을 풀어 놓으실 자리가 의외로 적었던 분이라, 이 시기에 와서야 비로소 “있는 그대로의 ' + nmDnim(name) + '”으로 살아 보시는 자유가 따라옵니다. 손에 잡히는 것들 — 책 한 권, 차 한 잔, 창밖의 햇살 — 그런 가벼운 것들의 무게가 가장 크게 다가오는 때예요. '
        + tonePhrase(tMan,
            '늦은 인정이 또 한 번 따라옵니다. 그게 사회적인 상이든, 가족이 전하는 한 마디든 — 평생 가장 진한 자국으로 남습니다. ',
            '몸이 마음만큼 따라 주지 않는 때지만, ' + nmDnim(name) + '의 마음 안쪽 풍경은 평생 가장 평화로워집니다. ',
            '특별한 사건 없이 잔잔히 흘러가지만, 그 잔잔함이야말로 평생 ' + nmDnim(name) + '이 만들어 오신 “자기 자리”의 결정체입니다. ')
        + '마침표를 찍는 순간, ' + nmDnim(name) + '이 남기시는 것은 — ' + (careerRaw ? '평생 ' + careerRaw + ' 분야에서 다듬어 온 손길과 ' : '') + '“말이 아니라 남는 습관 한 줄”입니다. 큰 재산이나 화려한 직책보다, ' + nmUi(name) + ' 한 마디 한 마디가 누군가의 일생에 끼친 작은 영향들이 진짜 유산이 돼요. ' + nmEunNeun(name) + ' 평생 “' + (firstImpression || '진중한 분') + '”의 인상으로 사셨고, 그 인상이 마지막 순간에도 변하지 않은 채 그대로 남습니다. 시기에 따라 풍경은 바뀌고 빛의 각도도 달라졌지만, ' + nmDnim(name) + ' 안의 본질은 첫 호흡과 마지막 호흡 사이에서 단 한 번도 흔들리지 않았어요. 그 본질대로 사셨을 때 ' + nmDnim(name) + '은 가장 자연스러우셨고, 그래서 가장 빛나셨습니다.';

    var introText = nmDnim(name) + '의 인생을 한 편의 이야기로 들려 드릴게요. 태어남부터 마지막 장면까지 — 어떤 환경에서 자라셨고, 어떤 시기를 지나, 어디에 닿게 되는지를 흐름 그대로 따라가 봅니다. 사주의 글자가 무엇인지는 잠시 잊으셔도 좋아요. 결과적으로 ' + nmIGa(name) + ' 어떤 사람으로 태어나, 어떻게 살아가시게 되는지를 그대로 읽으시면 됩니다.';

    function para(text) {
        return '<p style="font-size:14px;color:var(--text);line-height:2.1;margin:0 0 18px;">' + boldStarsToStrong(_vp(text)) + '</p>';
    }

    return '<div id="sec-personal-portrait" class="report-chapter chapter-start sajux-panel-plain personal-portrait-hero" style="margin:32px 0 44px;padding:0;border:none;background:transparent;">'
        + '<div class="personal-portrait-inner">'
        + '<p class="personal-portrait-eyebrow">' + escHtmlAttr(nmUi(name)) + '님 · 인생 한 편</p>'
        + '<h2 class="personal-portrait-title">' + escHtmlAttr(nmDnim(name)) + '의 인생 — 태어남에서 마지막 장면까지</h2>'
        + '<p class="personal-portrait-lede">유년기부터 말년까지 — 한 사람의 이야기로 이어서 풀어 드립니다</p>'
        + para(introText)
        + para(pYou)
        + para(pChu)
        + para(pCh)
        + para(pJ)
        + para(pM)
        + para(pN)
        + para(pMan)
        + '</div></div>';
}


/** ─────────────────────────────────────────
 *  대운 타임라인 — 2부 최상단 히어로 비주얼
 *  생년~말년 가로 흐름, 현재 위치 핀
 * ───────────────────────────────────────── */
function buildDaeunTimeline(data) {
    const rows = data.daeunRows || data.daewunList || [];
    if (!rows.length) return '';
    const curAge = getClientAgeYearsAtReport(data) || 0;
    // 색상은 글로벌 헬퍼 사용 — sajuxStemColor / sajuxBranchColor
    const yong = data.yong || ''; const hee = data.hee || '';
    const gi = data.gi || ''; const goo = data.goo || '';
    const OH_MAP = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    const JI_MAP = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    function ohScore(g,j){
        let s=0;
        const go=OH_MAP[g]||'';const jo=JI_MAP[j]||'';
        if(go===yong||go===hee)s+=2;if(go===gi||go===goo)s-=2;
        if(jo===yong||jo===hee)s+=1;if(jo===gi||jo===goo)s-=1;
        return s;
    }

    const items = rows.map(r => {
        const g = (typeof r.gan === 'string' ? r.gan : (r.h||[])[0]) || '';
        const j = (typeof r.ji === 'string' ? r.ji : (r.h||[])[1]) || '';
        const age = typeof r.age === 'number' ? r.age : (typeof r.startAge === 'number' ? r.startAge : 0);
        const score = ohScore(g, j);
        const isCur = curAge >= age && curAge < age + 10;
        const isPast = curAge >= age + 10;
        return {g, j, age, score, isCur, isPast};
    }).filter(r => r.g && r.j);

    if (!items.length) return ''; // 렌더할 대운 셀이 없으면 빈 박스 방지

    const cells = items.map(r => {
        const col = sajuxStemColor(r.g);
        const bgAlpha = r.isCur ? '0.18' : (r.isPast ? '0.05' : '0.09');
        const borderColor = r.isCur ? col : (r.isPast ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.1)');
        const dimOpacity = r.isPast ? 0.42 : 1;
        const scoreDot = r.score >= 2 ? '●' : (r.score <= -2 ? '●' : '◉');
        const scoreDotColor = r.score >= 2 ? SAJUX_OH_COLORS.wood : (r.score <= -2 ? SAJUX_OH_COLORS.fire : SAJUX_OH_COLORS.earth);
        const curLabel = r.isCur ? `<div style="font-size:9px;color:${col};font-weight:800;letter-spacing:1px;margin-bottom:3px;">▶ 현재</div>` : '';
        return `<div class="daeun-tl-cell" style="flex:0 0 auto;min-width:60px;text-align:center;padding:10px 8px;border-radius:10px;background:rgba(255,255,255,${bgAlpha});border:1px solid ${borderColor};position:relative;opacity:${dimOpacity};${r.isCur?'box-shadow:0 0 12px rgba(199,167,106,0.18);':''}" title="${r.g}${r.j} ${r.age}세~${r.age+9}세">
            ${curLabel}
            <div style="line-height:1.1;${sajuxHanjaInlineStyle(r.g, '20px', 700)}">${r.g}</div>
            <div style="line-height:1.1;${sajuxHanjaInlineStyle(r.j, '20px', 700)}">${r.j}</div>
            <div style="font-size:10px;color:rgba(255,255,255,0.45);margin-top:4px;">${r.age}세</div>
            <div style="font-size:11px;color:${scoreDotColor};margin-top:2px;">${scoreDot}</div>
        </div>`;
    }).join(`<div style="flex:0 0 auto;width:12px;border-top:1px dashed rgba(255,255,255,0.12);align-self:center;"></div>`);

    return `<div class="daeun-timeline-wrap" style="margin-bottom:24px;">
        <div style="font-size:11px;color:rgba(255,255,255,0.45);letter-spacing:1px;margin-bottom:10px;">인생 80년 지도 — 10년마다 바뀌는 큰 계절 &nbsp;
            <span style="color:${SAJUX_OH_COLORS.wood};font-size:10px;">● 나에게 좋은 운</span>&ensp;
            <span style="color:${SAJUX_OH_COLORS.fire};font-size:10px;">● 부담되는 운</span>&ensp;
            <span style="color:${SAJUX_OH_COLORS.earth};font-size:10px;">◉ 중립</span>
        </div>
        <div style="display:flex;align-items:center;gap:0;overflow-x:auto;padding-bottom:6px;-webkit-overflow-scrolling:touch;">
            ${cells}
        </div>
    </div>`;
}


/** ─────────────────────────────────────────
 *  buildCurrentPeriodCard — "현재의 운세"
 *  · 카드 분리 없이 한 흐름의 서사로 2000자+
 *  · 대운·세운·월운 + 다섯 영역(연애·건강·합격·직업·재물)을 한 편의 글로 버무림
 *  · 대운·세운·월운 개념 설명은 「앞으로의 운」 도입에서 다룸
 * ───────────────────────────────────────── */
function buildCurrentPeriodCard(data) {
    if (!data || !data.dayStem) return '';
    var name = data.name || '고객';

    var GAN_OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    var JI_OH  = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    var HK = {'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계','子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    var OH_KR = { wood:'목(나무)', fire:'화(불)', earth:'토(흙)', metal:'금(쇠)', water:'수(물)' };
    var yong = data.yong || ''; var hee = data.hee || ''; var gi = data.gi || ''; var goo = data.goo || '';
    function score(gan, ji) {
        var s = 0;
        var go = GAN_OH[gan] || ''; var jo = JI_OH[ji] || '';
        if (go === yong || go === hee) s += 2;
        if (go === gi  || go === goo) s -= 2;
        if (jo === yong || jo === hee) s += 2;
        if (jo === gi  || jo === goo) s -= 2;
        return s;
    }
    function tone(s) { return s >= 3 ? 'good' : s >= 1 ? 'mild' : s === 0 ? 'flat' : s >= -2 ? 'caution' : 'tough'; }
    function toneLabel(t) { return ({ good:'잘 풀리는 시기', mild:'한 발 더 내디뎌도 좋은 시기', flat:'안정·정돈에 좋은 시기', caution:'한 박자 늦추셔야 할 시기', tough:'단단히 지키셔야 할 시기' })[t] || '안정 시기'; }
    function toneColor(t) { return ({ good:'#c7a76a', mild:'#5ec183', flat:'#9b9b9b', caution:'#e0a040', tough:'#c84a4a' })[t] || '#888'; }

    // ── 현재 대운 추출 ──
    var curAge = (typeof getClientAgeYearsAtReport === 'function') ? getClientAgeYearsAtReport(data) : 0;
    var rows = (data.daeunRows && data.daeunRows.length) ? data.daeunRows : (data.daewunList || []);
    var curDae = null;
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var a = (typeof r.age === 'number') ? r.age : (typeof r.startAge === 'number' ? r.startAge : 0);
        if (curAge >= a && curAge < a + 10) { curDae = { row: r, age: a, idx: i }; break; }
    }
    if (!curDae && rows.length) {
        var idx0 = (typeof data.activeDaeunIdx === 'number') ? data.activeDaeunIdx : 0;
        var r0 = rows[idx0] || rows[0];
        var a0 = (typeof r0.age === 'number') ? r0.age : (typeof r0.startAge === 'number' ? r0.startAge : 0);
        curDae = { row: r0, age: a0, idx: idx0 };
    }
    var dGan = '', dJi = '';
    if (curDae) {
        var rr = curDae.row;
        if (rr.gz) { dGan = rr.gz[0] || ''; dJi = rr.gz[1] || ''; }
        else if (rr.h) { dGan = rr.h[0] || ''; dJi = rr.h[1] || ''; }
        else { dGan = rr.gan || ''; dJi = rr.ji || ''; }
    }
    var dScore = (dGan && dJi) ? score(dGan, dJi) : 0;
    var dTone = tone(dScore);
    var dGanKr = HK[dGan] || dGan; var dJiKr = HK[dJi] || dJi;
    var dGanOh = OH_KR[GAN_OH[dGan] || ''] || ''; var dJiOh = OH_KR[JI_OH[dJi] || ''] || '';

    // ── 현재 세운 (올해) ──
    var baseNow = (typeof getReportBaseDate === 'function') ? getReportBaseDate(data) : new Date();
    var curYear = baseNow.getFullYear();
    var GAN_HJ_ARR = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    var JI_HJ_ARR  = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    var yGanI = ((curYear - 4) % 10 + 10) % 10;
    var yJiI  = ((curYear - 4) % 12 + 12) % 12;
    var yGan = GAN_HJ_ARR[yGanI]; var yJi = JI_HJ_ARR[yJiI];
    var yScore = score(yGan, yJi);
    var yTone = tone(yScore);
    var yGanKr = HK[yGan]; var yJiKr = HK[yJi];

    // ── 현재 월운 (이번 달) ──
    var curMonthIdx = baseNow.getMonth(); // 0~11
    var MONTH_JI_KR = ['인','묘','진','사','오','미','신','유','술','해','자','축'];
    var MONTH_GAN_START_TBL = [2, 4, 6, 8, 0];
    var mGanStartIdx = MONTH_GAN_START_TBL[yGanI % 5];
    var mJiKr = MONTH_JI_KR[curMonthIdx];
    var mGanIdx = (mGanStartIdx + curMonthIdx) % 10;
    var GAN_KR_ARR = ['갑','을','병','정','무','기','경','신','임','계'];
    var mGanKr = GAN_KR_ARR[mGanIdx];
    var GAN_HJ_FROM_KR = {'갑':'甲','을':'乙','병':'丙','정':'丁','무':'戊','기':'己','경':'庚','신':'辛','임':'壬','계':'癸'};
    var JI_HJ_FROM_KR  = {'자':'子','축':'丑','인':'寅','묘':'卯','진':'辰','사':'巳','오':'午','미':'未','신':'申','유':'酉','술':'戌','해':'亥'};
    var mGan = GAN_HJ_FROM_KR[mGanKr] || '甲';
    var mJi  = JI_HJ_FROM_KR[mJiKr] || '寅';
    var mScore = score(mGan, mJi);
    var mTone = tone(mScore);
    var monthNo = curMonthIdx + 1;

    // ── 종합 점수 (대운+세운+월운) ──
    var totalScore = dScore + yScore + mScore;
    var totalTone = tone(totalScore / 2);

    // ── 헬퍼 ──
    function _vp(t) { return voicePolishParagraph(data, t); }
    function _bs(t) { return boldStarsToStrong(_vp(t)); }
    function para(text) {
        return '<p class="ch-text" style="font-size:14px;color:var(--text);line-height:2.05;margin:0 0 18px;">' + _bs(text) + '</p>';
    }

    var endAge = (curDae ? curDae.age : 0) + 9;
    var sipseong = data.sipseong || {};
    var sipTotal = Math.max(Object.values(sipseong).reduce(function(a,b){return a+b;}, 0), 1);
    var jaeC = (sipseong['정재']||0) + (sipseong['편재']||0);
    var gwanC = (sipseong['정관']||0) + (sipseong['편관']||0);
    var inC = (sipseong['정인']||0) + (sipseong['편인']||0);
    var sikC = (sipseong['식신']||0) + (sipseong['상관']||0);

    // ── 짧은 한눈 헤더 ──
    function chip(label, color, ko, hj) {
        return '<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:10px 14px;border-left:3px solid ' + color + ';flex:1;min-width:140px;">'
            + '<div style="font-size:10px;letter-spacing:0.10em;color:' + color + ';font-weight:700;margin-bottom:4px;">' + label + '</div>'
            + '<div style="font-size:15px;font-weight:800;color:#fff;font-family:\'Noto Sans KR\',sans-serif;">' + ko + '<span style="font-size:11px;color:#888;margin-left:5px;">(' + hj + ')</span></div>'
            + '</div>';
    }
    var snapshotHtml = '<div style="display:flex;flex-wrap:wrap;gap:10px;margin:14px 0 24px;">'
        + chip('현재 대운', toneColor(dTone), dGanKr + dJiKr, dGan + dJi)
        + chip('현재 세운', toneColor(yTone), yGanKr + yJiKr, yGan + yJi)
        + chip('현재 월운', toneColor(mTone), mGanKr + mJiKr, mGan + mJi)
        + '</div>';
    // ── 1) 인트로 ──
    var intro = '지금 ' + nmEunNeun(name) + ' ' + (curDae ? curDae.age : 0) + '세부터 ' + endAge + '세까지의 큰 10년(대운) 한가운데에 들어와 계세요. 그 10년 안에 올해(' + curYear + '년)가 흐르고, 올해 안에 이번 달(' + monthNo + '월)이 와 있습니다. 사주에서 “지금의 운”이라는 건 사실 이 세 겹의 시간이 한 자리에 겹친 모습이에요. ' + nmKke(name) + ' 지금 어떤 공기가 둘러싸여 있고, 그 공기 안에서 일·돈·사람·몸이 어떻게 움직이실지를 — 카드로 끊지 않고 한 편의 흐름으로 풀어 드릴게요.';

    // ── 2) 현재 대운 (~400자) ──
    var daeunStory = '먼저 가장 큰 흐름인 대운부터 보시면, ' + nmEunNeun(name) + ' 지금 <strong>' + dGanKr + dJiKr + '(' + dGan + dJi + ')</strong> 대운 — 천간 ' + (dGanOh || '') + '에 지지 ' + (dJiOh || '') + '이 받치는 10년에 들어와 계세요. ';
    daeunStory += ({
        good:    nmKke(name) + ' 가장 잘 맞는 기운이 두껍게 깔린 시기라, 평생을 통틀어 보아도 두세 번 만나기 어려운 “공격해도 좋은 10년”에 가까운 흐름입니다. 같은 시간을 들여도 결과가 빨리 붙고, 한 번 잡으신 기회가 다음 기회로 자연스럽게 이어집니다. 다만 너무 빨리 풀린다고 사방으로 손을 뻗으시면 그중 한두 자리가 어긋날 수 있으니, 평생 끌고 가실 큰 축 한두 가지를 이 10년 안에 정해 두시는 게 가장 큰 이득이 됩니다. 미뤄 두셨던 큰 결정 — 결혼·이직·창업·자격 — 가운데 한 가지를 이 시기 안에 매듭지으시면, 그게 다음 10년의 가장 단단한 토대가 됩니다.',
        mild:    nmKke(name) + ' 한 발 더 내디뎌도 좋은 흐름이 깔린 10년이에요. 큰 위협은 적고, 꾸준히 노력하신 만큼 결실이 차곡차곡 쌓이는 시기입니다. 폭발적으로 한 번에 가시기보다 평소 페이스를 유지하시면서 본인이 진짜 잘하는 것 한 가지를 깊이 가시면, 이 10년이 끝났을 때 — 사회 안에서 ' + nmUi(name) + ' 자리가 한 단계 또렷해져 있을 거예요. 새 시도는 1년에 한두 개로만 묶으시고, 끝맺음을 책임질 동료 한 명만 옆에 두십시오.',
        flat:    '큰 길도 큰 흉도 적은 평탄한 10년이에요. 이 시기에는 새로 벌이시기보다, 그동안 벌여 두신 일들 가운데 진짜 남길 한두 가지를 정리하고 다듬는 데 시간을 쓰시는 게 다음 대운을 훨씬 가볍게 만들어 줍니다. 직장이라면 한 분야의 깊이를, 사업이라면 거래처와의 신뢰를, 관계라면 가까운 다섯 명과의 약속을 — 이 셋 중 한 가지만 골라 단단히 다지시면 충분합니다.',
        caution: nmKke(name) + ' 살짝 부담스러운 기운이 깔린 10년이에요. 결정의 무게는 무거워지고, 같은 노력이라도 결과가 평소보다 느리게 돌아옵니다. 이 시기에 새로 벌이시면 그게 다음 시기까지 짐으로 따라오기 쉬우니, “이미 가지고 계신 것들을 단단히 지키는 쪽”이 정답에 더 가까워요. 큰 보증·큰 동업·큰 빚을 쓰는 투자는 이 10년 동안 가급적 피하시고, 본인의 건강·가족·핵심 거래처 셋만 흔들리지 않게 챙기시면 다음 대운이 다시 가벼워집니다.',
        tough:   nmKke(name) + ' 가장 부담이 큰 기운이 자리 잡은 10년이에요. 일·돈·건강·관계 중 한 자리가 자주 흔들릴 수 있으니, 큰 결정은 평소보다 두 배 더 천천히, 글로 적어 두신 뒤에만 내리십시오. 이 시기엔 새로 벌이는 일보다 “지금 있는 것을 무너지지 않게 지키는” 한 가지 목표가 가장 큰 힘을 발휘해요. 의외로 이 10년을 무사히 지나신 분들이, 다음 대운에서 가장 단단한 자리에 안착하시는 경우가 많습니다.'
    })[dTone];

    // ── 3) 현재 세운 (~300자) ──
    var sewunStory = '이 큰 10년 안에서, <strong>올해 ' + curYear + '년</strong> ' + nmEunNeun(name) + ' <strong>' + yGanKr + yJiKr + '(' + yGan + yJi + ')</strong> 한 해 위에 서 계세요. ';
    sewunStory += ({
        good:    '대운이 좋고 세운까지 맞물려 들어오는 흐름이라, 올 한 해는 평생 손에 꼽힐 만한 해가 될 가능성이 큽니다. 미뤄 두셨던 큰 결정 한두 가지를 올해 안에 푸시면, 그게 앞으로 10년 동안의 가장 빛나는 기둥이 돼요. 다만 운이 좋다고 한꺼번에 손을 펼치시면 그중 한 자리가 어긋나기 쉬우니, 한 분기에 큰 결정은 한 가지만 잡으십시오.',
        mild:    '큰 풍파 없이 한 해가 차곡차곡 쌓이는 흐름이에요. 지난해까지 쌓아 오신 것들이 올해 안에 작은 모양으로 한 번씩 결실이 되어 돌아옵니다. 한 해의 성과를 분기마다 한 줄씩 기록해 두시면 다음 해 흐름이 또렷이 보입니다.',
        flat:    '올해는 큰 사건보다 정리·점검에 무게가 실리는 한 해예요. 새로 시작하시기보다, 작년·재작년에 벌이신 일 가운데 “끊을 한 가지·이어 갈 한 가지”를 가르시는 데 마음을 쓰시면 좋습니다. 그 가르기 한 번이 다음 해를 결정하니까요.',
        caution: '올해는 ' + nmKke(name) + ' 결정의 무게가 평소보다 무거워지는 해예요. 큰돈·큰 관계·큰 자리 — 이 셋 중 두 가지를 동시에 흔들지 마시고, 한 가지에만 집중하시면 한 해가 한결 가볍게 흘러갑니다.',
        tough:   '올해는 한 발 물러서 보시는 게 정답에 가까운 해예요. 새 시작은 가능하면 내년 이후로 미루시고, “지금 있는 것을 흔들리지 않게 지키는” 한 가지 목표만 가지고 가시면 결과가 단단해집니다.'
    })[yTone];

    // ── 4) 이번 달 월운 (~250자) ──
    var wolunStory = '그 한 해 안에서, <strong>이번 달 ' + monthNo + '월</strong>은 ' + nmKke(name) + ' <strong>' + mGanKr + mJiKr + '(' + mGan + mJi + ')</strong> 월운이 깔린 한 달이에요. ';
    wolunStory += ({
        good:    '한 해 안에서도 특히 결정의 결과가 빨리 보이는 달이라, 미뤄 두신 큰 안건 한 가지를 이 달 안에 매듭지으시면 다음 달이 한결 가볍게 풀립니다. 발표·계약·고백 — 셋 중 하나를 이 달 안에 정중앙에 두십시오.',
        mild:    '새 시도 한두 가지를 가볍게 더하셔도 무리가 없는 달이에요. 지난달의 리듬을 그대로 이어 가시면서, “한 가지 마무리 + 한 가지 시작”만 잡으시면 균형이 좋습니다.',
        flat:    '큰 굴곡 없이 평탄한 달이에요. 새 일을 벌이기보다 평소 빠져 있던 자기 관리(수면·식사·관계 정리)에 시간을 쓰시면 다음 달이 한결 가벼워집니다.',
        caution: '한 박자 늦추셔야 하는 달이에요. 한 달 안에 큰 결정 두세 개가 몰리시면 그중 하나가 어긋나기 쉬우니, 큰 결정은 이번 달 안에 한 가지만 골라 처리하십시오.',
        tough:   '단단히 지키셔야 하는 달이에요. 큰돈·큰 약속·큰 변화는 이번 달엔 멈추시고, “지금 있는 것을 무너지지 않게 점검하는” 데 시간을 쓰시면 다음 달이 자연스럽게 풀립니다.'
    })[mTone];

    // ── 5) 세 시간이 만나는 자리 — 종합 한 문단 (~250자) ──
    var totalStoryBase = '세 시간을 한 자리에 겹쳐 보면, ' + nmUi(name) + ' 지금 시기는 ';
    var totalStory = totalStoryBase + ({
        good:    '말 그대로 “기운이 한꺼번에 모이는 시기”예요. 큰 10년이 좋고, 올 한 해가 좋고, 이번 달까지 좋은 — 평생 두세 번 만나기 어려운 자리에 와 계세요. 다만 운이 좋다고 곳곳에 손을 펼치시면 결과가 흩어지기 쉬우니, 평생 끌고 가실 한두 가지에만 이 시기의 힘을 모아 두십시오.',
        mild:    '큰 위협 없이 부드럽게 흘러가는 시기예요. 평소 페이스를 유지하시면서 본인이 잘하는 것 한 가지를 깊이 가시면, 이 시기가 끝날 무렵 한 단계 또렷한 자리에 닿아 있을 거예요.',
        flat:    '큰 굴곡 없이 평탄한 시기예요. 새로 벌이기보다 정리·점검에 마음을 쓰시면 다음 시기의 출발선이 훨씬 가벼워집니다.',
        caution: '결정의 무게가 평소보다 무거워지는 시기예요. 새 일보다 “지금 있는 것을 흔들리지 않게 지키는 쪽”이 정답에 가깝습니다.',
        tough:   '단단히 지키셔야 하는 시기예요. 이 시기에 새로 벌인 일은 다음 시기까지 짐으로 따라오기 쉬우니, 새로 시작하는 것보다 무너지지 않게 지키는 데 가장 큰 힘이 있습니다.'
    })[totalTone];

    // ── 6) 다섯 영역을 한 흐름으로 (~연애·건강·합격·직업·재물) ──
    var loveText = '이 흐름이 ' + nmUi(name) + ' <strong>연애와 인연</strong>에 비추어지는 모양은 — ' + (
        totalTone === 'good' ? '이번 시기에 시작되는 인연은 오래 갈 가능성이 큽니다. 이미 만나고 계신 분이라면 한 단계 깊은 약속(결혼·동거·공식화)을 이 시기에 매듭지으시면 자연스럽게 풀려요. 새로 시작하시는 분이라면, 큰 모임보다 같은 결의 소모임에서 만나는 인연이 더 단단합니다. 한 사람을 깊이 보시는 시간을 의도적으로 비워 두십시오.' :
        totalTone === 'mild' ? '큰 풍파 없이 잔잔하게 흐릅니다. 새 인연을 적극적으로 찾으시기보다, 지금 옆에 계신 사람과 약속을 한 가지씩 차곡차곡 쌓아 가시는 게 가장 큰 이득이 됩니다. 무리한 고백·이별보다는 “말 한마디 더 따뜻하게” 정도면 충분해요.' :
        totalTone === 'flat' ? '연애 흐름 자체는 평온해요. 큰 사건이 일어나는 시기는 아니니, 오히려 이 시기에 ' + nmDnim(name) + ' 자신의 연애 패턴을 한 번 돌아보시기 좋아요. 같은 사람에게 반복해서 끌리시는 이유, 매번 어긋나는 지점 — 한 번 노트에 적어 보시면 다음 인연이 보입니다.' :
        '큰 결정을 미루시는 게 좋은 시기예요. 이별·결혼·동거·고백 같은 큰 결정은 가능하면 이 시기를 지나신 뒤로 미루시는 게 좋아요. 지금 당장의 감정에 휩쓸려 큰 결정을 내리시면, 시간이 지난 뒤에 후회로 돌아올 가능성이 큽니다. 다만 갈등이 있다면, 큰 결정을 내리지 않은 채로 “대화 한 번 더”를 더해 두십시오.'
    );

    var healthText = '<strong>건강과 컨디션</strong>은 — ' + (
        totalTone === 'good' ? '체력이 평소보다 한 단계 위로 올라온 시기예요. 다만 컨디션이 좋다고 무리하시면 그게 다음 시기에 한꺼번에 돌아옵니다. 운동·수면 루틴을 이때 한 번 단단히 고정해 두시면 평생의 자산이 됩니다.' :
        totalTone === 'mild' ? '큰 건강 이슈는 없는 시기지만, 정기 검진을 미루지 않으시는 게 좋아요. 1년에 한 번, 본인 건강검진 + 안과·치과 정도는 같은 달에 묶어 두시면 빼먹지 않으십니다.' :
        totalTone === 'flat' ? '몸은 무난하지만 마음의 피로가 쌓이기 쉬운 시기예요. 수면 시간 한 가지만 평소보다 30분 일찍 고정하셔도 다음 시기가 한결 가볍습니다.' :
        '면역이 평소보다 얇아진 시기예요. 술·철야·과로 — 이 셋 중 두 가지가 겹치는 주를 만들지 마시고, 건강검진을 이 시기 안에 한 번 더 잡아 두십시오. 마음 건강(불안·우울·불면)도 같이 점검하시는 게 좋습니다.'
    );

    var hapText = ' 그리고 <strong>시험·자격·문서</strong> 쪽은 — ' + (
        (totalTone === 'good' || totalTone === 'mild') && inC / sipTotal >= 0.15 ?
            '인성(印) 기운이 받쳐 주고 운까지 맞물려 들어오는, 합격에 가장 가까운 시기예요. 미뤄 두셨던 시험·자격증·서류 작업이 있다면 이 시기 안에 매듭짓고 가시는 게 가장 좋습니다.' :
        totalTone === 'good' || totalTone === 'mild' ?
            '큰 막힘 없이 진행되는 시기예요. 다만 인성(印, 공부·자격) 기운은 평균이라, 꾸준한 누적(평일 1시간 학습 같은 작은 루틴)이 결실로 돌아오는 시기입니다. 단번 합격을 노리시기보다 분기별로 한 단계씩 올라가시는 게 자연스러워요.' :
        totalTone === 'flat' ?
            '시험·자격을 새로 시작하시기엔 자극이 부족한 시기예요. 다만 한 번 시작하신 공부를 “끊지 않고 이어 가는 데”는 좋은 시기라, 이미 시작하신 공부를 한 단계 마무리하는 데 시간을 쓰시면 좋습니다.' :
            '큰 시험·큰 면접·큰 계약은 가능하면 이 시기를 지나신 뒤로 미루시는 게 좋아요. 지금 당장의 결과보다, 다음 인성(印) 기운(임·계·인·묘·해·자 글자가 들어오는 해)이 들어오는 시기를 기다리시는 게 결실이 훨씬 단단해집니다.'
    );

    var workText = '<strong>직업과 일</strong>에 비추어지는 모양은 — ' + (
        totalTone === 'good' && gwanC / sipTotal >= 0.15 ?
            '관성(官, 조직·자리) 기운에 운이 함께 실리는 흐름이라, 승진·이직·창업 같은 큰 자리 이동이 잘 풀리는 시기예요. 미뤄 두셨던 직장 관련 결정 한두 가지를 이 시기 안에 매듭지으시면 좋습니다.' :
        totalTone === 'good' || totalTone === 'mild' ?
            '하시는 일에 빛이 드는 시기예요. 성과를 숫자로 남기는 것(매출·작품·발표 같은 식으로)이 이 시기에 가장 큰 이득이 됩니다. 평소보다 한 단계 더 적극적으로 본인의 결과물을 외부에 드러내 보십시오.' :
        totalTone === 'flat' ?
            '큰 변동 없이 평탄한 직장 흐름이에요. 새 이직·새 사업보다, 지금 자리에서의 신뢰를 한 단계 더 쌓는 데 무게를 두시는 게 더 큰 이득이 됩니다.' :
            '큰 직장 결정(이직·창업·퇴사)은 이 시기를 지나신 뒤로 미루시는 게 좋아요. 지금 자리에서 어쩔 수 없는 변화는 받아들이시되, 본인이 먼저 흔드는 큰 결정은 보류하시면 다음 시기가 훨씬 가볍게 풀립니다.'
    );

    var wealthText = '마지막으로 <strong>재물과 돈의 흐름</strong>은 — ' + (
        totalTone === 'good' && jaeC / sipTotal >= 0.15 ?
            '재성(財) 기운에 운이 함께 실리는 흐름이라, 벌이 통로가 한두 갈래 더 열리는 시기예요. 다만 동시에 새는 통로도 함께 늘기 쉬우니, “이번 달에 들어오고 나가는 돈” 표 한 장만은 꼭 만들어 두십시오.' :
        totalTone === 'good' || totalTone === 'mild' ?
            '평소보다 수입이 안정적으로 흐르는 시기예요. 새 투자보다 기존 통장 정리(고정비·구독·보험)에 시간을 쓰시면 다음 시기로 갈 때 가장 큰 이득이 됩니다.' :
        totalTone === 'flat' ?
            '돈의 큰 굴곡이 적은 시기예요. 저축·실물 자산처럼 천천히 쌓이는 쪽에만 무게를 두시면 됩니다. 변동 큰 자산이나 큰 보증·동업은 이번 시기에 절대 늘리지 마십시오.' :
            '재물이 새기 쉬운 시기예요. 빌린 돈으로 버는 투자, 보증, 큰 동업, 보증금이 큰 임대는 이 시기를 지나신 뒤로 미루십시오. 큰 결정은 “이틀 밤을 자고 글로 받은 뒤에만” 내리시면 큰 손해는 막을 수 있습니다.'
    );

    var closing = '이렇게 ' + nmUi(name) + ' 지금 시기를 — 가장 큰 대운부터 한 달의 월운까지, 그리고 그 위에 비친 다섯 자리의 모양까지 — 한 흐름으로 풀어 드렸어요. 다음 챕터에서는 이 흐름이 “앞으로” 어떻게 이어지는지 — 다가올 대운 두 개와, 다음 해부터의 10년, 다음 11개월까지 차근차근 짚어 드릴게요.';

    // ── HTML 조립 — 제목은「현재의 운세」한 가지만 크게, 부제는 대운·세운·월운 안내 ──
    var chHead = '<div class="ch-head-current-period" style="margin-bottom:12px;">'
        + '<h2 class="ch-title-current-period" style="font-family:\'Noto Sans KR\',sans-serif;font-size:clamp(17px,3.9vw,21px);font-weight:800;line-height:1.25;margin:0 0 8px;color:var(--text,rgba(255,255,255,0.96));">현재의 운세</h2>'
        + '<p style="font-size:10px;letter-spacing:0.10em;color:rgba(199,167,106,0.62);margin:0;font-weight:700;">대운 · 세운 · 월운 그리고 다섯 영역</p>'
        + '</div>';

    return '<div class="report-chapter">'
        + chHead
        + snapshotHtml
        + para(intro)
        + para(daeunStory)
        + para(sewunStory)
        + para(wolunStory)
        + para(totalStory)
        + para(loveText)
        + para(healthText + ' ' + hapText)
        + para(workText)
        + para(wealthText)
        + para(closing)
        + '</div>';
}


/** ─────────────────────────────────────────
 *  buildUpcomingFortuneIntro — "앞으로의 운" 챕터 도입 카드
 *  · 대운·세운·월운 개념 설명을 이 자리에서 한 번 정리
 *  · 앞으로 올 대운/세운/월운 3개 챕터의 공통 도입 역할
 * ───────────────────────────────────────── */
function buildUpcomingFortuneIntro(data) {
    var name = (data && data.name) ? data.name : '고객';
    function _vp(t) { return voicePolishParagraph(data, t); }

    function conceptBox(label, body, color) {
        return '<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:13px 16px;border-left:3px solid ' + color + ';">'
            + '<div style="font-size:11px;font-weight:700;color:' + color + ';letter-spacing:0.08em;margin-bottom:6px;">' + label + '</div>'
            + '<p style="font-size:12.5px;color:#bbb;line-height:1.92;margin:0;">' + _vp(body) + '</p></div>';
    }
    var conceptHtml = '<div style="display:grid;grid-template-columns:1fr;gap:10px;margin:14px 0 4px;">'
        + conceptBox('대운 (大運) — 10년짜리 큰 계절', '인생 전체를 10년 단위로 끊었을 때, 그 시기에 ' + nmKke(name) + ' 어떤 공기가 둘러싸여 있는지를 보여 줘요. 큰 방향성·전반적인 분위기·이 시기에 살아 봐야 할 주제를 정해 주는 가장 큰 흐름입니다.', '#c7a76a')
        + conceptBox('세운 (歲運) — 그해 한 해의 날씨', '대운이 “큰 계절”이라면, 세운은 “그 계절 안의 한 해 날씨”에 해당해요. 같은 봄이라도 비가 잦은 해와 햇살이 좋은 해가 다르듯, 한 해 안에서 어떤 일이 잦아질지를 보여 줍니다.', '#5ec183')
        + conceptBox('월운 (月運) — 한 달 안의 시간대', '세운이 한 해의 날씨라면, 월운은 그 안의 “하루 중 시간대”에 가까워요. 한 달 단위로 컨디션·관계·돈의 흐름이 미세하게 바뀌니, 이번 달 안에서 어디에 힘을 실을지를 잡는 데 가장 좋습니다.', '#7fa5d6')
        + '</div>';

    var chHead = (typeof buildChapterHeadMainSub === 'function')
        ? buildChapterHeadMainSub('앞으로의 운', '다가올 대운 · 세운 · 월운을 한 번에 정리')
        : '<h2 class="ch-title">앞으로의 운</h2>';

    return '<div class="report-chapter">'
        + chHead
        + '<p class="ch-text" style="font-size:14px;color:var(--text);line-height:2.05;margin:0 0 14px;">'
        + _vp('지금 시기를 한 흐름으로 살펴 드렸다면, 이제 “앞으로” 어떤 시간이 다가오는지 — 다가올 대운 두 개, 다음 해부터 10년의 세운, 다음 달부터 11개월의 월운을 차례대로 짚어 드릴게요. 시작 전에, 이 세 단어가 정확히 무엇을 가리키는지 다시 한 번 정리해 둘게요.')
        + '</p>'
        + conceptHtml
        + '<p class="ch-text" style="font-size:13px;color:#999;line-height:1.92;margin:14px 0 0;">'
        + _vp('아래는 한 시기당 한 문단 정도로 짧게 짚어 드렸어요. 본인이 가장 신경 쓰이시는 시기 — 큰 결정을 잡고 싶으신 해, 또는 한 박자 늦추고 싶으신 달 — 한두 자리만 골라 마음에 두시면 충분합니다.')
        + '</p>'
        + '</div>';
}


/** ─────────────────────────────────────────
 *  buildUpcomingDaewunCards — 다음 대운 + 그 다음 대운 (각 ~500자)
 * ───────────────────────────────────────── */
function buildUpcomingDaewunCards(data) {
    if (!data || !data.dayStem) return '';
    var name = data.name || '고객';
    var rows = (data.daeunRows && data.daeunRows.length) ? data.daeunRows : (data.daewunList || []);
    if (!rows.length) return '';
    var curAge = (typeof getClientAgeYearsAtReport === 'function') ? getClientAgeYearsAtReport(data) : 0;

    var nextRows = [];
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var a = (typeof r.age === 'number') ? r.age : (typeof r.startAge === 'number' ? r.startAge : 0);
        if (a > curAge) nextRows.push({ row: r, age: a });
        if (nextRows.length >= 2) break;
    }
    if (!nextRows.length) return '';

    var GAN_OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    var JI_OH  = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    var HK = {'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계','子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    var OH_KR = { wood:'목(나무)', fire:'화(불)', earth:'토(흙)', metal:'금(쇠)', water:'수(물)' };
    var yong = data.yong || ''; var hee = data.hee || ''; var gi = data.gi || ''; var goo = data.goo || '';
    function score(g, j) {
        var s = 0; var go = GAN_OH[g]; var jo = JI_OH[j];
        if (go === yong || go === hee) s += 2; if (go === gi || go === goo) s -= 2;
        if (jo === yong || jo === hee) s += 2; if (jo === gi || jo === goo) s -= 2;
        return s;
    }

    var STAGE_TEMPLATE = {
        wood:    nmDnim(name) + ' 이 10년에는 <strong>“시작·확장·새 학습”</strong>의 기운이 두껍게 깔립니다. 새 일·새 사람·이사·이직처럼 “처음 디뎌 보는 자리”가 자주 열려요. 평소보다 호기심이 늘고, 새 것에 대한 흡수력이 가장 좋은 시기라, 한 분야의 자격증 한 장이나 새로운 기술 한 가지를 익히기에 평생을 통틀어 가장 적기에 가까워요. 다만 동시에 “시작만 잦아지고 마무리가 밀리는” 패턴이 따라오기 쉬우니, 새 도전은 1년에 한두 개로만 묶어 가시고, 끝맺음을 책임질 동료 한 명만 옆에 두십시오. 가족 안에서도 이사·동거·결혼처럼 “새 자리”가 한 번씩 열리는 시기예요.',
        fire:    nmDnim(name) + ' 이 10년에는 <strong>“드러남·성취·이름”</strong>의 기운이 두껍게 깔립니다. 평소보다 ' + nmIGa(name) + ' 외부에 노출되는 일이 늘고, 한 번 인정받기 시작하면 그 흐름이 한 분기 안에 빠르게 커지는 시기예요. 발표·강연·매체 노출·승진 — 셋 중 하나는 이 10년 안에 반드시 한 번 따라옵니다. 다만 빛이 커진 만큼 그 뒷면도 같이 흔들리기 쉬워요. 수면 시간·지출 한도·건강검진 — 이 세 가지의 상한선을 시작 시점에 미리 정해 두지 않으시면, 10년이 끝날 무렵 빛만큼 그림자도 길어집니다. “인정받을 때 가장 차분해야 한다”는 한 줄을 늘 기억해 두세요.',
        earth:   nmDnim(name) + ' 이 10년에는 <strong>“안정·축적·완성”</strong>의 기운이 두껍게 깔립니다. 큰 사건보다는 그동안 쌓아 오신 것들을 정리하고 결실로 거두는 쪽이 자연스러워요. 서두르지 않으셔도 흐름이 받쳐 주니, 자산·관계·역할 중 한 가지만 골라 마무리해 가시면 됩니다. 특히 부동산·실물 자산·반복 계약처럼 “느려도 단단하게 쌓이는 것”들이 이 시기의 가장 큰 친구예요. 가족·동료와의 신뢰가 한 단계 더 깊어지는 시기이기도 합니다. 다만 변화에 대한 적응이 평소보다 더디게 느껴질 수 있으니, 큰 이직·큰 이사 같은 결정은 시기 초반에 다 풀고, 후반부엔 정착에 무게를 두십시오.',
        metal:   nmDnim(name) + ' 이 10년에는 <strong>“결단·정리·전문성”</strong>의 기운이 두껍게 깔립니다. 안 맞는 사람·일·물건을 잘라 내실 때 ' + nmKke(name) + ' 가장 큰 이득이 돌아옵니다. 한 분야를 깊게 파시면 그 깊이가 다음 시기의 가장 큰 자산이 돼요. 평소 “이건 끊어야 하는데” 미루셨던 관계·역할·습관 한두 가지를 이 10년 안에 정리하시면, 그게 인생의 큰 전환점이 됩니다. 다만 결단이 너무 잦아지면 주위 사람이 “찬 사람”으로 ' + nmEulReul(name) + ' 볼 수 있으니, 자르는 순간 한마디 따뜻한 설명을 곁들이시는 습관을 들이세요.',
        water:   nmDnim(name) + ' 이 10년에는 <strong>“통찰·정보·인맥”</strong>의 기운이 두껍게 깔립니다. 말보다 기록이 이기는 시기라, 본인이 보고 들은 것을 한 권의 노트·한 폴더로만 정리해 두시면 그게 다음 시기의 가장 큰 자본이 됩니다. 사람들이 ' + nmEulReul(name) + ' 찾아와 의논하는 일이 늘어요. 그 자리에서 듣고 정리하시는 힘이 평생 ' + nmUi(name) + ' 직업이 되기도 합니다. 다만 말이 많아질수록 손해도 같이 커지는 시기라, 메모는 두 배로 늘리시고 발언은 절반으로 줄이세요. 깊이 보는 안목이 가장 빛나는 10년이라, 큰 결정은 늘 며칠 자고 내리시는 습관을 만들어 두시면 좋습니다.'
    };
    var TONE_TAIL = {
        good:    ' 이 흐름은 ' + nmKke(name) + ' 본래 잘 맞는 기운과 겹쳐, 평생 두세 번 만나기 어려운 “공격해도 좋은 10년”에 가까워요. 미뤄 두셨던 큰 일 — 결혼·창업·이직·자격증·자산 매입 — 가운데 한두 가지를 이 시기 안에 풀고 가시는 게 가장 큰 이득이 됩니다. 다만 운이 좋다고 모든 자리에 손을 펼치시면 결과가 흩어지기 쉬우니, 평생 끌고 가실 큰 축 한두 가지에만 이 시기의 힘을 모아 두십시오.',
        mild:    ' 큰 풍파 없이 한 발씩 내디디시는 만큼 결과가 돌아오는 흐름이에요. 평소 페이스를 유지하시는 게 정답입니다. 한 해에 한 번씩, 본인이 무엇을 쌓아 오셨는지 짧게 정리해 두시면 10년이 끝났을 때 그 기록이 가장 큰 무기가 돼요.',
        flat:    ' 큰 길도 큰 흉도 적은 평탄한 흐름이에요. 새로 시작하시기보다 “이미 손에 쥐고 계신 것들”을 다듬는 데 시간을 쓰시면 좋습니다. 직업이라면 한 분야의 깊이를, 관계라면 가까운 다섯 명과의 약속을, 자산이라면 흩어 놓으신 것들을 한 줄로 정리하시는 한 가지를 가져가십시오.',
        caution: ' 부담이 약간 깔린 흐름이라, 큰 결정은 평소보다 한 박자 늦추시고 “지키는 쪽”에 무게를 두시면 됩니다. 이 시기에 새로 벌이신 일은 다음 시기까지 짐으로 따라오기 쉬우니, 신규 보증·신규 동업·신규 대출은 이 10년 동안 가능한 한 피하시는 게 안전합니다.',
        tough:   ' 부담이 큰 흐름이라, 이 시기에는 새로 벌이기보다 “지금 있는 것을 무너지지 않게 지키는 데” 가장 큰 힘이 있어요. 큰 결정은 다음 대운으로 미루셔도 늦지 않습니다. 이 시기를 무사히 지나신 분들이, 다음 대운에서 가장 단단한 자리에 안착하시는 경우가 많아요. “지키는 게 곧 다음 시기의 출발선”이라고 마음에 새겨 두십시오.'
    };
    function tone(s) { return s >= 3 ? 'good' : s >= 1 ? 'mild' : s === 0 ? 'flat' : s >= -2 ? 'caution' : 'tough'; }
    function toneColor(t) { return ({ good:'#c7a76a', mild:'#5ec183', flat:'#9b9b9b', caution:'#e0a040', tough:'#c84a4a' })[t] || '#888'; }
    function toneLabel(t) { return ({ good:'잘 풀리는 10년', mild:'한 발 더 내디뎌도 좋은 10년', flat:'안정·정돈에 좋은 10년', caution:'한 박자 늦추는 10년', tough:'단단히 지키는 10년' })[t] || '안정 10년'; }

    var cards = nextRows.map(function (nx, idx) {
        var rr = nx.row;
        var g = (rr.gz && rr.gz[0]) || (rr.h && rr.h[0]) || rr.gan || '';
        var j = (rr.gz && rr.gz[1]) || (rr.h && rr.h[1]) || rr.ji || '';
        if (!g || !j) return '';
        var sc = score(g, j);
        var t = tone(sc);
        var gOh = GAN_OH[g] || ''; var jOh = JI_OH[j] || '';
        // 대운의 주된 오행: 천간 기준 (전통적으로 상반은 천간, 하반은 지지)
        var primary = gOh || jOh || 'earth';
        var body = STAGE_TEMPLATE[primary] + TONE_TAIL[t];
        var col = toneColor(t);
        var orderLabel = idx === 0 ? '다음 대운' : '그 다음 대운';
        var ageRange = nx.age + '세 ~ ' + (nx.age + 9) + '세';
        var ohTag = (OH_KR[gOh] || '') + ' · ' + (OH_KR[jOh] || '');
        return '<div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:18px 20px;margin-bottom:14px;border:1px solid ' + col + '22;border-left:3px solid ' + col + ';">'
            + '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">'
            + '<div><div style="font-size:10px;letter-spacing:0.12em;color:' + col + ';font-weight:700;margin-bottom:4px;">' + orderLabel + '</div>'
            + '<div style="font-size:18px;font-weight:800;color:#fff;font-family:\'Noto Sans KR\',sans-serif;">' + (HK[g] || g) + (HK[j] || j) + '<span style="font-size:12px;color:#888;margin-left:6px;">(' + g + j + ')</span></div></div>'
            + '<div style="text-align:right;"><div style="font-size:11px;color:#888;">' + ageRange + '</div>'
            + '<div style="font-size:10px;color:' + col + ';margin-top:2px;">' + ohTag + ' · ' + toneLabel(t) + '</div></div></div>'
            + '<p style="font-size:13px;color:#ccc;line-height:1.95;margin:0;">' + boldStarsToStrong(voicePolishParagraph(data, body)) + '</p>'
            + '</div>';
    }).join('');

    var chHead = (typeof buildChapterHeadMainSub === 'function')
        ? buildChapterHeadMainSub('앞으로 올 대운', '다음 10년 · 그 다음 10년 한눈에')
        : '<h2 class="ch-title">앞으로 올 대운</h2>';

    return '<div class="report-chapter">'
        + chHead
        + '<p class="ch-text" style="font-size:14px;color:var(--text);line-height:2;margin:0 0 14px;">' + voicePolishParagraph(data, '지금 시기를 살핀 다음에는, ' + nmKke(name) + ' 곧 다가올 두 개의 큰 10년을 짧게 짚어 드릴게요. 한 시기당 한 문단 정도라 가볍게 읽으셔도 충분하고, 미리 알아 두시면 “다음 시기가 어떤 공기인지” 마음의 준비가 됩니다.') + '</p>'
        + cards
        + '</div>';
}


/** ─────────────────────────────────────────
 *  buildUpcomingSewunCards — 다음 해부터 10년 세운 (각 200~300자)
 * ───────────────────────────────────────── */
function buildUpcomingSewunCards(data) {
    if (!data || !data.dayStem) return '';
    var name = data.name || '고객';
    var baseNow = (typeof getReportBaseDate === 'function') ? getReportBaseDate(data) : new Date();
    var startYear = baseNow.getFullYear() + 1;

    var GAN_HJ_ARR = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    var JI_HJ_ARR  = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    var HK = {'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계','子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    var GAN_OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    var JI_OH  = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    var yong = data.yong || ''; var hee = data.hee || ''; var gi = data.gi || ''; var goo = data.goo || '';

    function scoreY(g, j) {
        var s = 0; var go = GAN_OH[g]; var jo = JI_OH[j];
        if (go === yong || go === hee) s += 2; if (go === gi || go === goo) s -= 2;
        if (jo === yong || jo === hee) s += 2; if (jo === gi || jo === goo) s -= 2;
        return s;
    }
    function tone(s) { return s >= 3 ? 'good' : s >= 1 ? 'mild' : s === 0 ? 'flat' : s >= -2 ? 'caution' : 'tough'; }
    function toneColor(t) { return ({ good:'#c7a76a', mild:'#5ec183', flat:'#9b9b9b', caution:'#e0a040', tough:'#c84a4a' })[t] || '#888'; }
    function toneLabel(t) { return ({ good:'잘 풀리는 해', mild:'순한 흐름의 해', flat:'정돈의 해', caution:'한 박자 늦추는 해', tough:'단단히 지키는 해' })[t] || '안정 해'; }

    // 천간/지지별 한 줄 키워드 (간결)
    var GAN_KW = {
        '甲':'시작·새 학습', '乙':'관계·협력', '丙':'드러남·홍보', '丁':'깊이·전문', '戊':'안정·축적',
        '己':'정리·마무리', '庚':'결단·정리', '辛':'완성·세련', '壬':'정보·확장', '癸':'학습·내공'
    };
    var JI_KW = {
        '子':'집중·기획', '丑':'인내·저력', '寅':'활동·변화', '卯':'인맥·확장', '辰':'잠재·변수',
        '巳':'결단·변신', '午':'성취·인정', '未':'창작·풍요', '申':'판단·속도', '酉':'완성·보상',
        '戌':'정리·전환', '亥':'잠복·준비'
    };

    // 천간 한 줄 — 한 해의 큰 분위기
    var GAN_LINE = {
        '甲':'시작과 새 학습이 잦아지는 한 해라, 새 일·새 사람·새 환경이 평소보다 빨리 들어옵니다.',
        '乙':'사람과 관계로 길이 열리는 한 해라, 혼자 끌어가시기보다 협업 한두 자리가 큰 도움이 됩니다.',
        '丙':'드러남·표현·홍보의 기운이 강해, 본인의 결과물이 외부에 노출되는 일이 평소보다 늘어납니다.',
        '丁':'깊이와 전문성에 빛이 드는 해라, 한 분야를 깊게 파시면 그 깊이가 즉시 보상으로 돌아옵니다.',
        '戊':'안정과 축적의 기운이 두꺼워, 큰 사건보다 신뢰가 차곡차곡 쌓이는 한 해가 됩니다.',
        '己':'정리·마무리·연장의 기운이 깔려, 이미 벌이신 일들의 결산을 보시기 좋은 한 해예요.',
        '庚':'결단과 정리의 기운이 강해, 안 맞는 한두 가지를 잘라 내시면 큰 이득이 따라옵니다.',
        '辛':'완성과 세련의 기운이 도드라져, 한 가지를 “브랜드”로 다듬는 데 가장 좋은 한 해입니다.',
        '壬':'흐름과 확장의 기운이 강해, 정보·인맥·새 채널 가운데 한 자리가 크게 열립니다.',
        '癸':'학습·연구·내공의 기운이 깔려, 조용히 내면을 채우시는 데 좋은 한 해예요.'
    };
    // 지지 한 줄 — 그 해의 현장 분위기
    var JI_LINE = {
        '子':'기획·문서·집중이 빛나는 자리라, 큰 결정을 위한 자료 정리에 가장 좋은 시기입니다.',
        '丑':'느려도 단단히 쌓이는 한 해라, 눈에 띄지 않는 노력이 미래의 토대가 됩니다.',
        '寅':'활동과 새 출발의 자리라, 이사·이직·새 과제 가운데 한 가지가 자연스럽게 따라옵니다.',
        '卯':'인맥과 협업의 자리라, 사람을 통해 길이 열리는 한 해입니다.',
        '辰':'잠재력과 변수가 함께 오는 자리라, 큰 결정은 분기 초·말에만 잡으시는 게 좋습니다.',
        '巳':'결단과 변신이 따라오는 자리라, 미뤄 두신 결정 한 가지가 자연스럽게 풀려나갑니다.',
        '午':'성취와 인정의 자리라, 본인의 결과물이 외부에서 인정받는 일이 한 번 따라옵니다.',
        '未':'창작과 풍요가 깔린 자리라, 콘텐츠·예술·교육 쪽으로 길이 열리기 쉽습니다.',
        '申':'판단과 속도가 승부를 가르는 자리라, 빠른 결정이 큰 차이를 만듭니다.',
        '酉':'완성과 보상의 자리라, 그동안 쌓아 오신 노력이 결실로 돌아옵니다.',
        '戌':'정리와 전환의 자리라, 끊을 것과 남길 것을 가르시기에 가장 좋은 한 해예요.',
        '亥':'잠복과 준비의 자리라, 큰 무대보다 내실을 채우는 데 무게를 두시면 좋습니다.'
    };

    function bodyFor(yr, g, j, t) {
        var head = yr + '년 (' + (HK[g] || g) + (HK[j] || j) + ') — ' + nmKke(name) + ' 한 해의 큰 결을 말씀드리면, 천간은 ' + (GAN_LINE[g] || '') + ' 지지에 깔린 ' + (HK[j] || j) + '(' + j + ') 자리는 ' + (JI_LINE[j] || '') + ' 두 기운이 한 해 동안 ' + nmEulReul(name) + ' 둘러싸고 흐릅니다.';
        var body = ({
            good:    ' 대체로 ' + nmKke(name) + ' 잘 맞는 기운이 두껍게 깔리는 한 해라, 새로 시작하시거나 미뤄 두셨던 큰 결정을 매듭짓기에 좋은 시기예요. 한 해의 처음에 “올해의 우선순위 한 줄”을 정해 두시고, 분기마다 한 번씩 숫자나 한 줄 기록으로 진행 상황을 확인하시면 다음 해가 한결 단단해집니다. 다만 운이 좋다고 곳곳에 손을 펼치시면 그중 한두 자리가 어긋날 수 있으니, 큰 결정은 분기당 한 가지만 잡으십시오.',
            mild:    ' 큰 풍파 없이 결실이 차곡차곡 따라붙는 한 해예요. 검증된 한 가지 일에 속도를 올리시고, 새 시도는 분기에 한 번씩 가볍게 더하시는 정도가 가장 자연스럽습니다. 평소 페이스를 유지하시는 게 가장 큰 이득이 되니, 무리해서 한 해 안에 다 끝내려 하지 마시고 “이번 해의 1순위 한 가지”를 정해 그것만 마무리하셔도 충분합니다.',
            flat:    ' 큰 사건보다 정리와 점검에 무게가 실리는 한 해예요. 새로 시작하시기보다 “끊을 한 가지·이어 갈 한 가지”를 가르시는 데 마음을 쓰시면 다음 해가 한결 가볍게 풀립니다. 직장이라면 본인의 역할 한 줄을, 관계라면 가까운 다섯 명의 이름을, 자산이라면 들어오고 나가는 돈 한 줄을 — 셋 중 한 가지를 깔끔하게 정리해 두시는 한 해로 잡으세요.',
            caution: ' 결정의 무게가 평소보다 무거워지는 한 해예요. 큰돈·큰 관계·큰 자리 — 이 셋 중 두 가지를 동시에 흔들지 마시고, 한 가지에만 집중하시면 한 해가 부드럽게 흘러갑니다. 새 시도보다 이미 있는 것을 단단히 지키시는 쪽이 더 큰 이득이 되는 시기라, 새 계약·새 보증·새 큰 지출은 한 분기 정도 미루셨다가 다시 검토하시는 습관을 들이세요.',
            tough:   ' 한 발 물러서 보시는 게 정답에 가까운 한 해예요. 새 시작·큰 투자·보증·동업 확장은 가능하면 다음 해 이후로 미루시고, 올해는 “지금 있는 것을 흔들리지 않게 지키는” 한 가지 목표만 가져가시면 결과가 단단해집니다. 본인의 건강·가족·핵심 거래처 셋만 흔들리지 않게 챙기시면, 이 해가 의외로 다음 시기의 가장 단단한 출발선이 됩니다.'
        })[t];
        return head + body;
    }

    var cards = '';
    for (var k = 0; k < 10; k++) {
        var yr = startYear + k;
        var gI = ((yr - 4) % 10 + 10) % 10;
        var jI = ((yr - 4) % 12 + 12) % 12;
        var g = GAN_HJ_ARR[gI]; var j = JI_HJ_ARR[jI];
        var sc = scoreY(g, j);
        var t = tone(sc);
        var col = toneColor(t);
        var body = bodyFor(yr, g, j, t);
        cards += '<div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:14px 16px;border-left:3px solid ' + col + ';margin-bottom:10px;">'
              + '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">'
              + '<div style="font-size:15px;font-weight:800;color:#fff;font-family:\'Noto Sans KR\',sans-serif;">' + yr + '년 <span style="color:var(--gold);">' + (HK[g] || g) + (HK[j] || j) + '</span><span style="font-size:11px;color:#888;margin-left:6px;">(' + g + j + ')</span></div>'
              + '<span style="font-size:10px;background:rgba(255,255,255,0.06);color:' + col + ';padding:2px 8px;border-radius:8px;letter-spacing:0.03em;">' + toneLabel(t) + '</span>'
              + '</div>'
              + '<p style="font-size:12.5px;color:#ccc;line-height:1.92;margin:0;">' + boldStarsToStrong(voicePolishParagraph(data, body)) + '</p>'
              + '</div>';
    }

    var chHead = (typeof buildChapterHeadMainSub === 'function')
        ? buildChapterHeadMainSub('앞으로 올 세운', '다음 해부터 10년')
        : '<h2 class="ch-title">앞으로 올 세운</h2>';

    return '<div class="report-chapter">'
        + chHead
        + '<p class="ch-text" style="font-size:14px;color:var(--text);line-height:2;margin:0 0 14px;">' + voicePolishParagraph(data, '대운이 “10년짜리 큰 계절”이라면 세운은 “그 안의 한 해 날씨”예요. 아래는 ' + nmKke(name) + ' 곧 찾아올 10년의 한 해 한 해를 짧게 짚어 드린 것이에요. 한 해당 한 문단 정도로 가볍게 읽으시면서, 본인이 큰 결정을 잡고 싶으신 해가 “어떤 결의 해”인지를 미리 알아 두십시오.') + '</p>'
        + '<div style="display:flex;flex-direction:column;gap:0;">' + cards + '</div>'
        + '</div>';
}


/** ─────────────────────────────────────────
 *  buildUpcomingWolunCards — 다음 11개월 월운 (각 200~300자)
 * ───────────────────────────────────────── */
function buildUpcomingWolunCards(data) {
    if (!data || !data.dayStem) return '';
    var name = data.name || '고객';
    var baseNow = (typeof getReportBaseDate === 'function') ? getReportBaseDate(data) : new Date();
    var startYear = baseNow.getFullYear();
    var startMonth = baseNow.getMonth() + 1; // 1-indexed, 이번 달
    // 다음 달부터 11개월
    var firstMonth = startMonth + 1;

    var GAN_OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    var JI_OH  = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    var HK = {'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계','子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    var GAN_KR_ARR = ['갑','을','병','정','무','기','경','신','임','계'];
    var GAN_HJ_FROM_KR = {'갑':'甲','을':'乙','병':'丙','정':'丁','무':'戊','기':'己','경':'庚','신':'辛','임':'壬','계':'癸'};
    var JI_HJ_FROM_KR  = {'자':'子','축':'丑','인':'寅','묘':'卯','진':'辰','사':'巳','오':'午','미':'未','신':'申','유':'酉','술':'戌','해':'亥'};
    var MONTH_JI_KR = ['인','묘','진','사','오','미','신','유','술','해','자','축'];
    var MONTH_GAN_START_TBL = [2, 4, 6, 8, 0];
    var yong = data.yong || ''; var hee = data.hee || ''; var gi = data.gi || ''; var goo = data.goo || '';

    function scoreM(g, j) {
        var s = 0; var go = GAN_OH[g]; var jo = JI_OH[j];
        if (go === yong || go === hee) s += 2; if (go === gi || go === goo) s -= 2;
        if (jo === yong || jo === hee) s += 2; if (jo === gi || jo === goo) s -= 2;
        return s;
    }
    function tone(s) { return s >= 3 ? 'good' : s >= 1 ? 'mild' : s === 0 ? 'flat' : s >= -2 ? 'caution' : 'tough'; }
    function toneColor(t) { return ({ good:'#c7a76a', mild:'#5ec183', flat:'#9b9b9b', caution:'#e0a040', tough:'#c84a4a' })[t] || '#888'; }
    function toneLabel(t) { return ({ good:'잘 풀리는 달', mild:'순한 달', flat:'정돈의 달', caution:'한 박자 늦추는 달', tough:'단단히 지키는 달' })[t] || '안정 달'; }

    var JI_KW = {
        '子':'집중·기획·문서', '丑':'인내·저력', '寅':'활동·새 출발', '卯':'인맥·협업', '辰':'잠재·변수',
        '巳':'결단·변신', '午':'성취·인정', '未':'창작·풍요', '申':'판단·속도', '酉':'완성·보상',
        '戌':'정리·전환', '亥':'잠복·준비'
    };

    function bodyForMonth(yr, mo, g, j, t) {
        var jKw = JI_KW[j] || '흐름';
        var head = yr + '년 ' + mo + '월(' + (HK[g] || g) + (HK[j] || j) + ')은 ' + nmKke(name) + ' “' + jKw + '”의 결이 깔리는 한 달이에요. ';
        var tail = ({
            good:    '이번 달은 한 해 안에서도 특히 결정의 결과가 빨리 보이는 시기에 가까워요. 미뤄 두신 큰 안건 한 가지만 이 달 안에 매듭지으시면, 다음 달이 한결 가볍게 풀립니다. 약속·계약·발표 — 셋 중 하나를 일정의 중심으로 두세요.',
            mild:    '큰 풍파 없이 차분하게 흘러가는 달이에요. 새 시도 한 가지를 가볍게 더하시거나, 지난달의 리듬을 그대로 이어 가시는 정도가 가장 자연스럽습니다.',
            flat:    '큰 사건 없이 평탄한 달이에요. 새 일을 벌이시기보다 평소 빠져 있던 자기 관리(수면·식사·관계 정리)에 시간을 쓰시면 다음 달이 가볍게 풀립니다.',
            caution: '한 박자 늦추셔야 하는 달이에요. 한 달 안에 큰 결정이 두세 개 몰리시면 그중 하나가 어긋나기 쉬우니, 큰 결정은 이번 달 안에 한 가지만 골라 처리하십시오.',
            tough:   '단단히 지키셔야 하는 달이에요. 큰돈·큰 약속·큰 변화는 이번 달엔 멈추시고, “지금 있는 것을 무너지지 않게 점검하는” 데 시간을 쓰시면 다음 달이 자연스럽게 풀립니다.'
        })[t];
        return head + tail;
    }

    var cards = '';
    var addedCount = 0;
    var moPointer = firstMonth;
    var yrPointer = startYear;
    while (addedCount < 11) {
        if (moPointer > 12) { moPointer = 1; yrPointer += 1; }
        var yGanI = ((yrPointer - 4) % 10 + 10) % 10;
        var mGanStart = MONTH_GAN_START_TBL[yGanI % 5];
        var monthIdx = moPointer - 1; // 0~11 for Jan..Dec
        // Wolun uses 인월 = January in this approximation
        var mJiKr = MONTH_JI_KR[monthIdx];
        var mGanIdx = (mGanStart + monthIdx) % 10;
        var mGanKr = GAN_KR_ARR[mGanIdx];
        var mGan = GAN_HJ_FROM_KR[mGanKr] || '甲';
        var mJi  = JI_HJ_FROM_KR[mJiKr] || '寅';
        var sc = scoreM(mGan, mJi);
        var t = tone(sc);
        var col = toneColor(t);
        var body = bodyForMonth(yrPointer, moPointer, mGan, mJi, t);
        cards += '<div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:14px 16px;border-left:3px solid ' + col + ';margin-bottom:10px;">'
              + '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">'
              + '<div style="font-size:14.5px;font-weight:800;color:#fff;font-family:\'Noto Sans KR\',sans-serif;">' + yrPointer + '년 ' + moPointer + '월 <span style="color:var(--gold);margin-left:4px;">' + (HK[mGan] || mGan) + (HK[mJi] || mJi) + '</span><span style="font-size:11px;color:#888;margin-left:4px;">(' + mGan + mJi + ')</span></div>'
              + '<span style="font-size:10px;background:rgba(255,255,255,0.06);color:' + col + ';padding:2px 8px;border-radius:8px;letter-spacing:0.03em;">' + toneLabel(t) + '</span>'
              + '</div>'
              + '<p style="font-size:12.5px;color:#ccc;line-height:1.9;margin:0;">' + boldStarsToStrong(voicePolishParagraph(data, body)) + '</p>'
              + '</div>';
        addedCount += 1;
        moPointer += 1;
    }

    var chHead = (typeof buildChapterHeadMainSub === 'function')
        ? buildChapterHeadMainSub('앞으로 올 월운', '다음 달부터 11개월')
        : '<h2 class="ch-title">앞으로 올 월운</h2>';

    return '<div class="report-chapter">'
        + chHead
        + '<p class="ch-text" style="font-size:14px;color:var(--text);line-height:2;margin:0 0 14px;">' + voicePolishParagraph(data, '세운이 한 해의 날씨라면 월운은 그 안의 “시간대”예요. 아래는 다음 달부터 11개월의 한 달 한 달을 짧게 짚어 드린 거예요. 큰 안건을 잡으실 달과 한 박자 늦추실 달을 미리 표시해 두시면 한 해가 훨씬 가볍게 흘러갑니다.') + '</p>'
        + '<div style="display:flex;flex-direction:column;gap:0;">' + cards + '</div>'
        + '</div>';
}


/** ─────────────────────────────────────────
 *  4대 영역 레이더 차트 — 3부 개요 히어로 비주얼
 *  재물/직업/애정/건강 4각 SVG 폴리곤
 * ───────────────────────────────────────── */
function buildFourDomainRadar(data) {
    const yong = data.yong || ''; const hee = data.hee || '';
    const gi = data.gi || ''; const goo = data.goo || '';
    const wx = data.wuxing || {};
    const sip = data.sipseong || {};
    const OH_MAP = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    const dayOh = OH_MAP[data.dayStem||''] || 'fire';

    // 오행 최다/최소
    const wxKeys = Object.keys(wx);
    const maxW = wxKeys.length ? wxKeys.reduce((a,b)=>wx[a]>wx[b]?a:b) : '';
    const yongOh = OH_MAP[yong]||''; const giOh = OH_MAP[gi]||'';

    // 각 영역 점수 계산 (0~100)
    function clamp(v,mn,mx){return Math.max(mn,Math.min(mx,v));}
    // 재물: 재성(정재+편재) 비중 + 용신 보정
    const wealthBase = ((sip['정재']||0)+(sip['편재']||0))*4;
    const wealthYong = (maxW===yongOh&&maxW!=='') ? 15 : (maxW===giOh&&maxW!=='') ? -10 : 0;
    const wealth = clamp(40 + wealthBase + wealthYong, 10, 95);
    // 직업: 관성(정관+편관) + 식상(식신+상관) 비중
    const careerBase = ((sip['정관']||0)+(sip['편관']||0)+(sip['식신']||0)+(sip['상관']||0))*2.5;
    const career = clamp(45 + careerBase, 10, 95);
    // 애정: 관성(여성 기준) 또는 재성(남성 기준) + 용신 보정
    const loveBase = ((sip['정관']||0)+(sip['편관']||0)+(sip['정재']||0)+(sip['편재']||0))*2;
    const love = clamp(50 + loveBase, 10, 95);
    // 건강: 인성(정인+편인) — 많으면 체력 좋음, 신약이면 -
    const isStrong = data.strengthText && (data.strengthText.includes('신강')||data.strengthText.includes('강'));
    const healthBase = ((sip['정인']||0)+(sip['편인']||0))*3;
    const health = clamp(50 + healthBase + (isStrong ? 10 : -5), 10, 95);

    // SVG 레이더 (4각형, 중심 cx/cy=80)
    const cx=80,cy=80,r=60;
    function toXY(angle, val) {
        const rad = (angle - 90) * Math.PI / 180;
        const rv = r * val / 100;
        return [cx + rv * Math.cos(rad), cy + rv * Math.sin(rad)];
    }
    // 4 axes: 위=재물(0), 오른쪽=직업(90), 아래=애정(180), 왼쪽=건강(270)
    const pts = [
        toXY(0, wealth), toXY(90, career),
        toXY(180, love), toXY(270, health)
    ];
    const outerPts = [
        toXY(0, 100), toXY(90, 100),
        toXY(180, 100), toXY(270, 100)
    ];
    const gridPts50 = [
        toXY(0, 50), toXY(90, 50),
        toXY(180, 50), toXY(270, 50)
    ];
    const poly = pts.map(p=>p.join(',')).join(' ');
    const outerPoly = outerPts.map(p=>p.join(',')).join(' ');
    const grid50 = gridPts50.map(p=>p.join(',')).join(' ');

    // 라벨 위치
    const labels = [
        {label:'재물', val:wealth, x:cx, y:cy-r-14, anchor:'middle'},
        {label:'직업', val:career, x:cx+r+14, y:cy+4, anchor:'start'},
        {label:'애정', val:love, x:cx, y:cy+r+18, anchor:'middle'},
        {label:'건강', val:health, x:cx-r-14, y:cy+4, anchor:'end'}
    ];
    const labelsSvg = labels.map(l =>
        `<text x="${l.x}" y="${l.y}" text-anchor="${l.anchor}" font-size="11" font-weight="700" fill="rgba(255,255,255,0.65)" font-family="'Noto Sans KR',sans-serif">${l.label}</text>
         <text x="${l.x}" y="${parseInt(l.y)+13}" text-anchor="${l.anchor}" font-size="10" fill="rgba(199,167,106,0.8)" font-family="'Noto Sans KR',sans-serif">${Math.round(l.val)}점</text>`
    ).join('');
    // 축선
    const axisLines = [
        `<line x1="${cx}" y1="${cy}" x2="${toXY(0,100).join(',').split(',')[0]}" y2="${toXY(0,100).join(',').split(',')[1]}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`,
        `<line x1="${cx}" y1="${cy}" x2="${toXY(90,100).join(',').split(',')[0]}" y2="${toXY(90,100).join(',').split(',')[1]}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`,
        `<line x1="${cx}" y1="${cy}" x2="${toXY(180,100).join(',').split(',')[0]}" y2="${toXY(180,100).join(',').split(',')[1]}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`,
        `<line x1="${cx}" y1="${cy}" x2="${toXY(270,100).join(',').split(',')[0]}" y2="${toXY(270,100).join(',').split(',')[1]}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`
    ].join('');

    return `<div class="four-domain-radar" style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:20px 22px;margin-bottom:24px;">
        <svg width="160" height="160" viewBox="0 0 160 160" style="flex:0 0 auto;">
            <polygon points="${outerPoly}" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
            <polygon points="${grid50}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" stroke-dasharray="3,3"/>
            ${axisLines}
            <polygon points="${poly}" fill="rgba(199,167,106,0.18)" stroke="rgba(199,167,106,0.7)" stroke-width="1.5"/>
            ${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="var(--gold,#c7a76a)"/>`).join('')}
            ${labelsSvg}
        </svg>
        <div style="flex:1;min-width:160px;">
            <div style="font-size:12px;color:var(--gold);font-weight:700;margin-bottom:12px;letter-spacing:0.5px;">삶의 네 영역 — 타고난 에너지 분포</div>
            ${labels.map(l=>`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-size:12px;color:rgba(255,255,255,0.7);">${l.label}</span>
                <div style="display:flex;align-items:center;gap:8px;">
                    <div style="width:80px;height:5px;border-radius:3px;background:rgba(255,255,255,0.08);overflow:hidden;">
                        <div style="width:${Math.round(l.val)}%;height:100%;background:linear-gradient(90deg,var(--gold,#c7a76a),rgba(199,167,106,0.5));border-radius:3px;"></div>
                    </div>
                    <span style="font-size:11px;color:rgba(199,167,106,0.9);font-weight:700;min-width:28px;text-align:right;">${Math.round(l.val)}</span>
                </div>
            </div>`).join('')}
        </div>
    </div>`;
}


function buildChapter2_Wuxing(data) {
    const name = data.name || '고객';
    const wuxing = data.wuxing || {};
    const OHKR2 = {wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
    const OHHJ2 = {wood:'木',fire:'火',earth:'土',metal:'金',water:'水'};
    const OH_BAR = {wood:'var(--wood)',fire:'var(--fire)',earth:'var(--earth)',metal:'var(--metal)',water:'var(--water)'};

    const oh5 = ['wood','fire','earth','metal','water'];
    const totalRaw = oh5.reduce((s,k)=>s+(Number(wuxing[k])||0), 0);
    const wxSum = Math.max(1, totalRaw);
    const pct = {};
    oh5.forEach(k => { pct[k] = totalRaw>0 ? Math.round((Number(wuxing[k])||0)/wxSum*100) : 0; });

    // ── 과다·부족 판정 (다중 케이스 대응) ──
    //   평균 = 20%. 과다 기준 ≈ 1.4배(28%) 이상, 부족 기준 ≈ 0.5배(10%) 이하.
    //   0%는 "비어있음"으로 별도 강조.
    const HIGH = 28;
    const LOW  = 10;
    const sortedDesc = Object.entries(pct).sort((a,b)=>b[1]-a[1]);
    let excessKeys = sortedDesc.filter(([,p])=>p>=HIGH).map(([k])=>k);
    let lackKeys = sortedDesc.filter(([,p])=>p<=LOW).map(([k])=>k).reverse();
    if(excessKeys.length===0) excessKeys = [sortedDesc[0][0]];
    if(lackKeys.length===0)   lackKeys   = [sortedDesc[sortedDesc.length-1][0]];
    // 같은 키가 양쪽에 들어간 비정상 케이스 방어
    lackKeys = lackKeys.filter(k => !excessKeys.includes(k));

    const maxW = excessKeys[0];
    const minW = lackKeys[0] || sortedDesc[sortedDesc.length-1][0];
    const maxKr = OHKR2[maxW]||maxW;
    const minKr = OHKR2[minW]||minW;
    // ── 막대 그래프 (과다·부족·비어있음 배지) ──
    const balanceRows = sortedDesc.map(([k,p]) => {
        const isExc  = excessKeys.includes(k);
        const isLack = lackKeys.includes(k);
        const isZero = p === 0;
        const col = OH_BAR[k] || '#aaa';
        const barW = Math.max(2, Math.min(100, p));
        const labelColor = isExc ? 'var(--gold)' : (isZero ? '#888' : '#bbb');
        return `<div class="wuxing-bar-row" style="display:flex;align-items:center;gap:12px;margin-bottom:11px;">
            <div style="min-width:52px;text-align:right;font-size:13px;font-weight:${isExc?800:500};color:${labelColor};">${OHHJ2[k]} ${OHKR2[k]}</div>
            <div style="flex:1;min-width:0;background:rgba(255,255,255,0.08);border-radius:6px;height:14px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">
                <div style="width:${barW}%;max-width:100%;height:100%;background:linear-gradient(90deg,${col},rgba(255,255,255,0.15));border-radius:5px;transition:width .3s;"></div>
            </div>
            <div style="min-width:40px;font-size:13px;font-weight:700;color:${isExc?'var(--gold)':'#999'};">${p}%</div>
            ${isExc ? '<span style="font-size:10px;background:rgba(199,167,106,0.25);color:var(--gold);padding:2px 7px;border-radius:6px;font-weight:700;letter-spacing:0.04em;">과다</span>' : ''}
            ${(isLack && !isZero) ? '<span style="font-size:10px;background:rgba(120,120,120,0.18);color:#bbb;padding:2px 7px;border-radius:6px;letter-spacing:0.04em;">부족</span>' : ''}
            ${isZero ? '<span style="font-size:10px;background:rgba(120,120,120,0.18);color:#bbb;padding:2px 7px;border-radius:6px;letter-spacing:0.04em;">비어있음</span>' : ''}
        </div>`;
    }).join('');

    // ── 도입 한 단락 ──
    function joinExc(arr) {
        if (arr.length === 1) return '<strong>' + OHKR2[arr[0]] + '(' + OHHJ2[arr[0]] + ') 기운</strong>';
        return '<strong>' + arr.map(k => OHKR2[k] + '(' + OHHJ2[k] + ')').join('·') + ' 기운</strong>';
    }
    function joinLack(arr) {
        if (arr.length === 1) return '<strong>' + OHKR2[arr[0]] + '(' + OHHJ2[arr[0]] + ') 기운</strong>';
        return '<strong>' + arr.map(k => OHKR2[k] + '(' + OHHJ2[k] + ')').join('·') + ' 기운</strong>';
    }
    const hasZeroLack = lackKeys.some(k => pct[k] === 0);
    const introLine = '사주에는 다섯 가지 기운 — <strong>목·화·토·금·수</strong> — 이 있어요. 이 다섯이 어떻게 섞여 있느냐가 한 사람의 기질·방향·습관을 만듭니다. '
        + nmUi(name) + ' 사주에는 ' + joinExc(excessKeys) + (excessKeys.length>=2 ? '이 함께 두껍게 자리잡고 있어요. ' : '이 가장 두껍게 자리잡고 있어요. ')
        + (lackKeys.length === 0
            ? '나머지는 비교적 고르게 흐르고 있어서, 균형 자체는 잘 맞춰진 사주예요. '
            : (hasZeroLack
                ? '반대로 ' + joinLack(lackKeys) + '은 사주 안에 거의 자리 잡고 있지 않아요. '
                : '반대로 ' + joinLack(lackKeys) + '은 얇게 흐르고 있어요. '))
        + '아래에서 한 기운씩 풀어 드릴게요.';

    // ── 과다 풀이 (각 키마다 한 단락 + 2개 이상이면 결합 단락) ──
    const EXCESS_NARR = {
        wood: '<strong>목(木)</strong>이 두껍다는 건 — ' + nmDnim(name) + ' 안에 “새로 시작하고 뻗어 나가는 본능”이 가장 큰 자리를 차지하고 있다는 뜻이에요. 멈춰 있으면 답답해지고, 일을 벌이는 쪽이 자연스러우세요. 다만 시작이 잦으면 마무리가 밀리기 쉽고, 익숙해진 자리는 금세 싫증을 내실 수 있어요. **진행 중인 일은 세 가지 이하**로 묶어 두시고, 끝맺는 일에는 함께 책임질 한 사람과 짝을 짓는 게 좋습니다.',
        fire: '<strong>화(火)</strong>가 두껍다는 건 — 표현·열정·주목이 ' + nmUi(name) + ' 가장 큰 에너지원이라는 뜻이에요. 분위기를 띄우는 힘이 강하고, 무대 위에 서 계실 때 가장 자연스러우세요. 다만 열이 앞서면 번아웃이나 즉흥 결정으로 비용이 커지고, 말이 부딪히는 일도 잦아져요. **감정이 올랐을 때는 하룻밤 넘긴 뒤** 말하시고, 하루 30분은 의도적으로 비워 두십시오.',
        earth: '<strong>토(土)</strong>가 두껍다는 건 — 묵직한 신뢰와 안정감이 ' + nmUi(name) + ' 가장 큰 자산이라는 뜻이에요. 사람들이 ' + nmEulReul(name) + ' “맡길 수 있는 사람”으로 기억합니다. 다만 변화에 둔하면 기회가 그냥 스쳐 가고, “팀 속도를 늦춘다”는 오해를 받으실 수도 있어요. **분기마다 작은 실험 하나**씩만 의무로 넣어 두시면 됩니다.',
        metal: '<strong>금(金)</strong>이 두껍다는 건 — 결단·전문성·잘라내는 힘이 ' + nmUi(name) + ' 가장 큰 무기라는 뜻이에요. 원칙이 분명해서 어디서든 깊이를 만들어 내십니다. 다만 정이 없어 보이거나, 내 성과만 챙긴다는 말을 들으실 수도 있어요. **중요한 말은 24시간 유예** 후 보내시고, 짧은 메모에는 “사실 한 줄 + 내가 느낀 점 한 줄”을 함께 적어 두십시오.',
        water: '<strong>수(水)</strong>가 두껍다는 건 — 깊이 보고 길게 생각하는 힘이 ' + nmUi(name) + ' 가장 큰 자산이라는 뜻이에요. 정보·전략·통찰에 강하고, 한 발 떨어져 흐름을 읽는 눈이 남다르세요. 다만 머릿속에서 생각만 길어지면 정작 행동으로 옮기는 시점이 늦어지고, 같은 일을 여러 번 다시 확인하시다 보면 그 사이에 상대방이 답답해져 마음을 먼저 닫아 버리실 수 있어요. **자료 조사·고민은 한 번에 45분으로 끊으시고**, 그 다음에는 “지금 할 수 있는 가장 작은 행동 한 가지”만 바로 실행하십시오.'
    };
    const EXCESS_DUO_TAIL = '두 기운이 함께 두꺼우시면 — 한쪽이 다른 쪽을 부추겨 일이 한꺼번에 커지기 쉬워요. **이번 달의 메인은 하나만** 정하시고 나머지는 보조로 흘려보내십시오. 두 기운을 동시에 다 살리려 하시면 체력과 시간이 먼저 갑니다.';

    // ── 부족 풀이 ──
    const LACK_NARR = {
        wood: '<strong>목(木)</strong>이 얇거나 비어 있다는 건 — “새로 시작하는 일”이 ' + nmUi(name) + ' 가장 무거운 자리라는 뜻이에요. 게으름이 아니라 그저 그쪽으로 시동이 잘 안 걸리는 거예요. **매주 한 번, 90분짜리 “새 시도” 슬롯**을 달력에 미리 박아 두시면 흐름이 살아납니다.',
        fire: '<strong>화(火)</strong>가 얇거나 비어 있다는 건 — 열정이 안에는 있어도 겉으로 잘 드러나지 않는 분이라는 뜻이에요. 표현이 곧 기회로 바뀌는 자리에서는 손해를 보실 수 있어요. **주 1회 공개 발표나 피드백 자리**를 일정에 고정해 두시면, 안에 있던 불씨가 자연스럽게 살아납니다.',
        earth: '<strong>토(土)</strong>가 얇거나 비어 있다는 건 — 한 자리를 묵묵히 지키는 힘이 다른 분들보다 적다는 뜻이에요. 흥미가 떨어지면 금세 자리를 옮기시기 쉽습니다. **매일 같은 시각에 같은 루틴 하나**를 30일만 고정해 보시면, 그것만으로도 안정감이 자라납니다.',
        metal: '<strong>금(金)</strong>이 얇거나 비어 있다는 건 — 마무리·결단·정리하는 힘이 약하다는 뜻이에요. 일을 펼치시는 건 잘하시지만 끝까지 가는 길에서 흔들리실 수 있습니다. 시작하시기 전에 **“완료 정의” 한 줄**을 미리 적어 두시고, 끝낼 때까지 그 한 줄에 묶어 두십시오.',
        water: '<strong>수(水)</strong>가 얇거나 비어 있다는 건 — 큰 결정을 내리시기 전에 충분히 들여다보는 시간이 짧을 수 있다는 뜻이에요. 행동이 빠르신 건 강점이지만, 큰 결정에서는 비용이 커집니다. **큰 결정은 이틀만 유예**해 보십시오. 그 사이에 보이는 것이 의외로 많습니다.'
    };
    const LACK_ZERO_PREFIX = '특히 사주 안에 <strong>한 글자도 들어 있지 않다</strong>는 건, 평생에 걸쳐 그 자리를 의식적으로 채워 가셔야 한다는 뜻이에요. ';
    const LACK_DUO_TAIL = '두 기운이 함께 얇으실 때는, 보충을 동시에 하지 마시고 **한 가지를 30일** 정도 충분히 익힌 다음에 다음으로 넘어가시는 게 좋습니다. 두 가지를 동시에 채우려 하시면 어느 쪽도 자리를 잡지 못합니다.';

    // ── 본문 조립 ──
    function para(text) { return '<p class="ch-text" style="font-size:14px;color:var(--text);line-height:2;margin:0 0 18px;">' + boldStarsToStrong(voicePolishParagraph(data, text)) + '</p>'; }

    let excessHtml = '';
    excessKeys.forEach(k => { excessHtml += para(EXCESS_NARR[k]); });
    if (excessKeys.length >= 2) excessHtml += para(EXCESS_DUO_TAIL);

    let lackHtml = '';
    if (lackKeys.length > 0) {
        const lackOpener = '반대로 ' + joinLack(lackKeys) + (lackKeys.length===1 ? '에 대해서도 한 번 짚어 드릴게요. ' : '이 함께 얇은 경우라, 두 자리를 모두 짚어 드릴게요. ')
            + '부족함을 부끄러워하실 일은 아닙니다. 다만 보이지 않는 쪽이 의외로 통제력을 쥐기 쉬운 자리라 미리 알아 두시는 게 좋아요.';
        lackHtml += para(lackOpener);
        lackKeys.forEach(k => {
            let txt = LACK_NARR[k];
            if (pct[k] === 0) txt = LACK_ZERO_PREFIX + txt;
            lackHtml += para(txt);
        });
        if (lackKeys.length >= 2) lackHtml += para(LACK_DUO_TAIL);
    } else {
        lackHtml += para('나머지 기운은 비교적 고르게 흐르고 있어서, 따로 보충해야 할 자리는 없어요. 이미 가지신 두꺼운 기운을 어디에 풀어내실지만 잘 고르시면 됩니다.');
    }

    var chHead2 = buildChapterHeadTopicFirst('오행 — 다섯 기운의 짜임', SAJUX_SECTION_LABELS.wuxing, buildTopicMetaphorTitle('wuxing', data));
    var chIntro2 = buildChapterIntroHtml(data, 'wuxing');
    return `<div class="report-chapter">
        ${chHead2}
        ${chIntro2}
        ${para(introLine)}
        <div class="wuxing-bar-chart" style="background:var(--panel,rgba(0,0,0,0.22));border:1px solid rgba(199,167,106,0.2);border-radius:12px;padding:18px 20px;margin:0 0 22px;">
            <div style="font-size:12px;font-weight:800;color:var(--gold);margin-bottom:14px;letter-spacing:0.5px;">오행 비율</div>
            ${balanceRows}
        </div>
        ${excessHtml}
        ${lackHtml}
    </div>`;
}

// ── 오행 챕터에서 분리한 옛 건강·개운법 블록은 buildChapter8_Health / buildChapter9_Remedy로 일원화. ──
// (옛 큰 박스 묶음은 모두 제거됨)
function _buildChapter2_Wuxing_LEGACY_REMOVED() {
    return '';
}
function _buildChapter2_Wuxing_DEAD(_data) {
    var name = ''; var nmIGa = function(){return '';}; var maxKr = ''; var minW = ''; var minKr = ''; var maxW = '';
    /* placeholder — 진짜 코드는 위 buildChapter2_Wuxing 에 있음. 아래 빈 박스만 유지. */
    return `<div style="display:none;">
        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:18px;letter-spacing:1px;">&#9670; ${nmIGa(name)} 가장 주의해야 할 건강 신호</div>
            ${(()=>{
                const hasWx = data.wuxing && Object.keys(data.wuxing).length > 0;
                /* 상단 막대·'○○ 우세'와 동일 키(reduce). sort로 재계산하면 동점 시 다른 오행이 나와 건강 제목과 엇갈릴 수 있음 */
                const MAX_OH = hasWx ? maxW : (dayOh || 'fire');
                const MIN_OH = hasWx ? minW : 'metal';
                const HEALTH_DESC = {
                    wood: { col:'#4fc3a1', title:'간·담낭·신경계',
                        strong:`${nmUi(name)} 사주에는 목(나무) 기운이 강하게 집중되어 있습니다. 이 기운이 넘칠 때 몸이 가장 먼저 보내는 신호가 있습니다 — 눈의 피로, 편두통, 근육 경련, 그리고 이유 없는 분노감입니다. 특히 봄(3~5월)과 스트레스가 극심한 시기에 이 증상이 몰려옵니다. 술을 조심하십시오. 간이 가장 먼저 과부하를 받습니다. 레몬·매실·녹색 채소를 자주 드시고, 자정 전 취침을 지키십시오. 분노와 억울함을 내면에 쌓아두지 말고 운동이나 표현으로 풀어내는 루틴을 만드십시오.`,
                        weak:`${nmUi(name)} 사주에서 목(나무) 기운이 약하게 자리잡고 있습니다. 이 경우 몸에서 나타나는 신호는 만성 피로, 결단력 저하, 무기력감입니다. 간과 신경계를 꾸준히 챙겨야 합니다. 규칙적인 수면과 기상 시간을 지키는 것이 가장 중요합니다. 봄 제철 채소를 충분히 섭취하고, 스트레칭과 가벼운 유산소를 꾸준히 하십시오.`
                    },
                    fire: { col:'#ff7043', title:'심장·심혈관·수면',
                        strong:`${nmUi(name)} 사주에는 화(불) 기운이 강하게 집중되어 있습니다. 이 기운이 넘칠 때 가장 먼저 심장과 혈관이 신호를 보냅니다 — 가슴 두근거림, 불면증, 안면홍조, 그리고 감정의 급격한 기복입니다. 여름(6~8월)에 이 증상이 심화됩니다. 카페인과 에너지드링크를 멀리하십시오. 취침 전 2시간은 자극적인 콘텐츠를 피하고, 혈압을 정기적으로 체크하는 습관을 들이십시오. 명상이나 심호흡이 이 사주에 가장 좋은 건강 습관입니다.`,
                        weak:`${nmUi(name)} 사주에서 화(불) 기운이 약합니다. 열정이 쉽게 꺼지고, 순환이 잘 안 되며, 손발이 차가운 증상이 나타날 수 있습니다. 적당한 유산소 운동으로 심폐 기능을 꾸준히 키우십시오. 따뜻한 음식을 챙기고, 혼자 있는 시간보다 사람들과 어울리는 시간이 이 사주의 건강 에너지를 충전합니다.`
                    },
                    earth: { col:'#ffca28', title:'위장·소화기·면역',
                        strong:`${nmUi(name)} 사주에는 토(흙) 기운이 강하게 집중되어 있습니다. 이 기운이 넘칠 때 위장과 소화기에 신호가 옵니다 — 위염, 역류성 식도염, 소화불량, 그리고 과도한 걱정과 생각으로 인한 식욕 저하입니다. 스트레스가 쌓이면 먹는 것으로 푸는 패턴도 조심해야 합니다. 규칙적인 식사 시간을 지키는 것이 첫 번째 건강 습관입니다. 야식과 폭식을 피하고, 식후 30분 산책을 생활화하십시오.`,
                        weak:`${nmUi(name)} 사주에서 토(흙) 기운이 약합니다. 면역력이 쉽게 떨어지고 피로 회복이 느린 경향이 있습니다. 규칙적인 생활 리듬이 이 사주의 건강을 지키는 가장 강력한 방패입니다. 고구마·대추·단호박 등 자연 단맛 식품을 챙기십시오.`
                    },
                    metal: { col:'#b0bec5', title:'폐·호흡기·피부',
                        strong:`${nmUi(name)} 사주에는 금(쇠) 기운이 강하게 집중되어 있습니다. 이 기운이 넘칠 때 폐와 호흡기에 신호가 옵니다 — 기침, 피부 트러블, 변비, 그리고 슬픔이나 우울감이 신체 증상으로 나타납니다. 가을(9~11월)에 이 증상이 집중됩니다. 미세먼지 심한 날 마스크는 필수입니다. 수영이나 유산소 운동으로 폐활량을 키우고, 감정을 억누르지 말고 표현하는 것이 폐 건강에 직결됩니다.`,
                        weak:`${nmUi(name)} 사주에서 금(쇠) 기운이 약합니다. 결단력이 흔들리고 호흡기 감염에 취약한 경향이 있습니다. 도라지·무·배 등 호흡기를 강화하는 음식을 자주 드시고, 심호흡 운동을 꾸준히 하십시오.`
                    },
                    water: { col:'#64b5f6', title:'신장·호르몬·체력',
                        strong:`${nmUi(name)} 사주에는 수(물) 기운이 강하게 집중되어 있습니다. 이 기운이 넘칠 때 신장과 호르몬 시스템에 신호가 옵니다 — 허리 통증, 부종, 탈모, 그리고 만성 피로와 두려움이 신체 증상으로 나타납니다. 겨울(12~2월)에 이 증상이 심화됩니다. 하루 수면 7시간 이상을 철저히 지키고, 물 2L 이상 섭취를 습관화하십시오. 검은콩·흑임자·미역을 꾸준히 드십시오.`,
                        weak:`${nmUi(name)} 사주에서 수(물) 기운이 약합니다. 체력 저하와 집중력 감소가 쉽게 나타날 수 있습니다. 충분한 수분 섭취와 규칙적인 수면이 이 사주의 건강을 지키는 핵심 포인트입니다. 두려움과 불안이 신체로 연결되지 않도록 명상이나 일기 쓰기로 감정을 정리하십시오.`
                    }
                };
                const maxData = HEALTH_DESC[MAX_OH] || HEALTH_DESC.fire;
                const minData = HEALTH_DESC[MIN_OH];
                /* MAX_OH = 원국 오행 비중 최댓값(상단 '○○ 우세'와 동일). 이 박스는 과다·집중 시 나타나는 건강 리스크를 다루므로 항상 strong 문구를 씁니다.
                   신약/중화일 때 weak를 붙이면 '수 우세'와 '수 기운이 약합니다'가 동시에 나와 논리가 어긋납니다. */
                const mainTxt = maxData.strong;
                let html = '<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:16px;border-left:3px solid '+maxData.col+';">';
                html += '<div style="font-size:12px;font-weight:700;color:'+maxData.col+';margin-bottom:8px;">⚠ 우선 챙겨야 할 건강 영역 — '+maxData.title+'</div>';
                html += '<p style="font-size:13px;color:#ccc;line-height:1.85;margin:0;">'+mainTxt+'</p>';
                html += '</div>';
                if(minData && MIN_OH !== MAX_OH) {
                    const minTxt = minData.weak;
                    html += '<div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:16px;border-left:3px solid rgba(255,255,255,0.2);margin-top:10px;">';
                    html += '<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:8px;">✦ 보조적으로 챙겨야 할 영역 — '+minData.title+'</div>';
                    html += '<p style="font-size:12.5px;color:#aaa;line-height:1.8;margin:0;">'+minTxt+'</p>';
                    html += '</div>';
                }
                return html;
            })()}
        </div>

        <div style="background:rgba(199,167,106,0.05);border-radius:12px;padding:22px;margin:24px 0;border:1px solid rgba(199,167,106,0.1);">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:18px;letter-spacing:1px;">&#9670; 오행 균형을 잡는 개운법 — ${minKr} 기운 보충 처방</div>
            <p style="font-size:13.5px;color:#ccc;line-height:1.9;margin:0 0 16px;">결핍을 부끄러워할 필요 없습니다. 보이지 않는 쪽이 통제력을 빼앗을 때가 많습니다. 색·방향·음식은 **${minKr} 보충용 레버**일 뿐, 인생 전부가 아닙니다. **이번 달에는 아래 네 칸 중 두 칸만** 고르십시오.</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                ${({wood:`
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#4fc3a1;margin-bottom:6px;">목 기운 보충 — 색상·방향</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">초록색·청색·청록색 계열의 옷과 인테리어를 적극 활용하십시오. 동쪽·동남쪽 방향의 사무실·침실 배치가 목 기운을 강화합니다. 봄에는 특히 녹색 식물을 가까이 두십시오.</p></div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#4fc3a1;margin-bottom:6px;">목 기운 보충 — 음식·활동</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">신맛 음식(레몬·매실·키위·녹차)을 꾸준히 섭취하십시오. 새로운 것을 시작하는 도전적 활동, 등산·조깅·스트레칭이 목 기운을 보충합니다. 성장형 독서와 자기계발 활동이 핵심 포인트입니다.</p></div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#4fc3a1;margin-bottom:6px;">목 기운 직업 환경</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">목 기운이 활성화된 환경: 교육·의료·복지·출판·환경·ESG·EdTech 분야. 이 분야의 사람들과 교류하는 것만으로도 목 기운이 보충됩니다.</p></div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#4fc3a1;margin-bottom:6px;">목 기운 귀인 & 시간</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">갑(甲)·을(乙) 일간을 가진 사람, 인(寅)·묘(卯)년생이 당신에게 목 기운을 보충해줍니다. 이른 아침 시간대(오전 3~7시)에 중요한 결정을 내리십시오.</p></div>`,
                fire:`
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#ff7043;margin-bottom:6px;">화 기운 보충 — 색상·방향</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">빨강·주황·분홍·보라색 계열을 의식적으로 사용하십시오. 남쪽·동남쪽 방향의 환경 배치가 화 기운을 강화합니다. 촛불·조명을 활용하는 것도 좋습니다.</p></div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#ff7043;margin-bottom:6px;">화 기운 보충 — 음식·활동</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">쓴맛 음식(녹차·여주·쑥)을 꾸준히 섭취하십시오. 열정적인 퍼포먼스 활동, 공개 발표, 강의, 예술 활동이 화 기운을 높입니다. 여름 야외 활동도 효과적입니다.</p></div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#ff7043;margin-bottom:6px;">화 기운 직업 환경</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">화 기운이 활성화된 환경: 엔터테인먼트·방송·예술·마케팅·강연·외식업 분야. 이 분야의 사람들과 교류하는 것만으로도 화 기운이 보충됩니다.</p></div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#ff7043;margin-bottom:6px;">화 기운 귀인 & 시간</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">병(丙)·정(丁) 일간을 가진 사람, 사(巳)·오(午)년생이 당신에게 화 기운을 보충해줍니다. 오전~정오(오전 9시~오후 1시)가 화 기운의 절정 시간대입니다.</p></div>`,
                earth:`
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#ffca28;margin-bottom:6px;">토 기운 보충 — 색상·방향</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">노랑·황토·베이지·오렌지색 계열을 의식적으로 사용하십시오. 중앙·북동·남서 방향의 환경 배치가 토 기운을 강화합니다. 황토 관련 자연 환경이 토 기운 보충에 효과적입니다.</p></div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#ffca28;margin-bottom:6px;">토 기운 보충 — 음식·활동</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">단맛(꿀·고구마·호박·대추)을 꾸준히 섭취하고 황색 음식을 즐기십시오. 안정적이고 꾸준한 루틴 활동, 실내 화분·등산, 흙과 접촉하는 활동이 토 기운을 강화합니다.</p></div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#ffca28;margin-bottom:6px;">토 기운 직업 환경</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">토 기운이 활성화된 환경: 부동산·건설·중개·물류·유통·요식업 분야. 안정성과 신뢰가 핵심인 업종이 토 기운 보충에 최적입니다.</p></div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#ffca28;margin-bottom:6px;">토 기운 귀인 & 시간</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">무(戊)·기(己) 일간을 가진 사람, 진(辰)·술(戌)·축(丑)·미(未)년생이 당신에게 토 기운을 보충해줍니다. 오후 시간대(오후 1~5시)가 토 기운 활용의 최적 시간대입니다.</p></div>`,
                metal:`
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#b0bec5;margin-bottom:6px;">금 기운 보충 — 색상·방향</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">흰색·금색·은색·회색 계열을 의식적으로 사용하십시오. 서쪽·북서쪽 방향의 환경 배치가 금 기운을 강화합니다. 금속 소품과 광물 결정체를 가까이 두는 것이 효과적입니다.</p></div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#b0bec5;margin-bottom:6px;">금 기운 보충 — 음식·활동</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">매운맛(생강·마늘·고추·도라지)을 꾸준히 섭취하고 흰 음식(배·연근·마)을 즐기십시오. 결단력과 원칙을 요구하는 활동, 무술·격투기·정리 정돈이 금 기운을 강화합니다.</p></div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#b0bec5;margin-bottom:6px;">금 기운 직업 환경</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">금 기운이 활성화된 환경: 법조·금융·군인·경찰·의료·정밀기계·전문직 분야. 원칙과 기준이 명확한 환경이 금 기운 보충에 최적입니다.</p></div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#b0bec5;margin-bottom:6px;">금 기운 귀인 & 시간</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">경(庚)·신(辛) 일간을 가진 사람, 신(申)·유(酉)년생이 당신에게 금 기운을 보충해줍니다. 저녁 시간대(오후 5~9시)가 금 기운 활용의 최적 시간대입니다.</p></div>`,
                water:`
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#64b5f6;margin-bottom:6px;">수 기운 보충 — 색상·방향</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">검정·파랑·남색·보라색 계열을 의식적으로 사용하십시오. 북쪽 방향의 환경 배치가 수 기운을 강화합니다. 물 관련 인테리어(어항·분수·수족관)를 가까이 두는 것이 효과적입니다.</p></div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#64b5f6;margin-bottom:6px;">수 기운 보충 — 음식·활동</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">짠맛(천연소금·된장·미역)을 꾸준히 섭취하고 검은 음식(흑임자·검은콩·블루베리)을 즐기십시오. 독서·연구·명상·수영 등 깊이 있는 지적 활동이 수 기운을 강화합니다.</p></div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#64b5f6;margin-bottom:6px;">수 기운 직업 환경</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">수 기운이 활성화된 환경: 연구·분석·금융·철학·심리·유통·무역 분야. 깊이 있는 사고와 전략이 필요한 환경이 수 기운 보충에 최적입니다.</p></div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#64b5f6;margin-bottom:6px;">수 기운 귀인 & 시간</div><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">임(壬)·계(癸) 일간을 가진 사람, 해(亥)·자(子)년생이 당신에게 수 기운을 보충해줍니다. 밤~새벽 시간대(오후 9시~오전 1시)가 수 기운의 절정 시간대입니다.</p></div>`})[minW] || `<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:12px;"><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">부족한 기운에 맞는 색상, 방향, 음식, 활동으로 균형을 채워가십시오.</p></div>`}
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:14px;letter-spacing:1px;">&#9670; ${maxKr} 과다가 겉으로 드러날 때 — 생활에서 반복되기 쉬운 패턴</div>
            <p style="font-size:13.5px;color:#ccc;line-height:1.9;margin:0 0 14px;">${maxKr} 비중이 크다는 말은 ‘나쁜 성격’이 아니라, 비슷한 선택·반응이 **반복되기 쉬운 흐름**이라는 뜻에 가깝습니다. 아래에서 와닿는 한두 줄만 골라 습관으로 고정하면, 같은 마찰과 시간 낭비를 줄일 수 있습니다.</p>
            <div style="display:flex;flex-direction:column;gap:10px;">
                ${({wood:`<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;"><div style="font-size:12px;font-weight:700;color:#4fc3a1;margin-bottom:8px;">목 과다 — 패턴</div><p style="font-size:12.5px;color:#bbb;line-height:1.88;margin:0;">시작은 잦은데 마무리가 밀리고, 아이디어는 통하는데 실행·끝맺음 평가가 엇갈리기도 합니다. 익숙해지면 금방 싫증이 나는 편도 있습니다. **동시에 손에 쥔 일은 세 가지 이하**로 두고, 끝을 책임질 동료 한 명과 짝을 짓십시오.</p></div>`,
                fire:`<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;"><div style="font-size:12px;font-weight:700;color:#ff7043;margin-bottom:8px;">화 과다 — 패턴</div><p style="font-size:12.5px;color:#bbb;line-height:1.88;margin:0;">열이 앞서 주변이 지치거나, 번아웃·즉흥 결정으로 비용이 커질 수 있습니다. 분위기는 띄우지만 말이 부딪히는 일도 생깁니다. **감정이 올랐을 때는 하룻밤 넘기고** 말하고, **하루 30분은 의도적으로 비우는 시간**으로 고정하십시오.</p></div>`,
                earth:`<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;"><div style="font-size:12px;font-weight:700;color:#ffca28;margin-bottom:8px;">토 과다 — 패턴</div><p style="font-size:12.5px;color:#bbb;line-height:1.88;margin:0;">든든한데 움직임이 느리다는 말을 듣기 쉽고, 팀 속도를 늦춘다는 오해도 납니다. **작은 시범 하나**로만 변화를 제안하고, 새로 만날 사람은 한 번에 한 명씩만 늘리십시오.</p></div>`,
                metal:`<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;"><div style="font-size:12px;font-weight:700;color:#b0bec5;margin-bottom:8px;">금 과다 — 패턴</div><p style="font-size:12.5px;color:#bbb;line-height:1.88;margin:0;">원칙은 세우는데 정이 없어 보일 수 있고, 내 성과만 챙긴다는 말을 들을 수도 있습니다. **중요한 말은 ‘사실 한 줄 + 내가 느낀 점 한 줄’**로만 정리해 보내 보십시오.</p></div>`,
                water:`<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;"><div style="font-size:12px;font-weight:700;color:#64b5f6;margin-bottom:8px;">수 과다 — 패턴</div><p style="font-size:12.5px;color:#bbb;line-height:1.88;margin:0;">머릿속 정리가 길어지면 몸이 움직이는 시점이 늦어지고, 확인을 거듭하다 보면 상대만 굳어 보이기도 합니다. **자료·정보는 45분으로 끊은 뒤**, 미리 써 둔 **‘다음 행동 한 가지’**만 실행하십시오.</p></div>`})[maxW] || `<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;"><p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">${maxKr}가 두꺼울 때는 선택과 통제가 핵심입니다. **지키기 쉬운 행동 규칙 하나**만 먼저 고르십시오.</p></div>`}
            </div>
        </div>
    </div>`;
}

function buildChapter3_Sipseong(data) {
    const sipseong = data.sipseong || {};
    const sorted = Object.entries(sipseong).sort((a,b)=>b[1]-a[1]);
    const mainSip = sorted.length>0 ? sorted[0][0] : '정재';
    const secondSip = sorted.length>1 ? sorted[1][0] : '';
    const sipText = window.SAJU_DB?.SIPSEONG?.[mainSip] || '주도적으로 판을 짜는 기질입니다.';
    const total = Math.max(Object.values(sipseong).reduce((a,b)=>a+b,0),1);
    const sipDB = {
        '비견':'**동료·경쟁이 잦은 조직**에서 지는 걸 견디기 어렵고, 내 방식이 먼저 나옵니다. 동업에서 역할이 겹치면 마찰이 납니다. **역할을 문장으로 고정**하고 들어가십시오. 독립·세일즈·프로덕트에 강합니다.',
        '겁재':'**선납·승부·지출 신호**가 강합니다. 위기와 협상에서 깨어나지만, 돈은 속도가 아니라 통제에서 남습니다. **충동 지출·보증은 원칙적으로 거절**하십시오. 영업·투자·위기 대응에 쓰면 무기가 됩니다.',
        '식신':'**콘텐츠·디자인·기획**처럼 손끝 산출물이 평가로 바로 붙는 일에서 살아납니다. 재능이 곧 수입이 되도록 **‘판매 가능한 산출물’ 한 종류**만 먼저 고르십시오.',
        '상관':'**기준·감사·브랜드 방어** 쪽으로 뇌가 먼저 돌아갑니다. 조직 규율과 정면으로 부딪히면 비용이 큽니다. **자율 계약·프로젝트 단위**로 일하십시오.',
        '편재':'**거래·외주·부업** 흐름에 민감합니다. 줄이 많으면 관리가 무너집니다. **현금흐름 표는 주 1회만** 열고, 나머지는 자동이체로 묶으십시오.',
        '정재':'**급여·정산·루틴**이 삶의 축입니다. 신뢰와 꾸준함이 재물의 기반입니다. 한 방보다 복리가 맞습니다. **저축·상환 자동이체 날짜**를 먼저 박으십시오.',
        '편관':'**마감·현장·압박**이 올수록 각이 살아납니다. 사회적으로 인정되는 장에 쏟지 않으면 마찰이 됩니다. **규칙이 있는 경쟁 구조** 안에 넣으십시오.',
        '정관':'**조직·직책·평가**를 중시합니다. 평판이 곧 돈입니다. **약속·문서는 지키는 사람**으로만 브랜드를 쌓으십시오.',
        '편인':'**연구·틈새·직관**이 강점입니다. 남들과 다른 학습이 빛납니다. **한 틈새 분야만** 정해 깊이를 쌓으십시오.',
        '정인':'**문서·자격·귀인**이 길을 엽니다. 배움이 안전벨트입니다. **공인·자격·문서**를 먼저 쌓으십시오.'
    };
    const sipPersonality = sipDB[mainSip] || sipText;
    const axMain = mainSip;
    const axSec = secondSip || '';
    const SIP_BAR_GROUPS = [
        { key: '비겁', label: '비겁 (비견/겁재):', keys: ['비견', '겁재'] },
        { key: '식상', label: '식상 (식신/상관):', keys: ['식신', '상관'] },
        { key: '재성', label: '재성 (편재/정재):', keys: ['편재', '정재'] },
        { key: '관성', label: '관성 (편관/정관):', keys: ['편관', '정관'] },
        { key: '인성', label: '인성 (편인/정인):', keys: ['편인', '정인'] }
    ];
    const mainGroupKey = (SIP_BAR_GROUPS.find(function (g) { return g.keys.indexOf(mainSip) !== -1; }) || SIP_BAR_GROUPS[0]).key;
    const sipRows = SIP_BAR_GROUPS.map(function (g) {
        var sum = g.keys.reduce(function (s, k) { return s + (Number(sipseong[k]) || 0); }, 0);
        var pct = Math.round(sum / total * 100);
        var isMain = g.key === mainGroupKey;
        var col = isMain ? 'var(--gold)' : '#8a8a8a';
        var barW = Math.max(0, Math.min(100, pct));
        return '<div class="sipseong-bar-row" style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">'
            + '<div style="flex:0 0 auto;min-width:148px;max-width:42%;text-align:left;font-size:11.5px;font-weight:' + (isMain ? 800 : 500) + ';color:' + col + ';line-height:1.38;">' + g.label + '</div>'
            + '<div style="flex:1;min-width:0;background:rgba(255,255,255,0.08);border-radius:6px;height:13px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">'
            + '<div style="width:' + barW + '%;max-width:100%;height:100%;background:linear-gradient(90deg,' + col + ',rgba(255,255,255,0.12));border-radius:5px;"></div></div>'
            + '<div style="flex:0 0 42px;text-align:right;font-size:12px;font-weight:700;color:' + col + ';">' + pct + '%</div></div>';
    }).join('');
    const sipComboText = secondSip ? `앞장서는 패턴은 **${axMain}**, 바닥에 깔리는 보조 패턴은 **${axSec}**입니다. 위기에서는 ${axMain} 쪽 반응부터 다루고, 평상시에는 ${axSec} 쪽 습관만 다듬으십시오. 둘을 한꺼번에 고치려 하지 마십시오. **충돌할 때는 ${axMain}만, 평소에는 ${axSec}만** 조정하십시오. 파트너는 둘 중 하나라도 덮어주는 사람을 고르십시오.` : '';
    var chHead3 = buildChapterHeadTopicFirst('십성 — 역할과 관계의 무늬', SAJUX_SECTION_LABELS.sipseong, buildTopicMetaphorTitle('sipseong', data));
    var chIntro3 = buildChapterIntroHtml(data, 'sipseong');
    return `<div class="report-chapter">
        ${chHead3}
        ${chIntro3}
        <div class="sipseong-bar-chart" style="background:var(--panel,rgba(0,0,0,0.22));border:1px solid rgba(199,167,106,0.2);border-radius:12px;padding:18px 20px;margin:0 0 18px;">
            <div style="font-size:12px;font-weight:800;color:var(--gold);margin-bottom:14px;letter-spacing:0.5px;">업무 스타일 비율 — 비겁·식상·재성·관성·인성</div>
            ${sipRows || '<p style="color:#888;font-size:12px;margin:0;">분포 데이터를 불러오는 중입니다.</p>'}
        </div>
        <p class="ch-text">에너지가 몸이라면, 아래 다섯 줄은 <strong>비겁·식상·재성·관성·인성</strong> 각 묶음의 비중입니다. 같은 묶음 안의 두 십성(예: 편관·정관)은 합산되어, 돈·사람·권위 앞에서 자동으로 튀어나오는 업무 반응의 큰 줄기로 읽으면 됩니다.</p>
        <p class="ch-text">지금 가장 두꺼운 층은 <b style="color:var(--gold);">${axMain}</b> 축입니다. 중요한 순간, 설명보다 먼저 움직이는 기준이 여기에 붙습니다.</p>
        <div style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:16px 18px;border-radius:0 8px 8px 0;margin:16px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">${axMain} 축 — 현장 해석</div>
            <p style="font-size:14.5px;color:#ddd;line-height:1.9;margin:0 0 10px;">${sipText}</p>
            <p style="font-size:14px;color:#ccc;line-height:1.85;margin:0;">${sipPersonality}</p>
        </div>
        ${secondSip ? `<p class="ch-text">두 번째로 두꺼운 층은 <b>${axSec}</b> 축입니다. 주력 패턴이 쉴 때 보조로 발동하며, 같은 사람도 상황에 따라 다른 면이 드러나게 만듭니다.</p>` : ''}

        ${secondSip ? `<div style="background:rgba(199,167,106,0.05);border-radius:10px;padding:18px;margin:20px 0;border:1px solid rgba(199,167,106,0.1);">
            <div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:10px;">&#9670; 두 패턴이 겹칠 때 — ${axMain} × ${axSec}</div>
            <p style="font-size:13px;color:#ccc;line-height:1.88;margin:0;">${sipComboText}</p>
        </div>` : ''}
        <p class="ch-text">이 기질을 도구로 쓰면 속도가 납니다. 기질에게 끌리면 같은 자리에서 반복됩니다. **한 달에 ‘몰입 주’와 ‘회복 주’**를 번갈아 가며 정하십시오.</p>
    </div>`;
}

function buildDomainSummaryTable(opts) {
    // opts.data를 받으면 어휘 정리(voicePolishParagraph)를 적용해 어려운 표현을 일상어로 풀어 줍니다.
    var d = opts.data || {};
    var polish = function (t) {
        try { return voicePolishParagraph(d, t || ''); } catch (e) { return t || ''; }
    };
    var keyword = polish(opts.keyword || '핵심 키워드');
    var route = polish(opts.route || '최적 루트');
    var caution = polish(opts.caution || '주의 사항');
    var boxTitle = opts.boxTitle || '핵심 요약 (3칸)';
    return '<div class="domain-summary-3box" style="background:rgba(255,255,255,0.035);border:1px solid rgba(199,167,106,0.22);border-radius:10px;padding:12px;margin:12px 0 18px;">'
        + '<div style="font-size:11px;color:var(--gold);font-weight:800;letter-spacing:1px;margin:0 0 10px;">' + boxTitle + '</div>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">'
        + '<div style="background:rgba(0,0,0,0.18);border-radius:8px;padding:10px;"><div style="font-size:10px;color:#9aa1ae;margin-bottom:6px;">핵심 키워드</div><div style="font-size:12px;color:#e5d7b3;font-weight:700;line-height:1.65;">' + keyword + '</div></div>'
        + '<div style="background:rgba(0,0,0,0.18);border-radius:8px;padding:10px;"><div style="font-size:10px;color:#9aa1ae;margin-bottom:6px;">최적 루트(전략)</div><div style="font-size:12px;color:#d7d7d7;font-weight:600;line-height:1.65;">' + route + '</div></div>'
        + '<div style="background:rgba(0,0,0,0.18);border-radius:8px;padding:10px;"><div style="font-size:10px;color:#9aa1ae;margin-bottom:6px;">주의 사항</div><div style="font-size:12px;color:#ffb7a8;font-weight:700;line-height:1.65;">' + caution + '</div></div>'
        + '</div></div>';
}

function buildChapter4_Wealth(data) {
    const name = data.name || '고객';
    const sipseong = data.sipseong || {};
    const wuxing = data.wuxing || {};
    const isStrong = data.strengthText && (data.strengthText.includes('신강') || data.strengthText.includes('강'));
    const OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    const dayOh = OH[data.dayStem||'丙']||'fire';
    const OHKR = {wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};

    // 재물 유형 판정
    const jaeC = (sipseong['정재']||0)+(sipseong['편재']||0);
    const total = Math.max(Object.values(sipseong).reduce((a,b)=>a+b,0),1);
    const hasJae = jaeC/total > 0.15;
    const wealthType = hasJae ? 'active' : 'passive';

    const wealthDesc = wealthType === 'active'
        ? `${nmEunNeun(name)} **돈이 손에 자주 닿을 때** 힘이 나는 편입니다. 월급 한 줄만으로는 속도가 안 맞을 수 있는데, 그건 욕심이 아니라 **여러 갈래로 벌어들이는 구조**에 가깝습니다. 다만 **벌이 통로**(부업·거래·투자)는 **세 개 넘기지 마십시오.** “한탕”에 가까운 **짧은 기간 승부**(공모주·유행 테마 등)는 **운이 좋다고 느껴지는 달에만** 소액으로만 두십시오.`
        : `${nmEunNeun(name)} **이름·믿음·실력이 쌓일수록** 돈이 따라붙는 축에 가깝습니다. 한 번에 크게 벌기보다 **같은 고객·같은 일**로 반복 계약이 붙는 쪽이 맞습니다. **내가 하는 일을 한 문장으로 적어** 명함·프로필 맨 위에 두고, **한 달에 들어오고 나가는 돈**만 표로 고정해 보십시오.`;

    const wealthCaution = wealthType === 'active'
        ? `속도가 곧 위험입니다. **빌린 돈으로 버는 투자**나 **손해 나도 괜찮다고 적어 두지 않은 승부**는 한 번에 전부를 가져갈 수 있습니다. **“이 금액 위로는 잃지 않는다”**를 숫자로 적어 지갑 옆에 두고, **남을 대신 맺는 보증·내 이름 빌려주기**는 올해는 하지 마십시오.`
        : `돈을 쫓으면 도망갑니다. **가격·시간·범위**를 먼저 밝히십시오. **하루아침에 크게 오르는 쪽**(유행 주식·코인 등)은 전체에서 **작은 비율**로만 두고, 분기마다 **남에게 보여줄 만한 결과** 한 가지만 골라 정리하십시오.`;

    // 대운별 재물 흐름
    const rows = filterDaeunRowsByClientAge(data.daeunRows || [], getClientAgeYearsAtReport(data));
    const OH2 = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water','子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    const HK2 = {'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계','子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    const yong = data.yong; const gi = data.gi; const hee = data.hee;
    const actIdx = data.activeDaeunIdx || 0;
    const natalPillars = Array.isArray(data.pillars) ? data.pillars : [];
    const natalStems = natalPillars.map(p => p && p.h && p.h[0]).filter(Boolean);
    const natalBranches = natalPillars.map(p => p && p.h && p.h[1]).filter(Boolean);
    const STEM_PAIR = {'甲':'己','己':'甲','乙':'庚','庚':'乙','丙':'辛','辛':'丙','丁':'壬','壬':'丁','戊':'癸','癸':'戊'};
    const BRANCH_PAIR = {'子':'丑','丑':'子','寅':'亥','亥':'寅','卯':'戌','戌':'卯','辰':'酉','酉':'辰','巳':'申','申':'巳','午':'未','未':'午'};
    const BRANCH_CLASH = {'子':'午','午':'子','丑':'未','未':'丑','寅':'申','申':'寅','卯':'酉','酉':'卯','辰':'戌','戌':'辰','巳':'亥','亥':'巳'};

    const daewunRows = rows.slice(0, 8).map((r, i) => {
        const age = r.age !== undefined ? r.age : (Array.isArray(r) ? r[0] : 0);
        const next = rows[i+1];
        const nextAgeRaw = next ? (next.age !== undefined ? next.age : (Array.isArray(next) ? next[0] : age+10)) : age+10;
        const endAge = Math.max(age, (nextAgeRaw||age+10)-1);
        const gz = r.gz || (Array.isArray(r) ? r[1] : '') || '';
        if (!gz) return '';
        const g0 = gz[0] || ''; const g1 = gz[1] || '';
        const ganOh = OH2[g0] || ''; const jiOh = OH2[g1] || '';
        const ganKr = HK2[g0] || g0; const jiKr = HK2[g1] || g1;
        const ganSip = (typeof getSipseong==='function' && data.dayStem) ? (getSipseong(data.dayStem,g0)||'') : '';
        const jiSip = (typeof getSipseong==='function' && data.dayStem) ? (getSipseong(data.dayStem,g1)||'') : '';
        const isGood = ganOh === yong || jiOh === yong || ganOh === hee || jiOh === hee;
        const isBad = ganOh === gi || jiOh === gi;
        const isCur = i === actIdx;
        const score = isGood ? '🟢 재물 상승기' : isBad ? '🔴 수비 필요' : '🟡 유지기';
        const phase = isGood ? 'open' : (isBad ? 'guard' : 'steady');
        const intro = phase==='open'
            ? `${ganKr}${jiKr}(${age}~${endAge}세) — **벌이 통로가 넓어지는** 흐름입니다. 주식·사업 제안·부업이 동시에 들어올 수 있으나, **“이만큼 잃어도 된다”는 숫자 없이**는 새 승부를 내지 마십시오.`
            : phase==='guard'
            ? `${ganKr}${jiKr}(${age}~${endAge}세) — **새는 구간**입니다. 빌린 돈으로 버는 투자·말로 잡는 동업·보증부터 줄이고, **예금에 가깝게 안전한 통장** 비중을 먼저 올리십시오.`
            : `${ganKr}${jiKr}(${age}~${endAge}세) — **지금 돈 나는 줄**을 단단히 하는 시기입니다. 새 판보다 **이미 들어오는 월급·거래·임대** 같은 축을 표로 정리하십시오.`;
        const openActionPool = [
            `${ganKr}${jiKr}(${age}~${endAge}세) 때는 제안이 겹치기 쉬우니, **견적·제안 문자는 이틀 뒤**에만 답장하십시오.`,
            `${age}~${endAge}세 **${ganKr}${jiKr}** 구간에서는 **“잃어도 되는 금액”**을 먼저 적은 뒤에만, 가격이 들쭉날쭉한 쪽에 소액을 두십시오.`,
            `열린 ${age}~${endAge}세 흐름(${ganKr}${jiKr})에서는 **통장에서 자동으로 나가는 항목**만 한 번 줄이고, 새 카드·새 계좌는 이 구간 동안 **한 건**으로 제한하십시오.`,
            `${ganKr}${jiKr}(${age}~${endAge}세)에서는 천간·지지가 동시에 당겨지기 쉬우니, **지금 버는 데 쓰는 시간**이 가장 많이 가는 일 하나만 메인으로 고정하십시오.`,
            `${age}~${endAge}세 **${ganKr}${jiKr}**에는 연락이 빠릅니다. **밤에 보는 투자·쇼핑 앱 알림**은 주간 한 번 요약으로만 바꾸십시오.`,
            `${ganKr}${jiKr}(${age}~${endAge}세) 때는 밖에서 만남이 늘기 쉬우니, **한 주에 몇 번까지 밖에서 약속** 잡을지 숫자로 정하십시오.`,
            `${age}~${endAge}세 **${ganKr}${jiKr}** 활성기에는 여기저기 흩어 넣기보다, **이미 검증된 통장·일**에 비중을 몰고 시험 삼아 볼 돈은 작게만 두십시오.`,
            `${ganKr}${jiKr}(${age}~${endAge}세)에서는 좋은 소식과 부담이 함께 올 수 있으니, **연대보증·지분·내 이름 빌려주기**가 들어간 이야기는 원칙적으로 거절하십시오.`
        ];
        const oi = Math.abs((i * 17 + age * 3 + endAge + (g0.charCodeAt(0) | 0) * 5 + (g1.charCodeAt(0) | 0) * 7 + String(ganSip || '').length * 11) % openActionPool.length);
        const action = phase==='open'
            ? openActionPool[oi]
            : phase==='guard'
            ? '**비상자금·계약 만기·고정비** 세 줄만 먼저 표에 적으십시오.'
            : '**수익원 정리·내부 매뉴얼·팀 역할** 중 하나만 완성도로 밀십시오.';
        const midLife = Math.floor((age + endAge) / 2);
        const lifeArc =
            midLife < 22 ? '배움과 정체성을 다지는 시기로 읽히고'
            : midLife < 34 ? '속도와 실험이 크게 열리는 시기로 읽히고'
            : midLife < 50 ? '책임·구조·자산이 무게 중심을 잡는 시기로 읽히고'
            : midLife < 66 ? '전성기의 결실과 방어를 같이 묶어야 하는 시기로 읽히고'
            : '정리와 전달에 마음이 기우는 시기로 읽히고';
        const ohPair = (ganOh && jiOh && OHKR[ganOh] && OHKR[jiOh]) ? (OHKR[ganOh] + '·' + OHKR[jiOh] + ' 기운이 겹쳐') : '대운 기운이 겹쳐';
        const ganLine = ganSip ? ('겉 일정·대외 과제 쪽에는 ' + sipToEverydayWorkRhythm(ganSip) + ' 흐름이') : '천간 쪽 흐름이';
        const jiLine = jiSip ? ('현장·생활 토대에는 ' + sipToEverydayWorkRhythm(jiSip) + ' 흐름이') : '지지 쪽 흐름이';
        const essayBridge = `${age}~${endAge}세 구간은 ${lifeArc}, ${ohPair} ${ganLine} 붙고 ${jiLine} 붙기 쉽습니다. 한 줄로 압축하면 같은 수익이라도 “선언되는 일”과 “손에 쥐는 일”의 간격이 벌어져 보이니, 검증·증빙을 길게 두는 편이 손해를 줄입니다.`;
        const reacts = [];
        if(natalStems.includes(g0)) reacts.push(`태어난 글자에 ${ganKr}${getJosa(ganKr,'이/가')} 이미 있어, 이 시기에는 내 성향이 더 강하게 드러납니다.`);
        if(natalBranches.includes(g1)) reacts.push(`태어난 글자에 ${jiKr}${getJosa(jiKr,'이/가')} 겹쳐, 같은 주제가 반복되거나 크게 부각될 가능성이 큽니다.`);
        const stemBuddy = STEM_PAIR[g0];
        if(stemBuddy && natalStems.includes(stemBuddy)) {
            const sbKr = HK2[stemBuddy]||stemBuddy;
            reacts.push(`${ganKr}${getJosa(ganKr,'이/가')} 태어난 글자의 ${sbKr}${getJosa(sbKr,'과/와')} 잘 붙어, 사람·기회가 연결되기 쉬운 흐름입니다.`);
        }
        const branchBuddy = BRANCH_PAIR[g1];
        if(branchBuddy && natalBranches.includes(branchBuddy)) {
            const bbKr = HK2[branchBuddy]||branchBuddy;
            reacts.push(`${jiKr}${getJosa(jiKr,'이/가')} 태어난 글자의 ${bbKr}${getJosa(bbKr,'과/와')} 자연스럽게 맞물려, 협업이나 계약이 부드럽게 이어질 수 있습니다.`);
        }
        const branchClash = BRANCH_CLASH[g1];
        if(branchClash && natalBranches.includes(branchClash)) {
            const bcKr = HK2[branchClash]||branchClash;
            reacts.push(`${jiKr}${getJosa(jiKr,'이/가')} 태어난 글자의 ${bcKr}${getJosa(bcKr,'과/와')} 부딪히는 자리라, 직장·돈·관계에서 갑작스런 변경 이슈를 먼저 관리해야 합니다.`);
        }
        const reactionText = reacts.length
            ? reacts.slice(0,2).join(' ')
            : '태어난 글자와 큰 충돌은 적어, 급하게 키우기보다 계획대로 밀어붙일수록 결과가 안정적으로 쌓입니다.';
        const tail = phase==='open'
            ? ''
            : (isStrong
            ? '한 번에 크게 가면 되돌리기 비쌉니다. **같은 목표도 단계를 세 개**로 나누십시오.'
            : '버티기만 하면 기회가 스칩니다. **도움을 요청할 사람 한 명**만 미리 지정하십시오.');
        const txt = [intro, reactionText, essayBridge, action, tail].filter(Boolean).join(' ');
        const curBadge = isCur ? '<span style="font-size:10px;background:rgba(199,167,106,0.10);color:var(--gold);border:1px solid rgba(199,167,106,0.40);padding:1px 6px;border-radius:6px;font-weight:600;letter-spacing:0.3px;">▶ 현재</span>' : '';
        return `<div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:12px 14px;margin-bottom:8px;border-left:3px solid ${isGood ? '#c7a76a' : isBad ? '#e74c3c' : '#555'};">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                <span style="font-size:12px;color:${isGood ? 'var(--gold)' : isBad ? '#e74c3c' : '#888'};">${age}~${endAge}세 ${ganKr}${jiKr}</span>
                <span style="font-size:11px;">${score}</span>
                ${curBadge}
            </div>
            <p style="font-size:12.5px;color:#bbb;margin:0;line-height:1.75;">${txt}</p>
        </div>`;
    }).join('');

    var chHead4 = buildChapterHeadTopicFirst('재물 전략', SAJUX_SECTION_LABELS.wealth, '');
    var chIntro4 = buildChapterIntroHtml(data, 'wealth');
    return `<div class="report-chapter">
        ${chHead4}
        ${chIntro4}
        ${buildDomainSummaryTable({
            data,
            boxTitle: nmEulReul(name) + ' 위한 재물 전략',
            keyword:'통장 들줄 · 지출 한도 · 언제 멈출지',
            route:'벌이는 2~3갈래만 두고, 한 달에 한 번 숫자만 맞추기',
            caution:'보증·말로 잡는 동업·감정으로 큰 돈 움직이기는 멈추기'
        })}
        <p class="ch-text">${voicePolishParagraph(data, '재물은 감이 아니라 리듬입니다. 같은 사람이라도 "돈이 잘 들어오는 해"와 "지키는 해"가 분명히 갈립니다. 사주에서 용신은 몸에 잘 맞는 기운(확장·공격에 유리한 때), 기신은 부담이 큰 기운(지출·실수가 커지기 쉬운 때)으로 읽으시면 좋습니다. 먼저 ' + nmUi(name) + ' 재물의 결부터 들여다보겠습니다.')}</p>

        <div class="wealth-structure sajux-print-surface" style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:18px 20px;border-radius:0 10px 10px 0;margin:18px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;letter-spacing:0.10em;font-weight:600;">${nmUi(name)} 재물 구조</div>
            <p style="font-size:14.5px;color:#ddd;line-height:1.95;margin:0 0 12px;">${boldStarsToStrong(wealthDesc)}</p>
            <p style="font-size:13px;color:var(--text-soft);line-height:1.9;margin:0;"><strong style="color:#ffc7a0;">⚠ 조심할 것.</strong> ${boldStarsToStrong(wealthCaution)}</p>
        </div>

        <p class="ch-text">${voicePolishParagraph(data, '구조를 살폈으니, 마지막으로 어느 시기에 무엇을 멈추고 무엇을 밀어야 하는지 — ' + nmUi(name) + ' 재물을 지키는 가장 단단한 두 원칙을 정리해 드립니다. (대운·세운·월운에 따라 돈이 어떻게 움직이는지는 「지금 이 시절」 챕터에서 한 번에 풀어 드렸으니, 여기서는 평생을 관통하는 두 가지 원칙만 짚어 드립니다.)')}</p>

        <div class="wealth-rule sajux-print-surface" style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px 22px;margin:14px 0 18px;border:1px solid rgba(199,167,106,0.18);">
            <div style="font-size:12px;color:var(--gold);margin-bottom:14px;letter-spacing:0.10em;font-weight:700;">재물을 지키는 핵심 원칙</div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="padding:14px 16px;border-radius:10px;background:rgba(255,140,140,0.05);border-left:3px solid rgba(255,140,140,0.45);">
                    <div style="font-size:12px;font-weight:700;color:#ff9f9f;letter-spacing:0.05em;margin-bottom:6px;">⚠ 기신 기운이 강한 시기 — 이것만은 하지 마십시오</div>
                    <p style="font-size:13px;color:var(--text);line-height:1.95;margin:0;">${boldStarsToStrong('기신이 두꺼울 때는 판단이 흐려지기 쉽습니다. 새 투자·보증·동업 확장은 당분간 보류하시고, 큰 결정은 이틀 밤을 자고 조건을 글로 받은 뒤에만 내리십시오.')}</p>
                </div>
                <div style="padding:14px 16px;border-radius:10px;background:rgba(140,200,180,0.05);border-left:3px solid rgba(140,200,180,0.45);">
                    <div style="font-size:12px;font-weight:700;color:#9ed3bb;letter-spacing:0.05em;margin-bottom:6px;">✦ 용신 기운이 강한 시기 — 이때 움직이십시오</div>
                    <p style="font-size:13px;color:var(--text);line-height:1.95;margin:0;">${boldStarsToStrong('용신·희신이 겹치면 나가서 해도 되는 해에 가깝습니다. 미리 몸과 통장을 준비한 사람이 이깁니다. 통장에 쓸 돈, 잠잘 시간, 계약서 사본 — 세 가지를 미리 챙기십시오.')}</p>
                </div>
            </div>
        </div>
        <p class="ch-text" style="margin-top:14px;">${voicePolishParagraph(data, '돈은 빠르게 번 것보다 오래 남는 쪽이 이깁니다. ' + nmUi(name) + ' 리듬은 ' + (isStrong ? '나눠 넣고 쉬는 날을 달력에 고정해 두시는 것' : '신뢰할 수 있는 파트너와 주간 점검을 한 번씩 갖는 것') + ' — 이 한 가지를 평생 지켜 가시면 됩니다.')}</p>
    </div>`;
}

function buildDaewunLoop(data) {
    var curClientAgeLoop = getClientAgeYearsAtReport(data);
    const rows = filterDaeunRowsByClientAge(data.daeunRows || [], curClientAgeLoop);
    if(!rows.length) return `<div class="report-chapter"><h3 class="ch-title">대운 80년 깊이 보는 풀이</h3><p class="ch-text">대운 데이터를 계산할 수 없습니다. 생년월일시를 정확히 입력하십시오.</p></div>`;

    const OH = {'甲':'목','乙':'목','丙':'화','丁':'화','戊':'토','己':'토','庚':'금','辛':'금','壬':'수','癸':'수'};
    const JI_OH = {'子':'수','丑':'토','寅':'목','卯':'목','辰':'토','巳':'화','午':'화','未':'토','申':'금','酉':'금','戌':'토','亥':'수'};
    const GAN_DESC = {
        '甲':'시작의 10년입니다. 완벽한 계획을 기다리면 늦습니다. **90일짜리 실행 하나**만 달력에 고정하십시오.',
        '乙':'혼자서는 속도가 안 납니다. 관계가 레버입니다. **주간 고정 미팅 한 번**을 약속으로 박으십시오.',
        '丙':'밖으로 나올 때입니다. 숨으면 운이 스칩니다. **대외 산출물·발표**를 분기마다 한 건씩 내십시오.',
        '丁':'넓이가 아니라 깊이입니다. **한 기술·한 제품**만 정해 완성도로 승부하십시오.',
        '戊':'무너지지 않는 밑받침이 이깁니다. **장기 자산·건강·팀** 중 하나를 10년 단위로 고르십시오.',
        '己':'새 것보다 클로징입니다. **정리·회수·계약 연장**에서 실속을 챙기십시오.',
        '庚':'미련이 비용입니다. 안 맞는 것은 잘라야 다음이 열립니다. **정리 리스트 5줄**을 이번 달 안에 처리하십시오.',
        '辛':'많이 하지 말고 하나를 명품으로 만드십시오. **대표 결과물 하나**에만 리소스를 몰으십시오.',
        '壬':'기회가 많아 보이는 함정입니다. **핵심 둘, 나머지는 거절**이라고 적어 두십시오.',
        '癸':'겉은 잔잔해도 안에서는 쌓입니다. **학습·자산·관계** 중 한 축만 깊게 파십시오.'
    };
    const JI_DESC = {
        '子':'집중과 계산이 이깁니다. **야근 대신 수면**을 먼저 지키십시오.',
        '丑':'눈에 띄는 성과보다 밑돌이가 중요합니다. **꾸준한 저축·반복 루틴**을 깨지 마십시오.',
        '寅':'움직임이 답입니다. **이직·이사·새 과제** 중 하나만 과감히 고르십시오.',
        '卯':'사람이 문을 엽니다. **소개·협업 제안**을 먼저 보내십시오.',
        '辰':'변수가 겹칩니다. **큰 결정은 분기 초·말만** 잡으십시오.',
        '巳':'결단이 필요합니다. 미루면 비용만 붙습니다. **서면으로 조건을 먼저** 적으십시오.',
        '午':'드러날 때입니다. **성과 공개·평판**을 의도적으로 관리하십시오.',
        '未':'감성과 창작이 돈이 됩니다. **포트폴리오·콘텐츠**를 하나 완성하십시오.',
        '申':'속도가 승부입니다. **손실 한도**를 숫자로 적고 움직이십시오.',
        '酉':'대가를 받을 때입니다. **요금·연봉·단가**를 정직하게 올리십시오.',
        '戌':'정리 후반입니다. **끊을 것·남길 것**을 문장으로 나누십시오.',
        '亥':'잠복입니다. 겉성과에 흔들리지 마십시오. **내실 축 하나**만 쌓으십시오.'
    };

    const yong = data.yong || ''; const hee = data.hee || '';
    const gi = data.gi || ''; const goo = data.goo || '';
    const OH_MAP = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    const JI_OH_MAP = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};

    function scoreRow(gan, ji) {
        let s = 0;
        const gOh = OH_MAP[gan]; const jOh = JI_OH_MAP[ji];
        if(gOh===yong||gOh===hee) s+=2; if(gOh===gi||gOh===goo) s-=2;
        if(jOh===yong||jOh===hee) s+=2; if(jOh===gi||jOh===goo) s-=2;
        return s;
    }
    function badge(s) { return s>=3?'🌟 대길':s>=1?'✦ 길':s===0?'— 평':s>=-2?'⚠ 주의':'❌ 흉'; }
    function col(s) { return s>=3?'#c7a76a':s>=1?'#00C853':s===0?'#888':s>=-2?'#ff9800':'#e74c3c'; }

    var chHeadD = buildChapterHeadTopicFirst('대운 — 10년 계절의 지도', '', '');
    var chIntroD = buildChapterIntroHtml(data, 'daeun');
    let out = `<div class="report-chapter">${chHeadD}${chIntroD}
    ${getAgeBasisNoteHtml('block')}
    <p class="ch-text">대운은 10년짜리 기후입니다. 계절을 모르면 옷을 잘못 입습니다. 용신이 오면 **공격**, 기신이 오면 **수비**만 고르십시오. 아래는 그 계절표입니다.</p>
    <div style="display:flex;flex-direction:column;gap:16px;">`;

    rows.forEach((r, idx) => {
        const gan = (r.gz && r.gz[0]) || r.gan || '甲';
        const ji = (r.gz && r.gz[1]) || r.ji || '子';
        const age = r.age || (idx*10+5);
        const _bY = data.birthYear || 1988;
        const _startY2 = _bY + age - 1;
        const _endY2 = _startY2 + 9;
        const sc = scoreRow(gan, ji);
        const b = badge(sc); const c = col(sc);
        const isCurrent = idx === (data.activeDaeunIdx || 0);
        const ganD = GAN_DESC[gan] || '';
        const jiD = JI_DESC[ji] || '';
        // 대운 오행 판별
        const ganOh = OH_MAP[gan] || '';
        const jiOh = JI_OH_MAP[ji] || '';
        const isYong = ganOh===yong || jiOh===yong || ganOh===hee || jiOh===hee;
        const isGi = ganOh===gi || jiOh===gi || ganOh===goo || jiOh===goo;
        // 천간/지지별 맞춤 4분야 조언
        const WEALTH_GAN = {
            '甲':'포트폴리오 시드 구간입니다. 당장 수익보다 **자산 구조 한 장**을 그리십시오.',
            '乙':'사람이 돈입니다. **신뢰 가능한 파트너 한 명**을 먼저 묶으십시오.',
            '丙':'밖으로 드러날 때 수입이 붙습니다. **대외 산출물·강연·브랜드**에 예산을 쓰십시오.',
            '丁':'전문가 단가가 오릅니다. **한 분야 깊이**만 파십시오.',
            '戊':'실물·기반이 이깁니다. **10년 단위로 보이는 자산**만 고르십시오.',
            '己':'클로징·정산 구간입니다. **회수·연장·정산**부터 하십시오.',
            '庚':'정리가 곧 이익입니다. **포트폴리오를 세 줄로** 줄이십시오.',
            '辛':'완성 하나가 브랜드입니다. **대표 결과물 하나**에만 몰으십시오.',
            '壬':'기회가 많아 보입니다. **둘만 남기고 나머지는 거절**하십시오.',
            '癸':'겉으로는 안 보여도 쌓입니다. **교육·자격·내부 시스템**에만 쓰십시오.'
        };
        const WEALTH_JI = {
            '子':'숫자·문서가 이깁니다. **현금흐름 표**를 주간으로만 열십시오.',
            '丑':'느려도 됩니다. **저축·실물**만 흔들리지 않게 하십시오.',
            '寅':'움직임이 돈입니다. **이사·이직·테마 성격 자산·새 온라인 채널** 중 하나만 고르십시오.',
            '卯':'사람이 문을 엽니다. **소개·협업 제안**을 먼저 보내십시오.',
            '辰':'변수가 겹칩니다. **신규 고레버리지·충동 투자는 유예**하고 관망하십시오.',
            '巳':'서명이 필요합니다. **조건을 먼저 글로** 적고 도장을 찍으십시오.',
            '午':'평판이 수입입니다. **약속 이행**을 먼저 쌓으십시오.',
            '未':'감성이 상품이 됩니다. **콘텐츠·교육** 하나를 완성하십시오.',
            '申':'속도전입니다. **단기 매매·파생**은 손실 한도 숫자를 적고 움직이십시오.',
            '酉':'대가를 받으십시오. **단가·연봉**을 정직하게 올리십시오.',
            '戌':'정리의 해입니다. **채권·채무·미완**부터 끊으십시오.',
            '亥':'눈에 안 보여도 쌓입니다. **내실 투자**만 하십시오.'
        };
        const CAREER_GAN = {
            '甲':'새 판입니다. **원하는 직함을 문장으로** 적고 한 걸음만 내리십시오.',
            '乙':'팀이 이깁니다. **협업 파트너**를 먼저 고르십시오.',
            '丙':'성과가 보입니다. **성과를 숫자로** 남기십시오.',
            '丁':'깊이가 직급입니다. **한 기술 분야·업무 템플릿 묶음**만 정하십시오.',
            '戊':'버티는 자리가 이깁니다. **오래 갈 포지션**을 고르십시오.',
            '己':'지금 자리가 답입니다. **신뢰 누적**에만 집중하십시오.',
            '庚':'덜어내야 빨라집니다. **역할 범위**를 문서로 고정하십시오.',
            '辛':'완성도가 승부입니다. **대표 과제 하나**만 남기십시오.',
            '壬':'기회가 많습니다. **데이터·플랫폼·자동화와 겹치는 것만** 잡으십시오.',
            '癸':'배움이 이깁니다. **자격·커리큘럼·업무 자동화 역량**에 시간을 쓰십시오.'
        };
        const CAREER_JI = {
            '子':'기획·분석이 빛납니다. **요건·근거 정리로 결론**을 내리십시오.',
            '丑':'버티면 이깁니다. **이직 충동**을 한 시즌 유예하십시오.',
            '寅':'환경이 바뀝니다. **새 역할**을 두려워하지 마십시오.',
            '卯':'네트워크가 커집니다. **온·오프라인 밋업 후속 액션**을 고정하십시오.',
            '辰':'변수입니다. **계약은 조항부터** 읽으십시오.',
            '巳':'결단의 해입니다. **미룬 결정 하나**만 끝내십시오.',
            '午':'인정받습니다. **더 큰 목표**를 공개하십시오.',
            '未':'사람·창작이 이깁니다. **포트폴리오**를 채우십시오.',
            '申':'실행이 이깁니다. **리스크 한도**를 먼저 적으십시오.',
            '酉':'전문가 브랜드입니다. **대외 포지션**을 한 문장으로 고치십시오.',
            '戌':'전환입니다. **안 맞는 역할**은 정리하십시오.',
            '亥':'잠복입니다. **급한 이직**은 피하십시오.'
        };
        const wealthAdv = (WEALTH_GAN[gan]||'') + ' ' + (WEALTH_JI[ji]||'');
        const careerAdv = (CAREER_GAN[gan]||'') + ' ' + (CAREER_JI[ji]||'');
        // 건강 조언
        const healthAdv = sc>=2 ? '체력이 받쳐줍니다. **운동·수면 루틴**을 이때 고정하십시오. 무리한 밤만 줄이면 됩니다.' : sc>=0 ? '무난합니다. **수면 7시간·검진 예약**만 지키십시오.' : '면역이 얇습니다. **술·철야·과로**를 먼저 끊고 검진을 당기십시오.';
        // 애정 조언
        const loveAdv = pickLoveAdviceByScore(sc, 'daeun-love|' + gan + ji + '|' + age);

        const strategy = sc >= 2
            ? `<div style="background:rgba(0,200,83,0.06);border-radius:8px;padding:14px;margin-top:12px;border:1px solid rgba(0,200,83,0.15);"><b style="color:#00C853;font-size:12px;">✦ 길한 대운 — 4분야 전략</b><div class="daeun-four-stack" style="display:grid!important;grid-template-columns:1fr!important;width:100%!important;gap:10px;margin-top:10px;"><div style="background:rgba(255,255,255,0.08);border-radius:6px;padding:8px 10px;border:1px solid rgba(199,167,106,0.18);border-left:3px solid #c7a76a;"><div style="font-size:10px;color:#c7a76a;margin-bottom:4px;">💰 재물</div><p style="font-size:11.5px;color:#bbb;line-height:1.7;margin:0;">${wealthAdv}</p></div><div style="background:rgba(255,255,255,0.08);border-radius:6px;padding:8px 10px;border:1px solid rgba(199,167,106,0.18);border-left:3px solid #c7a76a;"><div style="font-size:10px;color:#c7a76a;margin-bottom:4px;">💼 직업</div><p style="font-size:11.5px;color:#bbb;line-height:1.7;margin:0;">${careerAdv}</p></div><div style="background:rgba(255,255,255,0.08);border-radius:6px;padding:8px 10px;border:1px solid rgba(199,167,106,0.18);border-left:3px solid #c7a76a;"><div style="font-size:10px;color:#c7a76a;margin-bottom:4px;">❤️ 애정</div><p style="font-size:11.5px;color:#bbb;line-height:1.7;margin:0;">${loveAdv}</p></div><div style="background:rgba(255,255,255,0.08);border-radius:6px;padding:8px 10px;border:1px solid rgba(199,167,106,0.18);border-left:3px solid #c7a76a;"><div style="font-size:10px;color:#c7a76a;margin-bottom:4px;">🏥 건강</div><p style="font-size:11.5px;color:#bbb;line-height:1.7;margin:0;">${healthAdv}</p></div></div></div>`
            : sc >= 0
            ? `<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;margin-top:12px;"><b style="color:#aaa;font-size:12px;">— 중화 대운 — 4분야 전략</b><div class="daeun-four-stack" style="display:grid!important;grid-template-columns:1fr!important;width:100%!important;gap:8px;margin-top:10px;"><div style="background:rgba(255,255,255,0.08);border-radius:6px;padding:8px 10px;border:1px solid rgba(199,167,106,0.18);border-left:3px solid #888;"><div style="font-size:10px;color:#888;margin-bottom:4px;">💰 재물</div><p style="font-size:11.5px;color:#bbb;line-height:1.7;margin:0;">${wealthAdv}</p></div><div style="background:rgba(255,255,255,0.08);border-radius:6px;padding:8px 10px;border:1px solid rgba(199,167,106,0.18);border-left:3px solid #888;"><div style="font-size:10px;color:#888;margin-bottom:4px;">💼 직업</div><p style="font-size:11.5px;color:#bbb;line-height:1.7;margin:0;">${careerAdv}</p></div><div style="background:rgba(255,255,255,0.08);border-radius:6px;padding:8px 10px;border:1px solid rgba(199,167,106,0.18);border-left:3px solid #888;"><div style="font-size:10px;color:#888;margin-bottom:4px;">❤️ 애정</div><p style="font-size:11.5px;color:#bbb;line-height:1.7;margin:0;">${loveAdv}</p></div><div style="background:rgba(255,255,255,0.08);border-radius:6px;padding:8px 10px;border:1px solid rgba(199,167,106,0.18);border-left:3px solid #888;"><div style="font-size:10px;color:#888;margin-bottom:4px;">🏥 건강</div><p style="font-size:11.5px;color:#bbb;line-height:1.7;margin:0;">${healthAdv}</p></div></div></div>`
            : `<div style="background:rgba(255,150,0,0.06);border-radius:8px;padding:14px;margin-top:12px;border:1px solid rgba(255,150,0,0.12);"><b style="color:#ff9800;font-size:12px;">⚠ 흉한 대운 — 4분야 전략</b><div class="daeun-four-stack" style="display:grid!important;grid-template-columns:1fr!important;width:100%!important;gap:8px;margin-top:10px;"><div style="background:rgba(255,255,255,0.08);border-radius:6px;padding:8px 10px;border:1px solid rgba(199,167,106,0.18);border-left:3px solid #ff9800;"><div style="font-size:10px;color:#ff9800;margin-bottom:4px;">💰 재물</div><p style="font-size:11.5px;color:#bbb;line-height:1.7;margin:0;">${wealthAdv}</p></div><div style="background:rgba(255,255,255,0.08);border-radius:6px;padding:8px 10px;border:1px solid rgba(199,167,106,0.18);border-left:3px solid #ff9800;"><div style="font-size:10px;color:#ff9800;margin-bottom:4px;">💼 직업</div><p style="font-size:11.5px;color:#bbb;line-height:1.7;margin:0;">${careerAdv}</p></div><div style="background:rgba(255,255,255,0.08);border-radius:6px;padding:8px 10px;border:1px solid rgba(199,167,106,0.18);border-left:3px solid #ff9800;"><div style="font-size:10px;color:#ff9800;margin-bottom:4px;">❤️ 애정</div><p style="font-size:11.5px;color:#bbb;line-height:1.7;margin:0;">${loveAdv}</p></div><div style="background:rgba(255,255,255,0.08);border-radius:6px;padding:8px 10px;border:1px solid rgba(199,167,106,0.18);border-left:3px solid #ff9800;"><div style="font-size:10px;color:#ff9800;margin-bottom:4px;">🏥 건강</div><p style="font-size:11.5px;color:#bbb;line-height:1.7;margin:0;">${healthAdv}</p></div></div></div>`;

        // PERIOD_NARRATIVE: 간지 조합별 종합 서사 (window에 없으면 빈 객체로 폴백)
        const _PN = (typeof window !== 'undefined' && window.PERIOD_NARRATIVE) || {};
        const ganjiKey = gan+ji;
        // 나이범위를 포함한 통합 서사: ganD(10년 서사) + jiD(계절 서사)
        const _ageRange = `${age}세부터 ${age+9}세까지 — `;
        const periodNarr = voicePolishParagraph(data, _PN[ganjiKey] || (_ageRange + ganD + ' ' + jiD));
        const ganKr = HK[gan]||gan; const jiKr = HK[ji]||ji;
        out += `<div class="daeun-decade-card" style="background:rgba(255,255,255,${isCurrent?'0.07':'0.03'});border:1px solid ${isCurrent?'var(--gold)':'rgba(255,255,255,0.07)'};border-radius:12px;padding:18px;break-inside:avoid;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <div>
                        <div style="font-size:18px;font-weight:800;color:var(--gold);">${age}세 ~ ${age+9}세</div>
                        <div style="font-size:12px;color:rgba(199,167,106,0.6);margin-top:2px;">${ganKr}${jiKr}운</div>
                        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">
                            ${(typeof getUnsung==='function'&&data.dayStem) ? `<span style="font-size:10px;background:rgba(255,255,255,0.1);color:#bbb;padding:1px 7px;border-radius:8px;">흐름: ${getUnsung(data.dayStem,ji)||'-'}</span>` : ''}
                            ${(typeof getSipseong==='function'&&data.dayStem) ? `<span class="m-badge" style="font-size:10px;display:inline-block;">${sipToManseBadge(getSipseong(data.dayStem,gan), false)}</span>` : ''}
                        </div>
                        ${isCurrent?'<span style="font-size:10px;background:rgba(199,167,106,0.10);color:var(--gold);border:1px solid rgba(199,167,106,0.40);padding:2px 8px;border-radius:8px;font-weight:600;letter-spacing:0.3px;display:inline-block;margin-top:4px;">▶ 지금 이 시기</span>':''}
                    </div>
                </div>
                <span style="font-size:13px;font-weight:700;color:${c};padding:4px 12px;border-radius:20px;background:rgba(255,255,255,0.05);">${b}</span>
            </div>
            <div style="background:rgba(255,255,255,0.06);border-radius:8px;padding:14px;margin-bottom:12px;border:1px solid rgba(199,167,106,0.15);">
                <p style="font-size:13.5px;color:#ddd;line-height:1.85;margin:0;">${voicePolishReportHtml(data, periodNarr)}</p>
            </div>
            ${strategy}
        </div>`;
    });

    out += `</div></div>`;
    return out;
}

function buildSewunLoop(data) {
    const baseNow = getReportBaseDate(data);
    const currentYear = baseNow.getFullYear();
    const GAN = ['갑','을','병','정','무','기','경','신','임','계'];
    const JI = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
    const GAN_KR = {'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계'};
    const JI_KR = {'子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    const GAN_DESC = {
        '甲':'새로운 시작과 성장. 사업 확장, 새 프로젝트 출발, 계획 수립에 유리.',
        '乙':'유연한 적응. 관계 구축, 협상, 네트워킹에 강한 기운.',
        '丙':'강렬한 열정과 표현. 자신을 알리고 드러내는 시기. 홍보·마케팅 유리.',
        '丁':'세밀한 집중. 내실을 다지고 깊이 파고드는 시기. 전문성 강화.',
        '戊':'묵직한 중심. 현금흐름 코어·리얼에셋·인프라 펀드에 강한 기운.',
        '己':'실용적 클로징. 기존 프로젝트 정리·정산·계약 연장에서 실속.',
        '庚':'결단과 쇄신. 불필요한 것을 쳐내고 새 기준을 세우는 시기.',
        '辛':'정밀한 완성. 디테일에 집중하고 품질을 높이는 시기.',
        '壬':'흐름과 확산. 지수형·글로벌 채널로 자본이 퍼지는 국면.',
        '癸':'내면 충전. 분석·연구·학습. 조용히 내공을 쌓는 시기.'
    };
    const JI_DESC = {
        '子':'지혜와 집중. 아이디어가 넘치는 시기. 문서·계약에 유리.',
        '丑':'인내와 저력. 눈에 띄지 않는 성실함이 미래 토대를 쌓음.',
        '寅':'활동과 도전. 새로운 출발, 이동, 변화의 기운이 강함.',
        '卯':'관계와 성장. 인맥이 확장되고 협력 기회가 생김.',
        '辰':'잠재력 발동. 예상치 못한 기회와 변수가 공존. 신중히 대응.',
        '巳':'집중과 변신. 결단력이 필요한 시기. 큰 변화의 전조.',
        '午':'성취와 인정. 사회적 성과가 드러나는 화려한 시기.',
        '未':'감성과 풍요. 창작·문화·예술 분야에서 결실을 맺음.',
        '申':'판단과 결단. 빠른 결정이 필요. 민첩한 대응이 성패를 가름.',
        '酉':'완성과 보상. 그동안의 노력이 결실로 돌아오는 시기.',
        '戌':'통찰과 마무리. 깊은 성찰과 정리가 필요한 마무리 국면.',
        '亥':'잠복과 준비. 표면적 침체지만 내면의 힘이 충전되는 시기.'
    };

    // 용신/기신 기반 연도 평가
    const STEM_OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    const BRANCH_OH = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    const yong = data.yong || ''; const hee = data.hee || ''; const gi = data.gi || ''; const goo = data.goo || '';
    
    function scoreYear(stemH, branchH) {
        const sOh = STEM_OH[stemH]; const bOh = BRANCH_OH[branchH];
        let score = 0;
        if(sOh===yong||sOh===hee) score+=2; if(sOh===gi||sOh===goo) score-=2;
        if(bOh===yong||bOh===hee) score+=2; if(bOh===gi||bOh===goo) score-=2;
        return score;
    }
    function scoreLabel(s) { return s>=3?'대길':s>=1?'길':s===0?'평':s>=-2?'주의':'흉'; }
    function scoreColor(s) { return s>=3?'#c7a76a':s>=1?'#00C853':s===0?'#888':s>=-2?'#ff9800':'#e74c3c'; }

    // 세운 십성 계산용 일간
    const DS_SEW = data.dayStem || '甲';
    const STEM_SIPSEONG_BASE = {
        '甲':{甲:'비견',乙:'겁재',丙:'식신',丁:'상관',戊:'편재',己:'정재',庚:'편관',辛:'정관',壬:'편인',癸:'정인'},
        '乙':{甲:'겁재',乙:'비견',丙:'상관',丁:'식신',戊:'정재',己:'편재',庚:'정관',辛:'편관',壬:'정인',癸:'편인'},
        '丙':{甲:'편인',乙:'정인',丙:'비견',丁:'겁재',戊:'식신',己:'상관',庚:'편재',辛:'정재',壬:'편관',癸:'정관'},
        '丁':{甲:'정인',乙:'편인',丙:'겁재',丁:'비견',戊:'상관',己:'식신',庚:'정재',辛:'편재',壬:'정관',癸:'편관'},
        '戊':{甲:'편관',乙:'정관',丙:'편인',丁:'정인',戊:'비견',己:'겁재',庚:'식신',辛:'상관',壬:'편재',癸:'정재'},
        '己':{甲:'정관',乙:'편관',丙:'정인',丁:'편인',戊:'겁재',己:'비견',庚:'상관',辛:'식신',壬:'정재',癸:'편재'},
        '庚':{甲:'편재',乙:'정재',丙:'편관',丁:'정관',戊:'편인',己:'정인',庚:'비견',辛:'겁재',壬:'식신',癸:'상관'},
        '辛':{甲:'정재',乙:'편재',丙:'정관',丁:'편관',戊:'정인',己:'편인',庚:'겁재',辛:'비견',壬:'상관',癸:'식신'},
        '壬':{甲:'식신',乙:'상관',丙:'편재',丁:'정재',戊:'편관',己:'정관',庚:'편인',辛:'정인',壬:'비견',癸:'겁재'},
        '癸':{甲:'상관',乙:'식신',丙:'정재',丁:'편재',戊:'정관',己:'편관',庚:'정인',辛:'편인',壬:'겁재',癸:'비견'}
    };
    // 천간 한자→한글 역매핑
    const GAN_HJ = {'갑':'甲','을':'乙','병':'丙','정':'丁','무':'戊','기':'己','경':'庚','신':'辛','임':'壬','계':'癸'};
    // 12신살 세운용 간이 계산
    function getSewunShinsal(stemKr, branchKr) {
        const db = data.dayBranch || '';
        const yb = (data.pillars && data.pillars[3] && data.pillars[3].h && data.pillars[3].h[1]) || '';
        const brHJ = {'자':'子','축':'丑','인':'寅','묘':'卯','진':'辰','사':'巳','오':'午','미':'未','신':'申','유':'酉','술':'戌','해':'亥'}[branchKr] || '';
        const result = [];
        // 역마살
        const maMap = {"亥":"巳","卯":"巳","未":"巳","辛":"寅","子":"寅","辰":"寅","巳":"亥","酉":"亥","丑":"亥","寅":"申","午":"申","戌":"申"};
        if(db && maMap[db]===brHJ) result.push('역마');
        if(yb && maMap[yb]===brHJ) result.push('역마');
        // 도화살
        const dhMap = {"亥":"子","卯":"子","未":"子","辛":"酉","子":"酉","辰":"酉","巳":"午","酉":"午","丑":"午","寅":"卯","午":"卯","戌":"卯"};
        if(db && dhMap[db]===brHJ) result.push('도화');
        if(yb && dhMap[yb]===brHJ) result.push('도화');
        // 장성살
        const jsMap = {"寅":"午","午":"戌","戌":"寅","亥":"卯","卯":"未","未":"亥","申":"子","子":"辰","辰":"申","巳":"酉","酉":"丑","丑":"巳"};
        if(db && jsMap[db]===brHJ) result.push('장성');
        if(yb && jsMap[yb]===brHJ) result.push('장성');
        // 화개살
        const hgMap = {"亥":"未","卯":"未","未":"未","辛":"辰","子":"辰","辰":"辰","巳":"丑","酉":"丑","丑":"丑","寅":"戌","午":"戌","戌":"戌"};
        if(db && hgMap[db]===brHJ) result.push('화개');
        if(yb && hgMap[yb]===brHJ) result.push('화개');
        return [...new Set(result)];
    }


    const OH_KR_SE = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' };
    const nameSe = data.name || '고객';
    let rows = '';
    for(let i=0; i<10; i++) {
        const yr = currentYear + i;
        const ganIdx = ((yr - 4) % 10 + 10) % 10;
        const jiIdx = ((yr - 4) % 12 + 12) % 12;
        const stem = GAN[ganIdx]; const branch = JI[jiIdx];
        const stemHan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'][ganIdx];
        const jiHan = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][jiIdx];
        const hanja = stemHan + jiHan;
        const score = scoreYear(stemHan, jiHan);
        const label = scoreLabel(score); const col = scoreColor(score);
        const isNow = i===0;
        // 세운 십성 계산
        const stemHJ = GAN_HJ[stem] || stem;
        const sewSipDB = STEM_SIPSEONG_BASE[DS_SEW] || {};
        const sewSip = sewSipDB[stemHJ] || '';
        // 세운 신살
        const sewShinsal = getSewunShinsal(stem, branch);

        // 세운: 연도 제목 직후 4줄 인디케이터 → 상세 서사
        const ykw = yearlyFourDomainKeywords(score, sewSip);
        const ykwInd = yearlyFourDomainIndicators(score, sewSip);
        const gLine = GAN_DESC[stemHan] || '';
        const jLine = JI_DESC[jiHan] || '';
        const yearNarr = score >= 3
            ? `${formatYearWithGanzhi(yr, stemHan, jiHan)}은 원국과 크게 맞는 해입니다. 천간은 ${gLine} 지지는 ${jLine} **우선순위 한 줄만 정하고, 분기마다 숫자로 리뷰**하십시오.`
            : score >= 1
            ? `${formatYearWithGanzhi(yr, stemHan, jiHan)}은 상승에 가깝습니다. ${gLine} ${jLine} **검증된 것만 속도를 올리고, 미검증 확장은 월 단위로 쪼개** 검토하십시오.`
            : score === 0
            ? `${formatYearWithGanzhi(yr, stemHan, jiHan)}은 급격한 길·흉보다 균형에 가깝습니다. ${gLine} ${jLine} **확장은 멈추고 현금흐름·건강 루틴만** 고정하십시오.`
            : score >= -2
            ? `${formatYearWithGanzhi(yr, stemHan, jiHan)}은 방어와 정리에 무게가 실립니다. ${gLine} ${jLine} **현금·수면·검진을 먼저 지키고, 보증·레버리지·감정 결정은 보류**하십시오.`
            : `${formatYearWithGanzhi(yr, stemHan, jiHan)}은 긴급 방어가 필요합니다. ${gLine} ${jLine} **신규 투자·충동 확장은 즉시 끊고, 손실 한도 안에서만** 움직이십시오.`;
        const gohY = STEM_OH[stemHan]; const johY = BRANCH_OH[jiHan];
        const evUp = (gohY === yong || johY === yong);
        const evDn = (gohY === gi || johY === gi);
        const evLab = evUp ? '흥(興)' : (evDn ? '주의' : '평온');
        const isCoreThree = (yr >= currentYear && yr <= currentYear + 2);
        const yongTag = (OH_KR_SE[yong] || '목') + ' 쪽 에너지가 맞는 편';
        const yearlyFourStrip = buildYearlyIndicatorsHtml(ykwInd);
        const domAdv = yearlyDomainStrategicAdvices(score);
        const strategicBlock = isCoreThree
            ? buildYearStrategicNarrative(nameSe, yr, formatGanzhiPair(stemHan, jiHan), evLab, score, sewSip, yongTag, domAdv)
            : '<p class="yearly-description" style="font-size:13px;color:#ddd;line-height:1.85;margin:0;">' + yearNarr + '</p>';
        const seyunOneLine = formatSeYunCardOneLineConclusion(evLab, score);
        const sewSipCustomer = sewSip ? sewSip : '';
        const yearlyBodyHtml = '<div style="width:100%;box-sizing:border-box;background:rgba(255,255,255,0.06);border-radius:8px;padding:14px 16px;margin-bottom:10px;border:1px solid rgba(199,167,106,0.2);">'
            + strategicBlock + '</div>';
        rows += `<div class="seyun-year-card yearly-card glass-panel" style="width:100%;max-width:100%;box-sizing:border-box;background:rgba(255,255,255,${isNow?'0.07':'0.03'});border-radius:10px;padding:16px;border:1px solid ${isNow?'var(--gold)':'rgba(255,255,255,0.07)'};break-inside:avoid;">
            <div style="display:flex;flex-direction:column;align-items:flex-start;width:100%;gap:8px;margin-bottom:10px;">
                <div style="width:100%;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
                <div>
                    <div style="font-size:17px;font-weight:800;color:var(--gold);font-family:'Noto Sans KR',sans-serif;">${formatYearWithGanzhiHtml(yr, stemHan, jiHan)}</div>
                    <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">
                        ${sewSipCustomer ? `<span style="font-size:10px;background:rgba(199,167,106,0.15);color:#c7a76a;padding:1px 7px;border-radius:8px;">${sewSipCustomer}</span>` : ''}
                        ${sewShinsal.map(s=>`<span style="font-size:10px;background:rgba(255,255,255,0.08);color:#aaa;padding:1px 7px;border-radius:8px;">${s}</span>`).join('')}
                        ${isNow?'<span style="font-size:10px;background:rgba(199,167,106,0.10);color:var(--gold);border:1px solid rgba(199,167,106,0.40);padding:1px 7px;border-radius:8px;font-weight:600;letter-spacing:0.3px;">▶ 올해</span>':''}
                    </div>
                </div>
                <span style="font-size:13px;font-weight:700;color:${col};padding:4px 12px;border-radius:20px;background:rgba(255,255,255,0.05);">${label}</span>
                </div>
            </div>
            <p style="font-size:12.5px;font-weight:700;color:var(--text-primary);line-height:1.55;margin:0 0 8px;width:100%;letter-spacing:-0.01em;">${seyunOneLine}</p>
            ${yearlyFourStrip}
            ${yearlyBodyHtml}
        </div>`;
    }

    var chHeadS = buildChapterHeadTopicFirst('세운 — 앞으로 10년의 바람', '10 · 장기 한 해의 리듬', '');
    var chIntroS = buildChapterIntroHtml(data, 'seyun');
    return `<div class="report-chapter">
        ${chHeadS}
        ${chIntroS}
        <p class="ch-text">대운이 기후라면 세운은 **그해의 날씨**입니다. 길·흉 라벨보다 **무엇을 할지·하지 말지**만 고르십시오.</p>

        <div style="background:rgba(199,167,106,0.06);border-radius:10px;padding:18px;margin:20px 0;border:1px solid rgba(199,167,106,0.15);">
            <div style="display:flex;flex-direction:column;gap:8px;width:100%;">
                <div style="background:rgba(199,167,106,0.08);border-radius:6px;padding:10px;text-align:center;">
                    <div style="font-size:18px;margin-bottom:4px;">🌟</div>
                    <div style="font-size:11px;color:#c7a76a;font-weight:700;">대길 (4점+)</div>
                    <p style="font-size:11px;color:#bbb;margin:4px 0 0;line-height:1.6;">전면 공세. 모든 분야에서 대담한 결정을 실행하십시오.</p>
                </div>
                <div style="background:rgba(0,200,83,0.06);border-radius:6px;padding:10px;text-align:center;">
                    <div style="font-size:18px;margin-bottom:4px;">✦</div>
                    <div style="font-size:11px;color:#00C853;font-weight:700;">길 (1~3점)</div>
                    <p style="font-size:11px;color:#bbb;margin:4px 0 0;line-height:1.6;">순풍. 계획을 실행하되 과욕은 피하십시오.</p>
                </div>
                <div style="background:rgba(255,255,255,0.04);border-radius:6px;padding:10px;text-align:center;">
                    <div style="font-size:18px;margin-bottom:4px;">—</div>
                    <div style="font-size:11px;color:#888;font-weight:700;">평 (0점)</div>
                    <p style="font-size:11px;color:#bbb;margin:4px 0 0;line-height:1.6;">현상 유지. 안정적 관리에 집중하십시오.</p>
                </div>
                <div style="background:rgba(255,150,0,0.06);border-radius:6px;padding:10px;text-align:center;">
                    <div style="font-size:18px;margin-bottom:4px;">⚠</div>
                    <div style="font-size:11px;color:#ff9800;font-weight:700;">주의 (-1~-2점)</div>
                    <p style="font-size:11px;color:#bbb;margin:4px 0 0;line-height:1.6;">역풍. 신중하게 움직이고 리스크를 최소화하십시오.</p>
                </div>
                <div style="background:rgba(231,76,60,0.06);border-radius:6px;padding:10px;text-align:center;">
                    <div style="font-size:18px;margin-bottom:4px;">❌</div>
                    <div style="font-size:11px;color:#e74c3c;font-weight:700;">흉 (-3점-)</div>
                    <p style="font-size:11px;color:#bbb;margin:4px 0 0;line-height:1.6;">강한 역풍. 방어 전략으로 손실을 최소화하십시오.</p>
                </div>
            </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;width:100%;">${rows}</div>
    </div>`;
}

function buildWolunLoop(data) {
    const baseDate = getReportBaseDate(data);
    const yr = (baseDate && typeof baseDate.getFullYear === 'function') ? baseDate.getFullYear() : new Date().getFullYear();
    const GAN = ['갑','을','병','정','무','기','경','신','임','계'];
    const JI = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
    const GAN_HJ = {'갑':'甲','을':'乙','병':'丙','정':'丁','무':'戊','기':'己','경':'庚','신':'辛','임':'壬','계':'癸'};
    const JI_HJ = {'자':'子','축':'丑','인':'寅','묘':'卯','진':'辰','사':'巳','오':'午','미':'未','신':'申','유':'酉','술':'戌','해':'亥'};
    const JI_KR = {'子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    const MONTH_NAME = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
    // 월건 지지: 인월(1월)부터
    const MONTH_JI_BASE = ['인','묘','진','사','오','미','신','유','술','해','자','축'];
    // 월건 천간: 연간에 따라 결정
    const YR_GAN_IDX = ((yr - 4) % 10 + 10) % 10;
    // 월천간 기준: 갑·기년 = 병인月부터, 을·경 = 무인月, 병·신 = 경인月, 정·임 = 임인月, 무·계 = 갑인月
    const MONTH_GAN_START = [2,4,6,8,0][YR_GAN_IDX % 5]; // 인월 천간 인덱스

    const BRANCH_ANIMAL = {'子':'쥐','丑':'소','寅':'호랑이','卯':'토끼','辰':'용','巳':'뱀','午':'말','未':'양','申':'원숭이','酉':'닭','戌':'개','亥':'돼지'};

    // 용신/기신 기반 월 평가
    const BRANCH_OH = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    const STEM_OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    const yong=data.yong||''; const hee=data.hee||''; const gi=data.gi||''; const goo=data.goo||'';
    function mScore(mGan, mJi) {
        let s=0;
        const gOh=STEM_OH[mGan]; const jOh=BRANCH_OH[mJi];
        if(gOh===yong||gOh===hee)s+=2; if(gOh===gi||gOh===goo)s-=2;
        if(jOh===yong||jOh===hee)s+=2; if(jOh===gi||jOh===goo)s-=2;
        return s;
    }
    function mLabel(s){return s>=3?'대길':'길'; }
    function mColor(s){return s>=3?'#c7a76a':s>=1?'#00C853':s===0?'#888':s>=-2?'#ff9800':'#e74c3c';}
    function mBadge(s){return s>=3?'🌟':s>=1?'✦':s===0?'—':s>=-2?'⚠':'❌';}

    const curMonth = new Date().getMonth(); // 0-based
    // 이번 연도 인월부터 12개월
    // 시간 다리(transition) — 한 달 → 다음 달 사이 흐름 한 줄
    function _buildMonthBridge(prevScore, nextScore, nextMonthNo, nextLabel) {
        if (prevScore == null || nextScore == null) return '';
        var diff = nextScore - prevScore;
        var line;
        if (diff >= 3)        line = '여기서 흐름이 크게 살아납니다. ' + nextMonthNo + '월(' + nextLabel + ')은 한 달 동안 미뤄두었던 일을 한꺼번에 푸는 시기로 잡으시면 좋습니다.';
        else if (diff >= 1)   line = '바람이 한 단계 부드러워집니다. ' + nextMonthNo + '월(' + nextLabel + ')은 새 약속 한두 가지를 가볍게 더해도 무리가 없습니다.';
        else if (diff <= -3)  line = '여기서 흐름이 한 박자 무거워집니다. ' + nextMonthNo + '월(' + nextLabel + ')은 새 결정보다 정리·점검 쪽으로 무게를 옮기십시오.';
        else if (diff <= -1)  line = '결이 살짝 비틀립니다. ' + nextMonthNo + '월(' + nextLabel + ')은 약속을 한두 개 미루더라도 호흡을 길게 가져가십시오.';
        else                  line = '흐름이 비슷한 결로 이어집니다. ' + nextMonthNo + '월(' + nextLabel + ')은 이번 달의 리듬을 그대로 이어가시면 됩니다.';
        return '<div class="month-bridge" style="margin:6px 4px 6px;padding:8px 14px;font-size:12px;color:var(--text-dim);line-height:1.85;font-style:italic;letter-spacing:0.01em;">↓ ' + line + '</div>';
    }
    const _monthScores = Array.from({length:12}).map(function(_,i){
        var mJiKr = MONTH_JI_BASE[i];
        var mGanIdx = (MONTH_GAN_START + i) % 10;
        var mGanKr = GAN[mGanIdx];
        var mGanHj = GAN_HJ[mGanKr] || '';
        var mJiHj = JI_HJ[mJiKr] || '';
        return { score: mScore(mGanHj, mJiHj), mGanKr: mGanKr, mJiKr: mJiKr, monthNo: i+1 };
    });

    const rows = Array.from({length:12}).map((_,i)=>{
        const mJiKr = MONTH_JI_BASE[i];
        const mGanIdx = (MONTH_GAN_START + i) % 10;
        const mGanKr = GAN[mGanIdx];
        const mGanHj = GAN_HJ[mGanKr] || '';
        const mJiHj = JI_HJ[mJiKr] || '';
        const monthNo = i + 1;
        const pillarTitle = formatMonthWithGanzhiHtml(monthNo, mGanHj, mJiHj);
        const score = mScore(mGanHj, mJiHj);
        const col = mColor(score); const badge = mBadge(score);
        const isNow = i === curMonth;
        const mSip = (typeof getSipseong==='function' && mGanHj) ? (getSipseong(data.dayStem||'', mGanHj) || '비견') : '비견';
        const mUns = (typeof getUnsung==='function' && mJiHj) ? (getUnsung(data.dayStem||'', mJiHj) || '-') : '-';
        const dynText = renderFortuneText({ sip:mSip, uns:mUns, score:score, idx:i, scope:'month', mGanHj:mGanHj, mJiHj:mJiHj });
        const highOrdPool = [
            '중요 계약·핵심 미팅은 조건·한도를 서면으로 정리한 뒤 일정을 잡으십시오.',
            '길운이 실릴 때는 **새 시작**을 밀되, 서명 전 **이탈 조항** 두 줄을 반드시 받아 적으십시오.',
            '이번 달은 **대외 발표·견적 제출**에 힘을 실으십시오. 구두 합의는 같은 날 메일로만 고정하십시오.',
            '큰 안건은 **요일을 쪼개** 하루에 하나만 진행하고, 나머지는 전날 밤까지 자료만 마련하십시오.'
        ];
        const neuOrdPool = [
            `${monthNo}월에는 **고정비·구독·보험** 세 줄을 다시 읽고, 끊을 항목에만 체크하십시오.`,
            `${mGanKr}${mJiKr}월 기운에서는 **견적·회신**을 하루 한 번 묶어 처리하고 그 외 시간엔 집중 업무로 돌아가십시오.`,
            `${monthNo}월 초·말에만 통장 숫자를 맞추고, 그 사이에는 **새 투자 앱**을 설치하지 마십시오.`,
            `${MONTH_NAME[i]} **${mGanKr}${mJiKr}**에는 약속을 **주 2회 상한**으로 두고, 초과분은 익월 첫 주로 미루십시오.`,
            `${monthNo}월에는 문서 파일명에 **날짜**를 붙이는 규칙만 지켜도 혼선이 크게 줄어듭니다.`,
            `${mGanKr}${mJiKr} 월운에서는 **내부 문서·협업 도구** 중 한 곳에만 결정 로그를 남기고 나머지 채널은 알림을 끄십시오.`,
            `${monthNo}월 **미수·미회신** 목록을 월요일 오전에만 처리하고, 금요일엔 새로 열지 마십시오.`,
            `${MONTH_NAME[i]}에는 **수면 시간 한 줄**만 달력에 박고, 그 밖의 자기계발은 한 코스로 제한하십시오.`
        ];
        const lowOrdPool = [
            '신규 확장과 고위험 결정은 즉시 멈추고 손실 차단을 우선하십시오.',
            `${monthNo}월에는 **레버리지·보증·야간 송금**을 금지하고, 꼭 필요한 지출은 영업일 점심 이전에만 처리하십시오.`,
            `${mGanKr}${mJiKr} 흉운에서는 **계약 수정 요청**을 문자로만 받고, 전화 합의는 다음 날 아침으로 미루십시오.`,
            `${MONTH_NAME[i]} **대면 미팅**은 주 1회로 줄이고, 나머지는 비동기 자료로만 주고받으십시오.`
        ];
        const hiIx = Math.abs((monthNo * 13 + score * 3 + hashSeed((mSip || '') + '|hi')) % highOrdPool.length);
        const neIx = Math.abs((monthNo * 19 + score * 7 + hashSeed((mGanHj || '') + (mJiHj || '') + '|ne') + i * 3) % neuOrdPool.length);
        const loIx = Math.abs((monthNo * 11 + score * 5 + hashSeed((mJiHj || '') + '|lo')) % lowOrdPool.length);
        const ordText = score>=2
            ? highOrdPool[hiIx]
            : score>=0
            ? neuOrdPool[neIx]
            : lowOrdPool[loIx];
        const wolOneLine = formatWolunCardOneLineConclusion(score, mGanHj, mJiHj, monthNo);
        const mSipAxis = mSip ? mSip : '';
        return `<div class="monthly-card glass-panel" style="width:100%;box-sizing:border-box;background:rgba(255,255,255,${isNow?'0.07':'0.03'});border-radius:10px;padding:14px 16px;border-left:3px solid ${col};break-inside:avoid;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                <div style="display:flex;align-items:center;gap:8px;min-width:0;flex-wrap:wrap;">
                    <span class="month-pillar-title" style="font-size:18px;font-weight:700;color:var(--gold);font-family:'Noto Sans KR',sans-serif;letter-spacing:0.02em;">${pillarTitle}</span>
                    ${mSipAxis ? `<span style="font-size:10px;background:rgba(199,167,106,0.12);color:#c7a76a;padding:1px 7px;border-radius:8px;">${mSipAxis}</span>` : ''}
                    <span style="font-size:12px;color:#aaa;">양력 ${yr}.${monthNo}월 · ${mJiKr}월(${BRANCH_ANIMAL[mJiHj]||'해당'})</span>
                    ${isNow?'<span style="font-size:10px;background:rgba(199,167,106,0.10);color:var(--gold);border:1px solid rgba(199,167,106,0.40);padding:1px 7px;border-radius:8px;font-weight:600;letter-spacing:0.3px;">이번달</span>':''}
                </div>
                <span style="font-size:16px;">${badge}</span>
            </div>
            <p style="font-size:12.5px;font-weight:700;color:var(--text-primary);line-height:1.55;margin:0 0 8px;width:100%;">${wolOneLine}</p>
            <p style="font-size:13px;color:#ccc;line-height:1.8;margin:0 0 6px;">${polishHanjaInText(dynText)}</p>
            <div style="font-size:11px;color:${col};">지시: ${ordText}</div>
        </div>`;
    });

    // 카드 사이에 시간 다리 끼워넣기
    const _rowsWithBridges = rows.map(function(card, i){
        if (i === 0) return card;
        var prev = _monthScores[i-1], cur = _monthScores[i];
        var bridge = _buildMonthBridge(prev.score, cur.score, cur.monthNo, cur.mGanKr + cur.mJiKr + '월');
        return bridge + card;
    }).join('');

    var chHeadMo = buildChapterHeadTopicFirst('월운 — 12개월의 리듬', '13 · 한 달 단위의 무게 이동', '');
    var chIntroMo = buildChapterIntroHtml(data, 'monthly');
    return `<div class="report-chapter">
        ${chHeadMo}
        ${chIntroMo}
        <p class="ch-text">${voicePolishParagraph(data, '세운이 한 해의 날씨라면, 월운은 그 안의 시간대입니다. 기운이 맞는 달에는 한 발 밀고, 부딪히는 달에는 일정의 약 30%를 비우는 식으로 호흡을 가져가시면 한 해가 훨씬 길게 견뎌집니다.')}</p>
        <p class="ch-text" style="font-size:13px;color:var(--text-dim);">${voicePolishParagraph(data, '카드와 카드 사이에 한 줄 다리를 두어, 한 달이 다음 달로 어떻게 이어지는지 한눈에 보이도록 정리했습니다.')}</p>
        <div style="display:flex;flex-direction:column;gap:10px;width:100%;">
            ${_rowsWithBridges}
        </div>
    </div>`;
}


// ═══════════════════════════════════════════════════════
// 합격 — 시험·취직·문서운 (인성·관성·식상·재성 비중 기반)
// ═══════════════════════════════════════════════════════
function buildChapter_HapGyeok(data) {
    const name = data.name || '고객';
    const sipseong = data.sipseong || {};
    const inC   = (sipseong['정인']||0)+(sipseong['편인']||0);
    const gwanC = (sipseong['정관']||0)+(sipseong['편관']||0);
    const sikC  = (sipseong['식신']||0)+(sipseong['상관']||0);
    const jaeC  = (sipseong['정재']||0)+(sipseong['편재']||0);
    const total = Math.max(Object.values(sipseong).reduce((a,b)=>a+b,0), 1);
    const inPct   = Math.round(inC/total*100);
    const gwanPct = Math.round(gwanC/total*100);
    const sikPct  = Math.round(sikC/total*100);
    const jaePct  = Math.round(jaeC/total*100);

    function band(p) {
        if (p >= 30) return { col:'var(--gold)', tone:'strong', label:'두꺼움' };
        if (p >= 15) return { col:'#4a9e6a',     tone:'mid',    label:'적정'   };
        if (p >= 5)  return { col:'#999',        tone:'thin',   label:'얇음'   };
        return { col:'#888', tone:'lack', label:'거의 없음' };
    }
    const testBand = band(inPct);
    const hireBand = band(gwanPct);
    const interviewBand = band(sikPct);
    const fieldBand = band(jaePct);

    // 영역별 한 단락
    const examLine = {
        strong: nmEunNeun(name) + ' 인성(印) 기운이 두껍게 자리잡은 분이라, **공부·자격·시험에서 가장 빛나는 결**을 갖고 계세요. 한 번 마음먹으신 시험은 평균 이상의 결과로 마무리되시고, 자격증 한 장이 인생의 큰 무기가 되는 사주예요. 다만 욕심내어 여러 시험을 동시에 잡으시면 깊이가 흐려지니, **같은 시기에 큰 시험은 한 가지만** 잡으십시오.',
        mid: nmEunNeun(name) + ' 인성(印)이 적정 수준으로 자리잡으셔서, 시험·자격 자체에 막힘은 없으세요. 다만 폭발적인 단번 합격보다는 **꾸준한 누적이 결실로 돌아오는 결**이라, 1년 단위로 차근차근 쌓아 가시는 게 좋습니다.',
        thin: nmEunNeun(name) + ' 인성(印)이 얇은 편이라, 시험·자격을 잡으실 때 흐름이 한 번에 안 풀릴 수 있어요. 단번에 끝내려 하지 마시고 **인성 운이 실리는 대운·세운**(임·계·인·묘·해·자 글자가 들어오는 시기)에 큰 시험을 맞춰 잡으십시오.',
        lack: '인성(印)이 사주에 거의 자리 잡고 있지 않으세요. 시험·자격에서 자주 헛도시는 패턴이 반복되실 수 있어요. 큰 시험은 인성 기운이 들어오는 시기를 꼭 기다리시고, 평소엔 **요약 정리 노트 한 권**을 평생 무기로 가지고 가시는 게 좋습니다.'
    }[testBand.tone];

    const hireLine = {
        strong: '관성(官)이 두껍게 자리잡으셔서, **조직에 들어가 자리 잡는 운**이 굵직하게 깔린 사주세요. 공무·공기업·대기업·공공 영역에서 ' + nmUi(name) + ' 결이 가장 잘 살아납니다. 다만 책임이 무거워지면 어깨가 빠르게 짓눌릴 수 있으니, **승진 직후 6개월은 일정의 20%를 의도적으로 비워** 두십시오.',
        mid: '관성(官)이 적정 수준으로 잡혀 있으셔서, 취업·이직 자체에 큰 어려움은 없는 사주세요. 다만 **첫 직장에서 평생 자리 잡는 결**은 아니라, 두세 번의 이직을 거쳐 진짜 자리를 찾으시는 게 자연스럽습니다.',
        thin: '관성(官)이 얇은 편이라, 큰 조직보다는 **중소·전문·소규모 팀**에서 ' + nmUi(name) + ' 결이 더 잘 살아납니다. 큰 회사에 들어가신다면 그 안에서도 “전문가 트랙”을 일찍 잡으시는 게 좋습니다.',
        lack: '관성(官)이 거의 비어 있으세요. **조직에 매여 사는 결**이 아니라 — 프리랜서·자영업·개인 사업처럼 “스스로 만든 자리”에서 가장 자연스러우십니다. 취업을 하시더라도 “퇴사 후 독립”의 가능성을 늘 마음 한 쪽에 두고 일하시는 게 좋습니다.'
    }[hireBand.tone];

    const interviewLine = {
        strong: '식상(食傷)이 두꺼우셔서 **면접·발표·말로 푸는 자리에서 가장 큰 무기**가 빛납니다. 분위기를 만들고, 핵심을 짚어 내는 힘이 또래 평균보다 한 단계 위세요. 다만 너무 자신 있으시면 “준비 부족”의 인상을 줄 수 있으니, **첫 1분 자기소개는 미리 외워** 두십시오.',
        mid: '식상이 적정 수준이라, 면접·발표에서 평균 이상은 하시는 결이에요. 다만 결정적인 자리에서 한 번 더 빛나시려면 **모범 답안 10개 + 본인만의 키워드 3개**를 미리 정리해 두십시오.',
        thin: '식상이 얇으셔서 면접·발표에서 “표현이 부족하다”는 평을 들으실 수 있어요. 실력이 부족한 게 아니라, 말로 풀어내는 통로가 좁은 것뿐입니다. **모의 면접을 5회 이상** 반복하시는 게 어떤 책 한 권보다 효과가 큽니다.',
        lack: '식상이 거의 없으세요. 말로 풀어 보이는 자리는 늘 부담되시지만, **서류·실기·필기 위주의 시험**에서는 오히려 강하십니다. 자기소개서·포트폴리오 같은 “글로 적는 자리”에 평소 힘을 쌓아 두십시오.'
    }[interviewBand.tone];

    const fieldLine = {
        strong: '재성(財)이 두꺼우셔서 **실무·현장·영업에서 실력이 가장 빨리 드러나는 결**이에요. 시험·자격보다 “일을 직접 해 보면서 배우는 자리”에서 ' + nmUi(name) + ' 진가가 발휘됩니다. 신입 시절부터 작은 성과 하나를 손에 쥐고 시작하시는 게 좋아요.',
        mid: '재성이 적정 수준이라, 실무에서도 평균 이상의 적응력을 보이시는 결입니다. 한 분야에서 3년만 버티시면, 그때부터 ' + nmIGa(name) + ' 진짜 ' + nmUi(name) + ' 색이 드러나기 시작합니다.',
        thin: '재성이 얇으셔서, 실무에서 한 번에 큰 성과를 내시기보다는 — **신중하고 꼼꼼한 처리**가 강점인 결이에요. “돈을 빨리 벌어야 한다”는 부담을 내려놓으시면, 오히려 본인의 진가가 자연스럽게 드러납니다.',
        lack: '재성이 거의 비어 있어, 실무·영업에서 “숫자에 약한 사람”으로 보일 수 있어요. 약점이 아니라, **돈을 직접 다루는 자리보다 가치를 만드는 자리**가 ' + nmKke(name) + ' 더 잘 맞다는 신호입니다. 평생 회계·재무 관련은 전문가 한 명을 옆에 두시는 게 좋습니다.'
    }[fieldBand.tone];

    // 문서운 — 인성(印) 비중이 핵심
    const docLine = (inPct >= 25)
        ? '문서운이 두꺼워서 자격증·계약서·공증·졸업장 같은 “종이”가 ' + nmUi(name) + ' 가장 큰 무기로 작동합니다. **평생 한 권의 자격증·학위**가 든든한 방패가 되는 사주예요. 다만 한 번에 큰 계약은 영업일 이틀만 비워 두신 뒤 도장을 찍으시는 습관을 들이십시오.'
        : (inPct >= 10)
            ? '문서운이 적정 수준이라 자격증·계약을 잡으실 때 흐름이 막히지는 않아요. 다만 큰 시험·큰 계약은 **인성(印) 기운이 들어오는 해**(임·계·인·묘·해·자 글자가 실리는 시기)에 맞춰 잡으시면 결실이 훨씬 단단해집니다.'
            : '문서운이 얇거나 거의 비어 있는 편이라, 자격증·시험·계약서에서 자주 헛도실 수 있어요. **큰 결정은 인성(印) 기운이 실리는 대운·세운에 맞춰** 잡으시고, 평소엔 본인 이름으로 들어오는 모든 문서를 한 폴더에 모아 두십시오.';

    // 큰 추천 한 줄
    let mainAdvice;
    if (inPct >= gwanPct && inPct >= sikPct && inPct >= jaePct) {
        mainAdvice = '<strong>' + nmEunNeun(name) + ' 사주의 무게중심이 “공부·자격”에 가장 가까이 가 있는 분</strong>이세요. 평생 한 권의 자격증·학위를 손에 쥐고 사시면 그게 가장 큰 무기가 됩니다.';
    } else if (gwanPct >= sikPct && gwanPct >= jaePct) {
        mainAdvice = '<strong>' + nmEunNeun(name) + ' 사주의 무게중심이 “조직과 자리”에 가장 가까이 가 있는 분</strong>이세요. 큰 조직 안에서 책임을 맡으시면서 자리 잡는 결이 가장 자연스럽습니다.';
    } else if (sikPct >= jaePct) {
        mainAdvice = '<strong>' + nmEunNeun(name) + ' 사주의 무게중심이 “표현과 결과물”에 가장 가까이 가 있는 분</strong>이세요. 시험·취업 모두 “보여주는 자리”에서 빛이 납니다.';
    } else {
        mainAdvice = '<strong>' + nmEunNeun(name) + ' 사주의 무게중심이 “실무와 현장”에 가장 가까이 가 있는 분</strong>이세요. 시험·이론보다 일을 직접 해 보면서 익히시는 길이 가장 빠릅니다.';
    }

    function _vp(t){ return voicePolishParagraph(data, t); }
    function box(label, val, b, body) {
        return '<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:14px 16px;">'
            + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
            + '<div style="font-size:11px;letter-spacing:0.10em;color:var(--text-dim);">' + label + '</div>'
            + '<div style="display:flex;align-items:center;gap:8px;">'
            + '<span style="font-size:13px;font-weight:700;color:' + b.col + ';">' + val + '%</span>'
            + '<span style="font-size:10px;background:rgba(255,255,255,0.08);color:' + b.col + ';padding:2px 7px;border-radius:6px;letter-spacing:0.04em;">' + b.label + '</span>'
            + '</div></div>'
            + '<p style="font-size:13px;color:#ccc;line-height:1.88;margin:0;">' + boldStarsToStrong(_vp(body)) + '</p>'
            + '</div>';
    }

    var chHeadH = buildChapterHeadTopicFirst('합격 · 문서운', '시험 · 취직 · 서류 한 줄의 무게', '');
    return `<div class="report-chapter">
        ${chHeadH}
        <p class="ch-text" style="font-size:14px;color:var(--text);line-height:2;margin:0 0 18px;">${_vp('합격은 사주에서 네 가지 기둥이 함께 만드는 결과예요. <strong>인성(印, 공부·자격)</strong>, <strong>관성(官, 조직·취업)</strong>, <strong>식상(食傷, 표현·면접)</strong>, <strong>재성(財, 실무·현장)</strong> — 이 네 가지의 두께를 보면 ' + nmIGa(name) + ' 어떤 “합격 자리”에서 가장 잘 풀리시는지가 거의 다 드러납니다.')}</p>
        <p class="ch-text" style="font-size:14px;color:var(--text);line-height:2;margin:0 0 18px;">${boldStarsToStrong(_vp(mainAdvice))}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0 18px;">
            ${box('시험 · 자격 (인성)', inPct, testBand, examLine)}
            ${box('취직 · 조직 (관성)', gwanPct, hireBand, hireLine)}
            ${box('면접 · 표현 (식상)', sikPct, interviewBand, interviewLine)}
            ${box('실무 · 현장 (재성)', jaePct, fieldBand, fieldLine)}
        </div>
        <div style="background:rgba(199,167,106,0.06);border-radius:12px;padding:18px 20px;margin:18px 0;border-left:3px solid var(--gold);">
            <div style="font-size:11px;letter-spacing:0.10em;color:var(--gold);margin-bottom:10px;font-weight:700;">문서운 — 계약 · 자격 · 공증</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.95;margin:0;">${boldStarsToStrong(_vp(docLine))}</p>
        </div>
        <p class="ch-text" style="font-size:14px;color:var(--text);line-height:2;margin:0 0 18px;">${_vp('마지막으로 — 합격에는 “타이밍”도 중요합니다. ' + nmKke(name) + ' 인성(印) 기운이 들어오는 시기(임수·계수·인목·묘목·해수·자수 글자가 실리는 해)에는 시험·자격·문서가 평소보다 두 배쯤 잘 풀려요. 큰 시험·큰 계약은 그 시기에 맞춰 잡으시는 것만으로도 결과가 달라집니다.')}</p>
    </div>`;
}

function buildChapter5_Career(data) {
    const name = data.name || '고객';
    const sipseong = data.sipseong || {};
    const gwanC = (sipseong['정관']||0)+(sipseong['편관']||0);
    const sikC = (sipseong['식신']||0)+(sipseong['상관']||0);
    const inC = (sipseong['정인']||0)+(sipseong['편인']||0);
    const jaeC = (sipseong['정재']||0)+(sipseong['편재']||0);
    const total = Math.max(Object.values(sipseong).reduce((a,b)=>a+b,0),1);
    const careerType = gwanC/total>0.2?'officer':sikC/total>0.2?'creator':inC/total>0.2?'expert':'independent';
    const careerDB = {
        officer:{label:'관리형 — 조직과 책임', desc:'회사·단체에서 **자리와 평가**가 잡히는 쪽이 강합니다. 규칙과 순서 안에서 빛이 납니다. 그건 순응이 아니라 **맡은 범위가 곧 내 이름**이 되는 구조입니다. **규정 지키기·결재 순서·돈이 새는 구멍 막기** 같은 축에서 신뢰를 쌓으십시오. **“어디까지 내 일인지”**를 먼저 글로 정리하십시오.', jobs:'팀장·관리·행정·교사·공무·병원·은행 창구처럼 **조직 안에서 책임**이 생기는 일'},
        creator:{label:'창조형 — 결과물과 표현', desc:'기획·글·영상·디자인처럼 **손에 쥐는 결과**가 곧 평가로 붙는 쪽이 강합니다. 남의 방식만 따르면 금방 지칩니다. **내 이름이 붙은 결과물**(포트폴리오·채널·작품)을 하나 정해 꾸준히 쌓으십시오. **밖으로 내는 일정**(발표·미팅)을 달에 한두 번만 고정하십시오.', jobs:'기획·촬영·디자인·마케팅·개발·매장·강사처럼 **보여주는 일**이 중심인 일'},
        expert:{label:'전문가형 — 배움과 자격', desc:'공부·자격·논문·기술처럼 **따라오기 어려운 실력**이 자산이 됩니다. 깊이를 쌓지 않으면 나이가 들수록 경쟁이 힘들어집니다. **한 분야만** 정해 자료와 사례를 쌓으십시오.', jobs:'의사·변호사·회계·상담·연구·분석·정비처럼 **자격이나 경력이 문을 여는** 일'},
        independent:{label:'독립형 — 자율과 경쟁', desc:'남 밑에 오래 있으면 답답한 쪽입니다. **스스로 벌이를 만드는 자리**(사업·영업·프리랜서)가 맞는 경우가 많습니다. 다만 **말로만 잡는 동업**은 피하고, **영수증·계약서**로만 관계를 잡으십시오.', jobs:'자영업·영업·부동산 중개·방송·운동·커뮤니티 운영처럼 **내가 끌고 가야 하는** 일'}
    };
    const cd = careerDB[careerType];
    const wealthLink = jaeC/total>0.25
        ? '현금·거래 축이 붙어 있습니다. 흐름이 빠릅니다. **수익원은 세 개**, 그 이상은 정리하십시오.'
        : jaeC===0
        ? '재물 기둥이 얇은 편입니다. 돈을 쫓지 말고 **가치표**를 올리십시오.'
        : '재물 축은 적정입니다. **월 현금흐름 표**만 고정해도 속도가 납니다.';
    var chHead5 = buildChapterHeadTopicFirst('직업 · 소명', SAJUX_SECTION_LABELS.career, '');
    var chIntro5 = buildChapterIntroHtml(data, 'career');
    return `<div class="report-chapter">
        ${chHead5}
        ${chIntro5}
        ${buildDomainSummaryTable({
            data,
            boxTitle: nmEulReul(name) + ' 위한 직업 전략',
            keyword:'권한 범위 · 성과 기준 · 평판 자산',
            route:'핵심 역할 문서화 + 분기 목표 수치화',
            caution:'권한 없는 과잉 책임과 무계획 이직을 절대 삼가십시오'
        })}
        <p class="ch-text">${voicePolishParagraph(data, '직업은 직함이 아니라 권한의 문제입니다. 권한이 흐리면 실력이 소음이 되고, 권한이 분명하면 같은 일이라도 결과가 또렷하게 쌓입니다. ' + nmUi(name) + ' 사주는 어떤 권한 위에서 가장 빛나는지 — 먼저 그 결을 살펴보겠습니다.')}</p>
        <div class="career-type-block sajux-print-surface" style="background:rgba(199,167,106,0.07);border-radius:12px;padding:22px;margin:18px 0;border:1px solid rgba(199,167,106,0.18);">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;letter-spacing:0.10em;">직업 성향 분석 결과</div>
            <div style="font-size:16px;font-weight:700;color:var(--gold);margin-bottom:12px;">${cd.label}</div>
            <p style="font-size:14.5px;color:#ddd;line-height:1.95;margin:0;">${boldStarsToStrong(cd.desc)}</p>
        </div>
        <p class="ch-text">${voicePolishParagraph(data, '결을 알았다면, 어떤 자리에서 그 결이 가장 잘 살아나는지가 다음 질문입니다. ' + nmKke(name) + ' 어울리는 무대와, 그 무대에서 돈이 어떻게 따라붙는지 정리해 드립니다.')}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0 18px;">
            <div class="sajux-print-surface" style="background:rgba(255,255,255,0.04);border-radius:10px;padding:14px 16px;">
                <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:0.10em;">최적 직업군</div>
                <div style="font-size:13px;color:#ddd;line-height:1.85;">${boldStarsToStrong(cd.jobs)}</div>
            </div>
            <div class="sajux-print-surface" style="background:rgba(255,255,255,0.04);border-radius:10px;padding:14px 16px;">
                <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:0.10em;">재물과의 연결</div>
                <div style="font-size:13px;color:#ddd;line-height:1.85;">${boldStarsToStrong(wealthLink)}</div>
            </div>
        </div>
        <p class="ch-text">${voicePolishParagraph(data, '직업 선택의 기준은 단 하나입니다. 내 결정권이 서면 실력이 살고, 없으면 같은 자리에서 소모됩니다. 명함의 무게가 아니라 권한의 두께를 보십시오.')}</p>

        <div style="background:rgba(199,167,106,0.05);border-radius:12px;padding:20px;margin:16px 0;border:1px solid rgba(199,167,106,0.1);">
            <div style="font-size:12px;color:var(--gold);margin-bottom:12px;letter-spacing:1px;">&#9670; 대운 단계별 커리어 전략</div>
            <p style="font-size:13px;color:#bbb;line-height:1.85;margin:0 0 14px;">맞는 기운 구간은 **승진·이직·대외**, 부딪히는 구간은 **자격·학습·내부 정리**에 두십시오. 나이표를 외우지 말고, 지금 대운이 어느 쪽인지만 보십시오.</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div style="font-size:12px;color:#bbb;line-height:1.8;"><b style="color:#ddd;">순풍 대운 커리어</b><br>적극 확장·이직·승진·창업 — 이 시기에 커리어의 최대 도약이 일어납니다.</div>
                <div style="font-size:12px;color:#bbb;line-height:1.8;"><b style="color:#ddd;">역풍 대운 커리어</b><br>내실 다지기·자격증·학습·네트워크 — 조용한 준비가 다음 도약의 연료가 됩니다.</div>
            </div>
        </div>

        ${(()=>{
            const OH_DAY_CR = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            const dayOhCR = OH_DAY_CR[data.dayStem||'丙'] || 'fire';
            const OH_JOBS = {
                wood:  { tag:'성장·기획·교육·생명',  jobs:['교사·강사','교육 콘텐츠 기획','출판·편집','심리·상담','복지·NGO','환경·생명과학 분야','조경·임업·식물 관련 사업','크리에이터(성장 콘텐츠)','코칭·멘토링'] },
                fire:  { tag:'표현·열정·연결',         jobs:['방송·미디어','광고·마케팅','이벤트·기획자','강연자·진행자','요식업(불 다루는 분야)','뷰티·패션·트렌드','연예·엔터테인먼트','영업·세일즈(대인 중심)','예술·공연 분야'] },
                earth: { tag:'안정·중개·축적',         jobs:['부동산·건설·인테리어','회계·세무·총무','요식업·식품 유통','보험·연금','중개·플랫폼 매니저','HR·총무','농수산·로컬 비즈니스','부동산 임대업','관광·숙박 운영'] },
                metal: { tag:'결단·정밀·전문',         jobs:['의료(외과·치과·정형)','법조·검찰·법무','금융·증권·투자','회계·감사·세무사','경찰·군인·보안','정밀기계·반도체','보석·시계·금속 가공','품질관리·QA','전문 컨설팅'] },
                water: { tag:'통찰·정보·연구',         jobs:['연구원·학계','데이터·분석·통계','심리·정신과·임상','무역·물류','금융 분석·자산운용','작가·번역·기록','정보 분석','전략 기획·컨설팅','심리 상담·코치'] }
            };
            const ohRec = OH_JOBS[dayOhCR];
            const dominantSip = (function(){
                const arr = Object.entries(sipseong).sort((a,b)=>b[1]-a[1]);
                return arr.length>0 ? arr[0][0] : '';
            })();
            const sipExtra = {
                '비견':'동업·공동대표·파트너십이 들어간 자리에서 잘 풀리시고',
                '겁재':'경쟁이 치열한 시장(영업·트레이딩·세일즈 대회)에서 오히려 결이 살고',
                '식신':'한 분야의 깊이를 쌓아 “장인·전문가”로 알려지는 길이 잘 맞으시고',
                '상관':'기존 틀을 깨는 창작·기획·1인 미디어에서 가장 빠르게 결실이 보이고',
                '편재':'단기 프로젝트·영업·중개·자영업처럼 “손에 잡히는 돈의 흐름”이 잦은 자리에서 빛나시고',
                '정재':'월급·계약·고정 거래처처럼 “안정적인 현금 흐름”이 있는 자리에서 가장 자연스러우시고',
                '편관':'위기 대응·구조조정·법무·군경처럼 “큰 압박을 견디는 자리”에서 진가가 발휘되시고',
                '정관':'공무·공기업·대기업처럼 “규칙과 위계가 분명한 자리”에서 안정적으로 자리 잡으시고',
                '편인':'독립·1인 전문가·연구·창작처럼 “나만의 길”을 가는 자리가 잘 맞으시고',
                '정인':'교육·연구·자격 기반 전문직처럼 “공부의 결과가 직업이 되는 자리”가 가장 자연스럽고'
            }[dominantSip] || '';
            const jobsList = '<ul style="margin:6px 0 0 0;padding-left:18px;color:#ddd;line-height:1.85;font-size:13px;">'
                + ohRec.jobs.map(j=>'<li>'+j+'</li>').join('') + '</ul>';
            const ohKr = (dayOhCR==='wood'?'목(木)':dayOhCR==='fire'?'화(火)':dayOhCR==='earth'?'토(土)':dayOhCR==='metal'?'금(金)':'수(水)');
            return '<div style="background:rgba(199,167,106,0.06);border-radius:12px;padding:20px 22px;margin:18px 0;border:1px solid rgba(199,167,106,0.18);">'
                + '<div style="font-size:12px;color:var(--gold);margin-bottom:10px;letter-spacing:1px;font-weight:700;">&#9670; ' + nmKke(name) + ' 추천드리는 구체적 직업</div>'
                + '<p style="font-size:13.5px;color:#ccc;line-height:1.95;margin:0 0 12px;">' + boldStarsToStrong(voicePolishParagraph(data, nmEunNeun(name) + ' 일간(태어난 날의 천간)이 <strong>' + ohKr + '</strong> 기운에 속하시고, 사주에서 가장 두꺼운 자리가 <strong>' + (dominantSip||'균형형') + '</strong>이세요. 그래서 ' + (sipExtra ? sipExtra + ' ' : '') + ohRec.tag + '의 결과 잘 맞으세요. 아래는 그 결에서 자연스럽게 자리 잡으시는 직업들을 추려 본 거예요.')) + '</p>'
                + '<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:14px 16px;">'
                + '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:0.10em;">결에 가장 잘 맞는 자리</div>'
                + jobsList + '</div>'
                + '<p style="font-size:12.5px;color:#aaa;line-height:1.8;margin:12px 0 0;">이 목록은 “정답”이 아니라 <strong>결이 살아나는 방향</strong>이에요. 같은 직무 안에서도 결정권·표현 비중·근무 환경이 어떻게 짜여 있는지가 더 중요합니다. 한 직업을 정하시기 전에 “이 자리에서 내 권한은 어디까지인가”를 먼저 글로 적어 보십시오.</p>'
                + '</div>';
        })()}

        <p class="ch-text" style="margin-top:16px;">일은 오래 버틸 **한 문장 직무 정의**가 있을 때 남습니다. 그 문장을 이번 분기 안에 쓰십시오.</p>
    </div>`;
}

function buildChapter6_Love(data) {
    const name = data.name || '고객';
    const iljuKey = (data.dayStem||'') + (data.dayBranch||'');
    const dbEntry = getIljuDbEntry(data, iljuKey);
    const loveText = dbEntry.love || voicePolishParagraph(data, nmUi(name) + ' 템포를 묵묵히 맞춰 주고 지지해 줄 수 있는 안정적인 인연이 닿습니다.');
    const sipseong = data.sipseong || {};
    const gwanC = (sipseong['정관']||0) + (sipseong['편관']||0);
    const inC = (sipseong['정인']||0) + (sipseong['편인']||0);
    const jaeC = (sipseong['정재']||0) + (sipseong['편재']||0);
    const sikC = (sipseong['식신']||0) + (sipseong['상관']||0);
    const sipTotal = Math.max(Object.values(sipseong).reduce((a,b)=>a+b,0), 1);
    const ds = data.dayStem || '丙';
    const STEM_OH_LV = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    const dayOh = STEM_OH_LV[ds] || 'fire';
    const isStrong = data.strengthText && (data.strengthText.includes('신강') || data.strengthText.includes('강'));

    const loveStyle = gwanC / sipTotal > 0.2
        ? '책임감과 약속, 끌고 가는 힘이 사랑에서도 그대로 드러나세요. 든든하다는 강점이 있지만, 상대 쪽에서는 “내가 너무 끌려가고 있다”거나 통제받는 느낌이 들 수도 있어요. “내가 옳다”라는 말은 그 자리에서 바로 꺼내지 마시고, **하루만 미뤘다가** 다음 날 다시 꺼내 보십시오.'
        : inC / sipTotal > 0.2
        ? '상대를 배려하고 지지해 주는 힘이 두꺼우셔요. 주는 쪽으로 익숙하셔서, 자기도 모르게 헌신이 집착으로 바뀌기 쉽습니다. **“오늘은 나를 챙기는 시간”을 한 시간만이라도** 달력에 미리 박아 두십시오. 그게 결국 관계도 살립니다.'
        : '혼자 있는 시간을 충분히 보장받을 때 가장 자연스러우신 분이세요. 사랑에서도 너무 가까이 붙어 있는 관계보다, **각자의 자리와 자유**가 보장될 때 마음이 편해지십니다. 그러니 상대에게도 같은 만큼의 거리와 자유를 허용해 주세요.';

    const meetTiming = nmUi(name) + ' 인연은 운이 열릴 때만 오는 것이 아닙니다. **지인 소개·취미 모임·직무가 맞는 소규모 모임**에 나가는 패턴이 열려 있어야 만남이 이어집니다. 기운이 맞는 해·달에는 **한 달에 새로운 자리 하나**만 추가하고, 나머지는 기존 관계에 시간을 쓰십시오.';

    // ── 일간별 사랑의 언어 ──
    const LOVE_LANGUAGE = {
        wood: { core:'함께 성장한다는 감각', sign:'서로의 꿈을 응원하는 대화', danger:'상대가 나를 가둘 때 가장 빠르게 식습니다', repair:'미래 계획을 공유하는 자리를 한 달에 한 번 고정' },
        fire: { core:'표현된 애정과 인정', sign:'이름을 불러주고, 눈을 맞춰 주는 사소한 순간', danger:'침묵·무관심·차분한 거리감을 거절로 읽기 쉽습니다', repair:'하루 한 번 “좋다·고맙다”를 말로 남기는 약속' },
        earth: { core:'한결같은 일상의 안정감', sign:'약속을 지키는 행동, 같은 자리에 있어 주는 것', danger:'갑작스러운 변화·즉흥 약속 변경에 마음이 닫힙니다', repair:'주말 루틴 하나를 함께 만들어 두기 (산책·식사·드라마)' },
        metal: { core:'존중과 정확한 거리', sign:'경계를 지켜주고, 약속한 것을 정확히 이행하는 태도', danger:'무책임·말 바꾸기·과한 친밀 요구에 빠르게 식습니다', repair:'중요한 약속은 메시지로 남겨 양쪽이 같은 글을 보도록' },
        water: { core:'깊이 있는 대화와 비밀의 공유', sign:'얕은 잡담보다 마음의 결을 묻는 한 마디', danger:'표면적 관계·다수의 관심이 분산될 때 외로움을 크게 느낍니다', repair:'일주일에 한 번, 둘만의 긴 대화 시간을 따로 비워 두기' }
    };
    const ll = LOVE_LANGUAGE[dayOh];

    // ── 일간×십성 비중에 따른 관계 패턴 ──
    let attractionPattern;
    if (jaeC / sipTotal >= 0.25) {
        attractionPattern = nmUi(name) + ' 사주에는 재성(財)이 두껍게 박혀 있습니다. 사랑에서도 **현실 감각이 또렷한** 사람에게 마음이 갑니다. 단, 좋아하는 마음을 바로 표현하기보다 “챙겨 주는 행동”으로 드러내는 편이라, 상대 쪽에서는 가끔 “정말 좋아하는 게 맞나” 헷갈려 합니다. 말과 행동의 무게를 한 번씩 일부러 맞춰 주는 연습이 필요합니다.';
    } else if (gwanC / sipTotal >= 0.25) {
        attractionPattern = nmUi(name) + ' 사주에는 관성(官)이 두껍게 자리 잡고 있습니다. 사랑에서도 **틀과 약속**을 먼저 봅니다. 신뢰가 가는 사람이면 천천히, 그러나 한 번 마음이 가면 깊습니다. 다만 책임감이 강한 만큼 **상대를 무겁게 만들 수 있는 톤**이 있으니, “내가 옳다”는 말은 한 박자 늦추는 편이 좋습니다.';
    } else if (inC / sipTotal >= 0.25) {
        attractionPattern = nmUi(name) + ' 사주에는 인성(印)이 깊이 자리합니다. 사랑에서 **돌봄과 지지**가 자연스럽게 흘러나오는 분입니다. 그래서 좋은 점은 상대가 이 곁에서 안전함을 느낀다는 것이고, 조심할 점은 “내가 더 챙겨야 한다”는 자각이 강해 **본인의 감정을 뒷자리로 미루는 패턴**이 반복된다는 점입니다.';
    } else if (sikC / sipTotal >= 0.25) {
        attractionPattern = nmUi(name) + ' 사주에는 식상(食傷)이 활짝 펼쳐져 있습니다. 사랑에서 **표현·창의·즐거움의 비중**이 큽니다. 데이트 자체가 콘텐츠가 되는 분위기이고, 같은 일상도 새롭게 해석하는 능력이 있습니다. 다만 자극이 줄어든 평탄한 시기에 “재미가 식었다”고 빨리 결론 내리지 않으셔야 합니다.';
    } else {
        attractionPattern = nmUi(name) + ' 사주는 한쪽으로 치우치지 않은 균형형입니다. 사랑에서도 **상황별로 색깔이 달라지는 다면적인** 분입니다. 좋은 점은 다양한 사람과 호흡을 맞출 수 있다는 것이고, 어려운 점은 “나는 어떤 사랑을 원하는가”를 자기 스스로 또렷이 정리하는 데 시간이 걸린다는 것입니다.';
    }

    // ── 다툼·소통 가이드 (강약별) ──
    const conflictGuide = isStrong
        ? '다툼이 시작되면 ' + nmEunNeun(name) + ' 본능적으로 **결론을 빨리 내려는** 쪽으로 기울입니다. 그 속도가 본인은 명료해 좋지만, 상대에게는 **자기 감정이 인정받지 못한 채 정리당했다**는 인상을 남길 수 있습니다. 결론보다 먼저 “지금 어떤 마음이세요?”라고 한 번만 물어 주십시오. 한 박자만 늦춰도 같은 결론이 훨씬 부드럽게 안착합니다.'
        : nmEunNeun(name) + ' 다툼 앞에서 **속으로 삼키고 정리하시는** 결에 가깝습니다. 그 자리에서는 평화로워 보이지만, 같은 패턴이 쌓이면 어느 날 갑자기 차갑게 거리를 두는 모습으로 드러납니다. 한 번에 두꺼운 말을 꺼내기 어렵다면, **메시지로 한 줄씩** 남겨두는 방법도 좋습니다. “지금 좀 힘들었어”라는 한 문장이 관계를 살립니다.';

    var chHead6 = buildChapterHeadTopicFirst('애정 · 인연', SAJUX_SECTION_LABELS.love, '');
    var chIntro6 = buildChapterIntroHtml(data, 'love');
    return `<div class="report-chapter">
        ${chHead6}
        ${chIntro6}
        ${buildDomainSummaryTable({
            data,
            boxTitle: nmEulReul(name) + ' 위한 애정 전략',
            keyword:'만남의 리듬 · 소개 경로 · 관계 경계',
            route:'취미·직무가 맞는 모임을 고르고, 첫 만남은 가벼운 대화로 확인한 뒤 대면으로 넘기십시오',
            caution:'감정 최고점·투자·지분 이야기가 겹친 날의 관계 결정은 유예하십시오'
        })}

        <p class="ch-text">${voicePolishParagraph(data, '먼저 ' + nmUi(name) + ' 사랑이 어떤 결로 흐르는지 큰 그림부터 살펴보겠습니다. 그 다음 일지(배우자궁), 사랑의 언어, 다툼이 일어났을 때의 호흡 순서로 차근차근 풀어 드릴게요.')}</p>

        <p class="ch-text">${voicePolishReportHtml(data, '애정은 횟수가 아니라 **리듬**입니다. 만난 지 얼마 안 됐거나 다툰 직후처럼 **감정이 가장 높은 날**에는, 동거·결혼 준비 서류·**큰 돈이 오가는 차용 증서**·부동산·맞벌·지분처럼 **나중에 되돌리기 어려운 약속**은 날짜를 미루십시오. 여기서 말하는 것은 **법적으로·돈으로 묶이는 서명**이며, 단순 앱 결제나 일상적인 이름 적기와는 다릅니다.')}</p>
        <p class="ch-text">이성운의 핵은 “누구를 만나느냐”가 아니라 **나는 어떤 패턴으로 만남과 이별을 반복하느냐**입니다. 패턴을 알면 같은 상처를 반값에 삽니다.</p>

        <div style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:16px 18px;border-radius:0 8px 8px 0;margin:20px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:0.10em;">일지 배우자궁 분석</div>
            <p style="font-size:14.5px;color:#ddd;line-height:1.95;margin:0;">${boldStarsToStrong(loveText)}</p>
        </div>

        <p class="ch-text" style="margin-top:14px;">${voicePolishParagraph(data, '여기까지가 ' + nmUi(name) + ' 사랑의 큰 결입니다. 이제 한 발 더 들어가서, 일상에서 어떤 표현이 ' + nmKke(name) + ' 진짜 사랑으로 닿는지 — 즉 ' + nmUi(name) + ' "사랑의 언어"를 살펴보겠습니다.')}</p>

        <div class="love-language-block sajux-print-surface" style="margin:18px 0;padding:20px 22px;border-radius:14px;background:linear-gradient(135deg,rgba(214,135,135,0.08),rgba(255,255,255,0.02));border:1px solid rgba(214,135,135,0.22);">
            <div style="font-size:11px;color:#e29a9a;letter-spacing:0.10em;margin-bottom:12px;font-weight:700;">${nmUi(name)} 사랑의 언어</div>
            <p style="font-size:13.5px;color:#e8d8d8;line-height:1.95;margin:0 0 12px;"><strong style="color:#f3c4c4;">핵심 신호 ▸</strong> ${ll.core}. 일상에서 ${ll.sign}이 닿을 때 ${nmEunNeun(name)} 가장 깊이 사랑받는다고 느낍니다.</p>
            <p style="font-size:13px;color:#d8c8c8;line-height:1.95;margin:0 0 10px;"><strong style="color:#f3c4c4;">반대로 가장 식는 순간 ▸</strong> ${ll.danger}.</p>
            <p style="font-size:13px;color:#d8c8c8;line-height:1.95;margin:0;"><strong style="color:#f3c4c4;">관계를 회복하는 작은 약속 ▸</strong> ${ll.repair}.</p>
        </div>

        <p class="ch-text" style="margin-top:14px;">${voicePolishParagraph(data, '사랑의 언어를 알았으니, 이제 ' + nmIGa(name) + ' 어떤 사람에게 끌리고 어떤 방식으로 그 마음을 표현하는지 — 끌림의 패턴을 들여다봅니다.')}</p>

        <p class="ch-text">${attractionPattern}</p>

        <p class="ch-text">${loveStyle}</p>
        <p class="ch-text">${meetTiming}</p>

        <p class="ch-text" style="margin-top:18px;">${voicePolishParagraph(data, '관계가 잘 흐를 때의 모습을 살폈습니다. 그런데 어떤 관계든 부딪히는 순간이 옵니다. 그 순간 ' + nmIGa(name) + ' 어떻게 호흡하시면 좋은지, 사주의 결을 따라 정리해 드립니다.')}</p>

        <div class="love-conflict-block sajux-print-surface" style="margin:14px 0 18px;padding:18px 20px;border-radius:12px;background:rgba(255,170,120,0.06);border:1px solid rgba(255,170,120,0.20);">
            <div style="font-size:11px;color:#ffc7a0;letter-spacing:0.10em;margin-bottom:10px;font-weight:700;">다툼이 일어났을 때의 호흡</div>
            <p style="font-size:13.5px;color:#eedfd0;line-height:1.95;margin:0;">${boldStarsToStrong(conflictGuide)}</p>
        </div>
        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:18px;margin-top:16px;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">인연 활성화 전략</div>
            <p style="font-size:13.5px;color:#bbb;line-height:1.9;margin:0;">완벽한 사람보다 <strong>내가 부족한 자리를 자연스럽게 채워 주는 사람</strong>이 오래 가는 경우가 많아요. 새 인연은 큰 모임보다 <strong>취향이 같은 소규모 모임·직무 모임</strong>에서 더 잘 열립니다. 사주의 일지 글자와 어울리는 글자가 들어오는 시기에는 관계 진도가 빠르게 붙어요. 머리로 그린 이상형만 쫓지 마시고, 마음이 가는 사람이 누구인지 한 번 더 살펴보십시오.</p>
        </div>

        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:20px 0;">
            <div style="font-size:12px;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; 연애·결혼 — 한 발 더 들어가 보기</div>
            <div style="display:flex;flex-direction:column;gap:12px;">
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">
                    <div style="font-size:12px;font-weight:700;color:#ddd;margin-bottom:6px;">연애 패턴이 반복되는 이유</div>
                    <p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">일지(태어난 날의 아래 글자)에는 ${nmIGa(name)} 반복해서 끌리시는 사람의 모습이 적혀 있어요. 끌림은 머리로 정해지는 게 아니라, <strong>결이 비슷한 사람끼리 자연스럽게 끌어당기는 힘</strong>이에요. 그래서 과거 연애를 세 번만 떠올려 보셔도 비슷한 사람이 보입니다.</p>
                </div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">
                    <div style="font-size:12px;font-weight:700;color:#ddd;margin-bottom:6px;">머리로 그리는 이상형 ≠ 실제로 끌리는 사람</div>
                    <p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">머리로 그리신 이상형(“이런 조건의 사람이 좋겠다”)과 실제로 마음이 가는 사람이 다를 수 있어요. <strong>이미 마음이 가는 사람</strong>이 사실은 ${nmKke(name)} 진짜 답인 경우가 많습니다. “머리가 원하는 사람”과 “마음이 가는 사람”을 한 번 표로 나눠 적어 보시면 차이가 또렷이 보입니다.</p>
                </div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">
                    <div style="font-size:12px;font-weight:700;color:#ddd;margin-bottom:6px;">결혼이 자연스러워지는 시기</div>
                    <p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">${nmUi(name)} 일지와 어울리는 글자가 들어오는 시기(대운·세운에 합이 되는 해)에는 관계를 정식으로 매듭짓기가 한결 쉬워져요. 억지로 밀어붙이지 마시고, 흐름이 트인 해에 결정을 맞추시는 게 결혼 운을 가장 자연스럽게 살리는 방법입니다.</p>
                </div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">
                    <div style="font-size:12px;font-weight:700;color:#ddd;margin-bottom:6px;">오래 가는 배우자의 조건</div>
                    <p style="font-size:12.5px;color:#bbb;line-height:1.8;margin:0;">${nmUi(name)} 부족한 자리를 자연스럽게 채워 주는 사람이 배우자로는 가장 오래 갑니다. 다만 오행 궁합만 보시면 안 되고, <strong>약속을 지키는 사람인가</strong>를 같이 보십시오. 사주가 잘 맞아도 약속이 흔들리는 사람과는 관계가 오래 가지 않습니다.</p>
                </div>
            </div>
        </div>

        <div style="background:rgba(199,167,106,0.05);border-radius:12px;padding:20px;margin:16px 0;border:1px solid rgba(199,167,106,0.1);">
            <div style="font-size:12px;color:var(--gold);margin-bottom:12px;letter-spacing:1px;">&#9670; 인연 활성화 & 관계 개선 전략</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div style="font-size:12px;color:#bbb;line-height:1.8;"><b style="color:#ddd;">&#10003; 순풍 시기 활동 확대</b><br>맞는 기운의 대운·세운에는 **지인에게 소개를 부탁**하거나 **취미 모임에 한 번** 나가 보십시오. 첫 만남은 짧은 카페 대화로 충분합니다.</div>
                <div style="font-size:12px;color:#bbb;line-height:1.8;"><b style="color:#ddd;">&#10003; 일지 합 시기 포착</b><br>일지와 합이 되는 지지의 달에는 **독서회·운동 모임·직무 소모임**에 한 번만 참여해 보십시오.</div>
                <div style="font-size:12px;color:#bbb;line-height:1.8;"><b style="color:#ddd;">&#10003; 한 번 더 보셔야 할 만남</b><br>나와 성향이 완전히 반대인 사람 — 처음엔 강하게 끌리지만, <strong>오래 가긴 어려운 조합</strong>인 경우가 많아요. 만난 지 한 달 안에 결정을 내리지 마시고 계절이 한 번 바뀐 뒤에 다시 보십시오.</div>
                <div style="font-size:12px;color:#bbb;line-height:1.8;"><b style="color:#ddd;">&#10003; 역풍 시기 감정 관리</b><br>부딪히는 기운이 강한 시기에는 감정적 결정을 미루고 관계 안정에 집중하십시오.</div>
            </div>
        </div>
        <p class="ch-text" style="margin-top:16px;">사랑에는 정답이 없어요. <strong>누가 더 옳은가</strong>를 따지기보다, <strong>약속을 어느 만큼 잘 지키는가, 대화가 어느 속도로 오가는가</strong>를 먼저 맞춰 보십시오. 그게 ${nmUi(name)} 관계가 단단해지는 가장 빠른 길입니다.</p>
    </div>`;
}

function buildChapter7_Hidden(data) {
    const pillars = data.pillars || [];
    const dayStem = data.dayStem || "";
    const dayBranch = data.dayBranch || "";
    const HIDDEN = {"子":["壬","癸"],"丑":["己","癸","辛"],"寅":["甲","丙","戊"],"卯":["甲","乙"],"辰":["戊","乙","癸"],"巳":["丙","庚","戊"],"午":["丙","己","丁"],"未":["己","丁","乙"],"申":["庚","壬","戊"],"酉":["庚","辛"],"戌":["戊","辛","丁"],"亥":["壬","甲"]};
    const BKR = {"子":"자","丑":"축","寅":"인","卯":"묘","辰":"진","巳":"사","午":"오","未":"미","申":"신","酉":"유","戌":"술","亥":"해"};
    const SKR = {"甲":"갑목","乙":"을목","丙":"병화","丁":"정화","戊":"무토","己":"기토","庚":"경금","辛":"신금","壬":"임수","癸":"계수"};
    const HDM = {
        "子":"자(子) 안에는 임·계가 숨어 깊은 수(水)와 지략이 잠듭니다. 고요할수록 판이 선명해집니다. **큰 결정은 밤이 아니라 아침**에만 하십시오.",
        "丑":"축(丑) 안에는 기·계·신이 겹쳐 인내·지혜·정밀을 함께 품습니다. 겉은 느려도 안쪽 축적이 큽니다. **터지기 전 6개월마다 한 번 비우는 날**을 달력에 박으십시오.",
        "寅":"인(寅) 안에는 갑·병·무로 개척·열정·땅받침이 한데 있습니다. 출발 에너지가 강합니다. **새 판은 연세 개 이하**로만 잡으십시오.",
        "卯":"묘(卯) 안에는 갑·을로 목이 두 겹 — 관계·성장 본능이 짙습니다. 인맥이 곧 속도입니다. **말보다 약속 빈도**를 먼저 맞추십시오.",
        "辰":"진(辰) 안에는 무·을·계로 안정 속 변주와 지혜가 섞입니다. 방향이 갈리는 해가 옵니다. **이사·이직은 분기 하나씩**만 고르십시오.",
        "巳":"사(巳) 안에는 병·경·무로 열정·결단·땅이 같이 있습니다. 허물 벗듯 바뀌는 시기가 옵니다. **큰 변신 2주 전엔 계약 휴지기**로 두십시오.",
        "午":"오(午) 안에는 병·기·정으로 태양형 성취욕과 정열이 겹칩니다. 인정 욕구가 큽니다. **과시는 주 1회 이하**, 체력을 먼저 지키십시오.",
        "未":"미(未) 안에는 기·정·을로 감성·예술성이 깊습니다. 사람 마음을 움직이는 힘이 있습니다. **저녁에 감정으로 내린 결정은 24시간 유예**하십시오.",
        "申":"신(申) 안에는 경·임·무로 판단·지혜·실행이 빠릅니다. 머뭇거림이 적습니다. **속도 내기 전 손실 한도 한 줄**을 먼저 적으십시오.",
        "酉":"유(酉) 안에는 경·신으로 금이 순수합니다. 완성·정밀 본능이 강합니다. **80%에서 한 박자 쉬고** 마무리하십시오.",
        "戌":"술(戌) 안에는 무·신·정으로 신뢰·날카로움·열정이 뭉칩니다. 끝까지 가는 성향이 있습니다. **버릴 것부터 정리한 뒤** 새 약속을 잡으십시오.",
        "亥":"해(亥) 안에는 임·갑으로 깊은 수와 새싹이 같이 있습니다. 준비 끝에 도약이 붙습니다. **조용한 시즌엔 학습·장부만** 쌓으십시오."
    };
    const dayHidden = HIDDEN[dayBranch] || [];
    const dayHiddenText = dayHidden.length > 0 ? dayHidden.map(s => SKR[s]||s).join(", ") : "지장간 정보 없음";
    const cards = pillars.map((p) => {
        const ji = typeof p.h === "string" ? p.h[1] : (p.h ? p.h[1] : "");
        const hidden = HIDDEN[ji] || [];
        if(!ji || hidden.length === 0) return "";
        const hiddenKr = hidden.map(s => SKR[s]||s).join(" · ");
        const meaning = HDM[ji] || "";
        return `<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:18px;margin-bottom:14px;break-inside:avoid;">`
            + `<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:8px;">`
            + `<div><span style="font-size:11px;color:var(--gold);letter-spacing:1px;">${p.n} — ${BKR[ji]||ji}(${ji})</span>`
            + `<div style="font-size:17px;font-weight:700;color:#ddd;margin-top:4px;">숨겨진 천간: ${hiddenKr}</div></div>`
            + `<span style="font-size:12px;color:#888;">지장간 ${hidden.length}개</span></div>`
            + `<p style="font-size:13.5px;color:#ddd;line-height:1.9;margin:0 0 14px;">${meaning}</p>`
            + `<p style="font-size:12.8px;color:#aaa;line-height:1.88;margin:0;">지장간이 깨는 해·월에는 “평소와 다른 나”가 뜹니다. 돈은 **서면·지분·정산 조항** 없이 손대지 마십시오. 관계는 **감정이 올라온 날 큰 결정을 하루** 미루십시오.</p>`
            + `</div>`;
    }).filter(Boolean).join("");
    var chHead7 = buildChapterHeadTopicFirst('지장간 · 내면', SAJUX_SECTION_LABELS.hidden, '');
    var chIntro7 = buildChapterIntroHtml(data, 'hidden');
    return `<div class="report-chapter chapter-start">`
        + chHead7
        + chIntro7
        + `<p class="ch-text">지장간은 겉으로 안 보이는 **습관의 뿌리**입니다. 설명하기 어려운 끌림은 여기서 옵니다.</p>`
        + `<p class="ch-text">잠들어 있다가 **같은 오행의 대운·세운**, 위기, 특정 인물 만남에 깨어납니다. 언제 “평소와 다른 나”가 나올지 미리 짚으십시오.</p>`
        + `<div style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:16px 20px;border-radius:0 10px 10px 0;margin:20px 0;">`
        + `<div style="font-size:11px;color:var(--gold);margin-bottom:8px;letter-spacing:1px;">일지(日支) 지장간 — 내면의 핵심</div>`
        + `<p style="font-size:15px;color:#ddd;line-height:1.9;margin:0;">일지 <b style="color:var(--gold);">${BKR[dayBranch]||dayBranch}(${dayBranch})</b> 안에 <b style="color:var(--gold);">${dayHiddenText}</b>가 숨어 있으며, 이것은 무의식에서 움직이는 **동기의 원천**입니다. 알면 방어가 선명해집니다.</p>`
        + `</div>`
        + `<h4 style="color:var(--gold);font-size:16px;margin:24px 0 16px;border-bottom:1px solid rgba(199,167,106,0.3);padding-bottom:8px;">4주 지장간 완전 해부</h4>`
        + (cards || `<p style="color:#999;">지장간 데이터를 계산 중입니다.</p>`)
        + `<div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">`
        + `<div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; 12지지별 지장간 완전 해설</div>`
        + `<p style="font-size:13px;color:#ccc;line-height:1.9;margin:0 0 14px;">지장간은 겉의 뜻을 넘긴 **복합 에너지**입니다. 대운·세운에 같은 지지가 올 때 순서대로 깨어납니다.</p>`
        + `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#64b5f6;font-weight:700;margin-bottom:4px;">子(자) — 壬癸</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">순수 수기운 집결. 지혜·지략·깊은 감수성이 잠든 곳. 분석력과 전략적 통찰이 폭발합니다. 이 지장간이 발동하면 예상을 뛰어넘는 지적 능력이 드러납니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:4px;">丑(축) — 己癸辛</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">토·수·금 복합. 인내·저력·정밀한 판단력 내재. 겉은 느려보이나 내면엔 엄청난 에너지가 축적되어 있습니다. 발동 시 놀라운 지구력을 발휘합니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#4fc3a1;font-weight:700;margin-bottom:4px;">寅(인) — 甲丙戊</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">목·화·토 복합. 강인한 도전 정신·열정·리더십 내재. 발동하면 강렬한 추진력으로 새로운 시대를 열어젖힙니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#4fc3a1;font-weight:700;margin-bottom:4px;">卯(묘) — 甲乙</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">순수 목기운. 섬세한 감성·관계 맺는 능력·성장 본능. 인간관계와 창의적 표현에서 탁월한 재능이 발현됩니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:4px;">辰(진) — 乙戊癸</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">목·토·수 복합. 변화·혁신·예측불가 잠재력 응집. 발동하면 예상치 못한 방향으로 운명이 전환됩니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ff7043;font-weight:700;margin-bottom:4px;">巳(사) — 丙庚戊</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">화·금·토 복합. 집중적 통찰·결단·변신 에너지. 냉철한 판단으로 인생의 방향을 완전히 바꾸는 결단을 내립니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ff7043;font-weight:700;margin-bottom:4px;">午(오) — 丙己丁</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">화·토·화 복합. 강렬한 열정·성취욕·빛나고 싶은 본능. 발동하면 주목받는 위치로 급격히 부상합니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:4px;">未(미) — 己乙丁</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">토·목·화 복합. 따뜻한 감수성·예술적 재능·배려심. 인간관계와 창작 분야에서 예상을 초월하는 능력이 발현됩니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#b0bec5;font-weight:700;margin-bottom:4px;">申(신) — 庚壬戊</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">금·수·토 복합. 날카로운 분석력·변화 추진력·실행력. 신속한 결단으로 기회를 낚아채는 탁월한 능력.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#b0bec5;font-weight:700;margin-bottom:4px;">酉(유) — 庚辛</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">순수 금기운. 완벽주의·정밀한 심미안·보석 같은 재능. 최고의 완성도로 세상의 인정을 받는 작업을 완성합니다.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#ffca28;font-weight:700;margin-bottom:4px;">戌(술) — 戊辛丁</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">토·금·화 복합. 깊은 통찰·끝까지 파고드는 탐구심·강인한 의지. 겉은 평온해 보이지만 내면에서 거대한 변환 진행.</p></div>`
        + `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:10px;"><div style="font-size:11px;color:#64b5f6;font-weight:700;margin-bottom:4px;">亥(해) — 壬甲</div><p style="font-size:11.5px;color:#bbb;line-height:1.75;margin:0;">수·목 복합. 방대한 지식욕·새로운 시작 갈망·자유로운 정신. 발동하면 지혜와 창조력이 동시에 폭발하며 새 방향으로 나아갑니다.</p></div>`
        + `</div>`
        + `</div>`
        + `<div style="background:rgba(199,167,106,0.06);border-radius:8px;padding:16px;border-left:3px solid var(--gold);margin:16px 0;">`
        + `<div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:10px;">지장간과 일간의 관계 — 십성으로 읽는 숨겨진 욕망</div>`
        + `<p style="font-size:13px;color:#ccc;line-height:1.88;margin:0 0 10px;">지장간이 일간과 맺는 관계는 **십성(十星)**으로 읽습니다. 각 숨은 천간마다 비견·겁재·식신·상관·편재·정재·편관·정관·편인·정인 중 하나가 붙습니다.</p>`
        + `<p style="font-size:13px;color:#ccc;line-height:1.88;margin:0;">채워지지 않을 때 불안이 커집니다. 발동 시기를 달력에 표시해 두면 **갈등이 오기 전에 통로**를 만들 수 있습니다.</p>`
        + `</div>`
        + `<div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:18px;margin:16px 0;"><div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:10px;">&#9670; 지장간과 이중 자아</div><p style="font-size:13px;color:#ccc;line-height:1.88;margin:0 0 10px;">천간은 겉의 역할, 지장간은 안의 역할입니다. 둘이 멀수록 **내적 마찰**이 큽니다. 억압보다 **안전한 출구**(운동·기록·소수 만남)를 하나 고정하십시오.</p><p style="font-size:13px;color:#ccc;line-height:1.88;margin:0;">겹침을 결함이 아니라 **다층 능력**으로 읽으십시오. 둘이 맞물릴 때 가장 강합니다.</p></div>`
        + `<p class="ch-text" style="margin-top:20px;">대운·세운에서 같은 기운이 들어오면 지장간이 깨어납니다. **여기(餘氣)·중기(中氣)·정기(正氣)** 순으로 흐름이 열립니다. **발동 전후 2주**는 회의·지출·관계 결정을 가볍게 유지하고, 달력에만 옮겨 적으십시오.</p>`
        + `</div>`;
}

function buildChapter8_Health(data) {
    const name = data.name || '고객';
    let maxWuxing = 'earth';
    if(data.wuxing && Object.keys(data.wuxing).length > 0) {
        maxWuxing = Object.keys(data.wuxing).reduce((a,b) => data.wuxing[a] > data.wuxing[b] ? a : b);
    }
    const ohKr = {wood:'목',fire:'화',earth:'토',metal:'금',water:'수'}[maxWuxing] || '토';
    const organ = {wood:'간·담낭·신경계',fire:'심장·심혈관·소장',earth:'비장·위장·소화기',metal:'폐·대장·호흡기',water:'신장·방광·호르몬'}[maxWuxing] || '위장·소화기';
    const emotion = {wood:'분노와 억울함',fire:'과도한 흥분과 불안',earth:'지나친 걱정과 생각',metal:'슬픔과 우울감',water:'두려움과 공포'}[maxWuxing] || '스트레스';
    const season = {wood:'봄(3~5월), 인·묘월',fire:'여름(6~8월), 사·오월',earth:'환절기, 진·술·축·미월',metal:'가을(9~11월), 신·유월',water:'겨울(12~2월), 해·자월'}[maxWuxing] || '환절기';
    // ── 피로의 모양 (오행별 신호) ──
    const FATIGUE_SIGNATURE = {
        wood: nmEunNeun(name) + ' 피로가 쌓이면 가장 먼저 **눈의 떨림·뒷목 뻐근함·짜증**으로 신호가 옵니다. 평소엔 안 거슬렸던 작은 소음이 유독 거슬리거나, 운전 중 욱하는 빈도가 늘어난다면 간·담낭이 “쉬자”라고 말하는 중입니다.',
        fire: nmEunNeun(name) + ' 피로가 쌓이면 **두근거림·잠 들기 어려움·말이 빨라지는** 신호가 먼저 옵니다. 누워도 머릿속이 환하게 돌아가거나, 손바닥에 땀이 자주 차면 심장 쪽이 한 박자 쉬어달라는 신호입니다.',
        earth: nmEunNeun(name) + ' 피로가 쌓이면 **속 더부룩함·식욕 변화·생각이 빙글빙글 도는** 신호가 먼저 옵니다. 같은 걱정이 머릿속에서 답을 못 찾고 반복된다면 비위가 “결정 좀 내려달라”라고 말하는 중입니다.',
        metal: nmEunNeun(name) + ' 피로가 쌓이면 **마른기침·코·피부·이유 없는 슬픔**으로 신호가 옵니다. 이유 없이 눈물이 가까이 차오르거나, 호흡이 얕아지면 폐가 “감정을 한 번 비워달라”라고 말하는 중입니다.',
        water: nmEunNeun(name) + ' 피로가 쌓이면 **허리·발목 시림·새벽 잦은 깸·근거 없는 두려움**으로 신호가 옵니다. 평소엔 무덤덤했던 일에 까닭 없이 겁이 나면 신장이 “충전이 필요하다”라고 말하는 중입니다.'
    }[maxWuxing];
    // ── 컨디션 시간대 (오행별 약한 시각) ──
    const TIME_RHYTHM = {
        wood: '간·담낭은 **밤 11시~새벽 3시**(자시·축시)에 회복합니다. 이 시간대에 깨어 있는 시간이 많으면 다음 날 짜증·집중력 저하가 두 배로 옵니다. 11시 이전 잠자리는 가장 비싼 약입니다.',
        fire: '심장은 **낮 11시~오후 1시**(오시)에 가장 활발합니다. 이 시간대에 카페인·자극성 회의가 겹치면 밤에 잠이 도망갑니다. 점심 전후 30분의 차분한 휴식이 야간 수면을 살립니다.',
        earth: '비위는 **오전 7시~9시**(진시)·오후 1시~3시(미시)에 가장 잘 움직입니다. 이 시간대 식사를 거르면 컨디션이 길게 빠집니다. 시간만 고정해도 위가 살아납니다.',
        metal: '폐·대장은 **새벽 3시~7시**(인시·묘시)에 정리됩니다. 이 시간대 수면이 얕으면 면역이 가장 먼저 깎입니다. 새벽 깸이 잦다면 폐 쪽 신호로 보십시오.',
        water: '신장은 **오후 5시~7시**(유시·술시)에 회복 단계로 들어갑니다. 이 시간대 격렬한 운동·과음은 신장에 두 배로 부담입니다. 저녁 시간을 완만하게 내려놓으십시오.'
    }[maxWuxing];
    // ── 음주·카페인·디지털 등 구체 습관 ──
    const HABIT_RX = {
        wood: { drink:'주 2회 이상 음주는 간이 회복할 시간을 빼앗습니다. **금주일을 달력에 박아두는** 방식이 가장 효과적입니다.', caffeine:'커피는 오전 11시 이전 한 잔까지. 그 이후의 카페인은 짜증과 수면 질을 같이 깎습니다.', screen:'야간에 화면을 오래 보면 간 쪽 피로가 빠르게 쌓입니다. 자기 1시간 전부터는 화면 밝기를 절반으로.' },
        fire: { drink:'음주는 짧은 위로지만 심장에는 두 배 부담입니다. **2주에 한 번**으로 간격을 늘리십시오.', caffeine:'에너지 드링크·다량의 커피는 두근거림을 키웁니다. 하루 한 잔, 오후엔 디카페인으로.', screen:'잠자기 직전 영상 시청은 흥분 상태로 잠드는 일과 같습니다. 침실에서는 화면을 빼는 편이 좋습니다.' },
        earth: { drink:'음주는 식사 리듬을 망가뜨립니다. **저녁 식사 후 음주**보다 식사 자체를 충분히 드시는 편이 회복이 빠릅니다.', caffeine:'공복 커피는 위 점막에 직접 부담이 갑니다. 반드시 식후 30분 이상 뒤에.', screen:'식사 중 화면 시청은 포만감 신호를 가립니다. 식사 시간만큼은 화면을 비우십시오.' },
        metal: { drink:'음주는 폐 쪽 회복을 늦춥니다. **운동 다음 날 음주**는 면역이 가장 깎이는 조합입니다.', caffeine:'카페인은 마른기침을 키울 수 있습니다. 따뜻한 차로 절반을 대체하십시오.', screen:'미세먼지 시즌엔 실내에 머무는 시간이 길어집니다. 환기·가습기·실내 식물은 약입니다.' },
        water: { drink:'음주는 신장이 가장 먼저 비명을 지르는 자리입니다. **늦은 시간 음주**는 다음 날의 부종·피곤으로 정확히 돌아옵니다.', caffeine:'카페인 과다는 수분을 빼앗아 신장 부담을 키웁니다. 한 잔 마실 때 물 한 잔을 같이.', screen:'늦은 밤 화면 시청은 신장 회복 시간을 깎습니다. 11시 이후 화면은 수면의 적입니다.' }
    }[maxWuxing];
    // ── 정신 건강 신호 ──
    const MIND_RX = {
        wood: '머리가 자주 **답답하고 숨이 짧아진다**면 분노가 누적된 신호입니다. 글로 한 줄 풀어 적거나, 격렬하지 않은 운동(빠르게 걷기·자전거)이 가장 효과적입니다.',
        fire: '**가만히 있어도 마음이 들끓는** 느낌이 자주 든다면 휴식 부족 신호입니다. 침묵의 시간 — 5분만이라도 화면 없이 앉아 있는 시간이 약입니다.',
        earth: '**같은 걱정이 답을 못 찾고 빙글빙글** 도는 시기가 길어지면 비위 쪽 회복이 필요합니다. 일을 한 가지씩 끝내고 지우는 “체크리스트 식 마무리”가 도움이 됩니다.',
        metal: '**이유 없이 눈물이 가깝고, 가슴이 무거운** 시기는 폐 쪽 신호입니다. 깊은 호흡 5분, 햇볕을 직접 받는 30분이 가장 빠른 회복법입니다.',
        water: '**근거 없는 두려움·미래에 대한 막연한 불안**이 길어지면 신장 쪽 신호입니다. 따뜻한 음식·따뜻한 물·일정한 수면 — 이 세 가지를 1주만 지켜도 풀립니다.'
    }[maxWuxing];
    const foodAdvice = {
        wood:'신맛·녹색 채소를 기본으로 깔고, **술은 주 단위로 끊을 날**을 먼저 정하십시오.',
        fire:'쓴맛은 아침 한 번. **오후 2시 이후 카페인 금지**를 달력에 박으십시오.',
        earth:'**식사 시각만** 고정해도 위가 살아납니다. 야식 줄을 그으십시오.',
        metal:'매운맛·흰 채소는 낮에. **미세먼지 경보일 외출**은 줄이십시오.',
        water:'물 2L·**취침 시각 고정**이 신장 쪽 비용을 줄입니다.'
    }[maxWuxing] || '균형 잡힌 식단을 유지하십시오.';
    const exerciseAdvice = {
        wood:'유산소·스트레칭을 **주 3회 같은 요일**에만 넣으십시오.',
        fire:'심박 안정이 먼저입니다. **격렬 운동은 주 1회**로 제한하십시오.',
        earth:'식후 **30분 걷기**만 고정해도 됩니다.',
        metal:'수영·유산소로 폐를 열고, **실내 공기**부터 바꾸십시오.',
        water:'무리한 근력보다 **수면이 회복**입니다. 철야를 끊으십시오.'
    }[maxWuxing] || '규칙적인 운동을 유지하십시오.';
    const checkupAdvice = {
        wood:'**간·담낭·갑상선** 패키지를 연 1회 달력에 고정하십시오.',
        fire:'**혈압·지질·심전도**를 분기마다 한 번은 확인하십시오.',
        earth:'**위·대장·혈당**은 신호 오면 바로 예약하십시오. 참지 마십시오.',
        metal:'**폐·비염·천식** 루틴을 미세먼지 시즌에 맞춰 잡으십시오.',
        water:'**신장·호르몬·방광** 검사를 수면 루틴과 같이 묶으십시오.'
    }[maxWuxing] || '**종합 검진**을 연 1회 이상 고정하십시오.';

    var chHead8 = buildChapterHeadTopicFirst('건강 · 회복', SAJUX_SECTION_LABELS.health, '');
    var chIntro8 = buildChapterIntroHtml(data, 'health');
    return `<div class="report-chapter">
        ${chHead8}
        ${chIntro8}
        ${buildDomainSummaryTable({
            data,
            boxTitle: nmEulReul(name) + ' 위한 건강 전략',
            keyword:'수면 리듬 · 검진 루틴 · 회복 탄력',
            route:'주간 운동 3회 + 분기 검진 선예약을 고정하십시오',
            caution:'과로·야간 음주·통증 방치를 절대 지속하지 마십시오'
        })}
        <p class="ch-text">${voicePolishParagraph(data, '건강은 몸만이 아니라 ' + nmUi(name) + ' 감정과 연결된 자리입니다. 먼저 ' + nmIGa(name) + ' 어떤 식으로 피로 신호를 받는지 — 이른바 "피로의 모양"부터 짚어 보겠습니다.')}</p>

        <div class="health-fatigue-block sajux-print-surface" style="margin:14px 0 18px;padding:18px 20px;border-radius:12px;background:rgba(255,170,170,0.05);border:1px solid rgba(255,170,170,0.18);">
            <div style="font-size:11px;color:#ff9f9f;letter-spacing:0.10em;margin-bottom:10px;font-weight:700;">${nmUi(name)} 피로의 모양</div>
            <p style="font-size:13.5px;color:#eed8d8;line-height:1.95;margin:0 0 10px;">${boldStarsToStrong(FATIGUE_SIGNATURE)}</p>
            <p style="font-size:13px;color:#ddc8c8;line-height:1.95;margin:0;">${boldStarsToStrong('이 신호가 이틀 이상 지속되면 일정을 줄이는 것이 가장 빠른 처방입니다.')}</p>
        </div>

        <p class="ch-text">${voicePolishParagraph(data, '신호를 알았다면, 이번엔 ' + nmUi(name) + ' 몸이 어느 시간대에 회복하고 어느 시간대에 무리하면 안 되는지 — 시간의 결을 정리해 드립니다.')}</p>

        <div class="health-time-block sajux-print-surface" style="margin:14px 0 18px;padding:18px 20px;border-radius:12px;background:rgba(170,200,255,0.05);border:1px solid rgba(170,200,255,0.18);">
            <div style="font-size:11px;color:#9bb8ee;letter-spacing:0.10em;margin-bottom:10px;font-weight:700;">${nmUi(name)} 컨디션 시간대</div>
            <p style="font-size:13.5px;color:#dee2eb;line-height:1.95;margin:0;">${boldStarsToStrong(TIME_RHYTHM)}</p>
        </div>

        <p class="ch-text">${voicePolishParagraph(data, '시간의 결을 짚었으니, 이제 일상에서 가장 영향이 큰 세 가지 — 음주·카페인·화면 — 을 어떻게 다루면 좋은지 ' + nmUi(name) + ' 사주에 맞춰 정리해 드리겠습니다.')}</p>

        <div class="health-habit-grid" style="display:grid;grid-template-columns:1fr;gap:10px;margin:14px 0 18px;">
            <div class="sajux-print-surface" style="padding:14px 16px;border-radius:10px;background:rgba(255,255,255,0.03);border-left:3px solid rgba(255,170,120,0.6);">
                <div style="font-size:11px;color:#ffc7a0;font-weight:700;letter-spacing:0.05em;margin-bottom:6px;">🍷 음주 가이드</div>
                <p style="font-size:13px;color:#ddd;line-height:1.9;margin:0;">${boldStarsToStrong(HABIT_RX.drink)}</p>
            </div>
            <div class="sajux-print-surface" style="padding:14px 16px;border-radius:10px;background:rgba(255,255,255,0.03);border-left:3px solid rgba(180,140,255,0.6);">
                <div style="font-size:11px;color:#c8a6ff;font-weight:700;letter-spacing:0.05em;margin-bottom:6px;">☕ 카페인 가이드</div>
                <p style="font-size:13px;color:#ddd;line-height:1.9;margin:0;">${boldStarsToStrong(HABIT_RX.caffeine)}</p>
            </div>
            <div class="sajux-print-surface" style="padding:14px 16px;border-radius:10px;background:rgba(255,255,255,0.03);border-left:3px solid rgba(140,200,180,0.6);">
                <div style="font-size:11px;color:#9ed3bb;font-weight:700;letter-spacing:0.05em;margin-bottom:6px;">📱 화면·환경 가이드</div>
                <p style="font-size:13px;color:#ddd;line-height:1.9;margin:0;">${boldStarsToStrong(HABIT_RX.screen)}</p>
            </div>
        </div>

        <p class="ch-text">${voicePolishParagraph(data, '몸의 신호를 살폈다면, 마음의 신호도 같은 무게로 살펴봐야 합니다. ' + nmUi(name) + ' 마음이 무너지기 직전에 보내는 신호와, 그 자리에서 가장 빠르게 회복하는 방법을 일러드립니다.')}</p>

        <div class="health-mind-block sajux-print-surface" style="margin:14px 0 18px;padding:18px 20px;border-radius:12px;background:rgba(199,167,106,0.06);border-left:3px solid var(--gold);">
            <div style="font-size:11px;color:var(--gold);letter-spacing:0.10em;margin-bottom:10px;font-weight:700;">정신 건강 신호와 회복</div>
            <p style="font-size:13.5px;color:#e8e0d2;line-height:1.95;margin:0;">${boldStarsToStrong(MIND_RX)}</p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0;">
            <div class="sajux-print-surface" style="background:rgba(231,76,60,0.07);border-radius:10px;padding:16px;">
                <div style="font-size:11px;color:rgba(255,120,120,0.8);margin-bottom:8px;letter-spacing:0.10em;">⚠ 평생 주요 취약 장기</div>
                <div style="font-size:17px;font-weight:700;color:#ff8a80;margin-bottom:6px;">${organ}</div>
                <div style="font-size:13px;color:var(--text-soft, #bbb);line-height:1.75;">${ohKr} 기운이 과해질 때 가장 먼저 타격을 받습니다.</div>
            </div>
            <div class="sajux-print-surface" style="background:rgba(255,165,0,0.07);border-radius:10px;padding:16px;">
                <div style="font-size:11px;color:rgba(255,200,100,0.8);margin-bottom:8px;letter-spacing:0.10em;">감정 → 신체 연결고리</div>
                <div style="font-size:17px;font-weight:700;color:#ffcc80;margin-bottom:6px;">${emotion}</div>
                <div style="font-size:13px;color:var(--text-soft, #bbb);line-height:1.75;">이 감정이 쌓일 때 해당 장기가 가장 먼저 반응합니다.</div>
            </div>
        </div>

        <p class="ch-text">${voicePolishParagraph(data, '원국에서 ' + ohKr + '이 두껍게 박힌 분이라, 특히 ' + season + ' 전후로 한 번씩 검진을 미리 당겨 두시는 편이 좋습니다. 기신이 들어오는 해·대운에는 면역이 가장 빠르게 얇아지니, 신호를 참는 것은 가장 비싼 절약입니다.')}</p>

        <div class="sajux-print-surface" style="background:rgba(255,255,255,0.04);border-radius:10px;padding:18px;margin:16px 0;">
            <div style="font-size:12px;color:var(--gold);margin-bottom:10px;letter-spacing:0.10em;">🥗 맞춤 식이 처방</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.95;margin:0;">${boldStarsToStrong(foodAdvice)}</p>
        </div>

        <div class="sajux-print-surface" style="background:rgba(255,255,255,0.04);border-radius:10px;padding:18px;margin-bottom:16px;">
            <div style="font-size:12px;color:var(--gold);margin-bottom:10px;letter-spacing:0.10em;">🏃 맞춤 운동 처방</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.95;margin:0;">${boldStarsToStrong(exerciseAdvice)}</p>
        </div>

        <div class="sajux-print-surface" style="background:rgba(231,76,60,0.06);border-radius:10px;padding:18px;">
            <div style="font-size:12px;color:rgba(255,120,120,0.8);margin-bottom:10px;letter-spacing:0.10em;">🏥 권장 정기 검진</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.95;margin:0;">${boldStarsToStrong(checkupAdvice)}</p>
        </div>

        <p class="ch-text" style="margin-top:16px;">${voicePolishParagraph(data, '연료로 몸을 태우지 마세요. 멈출 수 있는 사람이 긴 레이스에서 이깁니다.')}</p>

        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:20px 0;">
            <div style="font-size:12px;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; ${nmUi(name)}님의 취약 오행 — 한 발 더 들어가는 건강 가이드</div>
            <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:16px;border-left:3px solid rgba(231,76,60,0.5);">
                <div style="font-size:13px;font-weight:700;color:#ff8a80;margin-bottom:8px;">⚠ ${ohKr}(${maxWuxing}) 기운 과부하 — ${organ} 집중 관리</div>
                <p style="font-size:13px;color:#ddd;line-height:1.88;margin:0 0 10px;"><b>${ohKr}</b> 과다는 <b>${organ}</b>에 쌓입니다. 경보는 <b>${emotion}</b>입니다.</p>
                <p style="font-size:13px;color:#ddd;line-height:1.88;margin:0 0 10px;">**신호가 오면 하루 일정을 비우는 것**이 약보다 앞섭니다.</p>
                <p style="font-size:13px;color:#ddd;line-height:1.88;margin:0;"><b>${season}</b>에는 **검진·수면**을 먼저 잡으십시오.</p>
            </div>
        </div>

        <div style="background:rgba(199,167,106,0.05);border-radius:12px;padding:20px;margin:16px 0;border:1px solid rgba(199,167,106,0.1);">
            <div style="font-size:12px;color:var(--gold);margin-bottom:12px;letter-spacing:1px;">&#9670; 대운별 건강 주의사항 & 종합 건강 전략</div>
            <p style="font-size:13px;color:#bbb;line-height:1.85;margin:0 0 12px;">기신이 두꺼운 대운에는 **수면·검진**을 먼저 당깁니다. 용신 대운에는 **운동·식단**에만 돈과 시간을 쓰십시오.</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div style="font-size:12px;color:#bbb;line-height:1.8;"><b style="color:#ddd;">&#10003; 기신 대운 필수 수칙</b><br>수면 7시간 이상 · 알코올 절제 · 정기 검진 · 감정 관리</div>
                <div style="font-size:12px;color:#bbb;line-height:1.8;"><b style="color:#ddd;">&#10003; 용신 대운 건강 투자</b><br>운동 루틴 구축 · 식단 개선 · 의료 검진 최적화</div>
                <div style="font-size:12px;color:#bbb;line-height:1.8;"><b style="color:#ddd;">&#10003; 감정-신체 연결 관리</b><br>부정적 감정이 오래 쌓이면 취약 장기에 직접 영향을 줍니다. 감정 표현 채널을 마련하십시오.</div>
                <div style="font-size:12px;color:#bbb;line-height:1.8;"><b style="color:#ddd;">&#10003; 계절별 예방 검진</b><br>취약 오행의 계절에는 해당 장기 검진을 집중적으로 받으십시오.</div>
            </div>
        </div>

        ${(()=>{
            // ── 정신 건강 — 사주 결로 본 “미리 알아두실 가능성과 예방법” ──
            //   ※ 진단이 아니라 “쉽게 영향받을 수 있는 결”을 미리 짚는 가이드입니다.
            const sipseong = data.sipseong || {};
            const inC   = (sipseong['정인']||0)+(sipseong['편인']||0);
            const sikC  = (sipseong['식신']||0)+(sipseong['상관']||0);
            const gwanC = (sipseong['정관']||0)+(sipseong['편관']||0);
            const total = Math.max(Object.values(sipseong).reduce((a,b)=>a+b,0), 1);
            const inPct   = Math.round(inC/total*100);
            const sikPct  = Math.round(sikC/total*100);
            const gwanPct = Math.round(gwanC/total*100);
            const wx = data.wuxing || {};
            const wxSum = Math.max(1, Object.values(wx).reduce((a,b)=>a+(Number(b)||0),0));
            function p(k){ return Math.round((Number(wx[k])||0)/wxSum*100); }
            const hwa = p('fire'), sui = p('water'), geum = p('metal'), to = p('earth'), mok = p('wood');

            // 가능성 신호들 (가장 흔한 명리적 결—진단 아님)
            const signals = [];
            if (hwa >= 28 && sui < 15) signals.push({
                tone: '<strong>불면·과한 흥분·공황 결</strong>',
                desc: '화(火) 기운이 두껍고 수(水)가 얇으신 분은, 누워도 머릿속이 환하게 켜져 있는 느낌이 자주 오실 수 있어요. 갑자기 가슴이 두근거리거나 숨이 짧아지는 패턴이 반복되시면, 공황으로 발전할 수 있는 결입니다.',
                prevent: '잠들기 2시간 전부터 화면을 줄이시고, <strong>오후 2시 이후 카페인을 끊는</strong> 것만으로도 큰 차이가 납니다. 한 달 안에 3회 이상 두근거림이 반복되시면 가벼운 검진(심전도·내과)을 받아 두십시오.'
            });
            if (sui >= 30 && hwa < 10) signals.push({
                tone: '<strong>우울감·만성 무기력 결</strong>',
                desc: '수(水) 기운이 두껍고 화(火)가 얇으신 분은, 별 이유 없이 가라앉는 시기가 길게 따라올 수 있어요. 특히 겨울(11~1월)에 그 결이 더 짙어지십니다.',
                prevent: '햇볕을 매일 30분씩 직접 받으시고, <strong>주 2회 이상 사람을 만나는 자리</strong>를 미리 약속으로 잡아 두십시오. 2주 이상 가라앉음이 풀리지 않으시면 정신건강의학과 상담을 미루지 마십시오.'
            });
            if ((sikPct >= 25 || (mok >= 30 && hwa >= 25)) && inPct < 15) signals.push({
                tone: '<strong>집중 어려움 · 충동성 결 (ADHD스러운 패턴)</strong>',
                desc: '식상(食傷)이 두껍고 인성(印)이 얇으시거나, 목(木)·화(火)가 함께 두꺼우신 분은 — 한 가지에 오래 앉아 있기 어려우시고, 시작이 잦은데 마무리가 밀리는 결이세요. 어른이 되어서도 ADHD 진단으로 이어지는 경우가 종종 있습니다.',
                prevent: '한 번에 한 가지만 손에 잡으시는 “단일 작업 30분 + 5분 휴식” 패턴을 일상에 박아 두십시오. 일상 기능에 큰 지장이 있으시면 정신건강의학과에서 정식 평가를 받아 두시는 게 좋습니다 (진단은 사주가 아니라 의료의 영역입니다).'
            });
            if (gwanPct >= 25 && inPct < 15) signals.push({
                tone: '<strong>불안 · 만성 긴장 결</strong>',
                desc: '관성(官)이 두꺼우신데 인성(印)이 얇으신 분은 — “해야만 한다”는 압박을 늘 마음에 지고 사시는 결이세요. 위장 쪽 불편, 어깨 긴장, 잠들기 어려움이 동시에 오면 만성 불안의 신호입니다.',
                prevent: '하루 한 번 <strong>“오늘은 여기까지”</strong>라고 의식적으로 닫는 시간을 정해 두십시오. 호흡 명상(5분)·따뜻한 차·일정의 20% 비우기 — 이 세 가지가 가장 가성비 좋은 예방법입니다.'
            });
            if (geum >= 28 && mok < 15) signals.push({
                tone: '<strong>강박 · 완벽주의 결</strong>',
                desc: '금(金) 기운이 두꺼우시고 목(木)이 얇으신 분은, 한 번 마음에 안 드는 게 보이면 그 자리를 떠나지 못하시는 결이세요. 같은 동작을 반복하시거나, “이 정도면 됐다”가 안 만들어지시면 강박의 결입니다.',
                prevent: '<strong>“80%에서 한 번 손을 떼는”</strong> 연습을 작은 일부터 의도적으로 하십시오. 일상 기능에 지장이 있으시면 강박장애(OCD)도 의료적으로 잘 풀리는 영역이니, 망설이지 마시고 전문가를 만나 보십시오.'
            });
            if (to >= 30 && mok < 15) signals.push({
                tone: '<strong>걱정·반추 결</strong>',
                desc: '토(土) 기운이 두꺼우시고 목(木)이 얇으신 분은, 같은 걱정이 답을 못 찾고 머릿속에서 빙글빙글 도는 시간이 길어지실 수 있어요. 위·소화기 신호와 함께 오는 경우가 많습니다.',
                prevent: '걱정이 시작되면 <strong>종이에 단어로만 적어 두시고</strong>, 그 자리에서 “지금 내가 할 수 있는 한 가지”만 적고 덮으십시오. 2주 이상 같은 걱정이 반복되시면 상담을 한 번 받아 보시는 것이 좋습니다.'
            });

            // 신호가 하나도 없으면 일반 가이드
            const itemsHtml = signals.length > 0
                ? signals.map(s =>
                    '<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:14px 16px;margin-bottom:10px;border-left:3px solid rgba(199,167,106,0.5);">'
                    + '<div style="font-size:12.5px;color:#ddd;margin-bottom:8px;line-height:1.7;">' + s.tone + '</div>'
                    + '<p style="font-size:13px;color:#ccc;line-height:1.88;margin:0 0 8px;">' + boldStarsToStrong(voicePolishParagraph(data, s.desc)) + '</p>'
                    + '<p style="font-size:13px;color:#bbb;line-height:1.88;margin:0;"><strong style="color:#bda979;">예방 · 습관 ▸</strong> ' + boldStarsToStrong(voicePolishParagraph(data, s.prevent)) + '</p>'
                    + '</div>'
                  ).join('')
                : '<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:14px 16px;"><p style="font-size:13px;color:#ccc;line-height:1.88;margin:0;">' + boldStarsToStrong(voicePolishParagraph(data, nmUi(name) + ' 사주는 정신건강 측면에서 특별히 한쪽으로 쏠리는 패턴이 강하지 않은 결이세요. 다만 어느 누구든 — 2주 이상 가라앉음이 풀리지 않거나, 일상 기능에 지장이 있을 정도의 불안·강박·집중 어려움이 이어지신다면, 사주와 무관하게 가까운 정신건강의학과 상담을 받아 보시는 것이 가장 빠른 회복법입니다.')) + '</p></div>';

            return '<div style="background:rgba(180,140,200,0.06);border-radius:12px;padding:20px 22px;margin:18px 0;border:1px solid rgba(180,140,200,0.22);">'
                + '<div style="font-size:12px;color:#c9a8d8;margin-bottom:10px;letter-spacing:1px;font-weight:700;">&#9670; 마음의 건강 — 미리 알아두실 가능성과 예방법</div>'
                + '<p style="font-size:13px;color:#d8c8d8;line-height:1.85;margin:0 0 14px;">' + boldStarsToStrong(voicePolishParagraph(data, '사주로 정신 질환을 진단할 수는 없지만, “어떤 결의 사람이 어떤 어려움에 더 영향을 받기 쉬운지”는 보입니다. 아래는 ' + nmUi(name) + ' 사주에서 미리 알아두시면 좋은 가능성과 예방법이에요. 해당되지 않으시는 항목도 있을 수 있고, 일상 기능에 지장이 있으시면 <strong>사주와 별개로 정신건강의학과 상담을 미루지 마시는 것</strong>이 가장 중요합니다.')) + '</p>'
                + itemsHtml
                + '</div>';
        })()}

        <div style="background:rgba(74,158,106,0.06);border-radius:12px;padding:18px 22px;margin:16px 0;border-left:3px solid #4a9e6a;">
            <div style="font-size:12px;color:#7fcf9f;margin-bottom:10px;letter-spacing:1px;font-weight:700;">&#9670; 검진 — 미루지 마시고 미리 잡아 두실 자리</div>
            <p style="font-size:13.5px;color:#d8e8d8;line-height:1.95;margin:0 0 10px;">${boldStarsToStrong(voicePolishParagraph(data, '병이 생기고 나서가 아니라, 사주에서 약한 자리를 “먼저” 챙기시는 게 평생 가장 비용 적게 드는 건강 전략이에요. ' + nmUi(name) + ' 사주에서 미리 챙겨 두실 검진은 다음과 같습니다.'))}</p>
            <ul style="font-size:13px;color:#d0e0d0;line-height:1.9;margin:0;padding-left:18px;">
                <li><strong>연 1회 종합 검진</strong> — 위·간 기능·콜레스테롤·갑상선까지 한 번에 묶으십시오.</li>
                <li><strong>${(()=>{
                    const dict = { wood:'간·담낭·갑상선·안과 검진', fire:'심전도·혈압·지질 검사', earth:'위·대장 내시경·혈당·복부 초음파', metal:'폐·기관지·피부·대장 검진', water:'신장·호르몬·요로계 초음파' };
                    return dict[maxWuxing] || '종합 검진';
                })()}</strong> — ${ohKr} 기운이 두꺼우신 분이 특히 챙기실 항목입니다. 분기 한 번씩 컨디션이 떨어지는 시기에 미리 예약해 두십시오.</li>
                <li><strong>2년에 한 번 정신건강 자기 진단</strong> — 우울감·불안·집중 어려움이 일상에 영향을 주는지 짧은 자가검사(예: PHQ-9, GAD-7)를 1년에 한 번씩만 해 보십시오. 점수가 한 번이라도 중등도 이상으로 나오시면 정신건강의학과 한 번 다녀오시는 것이 가장 빠른 길입니다.</li>
                <li><strong>50대 이후</strong>는 위·대장 내시경 주기를 짧게 가져가시고, 골밀도·치아 정기 검진도 함께 챙기십시오.</li>
            </ul>
        </div>

        <p class="ch-text" style="margin-top:16px;">건강은 버티는 힘이 아니라 회복 리듬입니다. 몸의 신호를 설명으로 덮지 마십시오. **피곤한 날은 일정을 비우는 것**이 곧 전략입니다.</p>
    </div>`;
}

// ═══════════════════════════════════════════════════════
// PART HEADER — 제목 카드는 바로 아래 본문과 같은 페이지에 묶음
// ═══════════════════════════════════════════════════════
function wrapPartFollowContent(bodyHtml) {
    return '<div class="part-follow-content">' + (bodyHtml || '') + '</div>';
}
function wrapPartSection(headerHtml, bodyHtml) {
    return '<div class="part-header-keep-group">' + (headerHtml || '') + wrapPartFollowContent(bodyHtml) + '</div>';
}
function buildPartHeader(num, title, subtitle, anchorId, opts) {
    opts = opts || {};
    var c = { 1: '199,167,106', 2: '224,128,128', 3: '122,184,212', 4: '152,201,138', 5: '212,175,95' };
    var h = { 1: '#c7a76a', 2: '#e08080', 3: '#7ab8d4', 4: '#98c98a', 5: '#d4af37' };
    var ic = { 1: '🌿', 2: '✦', 3: '🕰', 4: '🌙', 5: '📋' };
    // 부 단위 다리(prelude) — 부 사이를 잇는 한 줄
    var preludes = {
        1: '먼저 ' + (opts.name ? nmUi(opts.name) : '이') + ' 타고난 결, 즉 사주의 본바탕을 살펴보겠습니다. 이 결이 모든 흐름의 출발점입니다.',
        2: '타고난 결은 그대로지만, 그 결이 시간 위에서 어떻게 흘러가는지는 또 다른 이야기입니다. 지금 시기의 흐름을 함께 살펴보겠습니다.',
        3: '결과 흐름을 보았으니, 이번에는 그것이 삶의 네 가지 영역 — 재물·직업·애정·건강 — 에서 어떻게 드러나는지 들어가 보겠습니다.',
        4: '여기까지 ' + (opts.name ? nmUi(opts.name) : '이') + ' 사주를 차근차근 살폈습니다. 마지막으로, 일상에서 운을 다듬어 가는 실천 지침을 정리해 드립니다.'
    };
    var idAttr = anchorId ? (' id="' + String(anchorId).replace(/[^a-zA-Z0-9_-]/g, '') + '"') : '';
    var color = c[num] != null ? c[num] : '199,167,106';
    var border = h[num] != null ? h[num] : '#c7a76a';
    var icon = ic[num] != null ? ic[num] : '📌';
    var preludeHtml = preludes[num]
        ? '<div class="part-prelude" style="margin-top:18px;padding-top:16px;border-top:1px dashed rgba(' + color + ',0.32);font-size:13px;line-height:1.95;color:var(--text-dim);font-style:italic;">' + preludes[num] + '</div>'
        : '';
    return '<div' + idAttr + ' class="part-header-block report-chapter sajux-print-surface sajux-glass-panel" style="display:block;background:rgba(255,255,255,0.04);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.09);border-top:3px solid ' + border + ';border-radius:16px;padding:28px 32px;margin:40px 0 4px;page-break-before:always;break-before:page;page-break-inside:avoid;break-inside:avoid;page-break-after:avoid;break-after:avoid;box-shadow:0 8px 40px rgba(0,0,0,0.22);">'
        + '<div class="part-header-label part-title" style="display:block;font-size:11px;color:' + border + ';letter-spacing:0.12em;margin-bottom:10px;font-weight:700;">[ 제 ' + num + '부 ]</div>'
        + '<div class="part-header-title" style="display:block;font-size:clamp(22px,4.5vw,28px);font-weight:800;color:var(--text-primary);margin-bottom:8px;letter-spacing:-0.02em;">' + icon + ' ' + title + '</div>'
        + '<div class="part-header-sub" style="display:block;font-size:13px;color:var(--text-dim);letter-spacing:1px;">' + subtitle + '</div>'
        + preludeHtml
        + '</div>';
}

function getHiddenVipTableCell(branch, dayStem) {
    var stems = BRANCH_HIDDEN[branch] || [];
    if (!stems.length) return '<span style="color:rgba(255,255,255,0.3);">-</span>';
    return '<div style="display:flex;flex-direction:column;align-items:center;gap:5px;padding:2px 0;">'
        + stems.map(function(ch) {
            var ss  = getSipseong(dayStem, ch);
            var lab = typeof sipToManseBadge === 'function' ? sipToManseBadge(ss, false) : (ss || '');
            var cls = HAN_COLOR[ch] || '';
            var isWater = (ch==='壬'||ch==='癸');
            var hanStyle = isWater
                ? 'font-size:14px;font-weight:300;font-family:\'Noto Sans KR\',\'Noto Sans SC\',sans-serif;color:var(--water);-webkit-text-stroke:0.6px rgba(255,255,255,0.72);paint-order:stroke fill;'
                : 'font-size:14px;font-weight:300;font-family:\'Noto Sans KR\',\'Noto Sans SC\',sans-serif;';
            return '<div style="display:flex;flex-direction:column;align-items:center;line-height:1.2;">'
                + '<span class="vip-hanja ' + cls + '" style="' + hanStyle + '">' + ch + '</span>'
                + '<span style="font-size:9px;color:var(--text-dim,rgba(255,255,255,0.55));font-weight:500;margin-top:1px;">' + lab + '</span>'
                + '</div>';
        }).join('')
        + '</div>';
}

/** 만세력 표 직후 — 원국에 방합·충·병존(천간 반복)·오행 균형 여부를 한 덩어리로 짚음 (~100자 전후) */
function buildYeonjukStructuralBlurb(data) {
    if (!data || !data.dayStem) return '';
    var pillars = data.pillars || [];
    if (pillars.length < 2) return '';

    var ints = (typeof detectPillarInteractions === 'function') ? detectPillarInteractions(pillars) : [];
    var hasBanghap = ints.some(function (x) { return x.type === '방합'; });
    var hasChung = ints.some(function (x) { return x.type === '충'; });
    var hasJiphap = ints.some(function (x) { return x.type === '지합'; });

    var getH = function (p) { return p && p.h ? (typeof p.h === 'string' ? p.h : p.h.join('')) : ''; };
    var stems = [];
    for (var i = 0; i < pillars.length; i++) {
        var g = getH(pillars[i])[0];
        if (g) stems.push(g);
    }
    var stemCount = {};
    stems.forEach(function (s) { stemCount[s] = (stemCount[s] || 0) + 1; });
    var dupStem = Object.keys(stemCount).some(function (s) { return stemCount[s] >= 2; });

    var wx = data.wuxing || {};
    var oh5 = ['wood', 'fire', 'earth', 'metal', 'water'];
    var totalRaw = oh5.reduce(function (s, k) { return s + (Number(wx[k]) || 0); }, 0);
    var pct = {};
    oh5.forEach(function (k) { pct[k] = totalRaw > 0 ? Math.round((Number(wx[k]) || 0) / totalRaw * 100) : 0; });
    var ps = oh5.map(function (k) { return pct[k]; });
    var maxP = Math.max.apply(null, ps);
    var minP = Math.min.apply(null, ps);
    var balanced = (maxP - minP) <= 18;

    var seeds = [];
    if (hasBanghap) seeds.push('방합이 깔려 한쪽 오행에 힘이 몰립니다. 그 결의 추진력과 과열을 함께 보시면 됩니다.');
    else if (hasJiphap) seeds.push('지지 간 지합으로 글자들이 한데 묶여, 삶의 테마가 한 줄로 몰리기 쉽습니다.');
    if (hasChung) seeds.push('축이 있어 안팎의 방향이 동시에 당겨지는 순간이 있습니다.');
    if (dupStem) seeds.push('같은 천간이 반복되는 병존(비겁) 기운이 있어 자기축·대등 관계에서 힘이 붙습니다.');
    if (balanced && !hasBanghap) seeds.push('오행 비율이 한쪽으로 치우치지 않아 상황에 따라 무게를 옮겨 타기 좋습니다.');
    if (seeds.length === 0) seeds.push('뚜렷한 합·충 패턴 없이 풀어진 편이라 십성과 대운의 움직임이 풀이의 중심이 됩니다.');

    var text = seeds.slice(0, 2).join(' ');
    if (text.length > 118) text = text.slice(0, 117) + '…';

    var polished = typeof voicePolishParagraph === 'function' ? voicePolishParagraph(data, text) : text;

    return '<div class="yonjuk-struct-blurb sajux-print-surface" style="margin:14px 0 24px;padding:14px 18px;border-radius:12px;background:rgba(255,255,255,0.035);border:1px solid rgba(199,167,106,0.18);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);">'
        + '<p class="ch-text" style="font-size:13.5px;color:var(--text);line-height:1.92;margin:0;">' + polished + '</p>'
        + '</div>';
}

/**
 * 만세력 가이드 카드 — 만세력 표가 나오기 직전에 두는 "용어 안내" 챕터.
 *   고객이 사주를 처음 접해도 표를 읽을 수 있도록 — 만세력의 정체, 오행 5종,
 *   사주 8자 구조(시·일·월·년주), 천간/지지, 십성, 지장간, 12운성, 신살, 공망을
 *   각 한두 줄로 풀어 줍니다. "흥미 없으시면 건너뛰셔도 좋아요" 안내 포함.
 */
function buildManseGuide(data) {
    var name = (data && data.name) ? data.name : '고객';
    function _vp(t) { return voicePolishParagraph(data, t); }

    function termBox(label, body) {
        return '<div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:13px 16px;">'
            + '<div style="font-size:12px;font-weight:700;color:var(--gold);letter-spacing:0.04em;margin-bottom:6px;">' + label + '</div>'
            + '<p style="font-size:12.5px;color:#bbb;line-height:1.92;margin:0;">' + _vp(body) + '</p>'
            + '</div>';
    }

    function ohBox(color, name, body) {
        return '<div style="background:rgba(255,255,255,0.035);border-radius:10px;padding:12px 14px;border-left:3px solid ' + color + ';">'
            + '<div style="font-size:12px;font-weight:700;color:' + color + ';margin-bottom:4px;">' + name + '</div>'
            + '<p style="font-size:12px;color:#bbb;line-height:1.85;margin:0;">' + _vp(body) + '</p>'
            + '</div>';
    }

    var ohGrid = '<div style="display:grid;grid-template-columns:1fr;gap:10px;margin:10px 0 4px;">'
        + ohBox('#4fc3a1', '목(木) — 나무 기운', '시작·성장·뻗어 나가는 힘이에요. 새 일을 벌이고, 사람을 끌어모으고, 위로 자라는 결을 갖습니다. 부드럽지만 한 번 뿌리내리면 잘 흔들리지 않는 기운이에요.')
        + ohBox('#ef6b56', '화(火) — 불 기운', '드러남·표현·열정의 힘이에요. 자신을 보여 주고, 사람을 끌어당기는 빛이에요. 화는 따뜻하지만 너무 세지면 본인이 먼저 타들어 가니, 다스리는 것이 핵심이에요.')
        + ohBox('#e0b452', '토(土) — 흙 기운', '받쳐 주고 쌓이는 힘이에요. 사람·일·돈을 가만히 품어 두는 결로, 큰 변화보다 안정·축적·신뢰가 어울려요. 사주의 중심을 잡아 주는 기운이에요.')
        + ohBox('#cfcfcf', '금(金) — 쇠 기운', '결단·정리·맺고 끊는 힘이에요. 안 맞는 것을 잘라 내고, 한 가지를 깊이 단단하게 만드는 결이에요. 금이 강한 분은 “끝맺음”에서 진가가 드러납니다.')
        + ohBox('#7fa5d6', '수(水) — 물 기운', '흐름·통찰·정보의 힘이에요. 깊이 보고 길게 생각하는 결로, 정보·전략·인맥이 자본이 됩니다. 보이지 않는 곳에서 쌓이는 기운이에요.')
        + '</div>';

    var termGrid = '<div style="display:grid;grid-template-columns:1fr;gap:10px;margin:10px 0 4px;">'
        + termBox('연주 · 월주 · 일주 · 시주 (四柱)', '<strong>연주(年柱)</strong> — 태어난 해의 기둥으로, 부모·가문·유년기 환경·뿌리 쪽 테마를 많이 담아요.<br><br><strong>월주(月柱)</strong> — 태어난 달의 기둥으로, 사회에 나아가는 첫 무대에 해당하는 직장·학교·형제무리·청춘기 주변 공기를 보여 줘요.<br><br><strong>일주(日柱)</strong> — 태어난 날의 기둥으로, 나 자신과 배우자 자리예요. <strong>위 글자가 일간(日干)</strong>으로 사주 전체에서 “나”의 기준이 되고, 아래 글자는 배우자·내적 바탕에 가깝게 읽어요.<br><br><strong>시주(時柱)</strong> — 태어난 시의 기둥으로, 말년·자녀·내면의 결·하루가 깊어지는 시간대까지 이어지는 흐름을 짚어 줘요.<br><br>네 기둥이 각각 천간·지지 한 글자씩 짝을 이루어 모두 여덟 글자가 되므로 <strong>사주팔자(四柱八字)</strong>라고 부릅니다. 다른 일곱 글자는 이 일간과 맺는 십성 관계로 풀이돼요.')
        + termBox('천간(天干) · 지지(地支)', '각 기둥의 <strong>위 글자</strong>가 “천간”이에요. 갑·을·병·정·무·기·경·신·임·계 — 모두 10개. 겉으로 드러난 모습·역할에 해당해요. <strong>아래 글자</strong>가 “지지”예요. 자·축·인·묘·진·사·오·미·신·유·술·해 — 모두 12개. 속에 자리 잡은 본성·환경이에요. 천간이 “내가 어떻게 보이느냐”라면, 지지는 “내가 진짜 어떤 결로 살아가느냐”입니다.')
        + termBox('십성(十星) — 나와 다른 글자들의 관계', '“십성”은 일간(나)과 나머지 글자들이 맺는 <strong>10가지 관계 이름</strong>이에요. 비견·겁재(나와 같은 결), 식신·상관(나의 표현·재능), 정재·편재(현실의 돈·실무), 정관·편관(책임·자리·압박), 정인·편인(배움·받쳐 줌). 이 십성의 분포가 ' + nmUi(name) + ' 직업·연애·돈의 큰 패턴을 만들어 줍니다.')
        + termBox('지장간(地藏干) — 지지 안에 숨은 천간', '지지 글자 하나하나 안에는 사실 <strong>또 다른 천간 1~3개</strong>가 숨어 있어요. 겉으로는 보이지 않지만 무의식·잠재력·숨겨진 동기로 작동합니다. 예) “인(寅)” 안에는 갑·병·무가 같이 살고 있어요. 그래서 같은 “인” 글자라도 안쪽에서 어떤 기운이 더 활성화되는지에 따라 결이 미세하게 달라집니다.')
        + termBox('12운성(十二運星) — 글자의 인생 단계', '하나의 글자가 “지금 어느 생애 단계에 있는가”를 12가지로 표시해요. 장생(태어남)·욕(씻김)·관대(자리잡음)·록(전성기)·왕(절정)·쇠(기울기 시작)·병(잠시 힘 빠짐)·사(잠잠)·묘(쉼)·절(끊김)·태(다시 잉태)·양(자람). 같은 글자라도 단계가 다르면 힘의 크기가 달라져요.')
        + termBox('신살(神煞) — 특정 글자 조합이 만드는 별', '글자 조합으로 만들어지는 “별”이에요. <strong>도화살</strong>은 매력·인기, <strong>역마살</strong>은 이동·변화, <strong>화개살</strong>은 예술·종교 감각, <strong>천을귀인</strong>은 도움을 주는 귀한 인연 같은 식이에요. 신살은 단독으로 “좋다·나쁘다”가 아니라, 어느 자리에 박혀 있느냐에 따라 결이 달라집니다.')
        + termBox('공망(空亡) — 채워도 채워지지 않는 빈자리', '사주에서 일주를 기준으로 한 “비어 있는 글자”예요. 그 자리에 해당하는 영역(가족·돈·자리 등)은 평소엔 잘 보이지만, 결정적인 순간에 한 번씩 비어 보일 수 있어요. 결핍의 자리가 아니라 — <strong>이 자리에는 평생 다른 보완축을 두고 가셔야 한다</strong>는 신호로 읽으시면 됩니다.')
        + '</div>';

    return '<details class="manse-guide sajux-glass-panel" style="background:rgba(255,255,255,0.04);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(199,167,106,0.22);border-radius:14px;padding:16px 20px;margin:12px 0 18px;box-shadow:0 8px 32px rgba(0,0,0,0.15);">'
        + '<summary style="cursor:pointer;list-style:none;padding:4px 0;">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">'
        + '<div><div style="font-size:10px;letter-spacing:0.14em;color:rgba(199,167,106,0.52);font-weight:700;margin-bottom:6px;">만세력 안내</div>'
        + '<div style="font-size:clamp(17px,4vw,22px);font-weight:800;color:#fff;line-height:1.25;">만세력 읽는 법</div></div>'
        + '<span class="manse-guide-toggle" style="font-size:11px;color:#aaa;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);">건너뛰셔도 좋아요 · 펼쳐 보기</span>'
        + '</div>'
        + '<p style="font-size:12.5px;color:#aaa;line-height:1.85;margin:10px 0 0;">' + _vp('만세력은 태어난 시각을 사주 여덟 글자로 옮겨 적은 표예요. 아래 표에는 ' + nmUi(name) + ' 원국이 한 장에 모여 있습니다. 용어가 빽빽해 보여도 기본만 알면 본문 풀이가 어디서 나오는지 따라가실 수 있어요. <strong>원리가 궁금하지 않으시면 이 안내는 건너뛰셔도 됩니다.</strong> 표만 보시고 본문으로 넘어가셔도 좋아요.') + '</p>'
        + '</summary>'
        + '<div style="margin-top:18px;padding-top:16px;border-top:1px dashed rgba(199,167,106,0.18);">'
        + '<div style="font-size:13.5px;color:#ddd;line-height:1.95;margin-bottom:14px;">' + _vp('<strong>만세력(萬歲曆)</strong>이란 — 태어난 시각의 천체 흐름을 사주 8글자로 환산해 둔 한 장의 표예요. 같은 날 태어난 사람이라도 시(時)에 따라 결이 다르고, 그 결을 다섯 가지 기운(오행)과 열 가지 관계(십성)로 풀어 보는 게 사주의 기본 원리입니다.') + '</div>'
        + '<div style="font-size:11px;letter-spacing:0.10em;color:var(--gold);font-weight:700;margin:14px 0 8px;">① 오행 — 사주를 이루는 다섯 가지 기운</div>'
        + ohGrid
        + '<div style="font-size:11px;letter-spacing:0.10em;color:var(--gold);font-weight:700;margin:18px 0 8px;">② 표의 각 줄이 무엇을 가리키는지</div>'
        + termGrid
        + '<p style="font-size:12px;color:#888;line-height:1.85;margin:16px 0 0;">' + _vp('여기까지가 사주 표를 읽으실 때 알아 두시면 좋은 기본이에요. 외우지 않으셔도 됩니다. 아래 만세력 표를 한 번 훑어보시고, 그 다음 풀이 본문으로 넘어가시면 — 본문 안에서 이 용어들이 어떻게 쓰이는지 자연스럽게 보이실 거예요.') + '</p>'
        + '</div>'
        + '</details>';
}

// VIP 근거: 원국 8자 만세력 표 (프리미엄 요약 직후 배치)
function buildVipEvidenceBlock(data) {
    var name=data.name||'고객';
    var ds=data.dayStem||'丙', db=data.dayBranch||'寅';
    var HK_GAN={'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계'};
    var HK_JI={'子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    var pillars=data.pillars||[];
    var yb=data.yearBranch||'';
    var OH_KR={wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
    var STEM_OH={'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    var BRNCH_OH={'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    var OH_COL={wood:'var(--wood)',fire:'var(--fire)',earth:'var(--earth)',metal:'var(--metal)',water:'var(--water)'};
    function ohColor(k){ return OH_COL[k]||'#aaa'; }
    function hanCol(h){ return ohColor(STEM_OH[h]||BRNCH_OH[h]||'earth'); }
    var ev = '';
    ev += '<div id="sec-vip-evidence" class="report-chapter chapter-start vip-evidence-block" style="padding-top:4px;margin-bottom:32px;">';
    ev += '<div style="font-size:11px;color:rgba(199,167,106,0.75);letter-spacing:0.12em;margin-bottom:8px;font-weight:700;">[ 원국 근거·만세력 데이터 ]</div>';
    // ── ① 만세력 원국 8자 표 ──
    ev += '<div class="vip-manse-keep-group" style="page-break-inside:avoid;break-inside:avoid;">';
    ev += '<div class="vip-manse-title" style="font-size:13px;color:var(--gold);font-weight:800;letter-spacing:1.2px;line-height:1.45;margin-bottom:12px;page-break-after:avoid;break-after:avoid;">① 타고난 8자 — 사주 원국</div>';
    if(pillars.length>=2){
        var isUnk = !pillars[0]||!pillars[0].h||!pillars[0].h[0];
        ev += '<div style="overflow-x:auto;margin-bottom:10px;"><table style="width:100%;border-collapse:collapse;table-layout:fixed;">';
        ev += '<tr style="border-bottom:1px solid rgba(199,167,106,0.25);">';
        ev += '<td style="padding:6px 4px;color:#555;font-size:10px;width:56px;"></td>';
        ['시주','일주','월주','년주'].forEach(function(h){
            ev += '<td style="padding:6px 8px;text-align:center;color:var(--gold);font-size:11px;font-weight:500;">'+h+'</td>';
        });
        ev += '</tr>';
        // 천간 십성 — 만세력과 동일(정통 십성 한글)
        ev += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">';
        ev += '<td class="vip-row-label" style="padding:6px 4px;font-size:10.5px;font-weight:600;letter-spacing:0.02em;">십성</td>';
        pillars.forEach(function(p,i){
            var spRaw=(isUnk&&i===0)?'-':(p.n==='일주'?'일원':(typeof getSipseong==='function'?getSipseong(ds,p.h[0]):''));
            var spShow=(spRaw==='-')?'-':(typeof sipToManseBadge==='function'?sipToManseBadge(spRaw,p.n==='일주'):(spRaw||'-'));
            ev+='<td style="padding:4px 8px;text-align:center;"><span class="vip-sip-cell" style="font-size:10px;color:var(--text-dim,rgba(255,255,255,0.62));font-weight:600;">'+spShow+'</span></td>';
        });
        ev += '</tr>';
        // 천간
        ev += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">';
        ev += '<td class="vip-row-label" style="padding:6px 4px;font-size:10.5px;font-weight:600;letter-spacing:0.02em;">천간</td>';
        pillars.forEach(function(p,i){
            if(isUnk&&i===0){ev+='<td style="text-align:center;color:#444;font-size:11px;">미상</td>';return;}
            var g=p.h[0]||''; var col=hanCol(g);
            var gKr=HK_GAN[g]||g;
            var isWater=STEM_OH[g]==='water';
            var hanjaStyle=isWater
                ? 'font-size:1.55em;font-weight:300;color:var(--water);-webkit-text-stroke:0.6px rgba(255,255,255,0.72);paint-order:stroke fill;font-family:\'Noto Sans KR\',\'Noto Sans SC\',sans-serif;'
                : 'font-size:1.55em;font-weight:300;color:'+col+';font-family:\'Noto Sans KR\',\'Noto Sans SC\',sans-serif;';
            ev+='<td style="padding:6px 6px;text-align:center;vertical-align:middle;"><div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;line-height:1.05;"><span class="vip-hanja" style="'+hanjaStyle+'">'+g+'</span><span style="font-size:10px;color:var(--text-dim,rgba(255,255,255,0.55));font-weight:500;">'+gKr+'</span></div></td>';
        });
        ev += '</tr>';
        // 지지
        ev += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">';
        ev += '<td class="vip-row-label" style="padding:6px 4px;font-size:10.5px;font-weight:600;letter-spacing:0.02em;">지지</td>';
        pillars.forEach(function(p,i){
            if(isUnk&&i===0){ev+='<td style="text-align:center;color:#444;font-size:11px;">미상</td>';return;}
            var j=p.h[1]||''; var col=hanCol(j);
            var jKr=HK_JI[j]||j;
            var isWater=BRNCH_OH[j]==='water';
            var hanjaStyle=isWater
                ? 'font-size:1.55em;font-weight:300;color:var(--water);-webkit-text-stroke:0.6px rgba(255,255,255,0.72);paint-order:stroke fill;font-family:\'Noto Sans KR\',\'Noto Sans SC\',sans-serif;'
                : 'font-size:1.55em;font-weight:300;color:'+col+';font-family:\'Noto Sans KR\',\'Noto Sans SC\',sans-serif;';
            ev+='<td style="padding:6px 6px;text-align:center;vertical-align:middle;"><div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;line-height:1.05;"><span class="vip-hanja" style="'+hanjaStyle+'">'+j+'</span><span style="font-size:10px;color:var(--text-dim,rgba(255,255,255,0.55));font-weight:500;">'+jKr+'</span></div></td>';
        });
        ev += '</tr>';
        // 지지 십성 — 만세력 표와 동일 규칙
        ev += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">';
        ev += '<td class="vip-row-label" style="padding:6px 4px;font-size:10.5px;font-weight:600;letter-spacing:0.02em;">십성</td>';
        pillars.forEach(function(p,i){
            var spRaw=(isUnk&&i===0)?'-':(typeof getSipseong==='function'?getSipseong(ds,p.h[1]):'');
            var spShow=(spRaw==='-')?'-':(typeof sipToManseBadge==='function'?sipToManseBadge(spRaw,false):(spRaw||'-'));
            ev+='<td style="padding:4px 8px;text-align:center;"><span class="vip-sip-cell" style="font-size:10px;color:var(--text-dim,rgba(255,255,255,0.62));font-weight:600;">'+spShow+'</span></td>';
        });
        ev += '</tr>';
        // 지장간
        ev += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">';
        ev += '<td class="vip-row-label" style="padding:6px 4px;font-size:10.5px;font-weight:600;letter-spacing:0.02em;">지장간</td>';
        pillars.forEach(function(p,i){
            if(isUnk&&i===0){ev+='<td style="text-align:center;color:#444;">-</td>';return;}
            ev+='<td style="padding:6px 4px;text-align:center;vertical-align:middle;">'+getHiddenVipTableCell(p.h[1], ds)+'</td>';
        });
        ev += '</tr>';
        // 12운성
        ev += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">';
        ev += '<td class="vip-row-label" style="padding:6px 4px;font-size:10.5px;font-weight:600;letter-spacing:0.02em;">12운성</td>';
        pillars.forEach(function(p,i){
            if(isUnk&&i===0){ev+='<td style="text-align:center;color:#444;">-</td>';return;}
            var u=typeof getUnsung==='function'?getUnsung(ds,p.h[1])||'-':'-';
            ev+='<td style="padding:4px 8px;text-align:center;font-size:10px;color:var(--text-dim,rgba(255,255,255,0.62));font-weight:600;">'+u+'</td>';
        });
        ev += '</tr>';
        var at12=data.allTwelveShinsal||{};
        var atEx=data.allExtraShinsal||{};
        function formatShinsalCell(arr){
            var norm=(Array.isArray(arr)?arr:[arr])
                .filter(Boolean)
                .map(function(v){return String(v);})
                .join(' · ')
                .split(/\s*[·,\/\|]\s*/g)
                .map(function(t){return t.trim();})
                .filter(Boolean);
            if(!norm.length) return '-';
            var lines=[];
            for(var i=0;i<norm.length;i+=2){
                lines.push(norm.slice(i,i+2).join(' · '));
            }
            return lines.join('<br>');
        }
        // 12신살
        ev += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">';
        ev += '<td class="vip-row-label" style="padding:6px 4px;font-size:10.5px;font-weight:600;letter-spacing:0.02em;">12신살</td>';
        pillars.forEach(function(p,i){
            if(isUnk&&i===0){ev+='<td style="text-align:center;color:#444;">-</td>';return;}
            var arr=at12[p.n]||[];
            var txt=formatShinsalCell(arr);
            ev+='<td style="padding:3px 4px;text-align:center;font-size:9.5px;color:var(--text-dim,rgba(255,255,255,0.62));line-height:1.4;white-space:normal;word-break:keep-all;overflow-wrap:anywhere;letter-spacing:-0.05px;">'+txt+'</td>';
        });
        ev += '</tr>';
        // 기타신살
        ev += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">';
        ev += '<td class="vip-row-label" style="padding:6px 4px;font-size:10.5px;font-weight:600;letter-spacing:0.02em;">기타신살</td>';
        pillars.forEach(function(p,i){
            if(isUnk&&i===0){ev+='<td style="text-align:center;color:#444;">-</td>';return;}
            var arr=atEx[p.n]||[];
            var txt=formatShinsalCell(arr);
            ev+='<td style="padding:3px 4px;text-align:center;font-size:9.5px;color:var(--text-dim,rgba(255,255,255,0.62));line-height:1.4;white-space:normal;word-break:keep-all;overflow-wrap:anywhere;letter-spacing:-0.05px;">'+txt+'</td>';
        });
        ev += '</tr>';
        // 공망
        var KR2HJ2_r={'자':'子','축':'丑','인':'寅','묘':'卯','진':'辰','사':'巳','오':'午','미':'未','신':'申','유':'酉','술':'戌','해':'亥'};
        var gmStrR=typeof getGongmang==='function'?getGongmang(ds+db):'';
        var gmHanjaR=gmStrR?[...gmStrR].map(function(c){return KR2HJ2_r[c]||c;}):[];
        ev += '<tr>';
        ev += '<td class="vip-row-label" style="padding:6px 4px;font-size:10.5px;font-weight:600;letter-spacing:0.02em;">공망</td>';
        pillars.forEach(function(p,i){
            if(isUnk&&i===0){ev+='<td style="text-align:center;color:#444;">-</td>';return;}
            var br=(p.h&&p.h[1])||'';
            var isGm=gmHanjaR.indexOf(br)!==-1;
            ev+='<td style="padding:4px 8px;text-align:center;font-size:10px;">'+(isGm?'<span style="color:#e74c3c;font-weight:700;">공망</span>':'<span style="color:#555;">-</span>')+'</td>';
        });
        ev += '</tr>';
        ev += '</table></div>';
    }
    ev += '</div>';

    ev += '</div>';
    return ev;
}

/** ─────────────────────────────────────────
 *  자미두수 12궁 전체 깊이 풀이 (별첨)
 *
 *  명궁·형제궁·부처궁·자녀궁·재백궁·질액궁·천이궁·노복궁(교우궁)·
 *  관록궁·전택궁·복덕궁·부모궁 — 12궁 각각에 14주성 중 한 별을 배치하고
 *  그 궁의 영역(자아·형제·배우자·자녀·재물·건강·이동·인맥·직업·집·정신·부모)에서
 *  그 별이 어떻게 표현되는지를 풀어 줍니다.
 * ───────────────────────────────────────── */
function buildZiWeiDestinyBlueprintSection(data) {
    var nm = data.name || '고객';
    var yb = data.yearBranch || '午';
    var HK = { '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사', '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해' };
    var seed = Math.abs(hashSeed((nm || '') + '|ZW|' + (data.dayStem || '') + (data.dayBranch || '') + yb + (data.birthYear || ''))) % 14;

    // 14주성 — 핵심 키워드와 영역별(자아·재물·일·외부·관계·내면) 짧은 풀이
    var Z = [
        {
            k:'자미', h:'紫微',
            keyword:'리더·체면·통제',
            self:'겉으로는 무난한 리더의 얼굴을 하면서도 속으로는 순위와 체면을 동시에 지키려는 욕망이 큰 분',
            money:'단기 변동성 자산에 손이 가지만, 결실은 규칙이 분명한 장기 코어에서 완성됩니다',
            work:'규칙·지표·기준이 곧 수익으로 연결되는 자리에서 빛납니다',
            outer:'대면 모임보다 검증 가능한 이력·실적 요약으로 평판을 쌓는 편이 좋습니다',
            inner:'완벽함과 체면 사이에서 자주 지치므로, “덜한 한 가지”를 의식적으로 두십시오'
        },
        {
            k:'천기', h:'天機',
            keyword:'두뇌·시나리오·민감',
            self:'끊임없이 시나리오를 바꾸는 두뇌형 — 안정을 원해도 머리는 먼저 움직이는 분',
            money:'단기 매매에 끌리지만, 안정은 월 고정 저축·생활비 정산에서 옵니다',
            work:'전문 자격·실무 성과가 곧 직함으로 연결되는 구조에서 강합니다',
            outer:'이직·해외·온라인 실험이 겹칠 때 동료·협업 채널이 필터입니다',
            inner:'머리가 너무 빨라 마음이 따라오지 못하니, 일주일에 한 번 “결정 요약”을 적어 두십시오'
        },
        {
            k:'태양', h:'太陽',
            keyword:'노출·인정·공개',
            self:'드러날수록 살아나는 사회적 페르소나 — 인정받고 싶은 마음이 연료이자 부담인 분',
            money:'노출형 수익(강연·대외 활동)과 성장 축 우량 자산이 잘 맞습니다',
            work:'대외 발표·브랜드 캠페인이 직급을 대신 증명합니다',
            outer:'짧은 영상·라이브 채널에서 기회가 붙고, 프로필은 “직무 한 줄”로 통일하십시오',
            inner:'밤 10시 이후 알림·답장을 꺼 두지 않으면 다음 날 에너지가 무너집니다'
        },
        {
            k:'무곡', h:'武曲',
            keyword:'숫자·실행·책임',
            self:'말보다 숫자와 실행으로 말하는 타입 — 감정 표현은 적어도 책임은 누구보다 큰 분',
            money:'리스크 자산과 방어 자산(부동산 수익·배당)을 동시에 갖출 때 안정됩니다',
            work:'현장 통제·원가 절감·실무 추진에서 평가가 올라갑니다',
            outer:'이동·출장이 잦을수록 지인 네트워크가 안전벨트가 됩니다',
            inner:'지출 내역은 주 단위로만 확인하고, 나머지는 잠그시는 편이 마음에 좋습니다'
        },
        {
            k:'천동', h:'天同',
            keyword:'조율·평화·민감',
            self:'평화를 원하지만 속으로는 누구보다 민감한 조율자 — 관계가 곧 행복인 분',
            money:'사람 따라 흐르는 지출이 많으니, 구독·모임비를 끊고 자동 저축을 깔아 두십시오',
            work:'케어·HR·고객 응대처럼 관계가 곧 성과인 자리에서 빛납니다',
            outer:'유료 모임·동호회에서 만난 사람과만 깊이 가져가십시오',
            inner:'“거절 한 문장”을 메모에 고정해 두고 그대로 쓰셔도 됩니다'
        },
        {
            k:'염정', h:'廉貞',
            keyword:'미감·예술·기준',
            self:'날카로운 미감과 자기 기준이 겹쳐 스스로를 자주 시험대에 올리는 분',
            money:'짧은 승부에 끌리지만 완성은 브랜딩·지적재산에서 납니다',
            work:'감사·품질·규정 준수 축이 강하고, 디테일이 성과로 직결됩니다',
            outer:'온라인 메시지·문의로 비즈니스 제안이 들어올 수 있으니, 가격·기간·범위 템플릿을 미리 만들어 두십시오',
            inner:'스스로를 가장 자주 평가하시는 분이라, 일주일에 한 번 “아무것도 안 하는 시간”이 약입니다'
        },
        {
            k:'천부', h:'天府',
            keyword:'관리·축적·통제',
            self:'겉으로는 온화한 관리자처럼 보이나 속으로는 시스템 전체를 통제하려는 욕망이 큰 분',
            money:'단기 투기보다 배당·부동산 수익·현금흐름 표가 본체입니다',
            work:'백오피스·재무·운영처럼 시스템을 만드는 자리에서 자라납니다',
            outer:'이직 제안은 추천인·사내 멘토를 통해 오는 편이 안전합니다',
            inner:'쌓아 두는 기질이라 비우는 연습이 필요하니, 분기마다 한 가지를 정리하시는 편이 좋습니다'
        },
        {
            k:'태음', h:'太陰',
            keyword:'정교·내밀·계산',
            self:'겉으로 조용하지만 속으로는 정교하게 계산하시는 기질 — 내밀함이 강점인 분',
            money:'정기 적립·지수형을 자동화하고, 투기는 한도 숫자 아래로만 두십시오',
            work:'리서치·기획·자료 아카이브가 평가로 연결됩니다',
            outer:'야간 온라인 활동이 일을 흔드니, 오전 한 시간만 알림을 켜십시오',
            inner:'밤에 떠오른 생각을 그대로 보내지 마시고, 아침에 한 번 더 보십시오'
        },
        {
            k:'탐랑', h:'貪狼',
            keyword:'호기심·욕망·확장',
            self:'호기심과 욕망의 멀티플레이어 — 새 채널을 동시에 여시기 쉬운 분',
            money:'코어 10%는 우량·배당형에 잠가 두시고, 변동성 자산은 그 위에서만 굴리십시오',
            work:'사업개발·파트너십·새 영역 개척에서 가장 빛납니다',
            outer:'취미 모임·소개 자리에서 귀인이 나오는 흐름입니다',
            inner:'새 만남·새 사업은 월 1개로만 열고 나머지는 다음 달로 미루셔야 합니다'
        },
        {
            k:'거문', h:'巨門',
            keyword:'말·논쟁·표현',
            self:'말과 글이 곧 무기인 타입 — 오해 비용이 크게 나올 수 있는 분',
            money:'논쟁으로 번지는 계약을 피하고 규칙이 명확한 상품으로 재정을 정돈하십시오',
            work:'법무·대외 커뮤니케이션·위기대응에서 진가가 발휘됩니다',
            outer:'단체 대화방이 사건을 키울 수 있으니, 중요한 합의는 공식 메일로 고정하십시오',
            inner:'감정이 올라온 날에는 발송 지연 기능을 켜 두시는 편이 안전합니다'
        },
        {
            k:'천상', h:'天相',
            keyword:'중재·조율·외교',
            self:'조율과 중재에 강한 “공식 얼굴” — 사람들이 자연스럽게 대표 자리에 두는 분',
            money:'신용·담보·보증이 리스크이니, 대형 우량·채권 성격 자산으로 방어하십시오',
            work:'PMO·운영총괄·외교 같은 자리에서 자라납니다',
            outer:'소개·추천이 들어오면 조건표를 먼저 보내고 만나십시오',
            inner:'회의 전 안건 세 줄을 미리 상대에게 보내는 것만으로 피로가 줄어듭니다'
        },
        {
            k:'천량', h:'天梁',
            keyword:'보호·교육·헌신',
            self:'남을 챙기며 자기를 뒤로 미루는 보호자 기질 — 어른의 결이 일찍 자리잡은 분',
            money:'타인의 투자 권유에 끌리기 쉬우니, 본인 명의 계좌·수입 통로만 남기십시오',
            work:'멘토·교육·정책·공공 축이 맞습니다',
            outer:'봉사·모임에서 평생 가는 인연이 만들어집니다',
            inner:'“지금은 답 못 드린다”라는 한 문장을 즐겨찾기에 두고 망설이지 마십시오'
        },
        {
            k:'칠살', h:'七殺',
            keyword:'승부사·긴장·위기',
            self:'겉으로는 과감한 승부사, 속으로는 끊임없이 방패를 드시는 긴장형',
            money:'단기·고레버리지에 끌리지만 결실은 현금흐름이 보이는 방어 자산에서 완성됩니다',
            work:'위기관리·보안·장애 대응·안정 운영에서 진가가 드러납니다',
            outer:'팔로워 수보다 실적·포트폴리오 요약 한 장이 우선입니다',
            inner:'손실 한도를 숫자로 미리 박아 두고, 그 위로는 절대 열지 마십시오'
        },
        {
            k:'파군', h:'破軍',
            keyword:'파괴·재건·혁신',
            self:'부수고 다시 짓는 루프에 익숙한 혁신가 — 같은 자리에 오래 머무르기 어려운 분',
            money:'올인·청산 같은 파괴적 리밸런싱을 막으려면 우량 코어 70%를 먼저 잠그십시오',
            work:'신사업·시범 과제·턴어라운드에서 이름이 오릅니다',
            outer:'해외·원격 제안이 들어오면 계약 관할부터 먼저 쓰십시오',
            inner:'“이번 달에 손볼 일 한 가지”만 메모 상단에 두시고 나머지는 닫으십시오'
        }
    ];

    // 12궁 정의 — 각 궁의 영역, 별 인덱스 오프셋(seed로부터), 활용 측면
    // ※ 명궁(0) / 형제(1) / 부처(6) / 자녀(3) / 재백(4) / 질액(2)
    //   천이(7) / 노복(9) / 관록(8) / 전택(10) / 복덕(11) / 부모(5)
    //   ※ 정통 자미두수의 십이궁 배치와 정확히 일치하지는 않습니다 — 별 14개를 12궁에
    //     해시 기반으로 분산해 “읽을 거리”를 한 사람의 종합 청사진으로 펼치는 근사 모형입니다.
    var palaces = [
        {
            id:'命',  name:'명궁',   en:'命宮',
            theme:'자아·외형·성격의 중심',
            offset:0,
            pick:'self',
            intro:'사람들이 ' + nmEulReul(nm) + ' 한 번 보고 가장 먼저 떠올리는 인상, 그리고 ' + nmDnim(nm) + '이 무의식적으로 펼치시는 페르소나가 담깁니다.',
            tail:'이 별이 ' + nmUi(nm) + ' 명궁에 박혔으니, 사람들이 ' + nmEulReul(nm) + ' 처음 만났을 때의 인상과 ' + nmUi(nm) + ' 진짜 본 모습 사이엔 늘 작은 거리가 있어요. 그 거리를 부끄러워하지 마시고 잘 이용하시는 편이 좋습니다.'
        },
        {
            id:'兄',  name:'형제궁', en:'兄弟宮',
            theme:'형제·자매·또래·동료 관계',
            offset:1,
            pick:'self',
            intro:'피로 맺어진 형제 관계와, 평생 “형제처럼 가까워지는” 또래·동료의 결이 담깁니다.',
            tail:'한두 명의 가까운 동료와는 평생 함께 가시는 흐름이지만, 그 관계가 늘 평화롭지만은 않을 가능성이 큽니다. 형제·가까운 친구의 한 마디가 ' + nmEulReul(nm) + ' 가장 깊이 흔들 수 있는 자리예요.'
        },
        {
            id:'夫',  name:'부처궁', en:'夫妻宮',
            theme:'배우자·결혼·연애 패턴',
            offset:6,
            pick:'self',
            intro:'' + nmIGa(nm) + ' 끌리시는 사람의 결과, 결혼·연애에서 반복되는 패턴이 담깁니다.',
            tail:'배우자(또는 깊은 인연)는 ' + nmUi(nm) + ' 겉 모습과는 살짝 다른 결의 사람일 가능성이 큽니다. ' + nmDnim(nm) + '이 부족하다고 느끼시는 부분을 채워 줄 수 있는 사람일수록 오래 가는 인연입니다.'
        },
        {
            id:'子',  name:'자녀궁', en:'子女宮',
            theme:'자녀·창작·후학·작은 시작',
            offset:3,
            pick:'self',
            intro:'자녀와의 관계뿐 아니라, ' + nmIGa(nm) + ' “키워 가시는 모든 것” — 작품·후배·반려동물·자기만의 프로젝트 — 의 결이 담깁니다.',
            tail:'자녀가 있으시다면 그 관계가 ' + nmEulReul(nm) + ' 한 번 더 자라게 만들고, 자녀가 없으셔도 “키우는 일” 한 가지(작품·후배·반려동물)를 두실 때 인생이 한층 깊어집니다.'
        },
        {
            id:'財',  name:'재백궁', en:'財帛宮',
            theme:'돈의 흐름·재물 패턴',
            offset:4,
            pick:'money',
            intro:'' + nmDnim(nm) + '이 돈을 버시는 방식, 쓰시는 방식, 그리고 한 번씩 흔들리시는 금융 심리 패턴이 담깁니다.',
            tail:'재물은 한 번에 크게 들어오기보다 ' + nmUi(nm) + ' 본업과 자연스럽게 맞물려 따라옵니다. 큰 베팅보다 “구조를 만들어 놓고 천천히 흐르게 하는” 쪽이 평생 자산을 가장 크게 만드십니다.'
        },
        {
            id:'疾',  name:'질액궁', en:'疾厄宮',
            theme:'건강·체력·재난·정신적 부담',
            offset:2,
            pick:'inner',
            intro:'몸과 마음의 가장 약한 고리, 그리고 인생에서 한두 번 마주하실 큰 멈춤의 신호가 담깁니다.',
            tail:'건강의 약한 고리는 ' + nmUi(nm) + ' 스트레스가 가장 자주 모이는 자리와 일치합니다. 작은 신호를 “아직 괜찮다”라며 미루지 마시고, 한 가지 만성 신호는 그 자체로 메시지라 여기시는 편이 좋습니다.'
        },
        {
            id:'遷',  name:'천이궁', en:'遷移宮',
            theme:'이동·해외·외부 활동·평판',
            offset:7,
            pick:'outer',
            intro:'' + nmIGa(nm) + ' 바깥에 나가셨을 때 받는 평가와, 이동·여행·해외에서 만나시는 기회의 결이 담깁니다.',
            tail:'평생 ' + nmDnim(nm) + '의 큰 도약은 “집 안”보다 “집 밖”에서 나옵니다. 한 번씩 짧게라도 익숙한 자리를 벗어나 보시는 일정이 ' + nmUi(nm) + ' 정체를 풀어 줍니다.'
        },
        {
            id:'僕',  name:'노복궁', en:'僕宮·교우궁',
            theme:'동료·부하·인맥의 결',
            offset:9,
            pick:'outer',
            intro:'' + nmEulReul(nm) + ' 받쳐 주는 동료·부하·후배의 결, 그리고 ' + nmIGa(nm) + ' 사람을 모으시는 방식이 담깁니다.',
            tail:'사람의 양보다 질이 평생 ' + nmEulReul(nm) + ' 살립니다. “한 명의 진짜 동료”가 “열 명의 얕은 인맥”보다 늘 더 큰 자산이 되는 자리예요.'
        },
        {
            id:'官',  name:'관록궁', en:'官祿宮',
            theme:'직업·사업·사회적 성취',
            offset:8,
            pick:'work',
            intro:'' + nmIGa(nm) + ' 일에서 가장 빛나는 자리, 그리고 평생 가장 잘 풀리는 직무 결이 담깁니다.',
            tail:'직책보다 “어떤 결의 일을 하느냐”가 ' + nmUi(nm) + ' 만족도를 결정합니다. 안정적인 회사라도 그 결이 ' + nmUi(nm) + ' 본 모습과 어긋나면 오래 못 머무시는 분이에요.'
        },
        {
            id:'田',  name:'전택궁', en:'田宅宮',
            theme:'집·부동산·가족 공간',
            offset:10,
            pick:'money',
            intro:'' + nmIGa(nm) + ' 살아가시는 집·공간의 결과, 부동산·가족 자산의 흐름이 담깁니다.',
            tail:'평생 ' + nmEulReul(nm) + ' 가장 든든하게 받쳐 주는 자산은 “움직이는 돈”보다 “자리 잡은 공간”입니다. 한 채의 집이든, 한 칸의 작업실이든 — 일찍 ' + nmUi(nm) + ' 이름이 박힌 공간 하나를 만드시는 편이 좋습니다.'
        },
        {
            id:'福',  name:'복덕궁', en:'福德宮',
            theme:'정신·취미·내면의 즐거움',
            offset:11,
            pick:'inner',
            intro:'' + nmIGa(nm) + ' 가장 깊은 행복을 느끼시는 결, 그리고 일과 무관한 ' + nmUi(nm) + ' 정신적 만족의 자리가 담깁니다.',
            tail:'복덕궁이 비어 있으면 아무리 성취가 커도 마음이 메마릅니다. “돈도 일도 무관한 한 가지” — 책·산책·음악·요리 같은 작은 즐거움 하나를 평생 곁에 두시는 것이 ' + nmUi(nm) + ' 진짜 풍요입니다.'
        },
        {
            id:'父',  name:'부모궁', en:'父母宮',
            theme:'부모·상사·어른과의 관계',
            offset:5,
            pick:'self',
            intro:'부모님 두 분과의 관계 결, 그리고 ' + nmIGa(nm) + ' 평생 마주하시는 “어른·상사·연장자”와의 관계 패턴이 담깁니다.',
            tail:'부모님 중 한 분과의 거리가 평생 ' + nmUi(nm) + ' 관계 방식을 결정합니다. 그 거리를 정직하게 인정하실 때 ' + nmDnim(nm) + '은 비로소 자유로워지세요.'
        }
    ];

    function _vp(t) { return voicePolishParagraph(data, t || ''); }

    // ※ 자미두수의 별 한자 표기(예: '칠살(七殺)')는 voicePolishParagraph의
    //   십성 풀이 규칙과 겹치므로, 별 이름과 궁 이름 라벨은 polish를 거치지 않고
    //   본문 텍스트(intro / aspect / tail)만 별도로 polish합니다.
    var palaceCards = palaces.map(function (p) {
        var star = Z[(seed + p.offset) % 14];
        var aspectText = star[p.pick] || star.self;
        var introPolished = _vp(p.intro);
        var aspectPolished = _vp(aspectText);
        var tailPolished = _vp(p.tail);
        var bodyHtml = '<strong>' + p.name + '(' + p.en + ')</strong>은 ' + p.theme + '의 자리입니다. ' + introPolished + ' 이 자리에 박힌 별은 <strong>' + star.k + '(' + star.h + ')</strong> — ' + star.keyword + '의 결을 가진 별이에요. ' + aspectPolished + '. ' + tailPolished;
        return '<div class="ziwei-palace-card sajux-print-surface" style="margin:0 0 14px;padding:18px 18px;border-radius:10px;border:1px solid rgba(122,184,212,0.20);background:rgba(122,184,212,0.05);border-left:3px solid rgba(157,211,255,0.55);">'
            + '<div style="font-size:10.5px;letter-spacing:0.16em;color:rgba(157,211,255,0.85);font-weight:700;margin-bottom:8px;">' + escHtmlAttr(p.id) + ' · ' + escHtmlAttr(p.name) + ' (' + escHtmlAttr(p.en) + ')</div>'
            + '<p style="font-size:13px;color:#d6e3ed;line-height:1.95;margin:0;">' + boldStarsToStrong(bodyHtml) + '</p>'
            + '</div>';
    }).join('');

    var ybKr = HK[yb] || yb;
    var zwLead = buildMetaphorHookTitle(data);

    var openText = nmEunNeun(nm) + ' 혼자서도 많이 견뎌 오신 분일 가능성이 큽니다. 사주가 “계절”을 알려 준다면, 자미두수는 그 계절을 살아가는 “스타일”과 “인간관계의 무대”를 비춰 주는 또 다른 거울이에요. 같은 인생을 다른 렌즈로 한 번 더 점검해 드릴게요.';

    var closeText = '12궁을 한 번에 다 외우실 필요는 없어요. ' + nmUi(nm) + ' 인생에서 지금 가장 흔들리시는 영역이 어디인지 살펴보시고, 그 자리의 풀이 한두 줄을 한 주 동안 마음에 두시는 것만으로도 충분합니다. 자미두수는 답을 주는 도구가 아니라, 같은 질문을 더 또렷이 듣게 해 주는 도구예요.';

    return '<div id="sec-ziwei-appendix" class="report-chapter chapter-start appendix-ziwei" style="padding-top:8px;margin-bottom:8px;">'
        + '<h3 class="ch-title" style="font-family:\'Noto Sans KR\',serif;font-size:20px;font-weight:800;line-height:1.45;margin:0 0 6px;">' + escHtmlAttr(zwLead) + '</h3>'
        + '<p style="font-size:11px;letter-spacing:0.1em;color:rgba(157,211,255,0.75);margin:0 0 14px;font-weight:700;">별첨 · 자미두수 12궁으로 보는 운명 설계도</p>'
        + '<p style="font-size:13px;color:#b8d4e8;margin:0 0 14px;line-height:1.85;">자미두수는 <strong>대만·중국 등지에서 발전한 별자리 기반 점성술</strong>로, 한 사람의 인생을 <strong>12개의 무대(궁)</strong>로 나누고 각 무대에 14개의 주요 별을 배치해서 — 자아·가족·연애·직업·돈·건강·외부 활동 등 인생의 모든 영역을 한 장의 청사진으로 보여 줍니다. 사주를 대체하지 않고, 같은 인생을 더 넓은 화면으로 한 번 더 비추는 <strong>별첨</strong>입니다.</p>'
        + '<p style="font-size:12px;color:#8ab4c7;margin:0 0 18px;line-height:1.75;">아래는 태어나신 해의 동물(<strong>' + ybKr + '(' + yb + ')</strong>)을 명궁 자리에 둔 <strong>근사 해석</strong>이에요. 전통 자미두수의 월·시 배치와는 차이가 있을 수 있지만, <strong>12개의 인생 무대 위에서 ' + nmIGa(nm) + ' 어떻게 움직이시는지</strong>를 큰 그림으로 잡는 용도로 읽어 보십시오.</p>'
        + '<div style="background:rgba(122,184,212,0.07);border:1px solid rgba(122,184,212,0.22);border-radius:12px;padding:18px 20px;">'
        + '<p style="margin:0 0 16px;font-size:13.5px;color:#d6e3ed;line-height:1.95;">' + boldStarsToStrong(_vp(openText)) + '</p>'
        + palaceCards
        + '<p style="margin:14px 0 0;font-size:13px;color:#a8c4d4;line-height:1.9;">' + boldStarsToStrong(_vp(closeText)) + '</p>'
        + '</div></div>';
}

// ═══════════════════════════════════════════════════════
// Ch.6 올해 세운 거시적
// ═══════════════════════════════════════════════════════
function buildChapter6_SeYun(data){
    var curY=getReportBaseDate(data).getFullYear();
    if(typeof Solar==='undefined') return typeof buildSewunLoop==='function'?buildSewunLoop(data):'';
    var pack = computeSeYunScorePack(data, curY);
    var h3t = pack ? formatSeYunChapterH3(10, curY, pack.sc, pack.ev2.l) : ('[ 10. ' + curY + '년 세운 ] — 리듬·증빙·범위를 먼저 고정');
    var inner = buildSeYunYearCardHtml(data, curY, { isThisYear: true });
    var chHeadSy = buildChapterHeadTopicFirst('세운 — 앞으로 10년의 바람', h3t, '');
    var chIntroSy = buildChapterIntroHtml(data, 'seyun');
    return '<div class="report-chapter chapter-start">' + chHeadSy + chIntroSy
        + '<div style="width:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:16px;">' + inner + '</div>'
                + '<p class="ch-text sajux-monthly-tip" style="margin-top:16px;font-size:13.5px;color:#bbb;line-height:1.85;">같은 해 안에서는 월마다 <strong>독촉·계약·휴식</strong> 중 하나만 메인으로 두고 나머지는 보조로 두십시오.</p></div>';
}

// ═══════════════════════════════════════════════════════
// Ch.7 내년·내후년
// ═══════════════════════════════════════════════════════
function buildChapter7_NextYears(data){
    var curY=getReportBaseDate(data).getFullYear();
    if(typeof Solar==='undefined') return '';
    function card(yr){
        return buildSeYunYearCardHtml(data, yr, {});
    }
    var c1 = card(curY+1);
    var c2 = card(curY+2);
    if(!c1 && !c2) return ''; // 두 카드 모두 비면 빈 래퍼 방지
    var p1n = computeSeYunScorePack(data, curY + 1);
    var p2n = computeSeYunScorePack(data, curY + 2);
    // 해 사이 시간 다리
    function _yearBridge(prevPack, nextPack, nextYr){
        if (!prevPack || !nextPack) return '';
        var diff = (nextPack.sc || 0) - (prevPack.sc || 0);
        var line;
        if (diff >= 4)        line = '여기서부터 흐름이 한 단계 살아납니다. ' + nextYr + '년은 미뤄두었던 큰 의사결정을 본격적으로 풀어가시면 좋습니다.';
        else if (diff >= 2)   line = '바람의 방향이 부드러워집니다. ' + nextYr + '년은 새로운 시도 한두 가지를 가볍게 펼쳐도 무리가 없습니다.';
        else if (diff <= -4)  line = '여기서 흐름이 한 박자 무거워집니다. ' + nextYr + '년은 새 도전보다 정리·축적의 해로 무게를 옮기십시오.';
        else if (diff <= -2)  line = '결이 살짝 비틀립니다. ' + nextYr + '년은 일정의 약 30%를 비워두고 호흡을 길게 가져가십시오.';
        else                  line = '같은 결의 흐름이 이어집니다. ' + nextYr + '년은 올해의 리듬을 그대로 이어가시면 됩니다.';
        return '<div class="year-bridge" style="margin:8px 0;padding:10px 16px;font-size:13px;color:var(--text-dim);line-height:1.95;font-style:italic;border-left:1px dashed rgba(199,167,106,0.40);">↓ ' + line + '</div>';
    }
    var nowPack = computeSeYunScorePack(data, curY);
    var bridge1 = _yearBridge(nowPack, p1n, curY+1);
    var bridge2 = _yearBridge(p1n, p2n, curY+2);
    var h3n = (p1n && p2n) ? formatNextYearsChapterH3(curY + 1, p1n, curY + 2, p2n) : ('[ 11. ' + (curY + 1) + '·' + (curY + 2) + '년 ] — 앞선 두 해는 계약·현금·관계를 한 주에 섞지 마십시오');
    var chHeadNy = buildChapterHeadTopicFirst('세운 — 다가오는 두 해', h3n, '');
    var chIntroNy = buildChapterIntroHtml(data, 'seyun');
    return '<div class="report-chapter chapter-start">'
        + chHeadNy + chIntroNy
        +'<div style="width:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:16px;">'
        + bridge1 + c1 + bridge2 + c2
        +'</div>'
        +'</div>';
}

// ═══════════════════════════════════════════════════════
// Ch.8 다음 대운 집중 풀이
// ═══════════════════════════════════════════════════════
function buildChapter8_NextDaewun(data){
    var name=data.name||'고객';
    if(!data.daewunList||data.daewunList.length<2) return '';
    // 현재 나이 기준 다음 대운 찾기
    var curAge = getClientAgeYearsAtReport(data);
    var nextDW=null;
    for(var i=0;i<data.daewunList.length;i++){
        if(data.daewunList[i].age>curAge){nextDW=data.daewunList[i];break;}
    }
    if(!nextDW) nextDW=data.daewunList[data.daewunList.length-1];
    var OH_KOR={wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
    var GAN_OH={'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    var doh=GAN_OH[nextDW.name[0]]||'earth';
    var yong=data.yong||'wood',gi=data.gi||'metal';
    var isGood=doh===yong,isBad=doh===gi;
    var judge=isGood?'황금 대운':isBad?'조심 대운':'안정 대운';
    var judgeColor=isGood?'#c7a76a':isBad?'#e08080':'#aaa';
    var nmDaeT = nmDnim(name) + ' 다음 대운' + getJosa('대운', '은/는');
    var DWNEXT={wood:nmDaeT+' 목(木)입니다. 시작·학습·이사에 기운이 실립니다. 판을 여러 개 깔면 체력이 먼저 갑니다. **새 도전은 연 두 개 이하**로 묶으십시오.',fire:nmDaeT+' 화(火)입니다. 노출·성취·이름이 커집니다. 번영과 함께 건강·재무 방어가 무너지기 쉽습니다. **수면·지출 상한선**을 먼저 박으십시오.',earth:nmDaeT+' 토(土)입니다. 안정·축적·완성에 무게가 실립니다. 서두를 필요는 적습니다. **자산·관계를 정리해 결실만** 거두십시오.',metal:nmDaeT+' 금(金)입니다. 전문성·결단·잘라내기가 강해집니다. 한 분야 깊이가 배수로 붙습니다. **핵심 한 줄에만 시간을 몰아** 붙이십시오.',water:nmDaeT+' 수(水)입니다. 통찰·정보·인맥이 자본이 됩니다. 말보다 기록이 이깁니다. **네트워크를 문서와 숫자로**만 관리하십시오.'};
    var chHeadNd = buildChapterHeadMainSub('차기 대운', '이어지는 다음 10년 한 덩어리');
    var chIntroNd = buildChapterIntroHtml(data, 'daeun');
    return '<div class="report-chapter chapter-start">' + chHeadNd + chIntroNd
        +'<div style="display:flex;flex-direction:column;align-items:stretch;gap:14px;background:rgba(199,167,106,0.07);border-radius:12px;padding:18px 20px;margin-bottom:20px;width:100%;max-width:100%;box-sizing:border-box;">'
        +'<div style="font-size:30px;font-weight:800;color:'+judgeColor+';text-align:center;font-family:Noto Sans KR,serif;line-height:1.15;">'+nextDW.name+'</div>'
        +'<div style="text-align:center;width:100%;"><div style="font-size:11px;color:#888;margin-bottom:4px;">'+nextDW.age+'세부터 열 해 동안</div>'
        +'<div style="font-size:14px;font-weight:700;color:'+judgeColor+';">'+judge+'</div></div></div>'
        +'<p style="font-size:13.5px;color:#ddd;line-height:2;margin:0 0 16px;">'+(DWNEXT[doh]||'')+'</p>'
        +'</div>';
}

// ═══════════════════════════════════════════════════════
// Ch.9 월운 12개월
// ═══════════════════════════════════════════════════════
function buildChapter9_Monthly(data){
    var name=data.name||'고객';
    if(typeof buildWolunLoop==='function') return buildWolunLoop(data);
    var chHeadMo = buildChapterHeadTopicFirst('월운 — 12개월의 리듬', '13 · 한 달 단위의 무게 이동', '');
    var chIntroMo = buildChapterIntroHtml(data, 'monthly');
    return '<div class="report-chapter chapter-start">' + chHeadMo + chIntroMo + '<p style="color:#aaa;">월운 데이터를 불러오는 중입니다.</p></div>';
}

// ═══════════════════════════════════════════════════════
// Ch.10 자녀·사회적 이미지·말년
// ═══════════════════════════════════════════════════════
function buildChapter10_Legacy(data){
    var name=data.name||'고객';
    if(typeof buildChapter7_Hidden==='function') return buildChapter7_Hidden(data);
    return '';
}

/** 개운법: 보완 오행을 채우는 심리·행동 깊이 풀이 (합쇼체, **강조**) — 고객 면 전문 용어 비노출 */
function buildRemedyYongHeeMindsetHTML(data) {
    var ohKr = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' };
    var mindset = {
        wood: '단순히 초록을 입는 것을 넘어, 목(木)의 기운인 **방향 고정과 끈기**를 실천하십시오. 새 일은 **한 달에 시작 하나**만 허가하십시오. 물러서야 할 선을 **문자 한 줄**로 먼저 적으십시오. 뿌리를 세운 뒤에만 가지를 넓히는 것이 가장 강력한 개운(開運)입니다.',
        fire: '단순히 붉은색을 더하는 것을 넘어, 화(火)의 기운인 **표현의 선명함과 과열 차단**을 실천하십시오. 보여 주기 전에 **한 페이지 요약**만 먼저 남기십시오. 밤 10시 이후 지시·연락은 **익일 오전**으로만 미루십시오. 불을 덜어도 빛이 나게 다스리는 것이 가장 강력한 개운입니다.',
        earth: '단순히 노란 소품을 두는 것을 넘어, 토(土)의 기운인 **끝까지 받쳐 주는 리듬**을 실천하십시오. 식사·수면 시각을 **주 5일 동일**하게 고정하십시오. 서랍·계좌·약속 중 하나를 **주말 반나절**마다 비우십시오. 흔들리지 않는 루틴이 당신에게 가장 강력한 개운입니다.',
        metal: "단순히 흰색 옷을 입는 것을 넘어, 금(金)의 기운인 '마무리와 맺고 끊음'을 실천해야 합니다. 시작만 하고 끝내지 못한 취미나 프로젝트가 있다면 당장 하나를 골라 **완전히 종료**하십시오. 거절해야 할 제안에는 **24시간 안에** 명확히 '아니오'라고 말하는 연습을 하십시오. 마음의 결단력을 벼리는 것, 그것이 당신에게 가장 강력한 개운(開運)입니다.",
        water: '단순히 검정을 입는 것을 넘어, 수(水)의 기운인 **흐름 읽기와 말 줄이기**를 실천하십시오. 중요한 대화 전에 **세 줄 메모**만 적고 들어가십시오. 탭·정보 채널을 **절반으로** 줄이십시오. 듣고 기록한 뒤에만 움직이는 것이 가장 강력한 개운입니다.'
    };
    var yong = data.yong || 'wood';
    var hee = data.hee || '';
    var yk = ohKr[yong] || '목';
    var blockY = mindset[yong] || mindset.earth;
    var html = '<div style="background:rgba(199,167,106,0.07);border-radius:12px;padding:22px;margin:20px 0;border:1px solid rgba(199,167,106,0.22);">'
        + '<div style="font-size:13px;font-weight:800;color:var(--gold);margin-bottom:14px;letter-spacing:1px;">&#9670; 부족한 기운을 채우는 행동과 마음가짐 (핵심·보조 보완축)</div>'
        + '<p style="font-size:13.5px;color:#ddd;line-height:1.92;margin:0 0 14px;"><strong>핵심 보완 ' + yk + '</strong> — ' + boldStarsToStrong(blockY) + '</p>';
    if (hee && hee !== yong && mindset[hee]) {
        var hk = ohKr[hee] || '';
        html += '<p style="font-size:13.2px;color:#ccc;line-height:1.9;margin:0;"><strong>보조 보완 ' + hk + '</strong> — ' + boldStarsToStrong(mindset[hee]) + '</p>';
    }
    html += '</div>';
    return html;
}


function buildChapter9_Remedy(data) {
    const stemEl = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'}[data.dayStem] || 'earth';
    const yong = data.yong || stemEl;
    const ohKr = {wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
    const yongKr = ohKr[yong] || ohKr[stemEl];
    const name = data.name || '고객';
    const ds = data.dayStem || '丙';
    const isStrong = data.strengthText && (data.strengthText.includes('신강') || data.strengthText.includes('강'));

    // ── 일간별 하루 루틴 (아침·낮·저녁·밤) ──
    const DAILY_RX = {
        '甲': { morn:'창문을 활짝 열고 5분간 깊은 호흡', noon:'점심 후 바깥 산책 10분 (햇볕 직접)', eve:'식사 후 차 한 잔과 짧은 메모', night:'밤 11시 이전 잠자리 — 간이 회복하는 시간' },
        '乙': { morn:'식물에 물 주기 또는 화분 옆 5분 명상', noon:'창가 자리에서 점심 — 햇볕과 식물의 결을 같이', eve:'한 가지 작은 정리 (서랍·책상 위)', night:'밤 11시 이전 따뜻한 차 — 카페인 제외' },
        '丙': { morn:'창문 열고 햇볕 직접 받기 10분', noon:'밝은 자리에서 점심 — 어둑한 방 피하기', eve:'발표·미팅이 있다면 이 시간대까지만', night:'침실 조명 어둡게 — 자기 1시간 전 화면 끄기' },
        '丁': { morn:'촛불 한 자루 또는 조명만 켜고 차 한 잔', noon:'한 시간만이라도 따뜻한 빛이 드는 자리에', eve:'글쓰기·일기 5분 — 오늘 하루를 한 줄로', night:'어둠을 두려워하지 않는 연습 — 조명을 줄이고 잠들기' },
        '戊': { morn:'침대 정리 후 5분간 가만히 앉기', noon:'식사 시간을 정확히 — 30분 미루지 않기', eve:'책상 위 한 가지 비우기 (영수증·메모지)', night:'식후 30분 산책 → 입욕 → 일관된 시각 취침' },
        '己': { morn:'침구 정리와 가벼운 스트레칭 5분', noon:'점심 도시락 또는 단정한 한 끼', eve:'가까운 사람에게 짧은 안부 한 통', night:'10시 이후엔 음식·자극적 영상 끊기' },
        '庚': { morn:'찬물 세수 + 1분 거울 보고 자세 잡기', noon:'결정해야 할 일 하나만 점심 전에 마무리', eve:'운동 30분 (저강도 근력 또는 빠르게 걷기)', night:'금속 액세서리 빼고 손목·발목 자유롭게' },
        '辛': { morn:'세안 후 거울 앞에서 옷매무새 정리 1분', noon:'정갈한 한 끼 — 너무 자극적인 음식 피하기', eve:'완료한 일 한 가지를 일부러 종료 표시', night:'침실은 단정하게 — 잡동사니 보이는 곳에 두지 않기' },
        '壬': { morn:'물 한 잔 천천히 마시기 (찬물 아닌 미온수)', noon:'한 사람과의 깊은 대화 — 잡담 대신 본질', eve:'욕조에 발만이라도 따뜻하게 담그기', night:'11시 이후 화면 끄기 — 신장 회복 시간 보호' },
        '癸': { morn:'창문 열고 공기 환기 + 따뜻한 물 한 잔', noon:'복잡한 결정은 점심 전, 점심 후엔 단순 작업', eve:'일기·메모로 마음을 정리 (말로 풀기 어려울 때)', night:'잠들기 1시간 전부터 따뜻한 차·낮은 조명' }
    };
    const dailyRx = DAILY_RX[ds] || DAILY_RX['戊'];

    // ── 일간별 부적·향·식물·소품 ──
    const TALISMAN_RX = {
        wood: { incense:'편백·소나무·삼나무 향', plant:'몬스테라·산세베리아·테이블야자', charm:'동쪽 창가에 작은 화분 한 개', taboo:'동쪽 벽에 거울이나 금속 장식 두지 않기' },
        fire: { incense:'유향(프랑킨센스)·계피·로즈마리', plant:'홍콩야자·아레카야자·붉은 잎 식물', charm:'책상 남쪽에 작은 양초 또는 따뜻한 톤 조명', taboo:'침대 머리맡에 큰 거울이나 어두운 그림 두지 않기' },
        earth: { incense:'백단(샌달우드)·라벤더', plant:'금전수·고무나무·다육이', charm:'중앙(거실·책상 한가운데)에 도자기 그릇 한 개', taboo:'식탁이나 침대 위에 잡동사니 쌓아두지 않기' },
        metal: { incense:'백차·국화·은은한 시트러스', plant:'스파티필름·아이비·하얀 꽃 식물', charm:'서쪽에 백자·은소품 한 개', taboo:'서쪽 자리에 시들거나 깨진 물건 두지 않기' },
        water: { incense:'침향·백단·연꽃', plant:'개운죽·스킨답서스·물에 키우는 식물', charm:'북쪽에 어항·물그릇·검정 도자기 한 개', taboo:'북쪽 자리에 잡동사니나 마른 식물 두지 않기' }
    };
    const talisman = TALISMAN_RX[yong] || TALISMAN_RX.earth;

    // ── 신강·신약별 마음가짐 ──
    const MINDSET_RX = isStrong
        ? '에너지가 강한 분이라, 개운의 핵심은 “더 채우기”가 아니라 **풀어내기·내려놓기**에 있습니다. 결정을 미루는 연습, 거절하는 연습, 한 걸음 물러서서 보는 연습 — 이 세 가지가 ' + nmKke(name) + ' 가장 큰 보약입니다.'
        : '에너지가 섬세한 분이라, 개운의 핵심은 “비우기”가 아니라 **꾸준히 채우기**에 있습니다. 같은 시간 식사·같은 시간 수면·같은 사람을 자주 만나는 — 이 세 가지 일관성이 ' + nmKke(name) + ' 가장 큰 보약입니다.';
    const colorDB = {
        wood:{good:'초록·청색·청록·연두',bad:'흰색·금색·은색',dir:'동쪽·동남쪽',num:'3, 8',gem:'에메랄드·옥·공작석·녹마노',food:'신맛 음식 — 레몬·식초·매실·키위·녹차',time:'봄(3~5월), 이른 아침 시간대',guien:'수 기운 일간(임·계)을 가진 사람'},
        fire:{good:'빨강·주황·분홍·보라',bad:'검정·짙은 파랑',dir:'남쪽·동남쪽',num:'2, 7',gem:'루비·가넷·레드코랄·레드재스퍼',food:'쓴맛 음식 — 녹차·여주·쑥·아메리카노',time:'여름(6~8월), 오전~정오 시간대',guien:'목 기운 일간(갑·을)을 가진 사람'},
        earth:{good:'노랑·황토·베이지·오렌지',bad:'파랑·청록',dir:'중앙·북동·남서',num:'5, 10',gem:'황수정·호박·타이거아이·황철석',food:'단맛 음식 — 꿀·고구마·호박·옥수수·대추',time:'환절기, 오후 시간대',guien:'화 기운 일간(병·정)을 가진 사람'},
        metal:{good:'흰색·금색·은색·회색',bad:'빨강·주황·분홍',dir:'서쪽·북서쪽',num:'4, 9',gem:'백수정·문스톤·다이아몬드·플루오라이트',food:'매운맛 음식 — 생강·마늘·고추·도라지·무',time:'가을(9~11월), 저녁 시간대',guien:'토 기운 일간(무·기)을 가진 사람'},
        water:{good:'검정·파랑·감색·보라·남색',bad:'노랑·황토·갈색',dir:'북쪽',num:'1, 6',gem:'흑요석·사파이어·아쿠아마린·청금석',food:'짠맛 음식 — 된장·미역·검은콩·블루베리·흑임자',time:'겨울(12~2월), 밤~새벽 시간대',guien:'금 기운 일간(경·신)을 가진 사람'}
    }[yong] || {good:'흰색',bad:'검정',dir:'서쪽',num:'4, 9',gem:'백수정',food:'매운맛',time:'가을',guien:'토 기운 일간'};

    var chHeadR = buildChapterHeadTopicFirst('개운법', '09 · 일상에 옮기기', '');
    var chIntroR = buildChapterIntroHtml(data, 'remedy');
    return `<div class="report-chapter" id="sec-remedy-final">
        ${chHeadR}
        ${chIntroR}

        <p class="ch-text">${voicePolishParagraph(data, '여기까지 ' + nmUi(name) + ' 사주를 차근차근 살폈습니다. 이 마지막 장은 사주를 바꾸는 자리가 아니라, 타고난 결을 일상의 결로 바꿔 드리는 자리입니다. 색·방향·시간·작은 행동 — 거창하지 않은 것을 일주일만 지켜 보십시오. 덜 지친 조합이 ' + nmKke(name) + ' 가장 큰 보약입니다.')}</p>

        <div class="remedy-mindset sajux-print-surface" style="margin:14px 0 18px;padding:18px 20px;border-radius:12px;background:rgba(199,167,106,0.06);border-left:3px solid var(--gold);">
            <div style="font-size:11px;color:var(--gold);letter-spacing:0.10em;margin-bottom:10px;font-weight:700;">${nmUi(name)} 개운(開運)의 흐름</div>
            <p style="font-size:13.5px;color:#e8e0d2;line-height:1.95;margin:0;">${boldStarsToStrong(MINDSET_RX)}</p>
        </div>

        <p class="ch-text">${voicePolishParagraph(data, '먼저 색·방향·시간 같은 큰 결을 짚고, 이어서 ' + nmUi(name) + ' 일간(' + ds + ')에 맞춘 하루 루틴과 부적·향·식물 같은 손에 잡히는 작은 도구들을 풀어 드립니다.')}</p>

        ${typeof buildRemedyYongHeeMindsetHTML === 'function' ? buildRemedyYongHeeMindsetHTML(data) : ''}

        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; 오행별 맞춤 루틴 — 매일 고정할 것</div>
            <div style="display:flex;flex-direction:column;gap:12px;">
                <div style="background:${({wood:'rgba(79,195,161,0.06)',fire:'rgba(255,112,67,0.06)',earth:'rgba(255,202,40,0.06)',metal:'rgba(176,190,197,0.06)',water:'rgba(100,181,246,0.06)'})[yong]||'rgba(255,255,255,0.04)'};border-radius:8px;padding:16px;border-left:3px solid var(--gold);">
                    <div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:10px;">${yongKr} 쪽으로 몸과 방을 맞추기</div>
                    <p style="font-size:13px;color:#ccc;line-height:1.88;margin:0 0 10px;">${({
                        wood: '책상 모니터는 동쪽 벽 쪽으로 두고, 아침 햇볕 15분만이라도 받는 주간 루틴을 고정하십시오. 옷은 초록·청록 중 하나만 주 단위로 통일하면 결정 피로가 줄어듭니다. 신맛(레몬·식초·녹차)은 점심 이후만—저녁엔 끊으십시오. 숲길·공원 산책은 주 1회, 같은 요일·같은 시간에만 잡으십시오.',
                        fire: '남쪽 창가 자리를 하루 2시간만이라도 확보하고, 조명은 3000K 이상 따뜻한 톤으로 통일하십시오. 붉은 소품은 하나만—여러 개면 잠이 얕아집니다. 쓴맛은 아침 한 잔으로 제한하고, 밤엔 카페인을 끊으십시오. 발표·미팅은 오전 10~12시에만 몰아 넣으십시오.',
                        earth: '집·사무실 중앙에 쓰레기·낡은 박스를 두지 마십시오. 노랑·베이지 톤은 침구나 커튼처럼 “잠자는 공간”에만 쓰고, 업무 공간은 대비가 약한 색으로 두십시오. 단맛은 저녁 8시 이전에만—그 이후엔 물만 드십시오. 환절기엔 하루 일정을 하나 줄이는 날을 미리 박아 두십시오.',
                        metal: '서쪽 책상면은 서류만 두고, 잡동사니는 반대편으로 치우십시오. 은·회색 액세서리는 하나만 착용하는 규칙을 두십시오. 매운맛은 점심 한 번—저녁엔 생강·마늘을 빼십시오. 중요한 결정은 해 질 무렵이 아니라 해 질 2시간 전에 끝내십시오.',
                        water: '북쪽 침대 헤드 근처에 전자기기 충전을 두지 마십시오. 남색·검정은 겉옷 한 벌만 고정하고, 실내는 조도 낮게 유지하십시오. 짠맛은 아침 미역 한 그릇으로 끝—밤엔 짠 국물을 피하십시오. 긴 통화·긴 회의는 오후 5시 이전에 끊으십시오.'
                    })[yong] || '표의 행운 색·방향·시간대 중 두 가지만 골라 일주일 동안 같은 패턴으로 반복하십시오. 덜 피곤한 조합이 나오면 그대로 고정하십시오.'}</p>
                </div>
            </div>
        </div>

        <p class="ch-text">${voicePolishParagraph(data, '큰 결을 보았으니, 이제 ' + nmUi(name) + ' 일간(' + ds + ')에 맞춘 하루 루틴을 시간 단위로 풀어 드립니다. 한 번에 다 하실 필요 없이, 이 중 두 가지만 골라 일주일 동안 같은 시간에 반복해 보십시오. 사주가 풀어지는 방식은 늘 작은 반복에서 시작합니다.')}</p>

        <div class="daily-rx-block sajux-print-surface" style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:18px 0;border:1px solid rgba(199,167,106,0.18);">
            <div style="font-size:12px;color:var(--gold);font-weight:700;letter-spacing:0.10em;margin-bottom:14px;">${nmUi(name)} 하루 루틴 — 일간 ${ds} 기준</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div style="padding:14px 16px;border-radius:10px;background:rgba(255,210,150,0.05);border-left:2px solid rgba(255,210,150,0.45);">
                    <div style="font-size:11px;color:#ffd9a8;font-weight:700;letter-spacing:0.05em;margin-bottom:6px;">🌅 아침 (6~9시)</div>
                    <p style="font-size:13px;color:#e8e0d2;line-height:1.85;margin:0;">${dailyRx.morn}</p>
                </div>
                <div style="padding:14px 16px;border-radius:10px;background:rgba(255,235,180,0.05);border-left:2px solid rgba(255,235,180,0.45);">
                    <div style="font-size:11px;color:#ffe9b8;font-weight:700;letter-spacing:0.05em;margin-bottom:6px;">☀️ 낮 (12~15시)</div>
                    <p style="font-size:13px;color:#e8e0d2;line-height:1.85;margin:0;">${dailyRx.noon}</p>
                </div>
                <div style="padding:14px 16px;border-radius:10px;background:rgba(220,180,255,0.05);border-left:2px solid rgba(220,180,255,0.45);">
                    <div style="font-size:11px;color:#d8b8ff;font-weight:700;letter-spacing:0.05em;margin-bottom:6px;">🌆 저녁 (18~21시)</div>
                    <p style="font-size:13px;color:#e0d8ec;line-height:1.85;margin:0;">${dailyRx.eve}</p>
                </div>
                <div style="padding:14px 16px;border-radius:10px;background:rgba(170,200,255,0.05);border-left:2px solid rgba(170,200,255,0.45);">
                    <div style="font-size:11px;color:#a8c8ff;font-weight:700;letter-spacing:0.05em;margin-bottom:6px;">🌙 밤 (22~24시)</div>
                    <p style="font-size:13px;color:#dee2eb;line-height:1.85;margin:0;">${dailyRx.night}</p>
                </div>
            </div>
        </div>

        <p class="ch-text">${voicePolishParagraph(data, '시간의 결이 잡혔다면, 이번엔 공간의 결입니다. 향·식물·작은 소품 — 사주의 ' + yongKr + ' 기운을 일상의 공기에 들여놓는 가장 부드러운 방법입니다.')}</p>

        <div class="talisman-rx-block sajux-print-surface" style="background:rgba(199,167,106,0.05);border-radius:12px;padding:22px;margin:18px 0;border:1px solid rgba(199,167,106,0.22);">
            <div style="font-size:12px;color:var(--gold);font-weight:700;letter-spacing:0.10em;margin-bottom:14px;">${yongKr}을 일상에 들이는 4가지 방법</div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="display:flex;gap:14px;align-items:flex-start;padding:10px 0;border-bottom:1px solid rgba(199,167,106,0.15);">
                    <div style="font-size:22px;flex-shrink:0;">🪔</div>
                    <div style="flex:1;"><div style="font-size:12px;color:var(--gold);font-weight:700;margin-bottom:4px;">향 (집중·잠자리)</div><p style="font-size:13px;color:#e8e0d2;line-height:1.85;margin:0;">${talisman.incense}을 한 가지만 골라 같은 시간에 사용해 보십시오. 너무 진하지 않게.</p></div>
                </div>
                <div style="display:flex;gap:14px;align-items:flex-start;padding:10px 0;border-bottom:1px solid rgba(199,167,106,0.15);">
                    <div style="font-size:22px;flex-shrink:0;">🪴</div>
                    <div style="flex:1;"><div style="font-size:12px;color:var(--gold);font-weight:700;margin-bottom:4px;">식물 (공간의 분위기)</div><p style="font-size:13px;color:#e8e0d2;line-height:1.85;margin:0;">${talisman.plant} 중 손이 덜 가는 한 종류를 책상 또는 침실 옆에 두십시오. 시들면 바로 새로 들이는 것이 약입니다.</p></div>
                </div>
                <div style="display:flex;gap:14px;align-items:flex-start;padding:10px 0;border-bottom:1px solid rgba(199,167,106,0.15);">
                    <div style="font-size:22px;flex-shrink:0;">🕯️</div>
                    <div style="flex:1;"><div style="font-size:12px;color:var(--gold);font-weight:700;margin-bottom:4px;">소품 (방향)</div><p style="font-size:13px;color:#e8e0d2;line-height:1.85;margin:0;">${talisman.charm}.</p></div>
                </div>
                <div style="display:flex;gap:14px;align-items:flex-start;padding:10px 0;">
                    <div style="font-size:22px;flex-shrink:0;">🚫</div>
                    <div style="flex:1;"><div style="font-size:12px;color:#ff9f9f;font-weight:700;margin-bottom:4px;">피해야 할 것</div><p style="font-size:13px;color:#e8d8d2;line-height:1.85;margin:0;">${talisman.taboo}.</p></div>
                </div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; 같이 있으면 덜 지치는 사람 유형</div>
            <p style="font-size:13.5px;color:#ccc;line-height:1.9;margin:0 0 14px;">귀인 유형과는 <b>업무·돈 말은 빼고</b> 산책·식사·짧은 통화만 하십시오. 주의 색을 즐겨 쓰는 사람과는 **밤 술자리만** 끊어도 체력이 살아납니다. 만남은 표의 방위로 **월 1~2회**만 옮겨 보십시오.</p>
        </div>

        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; 나이대별로 손대야 할 것만</div>
            ${getAgeBasisNoteHtml('block')}
            <div style="display:flex;flex-direction:column;gap:8px;">
                ${buildRemedyAgeDecadeBandsHTML(data)}
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:22px;margin:24px 0;">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">&#9670; 한꺼번에 일이 꼬일 때</div>
            <p style="font-size:13.5px;color:#ccc;line-height:1.9;margin:0 0 14px;">일이 터지는 달에는 **새로 시작 금지**입니다. 끊고·돌려받고·정리만 하십시오. 한 달만 버티면 숨통이 트이는 경우가 많습니다.</p>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="background:rgba(255,150,0,0.06);border-radius:8px;padding:14px;border:1px solid rgba(255,150,0,0.15);">
                    <div style="font-size:12px;font-weight:700;color:#ff9800;margin-bottom:8px;">⚠ 그달엔 하지 말 것</div>
                    <p style="font-size:13px;color:#bbb;line-height:1.88;margin:0;">연대보증·지분 계약·신규 대출·야간 송금·카톡으로 받은 구두 합의를 그대로 믿는 일. 충동 이직·충동 창업·도박성 투자. 술자리에서 나온 동업·공동 투자 제안에 바로 답장하는 일.</p>
                </div>
                <div style="background:rgba(0,200,83,0.06);border-radius:8px;padding:14px;border:1px solid rgba(0,200,83,0.15);">
                    <div style="font-size:12px;font-weight:700;color:#00C853;margin-bottom:8px;">✦ 그달엔 대신 할 것</div>
                    <p style="font-size:13px;color:#bbb;line-height:1.88;margin:0;">자격·문서·장부만 정리하고 **수면을 먼저** 채우십시오. 표의 색·방향·시간대를 **일주일만** 지키면 집중이 돌아옵니다. 현금은 **나가는 구멍부터** 막고, 들어오는 돈은 **문자·메일 증빙**으로만 확인하십시오.</p>
                </div>
            </div>
        </div>
    </div>`;
}

/** 인생 일대기 — 장면 서사 + 끝에 실행 한 줄(합쇼체). 대운 점수는 내부 계산만 사용합니다. */
function buildLifePanoramaSection(data) {
    var GAN_KR = {'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계'};
    var JI_KR = {'子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    var BR_OH = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    var ST_OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
    var name = data.name || '고객';
    var ds = data.dayStem || '', db = data.dayBranch || '';
    var mb = data.monthBranch || '';
    var hee = data.hee || '';
    var goo = data.goo || '';
    var yong = data.yong || 'wood';
    var gi = data.gi || 'metal';
    var isStrong = ((data.strengthText || '').indexOf('신강') >= 0 || (data.strengthText || '').indexOf('강') >= 0);

    function joToken(krToken, pair) {
        if (!krToken) return getJosa('', pair);
        var last = String(krToken).replace(/\s/g, '').slice(-1);
        if (JOSA_MAP_22[last] && (pair === '이/가' || pair === '과/와')) {
            return pair === '이/가' ? JOSA_MAP_22[last].i : JOSA_MAP_22[last].wa;
        }
        return getJosa(krToken, pair);
    }
    var nTopic = nmDnim(name);

    var birthSceneByMonth = {
        '子': '깊은 밤의 정적 속에서 작은 불씨처럼 조심스레 이름을 알렸습니다. 부모님 품은 말보다 규칙이 먼저 제 자리를 잡는 집안이었고, 당신은 일찍이 눈치와 책임의 무게를 동시에 배웠을 가능성이 큽니다.',
        '丑': '얼음이 얇게 녹기 시작하는 땅 위에서 호흡을 안정적으로 가다듬으며 세상에 발을 내딛었습니다. 성실함이 칭찬으로 돌아오는 속도는 느리나, 한 번 새겨진 신뢰는 오래 남는 곳에서 자랐을 가능성이 큽니다.',
        '寅': '아지랑이가 막 걷히는 숲길처럼, 보폭을 넓히고 싶은 욕망이 이른 나이부터 몸을 깨웠습니다. 부모님은 격려와 경계를 한꺼번에 건넸고, 당신은 “나는 어디까지 갈 수 있을까”를 늘 스스로에게 물으며 커 왔을 가능성이 큽니다.',
        '卯': '만물이 생동하는 화창한 봄날, 볕이 잘 드는 비옥한 땅에서 큰 기대 속에 태어났습니다. 부모님의 훈육은 엄정했으나 마음 깊숙이에는 따뜻함이 깔려 있었고, 당신은 남보다 빨리 철이 들며 자신을 단단하게 다듬어 왔을 가능성이 큽니다.',
        '辰': '바람이 방향을 바꾸는 언덕 위 집안에서, 이직과 기회가 오가는 리듬 속에 자랐습니다. 겉으로는 유연해 보여도 속으로는 늘 다음 수를 미리 그려야 했고, 당신은 소음 속에서도 판을 읽는 연습을 이르게 시작했을 가능성이 큽니다.',
        '巳': '한낮의 열기가 피부에 닿을 듯한 계절에 태어나, 보여 주는 삶과 끝까지 지켜야 할 자존심이 한데 섞여 자랐습니다. 부모님은 기대를 숨기지 않았고, 당신은 그 기대를 등불 삼아 밤늦게까지 길을 잃지 않으려 애썼을 가능성이 큽니다.',
        '午': '햇살이 마당 끝까지 닿는 집에서, 당당함과 선의가 동시에 어른 손에 의해 길러졌습니다. 인정받고 싶은 마음이 컸으나 그만큼 실수에도 엄격했고, 당신은 웃음 뒤에 감춘 긴장을 일찍부터 익혔을 가능성이 큽니다.',
        '未': '풀내음이 배인 언덕길처럼, 조용한 배려와 끈기가 집 안 공기로 스며든 환경이었습니다. 서두르지 않아도 미래를 준비하라는 메시지가 몸으로 전해졌고, 당신은 천천히 쌓아 올리는 방식에 익숙해졌을 가능성이 큽니다.',
        '申': '날이 갈라진 듯한 바람이 통하는 집에서, 변화와 이동이 낯설지 않은 어린 시절을 보냈습니다. 부모님은 현실적인 조언으로 길을 열어 주었고, 당신은 감정보다 판단을 먼저 훈련하며 자랐을 가능성이 큽니다.',
        '酉': '해가 기울 때 소리가 맑아지는 마을처럼, 완성도와 체면이 집안 화법 속에 함께 깔렸습니다. 칭찬은 적지만 한 마디가 오래 남는 곳에서, 당신은 결과물로 마음을 증명하는 법을 일찍 배웠을 가능성이 큽니다.',
        '戌': '저녁 안개가 내려앉는 언덕에서, 의리와 책임을 이름붙이지 않고도 몸으로 가르치는 분위기 속에 자랐습니다. 당신은 혼자 지켜야 할 약속의 무게를 남들보다 먼저 짊어져 보았을 가능성이 큽니다.',
        '亥': '물줄기가 모이는 하구처럼, 말없이 퍼 주는 정과 상상의 깊이가 함께 흐르는 집에서 자랐습니다. 감수성은 풍부했으나 표현은 서툴렀고, 당신은 속으로만 차오르는 파도를 다스우는 연습을 이르게 시작했을 가능성이 큽니다.'
    };
    function _lp(t) { return voicePolishParagraph(data, t || ''); }
    var birthOpening = _lp(birthSceneByMonth[mb] || '첫 숨을 내쉰 그날의 공기는 차갑지도 뜨겁지도 않았으나, 집 안에는 분명한 품격과 규율이 깔려 있었습니다. 부모님의 손길 속에서 당신은 세상을 맞이하는 첫 태도를 배웠을 가능성이 큽니다.');

    var portraitByDayOh = {
        wood: '당신 안에는 한 그루 나무처럼 곧게 서려는 결기와, 뿌리를 내리고 싶은 애틋함이 함께 있습니다.',
        fire: '당신 안에는 불꽃이 꺼지지 않게 지키고 싶은 열정과, 어둠을 밝히려는 충동이 함께 있습니다.',
        earth: '당신 안에는 묵직하게 받쳐 주려는 양심과, 흔들리지 않는 믿음의 층이 함께 쌓여 있습니다.',
        metal: '당신 안에는 빛을 모아 벼리는 집념과, 흐트러짐을 용납하지 않는 날카로운 기준이 함께 있습니다.',
        water: '당신 안에는 깊은 물결처럼 스스로를 적시는 사유와, 흐름을 읽으려는 감각이 함께 있습니다.'
    };
    var dayOh = ST_OH[ds] || 'earth';
    var portrait = _lp(portraitByDayOh[dayOh] || portraitByDayOh.earth);

    var wux = data.wuxing || { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    var sorted = [['wood', wux.wood || 0], ['fire', wux.fire || 0], ['earth', wux.earth || 0], ['metal', wux.metal || 0], ['water', wux.water || 0]].sort(function (a, b) { return b[1] - a[1]; });
    var topKey = sorted[0][0];
    var airAround = {
        wood: '집 밖 공기에는 끊임없이 움트는 싹과 경쟁하는 생명력이 깔려 있었습니다.',
        fire: '집 밖 공기에는 사람의 시선과 이름이 빨리 마르는 뜨거운 장맛비가 내렸습니다.',
        earth: '집 밖 공기에는 질서를 세우려는 손길과 묵직한 책임의 무게가 겹쳐 있었습니다.',
        metal: '집 밖 공기에는 잘라 내야 할 혼선과, 선명해져야 한다는 압박이 함께 불어왔습니다.',
        water: '집 밖 공기에는 숨 고르기 어려울 만큼 빠르게 차오르는 파도와 상상의 소음이 섞였습니다.'
    }[topKey] || '집 밖 공기는 당신이 스스로 방향을 정해야만 숨이 트이는 리듬이었습니다.';
    airAround = _lp(airAround);

    var p1 = '첫 장면. ' + nTopic + joToken(nTopic, '은/는') + ' ' + birthOpening + ' ' + portrait + ' ' + airAround
        + ' 밖으로 나왔을 때 **관계의 밀도와 돈의 속도**도 그 연장선에 걸립니다. 한 박자 늦추고 싶다면 **수면과 현금흐름**부터 고정하십시오.';

    function rowScore(g1, j1) {
        var s = 0;
        var go = ST_OH[g1];
        var jo = BR_OH[j1];
        if (go === yong || go === hee) s += 2;
        if (go === gi || go === goo) s -= 2;
        if (jo === yong || jo === hee) s += 2;
        if (jo === gi || jo === goo) s -= 2;
        return s;
    }
    function parseRow(r, idx) {
        var gz = (r && (r.name || (r.gz && (r.gz[0] + r.gz[1])))) || '';
        var g1 = gz.charAt(0);
        var j1 = gz.charAt(1);
        var ag = r && (r.age != null ? r.age : r.startAge);
        ag = ag != null ? Number(ag) : idx * 10;
        return { age: ag, gz: gz, g1: g1, j1: j1, sc: gz.length > 1 ? rowScore(g1, j1) : 0 };
    }
    var rows = data.daeunRows || data.daewunList || [];
    var parsed = [];
    for (var di = 0; di < rows.length; di++) {
        parsed.push(parseRow(rows[di], di));
    }

    var youth = parsed.filter(function (x) { return x.age >= 8 && x.age < 40; });
    var hard = youth.filter(function (x) { return x.sc <= 0; });
    var soft = youth.filter(function (x) { return x.sc >= 2; });
    var hardAges = hard.map(function (x) { return x.age; }).sort(function (a, b) { return a - b; });
    var softAges = soft.map(function (x) { return x.age; }).sort(function (a, b) { return a - b; });
    var pivotHard = hardAges.length ? hardAges[Math.floor(hardAges.length / 2)] : null;
    var pivotSoft = softAges.length ? softAges[Math.floor(softAges.length / 2)] : null;

    var p2open = '둘째 장면. 긴 터널은 누구에게나 옵니다. ' + nTopic + joToken(nTopic, '은/는') + ' 스무 살 전후~마흔 전, ';
    var evs = [];
    if (pivotHard != null && pivotSoft != null && pivotHard === pivotSoft) {
        evs.push({ age: pivotHard, kind: 'both' });
    } else {
        if (pivotHard != null) evs.push({ age: pivotHard, kind: 'hard' });
        if (pivotSoft != null) evs.push({ age: pivotSoft, kind: 'soft' });
    }
    evs.sort(function (a, b) { return a.age - b.age; });
    var p2mid = '';
    if (!evs.length) {
        p2mid = '바깥 속도가 마음보다 빨랐고, 성과가 보이기 전까지는 **이름 없는 노력의 연속**이었을 가능성이 큽니다. **호흡 루틴 하나**(수면·걷기·기록 중 하나)만 고정하십시오.';
    } else {
        for (var ei = 0; ei < evs.length; ei++) {
            var ev = evs[ei];
            var seg = '';
            if (ev.kind === 'hard') {
                seg = ev.age + '세 무렵에는 예고 없이 찬 바람이 불어 잠시 멈춰야 했을 가능성이 큽니다. **수면·현금 한도**만 먼저 지키십시오.';
            } else if (ev.kind === 'soft') {
                seg = ev.age + '세 무렵에는 숨 돌릴 틈을 열어 주는 시절이 스쳤고, 그때 쌓은 신용이 방패가 되었을 가능성이 큽니다. **약속은 문자로**만 남기십시오.';
            } else {
                seg = ev.age + '세 무렵에는 멈춤과 숨 고르기가 같은 계절에 몰렸을 가능성이 큽니다. **기록만** 다음 수에 쓰십시오.';
            }
            p2mid += (ei ? ' 이어서 ' : '') + seg;
        }
    }
    var p2tail = '';
    var hadSoftInBody = evs.some(function (e) { return e.kind === 'soft' || e.kind === 'both'; });
    if (!hadSoftInBody && evs.length) {
        if (!hard.length) {
            p2tail = ' 덧붙여, 한결같이 밀어 주는 바람만 있는 삶은 드물기에, 스스로 만든 호흡 조절이 평생의 자산이 되었을 가능성이 큽니다.';
        } else {
            p2tail = ' 겨울 사이사이 끼어든 짧은 봄날을 놓치지 않았다면, 그날의 너그러움이 지금의 당신을 버티게 하는 축이 되었을 가능성이 큽니다.';
        }
    } else if (!evs.length && !hard.length) {
        p2tail = ' 덧붙여, 한결같이 밀어 주는 바람만 있는 삶은 드물기에, 스스로 만든 호흡 조절이 평생의 자산이 되었을 가능성이 큽니다.';
    } else if (!evs.length && hard.length) {
        p2tail = ' 겨울 사이사이 끼어든 짧은 봄날을 놓치지 않았다면, 그날의 너그러움이 지금의 당신을 버티게 하는 축이 되었을 가능성이 큽니다.';
    }
    var p2 = p2open + p2mid + p2tail;

    var best = null;
    var bestSc = -99;
    for (var bi = 0; bi < parsed.length; bi++) {
        var pr = parsed[bi];
        if (pr.age < 24) continue;
        if (pr.sc > bestSc) {
            bestSc = pr.sc;
            best = pr;
        }
    }
    var giftByYong = {
        wood: '사람을 묶어 주는 손길과 배움을 이어 주는 말',
        fire: '이름을 걸고 나서는 담대함과 무대 중심의 온기',
        earth: '누구나 쉴 수 있게 만드는 제도와 저축해 두는 신뢰',
        metal: '잘라 내는 결단과 남는 결과물의 품질',
        water: '숫자 뒤의 의미를 읽는 직관과 다음 수를 그리는 상상력'
    };
    var gift = giftByYong[yong] || giftByYong.earth;
    var p3 = '';
    if (best && bestSc >= 2) {
        p3 = '셋째 장면. ' + nTopic + joToken(nTopic, '은/는') + ' ' + best.age + '세 전후부터 약 열 해 동안, 인생 드라마에서 가장 밝은 조명이 켜질 수 있는 계절을 맞을 가능성이 큽니다. '
            + '그때 손에 쥐게 되실 선물은 ' + gift + '입니다. '
            + '같은 노력이라도 그 시절에는 결실이 배로 따라붙습니다. **약속·자산 경계는 글로** 남긴 뒤 승부에 임하십시오. '
            + '빛은 영원하지 않으니, 그때 만든 평판과 현금흐름을 **이후의 방패**로 저장하십시오.';
    } else if (best && bestSc >= 0) {
        p3 = '셋째 장면. ' + nTopic + joToken(nTopic, '은/는') + ' ' + best.age + '세 전후에 숨통이 트이는 창문이 열리나, 한 번의 폭발보다 여러 번의 작은 완성이 어울릴 가능성이 큽니다. '
            + '그때 손에 얹히는 도구는 ' + gift + '입니다. '
            + '층층이 쌓인 완성 하나하나가, 더 큰 문이 열릴 때의 담력이 됩니다. **작은 완성을 분기마다** 하나씩만 남기십시오.';
    } else {
        p3 = '셋째 장면. ' + nTopic + joToken(nTopic, '은/는') + ' 황금빛 계절을 남이 정해 주기보다, 스스로 조명을 잡는 감독이었을 가능성이 큽니다. '
            + '작업대 위 도구는 ' + gift + '입니다. '
            + '숫자로 남는 성과와 손에 잡히는 여유만큼만 무대를 넓히십시오. **늦게 와도 오래 가는 전성기**를 노리십시오.';
    }

    var pillars = data.pillars || [];
    var sj = (pillars[0] && pillars[0].h && pillars[0].h[1]) || data.timeBranch || '';
    var closeSceneByHour = {
        '子': '밤이 길고 별이 가까운 시간대의 기운은, 마지막 장면에서도 고요한 정리와 맑은 반성을 남기려 합니다.',
        '丑': '새벽빛이 가장 얇게 스미는 시간대의 기운은, 끝까지 묵묵히 챙김의 손길을 거두지 않으려 합니다.',
        '寅': '낮기운이 막 깨어나는 시간대의 기운은, 끝나도 또 다른 문을 열고 싶은 욕망의 씨앗을 남기려 합니다.',
        '卯': '햇살이 새순을 깨우는 시간대의 기운은, 사람의 온기를 버리지 않은 채 작별하려 합니다.',
        '辰': '바람이 방향을 바꾸는 시간대의 기운은, 삶의 무대를 조용히 접되 기억 속에는 흔적을 남기려 합니다.',
        '巳': '열기가 고개를 드는 시간대의 기운은, 이름 섞인 사건과 불꽃 같은 순간을 기록으로 남기려 합니다.',
        '午': '그림자가 짧아지는 시간대의 기운은, 마지막 순간에도 당당함과 예의를 함께 지니려 합니다.',
        '未': '풀내음이 피어오르는 시간대의 기운은, 돌아올 사람을 위해 자리와 밥상을 남겨 두려 합니다.',
        '申': '날이 기울며 소리가 선명해지는 시간대의 기운은, 남은 원칙과 품질로 마침표를 찍으려 합니다.',
        '酉': '노을이 얇게 깔리는 시간대의 기운은, 완성된 결과물과 깔끔한 인사로 무대를 닫으려 합니다.',
        '戌': '먼지가 가라앉는 저녁 시간대의 기운은, 신의와 뼈대 같은 약속을 남기려 합니다.',
        '亥': '물결 소리가 잦아드는 시간대의 기운은, 지혜와 이야기를 조용히 건네고 떠나려 합니다.'
    };

    var late = parsed.filter(function (x) { return x.age >= 60; });
    var lateMood = '';
    if (late.length) {
        var av = late.reduce(function (a, x) { return a + x.sc; }, 0) / late.length;
        if (av >= 1) lateMood = '예순이 지나면 조명은 낮아지고, 대신 이름과 정리의 향이 짙어질 가능성이 큽니다.';
        else if (av <= -1) lateMood = '예순 이후에는 몸과 마음을 번갈아 다독이며 방어에 힘을 써야 할 장면이 길어질 가능성이 큽니다.';
        else lateMood = '예순 이후에는 화려함보다 균형과 회복의 리듬이 삶의 중심으로 올라올 가능성이 큽니다.';
    } else {
        lateMood = '말년의 바람은 하루의 끝자락에서 느껴지는 온도와, 앞으로 남은 긴 호흡이 겹쳐 그려질 가능성이 큽니다.';
    }

    var legacyByDayOh = {
        wood: '사람을 키우는 방식과 끊기지 않는 배움의 습관',
        fire: '이름을 걸고 남긴 사건과 무대 위의 온기',
        earth: '누군가가 쉴 수 있는 제도와 저축의 뼈대',
        metal: '남은 결과물의 품질과 더 이상 흔들리지 않는 원칙',
        water: '다음 세대가 읽을 지혜와 데이터로 남는 기억'
    };
    var legacy = legacyByDayOh[dayOh] || legacyByDayOh.earth;
    var closeScene = closeSceneByHour[sj] || '하루를 마무리짓는 그 긴 호흡은, 마지막 장면에서도 품격 있는 정리를 남기려 합니다.';
    if (data.birthTimeKnown === false) {
        closeScene = '태어난 시각을 특정할 수 없어 시간대별 상징은 열어 두고, 말년의 온도는 삼주(여섯 글자)가 쌓아 온 패턴으로 읽는 편이 맞습니다.';
    }
    var p4 = '마지막 장면. ' + lateMood + ' ' + closeScene
        + ' 마침표를 찍는 순간, ' + nTopic + joToken(nTopic, '은/는') + ' 평생 일군 성벽과 그 안의 온기를 남기고 떠나게 됩니다. '
        + nTopic + joToken(nTopic, '이/가') + ' 남길 유산은 ' + legacy + '입니다. '
        + '**말이 아니라 남는 습관 한 줄**로 고정하십시오. 그 온기는 오래 기억됩니다.';

    var timeFoot = (data.birthTimeKnown === false)
        ? '<p style="font-size:11px;color:rgba(180,186,198,0.72);line-height:1.75;margin:14px 0 0;">*(태어난 시간을 알 수 없어, 삼주(여섯 글자)의 누적된 기운을 바탕으로 말년의 방향성을 도출했습니다.)</p>'
        : '';

    // ─────────────────────────────────────────────────────────────
    // 메인 음식: 시기별 카드 5개 (어린시절·학창청년·청장년·중장년·노년)
    //   - 4기둥(연·월·일·시) 자리 풀이 + 해당 나이대 대운 풀이를 결합
    //   - 한 시기당 4-6 문장의 본문 + 화두 한 줄
    // ─────────────────────────────────────────────────────────────

    // 4기둥
    var yStem = (pillars[3] && pillars[3].h && pillars[3].h[0]) || data.yearStem || '';
    var yBranch = (pillars[3] && pillars[3].h && pillars[3].h[1]) || data.yearBranch || '';
    var mStem = (pillars[2] && pillars[2].h && pillars[2].h[0]) || data.monthStem || '';
    var mBranchPillar = (pillars[2] && pillars[2].h && pillars[2].h[1]) || data.monthBranch || '';
    var hStem = (pillars[0] && pillars[0].h && pillars[0].h[0]) || data.timeStem || data.hourStem || '';
    var hBranch = (pillars[0] && pillars[0].h && pillars[0].h[1]) || data.timeBranch || data.hourBranch || '';

    function ohOf(stem, branch) {
        var o1 = ST_OH[stem]; var o2 = BR_OH[branch];
        return { stem: o1, branch: o2 };
    }
    function favorTone(o) {
        if (!o) return 'mid';
        if (o === yong || o === hee) return 'good';
        if (o === gi || o === goo) return 'tough';
        return 'mid';
    }
    function dwInRange(lo, hi) {
        var arr = parsed.filter(function(x){ return x.age != null && x.age >= lo && x.age <= hi; });
        if (!arr.length) return null;
        var avg = arr.reduce(function(s,x){ return s + (x.sc || 0); }, 0) / arr.length;
        var labels = arr.map(function(x){ return x.gz; }).filter(Boolean);
        return { avg: avg, labels: labels.slice(0, 3) };
    }

    // 대운 흐름 묘사 (받쳐주는 결 / 시험하는 결 / 평이한 결)
    function dwTone(dw) {
        if (!dw) return null;
        if (dw.avg >= 1) return 'tail';   // 등 뒤에서 밀어 주는
        if (dw.avg <= -1) return 'side';  // 옆에서 부는
        return 'mix';                      // 번갈아
    }

    // ── ① 어린 시절 (0~14세) — 연주 자리 (조상·뿌리·가정 분위기·집안 공기)
    var yOh = ohOf(yStem, yBranch);
    var yTone = favorTone(yOh.branch || yOh.stem);
    var dw0 = dwInRange(0, 14);
    var dwT0 = dwTone(dw0);
    // 1단락 — 가정 분위기 + 부모와의 거리감
    var c1_p1_open = nmDnim(name) + joToken(nmDnim(name), '은/는') + ' 태어나신 해의 자리에 어린 시절의 풍경이 새겨져 있습니다.';
    var c1_p1_body = {
        good: ' 집 안 공기는 따뜻하고, 부모님 또는 조부모 한 분이 큰 그늘이 되어 ' + nmEulReul(name) + ' 받쳐 주는 분위기였을 가능성이 큽니다. 큰 사고 없이 잔잔하게 자라셨고, 어른들의 칭찬이 일찍부터 자존감의 뼈대로 자리잡았습니다. 그 시기에 받은 시선이 평생 ' + nmUi(name) + ' 안쪽에서 “나는 사랑받을 만한 사람”이라는 든든한 바닥을 깔아 줍니다.',
        tough: ' 부모님 중 한 분과의 거리가 다소 멀거나, 이사·전학·집안 사정 변화가 잦아서 일찍부터 눈치와 관찰력을 익히셨을 가능성이 큽니다. 어린아이가 짊어지기에 무거운 분위기였을 수 있고, 그래서 또래보다 일찍 어른스러워지셨습니다. 그 거리감이 시간이 지나서 ' + nmUi(name) + ' 독립심과 깊이 있는 관찰력으로 자라났습니다.',
        mid: ' 부모님은 ' + nmUi(name) + ' 재능을 알아보면서도 그것을 함부로 추켜세우지 않는 분이셨습니다. 한 마디 한 마디가 묵직했던 그 환경에서 어린 ' + nmDnim(name) + '은 일찍부터 “말의 무게”를 배웠고, 그래서 또래 친구들과는 조금 다른 결의 진중함을 갖게 되셨습니다. 큰 사건은 적었으나, 작은 한 마디들이 평생 가는 자리에 남았습니다.'
    }[yTone];
    // 2단락 — 학교·또래·그 시기의 구체적 사건의 결
    var c1_p2 = {
        good: ' 그 시기 ' + nmDnim(name) + '은 또래 사이에서 “든든한 친구”로 통했을 가능성이 큽니다. 학교에서는 무난하거나 약간 앞서 나가는 결이었고, 큰 사건 없이 지나간 평범한 일상들이 사실 평생의 안정감을 만들었습니다. 다만 그때 받은 사랑이 너무 익숙해서 — 어른이 되어 그 사랑이 끊겼을 때의 공허감을 크게 느끼실 수 있습니다.',
        tough: ' 학교에서는 또래보다 조숙하다는 평을 들으셨거나, 한두 번의 큰 마찰을 겪으셨을 수 있습니다. 그때의 마찰이 “나는 남들과 좀 다르구나”를 일찍 깨닫게 했고, 그게 ' + nmUi(name) + ' 색깔의 첫 출발점이 되었습니다. 그 시기 가족 중 한 명에게 받은 상처가 지금도 가끔 마음 한구석에서 욱신거리실 수 있는데 — 그건 ' + nmUi(name) + ' 잘못이 아닙니다, 그 어른의 한계였을 뿐입니다.',
        mid: ' 그 시기 ' + nmDnim(name) + '은 “조용하지만 속이 깊은 아이”로 보이셨을 가능성이 큽니다. 큰 굴곡 없이 지나간 듯해도, 어린 ' + nmDnim(name) + '은 작은 일에서도 의미를 캐냈고 — 그 습관이 평생 ' + nmUi(name) + ' 통찰력의 뿌리가 됩니다. 한 번쯤 어른들에게 “너는 너무 일찍 어른스러워서 걱정”이라는 말을 들으셨을 수 있습니다.'
    }[yTone];
    var c1Daewun = dw0 && dw0.labels.length
        ? ' 0~14세 사이의 바깥 운은 ' + (dwT0 === 'tail' ? '바깥 환경이 ' + nmEulReul(name) + ' 받쳐 주어 큰 굴곡 없이 자라셨을 흐름이었습니다.' : (dwT0 === 'side' ? '바깥 환경이 ' + nmEulReul(name) + ' 자주 시험에 들게 한 흐름이었고, 그때 익힌 인내가 평생의 자산이 됩니다.' : '큰 굴곡도, 큰 도약도 없는 평이한 흐름이라 — 집 안의 분위기가 그 시기를 가장 진하게 물들였습니다.')) : '';
    var c1Tail = '이 시기의 화두 — 이미 받은 사랑은 충분합니다. 그 사랑을 어떻게 ' + nmUi(name) + ' 것으로 가져오느냐가 다음 시기의 출발점입니다.';

    // ── ② 학창·자아형성 (14~25세) — 월주 (학업·또래·정체성·첫 진로)
    var mOh = ohOf(mStem, mBranchPillar);
    var mTone = favorTone(mOh.branch || mOh.stem);
    var dw1 = dwInRange(15, 25);
    var dwT1 = dwTone(dw1);
    var c2_p1_open = '14세에서 25세 사이는 ' + nmUi(name) + ' 청년기 — 자기 색을 본격적으로 다듬어 가는 시기입니다.';
    var c2_p1_body = {
        good: ' 학교·동아리·아르바이트 어디든 ' + nmEulReul(name) + ' 알아봐 주는 어른이나 선배가 한 명 이상 등장합니다. 그 사람의 한 마디가 ' + nmUi(name) + ' 첫 진로 선택을 빠르게 만들고, 자존감의 두 번째 층이 단단해집니다. 또래 관계도 비교적 잘 풀렸을 가능성이 크고, 그 시기에 만난 친구 중 한 명은 평생을 같이 가는 결이 됩니다.',
        tough: ' 또래 관계에서 한두 번 깊은 마찰이 있을 수 있고, 진로 선택을 두고 어른들과 의견이 갈리실 가능성이 큽니다. 가고 싶은 길이 부모님이 원하시는 길과 어긋났을 수 있고, 그래서 “내가 진짜 하고 싶은 게 뭐지?”라는 질문이 일찍부터 ' + nmUi(name) + ' 마음에 새겨졌습니다. 다만 그 마찰이 ' + nmUi(name) + ' 색을 더 또렷하게 만들어 주었습니다.',
        mid: ' 큰 풍파 없이도 ' + nmEunNeun(name) + ' 스스로 “나는 어떤 사람인가”를 일찍 묻기 시작합니다. 답을 빨리 내지 않아도 그 질문 자체가 ' + nmUi(name) + ' 평생을 받치는 축이 됩니다. 학교 성적이 잘 나오는 시기와 안 나오는 시기가 번갈아 왔을 수 있는데, 그건 능력 문제가 아니라 “관심 있는 과목에만 폭발적으로 빠지는” 결의 결과입니다.'
    }[mTone];
    var c2_p2 = {
        good: ' 첫 사랑·첫 친한 친구·첫 진로 결정 — 이 시기에 정해진 결이 30대까지 ' + nmEulReul(name) + ' 따라옵니다. 한 번의 작은 성공(상·합격·인정)이 “나는 이 길로 가도 되겠구나”를 확신시켜 주었을 가능성이 크고, 그 확신이 청장년기의 출발점이 됩니다. 다만 너무 일찍 정해진 길에 갇히지 않도록, 20대 중반에 한 번은 다른 결로의 시도를 해 보시는 편이 좋습니다.',
        tough: ' 첫 사회 진입(대학·첫 직장·첫 자취)에서 한 번 크게 흔들리거나, 가족과의 갈등이 정점을 찍는 시기일 수 있습니다. 첫사랑에서 깊게 다치셨을 수도 있고, 그 상처가 “관계에서 나는 어떤 사람인가”를 묻게 만들었습니다. 그때의 흔들림이 ' + nmUi(name) + ' 세상을 보는 눈을 깊게 만들었고, 30대에 진짜 자기 자리를 찾을 때의 감각이 됩니다.',
        mid: ' 큰 사건보다 작은 결정들이 차곡차곡 쌓이는 결입니다. 어떤 학과를 고를지, 어떤 친구와 가까이 지낼지, 어떤 일을 시작해 볼지 — 한 번에 하나씩 결정하면서 ' + nmUi(name) + ' 색이 윤곽을 잡아 갑니다. 이 시기의 결정 중 “나도 모르게 끌렸던 한 가지”가 사실 평생의 직업이 될 가능성이 큽니다.'
    }[mTone];
    var c2Daewun = dw1 && dw1.labels.length
        ? ' 15~25세 사이의 바깥 운은 ' + (dwT1 === 'tail' ? '의외의 기회가 ' + nmEulReul(name) + ' 한 단계 끌어올리는 흐름입니다. 작은 성공 하나가 다음 10년의 토양이 됩니다.' : (dwT1 === 'side' ? '진로·관계에서 한 번 크게 흔들리는 흐름입니다. 그때의 흔들림이 ' + nmUi(name) + ' 세상을 보는 눈을 깊게 만들었습니다.' : '큰 폭의 변화보다 작은 결정들이 쌓여 방향을 잡는 흐름입니다.')) : '';
    var c2Tail = '이 시기의 화두 — 남이 기대하는 길과 ' + nmUi(name) + ' 진짜 결, 그 둘 사이의 간격을 정직하게 인정하는 일.';

    // ── ③ 청장년기 (25~45세) — 일주 (사회 진출·결혼·재물·자녀)
    var dOh = ohOf(ds, db);
    var dTone = favorTone(dOh.branch);
    var dw2 = dwInRange(25, 45);
    var dwT2 = dwTone(dw2);
    var c3_p1_open = '25세에서 45세 사이는 ' + nmUi(name) + ' 본 모습이 사회에서 본격적으로 펼쳐지는 시기입니다.';
    var c3_p1_body = ' 사주 안에서 일간(나)이 가장 활발하게 움직이는 구간이라, 직업·결혼·이주·창업·자녀 같은 굵직한 결정이 한꺼번에 몰려옵니다. ' + (dTone === 'good'
        ? '사회생활 초반의 운이 ' + nmEulReul(name) + ' 든든하게 받쳐 주어 30대 초반에 한 번 큰 성취가 가능합니다. 결혼·이직·집 마련 중 한 가지가 그 시기에 정해질 가능성이 크고, 그 결정이 평생의 큰 줄기가 됩니다.'
        : (dTone === 'tough'
            ? '다만 첫 직장이 오래 가지 못하거나 결혼·연애에서 한 번의 큰 학습이 따를 수 있습니다. 30대 중반까지는 “이게 정말 내 자리인가” 묻는 시기가 길고, 그 학습이 30대 후반의 진짜 안착을 가능하게 합니다.'
            : '화려한 도약보다 한 걸음씩 자기 자리를 다지는 결입니다. 30대 중반에는 ' + nmDnim(name) + '만의 색이 시장에서 인정받기 시작하고, 그때가 사실상의 “시작”입니다.'));
    var c3_p2 = ' 결혼은 ' + (dTone === 'good' ? '20대 후반~30대 초반에 자연스럽게 결정될 가능성이 크고, 배우자가 ' + nmUi(name) + ' 사회생활을 받쳐 주는 결입니다.' : (dTone === 'tough' ? '한 번 깊게 흔들린 뒤에 진짜 짝을 만나거나, 결혼이 30대 후반으로 늦춰질 가능성이 큽니다. 늦은 만큼 단단한 관계가 됩니다.' : '큰 굴곡 없이 30대 중반쯤에 결정될 결이고, 배우자와는 “같은 결의 사람”이라는 느낌이 강할 가능성이 큽니다.'))
        + ' 재물은 이 시기에 처음 “쌓이는” 감각을 익히게 됩니다. 30대 후반에는 ' + nmUi(name) + ' 이름이 적힌 통장·집·사업자 등록증 중 하나가 자리 잡고, 그게 평생의 자산 토대가 됩니다.'
        + ' 자녀(있다면)는 30대 초중반에 만나실 가능성이 크고, 그 자녀와의 관계가 ' + nmUi(name) + ' 안쪽 결을 한 번 더 다듬어 줍니다.';
    var c3Daewun = dw2 && dw2.labels.length
        ? ' 25~45세 사이의 바깥 운은 ' + (dwT2 === 'tail' ? '바람이 ' + nmEulReul(name) + ' 등 뒤에서 밀어 주는 시기입니다. 무리하지 않아도 결과가 따라옵니다.' : (dwT2 === 'side' ? '바람이 옆에서 부는 시기라 자주 기둥을 새로 세우셔야 합니다. 다만 그때 만든 골격이 평생의 자산입니다.' : '받쳐 주는 운과 시험하는 운이 번갈아 옵니다. 어느 쪽이든 일희일비하지 마시고 ' + nmUi(name) + ' 본업을 지키시는 편이 좋습니다.')) : '';
    var c3Tail = '이 시기의 화두 — 많이 하기보다, 가장 잘하는 한 가지에서 깊이 들어가는 일.';

    // ── ④ 중장년기 (45~65세) — 일주·시주 사이 (책임·후반전·재물 안정)
    var dw3 = dwInRange(45, 65);
    var dwT3 = dwTone(dw3);
    var c4_p1_open = '45세에서 65세 사이는 ' + nmUi(name) + ' 인생에서 가장 책임이 무거운 시기입니다.';
    var c4_p1_body = ' 자녀(있다면)의 진로, 부모님 건강, 본업의 마무리·전환, 재정의 큰 줄기가 한꺼번에 결정됩니다. 위로는 부모님 세대의 마무리를 봐 드려야 하고, 아래로는 자녀나 후배의 자리를 받쳐 주셔야 하는 — “인생의 가장 무거운 어깨”의 시기입니다. 그래서 50대 초반에는 한 번 ' + nmEulReul(name) + ' 멈춰 세우는 일(번아웃·건강 신호·관계 정리)이 찾아올 가능성이 큰데, 그 멈춤이 결국 후반전을 다시 짜는 출발점이 되어 줍니다.';
    var c4_p2 = ' ' + nmUi(name) + ' 사주는 이 시기에 ' + (isStrong
        ? '바깥보다 안쪽을 정리하는 결로 흐릅니다. 그동안 벌인 일을 차근차근 거두고, 진짜 ' + nmUi(name) + ' 것만 남기시는 시기입니다. 50대 후반에는 “이름이 적힌 한 줄” — 한 권의 책, 한 사람의 제자, 한 채의 집 — 그런 결의 결과가 손에 잡힙니다.'
        : '안쪽보다 바깥에서 새로운 무대가 열리는 결로 흐릅니다. 후반전이 진짜 무대일 수 있고, 50대에 시작한 일이 60대의 명함이 됩니다. 사실 30~40대보다 50~60대에 더 빛나는 결이라, 너무 일찍 “다 끝났다”고 마음 놓지 마십시오.')
        + ' 건강 신호가 본격적으로 시작되는 시기이기도 합니다. 50대 초반의 건강 검진을 절대 미루지 마시고, 한 가지 만성 신호가 있다면 그때부터 “관리의 습관”으로 넘어가셔야 합니다.';
    var c4Daewun = dw3 && dw3.labels.length
        ? ' 45~65세 사이의 바깥 운은 ' + (dwT3 === 'tail' ? '평생 일군 평판이 한꺼번에 결실로 돌아오는 흐름입니다. 50대에 굵직한 인정이 따릅니다.' : (dwT3 === 'side' ? '건강과 가족을 둘 다 챙기셔야 하는 흐름입니다. 무리한 확장보다 회복과 정리가 우선입니다.' : '큰 영광보다 안정과 균형이 중심이 되는 흐름입니다. 새 무대보다 다듬은 무대가 더 오래 갑니다.')) : '';
    var c4Tail = '이 시기의 화두 — 이름 한 줄을 어떻게 남길 것인가, 그리고 그 이름이 ' + nmUi(name) + ' 진짜 모습과 같은가.';

    // ── ⑤ 노년 (65세~) — 시주 (말년·자식·정리·유산)
    var hOh = ohOf(hStem, hBranch);
    var hTone = favorTone(hOh.branch || hOh.stem);
    var dw4 = dwInRange(65, 85);
    var dwT4 = dwTone(dw4);
    var c5_p1_open = '65세 이후의 풍경은 ' + nmUi(name) + ' 말년 자리에 그려 보입니다.';
    var c5_p1_body = {
        good: ' 자녀·후배·제자 중 한 사람이 ' + nmDnim(name) + '의 길을 이어갑니다. ' + nmUi(name) + ' 노년은 외롭지 않고, 짧은 글이나 한 마디 조언으로 누군가의 결정을 도울 일이 잦습니다. 가족 안에서도 “그 어른” 자리에 자연스럽게 앉으시고, 큰 소리 내지 않아도 무게가 실리는 결입니다.',
        tough: ' 노년기의 무게는 — 가까운 사람을 떠나보내는 일과, 스스로의 몸을 돌보는 일이 한꺼번에 옵니다. 60대 중반에 한 번 큰 헤어짐(부모·배우자·친구)이 따를 수 있고, 그때의 슬픔이 ' + nmUi(name) + ' 노년의 결을 결정합니다. 다만 그때까지 쌓아 둔 신뢰와 그 사람들이 ' + nmEulReul(name) + ' 든든하게 받쳐 줍니다.',
        mid: ' 화려한 무대보다 조용한 일상의 깊이가 ' + nmUi(name) + ' 노년을 빛냅니다. 한 권의 책, 한 사람과의 산책, 한 끼의 식사 — 그런 결의 일들이 평생을 마감합니다. 큰 사건이 적은 만큼 작은 일이 큰 의미가 되는 시기입니다.'
    }[hTone];
    var c5_p2 = ' 70대 이후에 ' + nmDnim(name) + '이 남기실 것은 — ' + (legacy || '평생 다듬어 온 ' + nmUi(name) + ' 결')
        + '입니다. 큰 재산이나 화려한 자리보다, ' + nmUi(name) + ' “습관 한 줄”이 후세에 남습니다. 자녀나 후배 한 명에게 ' + nmDnim(name) + '의 한 마디가 인생을 바꾸는 일이 일어날 수 있고, 그게 ' + nmUi(name) + ' 진짜 유산입니다.'
        + ' 마지막 순간의 풍경은 — ' + (closeScene || '평생 일군 성벽과 그 안의 온기를 남기고 떠나시는 결입니다.');
    var c5Daewun = dw4 && dw4.labels.length
        ? ' 60대 이후의 바깥 운은 ' + (dwT4 === 'tail' ? '쌓은 것이 한 번 더 빛나는 흐름입니다. 늦게 받는 인정이 가장 진합니다.' : (dwT4 === 'side' ? '몸을 우선하시는 흐름입니다. 무리한 일정보다 회복 시간이 더 큰 자산입니다.' : '평온한 흐름입니다. 큰 일을 벌이지 않으셔도 평생의 기록이 자연스럽게 남습니다.')) : '';
    var c5Tail = '이 시기의 화두 — 말이 아니라, 남는 습관 한 줄로 ' + nmUi(name) + ' 마지막 모습을 새기는 일.';

    function periodCard(stripe, label, ageRange, p1, p2, daewunPart, tail) {
        var bodyHtml = ''
            + '<p style="font-size:13.5px;color:var(--text);line-height:2.05;margin:0 0 12px;">' + boldStarsToStrong(_lp(p1)) + '</p>'
            + '<p style="font-size:13.5px;color:var(--text);line-height:2.05;margin:0 0 12px;">' + boldStarsToStrong(_lp(p2)) + '</p>'
            + (daewunPart ? '<p style="font-size:13px;color:var(--text-soft);line-height:1.95;margin:0 0 12px;">' + boldStarsToStrong(_lp(daewunPart)) + '</p>' : '')
            + '<p style="font-size:12.5px;color:var(--gold);line-height:1.85;margin:14px 0 0;padding-top:12px;border-top:1px dashed rgba(199,167,106,0.20);font-style:italic;">' + boldStarsToStrong(_lp(tail)) + '</p>';
        return '<div class="life-arc-card sajux-print-surface" style="margin:0 0 18px;padding:22px 22px;border-radius:12px;border:1px solid rgba(199,167,106,0.22);background:rgba(199,167,106,0.04);border-left:3px solid ' + stripe + ';">'
            + '<div style="font-size:11px;letter-spacing:0.18em;color:var(--gold);font-weight:700;margin-bottom:14px;">' + escHtmlAttr(label) + ' · ' + escHtmlAttr(ageRange) + '</div>'
            + bodyHtml
            + '</div>';
    }

    var arcCards = ''
        + periodCard('rgba(111,191,115,0.65)', '① 어린 시절', '0 ~ 14세', c1_p1_open + c1_p1_body, c1_p2, c1Daewun, c1Tail)
        + periodCard('rgba(231,111,81,0.65)',   '② 학창·자아형성', '14 ~ 25세', c2_p1_open + c2_p1_body, c2_p2, c2Daewun, c2Tail)
        + periodCard('rgba(212,175,55,0.65)',   '③ 청장년기', '25 ~ 45세', c3_p1_open + c3_p1_body, c3_p2, c3Daewun, c3Tail)
        + periodCard('rgba(201,205,210,0.50)',  '④ 중장년기', '45 ~ 65세', c4_p1_open + c4_p1_body, c4_p2, c4Daewun, c4Tail)
        + periodCard('rgba(120,140,180,0.55)',  '⑤ 노년', '65세 이후', c5_p1_open + c5_p1_body, c5_p2, c5Daewun, c5Tail);

    var arcIntro = '<p style="font-size:13.5px;color:var(--text);line-height:2;margin:0 0 16px;">'
        + boldStarsToStrong(_lp(nmDnim(name) + '은 사주 여덟 글자에 평생의 흐름이 다 담겨 있습니다. 어떤 시절에 무엇이 펼쳐질지, 어떤 시기엔 어떤 결정을 어떻게 내리시는 게 자연스러울지 — 다섯 시기로 나눠 한 흐름으로 풀어 드립니다.'))
        + '</p>';

    var arcOutro = '<div class="life-arc-tail sajux-print-surface" style="margin:18px 0 0;padding:16px 18px;border-radius:12px;background:rgba(199,167,106,0.06);border-left:3px solid var(--gold);">'
        + '<p style="font-size:13.5px;color:var(--text);line-height:1.95;margin:0;">'
        + boldStarsToStrong(_lp('다섯 시기를 한 줄로 모으면 — ' + nmDnim(name) + '의 인생은 “' + (gift || '') + '”을 받아, 그것을 언제 펼치고 언제 거둘지 그 박자를 익히는 한 편의 이야기입니다. 무대가 화려할 때는 너무 멀리 가지 마시고, 무대가 어두울 때는 너무 깊이 가라앉지 마십시오. ' + nmUi(name) + ' 사주는 늘 그 사이의 길을 알려 주고 있습니다.'))
        + '</p></div>';

    return '<div id="sec-life-panorama" class="report-chapter chapter-start sajux-panel-plain" style="margin:28px 0 40px;padding:24px 22px;border-radius:14px;border:1px solid rgba(199,167,106,0.30);background:transparent;">'
        + '<div style="font-size:11px;letter-spacing:0.2em;color:rgba(199,167,106,0.85);margin-bottom:10px;font-weight:700;">메인 — 인생 한 흐름</div>'
        + '<h2 style="font-family:Noto Sans KR,sans-serif;font-size:23px;font-weight:700;color:var(--text);margin:0 0 8px;line-height:1.45;letter-spacing:-0.01em;">' + escHtmlAttr(buildLifePanoramaTitle(data)) + '</h2>'
        + '<p style="font-size:12px;color:rgba(199,167,106,0.75);margin:0 0 20px;letter-spacing:0.04em;">' + escHtmlAttr(nmDnim(name) + '의 한 편 — 태어남에서 마지막 순간까지') + '</p>'
        + arcIntro
        + arcCards
        + arcOutro
        + '<div class="life-arc-poetic" style="margin-top:24px;padding-top:20px;border-top:1px dashed rgba(199,167,106,0.25);">'
        + '<div style="font-size:11px;letter-spacing:0.18em;color:rgba(199,167,106,0.70);margin-bottom:10px;font-weight:700;">시적 풍경 — 같은 흐름을 다른 결로</div>'
        + '<p style="font-size:13px;color:var(--text-soft);line-height:2;margin:0 0 12px;">' + _lp(p1) + '</p>'
        + '<p style="font-size:13px;color:var(--text-soft);line-height:2;margin:0 0 12px;">' + _lp(p2) + '</p>'
        + '<p style="font-size:13px;color:var(--text-soft);line-height:2;margin:0 0 12px;">' + _lp(p3) + '</p>'
        + '<p style="font-size:13px;color:var(--text-soft);line-height:2;margin:0;">' + _lp(p4) + '</p>'
        + '</div>'
        + timeFoot
        + buildPart1DeepHookHTML(data)
        + '</div>';
}

// ===================================================================
// buildCoverPage: 표지 페이지
// ===================================================================
function buildCoverPage(data) {
    var logoLight = getReportAssetUrl('sajux-logo-light.png');
    var logoDark = getReportAssetUrl('sajux-logo-dark.png');
    return `<div id="sec-cover" class="cover-page chapter-start" style="display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:90vh;padding:72px 28px 56px;text-align:center;border-bottom:1px solid rgba(199,167,106,0.12);margin-bottom:56px;">
        <div class="sajux-logo-wrap" style="width:100%;max-width:90vw;margin:0 auto;display:flex;flex-direction:column;justify-content:center;align-items:center;">
            <div class="sajux-logo-cover-row" style="display:flex;justify-content:center;align-items:center;width:100%;">
                <img class="sajux-logo light sajux-logo-cover-print" src="${logoLight}" alt="SAJU X 로고" loading="eager" decoding="sync" style="width:clamp(320px,55vw,600px);max-width:100%;height:auto;margin:0 auto;" />
                <img class="sajux-logo dark sajux-logo-cover-screen" src="${logoDark}" alt="SAJU X 로고" loading="eager" decoding="sync" style="width:clamp(320px,55vw,600px);max-width:100%;height:auto;margin:0 auto;" />
            </div>
            <div id="sec-book-intro" class="sajux-intro-block" style="width:100%;max-width:760px;margin:24px auto 0;text-align:center;">
                <div class="sajux-intro-heading" style="font-size:13px;letter-spacing:0.12em;color:rgba(199,167,106,0.9);margin-bottom:16px;font-weight:700;">사주X란?</div>
                <div class="intro-text-container">
                    <p style="margin-bottom: 12px;">사주X는 X-파일처럼, 고객님의 깊은 내면과 흐름을 조용히 비춰보는 비밀문서입니다.</p>
                    <p>또한 사주X의 X는 사주를 이루는 네 개의 기둥이 서로 이어져 완성되는, 한 사람의 운명 구조를 상징합니다.</p>
                </div>
            </div>
        </div>
    </div>`;
}

// ===================================================================
// buildBookIntroPage: 소개 (표지 다음)
// ===================================================================
function buildBookIntroPage(data) {
    return '';
}

// ===================================================================
// buildClientCoverPage: 고객명 표지 (소개 다음)
// ===================================================================
function buildClientCoverPage(data) {
    const name = data.name || '사주 분석 대상자';
    const iljuKey = (data.dayStem||'') + (data.dayBranch||'');
    const coverLine = formatCoverBirthLine(data) || (data.birthStr || '');
    const dbEntry = getIljuDbEntry(data, iljuKey);
    const iljuTitle = dbEntry.title || iljuKey;
    const ILJU_ANIMAL = {'甲子':'쥐(자)','乙丑':'소(축)','丙寅':'호랑이(인)','丁卯':'토끼(묘)','戊辰':'용(진)','己巳':'뱀(사)','庚午':'말(오)','辛未':'양(미)','壬申':'원숭이(신)','癸酉':'닭(유)','甲戌':'개(술)','乙亥':'돼지(해)','丙子':'쥐(자)','丁丑':'소(축)','戊寅':'호랑이(인)','己卯':'토끼(묘)','庚辰':'용(진)','辛巳':'뱀(사)','壬午':'말(오)','癸未':'양(미)','甲申':'원숭이(신)','乙酉':'닭(유)','丙戌':'개(술)','丁亥':'돼지(해)','戊子':'쥐(자)','己丑':'소(축)','庚寅':'호랑이(인)','辛卯':'토끼(묘)','壬辰':'용(진)','癸巳':'뱀(사)','甲午':'말(오)','乙未':'양(미)','丙申':'원숭이(신)','丁酉':'닭(유)','戊戌':'개(술)','己亥':'돼지(해)','庚子':'쥐(자)','辛丑':'소(축)','壬寅':'호랑이(인)','癸卯':'토끼(묘)','甲辰':'용(진)','乙巳':'뱀(사)','丙午':'말(오)','丁未':'양(미)','戊申':'원숭이(신)','己酉':'닭(유)','庚戌':'개(술)','辛亥':'돼지(해)','壬子':'쥐(자)','癸丑':'소(축)','甲寅':'호랑이(인)','乙卯':'토끼(묘)','丙辰':'용(진)','丁巳':'뱀(사)','戊午':'말(오)','己未':'양(미)','庚申':'원숭이(신)','辛酉':'닭(유)','壬戌':'개(술)','癸亥':'돼지(해)'};
    const animal = ILJU_ANIMAL[iljuKey] || '';
    const ds = data.dayStem || (iljuKey ? iljuKey.charAt(0) : '') || '';
    const dbch = data.dayBranch || (iljuKey && iljuKey.length > 1 ? iljuKey.charAt(1) : '') || '';
    const BRANCH_ANIMAL = {'子':'쥐','丑':'소','寅':'호랑이','卯':'토끼','辰':'용','巳':'뱀','午':'말','未':'양','申':'원숭이','酉':'닭','戌':'개','亥':'돼지'};
    const animalPlain = (animal ? animal.replace(/\([^)]*\)/g, '') : '') || BRANCH_ANIMAL[dbch] || '';
    const STEM_KR = {'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계'};
    const BRANCH_KR = {'子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    const iljuKorean = (STEM_KR[ds] || '') + (BRANCH_KR[dbch] || '');
    const iljuLabel = iljuKorean || iljuTitle || iljuKey;
    const iljuKoreanLabel = iljuKorean ? (iljuKorean + '일주') : ((iljuKey || '').trim() ? (iljuKey + '일주') : '일주');
    const iljuAnimalLabel = iljuTitle || animalPlain || '';
    const STEM_COLOR_KR = {'甲':'푸른','乙':'푸른','丙':'붉은','丁':'붉은','戊':'노란','己':'노란','庚':'하얀','辛':'하얀','壬':'검은','癸':'검은'};
    const iljuMeaning = ((STEM_COLOR_KR[ds] || '') + (animalPlain ? (' ' + animalPlain) : '')).trim() || iljuAnimalLabel || animalPlain;
    const animalHighlight = (iljuMeaning || animalPlain || '').trim();

    function hc(ch) {
        return (typeof HAN_COLOR !== 'undefined' && HAN_COLOR[ch]) ? HAN_COLOR[ch] : '';
    }
    function pairSpans(ch1, ch2) {
        if (!ch1 || !ch2) return (ch1||'') + (ch2||'');
        const c1 = hc(ch1), c2 = hc(ch2);
        return '<span class="' + c1 + '">' + ch1 + '</span><span class="' + c2 + '">' + ch2 + '</span>';
    }

    const iljuBig = pairSpans(ds, dbch);
    const STEM_EN = {"甲":"jia","乙":"yi","丙":"bing","丁":"ding","戊":"wu","己":"ji","庚":"geng","辛":"xin","壬":"ren","癸":"gui"};
    const BRANCH_EN = {"子":"zi","丑":"chou","寅":"yin","卯":"mao","辰":"chen","巳":"si","午":"wu","未":"wei","申":"shen","酉":"you","戌":"xu","亥":"hai"};
    const animalImage = '../zodiac_en/' + (STEM_EN[ds]||'bing') + '_' + (BRANCH_EN[dbch]||'yin') + '.png';

    return `<div id="sec-client-cover" class="cover-page chapter-start" style="display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:90vh;padding:78px 28px 72px;text-align:center;border-bottom:1px solid rgba(199,167,106,0.12);margin-bottom:56px;">
        <div class="cover-brush-block" style="margin-top:0;">
            <p class="cover-brush-name">${escHtmlAttr(name)}님의 사주풀이</p>
            
        </div>

        <div style="width:96px;height:1px;background:rgba(199,167,106,0.36);margin:38px auto 28px;"></div>

        <div style="width:110px;height:110px;margin:2px auto 12px;display:flex;align-items:center;justify-content:center;"><img src="${animalImage}" alt="${animalPlain || '일주 동물'}" loading="lazy" style="width:100%;height:100%;object-fit:contain;display:block;"/></div>
        <div style="font-size:30px;line-height:1.15;margin:0 0 6px;">${iljuBig}</div>
        ${animalHighlight ? `<div class="animal-symbol">${nmUi(name)} 상징 동물은 <span class="cover-highlight">${escHtmlAttr(animalHighlight)}</span>입니다.</div>` : ''}
        ${coverLine ? `<div class="birth-info">${escHtmlAttr(coverLine)}</div><p style="margin:10px 0 0;font-size:11px;line-height:1.6;color:rgba(180,185,195,0.75);">※ 대운·연령 표기는 만 나이(양력 생일 기준)입니다.</p>` : `<p style="margin:10px 0 0;font-size:11px;line-height:1.6;color:rgba(180,185,195,0.75);">※ 대운·연령 표기는 만 나이(양력 생일 기준)입니다.</p>`}

        <div style="margin-top:38px;font-size:10px;color:rgba(210,214,223,0.34);letter-spacing:0.14em;">${formatReportAccessLine(data)}</div>
    </div>`;
}

// ===================================================================
// buildForewordPage: 머릿말 (구버전)
//   - 더 이상 인트로 구간에 노출하지 않습니다.
//   - buildReportFooterUtilities()가 문서 최하단에서 동일한 컨텐츠를 묶어
//     이용 안내·열람 정책·면책 고지를 한 번에 보여줍니다.
//   - 외부 호출 호환을 위해 빈 문자열을 반환하도록만 남겨 두었습니다.
// ===================================================================
function buildForewordPage(data) {
    return '';
}

// ===================================================================
// buildReportFooterUtilities: 리포트 본문이 끝난 뒤 문서 최하단에 묶어
//   1) PDF 저장 안내 + 인쇄 버튼
//   2) 이용 안내(법적 안내·만 나이 표기·권장 사용법·보관 정책)
//   3) 짧은 면책 고지
//   를 하나의 블록으로 보여 줍니다. UX를 흩뜨리지 않도록 메인 콘텐츠
//   사이가 아니라 가장 마지막에서만 등장합니다.
// ===================================================================

/** 보고서 본문이 끝난 직후, 자미두수(별첨) 앞에 두는 서프라이즈 인트로. */
function buildZiweiSurpriseIntro(data) {
    var name = (data && data.name) ? data.name : '고객';
    return '<div class="ziwei-surprise-intro" style="margin:36px 0 0;padding:26px 24px;border-radius:16px;'
        + 'background:linear-gradient(135deg, rgba(122,184,212,0.10), rgba(199,167,106,0.06));'
        + 'border:1px solid rgba(122,184,212,0.30);text-align:center;">'
        + '<div style="font-size:10px;letter-spacing:0.22em;color:rgba(157,211,255,0.80);font-weight:700;margin-bottom:10px;">SURPRISE · 보너스 챕터</div>'
        + '<h2 style="font-family:\'Noto Sans KR\',sans-serif;font-size:24px;font-weight:800;color:#fff;margin:0 0 12px;line-height:1.4;letter-spacing:-0.01em;">끝난 줄 알았죠?</h2>'
        + '<p style="font-size:14px;color:#cfe1ea;line-height:1.95;margin:0 auto 8px;max-width:620px;">'
        + voicePolishParagraph(data, nmDnim(name) + ', 사실 하나 더 준비되어 있어요. 사주는 “언제”와 “어떤 결”을 알려 주는 거울이지만, '
            + '<strong>자미두수(紫微斗數)</strong>는 같은 인생을 “어떤 무대 위에서 어떤 별빛으로 살아가는지” 비춰 주는 또 다른 거울이에요. '
            + '대만·중국 등지에서 발전한 별자리 기반의 점성 체계로, 한 사람의 인생을 <strong>12개의 무대(궁)</strong>로 나누고 그 위에 14개의 별을 놓아 풀어 보는 방식이에요.')
        + '</p>'
        + '<p style="font-size:13px;color:#a8c4d4;line-height:1.9;margin:0 auto;max-width:600px;">'
        + voicePolishParagraph(data, '같은 인생을 다른 렌즈로 한 번 더 비추는 보너스 챕터예요. 본문이 길었으니 가볍게, 본인이 가장 신경 쓰이는 자리(연애·돈·일·가족 중 하나)만 골라 그 자리의 풀이 한 줄에 마음을 두고 읽어 보십시오.')
        + '</p>'
        + '</div>';
}

/** 보고서 말미 리뷰 안내 카드 — 문구만 (외부 링크·버튼 없음). */
function buildReviewCallout(data) {
    var name = (data && data.name) ? data.name : '고객';

    return '<div id="sec-review-callout" class="report-review-callout sajux-glass-heavy" style="margin:40px auto 32px;padding:32px 26px;border-radius:22px;text-align:center;max-width:640px;">'
        + '<div style="font-size:10px;letter-spacing:0.22em;color:var(--gold);font-weight:700;margin-bottom:12px;opacity:0.9;">REVIEW · 잠깐만요</div>'
        + '<h3 class="review-callout-heading" style="font-family:\'Noto Sans KR\',sans-serif;font-size:clamp(17px,4vw,20px);font-weight:800;color:#fff;margin:0 0 16px;line-height:1.5;">'
        + nmDnim(name) + ', 마지막 한 가지만 부탁드려도 될까요?</h3>'
        + '<p style="font-size:14px;color:rgba(232,228,218,0.88);line-height:1.95;margin:0 auto 8px;max-width:560px;">'
        + voicePolishParagraph(data, '저희 시스템이 마음에 드셨거나, 또는 아쉬운 점이 있으셨다면 <strong>리뷰로 남겨 주세요.</strong> 별 다섯 개도 좋고, “이 부분은 좀 더 자세했으면 좋겠어요” 같은 한 줄도 좋아요. ' + nmUi(name) + ' 한마디가 다음 분의 보고서를 한 단계 더 따뜻하게 만들어 줍니다.')
        + '</p>'
        + '<p style="font-size:12.5px;color:rgba(255,255,255,0.48);line-height:1.85;margin:10px auto 0;max-width:480px;">'
        + voicePolishParagraph(data, '여기까지 함께해 주셔서 고마워요. 한 줄의 리뷰가 사주X의 가장 큰 응원입니다.')
        + '</p>'
        + '</div>';
}

function buildReportFooterUtilities(data) {
    var name = (data && data.name) ? data.name : '고객';
    var nmDn = nmDnim(name);
    var accessLine = formatReportAccessLine(data);
    var reportDate = getReportBaseDate(data);
    var reportDateStr = reportDate.getFullYear() + '년 ' + (reportDate.getMonth() + 1) + '월 ' + reportDate.getDate() + '일';

    var cardStyle = 'text-align:left;padding:16px 18px;border-radius:12px;margin-bottom:14px;';
    var headStyle = 'font-size:12px;color:var(--gold);letter-spacing:0.08em;margin-bottom:8px;font-weight:700;';
    var pStyle = 'margin:0;font-size:13px;line-height:1.9;color:#d6dae2;';

    var html = ''
        + '<section id="sec-report-footer-utilities" class="report-footer-utilities" '
        + 'style="margin:48px auto 0;padding:44px 24px 56px;max-width:720px;">'

        + '<div style="font-size:10px;letter-spacing:0.22em;color:rgba(199,167,106,0.72);margin-bottom:12px;font-weight:700;text-align:center;">[ 리포트 부록 · 이용 안내 ]</div>'
        + '<h2 style="font-family:\'Noto Sans KR\',serif;font-size:22px;font-weight:700;color:var(--text,rgba(255,255,255,0.95));margin:0 0 6px;text-align:center;line-height:1.5;">' + escHtmlAttr(nmDn) + ', 함께한 여정 — 여기까지 동행해 주시느라 수고 많으셨어요</h2>'
        + '<p style="margin:0 0 22px;font-size:12.5px;line-height:1.85;color:var(--text-dim,rgba(255,255,255,0.6));text-align:center;">본문은 모두 마무리되었어요. 아래는 PDF 저장과 보관 정책, 그리고 짧은 안내 몇 가지를 한 자리에 정리해 둔 부록입니다.</p>'

        // ── 1) PDF 저장 안내 + 인쇄 버튼 (30일 보관 → 필수 다운로드 강조)
        + '<div class="sajux-access-note sajux-glass-heavy" style="text-align:left;margin:0 0 18px;padding:16px 18px;border-radius:12px;font-size:13px;line-height:1.9;">'
        + '<div style="' + headStyle + '">열람 · PDF 저장 안내</div>'
        + '<p style="' + pStyle + '">이 리포트는 발행일(<strong>' + reportDateStr + '</strong>)로부터 <strong>30일</strong> 동안만 같은 링크에서 보실 수 있어요. 그 이후에는 다시 들어오기 어려울 수 있으니, 오늘 안에 <strong>PDF로 한 번 꼭 저장</strong>해 두시기를 권해 드립니다.</p>'
        + '<p style="margin:6px 0 0;font-size:13px;line-height:1.9;color:#d6dae2;">브라우저에서 <strong>인쇄 → PDF로 저장</strong>을 한 번만 실행해 두시면, 링크 만료 이후에도 같은 문서를 두고두고 다시 펼쳐 보실 수 있어요.</p>'
        + '<div style="display:flex;justify-content:center;margin-top:14px;">'
        + '<button type="button" class="sajux-pdf-wide-btn pdf-btn" onclick="window.print()" style="margin:0;max-width:320px;">PDF로 저장하기</button>'
        + '</div>'
        + '</div>'

        // ── 2) 이용 안내 3종 ──
        + '<div class="sajux-footer-note sajux-glass-heavy" style="' + cardStyle + '">'
        + '<div style="' + headStyle + '">이 리포트를 어떻게 받아 주시면 좋을지</div>'
        + '<p style="' + pStyle + '">이 리포트는 명리학(사주팔자)을 토대로 정리한 운명 해석 자료예요. 각 장의 풀이는 동양철학의 오행·십성·대운 흐름을 근거로 하고, 실제 결과는 ' + escHtmlAttr(nmDn) + '의 선택과 노력에 따라 얼마든지 달라질 수 있습니다. 인생의 방향을 잡으실 때 곁에 두고 참고하실 수 있는 지도라고 여겨 주세요.</p>'
        + '</div>'

        + '<div class="sajux-footer-note sajux-glass-heavy" style="' + cardStyle + '">'
        + '<div style="' + headStyle + '">법적 안내</div>'
        + '<p style="' + pStyle + '">투자·의료·법률·세무 등 전문 자문을 대체하는 자료는 아니에요. 최종 판단과 그 책임은 이용자 본인에게 있다는 점만 가볍게 기억해 주시면 충분합니다.</p>'
        + '</div>'

        + '<div class="sajux-footer-note sajux-glass-heavy" style="' + cardStyle + 'margin-bottom:0;">'
        + '<div style="' + headStyle + '">연령 표기 (만 나이 기준)</div>'
        + '<p style="' + pStyle + '">대운·세운·연령대 조언에 등장하는 ○○세는 모두 <b>만 나이</b>(양력 생일 기준)예요. 한국식 세는 나이(생일을 기점으로 ±1)와는 숫자가 다를 수 있으니, 본문 숫자를 비교하실 때 살짝 참고만 해 주세요.</p>'
        + '</div>'

        // ── 3) 짧은 면책 고지 (정리)
        + '<p class="premium-disclaimer" style="text-align:left;margin:22px 0 0;font-size:11.5px;line-height:1.9;color:var(--text-dim, #777);">'
        + '※ ' + getAgeBasisNoteHtml('disclaimer')
        + '</p>'

        + '</section>';

    return html;
}


// ===================================================================
// buildTOC: 목차 페이지
// ===================================================================
function buildTOC(data) {
    var tocNm = nmDnim((data && data.name) || '고객');
    var gHead = 'font-size:11.5px;font-weight:800;color:rgba(212,175,55,0.98);letter-spacing:0.14em;margin:26px 0 10px;padding-bottom:8px;border-bottom:1px solid rgba(199,167,106,0.28);';
    var gSub = 'display:block;font-size:10.5px;color:var(--text-dim,rgba(255,255,255,0.55));font-weight:600;letter-spacing:0.04em;margin-top:5px;';
    var row = 'display:flex;align-items:baseline;gap:12px;padding:11px 0 11px 14px;border-bottom:1px solid rgba(128,128,128,0.12);';
    var groups = [
        { head: '인트로', sub: '전략 요약 · 열람 안내', items: [
            { t: '표지 · 소개 · 고객 정보', s: '브랜드 톤 · 생년월일시 확인', p: '—' },
            { t: '프리미엄 브리프 — 4대 실행 모듈', s: '은유 제목 · PDF 저장', p: '—' }
        ]},
        { head: '1부 — 나라는 사람', sub: '원국 · 기질 · 타고난 패턴', items: [
            { t: '인생 한 편 — 나라는 사람', s: '태어남부터 오늘까지 서사', p: '—' },
            { t: '일주 프로필 · 만세력 읽는 법 · 원국 표', s: '표 아래 원국 구조 한 줄 요약', p: '—' },
            { t: '원국 해부 · 오행 · 십성', s: '기본 풀이와 참고 분석', p: '—' }
        ]},
        { head: '2부 — 지금 이 시절', sub: '현재의 운세 · 앞으로의 운', items: [
            { t: '현재의 운세', s: '대운 · 세운 · 월운 · 다섯 영역', p: '—' },
            { t: '인생 80년 지도', s: '10년마다 바뀌는 큰 계절', p: '—' },
            { t: '앞으로의 운', s: '다가올 대운 · 세운 · 월운', p: '—' }
        ]},
        { head: '3부 — 삶의 네 영역', sub: '재물 · 직업 · 애정 · 건강', items: [
            { t: '4대 영역 레이더', s: '타고난 에너지 영역 비교', p: '—' },
            { t: '재물 전략', s: '용신 기반 재물 타이밍', p: '6p' },
            { t: '직업 · 소명 · 애정 · 건강', s: '일주×십성 패턴 · 배우자궁 · 체질', p: '10p' }
        ]},
        { head: '4부 — 지금부터의 선택', sub: '개운법 · 일상 적용', items: [
            { t: '[별첨] 자미두수 운명 설계도', s: '심리·재물·관계 축 근사 해석', p: '—' },
            { t: '개운법 · 실행 지침', s: '루틴 · 공간 · 나이대별 조언', p: '—' }
        ]}
    ];
    var body = '';
    groups.forEach(function (grp) {
        body += '<div style="' + gHead + '">' + grp.head + '<span style="' + gSub + '">' + grp.sub + '</span></div>';
        grp.items.forEach(function (it) {
            body += '<div style="' + row + '"><div style="font-size:10px;color:var(--gold);min-width:20px;font-weight:700;">·</div><div style="flex:1;"><div style="font-size:14px;font-weight:600;color:var(--text,rgba(255,255,255,0.88));margin-bottom:2px;">' + it.t + '</div><div style="font-size:11.5px;color:var(--text-dim,rgba(255,255,255,0.50));">' + it.s + '</div></div><div style="font-size:11px;color:rgba(199,167,106,0.45);min-width:32px;text-align:right;">' + it.p + '</div></div>';
        });
    });

    return '<div class="toc-page" style="padding:60px 40px 80px;border-bottom:1px solid rgba(199,167,106,0.1);margin-bottom:48px;">' +
        '<div style="font-size:10px;letter-spacing:0.22em;color:rgba(199,167,106,0.75);margin-bottom:14px;font-weight:700;">[ 리포트 핵심 목차 ]</div>' +
        '<div style="font-family:\'Noto Sans KR\',serif;font-size:30px;font-weight:700;color:var(--text,rgba(255,255,255,0.95));margin-bottom:6px;">목차</div>' +
        '<div style="font-size:13px;color:var(--text-dim,rgba(255,255,255,0.55));margin-bottom:32px;">X-SAJU MASTER — 컨설팅 보고서형 4부 구조</div>' +
        '<div style="width:60px;height:2px;background:var(--gold);margin-bottom:28px;opacity:0.4;"></div>' +
        body +
        '</div>';
    // ※ 명리학 설명·발행 정책 안내는 본문 흐름을 끊지 않도록 문서 최하단(buildReportFooterUtilities)으로 이동했습니다.
}

function buildChapterPersonality(data) {
    const name = data.name || '고객';
    const stemEl = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'}[data.dayStem] || 'earth';
    const iljuKey = (data.dayStem || '') + (data.dayBranch || '');
    const dbEntry = getIljuDbEntry(data, iljuKey);

    const PROS = {
        wood: ['목표를 향해 흔들림 없이 나아가는 불굴의 추진력','새로운 시작을 두려워하지 않는 개척자 정신','타인에 대한 따뜻한 공감과 진심 어린 배려','한 번 믿으면 끝까지 믿는 강한 의리와 신뢰'],
        fire: ['어떤 공간에 있어도 분위기를 이끄는 자연스러운 카리스마','뜨거운 열정으로 주변 사람들을 감화시키는 능력','직관이 탁월하여 기회를 빠르게 포착하는 감각','솔직하고 명쾌하여 신뢰받는 대인 관계'],
        earth: ['어떤 상황에도 흔들리지 않는 묵직한 안정감','모든 사람을 품어내는 포용력과 깊은 신뢰감','실용적 판단력과 꼼꼼한 실행력','오래도록 변하지 않는 중후한 책임감'],
        metal: ['불필요한 것을 과감히 쳐내는 냉철한 판단력','한 번 결정하면 끝까지 밀어붙이는 강한 의지','원칙과 기준이 명확하여 흔들리지 않는 신뢰감','탁월한 집중력으로 전문성을 극대화하는 능력'],
        water: ['상황의 본질을 꿰뚫어보는 날카로운 통찰력','유연하게 변화에 적응하면서도 방향을 잃지 않는 지혜','깊은 감수성으로 타인의 감정을 읽는 공감 능력','광대한 지식 욕구와 끊임없는 자기계발 의지']
    };
    const CONS = {
        wood: ['자존심이 강해 타인의 조언을 받아들이기 어려울 때가 있음','고집으로 인해 불필요한 마찰을 빚기도 함','완벽주의 성향으로 스스로에게 지나치게 엄격함','남에게 속마음을 잘 드러내지 않아 오해를 받을 수 있음'],
        fire: ['충동적으로 행동하여 수습이 필요한 상황을 만들기도 함','감정 기복이 커서 주변 사람들이 눈치를 보게 될 수 있음','지속력보다 폭발력이 강해 마무리가 약한 편','자신의 방식을 강요하는 경향으로 갈등이 생기기도 함'],
        earth: ['변화에 대한 저항이 강해 새로운 기회를 놓치기도 함','지나친 신중함이 결단 타이밍을 늦출 수 있음','타인에게 지나치게 의존하거나 집착하는 경향','자신의 감정을 억누르다가 폭발하는 패턴이 있음'],
        metal: ['감정을 잘 표현하지 않아 냉정하게 보이기도 함','완벽주의적 기준으로 주변 사람들을 지치게 할 수 있음','자기 방식을 고집하여 협업이 어려울 때가 있음','비판에 민감하여 상처를 오래 간직하는 경향'],
        water: ['결정을 내리지 못하고 끝없이 분석하는 경향','지나친 감수성으로 상처를 받기도 쉬운 편','생각이 너무 많아 실행이 늦어지는 경우가 있음','비밀이 많아 가까운 사람들도 속을 알기 어려움']
    };
    const GOOD_MATCH = {
        wood: '화 기운을 가진 사람 — 당신의 에너지를 받아 빛나는 동반자. 수 기운을 가진 사람 — 당신을 키워주는 든든한 후원자.',
        fire: '토 기운을 가진 사람 — 당신의 열정을 현실로 만들어주는 파트너. 목 기운을 가진 사람 — 당신에게 끊임없는 영감을 주는 동료.',
        earth: '금 기운을 가진 사람 — 당신의 포용력 위에서 빛나는 보석. 화 기운을 가진 사람 — 당신의 안정 위에 열정을 더하는 활력소.',
        metal: '수 기운을 가진 사람 — 당신의 날카로움을 부드럽게 다듬어주는 존재. 토 기운을 가진 사람 — 당신이 믿고 의지할 수 있는 안정된 파트너.',
        water: '목 기운을 가진 사람 — 당신의 지혜를 흡수하여 함께 성장하는 동반자. 금 기운을 가진 사람 — 당신의 흐름에 명확한 방향성을 부여하는 나침반.'
    };
    const BAD_MATCH = {
        wood: '금 기운이 강한 사람 — 당신의 의지를 꺾으려는 충돌이 잦습니다. 서로의 강점을 인정하는 훈련이 필요합니다.',
        fire: '수 기운이 강한 사람 — 당신의 열정을 식히려는 에너지와 잦은 충돌이 생깁니다. 감정적 대결을 피하십시오.',
        earth: '목 기운이 강한 사람 — 당신의 안정을 흔들고 변화를 강요하는 패턴이 생깁니다. 변화 속에서 중심을 잡는 연습이 필요합니다.',
        metal: '화 기운이 강한 사람 — 당신의 원칙을 무너뜨리려는 충돌이 잦습니다. 감정적 압박에 흔들리지 않는 편이 좋습니다.',
        water: '토 기운이 강한 사람 — 당신의 자유로운 흐름을 막으려는 에너지가 스트레스를 유발합니다. 경계 설정이 중요합니다.'
    };

    const pros = PROS[stemEl] || PROS['earth'];
    const cons = CONS[stemEl] || CONS['earth'];
    const goodMatch = voicePolishParagraph(data, GOOD_MATCH[stemEl] || '');
    const badMatch = voicePolishParagraph(data, BAD_MATCH[stemEl] || '');
    const iljuTitle = dbEntry.title || (nmUi(name) + ' 일주');

    var chHeadA = buildChapterHeadTopicFirst('부록', SAJUX_SECTION_LABELS.appendix, '');
    var chIntroA = buildChapterIntroHtml(data, 'appendix');
    return `<div class="report-chapter" id="sec-personality">
        ${chHeadA}
        ${chIntroA}
        <p class="ch-text" style="margin-bottom:14px;">일간 오행은 **판단 속도·리스크 취향·관계 거리**를 한 번에 묶은 축입니다. 아래는 그 축에서 나오는 마찰입니다.</p>
        <p class="ch-text" style="margin-bottom:20px;">[${iljuTitle}]${typeof getJosa === 'function' ? getJosa(iljuTitle, '을/를') : '을'} 타고난 ${nmKkeEunNeun(name)} 성격은 낙인이 아니라 **반복 패턴의 이름**입니다. 이 표를 읽고 **한 가지만** 고치면 체감이 납니다.</p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
            <div style="background:rgba(0,200,83,0.06);border-radius:12px;padding:18px;">
                <div style="font-size:13px;font-weight:700;color:#00C853;margin-bottom:12px;letter-spacing:1px;">✦ 강점 (${nmUi(name)} 무기)</div>
                ${pros.map((p,i) => '<div style="display:flex;gap:8px;margin-bottom:10px;"><span style="color:#00C853;font-weight:700;flex-shrink:0;">' + (i+1) + '.</span><span style="font-size:13.5px;color:#ddd;line-height:1.7;">' + p + '</span></div>').join('')}
            </div>
            <div style="background:rgba(231,76,60,0.06);border-radius:12px;padding:18px;">
                <div style="font-size:13px;font-weight:700;color:#e74c3c;margin-bottom:12px;letter-spacing:1px;">⚠ 약점 (알고 다뤄야 할 것들)</div>
                ${cons.map((c,i) => '<div style="display:flex;gap:8px;margin-bottom:10px;"><span style="color:#e74c3c;font-weight:700;flex-shrink:0;">' + (i+1) + '.</span><span style="font-size:13.5px;color:#ddd;line-height:1.7;">' + c + '</span></div>').join('')}
            </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
            <div style="background:rgba(199,167,106,0.07);border-radius:12px;padding:18px;">
                <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:10px;">💑 잘 맞는 유형</div>
                <div style="font-size:13.5px;color:#ddd;line-height:1.8;">${goodMatch}</div>
            </div>
            <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:18px;">
                <div style="font-size:13px;font-weight:700;color:#aaa;margin-bottom:10px;">⚡ 주의가 필요한 유형</div>
                <div style="font-size:13.5px;color:#ddd;line-height:1.8;">${badMatch}</div>
            </div>
        </div>

        <div style="background:rgba(199,167,106,0.06);border-left:3px solid var(--gold);padding:16px 18px;border-radius:0 10px 10px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">성격 총평</div>
            <p style="font-size:14px;color:#ddd;line-height:1.9;margin:0;">약점은 고정된 결함이라기보다, 아직 다듬어지지 않은 강점의 이면에 가깝습니다. 강점을 극대화하면서 약점이 발목을 잡지 않도록 관리하는 것 — ${voicePolishParagraph(data, '그것이 ' + nmDnimEunNeun(name) + ' 인생 운영의 핵심 기술입니다.')}</p>
        </div>
    </div>`;
}



window.generateDeepReport = generateDeepReport;


var HELP_DATA = {
    manse: {
        title: "만세력 원국 (사주팔자)",
        desc: "태어난 연, 월, 일, 시간을 기준으로 우주의 기운(간지)을 8개의 글자로 표현한 나의 고유한 바코드입니다.<br><br>• <b>일원(일주)</b>: 나 자신과 배우자를 의미합니다.<br>• <b>월주</b>: 나의 부모, 타고난 환경, 직업적 적성을 뜻합니다.<br>• <b>년주</b>: 조상, 초년기, 국가적 스케일을 나타냅니다.<br>• <b>시주</b>: 자식, 말년운, 은밀한 속마음을 나타냅니다."
    },
    relation: {
        title: "합 · 충 · 형 · 파 · 해",
        desc: "내 사주팔자 안의 글자들이 서로 만나서 일으키는 화학 작용입니다.<br><br>• <b>합</b>: 서로 끌어당기고 묶이는 긍정적/부정적 결합<br>• <b>충</b>: 서로 부딪혀 깨지거나 역동적인 변화를 일으킴<br>• <b>형</b>: 다듬어지고 조정되는 과정 (관재, 수술, 혹은 권력)<br>• <b>파, 해</b>: 방해, 훼방, 분리 등의 작용"
    },
    shinsal: {
        title: "신살 · 길성",
        desc: "원국에 숨겨진 특수한 기운들입니다.<br><br>• <b>천을귀인</b>: 최고의 길성으로, 위기에서 나를 돕는 귀인<br>• <b>도화살/홍염살</b>: 타인을 끌어당기는 매력과 인기<br>• <b>역마살</b>: 이동, 변화, 해외와의 인연<br>• <b>괴강살/백호살</b>: 강력한 카리스마, 압도적인 에너지와 프로 의식"
    },
    wuxing: {
        title: "오행 분포 (목화토금수)",
        desc: "우주를 구성하는 5가지 에너지가 내게 얼마나 골고루 분포되어 있는지 보여줍니다.<br><br>• <b>목</b>: 성장, 시작, 기획력<br>• <b>화</b>: 발산, 열정, 표현력<br>• <b>토</b>: 수용, 중재, 신용<br>• <b>금</b>: 결단, 규칙, 맺고 끊음<br>• <b>수</b>: 지혜, 유연성, 휴식"
    },
    sipseong: {
        title: "십성 분포",
        desc: "오행을 **일하는 방식·관계 각도**로 읽은 지표입니다. 아래는 같은 축을 다른 이름으로 설명한 것입니다.<br><br>• <b>자아·동료 축</b>: 주체성, 협업, 경쟁<br>• <b>표현·산출 축</b>: 재능, 창의, 말과 결과물<br>• <b>성과·현금 축</b>: 목표, 정산, 거래<br>• <b>조직·규범 축</b>: 직장, 명예, 책임<br>• <b>학습·지지 축</b>: 배움, 문서, 인내"
    },
    strength: {
        title: "신강 · 신약 판단",
        desc: "나를 돕는 쪽(자아·학습 축)과 에너지를 쓰게 만드는 쪽(표현·성과·조직 축)의 비율을 계산한 결과입니다.<br><br>• <b>신강</b>: 자기 주관이 뚜렷하고 밀어붙이는 힘이 강함. 외부의 압력을 잘 버팀.<br>• <b>신약</b>: 주변 환경과 타인에게 잘 맞추는 유연성과 타협성이 뛰어남.<br>• <b>중화</b>: 기운의 밸런스가 좋아 안정적임."
    },
    daeun: {
        title: "대운 (10년 단위의 큰 흐름)",
        desc: "나의 사주 원국이라는 '자동차'가 달리는 '10년 단위의 도로'입니다.<br>대운이 좋으면 고속도로를 달리는 것이고, 대운이 나쁘면 비포장도로를 달리는 것과 같습니다. 대운수(예: 3)는 해당 만 나이(양력 생일 기준)에 운의 흐름이 바뀌기 시작하는 시점을 뜻합니다. 표의 ○○세·10년 구간도 모두 만 나이로 읽으십시오. 한국식 세는 나이와 숫자가 다를 수 있습니다."
    },
    seun: {
        title: "세운 (1년 단위의 흐름)",
        desc: "매년 들어오는 운세입니다. 대운이 큰 환경이라면, 세운은 해당 연도에 일어나는 구체적인 사건과 체감되는 변화를 의미합니다."
    },
    wolun: {
        title: "월운 (한 달 단위의 흐름)",
        desc: "올해 1월부터 12월까지 매달 들어오는 운세입니다. 단기적인 계획을 세우거나 조심해야 할 달을 파악할 때 사용합니다."
    },
    yonghee: {
        title: "맞는 기운 · 부딪히는 기운",
        desc: "목·화·토·금·수 다섯 축이 나에게 **맞는지·부딪히는지**를 나눈 요약입니다.<br><br>• <b>핵심 보완</b>: 가장 크게 도움이 되는 축<br>• <b>보조 보완</b>: 핵심을 돕는 축<br>• <b>방해 축</b>: 밸런스를 흔들기 쉬운 축<br>• <b>보조 방해</b>: 방해를 키우기 쉬운 축<br>• <b>중간 축</b>: 운에 따라 좋을 때도 나쁠 때도 있는 축"
    }
};

function openHelp(key) {
    const data = HELP_DATA[key];
    if (data) {
        document.getElementById('help-title').innerHTML = data.title;
        document.getElementById('help-body').innerHTML = data.desc;
        const modal = document.getElementById('help-modal');
        modal.style.display = 'flex';
        setTimeout(() => modal.style.opacity = '1', 10);
    }
}

function closeHelp(e) {
    if (e && e.target !== document.getElementById('help-modal') && e.target.className !== 'modal-close') return;
    const modal = document.getElementById('help-modal');
    modal.style.opacity = '0';
    setTimeout(() => modal.style.display = 'none', 200);
}

var HAN_COLOR = {"甲":"wood","乙":"wood","寅":"wood","卯":"wood","丙":"fire","丁":"fire","巳":"fire","午":"fire","戊":"earth","己":"earth","辰":"earth","戌":"earth","丑":"earth","未":"earth","庚":"metal","辛":"metal","申":"metal","酉":"metal","壬":"water","癸":"water","亥":"water","子":"water"};
var HAN_KOR = {"甲":"갑","乙":"을","丙":"병","丁":"정","戊":"무","己":"기","庚":"경","辛":"신","壬":"임","癸":"계","子":"자","丑":"축","寅":"인","卯":"묘","辰":"진","巳":"사","午":"오","未":"미","申":"신","酉":"유","戌":"술","亥":"해"};
var SAJUX_HANJA_FONT = "'Noto Sans KR', sans-serif";
/** 간지 한 덩어리: 병오(丙午) — 한글(한자한자) */
function formatGanzhiPair(gStemHan, jBranchHan) {
    var g = String(gStemHan || '');
    var j = String(jBranchHan || '');
    if (!g || !j) return '';
    return (HAN_KOR[g] || g) + (HAN_KOR[j] || j) + '(' + g + j + ')';
}
/** HTML — 괄호 안 한자만 만세력과 동일 폰트 */
function formatGanzhiPairHtml(gStemHan, jBranchHan) {
    var g = String(gStemHan || '');
    var j = String(jBranchHan || '');
    if (!g || !j) return '';
    var hangul = (HAN_KOR[g] || g) + (HAN_KOR[j] || j);
    return hangul + '(<span class="sajux-hanja">' + g + j + '</span>)';
}
/** 본문 속 한자(木 등) → sajux-hanja 래핑 */
function polishHanjaInText(text) {
    return String(text == null ? '' : text).replace(/[\u4E00-\u9FFF\u3400-\u4DBF]+/g, function (m) {
        return '<span class="sajux-hanja">' + m + '</span>';
    });
}
/** 예: 2026년 병오(丙午)년 */
function formatYearWithGanzhi(yr, gStemHan, jBranchHan) {
    var p = formatGanzhiPair(gStemHan, jBranchHan);
    return p ? (String(yr) + '년 ' + p + '년') : (String(yr) + '년');
}
function formatYearWithGanzhiHtml(yr, gStemHan, jBranchHan) {
    var p = formatGanzhiPairHtml(gStemHan, jBranchHan);
    return p ? (String(yr) + '년 ' + p + '년') : (String(yr) + '년');
}
/** 예: 10월 무술(戊戌)월 */
function formatMonthWithGanzhi(monthNum, gStemHan, jBranchHan) {
    var p = formatGanzhiPair(gStemHan, jBranchHan);
    return p ? (String(monthNum) + '월 ' + p + '월') : (String(monthNum) + '월');
}
function formatMonthWithGanzhiHtml(monthNum, gStemHan, jBranchHan) {
    var p = formatGanzhiPairHtml(gStemHan, jBranchHan);
    return p ? (String(monthNum) + '월 ' + p + '월') : (String(monthNum) + '월');
}
var STEM_YANG = ["갑","병","무","경","임"];
var BRANCH_YANG = ["자","인","진","오","신","술"];
// 한자 간지(만세력 엔진 출력) — 음양 판별용
var STEM_YANG_H = ['甲','丙','戊','庚','壬'];
var BRANCH_YANG_H = ['子','寅','辰','午','申','戌'];
// 지지 → 본기 천간(지장간 정기, 만세력 십성 산출 통용)
var BRANCH_MAIN_STEM = { '子':'癸','丑':'己','寅':'甲','卯':'乙','辰':'戊','巳':'丙','午':'丁','未':'己','申':'庚','酉':'辛','戌':'戊','亥':'壬' };
var RELATION_LABELS = {
    wood: '목', fire: '화', earth: '토', metal: '금', water: '수'
};
var WUXING_ORDER = ['wood','fire','earth','metal','water'];

window.UNSUNG_MAP = {
    "甲": {"亥": "장생", "子": "목욕", "丑": "관대", "寅": "건록", "卯": "제왕", "辰": "쇠", "巳": "병", "午": "사", "未": "묘", "辛": "절", "酉": "태", "戌": "양"},
    "丙": {"寅": "장생", "卯": "목욕", "辰": "관대", "巳": "건록", "午": "제왕", "未": "쇠", "辛": "병", "酉": "사", "戌": "묘", "亥": "절", "子": "태", "丑": "양"},
    "戊": {"寅": "장생", "卯": "목욕", "辰": "관대", "巳": "건록", "午": "제왕", "未": "쇠", "辛": "병", "酉": "사", "戌": "묘", "亥": "절", "子": "태", "丑": "양"},
    "庚": {"巳": "장생", "午": "목욕", "未": "관대", "辛": "건록", "酉": "제왕", "戌": "쇠", "亥": "병", "子": "사", "丑": "묘", "寅": "절", "卯": "태", "辰": "양"},
    "壬": {"辛": "장생", "酉": "목욕", "戌": "관대", "亥": "건록", "子": "제왕", "丑": "쇠", "寅": "병", "卯": "사", "辰": "묘", "巳": "절", "午": "태", "未": "양"},
    "乙": {"午": "장생", "巳": "목욕", "辰": "관대", "卯": "건록", "寅": "제왕", "丑": "쇠", "子": "병", "亥": "사", "戌": "묘", "酉": "절", "辛": "태", "未": "양"},
    "丁": {"酉": "장생", "辛": "목욕", "未": "관대", "午": "건록", "巳": "제왕", "辰": "쇠", "卯": "병", "寅": "사", "丑": "묘", "子": "절", "亥": "태", "戌": "양"},
    "己": {"酉": "장생", "辛": "목욕", "未": "관대", "午": "건록", "巳": "제왕", "辰": "쇠", "卯": "병", "寅": "사", "丑": "묘", "子": "절", "亥": "태", "戌": "양"},
    "辛": {"子": "장생", "亥": "목욕", "戌": "관대", "酉": "건록", "辛": "제왕", "未": "쇠", "午": "병", "巳": "사", "辰": "묘", "卯": "절", "寅": "태", "丑": "양"},
    "癸": {"卯": "장생", "寅": "목욕", "丑": "관대", "子": "건록", "亥": "제왕", "戌": "쇠", "酉": "병", "辛": "사", "未": "묘", "午": "절", "巳": "태", "辰": "양"}
};

var BRANCH_HIDDEN = {
    '子':['壬','癸'],
    '丑':['癸','辛','己'],
    '寅':['戊','丙','甲'],
    '卯':['甲','乙'],
    '辰':['乙','癸','戊'],
    '巳':['戊','庚','丙'],
    '午':['丙','己','丁'],
    '未':['丁','乙','己'],
    '申':['戊','壬','庚'],
    '酉':['庚','辛'],
    '戌':['辛','丁','戊'],
    '亥':['甲','壬']
};

// 십이신살(반안·육해·재살·월살) 및 년지 상문/조객 등 공통 조견
var BRANCH_RING = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
function sanHePackFromBranch(ref) {
    if (!ref) return null;
    if (['亥','卯','未'].includes(ref)) return { banAn:'辰', woSal:'丑', jaeSal:'酉' };
    if (['寅','午','戌'].includes(ref)) return { banAn:'未', woSal:'辰', jaeSal:'子' };
    if (['巳','酉','丑'].includes(ref)) return { banAn:'戌', woSal:'未', jaeSal:'卯' };
    if (['申','子','辰'].includes(ref)) return { banAn:'丑', woSal:'戌', jaeSal:'午' };
    return null;
}
var LIUHAI_PAIR = { '子':'未','未':'子','丑':'午','午':'丑','寅':'巳','巳':'寅','卯':'辰','辰':'卯','申':'亥','亥':'申','酉':'戌','戌':'酉' };
// 평두살 대표 일주(명리 앱에서 통용되는 목록 기준)
var PYEONGDU_GZ = new Set(['甲子','甲寅','甲辰','甲戌','甲申','丙寅','丙辰','丙戌','丙午','丙子','戊寅','戊辰','戊戌','庚寅','庚辰','庚戌','壬辰','壬寅','癸巳','癸卯','丁卯','己巳','辛酉','戊午','乙酉','丁酉']);
var HYOSIN_GZ = new Set(['甲子','乙亥','丙寅','丁卯','戊午','己巳','庚辰','庚戌','辛丑','辛未','壬申','癸酉']);

var SHINSAL_LOGIC = {
    // ── 1. 천을귀인 — 일간 기준, 축·미·자·신·해·유·묘·사·인·오 ──
    '천을귀인': (gz, ec) => {
        const ds = ec.getDay()[0];
        const map = {"甲":"丑未","戊":"丑未","庚":"丑未","乙":"子申","己":"子申","丙":"亥酉","丁":"亥酉","壬":"卯巳","癸":"卯巳","辛":"寅午"};
        const targets = map[ds] || '';
        return targets.includes(gz[1]) ? '천을귀인' : '';
    },
    // ── 2. 문창귀인 — 일간 기준 ──
    '문창귀인': (gz, ec) => {
        const ds = ec.getDay()[0];
        const map = {"甲":"巳","乙":"午","丙":"申","丁":"酉","戊":"申","己":"酉","庚":"亥","辛":"子","壬":"寅","癸":"卯"};
        return map[ds] === gz[1] ? '문창귀인' : '';
    },
    // ── 3. 문곡귀인 — 일간 기준 ──
    '문곡귀인': (gz, ec) => {
        const ds = ec.getDay()[0];
        const map = {"甲":"亥","乙":"子","丙":"寅","丁":"卯","戊":"寅","己":"卯","庚":"巳","辛":"午","壬":"申","癸":"酉"};
        return map[ds] === gz[1] ? '문곡귀인' : '';
    },
    // ── 4. 양인살 — 일간 기준 ──
    '양인살': (gz, ec) => {
        const ds = ec.getDay()[0];
        const map = {"甲":"卯","丙":"午","戊":"午","庚":"酉","壬":"子"};
        return map[ds] === gz[1] ? '양인살' : '';
    },
    // ── 5. 역마살 — 연지·일지 기준 ──
    '역마살': (gz, ec) => {
        const yb = ec.getYear()[1]; const db = ec.getDay()[1];
        const map = {"亥":"巳","卯":"巳","未":"巳","申":"寅","子":"寅","辰":"寅","巳":"亥","酉":"亥","丑":"亥","寅":"申","午":"申","戌":"申"};
        return (map[yb]===gz[1] || map[db]===gz[1]) ? '역마살' : '';
    },
    // ── 6. 도화살 — 연지·일지 기준 ──
    '도화살': (gz, ec) => {
        const yb = ec.getYear()[1]; const db = ec.getDay()[1];
        const map = {"亥":"子","卯":"子","未":"子","申":"酉","子":"酉","辰":"酉","巳":"午","酉":"午","丑":"午","寅":"卯","午":"卯","戌":"卯"};
        return (map[yb]===gz[1] || map[db]===gz[1]) ? '도화살' : '';
    },
    // ── 7. 화개살 — 연지·일지 기준 ──
    '화개살': (gz, ec) => {
        const yb = ec.getYear()[1]; const db = ec.getDay()[1];
        const map = {"亥":"未","卯":"未","未":"未","申":"辰","子":"辰","辰":"辰","巳":"丑","酉":"丑","丑":"丑","寅":"戌","午":"戌","戌":"戌"};
        return (map[yb]===gz[1] || map[db]===gz[1]) ? '화개살' : '';
    },
    // ── 8. 겁살 — 연지·일지 기준 ──
    '겁살': (gz, ec) => {
        const yb = ec.getYear()[1]; const db = ec.getDay()[1];
        const map = {"申":"巳","子":"巳","辰":"巳","亥":"申","卯":"申","未":"申","寅":"亥","午":"亥","戌":"亥","巳":"寅","酉":"寅","丑":"寅"};
        return (map[yb]===gz[1] || map[db]===gz[1]) ? '겁살' : '';
    },
    // ── 9. 망신살 — 연지·일지 기준 ──
    '망신살': (gz, ec) => {
        const yb = ec.getYear()[1]; const db = ec.getDay()[1];
        const map = {"申":"亥","子":"卯","辰":"未","亥":"寅","卯":"午","未":"戌","寅":"巳","午":"酉","戌":"丑","巳":"申","酉":"子","丑":"辰"};
        return (map[yb]===gz[1] || map[db]===gz[1]) ? '망신살' : '';
    },
    // ── 10. 지살 — 연지·일지 기준 ──
    '지살': (gz, ec) => {
        const yb = ec.getYear()[1]; const db = ec.getDay()[1];
        // 지살 = 삼합 첫번째 지지와 같은 자리
        const gsMap = {"申":"寅","子":"申","辰":"子","亥":"巳","卯":"亥","未":"卯","寅":"申","午":"寅","戌":"午","巳":"亥","酉":"巳","丑":"酉"};
        return (gsMap[yb]===gz[1] || gsMap[db]===gz[1]) ? '지살' : '';
    },
    // ── 11. 천살 — 연지·일지 기준 ──
    '천살': (gz, ec) => {
        const yb = ec.getYear()[1]; const db = ec.getDay()[1];
        const map = {"申":"辰","子":"辰","辰":"辰","亥":"未","卯":"未","未":"未","寅":"戌","午":"戌","戌":"戌","巳":"丑","酉":"丑","丑":"丑"};
        return (map[yb]===gz[1] || map[db]===gz[1]) ? '천살' : '';
    },
    // ── 12. 년살 — (만세력마다 이원화) 도화(咸池)와 지지가 겹쳐 TWELVE_SHINSAL_KEYS에서 제외, 도화살로 본다.
    '년살': (gz, ec) => {
        return '';
    },
    // ── 13. 백호대살 — 간지 조합 ──
    '백호대살': (gz, ec) => {
        return ['甲辰','乙未','丙戌','丁丑','戊辰','壬戌','癸丑'].includes(gz) ? '백호대살' : '';
    },
    // ── 14. 괴강살 — 간지 조합 ──
    '괴강살': (gz, ec) => {
        return ['庚辰','庚戌','壬辰','壬戌','戊戌'].includes(gz) ? '괴강살' : '';
    },
    // ── 15. 원진살 — 일지 기준 ──
    '원진살': (gz, ec) => {
        const db = ec.getDay()[1];
        if(!db || gz === ec.getDay()) return '';
        const map = {"子":"未","丑":"午","寅":"酉","卯":"申","辰":"亥","巳":"戌","午":"丑","未":"子","申":"卯","酉":"寅","戌":"巳","亥":"辰"};
        return gz[1] === map[db] ? '원진살' : '';
    },
    // ── 16. 귀문관살 — 일지 기준 ──
    '귀문관살': (gz, ec) => {
        const db = ec.getDay()[1];
        if(!db || gz === ec.getDay()) return '';
        const map = {"子":"酉","丑":"午","寅":"未","卯":"申","辰":"亥","巳":"戌","午":"丑","未":"寅","申":"卯","酉":"子","戌":"巳","亥":"辰"};
        return gz[1] === map[db] ? '귀문관살' : '';
    },
    // ── 17. 홍염살 — 일간 기준 ──
    '홍염살': (gz, ec) => {
        const ds = ec.getDay()[0];
        const map = {"甲":"午","乙":"午","丙":"寅","丁":"未","戊":"辰","己":"辰","庚":"戌","辛":"酉","壬":"子","癸":"申"};
        return map[ds] === gz[1] ? '홍염살' : '';
    },
    // ── 18. 고신살 — 연지 기준 (남성) ──
    '고신살': (gz, ec) => {
        const yb = ec.getYear()[1];
        const map = {"寅":"巳","卯":"巳","辰":"巳","巳":"申","午":"申","未":"申","申":"亥","酉":"亥","戌":"亥","亥":"寅","子":"寅","丑":"寅"};
        return map[yb] === gz[1] ? '고신살' : '';
    },
    // ── 19. 과숙살 — 연지 기준 (여성) ──
    '과숙살': (gz, ec) => {
        const yb = ec.getYear()[1];
        const map = {"寅":"丑","卯":"丑","辰":"丑","巳":"辰","午":"辰","未":"辰","申":"未","酉":"未","戌":"未","亥":"戌","子":"戌","丑":"戌"};
        return map[yb] === gz[1] ? '과숙살' : '';
    },
    // ── 20. 천의성 — 월지 기준 ──
    '천의성': (gz, ec) => {
        const mb = ec.getMonth()[1];
        const map = {"寅":"丑","卯":"寅","辰":"卯","巳":"辰","午":"巳","未":"午","申":"未","酉":"申","戌":"酉","亥":"戌","子":"亥","丑":"子"};
        return map[mb] === gz[1] ? '천의성' : '';
    },
    // ── 21. 학당귀인 — 일간 기준 ──
    '학당귀인': (gz, ec) => {
        const ds = ec.getDay()[0];
        const map = {"甲":"亥","乙":"午","丙":"寅","丁":"酉","戊":"申","己":"卯","庚":"巳","辛":"子","壬":"申","癸":"卯"};
        return map[ds] === gz[1] ? '학당귀인' : '';
    },
    // ── 22. 천관귀인 — 일간 기준 ──
    '천관귀인': (gz, ec) => {
        const ds = ec.getDay()[0];
        const map = {"甲":"未","乙":"辰","丙":"酉","丁":"亥","戊":"丑","己":"子","庚":"丑","辛":"寅","壬":"卯","癸":"巳"};
        return map[ds] === gz[1] ? '천관귀인' : '';
    },
    // ── 23. 천덕귀인 — 월지 기준 ──
    '천덕귀인': (gz, ec) => {
        const mb = ec.getMonth()[1];
        const map = {"寅":"丁","卯":"申","辰":"壬","巳":"辛","午":"亥","未":"甲","申":"癸","酉":"寅","戌":"丙","亥":"乙","子":"巳","丑":"庚"};
        return map[mb] === gz[0] ? '천덕귀인' : '';
    },
    // ── 24. 월덕귀인 — 월지 기준 ──
    '월덕귀인': (gz, ec) => {
        const mb = ec.getMonth()[1];
        const gz0 = gz[0];
        if (['寅','午','戌'].includes(mb) && gz0 === '丙') return '월덕귀인';
        if (['亥','卯','未'].includes(mb) && gz0 === '甲') return '월덕귀인';
        if (['申','子','辰'].includes(mb) && gz0 === '壬') return '월덕귀인';
        if (['巳','酉','丑'].includes(mb) && gz0 === '庚') return '월덕귀인';
        return '';
    },
    // ── 25. 금여록 — 일간 기준 (귀한 수레, 배우자 복) ──
    '금여록': (gz, ec) => {
        const ds = ec.getDay()[0];
        const map = {"甲":"辰","乙":"巳","丙":"未","丁":"申","戊":"戌","己":"亥","庚":"丑","辛":"寅","壬":"辰","癸":"巳"};
        return map[ds] === gz[1] ? '금여록' : '';
    },
    // ── 26. 현침살 — 간지 조합 (날카로운 것, 의료·예술) ──
    '현침살': (gz, ec) => {
        // 甲午·乙卯·辛卯·壬午·甲子·壬子
        return ['甲午','乙卯','辛卯','壬午','甲子','壬子','丁卯'].includes(gz) ? '현침살' : '';
    },
    // ── 27. 금각살 — 간지 조합 (뼈 관련 병약) ──
    '금각살': (gz, ec) => {
        return ['甲申','甲戌','乙酉','乙亥','丙申','丙戌','丁酉','丁亥','庚寅','庚辰','辛卯','辛巳'].includes(gz) ? '금각살' : '';
    },
    // ── 28. 유하살 — 일간 기준 (애교·풍류) ──
    '유하살': (gz, ec) => {
        const ds = ec.getDay()[0];
        const map = {"甲":"子","乙":"申","丙":"戌","丁":"亥","戊":"丑","己":"子","庚":"申","辛":"戌","壬":"亥","癸":"丑"};
        return map[ds] === gz[1] ? '유하살' : '';
    },
    // ── 29. 천주귀인 — 일간 기준 ──
    '천주귀인': (gz, ec) => {
        const ds = ec.getDay()[0];
        // 甲-戊, 乙-己, 丙-庚, 丁-辛, 戊-壬, 己-癸 (같은 그룹의 양간 기준)
        const map = {"甲":"子","乙":"申","丙":"子","丁":"亥","戊":"午","己":"卯","庚":"午","辛":"巳","壬":"戌","癸":"卯"};
        return map[ds] === gz[1] ? '천주귀인' : '';
    },
    // ── 30. 재고귀인 — 일간 기준 (창고 재물) ──
    '재고귀인': (gz, ec) => {
        const ds = ec.getDay()[0];
        const map = {"甲":"丑","乙":"戌","丙":"戌","丁":"丑","戊":"戌","己":"丑","庚":"丑","辛":"戌","壬":"辰","癸":"辰"};
        return map[ds] === gz[1] ? '재고귀인' : '';
    },
    // ── 31. 급각살 — 일지 기준 (사고·급변) ──
    '급각살': (gz, ec) => {
        const db = ec.getDay()[1];
        if(!db || gz === ec.getDay()) return '';
        const map = {"子":"未","丑":"午","寅":"巳","卯":"辰","辰":"卯","巳":"寅","午":"丑","未":"子","申":"亥","酉":"戌","戌":"酉","亥":"申"};
        return gz[1] === map[db] ? '급각살' : '';
    },
    // ── 32. 수옥살 — 연지·일지 기준 (관재·구속) ──
    '수옥살': (gz, ec) => {
        const yb = ec.getYear()[1]; const db = ec.getDay()[1];
        const map = {"寅":"巳","午":"申","戌":"亥","亥":"寅","卯":"午","未":"戌","申":"亥","子":"卯","辰":"未","巳":"申","酉":"子","丑":"辰"};
        return (map[yb]===gz[1] || map[db]===gz[1]) ? '수옥살' : '';
    },
    // ── 33. 장성살 — 연지·일지 삼합의 왕지(將星)
    '장성살': (gz, ec) => {
        const yb = ec.getYear()[1]; const db = ec.getDay()[1];
        const jangFrom = (b) => {
            if (['申','子','辰'].includes(b)) return '子';
            if (['亥','卯','未'].includes(b)) return '卯';
            if (['寅','午','戌'].includes(b)) return '午';
            if (['巳','酉','丑'].includes(b)) return '酉';
            return '';
        };
        const jy = jangFrom(yb), jd = jangFrom(db); const g = gz[1];
        return ((jy && jy === g) || (jd && jd === g)) ? '장성살' : '';
    },
    // ── 34. 복성귀인 — 일간 기준 ──
    '복성귀인': (gz, ec) => {
        const ds = ec.getDay()[0];
        const map = {"甲":"寅","乙":"丑","丙":"子","丁":"亥","戊":"戌","己":"酉","庚":"申","辛":"未","壬":"午","癸":"巳"};
        return map[ds] === gz[1] ? '복성귀인' : '';
    },
    // ── 35. 천주귀인2 (철새개금) — 일간+일지 조합 ──
    '철새개금': (gz, ec) => {
        const dayGz = ec.getDay();
        if(!dayGz || gz === dayGz) return '';
        const ds = dayGz[0];
        // 甲-庚충 작용 — 철새개금은 甲일간이 庚을 만나는 특수 구조
        const map = {"甲":"申","乙":"酉","丙":"亥","丁":"子","戊":"子","己":"亥","庚":"卯","辛":"寅","壬":"午","癸":"巳"};
        return map[ds] === gz[1] ? '철새개금' : '';
    },
    // ── 태극귀인 — 일간 기준
    '태극귀인': (gz, ec) => {
        const ds = ec.getDay()[0];
        const map = {"甲":["子","午"],"乙":["子","午"],"丙":["卯","酉"],"丁":["卯","酉"],"戊":["辰","戌","丑","未"],"己":["辰","戌","丑","未"],"庚":["寅","亥"],"辛":["寅","亥"],"壬":["巳","申"],"癸":["巳","申"]};
        const arr = map[ds];
        return arr && gz[1] && arr.includes(gz[1]) ? '태극귀인' : '';
    },
    // ── 천복귀인 — 일간 기준
    '천복귀인': (gz, ec) => {
        const ds = ec.getDay()[0];
        const map = {"甲":"酉","乙":"申","丙":"卯","丁":"寅","戊":"卯","己":"寅","庚":"午","辛":"巳","壬":"午","癸":"巳"};
        return map[ds] === gz[1] ? '천복귀인' : '';
    },
    // ── 상문살 — 연지 기준 (+2지)
    '상문살': (gz, ec) => {
        const yb = ec.getYear()[1];
        if (!yb || !gz[1]) return '';
        const i = BRANCH_RING.indexOf(yb);
        if (i < 0) return '';
        return BRANCH_RING[(i + 2) % 12] === gz[1] ? '상문살' : '';
    },
    // ── 조객살 — 연지 기준 (+10지)
    '조객살': (gz, ec) => {
        const yb = ec.getYear()[1];
        if (!yb || !gz[1]) return '';
        const i = BRANCH_RING.indexOf(yb);
        if (i < 0) return '';
        return BRANCH_RING[(i + 10) % 12] === gz[1] ? '조객살' : '';
    },
    // ── 격각살 — 일지 기준 (+2지), 일주 본주 제외
    '격각살': (gz, ec) => {
        const dayGz = ec.getDay();
        const db = dayGz && dayGz[1];
        if (!db || !gz[1] || gz === dayGz) return '';
        const i = BRANCH_RING.indexOf(db);
        if (i < 0) return '';
        return BRANCH_RING[(i + 2) % 12] === gz[1] ? '격각살' : '';
    },
    // ── 평두살 — 특정 일주(일주 칸만)
    '평두살': (gz, ec) => {
        const dayGz = ec.getDay();
        if (!dayGz || gz !== dayGz) return '';
        return PYEONGDU_GZ.has(gz) ? '평두살' : '';
    },
    // ── 효신살 — 특정 일주(일주 칸만)
    '효신살': (gz, ec) => {
        const dayGz = ec.getDay();
        if (!dayGz || gz !== dayGz) return '';
        return HYOSIN_GZ.has(gz) ? '효신살' : '';
    },
    // ── 반안살 — 년지·일지 삼합 기준 (왕지 다음 = 진미술축)
    '반안살': (gz, ec) => {
        const yb = ec.getYear()[1], db = ec.getDay()[1], b = gz[1];
        if (!b) return '';
        const hit = (ref) => { const p = sanHePackFromBranch(ref); return p && p.banAn === b; };
        return (hit(yb) || hit(db)) ? '반안살' : '';
    },
    // ── 육해살 — 년지·일지 육해 상대 지지
    '육해살': (gz, ec) => {
        const yb = ec.getYear()[1], db = ec.getDay()[1], b = gz[1];
        if (!b) return '';
        if ((yb && LIUHAI_PAIR[yb] === b) || (db && LIUHAI_PAIR[db] === b)) return '육해살';
        return '';
    },
    // ── 재살(災煞) — 일지 삼합 기준 장성 충
    '재살': (gz, ec) => {
        const db = ec.getDay()[1];
        const p = sanHePackFromBranch(db);
        if (!p || !gz[1]) return '';
        return gz[1] === p.jaeSal ? '재살' : '';
    },
    // ── 월살(月煞) — 일지 삼합 고지와 충
    '월살': (gz, ec) => {
        const db = ec.getDay()[1];
        const p = sanHePackFromBranch(db);
        if (!p || !gz[1]) return '';
        return gz[1] === p.woSal ? '월살' : '';
    }
};

function go(n) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('step-' + n).classList.add('active');
    window.scrollTo(0, 0);
}

function setToggle(groupId, btn, inputId) {
    const parent = document.getElementById(groupId);
    parent.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const hiddenInput = document.getElementById(inputId || groupId.replace('-group', ''));
    if (hiddenInput) hiddenInput.value = btn.getAttribute('data-val');
}

function toggleLeap(show) {
    const wrap = document.getElementById('leap-wrap');
    const baseWrap = document.getElementById('cal-base-wrap');
    if (show) {
        wrap.style.display = 'block';
        // 음력 선택 시 한국/중국 기준 옵션 표시
        if (baseWrap) baseWrap.style.display = 'block';
    } else {
        wrap.style.display = 'none';
        // 양력 선택 시 한국/중국 기준 옵션 숨김 (양력은 구분 불필요)
        if (baseWrap) baseWrap.style.display = 'none';
        const falseBtn = document.querySelector('#leap-group .btn-toggle[data-val="false"]');
        if (falseBtn) setToggle('leap-group', falseBtn, 'is-leap');
    }
}

function scrollToSec(id) {
    const el = document.getElementById(id);
    if (el) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elRect = el.getBoundingClientRect().top;
        const elPosition = elRect - bodyRect;
        window.scrollTo({ top: elPosition - offset, behavior: 'smooth' });
    }
}



window.addEventListener('scroll', () => {
    const sections = ['sec-manse', 'sec-relation', 'sec-wuxing', 'sec-fortune'];
    let currentId = 'sec-manse';
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= (el.offsetTop - 100)) {
            currentId = id;
        }
    });
    document.querySelectorAll('.j-nav-item').forEach(nav => nav.classList.remove('active'));
    const activeNav = document.querySelector(`.j-nav-item[onclick*="${currentId}"]`);
    if (activeNav) activeNav.classList.add('active');
});



var ANIMAL_SPRITE = {
    '子': {kr:'쥐',     file:'rat'},
    '丑': {kr:'소',     file:'ox'},
    '寅': {kr:'호랑이', file:'tiger'},
    '卯': {kr:'토끼',   file:'rabbit'},
    '辰': {kr:'용',     file:'dragon'},
    '巳': {kr:'뱀',     file:'snake'},
    '午': {kr:'말',     file:'horse'},
    '未': {kr:'양',     file:'goat'},
    '申': {kr:'원숭이', file:'monkey'},
    '酉': {kr:'닭',     file:'rooster'},
    '戌': {kr:'개',     file:'dog'},
    '亥': {kr:'돼지',   file:'pig'}
};
// 일간 오행 → 동물 색상 (CSS filter로 흰색 실루엣에 색 입히기)
var ANIMAL_COLOR = {
    // 木 - 초록
    '甲': {filter:'brightness(0) saturate(100%) invert(58%) sepia(49%) saturate(445%) hue-rotate(103deg) brightness(101%)', bg:'#0d2016', label:'푸른'},
    '乙': {filter:'brightness(0) saturate(100%) invert(58%) sepia(49%) saturate(445%) hue-rotate(103deg) brightness(101%)', bg:'#0d2016', label:'푸른'},
    // 火 - 빨강
    '丙': {filter:'brightness(0) saturate(100%) invert(33%) sepia(95%) saturate(750%) hue-rotate(333deg) brightness(103%)', bg:'#2e0d0d', label:'붉은'},
    '丁': {filter:'brightness(0) saturate(100%) invert(33%) sepia(95%) saturate(750%) hue-rotate(333deg) brightness(103%)', bg:'#2e0d0d', label:'붉은'},
    // 土 - 황금
    '戊': {filter:'brightness(0) saturate(100%) invert(64%) sepia(70%) saturate(600%) hue-rotate(5deg) brightness(95%)',   bg:'#2a2008', label:'황금'},
    '己': {filter:'brightness(0) saturate(100%) invert(64%) sepia(70%) saturate(600%) hue-rotate(5deg) brightness(95%)',   bg:'#2a2008', label:'황금'},
    // 金 - 흰색
    '庚': {filter:'brightness(10)',                                                                                          bg:'#1e1e1e', label:'하얀'},
    '辛': {filter:'brightness(10)',                                                                                          bg:'#1e1e1e', label:'하얀'},
    // 水 - 검정 (밝은배경)
    '壬': {filter:'brightness(0)',                                                                                           bg:'#d0d0d0', label:'검은'},
    '癸': {filter:'brightness(0)',                                                                                           bg:'#d0d0d0', label:'검은'},
};
var COLOR_KR_MAP = {
    'wood': '푸른', 'fire': '붉은', 'earth': '황금', 'metal': '하얀', 'water': '검은'
};
var CIRCLE_BG = {
    'wood': '#1E3C28', 'fire': '#4A2320', 'earth': '#4A3E1B', 'metal': '#3A3A3A', 'water': '#182C4A'
};

function showLoading(msg, callback) {
    const loadEl = document.getElementById('loading');
    const msgEl = document.getElementById('loading-msg');
    if(loadEl) loadEl.style.display = 'flex';
    if(msgEl) msgEl.innerText = '사주를 분석하는 중입니다...';
    setTimeout(() => {
        try { callback(); } catch(e) {
            console.error('분석 오류:', e);
            if(loadEl) loadEl.style.display = 'none';
            var _bv = (typeof window !== 'undefined' && window.__SAJUX_CORE_V__) ? window.__SAJUX_CORE_V__ : '';
            alert('분석 중 오류가 발생했습니다:\n' + e.message + '\n\n' + (e.stack||'').split('\n').slice(0,3).join('\n') + (_bv ? '\n\n[빌드 ' + _bv + '] 캐시일 수 있습니다. Cmd+Shift+R(맥) 또는 Ctrl+F5로 새로고침 후 다시 시도하세요.' : '\n\nCmd+Shift+R(맥) 또는 Ctrl+F5로 강력 새로고침 후 다시 시도하세요.'));
        }
        if(loadEl) loadEl.style.display = 'none';
    }, 100);
}

const ni = document.getElementById('user-name');
const di = document.getElementById('birth-date');
const ti = document.getElementById('birth-time');
if (ni) ni.oninput = () => document.getElementById('n-pre').innerText = ni.value ? ni.value + ' 님' : '';
if (di) di.oninput = () => {
    const v = di.value.replace(/\D/g, '');
    document.getElementById('d-pre').innerText = v.length === 8 ? `${v.slice(0,4)}년 ${parseInt(v.slice(4,6))}월 ${parseInt(v.slice(6,8))}일` : '';
};
if (ti) ti.oninput = () => {
    const v = ti.value.replace(/\D/g, '');
    if (v.length >= 2) {
        const h = parseInt(v.slice(0,2));
        if (h >= 0 && h < 24) {
            let txt = h < 12 ? '오전 ' + (h === 0 ? 12 : h) : '오후 ' + (h === 12 ? 12 : h - 12);
            txt += v.length === 4 ? `시 ${v.slice(2,4)}분` : '시';
            document.getElementById('t-pre').innerText = txt;
        } else {
            document.getElementById('t-pre').innerText = '시간 형식 오류';
        }
    } else {
        document.getElementById('t-pre').innerText = '';
    }
};

function isYang(ch) {
    if (!ch) return false;
    if (STEM_YANG_H.includes(ch) || BRANCH_YANG_H.includes(ch)) return true;
    return STEM_YANG.includes(ch) || BRANCH_YANG.includes(ch);
}

function getSipseong(dayStem, target) {
    if (!dayStem || !target) return '';
    let t = target[0];
    if (BRANCH_MAIN_STEM[t]) t = BRANCH_MAIN_STEM[t];
    const dIdx = WUXING_ORDER.indexOf(HAN_COLOR[dayStem]);
    const tIdx = WUXING_ORDER.indexOf(HAN_COLOR[t]);
    if (dIdx === -1 || tIdx === -1) return '';
    const diff = (tIdx - dIdx + 5) % 5;
    const same = isYang(dayStem) === isYang(t);
    return [["비견","겁재"],["식신","상관"],["편재","정재"],["편관","정관"],["편인","정인"]][diff][same ? 0 : 1];
}


function getGongmang(dayPillar) {
    const stems = ['갑','을','병','정','무','기','경','신','임','계'];
    const branches = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
    if (!dayPillar || dayPillar.length < 2) return '';
    // 한자→한글 변환 지원
    const HJ2KR_S = {'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계'};
    const HJ2KR_B = {'子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    const s0 = HJ2KR_S[dayPillar[0]] || dayPillar[0];
    const b0 = HJ2KR_B[dayPillar[1]] || dayPillar[1];
    const stemIdx = stems.indexOf(s0);
    const branchIdx = branches.indexOf(b0);
    if (stemIdx === -1 || branchIdx === -1) return '';
    
    // Calculate the branch offset relative to stem
    let offset = branchIdx - stemIdx;
    if (offset < 0) offset += 12;
    
    // The gongmang branches are the two preceding the group start
    // Groups are starting from Gap(0). The offset gives the starting group's branch.
    // Actually, simple formula: (branchIdx - stemIdx + 10) % 12 and +11
    const gm1 = branches[(offset + 10) % 12];
    const gm2 = branches[(offset + 11) % 12];
    return gm1 + gm2;
}

function getUnsung(stem, branch) {
    return UNSUNG_MAP[stem]?.[branch] || '';
}

function getHidden(branch, dayStem) {
    return (BRANCH_HIDDEN[branch] || []).map(ch => {
        const ss = getSipseong(dayStem, ch);
        const lab = typeof sipToManseBadge === 'function' ? sipToManseBadge(ss, false) : ss;
        return `<div style="margin-bottom:4px;"><span class="${HAN_COLOR[ch]}">${ch}</span> <span class="jijanggan-sip" style="font-size:10px;color:var(--text-dim,rgba(255,255,255,0.60));">${lab}</span></div>`;
    }).join('');
}

function getElementDesc(ch) {
    if (!ch) return '';
    const yy = isYang(ch) ? '+' : '-';
    const kr = HAN_KOR[ch];
    const el = HAN_COLOR[ch];
    const elKr = RELATION_LABELS[el];
    const elHz = {'wood':'木','fire':'火','earth':'土','metal':'金','water':'水'}[el];
    return `${yy}${kr}, ${elKr}${elHz}`;
}

// v3.0 상호작용 엔진(요약): 합·충·형·파·해를 텍스트 풀이에 반영
function evaluateMasterDynamics(pillars) {
    const stems = (pillars || []).map(p => p && p.h && p.h[0]).filter(Boolean);
    const branches = (pillars || []).map(p => p && p.h && p.h[1]).filter(Boolean);
    const pairKey = (a, b) => [a, b].sort().join('');
    const bset = new Set(branches);
    const sset = new Set(stems);

    const STEM_HE = new Set(['甲己','乙庚','丙辛','丁壬','戊癸']);
    const BRANCH_CHUNG = new Set(['子午','丑未','寅申','卯酉','辰戌','巳亥']);
    const BRANCH_HAE = new Set(['子未','丑午','寅巳','卯辰','申亥','酉戌']);
    const BRANCH_PA = new Set(['子酉','丑辰','寅亥','卯午','巳申','未戌']);
    const BRANCH_HYEONG = [
        ['寅','巳','申'], ['丑','戌','未'],
        ['子','卯'],
        ['辰','辰'], ['午','午'], ['酉','酉'], ['亥','亥']
    ];
    const SAMHAP = [
        ['亥','卯','未','wood'], ['寅','午','戌','fire'],
        ['巳','酉','丑','metal'], ['申','子','辰','water']
    ];

    let he = 0, chung = 0, hae = 0, pa = 0, hyeong = 0, samh = 0;
    for (let i = 0; i < stems.length; i++) {
        for (let j = i + 1; j < stems.length; j++) {
            if (STEM_HE.has(pairKey(stems[i], stems[j]))) he++;
        }
    }
    for (let i = 0; i < branches.length; i++) {
        for (let j = i + 1; j < branches.length; j++) {
            const k = pairKey(branches[i], branches[j]);
            if (BRANCH_CHUNG.has(k)) chung++;
            if (BRANCH_HAE.has(k)) hae++;
            if (BRANCH_PA.has(k)) pa++;
        }
    }
    BRANCH_HYEONG.forEach(g => {
        if (g.length === 2) {
            if (bset.has(g[0]) && bset.has(g[1])) hyeong++;
        } else if (g[0] === g[1]) {
            if (branches.filter(x => x === g[0]).length >= 2) hyeong++;
        } else {
            if (g.every(x => bset.has(x))) hyeong++;
        }
    });
    SAMHAP.forEach(g => { if (g.slice(0, 3).every(x => bset.has(x))) samh++; });

    const tension = (chung * 2) + hyeong + hae + pa;
    const cohesion = (he * 2) + (samh * 2);
    const state = cohesion > tension ? 'cohesion' : (tension > cohesion ? 'tension' : 'balanced');
    return { he, samh, chung, hyeong, hae, pa, tension, cohesion, state };
}

function buildDynamicsNarrative(dyn) {
    if (!dyn) return '';
    if (dyn.state === 'cohesion') {
        return `합·삼합이 우세합니다. 뭉치면 힘이 생기고, 느려지기도 합니다. **마감일·결정권자**를 먼저 박으십시오.`;
    }
    if (dyn.state === 'tension') {
        return `충·형·해가 우세합니다. 변화 압력이 큽니다. **이동·역할·관계**를 한 번에 바꾸지 말고 단계로 나누십시오.`;
    }
    return `합과 충이 비슷합니다. 확장보다 **우선순위 세 줄**을 고르는 해에 가깝습니다.`;
}

// ===== v3.0 텍스트 엔진: 십성 × 12운성 × 길흉 조합 =====
const FORTUNE_TEXT_DB = {
    sipseong: {
        '비견': [
            '동업·경쟁 구도가 전면으로 올라옵니다.',
            '동료와 같은 전장에 서는 국면입니다.',
            '내 몫을 지키는 힘겨루기가 시작됩니다.',
            '지분·공동지출·고수익 상품에서 **한 줄 합의**가 승패를 가릅니다.'
        ],
        '겁재': [
            '자원 쟁탈전이 본격화됩니다.',
            '돈과 권한을 둘러싼 충돌이 발생합니다.',
            '지분·성과 배분 갈등이 터지는 구간입니다.'
        ],
        '식신': [
            '생산성과 결과물이 숫자로 찍히는 타이밍입니다.',
            '실무 실행력이 실적을 밀어 올립니다.',
            '내 손에서 만든 결과가 시장 반응을 받습니다.'
        ],
        '상관': [
            '기존 규칙을 깨고 새 판을 짜야 하는 국면입니다.',
            '말과 기획의 칼날이 승패를 가릅니다.',
            '권위와 충돌하며 방향 전환을 강제합니다.'
        ],
        '편재': [
            '외주·미수·보너스 문자가 연달아 옵니다.',
            '거래처가 늘어나 손이 바빠지는 달입니다.',
            '빠른 회전의 수익 기회가 열립니다.',
            '큰 금액 제안은 **영업일 이틀 유예** 후에만 답하십시오.'
        ],
        '정재': [
            '현금흐름과 고정수익을 다지는 구간입니다.',
            '월 단위 수익 구조를 재정렬해야 합니다.',
            '지출 통제와 누적 자산 축적이 핵심입니다.',
            '배당·월세·정기 입금 한 줄만 먼저 고정하십시오.'
        ],
        '편관': [
            '강한 압박과 책임이 동시에 들어옵니다.',
            '리스크 대응 능력이 시험대에 오릅니다.',
            '통제와 위기관리 역량이 성과를 결정합니다.'
        ],
        '정관': [
            '평판·직함·승진 트랙이 본격 작동합니다.',
            '공식 룰 안에서 성과를 증명해야 합니다.',
            '조직 신뢰를 자산으로 바꾸는 시기입니다.'
        ],
        '편인': [
            '비정형 해법과 역발상이 먹히는 국면입니다.',
            '정보 해석력이 성패를 좌우합니다.',
            '숨은 변수 포착이 실익을 만듭니다.'
        ],
        '정인': [
            '학습·자격·문서 역량이 실전 무기가 됩니다.',
            '기초 체력과 지식 축적이 수익으로 전환됩니다.',
            '멘토링·지원 자원을 흡수해야 이깁니다.'
        ]
    },
    unsung: {
        strong: [
            '에너지가 정점입니다. 실행 속도를 즉시 올리십시오.',
            '추진력이 최고치입니다. 결정을 지연하면 손실이 커집니다.',
            '판을 확장할 동력이 충분합니다. 큰 결단을 지금 내리십시오.'
        ],
        mid: [
            '에너지가 중립권입니다. 구조 정비와 선별 실행이 정답입니다.',
            '무리한 확장보다 핵심 과제 집중이 수익률을 높입니다.',
            '속도보다 정확도가 이기는 구간입니다. 우선순위를 재정렬하십시오.'
        ],
        weak: [
            '에너지가 급락 구간입니다. 공격적 확장은 즉시 중단하십시오.',
            '추진력보다 방어가 우선입니다. 리스크 노출을 절반으로 줄이십시오.',
            '체력이 잠기는 흐름입니다. 신규 계약과 과투자는 절대 삼가십시오.'
        ]
    },
    action: {
        favorable: [
            '이번 달은 입금 확인·견적 회신·승인선 정리 세 가지만 **일정표 한 줄**에만 고정하고, 그 외 신규 제안은 다음 달로 미루십시오.',
            '미뤄둔 계약 서명·연장 통보·세금 납부를 같은 주에 겹치지 않게 날짜를 쪼개서 끝내십시오.',
            '성과가 나는 거래처 한 곳에만 주간 보고를 보내고, 나머지 채널은 알림을 끄십시오.',
            '길운이 몰리는 달에는 **단기 변동 테마** 한 갈래만 열고 나머지 투자 제안은 잠그십시오.'
        ],
        cautious: []
    }
};

function classifyUnsungLevel(uns) {
    if (['장생','관대','건록','제왕'].includes(uns)) return 'strong';
    if (['목욕','쇠','태','양'].includes(uns)) return 'mid';
    return 'weak'; // 병/사/묘/절 + 기타
}

function pickVariant(arr, idxSeed) {
    if (!arr || !arr.length) return '';
    return arr[Math.abs(idxSeed) % arr.length];
}

function hashSeed(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h) + str.charCodeAt(i);
    return Math.abs(h);
}

function renderFortuneText(opts) {
    const sip = opts.sip || '비견';
    const uns = opts.uns || '-';
    const score = Number(opts.score || 0);
    const idx = Number(opts.idx || 0);
    const phase = classifyUnsungLevel(uns);
    const resultKey = score >= 1 ? 'favorable' : 'cautious';
    const oh = monthDominantOh(opts.mGanHj, opts.mJiHj);
    const seed = hashSeed(`${sip}|${uns}|${resultKey}|${idx}|${oh}`);

    const a = pickVariant(FORTUNE_TEXT_DB.sipseong[sip] || FORTUNE_TEXT_DB.sipseong['비견'], seed + idx);
    const b = pickVariant(FORTUNE_TEXT_DB.unsung[phase], seed + idx * 3 + 1);
    var actionPool = resultKey === 'cautious'
        ? (FORTUNE_ACTION_CAUTIOUS_BY_OH[oh] || FORTUNE_ACTION_CAUTIOUS_BY_OH.earth)
        : FORTUNE_TEXT_DB.action.favorable;
    const c = pickVariant(actionPool, seed + idx * 5 + 2);
    return polishHanjaInText(stripReportMacroLeaks(`${a} ${b} ${c}`));
}

// 12신살 (삼합·일지 기준: 반안·육해·재·월·급각 등 만세력 통용 항목 포함)
window.TWELVE_SHINSAL_KEYS = new Set(['역마살','도화살','화개살','겁살','망신살','지살','천살','장성살','수옥살','반안살','육해살','재살','월살','급각살']); var TWELVE_SHINSAL_KEYS = window.TWELVE_SHINSAL_KEYS;
// 기타신살 (귀인성 + 특수살)
var EXTRA_SHINSAL_KEYS = new Set(['천을귀인','문창귀인','문곡귀인','양인살','백호대살','괴강살','원진살','귀문관살','홍염살','고신살','과숙살','학당귀인','천관귀인','천의성','천덕귀인','월덕귀인','금여록','현침살','금각살','유하살','천주귀인','재고귀인','복성귀인','철새개금','태극귀인','천복귀인','상문살','조객살','격각살','평두살','효신살']);

function getShinsal(gz, ec) {
    const arr = [];
    for (const key in SHINSAL_LOGIC) {
        const val = SHINSAL_LOGIC[key](gz, ec);
        if (val) arr.push(val);
    }
    return arr;
}

// 12신살만 반환
function getTwelveShinsal(gz, ec) {
    const arr = [];
    for (const key in SHINSAL_LOGIC) {
        var _TSK = window.TWELVE_SHINSAL_KEYS || new Set(); if (!_TSK.has(key)) continue;
        const val = SHINSAL_LOGIC[key](gz, ec);
        if (val) arr.push(val);
    }
    return arr;
}

// 기타신살만 반환
function getExtraShinsal(gz, ec) {
    const arr = [];
    for (const key in SHINSAL_LOGIC) {
        var _TSK2 = window.TWELVE_SHINSAL_KEYS || new Set(); if (_TSK2.has(key)) continue;
        const val = SHINSAL_LOGIC[key](gz, ec);
        if (val) arr.push(val);
    }
    return arr;
}

function getAllShinsal(pillars, ec, isUnknown) {
    const result = {};
    pillars.forEach((p, idx) => {
        if (isUnknown && idx === 0) return;
        result[p.n] = getShinsal((p.h[0] || '') + (p.h[1] || ''), ec);
    });
    return result;
}

// 12신살만 분리
function getAllTwelveShinsal(pillars, ec, isUnknown) {
    const result = {};
    pillars.forEach((p, idx) => {
        if (isUnknown && idx === 0) return;
        result[p.n] = getTwelveShinsal((p.h[0] || '') + (p.h[1] || ''), ec);
    });
    return result;
}

// 기타신살만 분리
function getAllExtraShinsal(pillars, ec, isUnknown) {
    const result = {};
    pillars.forEach((p, idx) => {
        if (isUnknown && idx === 0) return;
        result[p.n] = getExtraShinsal((p.h[0] || '') + (p.h[1] || ''), ec);
    });
    return result;
}

function buildRelationLines(pillars) {
    const stems = pillars.map(p => p.h[0]).filter(Boolean);
    const branches = pillars.map(p => p.h[1]).filter(Boolean);
    const lines = [];

    const stemCombine = [['甲','己','갑기합'],['乙','庚','을경합'],['丙','辛','병신합'],['丁','壬','정임합'],['戊','癸','무계합']];
    stemCombine.forEach(([a,b,label]) => { if (stems.includes(a) && stems.includes(b)) lines.push({type:'천간 합', label, chars:[a,b]}); });

    const branchSix = [['子','丑','자축합'],['寅','亥','인해합'],['卯','戌','묘술합'],['辰','酉','진유합'],['巳','申','사신합'],['午','未','오미합']];
    branchSix.forEach(([a,b,label]) => { if (branches.includes(a) && branches.includes(b)) lines.push({type:'지지 합', label, chars:[a,b]}); });

    const branchChung = [['子','午','자오충'],['丑','未','축미충'],['寅','申','인신충'],['卯','酉','묘유충'],['辰','戌','진술충'],['巳','亥','사해충']];
    branchChung.forEach(([a,b,label]) => { if (branches.includes(a) && branches.includes(b)) lines.push({type:'지지 충', label, chars:[a,b]}); });

    const branchHyung = [['子','卯','자묘형'],['寅','巳','인사형'],['巳','申','사신형'],['丑','戌','축술형'],['戌','未','술미형']];
    branchHyung.forEach(([a,b,label]) => { if (branches.includes(a) && branches.includes(b)) lines.push({type:'지지 형', label, chars:[a,b]}); });

    if (branches.includes('寅') && branches.includes('卯') && branches.includes('辰')) lines.push({type:'방합', label:'인묘진 방합', chars:['寅','卯','辰']});
    if (branches.includes('巳') && branches.includes('午') && branches.includes('未')) lines.push({type:'방합', label:'사오미 방합', chars:['巳','午','未']});
    if (branches.includes('申') && branches.includes('酉') && branches.includes('戌')) lines.push({type:'방합', label:'신유술 방합', chars:['申','酉','戌']});
    if (branches.includes('亥') && branches.includes('子') && branches.includes('丑')) lines.push({type:'방합', label:'해자축 방합', chars:['亥','子','丑']});
    if (branches.includes('子') && branches.includes('辰')) lines.push({type:'반합', label:'자진 반합', chars:['子','辰']});
    
    if (!lines.length) lines.push({type:'없음', label:'특기할 합충형파해 구조 없음', chars:[]});
    return lines;
}

function percent(count, total) {
    return total ? Math.round((count / total) * 1000) / 10 : 0;
}

function buildBars(targetId, rows, toneMap) {
    document.getElementById(targetId).innerHTML = rows.map(row => `
        <div class="bar-item">
            <div class="bar-label-wrap">
                <span class="bar-label-main">${row.labelMain || row.label}</span>
                ${row.labelSub ? `<span class="bar-label-sub">${row.labelSub}</span>` : ''}
            </div>
            <div class="bar-track"><div class="bar-fill ${toneMap(row.key)}" style="width:${row.value}%;"></div></div>
            <div class="bar-value">${row.value}%</div>
        </div>
    `).join('');
}

function buildFortuneCards(targetId, rows) {
    const wrapClass = targetId === 'seun-table' ? 'yearly-card-container' : (targetId === 'wolun-table' ? 'monthly-card-container' : '');
    const wrapOpen = wrapClass ? `<div class="${wrapClass}">` : '';
    const wrapClose = wrapClass ? '</div>' : '';
    const stackClass = (targetId === 'seun-table' || targetId === 'wolun-table') ? ' fortune-scroll--stack' : '';
    const html = `${wrapOpen}<div class="fortune-scroll${stackClass}">
        ${rows.map(row => `
            <div class="f-card">
                <div class="f-head">${row[0]}</div>
                <div class="f-sip">${row[1]}</div>
                <div class="f-hz"><span class="${HAN_COLOR[row[2][0]]||''}">${row[2][0]}</span><br><span class="${HAN_COLOR[row[2][1]]||''}">${row[2][1]}</span></div>
                <div class="f-kr">${row[3]}</div>
                <div class="f-un">${row[4]}</div>
            </div>
        `).join('')}
    </div>${wrapClose}`;
    document.getElementById(targetId).innerHTML = html;
}

function runAnalysis(overrideParams) {
    var _op = overrideParams || window.__SAJUX_PARAMS__ || null;
    var reportBaseAt = (_op && _op.reportBaseAt) ? String(_op.reportBaseAt) : new Date().toISOString();
    var reportIssuedAt = (_op && _op.reportIssuedAt) ? String(_op.reportIssuedAt) : reportBaseAt;
    const _d = (_op && _op.birthDate) || (di && di.value) || '';
    const dVal = _d.replace(/\D/g, '');
    if (dVal.length < 8) return alert('생년월일 8자리를 입력하십시오.');

    showLoading('만세력을 정밀 계산하는 중입니다', () => {
        const name = (_op && _op.name) || (ni && ni.value) || '고객';
        var noTimeEl = typeof document !== 'undefined' && document.getElementById('no-time');
        var noTimeChk = noTimeEl ? !!noTimeEl.checked : false;
        var birthTimeRaw = '';
        if (_op && Object.prototype.hasOwnProperty.call(_op, 'birthTime')) {
            birthTimeRaw = _op.birthTime == null ? '' : String(_op.birthTime).trim();
        } else if (ti && ti.value != null) {
            birthTimeRaw = String(ti.value).trim();
        }
        var birthTimeNullish = birthTimeRaw === '' || String(birthTimeRaw).toLowerCase() === 'null' || /^모름/i.test(birthTimeRaw);
        var isUnknown = toBool(_op && _op.unknown, noTimeChk) || birthTimeNullish;
        var tVal = '';
        if (!isUnknown) {
            tVal = birthTimeRaw.replace(/\D/g, '') || '0000';
        } else {
            tVal = '1200';
        }
        if (tVal.length < 4) tVal = tVal.padStart(4, '0');

        let y = parseInt(dVal.slice(0,4));
        let m = parseInt(dVal.slice(4,6));
        let d = parseInt(dVal.slice(6,8));
        let hr = parseInt(tVal.slice(0,2));
        let mn = parseInt(tVal.slice(2,4));

        function toBool(v, defVal) {
            if (v === undefined || v === null || v === '') return !!defVal;
            if (typeof v === 'boolean') return v;
            if (typeof v === 'number') return v !== 0;
            if (typeof v === 'string') {
                const s = v.trim().toLowerCase();
                if (s === 'true' || s === '1' || s === 'y' || s === 'yes') return true;
                if (s === 'false' || s === '0' || s === 'n' || s === 'no') return false;
            }
            return !!v;
        }

        const genderRaw = (_op && _op.gender != null) ? String(_op.gender).toUpperCase() : String(document.getElementById('gender').value || 'F').toUpperCase();
        const gender = (genderRaw === 'M' || genderRaw === 'MALE' || genderRaw === '남' || genderRaw === '남성') ? 'M' : 'F';
        const calRaw = _op && _op.cal != null ? String(_op.cal).toLowerCase() : '';
        const isSolar = _op ? !(calRaw === 'lunar' || calRaw === 'l') : (document.getElementById('cal-type').value === 'S');
        const isLeap = toBool(_op && _op.yundal, (document.getElementById('is-leap').value === 'true'));
        const calBase = ((_op && _op.calBase) ? String(_op.calBase) : (document.getElementById('cal-base').value || 'KST')).toUpperCase();

        let origY = y, origM = m, origD = d;
        let lunarObj, solarObj;
        let displaySolarY = y, displaySolarM = m, displaySolarD = d;
        let displayLunarY = y, displayLunarM = m, displayLunarD = d, displayLunarLeap = false;

        // 1. 입력된 값을 양/음력 기준에 맞게 생성 (경도 보정 전)
        // 자시(子時) 경계 보정: 01:00~01:29 → 자시로 처리 (전통 명리학 기준)
        // 피노키님 01:04 → 戊子 자시에 해당
        var hrAdj = hr;

        if (isSolar) {
            solarObj = Solar.fromYmdHms(y, m, d, hrAdj, mn, 0);
            lunarObj = solarObj.getLunar();
            displaySolarY = y; displaySolarM = m; displaySolarD = d;
            displayLunarY = lunarObj.getYear(); displayLunarM = Math.abs(lunarObj.getMonth()); displayLunarD = lunarObj.getDay(); displayLunarLeap = lunarObj.getMonth() < 0;
        } else {
            if (calBase === 'KST') {
                // 한국 기준: KLC(KASI 한국천문연구원) 기준 음→양 변환
                const klcInst = new KoreanLunarCalendar();
                const ok = klcInst.setLunarDate(y, m, d, isLeap);
                if (!ok) {
                    alert('잘못된 음력 날짜입니다. (한국 기준)\n다시 확인하십시오.');
                    return;
                }
                const klcSolar = klcInst.getSolarCalendar();
                solarObj = Solar.fromYmdHms(klcSolar.year, klcSolar.month, klcSolar.day, hrAdj, mn, 0);
                lunarObj = solarObj.getLunar();
                // 화면 표시는 "입력/변환 기준일"로 고정 (경도 보정으로 날짜가 흔들려 보이지 않게)
                displaySolarY = klcSolar.year; displaySolarM = klcSolar.month; displaySolarD = klcSolar.day;
                displayLunarY = y; displayLunarM = m; displayLunarD = d; displayLunarLeap = !!isLeap;
            } else {
                // 중국 기준(CST): lunar.js 내장 음력 변환 사용 (북경시 기준)
                let lunarMonth = isLeap ? -m : m;
                lunarObj = Lunar.fromYmdHms(y, lunarMonth, d, hrAdj, mn, 0);
                solarObj = lunarObj.getSolar();
                displaySolarY = solarObj.getYear(); displaySolarM = solarObj.getMonth(); displaySolarD = solarObj.getDay();
                displayLunarY = y; displayLunarM = m; displayLunarD = d; displayLunarLeap = !!isLeap;
            }
        }

        /** 표지·고객 확인용: 입력(또는 자시 규칙 직후) 시각. 경도 -32분 보정 전 값이어야 입력과 화면이 일치합니다. */
        var coverUiHH = null;
        var coverUiMM = null;
        if (!isUnknown) {
            try {
                coverUiHH = solarObj.getHour();
                coverUiMM = solarObj.getMinute();
            } catch (eCov) {
                coverUiHH = hrAdj;
                coverUiMM = mn;
            }
        }

        // 2. 경도 보정 (-32분)은 무조건 '양력 시간' 객체를 기준으로 수행
        if ((document.getElementById('adj-l') ? document.getElementById('adj-l').checked : true) && !isUnknown) {
            const baseY = solarObj.getYear(), baseM = solarObj.getMonth(), baseD = solarObj.getDay();
            const dt = new Date(baseY, baseM - 1, baseD, solarObj.getHour(), solarObj.getMinute());
            dt.setMinutes(dt.getMinutes() - 32);
            // 경도 보정으로 달력이 전날로 넘어가면 UX상 날짜/만세력이 어긋나 보이므로, 해당 케이스는 날짜를 유지한다.
            if (dt.getFullYear() !== baseY || (dt.getMonth() + 1) !== baseM || dt.getDate() !== baseD) {
                dt.setFullYear(baseY, baseM - 1, baseD);
            }
            solarObj = Solar.fromYmdHms(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), dt.getHours(), dt.getMinutes(), 0);
            lunarObj = solarObj.getLunar();
        }

        const lunar = lunarObj;
        const solar = solarObj;
        const ec = lunar.getEightChar();
        const pillars = [
            { n: '시주', h: isUnknown ? ['', ''] : ec.getTime() },
            { n: '일주', h: ec.getDay() },
            { n: '월주', h: ec.getMonth() },
            { n: '년주', h: ec.getYear() }
        ];
        const dayStem = ec.getDay()[0];
        const allShinsal = getAllShinsal(pillars, ec, isUnknown);
        const allTwelveShinsal = getAllTwelveShinsal(pillars, ec, isUnknown);
        const allExtraShinsal = getAllExtraShinsal(pillars, ec, isUnknown);

        // 동물 아바타 및 배지 업데이트
        const animalInfo = ANIMAL_SPRITE[pillars[1].h[1]] || ANIMAL_SPRITE['인'];
        
        document.getElementById('av-name').innerText = nmDnim(name);
        var heroBrushTitle = document.getElementById('hero-brush-title');
        if (heroBrushTitle) heroBrushTitle.innerText = name + ' 고객님의 사주풀이 비밀문서';
        
        const colorInfo = ANIMAL_COLOR[dayStem] || ANIMAL_COLOR['병'];
        var animalSentence = (nmUi(name) + ' 상징 동물은 ' + String(colorInfo.label || '').trim() + ' ' + String(animalInfo.kr || '').trim() + '입니다.').replace(/\s+/g, ' ').trim();

        const descHanja = document.getElementById('av-desc-hanja');
        const descHangul = document.getElementById('av-desc-hangul');
        if (descHanja && descHangul) {
            descHanja.innerHTML = `<span class="${HAN_COLOR[dayStem]}">${dayStem}</span><span class="${HAN_COLOR[pillars[1].h[1]]}">${pillars[1].h[1]}</span>`;
            descHangul.innerText = animalSentence;
        } else {
            // Fallback if elements not found
            const fallback = document.getElementById('av-desc');
            if(fallback) fallback.innerText = `${dayStem}${pillars[1].h[1]} — ${animalSentence}`;
        }
        
        const circle = document.getElementById('av-circle');
        if(circle) {
            // flaticon 팔각형 이미지 그대로 사용 (원형 프레임 없음)
            circle.style.cssText = `background:transparent; border:none; box-shadow:none; width:110px; height:110px; margin:0 auto 10px; display:flex; align-items:center; justify-content:center;`;
            const STEM_EN = {"甲":"jia","乙":"yi","丙":"bing","丁":"ding","戊":"wu","己":"ji","庚":"geng","辛":"xin","壬":"ren","癸":"gui"};
            const BRANCH_EN = {"子":"zi","丑":"chou","寅":"yin","卯":"mao","辰":"chen","巳":"si","午":"wu","未":"wei","申":"shen","酉":"you","戌":"xu","亥":"hai"};
            const enName = (STEM_EN[dayStem]||'bing') + '_' + (BRANCH_EN[pillars[1].h[1]]||'yin');
            circle.innerHTML = `<img src="../zodiac_en/${enName}.png" style="width:100%;height:100%;object-fit:contain;display:block;" alt="${animalInfo.kr}">`;
            circle.className = 'avatar-circle';
            if (descHangul) descHangul.innerText = animalSentence;
        }
        
        let lMon = displayLunarM || (typeof lunar.getMonth === 'function' ? Math.abs(lunar.getMonth()) : 1);
        let leapStr = displayLunarLeap ? '(윤달)' : '(평달)';
        let sYear = displaySolarY || (typeof solar.getYear === 'function' ? solar.getYear() : y);
        let sMon = displaySolarM || (typeof solar.getMonth === 'function' ? solar.getMonth() : m);
        let sDay = displaySolarD || (typeof solar.getDay === 'function' ? solar.getDay() : d);
        let lYear = displayLunarY || (lunar.getYear ? lunar.getYear() : y);
        let lDay = displayLunarD || (typeof lunar.getDay === 'function' ? lunar.getDay() : d);
        
        const badges = document.getElementById('av-badges');
        if(badges) {
            badges.innerHTML = `
                <div class="badge">${gender === 'M' ? '남성' : '여성'}</div>
                <div class="badge">양력 ${sYear}.${String(sMon).padStart(2,'0')}.${String(sDay).padStart(2,'0')}</div>
                <div class="badge">음력 ${lYear}.${String(lMon).padStart(2,'0')}.${String(lDay).padStart(2,'0')} ${leapStr}</div>
            `;
        }

        // 기존 hero-summary 숨기기 (점신 아바타로 대체됨)
        const hm = document.getElementById('hero-meta');
        if(hm) hm.parentElement.style.display = 'none';

        const header = `
            <div class="row">
                <div class="cell col-head"></div>
                <div class="cell col-head">시주</div>
                <div class="cell col-head">일주</div>
                <div class="cell col-head">월주</div>
                <div class="cell col-head">년주</div>
            </div>`;

        const buildRow = (label, renderer) => `
            <div class="row">
                <div class="cell row-label">${label}</div>
                ${pillars.map((p, idx) => `<div class="cell">${isUnknown && idx === 0 ? '<span class="tiny-dim">알 수 없음</span>' : renderer(p, idx)}</div>`).join('')}
            </div>`;


        const headerRow = `
            <div class="manse-row">
                <div class="manse-label"></div>
                <div class="manse-head">시주</div>
                <div class="manse-head">일주</div>
                <div class="manse-head">월주</div>
                <div class="manse-head">년주</div>
            </div>`;

        const shinsalBadgeHtml = (items) => {
            const raw = Array.isArray(items) ? items : [items];
            const arr = raw
                .filter(Boolean)
                .flatMap((v) => String(v).split(/\s*[·,\/\|]\s*/g))
                .map((s) => s.trim())
                .filter(Boolean);
            if (!arr.length) return '<div class="m-badge m-badge-shinsal" style="font-size:11px;">-</div>';
            let inner = '';
            for (let i = 0; i < arr.length; i += 2) {
                const pair = arr.slice(i, i + 2);
                const lineInner = pair.join(' · ');
                inner += `<div class="m-badge-shinsal-line">${lineInner}</div>`;
            }
            return `<div class="m-badge m-badge-shinsal" style="font-size:11px;">${inner}</div>`;
        };

        const bRow = (lbl, fn) => `
            <div class="manse-row">
                <div class="manse-cell manse-label">${lbl}</div>
                ${pillars.map((p, i) => `<div class="manse-cell">${(isUnknown && i===0) ? '<span style="color:#555;font-size:11px;">알 수 없음</span>' : fn(p, i)}</div>`).join('')}
            </div>`;

        const manseHtml = [
            headerRow,
            bRow('십성(천)', p => `<div class="m-badge badge tag">${sipToManseBadge(getSipseong(dayStem, p.h[0]), p.n === '일주')}</div>`),
            bRow('천간', p => `
                <div class="m-hanja ${HAN_COLOR[p.h[0]] || ''}" style="font-weight:900;text-shadow:0 0 0.01px currentColor;">${p.h[0]}</div>
                <div class="m-hangul">${HAN_KOR[p.h[0]] || p.h[0]}</div>
            `),
            bRow('지지', p => `
                <div class="m-hanja ${HAN_COLOR[p.h[1]] || ''}" style="font-weight:900;text-shadow:0 0 0.01px currentColor;">${p.h[1]}</div>
                <div class="m-hangul">${HAN_KOR[p.h[1]] || p.h[1]}</div>
            `),
            bRow('십성(지)', p => `<div class="m-badge badge tag">${sipToManseBadge(getSipseong(dayStem, p.h[1]), false)}</div>`),
            bRow('숨은 기둥', p => `<div class="m-badge badge tag jijanggan">${getHidden(p.h[1], dayStem).replace(/<br>/g, '')}</div>`),
            bRow('흐름 리듬', p => `<div class="m-badge">${getUnsung(dayStem, p.h[1]) || '-'}</div>`),
            bRow('지지 신호', p => shinsalBadgeHtml(allTwelveShinsal[p.n])),
            bRow('추가 신호', p => shinsalBadgeHtml(allExtraShinsal[p.n])),
            bRow('빈 공간', p => {
                const ilju = dayStem + ((pillars[1] && pillars[1].h && pillars[1].h[1]) ? pillars[1].h[1] : ((ec.getDay && ec.getDay()[1]) || ''));
                const gmStr = getGongmang(ilju);
                const KR2HJ2 = {'자':'子','축':'丑','인':'寅','묘':'卯','진':'辰','사':'巳','오':'午','미':'未','신':'申','유':'酉','술':'戌','해':'亥'};
                const gmHanja = gmStr ? [...gmStr].map(c => KR2HJ2[c]||c) : [];
                const isGm = gmHanja.includes(p.h[1]);
                return `<div class="m-badge m-badge--gongmang-hit">${isGm ? '해당' : '-'}</div>`;
            })
        ].join('');
        document.getElementById('manse-table').innerHTML = manseHtml;



        const relGrid = document.getElementById('relation-grid');
        const relLines = buildRelationLines(pillars);
        if(relLines.length === 0 || (relLines.length === 1 && relLines[0].type === '없음')) {
            relGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:20px;color:#777;font-size:13px;">특별한 관계 구조가 없습니다.</div>';
        } else {
            relGrid.innerHTML = relLines.map(item => {
                let nodesHtml = '';
                const mkRelChar = (ch) => `
                    <div class="rel-char">
                        <div class="rel-char-circle">
                            <span class="${HAN_COLOR[ch]}" style="font-family:'Noto Sans KR',sans-serif;font-weight:400;">${ch}</span>
                        </div>
                        <span class="rel-char-kr">${HAN_KOR[ch] || ''}</span>
                    </div>`;
                if (item.chars.length === 2) {
                    nodesHtml = `
                        ${mkRelChar(item.chars[0])}
                        <div class="rel-link"></div>
                        ${mkRelChar(item.chars[1])}
                    `;
                } else if (item.chars.length === 3) {
                    nodesHtml = `
                        ${mkRelChar(item.chars[0])}
                        <div class="rel-link"></div>
                        ${mkRelChar(item.chars[1])}
                        <div class="rel-link"></div>
                        ${mkRelChar(item.chars[2])}
                    `;
                }
                
                return `
                <div class="rel-card">
                    <div class="rel-nodes">${nodesHtml}</div>
                    <div class="rel-badge" style="margin-top:10px; margin-bottom:5px;">${item.type}</div>
                    <div class="rel-desc" style="font-size:11px;color:var(--text-dim);">${item.label}</div>
                </div>`;
            }).join('');
        }

        document.getElementById('shinsal-grid').innerHTML = pillars.map((p, idx) => {
            const twl = allTwelveShinsal[p.n] || [];
            const ext = allExtraShinsal[p.n] || [];
            const uns = getUnsung(dayStem, p.h[1]) || '-';
            const isUnk = isUnknown && idx === 0;
            return `<div class="info-card">
                <div class="info-label">${p.n}</div>
                <div style="margin-top:6px;">
                    <div style="font-size:10px;color:var(--gold);letter-spacing:1px;margin-bottom:3px;">지지 신호</div>
                    <div class="info-value" style="margin-bottom:8px;">${isUnk ? '알 수 없음' : (twl.join(', ') || '-')}</div>
                    <div style="font-size:10px;color:#64b5f6;letter-spacing:1px;margin-bottom:3px;">흐름 리듬</div>
                    <div class="info-value" style="margin-bottom:8px;">${isUnk ? '알 수 없음' : uns}</div>
                    <div style="font-size:10px;color:#9b59b6;letter-spacing:1px;margin-bottom:3px;">추가 신호</div>
                    <div class="info-value">${isUnk ? '알 수 없음' : (ext.join(', ') || '-')}</div>
                </div>
            </div>`;
        }).join('');

        const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
        const sipCounts = { 비견:0, 겁재:0, 식신:0, 상관:0, 편재:0, 정재:0, 편관:0, 정관:0, 편인:0, 정인:0 };

        let sipTotalWeight = 0;
        let wuxingTotalWeight = 0;

        pillars.forEach((p, idx) => {
            if (isUnknown && idx === 0) return;
            
            // 기둥별 핵심 가중치 (월지 > 일지 > 시지/년지)
            let stemW = 1.0;
            let zhiW = 1.0;
            if (p.n === '월주') { stemW = 1.2; zhiW = 2.0; } // 월지(계절) 가중치 대폭 상향
            else if (p.n === '일주') { stemW = 1.0; zhiW = 1.5; } // 일지(배우자궁, 나의 근간) 가중치 상향
            else if (p.n === '시주') { stemW = 0.8; zhiW = 1.0; }
            else if (p.n === '년주') { stemW = 0.8; zhiW = 0.8; }
            
            // 천간 적용
            const tGan = p.h[0];
            if (HAN_COLOR[tGan]) {
                counts[HAN_COLOR[tGan]] += stemW;
                wuxingTotalWeight += stemW;
            }
            const s1 = getSipseong(dayStem, tGan);
            if (s1 && sipCounts[s1] !== undefined) {
                sipCounts[s1] += stemW;
                sipTotalWeight += stemW;
            }

            // 지지 표면 적용
            const tZhi = p.h[1];
            if (HAN_COLOR[tZhi]) {
                counts[HAN_COLOR[tZhi]] += zhiW;
                wuxingTotalWeight += zhiW;
            }
            const s2 = getSipseong(dayStem, tZhi);
            if (s2 && sipCounts[s2] !== undefined) {
                sipCounts[s2] += zhiW;
                sipTotalWeight += zhiW;
            }

            // 지장간 분석 (표면 지지 가중치에 비례하여 잠재력 배분)
            const hsList = BRANCH_HIDDEN[tZhi];
            if (hsList && hsList.length > 0) {
                let hl = [];
                // 지장간 총합은 해당 지지 가중치(zhiW)의 약 30~40% 영향력
                const baseHw = zhiW * 0.4; 
                if (hsList.length === 2) {
                    hl.push({ch: hsList[0], w: baseHw * 0.3}); // 여기
                    hl.push({ch: hsList[1], w: baseHw * 0.7}); // 정기
                } else if (hsList.length === 3) {
                    hl.push({ch: hsList[0], w: baseHw * 0.25}); // 여기
                    hl.push({ch: hsList[1], w: baseHw * 0.25}); // 중기
                    hl.push({ch: hsList[2], w: baseHw * 0.50}); // 정기
                }
                
                hl.forEach(h => {
                    if(HAN_COLOR[h.ch]) {
                        counts[HAN_COLOR[h.ch]] += h.w;
                        wuxingTotalWeight += h.w;
                    }
                    const sH = getSipseong(dayStem, h.ch);
                    if(sH && sipCounts[sH] !== undefined) {
                        sipCounts[sH] += h.w;
                        sipTotalWeight += h.w;
                    }
                });
            }
        });

        const wxData = [
            { key:'wood', label:'목', val: percent(counts.wood, wuxingTotalWeight) },
            { key:'fire', label:'화', val: percent(counts.fire, wuxingTotalWeight) },
            { key:'earth', label:'토', val: percent(counts.earth, wuxingTotalWeight) },
            { key:'metal', label:'금', val: percent(counts.metal, wuxingTotalWeight) },
            { key:'water', label:'수', val: percent(counts.water, wuxingTotalWeight) }
        ];
        
        // 오행 분포 자동 요약 한 줄
        const wxMax = wxData.reduce((a,b) => a.val > b.val ? a : b);
        const wxMin = wxData.reduce((a,b) => a.val < b.val ? a : b);
        const wxKorMap = {wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
        const wxSummaryEl = document.getElementById('wuxing-summary');
        if(wxSummaryEl) {
            const dominantDesc = {wood:'성장·도전 에너지',fire:'열정·표현 에너지',earth:'안정·신용 에너지',metal:'결단·절제 에너지',water:'지혜·유연성 에너지'};
            const lackDesc = wxMin.val < 5 ? `<b>${wxKorMap[wxMin.key]}</b> 기운이 ${wxMin.val}%로 거의 없어 보완이 필요합니다.` : '';
            const _dd = dominantDesc[wxMax.key] || '';
            wxSummaryEl.innerHTML = `<b>${wxMax.label}</b> 기운이 <b>${wxMax.val}%</b>로 가장 강합니다 — ${_dd}${getJosa(_dd,'이/가')} 지배적입니다. ${lackDesc}`;
        }

        let wxHtml = '<div class="bar-group">';
        wxData.forEach(w => {
            const badge = (w.key === wxMax.key)
                ? '<span style="font-size:10px;margin-left:6px;padding:1px 6px;border-radius:10px;background:rgba(82,179,106,0.2);color:#7ce8a5;">최강</span>'
                : (w.val <= 4 ? '<span style="font-size:10px;margin-left:6px;padding:1px 6px;border-radius:10px;background:rgba(158,164,170,0.18);color:#b8bfc6;">부족</span>' : '');
            wxHtml += `
                <div class="bar-item">
                    <div class="bar-label-wrap">
                        <span class="bar-label-main ${w.key}">${w.label}</span>
                    </div>
                    <div class="bar-track"><div class="bar-fill bg-${w.key}" style="width:${w.val}%;"></div></div>
                    <div class="bar-value ${w.key}">${w.val}%${badge}</div>
                </div>
            `;
        });
        wxHtml += '</div>';
        document.getElementById('wuxing-bars').innerHTML = wxHtml;


        const SIP_LABEL = {
            비견:{main:'비견', sub:'나·동료'}, 겁재:{main:'겁재', sub:'경쟁자'},
            식신:{main:'식신', sub:'재능·표현'}, 상관:{main:'상관', sub:'자유·창의'},
            편재:{main:'편재', sub:'사업·활동재'}, 정재:{main:'정재', sub:'안정·월급'},
            편관:{main:'편관', sub:'도전·위기'}, 정관:{main:'정관', sub:'명예·직업'},
            편인:{main:'편인', sub:'영감·편법'}, 정인:{main:'정인', sub:'학문·배움'}
        };
        const sipDom = Object.entries(sipCounts).sort((a,b)=>b[1]-a[1]);
        const sipSummaryLines = sipDom.filter(e=>e[1]>0).slice(0,3).map(e=>`<b>${e[0]}</b>`).join(' · ');
        const sipSummaryEl = document.getElementById('sipseong-summary');
        if(sipSummaryEl && sipDom[0][1] > 0) {
            const sipDescMap = {
                비견:'동등한 관계와 협력에 강합니다', 겁재:'경쟁에서 불굴의 승부욕을 발휘합니다',
                식신:'타고난 재능으로 먹고사는 사람입니다', 상관:'틀을 깨는 창의성이 넘칩니다',
                편재:'큰돈의 흐름을 잡는 사업가 기질입니다', 정재:'성실한 노력으로 자산을 쌓습니다',
                편관:'압박 속에서 오히려 빛나는 타입입니다', 정관:'안정적인 사회적 지위를 추구합니다',
                편인:'독학과 영감으로 돌파하는 유형입니다', 정인:'깊은 학문과 배움으로 성장합니다'
            };
            sipSummaryEl.innerHTML = `지배적 십성 구조 : ${sipSummaryLines} — ${sipDescMap[sipDom[0][0]] || ''}`;
        }
        buildBars('sipseong-bars', Object.keys(sipCounts).map(key => ({
            key,
            label: SIP_LABEL[key]?.main || key,
            labelMain: SIP_LABEL[key]?.main || key,
            labelSub: SIP_LABEL[key]?.sub || '',
            value: percent(sipCounts[key], sipTotalWeight)
        })), () => 'bg-earth');


        const sorted = Object.entries(counts).sort((a,b)=>a[1]-b[1]);
        const yong = sorted[0][0]; 
        const hee = sorted[1][0];
        const sortedDesc = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
        const gi = sortedDesc[0][0];
        const goo = sortedDesc[1][0];
        
        
        const korE = {wood:"목", fire:"화", earth:"토", metal:"금", water:"수"};
        
        const setYong = (id, key) => {
            const el = document.getElementById(id);
            el.innerText = korE[key];
            el.className = 'info-value ' + key; // applies color text
        };
        setYong('yong-val', yong);
        setYong('hee-val', hee);
        setYong('gi-val', gi);
        setYong('goo-val', goo);


                // 1. 신강/신약 정밀 계산 (일간 기준)
        const myEl = HAN_COLOR[dayStem];
        let support = 0; // 나를 돕는 기운 (비겁, 인성)
        let control = 0; // 내 힘을 빼는 기운 (식상, 재성, 관성)
        
        // 오행별 상생상극 (수->목->화->토->금->수)
        const sngMap = { 'wood':'water', 'fire':'wood', 'earth':'fire', 'metal':'earth', 'water':'metal' };
        const mySupportEl = sngMap[myEl]; // 나를 낳는 기운 (인성)
        
        const totalW = counts.wood + counts.fire + counts.earth + counts.metal + counts.water;
        
        if (totalW > 0) {
            support = (counts[myEl] || 0) + (counts[mySupportEl] || 0);
            control = totalW - support;
        }
        
        let strength = '중화';
        let ratio = 0.5; // 0 to 1
        if (totalW > 0) {
            ratio = support / totalW;
            if (ratio > 0.55) strength = '신강';
            else if (ratio < 0.45) strength = '신약';
        }
        
        // Needle rotation: -90deg (0%) to +90deg (100%)
        const rot = (ratio * 180) - 90;
        // Gauge fill: dashoffset 251 (empty) to 0 (full)
        const offset = 251 - (251 * ratio);

        document.getElementById('strength-text').innerText = strength;
        const pctEl = document.getElementById('gauge-percent');
        if(pctEl) pctEl.innerText = Math.round(ratio*100) + '%';
        const strengthAdvice = {
            '신강': '밀고 나가는 힘이 강합니다. 유연성과 협력이 보완되면 더욱 크게 성공합니다.',
            '신약': '주변 환경에 잘 적응하는 유연함이 장점입니다. 조력자가 좋은 영역에서 능력을 발휘합니다.',
            '중화': '기운의 밸런스가 뛰어납니다. 다양한 환경에서 안정적으로 성과를 냅니다.'
        };
        document.getElementById('strength-sub').innerHTML = `<span style="color:var(--text-soft);font-size:12px;">내 기운 ${Math.round(ratio*100)}% &nbsp;·&nbsp; ${strengthAdvice[strength] || ''}</span>`;
        const needleEl = document.getElementById('gauge-needle');
        if(needleEl) needleEl.style.transform = `rotate(${rot}deg)`;
        const gaugePathEl = document.getElementById('gauge-path');
        if(gaugePathEl) gaugePathEl.style.strokeDashoffset = offset;

        const yun = ec.getYun(gender === 'M' ? 1 : 0);
        const yunDirection = gender === 'M' ? '순행' : '역행';
        const yunStartAge = yun.getStartAge ? (yun.getStartAge()-1) : '-';
        document.getElementById('yun-text').innerText = `${yunStartAge}세 시작 · ${yunDirection}`;

        // 120세까지 대운 전체 (대운 시작 나이가 120 이하인 것만)
        const allDaYun = yun.getDaYun().slice(1).filter(dy => dy.getStartAge()-1 <= 120);
        const daeunRows = allDaYun.map(dy => {
            const gz = dy.getGanZhi();
            const _dSip = getSipseong(dayStem, gz[0]);
            return [
                (dy.getStartAge()-1) + '세',
                sipToManseBadge(_dSip, false),
                `${gz[0]}${gz[1]}`,
                `${HAN_KOR[gz[0]]}${HAN_KOR[gz[1]]}`,
                getUnsung(dayStem, gz[1]) || '-'
            ];
        });
        buildFortuneCards('daeun-table', daeunRows);

        const currentYearObj = getReportBaseDate(globalSajuData || {});
        const currentYear = currentYearObj.getFullYear();
        const currentMonth = currentYearObj.getMonth() + 1;
        // 만 나이(양력 생일 기준 근사)만 사용
        const currentAge = getClientAgeYearsAtReport(globalSajuData || {});
        
        // Find active Daeun
        let activeDaeunIdx = -1;
        const daeunData = allDaYun;
        for(let i = 0; i < daeunData.length; i++) {
            if(currentAge >= (daeunData[i].getStartAge()-1) && (i === daeunData.length - 1 || currentAge < (daeunData[i+1].getStartAge()-1))) {
                activeDaeunIdx = i; break;
            }
        }
        // inject highlight logic into buildFortuneCards
        window.buildFortuneCards = function(targetId, rows, hIdx = -1) {
            var stackClass = (targetId === 'seun-table' || targetId === 'wolun-table') ? ' fortune-scroll--stack' : '';
            var wrapClass = (targetId === 'seun-table') ? 'yearly-card-container' : ((targetId === 'wolun-table') ? 'monthly-card-container' : '');
            var wrapOpen = wrapClass ? ('<div class="' + wrapClass + '">') : '';
            var wrapClose = wrapClass ? '</div>' : '';
            document.getElementById(targetId).innerHTML = wrapOpen + '<div class="fortune-scroll' + stackClass + '">' + rows.map((row, idx) => `
                <div class="f-card ${idx === hIdx ? 'current-fortune' : ''}">
                    <div class="f-head">${row[0]}</div>
                    <div class="f-sip">${row[1]}</div>
                    <div class="f-hz"><span class="report-pillar-hanja ${HAN_COLOR[row[2][0]]||''}">${row[2][0]}</span><br><span class="report-pillar-hanja ${HAN_COLOR[row[2][1]]||''}">${row[2][1]}</span></div>
                    <div class="f-kr">${row[3]}</div>
                    <div class="f-un">${row[4]}</div>
                </div>
            `).join('') + '</div>' + wrapClose;
        };

        const daeunRows2 = daeunData.map(dy => {
            const gz = dy.getGanZhi();
            const _ds = getSipseong(dayStem, gz[0]);
            return [ (dy.getStartAge()-1) + '세', sipToManseBadge(_ds, false), `${gz[0]}${gz[1]}`, `${HAN_KOR[gz[0]]}${HAN_KOR[gz[1]]}`, getUnsung(dayStem, gz[1]) || '-' ];
        });
        buildFortuneCards('daeun-table', daeunRows2, activeDaeunIdx);
        // ===== 대운 표 아래 풀이 주입 =====
        (function(){
            var _daeunPolish = globalSajuData || { name: (typeof name !== 'undefined' ? name : '') };
            function _dText(t) { return voicePolishReportHtml(_daeunPolish, t || ''); }
            var OH={'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            var JO={'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
            var GAN_T={
    '甲':'【갑목 대운】 새로운 판을 까는 시기입니다. 이 10년 안에 가능하면 무언가를 시작해야 합니다. 직업: 이직·창업·학업 시작에 가장 강한 추진력을 받습니다. 지금 망설이면 다음 기회는 10년 후입니다. 재물: 투자보다 새 수입원 개척이 우선입니다. 종잣돈을 만드는 시기. 인간관계: 인생의 방향을 바꿀 스승·멘토를 만나는 시기입니다. 눈을 크게 뜨고 찾으십시오. 조심: 너무 많은 것을 한꺼번에 시작하려다 전부 흐지부지되는 것이 이 시기의 함정입니다. 하나에 집중하십시오.',
    '乙':'【을목 대운】 혼자 힘보다 사람을 통한 성취가 극대화되는 시기입니다. 직업: 이 시기에 만나는 귀인 한 명이 직업과 수입을 통째로 바꿀 수 있습니다. 협력·파트너십·네트워크를 적극 활용하십시오. 재물: 단독 투자보다 공동 투자·합작이 더 유리합니다. 인간관계: 결혼·동업·중요한 계약이 이 시기에 많이 일어납니다. 인연을 신중하게 골라야 합니다. 조심: 타인에게 너무 의존하거나, 나쁜 인연에 끌려다니면 10년이 낭비됩니다. 사람을 보는 눈을 키우십시오.',
    '丙':'【병화 대운】 10년 내내 조명이 당신에게 쏟아지는 시기입니다. 직업: 승진·공개 발표·브랜딩·강의·방송 등 자신을 드러내는 모든 활동이 성과를 냅니다. 숨어 있으면 손해입니다. 재물: 사회적 인정이 돈으로 연결됩니다. 명성과 신뢰가 쌓이는 만큼 수입이 따라옵니다. 인간관계: 많은 사람이 당신을 주목합니다. 인맥이 폭발적으로 넓어지지만 질보다 양이 되지 않도록 유의하십시오. 조심: 과로·과욕·과노출이 함정입니다. 체력 관리가 이 시기 최고의 투자입니다.',
    '丁':'【정화 대운】 깊이 파는 사람이 이기는 시기입니다. 직업: 전문성·자격증·기술 축적이 빛을 발합니다. 한 분야를 10년간 깊이 파면 이 시기가 끝날 때 당신은 그 분야의 전문가가 됩니다. 재물: 화려한 수입보다 전문성 기반의 안정적 수입 구조를 만드는 시기입니다. 인간관계: 넓은 인맥보다 깊은 신뢰 관계 2~3명이 인생을 바꿉니다. 조심: 너무 깊이 파느라 사회적 연결이 끊어지는 것이 함정입니다. 고립되지 않도록 주기적으로 사람들을 만나십시오.',
    '戊':'【무토 대운】 10년 후를 내다보고 기반을 다지는 시기입니다. 직업: 지금 당장의 성과보다 10년 후 가치 있는 것에 집중하십시오. 부동산·자산·사업 기반 확장에 최적입니다. 재물: 이 시기에 부동산 계약, 장기 투자, 사업 기반 확보를 하면 훗날 큰 열매를 맺습니다. 인간관계: 신뢰를 쌓는 시기입니다. 의리와 원칙을 지켜야 합니다. 이 시기에 쌓은 신뢰가 다음 10년의 자산이 됩니다. 조심: 너무 느리게 움직이다 기회를 놓치는 것이 함정입니다. 묵직함과 추진력을 동시에 발휘하십시오.',
    '己':'【기토 대운】 뿌린 씨앗이 열매로 돌아오는 시기입니다. 직업: 이전에 쌓은 경험과 관계가 실질적 성과로 돌아옵니다. 세밀한 관리와 내실 있는 운영이 최선입니다. 재물: 새로운 투자보다 기존 자산 관리와 수익 최적화에 집중하십시오. 작은 수입원을 여러 개 만드는 것이 유리합니다. 인간관계: 주변 사람들과의 관계를 정리하는 시기입니다. 오래된 인연 중 진짜 내 편이 누구인지 보입니다. 조심: 지나친 소심함과 결정 회피가 함정입니다. 이미 충분히 준비됐습니다. 실행하십시오.',
    '庚':'【경금 대운】 불필요한 것을 쳐내고 핵심만 남기는 시기입니다. 직업: 과감한 구조 개혁·혁신·이직·새 분야 개척의 에너지가 극대화됩니다. 망설이면 기회가 지나갑니다. 재물: 낭비를 과감하게 제거하고 핵심 자산을 강화하십시오. 수입 구조를 단순화하고 효율을 높이는 것이 최선입니다. 인간관계: 피상적 관계를 정리하는 시기입니다. 진짜 필요한 사람 몇 명에게 집중하십시오. 조심: 너무 과격하게 모든 것을 바꾸려다 중요한 것까지 잃는 것이 함정입니다. 한 번에 하나씩 자르십시오.',
    '辛':'【신금 대운】 완성도를 극에 달하게 하는 시기입니다. 직업: 디테일에 집중하고 품질을 극대화할 때 가장 큰 성과가 납니다. 완성된 결과물이 인정받습니다. 재물: 이 시기에 만들어진 콘텐츠·작품·브랜드가 오래도록 수익을 냅니다. 장기적 자산이 되는 것에 투자하십시오. 인간관계: 고집이 세질 수 있습니다. 자신의 기준이 높아질수록 타인에게 요구도 높아집니다. 의식적으로 유연함을 발휘하십시오. 조심: 완벽주의가 실행을 막는 것이 함정입니다. 80점짜리를 내놓는 것이 100점을 기다리는 것보다 낫습니다.',
    '壬':'【임수 대운】 인맥과 기회가 사방에서 밀려오는 시기입니다. 직업: 새로운 분야·사람·기회에 문을 활짝 여십시오. 이 10년은 인생에 한두 번 오는 확장의 시기입니다. 재물: 투자 기회가 많지만 분산 리스크를 조심하십시오. 한 곳에 몰빵보다 포트폴리오 전략이 유리합니다. 인간관계: 인맥이 폭발적으로 넓어집니다. 이 시기에 만나는 사람 중 인생을 바꿀 귀인이 가능하면 있습니다. 조심: 너무 많은 기회에 현혹돼 집중을 잃는 것이 함정입니다. 선택과 집중이 필수입니다.',
    '癸':'【계수 대운】 보이지 않는 곳에서 힘을 키우는 시기입니다. 직업: 분석·연구·학습·계획에 집중하십시오. 이 시기에 축적한 지식과 전략이 다음 대운에서 폭발합니다. 재물: 새로운 수입보다 지식·기술·네트워크에 투자하는 것이 정답입니다. 인간관계: 겉으로 드러나지 않는 관계에서 진짜 신뢰가 쌓입니다. 조심: 지나친 소극성과 회의주의가 함정입니다. 분석이 끝났으면 실행하십시오. 준비는 언제나 충분하지 않습니다.'
    };
    var JI_T={
    '子':'지지 자(쥐): 지혜와 집중력이 최대화되는 시기입니다. 이 기간에 자격증·전문 학습·분석 작업을 집중적으로 하면 이후 10년의 무기가 됩니다. 한편 대인관계에서 고립되기 쉬우니 의식적으로 사람들과 어울리는 시간을 만드십시오.',
    '丑':'지지 축(소): 눈에 보이는 성과보다 내공이 쌓이는 시기입니다. 답답하더라도 이 기간을 묵묵히 버틴 사람과 포기한 사람의 차이는 다음 대운에서 극명하게 갈립니다. 성실함이 가장 큰 경쟁력입니다.',
    '寅':'지지 인(호랑이): 강렬한 변화와 이동의 시기입니다. 이사·이직·새로운 환경으로의 출발이 이 기간에 집중됩니다. 이 시기에 시작한 일은 오래 지속됩니다. 반면 충동적 결정이 많아지므로, 큰 결정 전에 가능하면 3일 이상 숙고하십시오.',
    '卯':'지지 묘(토끼): 인맥이 폭발적으로 넓어지고 협력의 기회가 풍부해집니다. 혼자 하는 것보다 함께 할 때 성과가 2배가 됩니다. 새로운 모임·커뮤니티·파트너십에 적극적으로 참여하십시오.',
    '辰':'지지 진(용): 예상치 못한 변수와 큰 변화가 잦습니다. 유연하게 대응하면 인생의 전환점이 되지만, 고집을 부리면 충돌이 생깁니다. 계획보다 실행이 앞서야 하는 시기입니다.',
    '巳':'지지 사(뱀): 내면의 결단이 요구되는 시기입니다. 오래 고민해온 문제의 답이 이 기간에 명확해집니다. 과감한 선택이 이후 10년의 방향을 결정합니다. 결단을 미루는 것이 가장 큰 손실입니다.',
    '午':'지지 오(말): 쌓아온 노력이 사회적으로 인정받는 시기입니다. 이 기세를 타고 더 큰 무대에 올라서야 합니다. 망설이면 흘러가버립니다. 직장·사업·사회적 활동 모두에서 전면에 나서십시오.',
    '未':'지지 미(양): 풍요로운 감성과 예술적 에너지가 넘치는 시기입니다. 인간적인 관계가 깊어지고 창의적 활동이 빛을 발합니다. 재물보다 관계와 내면 성장에 투자하면 장기적으로 더 큰 것으로 돌아옵니다.',
    '申':'지지 신(원숭이): 기회가 빠르게 스쳐 지나가는 시기입니다. 포착하셨다면 리스크 한도를 먼저 정하고 검증된 범위에서 신속히 옮기십시오. 머뭇거림이 길어지면 기회가 엇갈릴 수 있습니다. 빠른 판단력과 집행력이 이 시기의 핵심 능력입니다.',
    '酉':'지지 유(닭): 쌓아온 전문성이 인정받고 노력에 대한 정당한 대가가 돌아오는 시기입니다. 완성도 높은 결과물을 세상에 내놓을 최적기입니다.',
    '戌':'지지 술(개): 통찰과 마무리의 시기입니다. 불필요한 것을 정리하고 핵심 가치에 집중하게 됩니다. 오래된 관계·습관·직업 중 더 이상 나를 성장시키지 못하는 것들을 정리할 용기가 필요합니다.',
    '亥':'지지 해(돼지): 겉으로는 정체처럼 보이지만 내면에 엄청난 에너지가 축적되는 시기입니다. 이 시기를 분석·학습·네트워크 구축으로 채운 사람은 다음 대운에서 폭발적으로 도약합니다.'
    };
    var sc={wood:0,fire:0,earth:0,metal:0,water:0}; if(yong) sc[yong]+=2; if(hee) sc[hee]+=1; if(gi) sc[gi]-=2; if(goo) sc[goo]-=1;
            function gs(g,j){return (sc[OH[g]]||0)+(sc[JO[j]]||0);}
            function gc(s){return s>=3?'#c7a76a':s>=1?'#00C853':s===0?'#888':s>=-2?'#ff9800':'#e74c3c';}
            function gb(s){return s>=3?'🌟 대길':s>=1?'✦ 길':s===0?'— 평':s>=-2?'⚠ 주의':'❌ 흉';}
            var wrap=document.getElementById('daeun-table');
            if(!wrap) return;
            var detDiv=document.createElement('div');
            detDiv.style.cssText='margin-top:12px;display:flex;flex-direction:column;gap:12px;';
            var _daeunAgeCut = (globalSajuData && typeof getClientAgeYearsAtReport === 'function') ? getClientAgeYearsAtReport(globalSajuData) : currentAge;
            daeunData.forEach(function(dy,idx){
                var gz=dy.getGanZhi();var g=gz[0];var j=gz[1];
                var age=dy.getStartAge()-1;
                var endAge=idx<daeunData.length-1?(daeunData[idx+1].getStartAge()-1):age+10;
                if (_daeunAgeCut > 0 && (endAge - 1) < _daeunAgeCut) return;
                var _birthY=(globalSajuData&&globalSajuData.birthYear)||1988;
                var _startYr=_birthY+age-1;var _endYr=_birthY+endAge-2;
                var s=gs(g,j);var isCur=idx===activeDaeunIdx;var col=gc(s);
                var STRAT_GOOD = [
    '▶ 【흥(興)】 재물: 이 시기에 투자·창업·계약을 결행하면 성과가 따릅니다. 타이밍을 놓치지 않는 편이 좋습니다.',
    '▶ 직업: 이직·승진·신규 프로젝트 착수에 이보다 좋은 시기가 없습니다. 두려움을 버리고 나아가십시오.',
    '▶ 인간관계: 귀인이 나타납니다. 새로운 모임과 커뮤니티에 적극 참여하면 인생을 바꿀 만남이 기다립니다.',
    '▶ 보완: 과욕으로 인한 과부하만 조심하십시오. 체력이 곧 자산입니다.'
];
var STRAT_MID = [
    '▶ 【현상유지 + 내실】 재물: 신규 투자보다 기존 자산 관리와 꾸준한 저축이 최선입니다.',
    '▶ 직업: 지금 위치에서 전문성과 신뢰를 쌓는 시기입니다. 큰 변화보다 깊이가 중요합니다.',
    '▶ 인간관계: 화려한 인연보다 깊은 신뢰 관계를 2~3명과 쌓으십시오.',
    '▶ 보완: 이 시기에 축적한 것이 다음 황금 대운의 탄약이 됩니다. 멈추지 않는 편이 좋습니다.'
];
var STRAT_BAD = [
    '▶ 【쇠(衰) — 지킴의 시기】 재물: 신규 투자·확장·큰 지출을 최소화하십시오. 비상금을 먼저 확보하십시오.',
    '▶ 직업: 가능하면 현 위치를 유지하십시오. 이직·창업은 다음 대운으로 미루는 것이 현명합니다.',
    '▶ 인간관계: 갈등이 쉽게 생기는 시기입니다. 감정적 대응을 자제하고, 중요한 결정을 서두르지 않는 편이 좋습니다.',
    '▶ 보완: 이 시기를 학습·자기개발·인맥 정비로 채운 사람이 다음 황금 대운에서 가장 크게 도약합니다.'
];
var strat = _dText(s>=2 ? STRAT_GOOD.join('<br>') : s>=0 ? STRAT_MID.join('<br>') : STRAT_BAD.join('<br>'));
                var d=document.createElement('div');
                d.style.cssText='padding:14px;background:rgba(255,255,255,'+(isCur?'0.07':'0.03')+');border:1px solid '+(isCur?'var(--gold)':'rgba(255,255,255,0.07)')+';border-radius:10px;';
                d.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px;">'+
                    '<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:22px;font-weight:900;color:var(--gold);font-family:Noto Sans KR,serif;">'+g+j+'</span><span style="font-size:15px;font-weight:600;color:#ccc;">('+((HAN_KOR&&HAN_KOR[g])||g)+((HAN_KOR&&HAN_KOR[j])||j)+')</span>'+
                    '<div><div style="font-size:12px;color:#bbb;">'+age+'세 ~ '+(endAge-1)+'세</div>'+(isCur?'<span style="font-size:10px;background:rgba(199,167,106,0.10);color:var(--gold);border:1px solid rgba(199,167,106,0.40);padding:1px 6px;border-radius:6px;font-weight:600;letter-spacing:0.3px;">▶ 현재</span>':'')+'</div></div>'+
                    '<span style="font-size:12px;font-weight:700;color:'+col+';">'+gb(s)+'</span></div>'+
                    '<div style="background:rgba(0,0,0,0.15);border-radius:6px;padding:10px;margin-bottom:8px;"><p style="font-size:12px;color:#ddd;line-height:1.75;margin:0;">'+_dText((window.PERIOD_NARRATIVE&&window.PERIOD_NARRATIVE[g+j]) ? window.PERIOD_NARRATIVE[g+j] : (GAN_T[g]||'')+' '+(JI_T[j]||''))+'</p></div>'+
                    /* 천간/지지 분리박스 제거 */
                    '<div style="background:rgba(199,167,106,0.05);border-radius:6px;padding:8px 10px;border-left:2px solid '+col+';"><p style="font-size:12px;color:#ccc;line-height:1.75;margin:0;">'+strat+'</p></div>';
                detDiv.appendChild(d);
            });
            wrap.appendChild(detDiv);
        })();
        // ===== 대운 그래프 =====
        (function() {
            // 그래프 풀이 텍스트
            (function(){
                const narr = document.getElementById('daeun-graph-narr');
                if(!narr || !globalSajuData) return;
                const d = globalSajuData;
                const rows = d.daeunRows || [];
                const aIdx = d.activeDaeunIdx || 0;
                const cur = rows[aIdx];
                const OH = {wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
                const sc = {[d.yong]:2,[d.hee]:1,[d.gi]:-2,[d.goo]:-1};
                const OH_MAP = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
                const JI_MAP = {'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
                const goodDw = rows.filter((r,i)=>{
                    const g=(r.gz&&r.gz[0])||''; const j=(r.gz&&r.gz[1])||'';
                    const s=(sc[OH_MAP[g]]||0)+(sc[JI_MAP[j]]||0);
                    return s>=2;
                });
                const curGz = cur && cur.gz ? cur.gz : [];
                const curG = curGz[0]||''; const curJ = curGz[1]||'';
                const curScore = (sc[OH_MAP[curG]]||0)+(sc[JI_MAP[curJ]]||0);
                const curLabel = curScore>=2?'🌟 황금 대운':curScore>=1?'✦ 길운':curScore===0?'— 평운':curScore>=-2?'⚠ 주의':'❌ 역운';
                const name = d.name||'고객';
                let txt = '<div style="background:rgba(199,167,106,0.05);border-radius:12px;padding:16px 18px;border-left:3px solid var(--gold);">';
                txt += '<div style="font-size:12px;color:var(--gold);margin-bottom:10px;letter-spacing:1px;">◈ 인생 흐름 그래프 읽는 법</div>';
                txt += '<p style="font-size:13px;color:#bbb;line-height:1.85;margin:0 0 10px;">위 그래프는 '+nmUi(name)+' 대운 에너지 곡선입니다. 용신/희신 기운이 강한 대운은 <span style="color:#c7a76a;font-weight:700;">황금색(🌟)</span>으로 표시되고, 기신/구신 기운은 <span style="color:#e74c3c;font-weight:700;">빨간색(❌)</span>으로 표시됩니다. 곡선이 높을수록 길한 시기, 낮을수록 주의가 필요한 시기입니다.</p>';
                txt += '<p style="font-size:13px;color:#ddd;line-height:1.85;margin:0 0 8px;"><b>현재 대운:</b> '+(cur?((cur.gz||[]).join('')||cur.name||''):'확인 불가')+' ('+(cur?cur.age+'세~':'') +') — '+curLabel+'</p>';
                if(goodDw.length>0){
                    txt += '<p style="font-size:13px;color:#c7a76a;line-height:1.85;margin:0;">평생 황금 대운: '+goodDw.map(r=>(r.gz||[]).join('')+' ('+r.age+'세~)').join(', ')+'</p>';
                }
                txt += '</div>';
                narr.innerHTML = txt;
            })();
            const svg = document.getElementById('daeun-graph-svg');
            if(!svg) return;
            const rows = daeunData;
            const n = rows.length;
            if(n === 0) return;
            const OHMAP = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            const sc = {};
            sc[yong]=2; sc[hee]=1; sc[gi]=-2; sc[goo]=-1;
            const scores = rows.map(dy=>{const gz=dy.getGanZhi(); return (sc[OHMAP[gz[0]]]||0)+(sc[OHMAP[gz[1]]]||0);});
            const minS = Math.min(...scores)-1, maxS = Math.max(...scores)+1, range = maxS-minS||1;
            const W = Math.max(svg.parentElement ? svg.parentElement.clientWidth || 600 : 600, n*64+60);
            const H=240, PL=40,PR=24,PT=30,PB=55, gW=W-PL-PR, gH=H-PT-PB, step=gW/(n-1||1);
            const pts = rows.map((dy,i)=>({
                x: PL+i*step,
                y: PT+gH-((scores[i]-minS)/range)*gH,
                age: dy.getStartAge()-1,
                gz: dy.getGanZhi(),
                score: scores[i]
            }));
            const midY = PT+gH-((0-minS)/range)*gH;
            // 부드러운 베지어 곡선
            function bezierPath(points) {
                if(points.length < 2) return '';
                let d = `M${points[0].x},${points[0].y}`;
                for(let i=1; i<points.length; i++) {
                    const px = points[i-1]; const nx = points[i];
                    const cx = (px.x+nx.x)/2;
                    d += ` C${cx},${px.y} ${cx},${nx.y} ${nx.x},${nx.y}`;
                }
                return d;
            }
            const linePath = bezierPath(pts);
            const fillPath = linePath + ` L${pts[n-1].x},${H-PB} L${pts[0].x},${H-PB} Z`;
            let s = `<defs>
                <linearGradient id="gg-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#c8941c" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="#c8941c" stop-opacity="0.02"/>
                </linearGradient>
                <filter id="dot-glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="line-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>`;
            // 배경 그리드 라인
            for(let yi=0; yi<=4; yi++) {
                const gy = PT + (gH/4)*yi;
                s += `<line x1="${PL}" y1="${gy}" x2="${W-PR}" y2="${gy}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
            }
            // Y축 레이블
            s += `<text x="${PL-8}" y="${PT+5}" text-anchor="end" font-size="10" fill="rgba(199,167,106,0.6)">길</text>`;
            s += `<text x="${PL-8}" y="${H-PB+4}" text-anchor="end" font-size="10" fill="rgba(180,80,80,0.6)">흉</text>`;
            // 중앙 기준선
            s += `<line x1="${PL}" y1="${midY}" x2="${W-PR}" y2="${midY}" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" stroke-dasharray="6,4"/>`;
            s += `<text x="${PL-8}" y="${midY+4}" text-anchor="end" font-size="9" fill="rgba(255,255,255,0.3)">중</text>`;
            // 영역 채우기
            s += `<path d="${fillPath}" fill="url(#gg-fill)"/>`;
            // 곡선 라인 (글로우)
            s += `<path d="${linePath}" fill="none" stroke="rgba(199,167,106,0.4)" stroke-width="5" stroke-linecap="round"/>`;
            s += `<path d="${linePath}" fill="none" stroke="rgba(199,167,106,0.95)" stroke-width="2.5" stroke-linecap="round" filter="url(#line-glow)"/>`;
            // 점 + 레이블
            pts.forEach((p,i)=>{
                const act = i===activeDaeunIdx;
                const col = p.score>=1?'#00C853':p.score<=-1?'#e74c3c':'#c8941c';
                const gz = p.gz;
                // 현재 대운 halo
                if(act) {
                    s += `<circle cx="${p.x}" cy="${p.y}" r="18" fill="${col}" opacity="0.10"/>`;
                    s += `<circle cx="${p.x}" cy="${p.y}" r="12" fill="${col}" opacity="0.15"/>`;
                }
                s += `<circle cx="${p.x}" cy="${p.y}" r="${act?9:6}" fill="${col}" stroke="rgba(0,0,0,0.9)" stroke-width="2.5" filter="url(#dot-glow)"/>`;
                // 간지 (점 위)
                const HK = {'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계','子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
                s += `<text x="${p.x}" y="${p.y-(act?16:13)}" text-anchor="middle" font-size="${act?12:10}" font-weight="700" fill="${col}">${HK[gz[0]]||gz[0]}${HK[gz[1]]||gz[1]}</text>`;
                // 나이 (아래)
                s += `<text x="${p.x}" y="${H-PB+18}" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.65)">${p.age}세</text>`;
                // 현재 표시
                if(act) s += `<text x="${p.x}" y="${H-PB+32}" text-anchor="middle" font-size="10" font-weight="700" fill="${col}">▶ 현재</text>`;
            });
            svg.innerHTML = s;
            svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
            svg.setAttribute('preserveAspectRatio', 'none');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', H);
        })();

        // ===== 인생 시기별 풀이 =====
        (function() {
            const el = document.getElementById('lifecycle-cards');
            if(!el) return;
            const OHMAP2 = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            const sc2 = {}; sc2[yong]=2; sc2[hee]=1; sc2[gi]=-2; sc2[goo]=-1;
            const OHKR = {wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
            const hmap = {wood:'간담·신경계',fire:'심장·혈관',earth:'위장·소화기',metal:'폐·대장',water:'신장·호르몬'};
            const eras = [
                {era:'🌱 유년기 (0~20세)', filter: d=>(d.getStartAge()-1)<20},
                {era:'🔥 초년기 (20~40세)', filter: d=>(d.getStartAge()-1)>=20&&(d.getStartAge()-1)<40},
                {era:'⚡ 중년기 (40~60세)', filter: d=>(d.getStartAge()-1)>=40&&(d.getStartAge()-1)<60},
                {era:'🌙 말년기 (60세~)', filter: d=>(d.getStartAge()-1)>=60},
            ];
            el.innerHTML = eras.map(({era, filter})=>{
                const ds = daeunData.filter(filter);
                if(!ds.length) return '';
                const avg = ds.reduce((s,d)=>{const gz=d.getGanZhi(); return s+(sc2[OHMAP2[gz[0]]]||0)+(sc2[OHMAP2[gz[1]]]||0);},0)/ds.length;
                const trend = avg>=1?'상승기 — 기운이 뻗어나가는 시기':avg<=-1?'저조기 — 내실을 다지는 준비의 시간':'중화기 — 안정적인 흐름';
                const col = avg>=1?'#00C853':avg<=-1?'#e74c3c':'#c8941c';
                const HK2={'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계','子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
                const gzList = ds.map(d=>{const gz=d.getGanZhi(); return (HK2[gz[0]]||gz[0])+(HK2[gz[1]]||gz[1]);}).join(' · ');
                return `<div class="lifecycle-card"><div class="lc-era">${era}</div><div class="lc-title" style="color:${col}">${trend}</div><div class="lc-text">대운: ${gzList}<br>${avg>=0?'용신 운과 가까운 시기로 전진의 에너지가 작동합니다.':'기신 운의 영향으로 인내와 준비가 요구되는 시기입니다.'}</div></div>`;
            }).join('');
        })();

        // ===== 카테고리별 분석 =====
        (function() {
            const OHMAP3 = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            const stemEl = OHMAP3[dayStem]||'earth';
            const jaeC = (sipCounts['정재']||0)+(sipCounts['편재']||0);
            const gwanC = (sipCounts['정관']||0)+(sipCounts['편관']||0);
            const inC = (sipCounts['정인']||0)+(sipCounts['편인']||0);
            const sikC = (sipCounts['식신']||0)+(sipCounts['상관']||0);
            const hmap = {wood:'간담·신경계',fire:'심장·혈관',earth:'위장·소화기',metal:'폐·대장',water:'신장·호르몬'};
            const pct = v => Math.round(v/Math.max(sipTotalWeight,1)*100);
            const OHE={wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
            const curY=new Date().getFullYear(); const curM=new Date().getMonth()+1;
            let yGan='', yJi='', mGan='', mJi='';
            try{
                const yEc=Solar.fromYmd(curY,6,15).getLunar().getEightChar();
                const yGz=yEc.getYear(); yGan=yGz[0]||''; yJi=yGz[1]||'';
                const mEc=Solar.fromYmd(curY,curM,15).getLunar().getEightChar();
                const mGz=mEc.getMonth(); mGan=mGz[0]||''; mJi=mGz[1]||'';
            }catch(e){}
            const ySipGan=(typeof getSipseong==='function'&&yGan)?(getSipseong(dayStem,yGan)||''):'';
            const ySipJi=(typeof getSipseong==='function'&&yJi)?(getSipseong(dayStem,yJi)||''):'';
            const mSipGan=(typeof getSipseong==='function'&&mGan)?(getSipseong(dayStem,mGan)||''):'';
            const mSipJi=(typeof getSipseong==='function'&&mJi)?(getSipseong(dayStem,mJi)||''):'';
            const flowAnchor=`올해(${curY})는 ${yGan}${yJi} 흐름, 이달(${curM}월)은 ${mGan}${mJi} 흐름입니다.`;
            const dyn = evaluateMasterDynamics(pillars);
            const dynLine = buildDynamicsNarrative(dyn);
            const healthFlowHint = `현재 흐름 기준으로 ${flowAnchor} 원국 취약점(${OHE[stemEl]||stemEl})이 겹치는 달에는 수면·회복 루틴을 우선순위 1순위로 두는 편이 안전합니다.`;

            // ── 건강운 상세 ──
            const _catV = function(t){ return voicePolishReportHtml(globalSajuData || {name: name}, t || ''); };
            const healthOverall = counts[stemEl]>=30
                ? `당신의 사주 원국에서 <b>${({wood:'목',fire:'화',earth:'토',metal:'금',water:'수'})[stemEl]}</b> 기운이 과도하게 집중되어 있습니다. 에너지가 한쪽으로 치우친 사주는 그 기운이 담당하는 장기에 반복적으로 부담이 쌓입니다. 특히 스트레스가 극에 달했을 때 가장 먼저 타격을 받는 것이 바로 <b>${hmap[stemEl]}</b>입니다. 이를 아는 것만으로도 당신은 평균보다 훨씬 오래, 건강하게 살 수 있습니다.`
                : `당신의 오행은 비교적 균형을 이루고 있습니다. 선천적인 건강 자본이 양호한 편입니다. 다만 기신 오행인 <b>${({wood:'목',fire:'화',earth:'토',metal:'금',water:'수'})[gi]||'해당 오행'}</b>의 기운이 강해지는 계절이나 대운에서 면역력이 급격히 떨어질 수 있습니다.`;
            const healthDetail = ({
                wood: `<b>🌿 목 — 간·담낭·신경계 집중 관리</b><br>
                간은 '분노의 장기'라 불립니다. 억눌린 감정, 과도한 경쟁심, 스트레스가 쌓이면 간 수치가 올라가고 눈이 충혈되며 편두통이 옵니다. 알코올을 멀리하고, 녹황색 채소와 신맛(레몬, 식초)이 간 기운을 보완합니다. 봄철(3~5월)과 인·묘월에 **술·야근을 먼저 끊으십시오.**`,
                fire: `<b>🔥 화 — 심장·혈관·안구 집중 관리</b><br>
                심장과 소장이 취약 지점입니다. 과도한 흥분, 불규칙한 수면, 카페인 과다 섭취는 심박수를 불안정하게 만듭니다. 혈압 관리가 평생 과제이며, 여름철(6~8월)과 사·오월에 혈관 관련 이상 신호에 즉각 반응하는 습관이 생존을 결정합니다.`,
                earth: `<b>🌍 토 — 위장·비장·소화기 집중 관리</b><br>
                걱정과 과도한 생각이 소화기를 망가뜨립니다. 당신은 머릿속이 복잡할수록 위장이 먼저 반응합니다. 식사 시간을 규칙적으로 유지하고, 과식을 피하며, 따뜻한 음식 위주로 식단을 구성하십시오. 환절기와 토의 기운이 강한 진·술·축·미월에 소화 장애가 집중됩니다.`,
                metal: `<b>⚙️ 금 — 폐·대장·호흡기 집중 관리</b><br>
                슬픔과 우울감이 폐 기운을 손상시킵니다. 미세먼지에 유독 취약하며 호흡기 감염이 오래갑니다. 유산소 운동으로 폐활량을 키우고, 하얀 음식(배, 무, 도라지)이 폐를 보강합니다. 가을철(9~11월)과 신·유월에 **마스크·환기**를 먼저 고정하십시오.`,
                water: `<b>💧 수 — 신장·방광·호르몬 집중 관리</b><br>
                두려움과 불안이 신장 기운을 갉아먹습니다. 만성 피로, 허리 통증, 호르몬 불균형이 반복된다면 신장 에너지 고갈의 신호입니다. 충분한 수면과 수분 섭취가 최우선입니다. 겨울철(12~2월)과 해·자월에 **철야·과로**를 먼저 줄이십시오.`
            })[stemEl] || '오행 균형에 따라 계절별 건강 관리가 중요합니다.';

            document.getElementById('cat-health').innerHTML = `
                <div class="cat-header"><span class="cat-icon">🫀</span><span class="cat-title">건강운 자세히 보기</span></div>
                <div class="cat-body">
                    <p class="cat-text">${_catV(healthOverall)}</p>
                    <div class="cat-highlight">${healthDetail}</div>
                    <div class="cat-advice"><b style="color:#ddd;">실행 방향</b><p style="margin:8px 0 0;color:#cfcfcf;line-height:1.8;">건강운은 큰 결심보다 꾸준한 루틴에서 결과가 갈립니다. 수면과 회복 시간을 생활의 고정 축으로 먼저 잡고, 분기별 검진을 미리 예약해 몸의 신호를 선제적으로 확인하십시오. ${healthFlowHint} ${dynLine}</p></div>
                </div>`;

            // ── 재물운 상세 ──
            const wealthType = jaeC > sipTotalWeight*0.25 ? 'rich' : jaeC === 0 ? 'none' : 'balanced';
            const wealthMain = {
                rich: `당신의 사주에는 재성이 풍부합니다. 돈 냄새를 맡는 본능이 탁월하고 기회가 왔을 때 놓치지 않는 감각이 있습니다. 그러나 '재다신약'의 함정을 조심해야 합니다. 너무 많은 기회가 오히려 당신을 소진시킵니다. 선택과 집중이 부의 핵심 전략입니다.`,
                none: `당신의 사주는 무재 구조입니다. 이것을 '돈과 인연이 없다'고 해석하는 것은 구시대적 오류입니다. 무재 사주의 진짜 의미는 돈을 직접 쫓으면 오히려 도망간다는 것입니다. 당신은 명예, 전문성, 브랜드 가치를 극대화할 때 돈이 그림자처럼 따라오는 구조입니다. 돈보다 가치를 먼저 만드십시오.`,
                balanced: `당신의 재성은 적정 수준으로 균형 잡혀 있습니다. 투기나 대박보다는 꾸준히 우상향하는 '스노우볼 전략'이 가장 효과적입니다. 한 가지 전문성을 깊이 파고들어 안정적인 현금흐름을 만드는 것이 당신의 부의 공식입니다.`
            }[wealthType];

            const wealthStrategy = sikC > sipTotalWeight * 0.2
                ? `<b>💰 재물 창출 전략 — 식상형:</b> 당신의 재물은 재능과 아이디어에서 나옵니다. 머릿속에 있는 것을 세상 밖으로 꺼낼수록 돈이 됩니다. 유튜브, 강의, 컨설팅, 창작물 등 '내가 만든 것'이 복리로 돈을 버는 구조를 빠르게 구축하십시오.`
                : gwanC > sipTotalWeight * 0.2
                ? `<b>💰 재물 창출 전략 — 관성형:</b> 조직 안에서 인정받고 승진할수록 재물이 커지는 구조입니다. 안정적인 급여 기반 위에 투자 소득을 레이어링하는 '월급쟁이 부자' 전략이 가장 적합합니다.`
                : `<b>💰 재물 창출 전략:</b> 용신 운이 들어오는 대운과 세운에서 재물 확장 기회가 집중됩니다. 해당 시기를 미리 파악하고 준비하는 것이 수십 년의 재산 차이를 만듭니다.`;

            document.getElementById('cat-wealth').innerHTML = `
                <div class="cat-header"><span class="cat-icon">💰</span><span class="cat-title">재물운 자세히 보기</span></div>
                <div class="cat-body">
                    <div class="cat-stat-row">
                        <div class="cat-stat"><span class="cat-stat-label">재성 비중</span><span class="cat-stat-val">${pct(jaeC)}%</span></div>
                        <div class="cat-stat"><span class="cat-stat-label">식상 비중</span><span class="cat-stat-val">${pct(sikC)}%</span></div>
                    </div>
                    <p class="cat-text">${_catV(wealthMain)}</p>
                    <div class="cat-highlight">${_catV(wealthStrategy)}</div>
                    <div class="cat-advice"><b style="color:#ddd;">실행 방향</b><p style="margin:8px 0 0;color:#cfcfcf;line-height:1.8;">재물운은 복잡하게 넓히는 것보다 구조를 단순하게 다듬을 때 안정성이 올라갑니다. 수익 축은 2~3개로 정리하고, 월 1회 고정비와 현금흐름을 점검하면서, 용신 기운과 맞는 협업 채널에 에너지를 집중하십시오. ${dynLine}</p></div>
                </div>`;

            // ── 직업운 상세 ──
            const careerType = gwanC > sipTotalWeight*0.25 ? 'officer'
                : sikC > sipTotalWeight*0.25 ? 'creator'
                : inC > sipTotalWeight*0.25 ? 'expert' : 'independent';
            const careerMain = {
                officer: `관성이 강한 당신은 조직 생활의 생리를 본능적으로 이해합니다. 규칙과 위계, 책임과 권한이 명확한 환경에서 두각을 드러내며, 승진과 사회적 지위를 꾸준히 쌓아올리는 것이 최적 경로입니다. 공직, 대기업, 금융, 법조계에서 탁월한 성과를 냅니다.`,
                creator: `식상이 강한 당신의 무대는 창작과 표현입니다. 남이 설계한 시스템 안에서는 부품처럼 쓰이다 소진됩니다. 당신의 아이디어와 목소리가 곧 돈이 되는 구조 — 프리랜서, 기획자, 크리에이터, 교육자, 강사, 예술가 — 여기서 당신은 폭발적 성취를 이룹니다.`,
                expert: `인성이 강한 당신의 경쟁력은 '지식과 자격증'입니다. 남들이 쉽게 따라올 수 없는 전문성이 당신의 평생 자산입니다. 의사, 변호사, 회계사, 컨설턴트, 연구자, 교수 등 전문직에서 독보적인 권위를 쌓을 수 있습니다.`,
                independent: `당신은 남 밑에 있으면 에너지가 억눌립니다. 비견과 겁재가 강할수록 내 영역을 스스로 개척하는 독립 사업, 영업, 스포츠, 군인/경찰 등 치열한 경쟁 구도에서 진가를 발휘합니다.`
            }[careerType];

            const careerFlowHint = `${flowAnchor} 직업 결정은 내 강점이 잘 살아나는 쪽을 먼저 고르고, 속도를 한 번에 올리기보다 단계별로 가면 실패 확률이 낮아집니다.`;
            document.getElementById('cat-career').innerHTML = `
                <div class="cat-header"><span class="cat-icon">🏆</span><span class="cat-title">직업운 자세히 보기</span></div>
                <div class="cat-body">
                    <div class="cat-stat-row">
                        <div class="cat-stat"><span class="cat-stat-label">조직·책임 비중</span><span class="cat-stat-val">${pct(gwanC)}%</span></div>
                        <div class="cat-stat"><span class="cat-stat-label">산출·표현 비중</span><span class="cat-stat-val">${pct(sikC)}%</span></div>
                        <div class="cat-stat"><span class="cat-stat-label">학습·지지 비중</span><span class="cat-stat-val">${pct(inC)}%</span></div>
                    </div>
                    <p class="cat-text">${_catV(careerMain)}</p>
                    <div class="cat-highlight">
                        <b>🎯 최적 직업 환경:</b> ${({officer:'조직 내 리더십 포지션 (부서장, 팀장, 임원 트랙)', creator:'자기 브랜드 기반의 1인 또는 소수 정예 팀', expert:'전문 자격 기반의 독립 컨설팅 또는 파트너십', independent:'완전한 자율과 성과로 평가받는 독립 영역'})[careerType]}
                    </div>
                    <div class="cat-advice"><b style="color:#ddd;">실행 방향</b><p style="margin:8px 0 0;color:#cfcfcf;line-height:1.8;">직업운은 실력만큼 구조가 중요합니다. 먼저 의사결정 권한 범위를 분명히 하고, 역할과 성과 기준을 문서로 맞춰 두면 불필요한 마찰을 줄일 수 있습니다. ${careerFlowHint} ${dynLine}</p></div>
                </div>`;

            // ── 애정운 상세 ──
            const iljuKey2 = dayStem + (pillars&&pillars[1]?pillars[1].h[1]:'인');
            const _loveData = globalSajuData || { name: name };
            const dbEntry2 = getIljuDbEntry(_loveData, iljuKey2);
            const loveText2 = dbEntry2.love || '일지에 각인된 인연의 코드에 따라 맞는 사람이 다릅니다.';
            const loveType = gwanC > 0 ? 'active' : inC > sipTotalWeight*0.3 ? 'passive' : 'self';
            const loveMainRaw = {
                active: `조직·책임 축이 있는 당신에게 이성 인연은 자연스럽게 찾아오는 편입니다. 사회적 활동이 활발한 시기에 인연이 집중됩니다. 다만 이 축이 강할수록 상대를 통제하려는 욕구가 관계를 경직시킵니다. '내 방식으로 사랑하는 것'과 '상대가 원하는 방식으로 사랑받는 것'의 차이를 이해하는 것이 관계의 핵심 과제입니다.`,
                passive: `학습·지지 축이 강한 당신은 사랑에서 헌신적입니다. 상대를 위해 자신을 희생하는 것을 마다하지 않습니다. 그러나 이 헌신이 때로 집착이나 의존으로 바뀌기 쉽습니다. 자기 자신을 먼저 돌보는 연습을 하십시오. 그것이 역설적으로 가장 건강한 관계를 만드는 길입니다.`,
                self: `당신의 인연은 스스로 만들어가는 스타일입니다. 수동적으로 기다리기보다 적극적으로 만남을 만들어야 합니다. 기운이 맞는 대운과 세운에 인연이 활성화됩니다. 해당 시기에 사회적 활동 반경을 의도적으로 넓히는 것이 전략입니다.`
            };
            const loveMain = voicePolishParagraph(_loveData, loveMainRaw[loveType] || '');

            const loveFlowHint = `${flowAnchor} 애정운은 원국의 일지 성향과 현재 운의 십성 자극이 겹칠 때 사건화가 빨라집니다. 중요한 관계 결정은 흐름이 완화되는 달에 잡는 편이 안정적입니다.`;
            document.getElementById('cat-love').innerHTML = `
                <div class="cat-header"><span class="cat-icon">❤️</span><span class="cat-title">애정운 자세히 보기</span></div>
                <div class="cat-body">
                    <p class="cat-text">${loveMain}</p>
                    <div class="cat-highlight">
                        <b>💑 배우자궁 분석:</b><br>${loveText2}
                    </div>
                    <div class="cat-advice"><b style="color:#ddd;">실행 방향</b><p style="margin:8px 0 0;color:#cfcfcf;line-height:1.8;">애정운은 감정의 강도보다 리듬의 합이 더 오래 갑니다. 중요한 관계 결정은 감정이 가장 높게 치는 날을 피해서 잡고, 대화의 빈도와 시간을 먼저 맞추면 관계의 안정감이 커집니다. ${loveFlowHint} ${dynLine}</p></div>
                </div>`;

            // ── 합격운 상세 ──
            const passPower = Math.min(100, Math.round((inC*1.25 + gwanC*1.15 + sikC*0.9) / Math.max(sipTotalWeight,1) * 100));
            const passType = passPower >= 70 ? '상승' : passPower >= 45 ? '유지' : '보완';
            const passMain = passType==='상승'
                ? '지금은 합격운이 비교적 강하게 붙는 흐름입니다. 공부한 만큼 점수로 연결되기 쉬운 구간이라, 범위를 넓히기보다 출제 빈도가 높은 핵심 단원을 깊게 파는 편이 유리합니다.'
                : passType==='유지'
                ? '지금은 합격운이 중간 구간이라, 한 번에 큰 점프보다 누적이 중요합니다. 매일 같은 시간에 같은 루틴으로 공부 리듬을 고정하면 점수 흔들림을 줄일 수 있습니다.'
                : '지금은 합격운 보완이 필요한 구간입니다. 실력을 새로 만들기보다 틀리는 패턴을 줄이는 데 집중하면 단기간에도 체감 점수를 올릴 수 있습니다.';
            const passFlowHint = `${flowAnchor} 시험운은 **집중·복습 리듬 + 산출·풀이 속도 + 실전 안정감**의 합으로 읽습니다. 중요한 시험일수록 직전 2주 루틴을 고정해 컨디션 변수를 줄이는 편이 좋습니다.`;
            const passAction = passType==='상승'
                ? '실전 모의고사 비중을 높이고, 약점 2개만 정해 집중 보완하십시오.'
                : passType==='유지'
                ? '기출 반복 비중을 높이고, 오답노트는 매일 20분 고정으로 유지하십시오.'
                : '새 교재 추가를 멈추고, 기존 오답 유형 3개만 반복 교정하십시오.';
            document.getElementById('cat-pass').innerHTML = `
                <div class="cat-header"><span class="cat-icon">📘</span><span class="cat-title">합격운 자세히 보기</span></div>
                <div class="cat-body">
                    <div class="cat-stat-row">
                        <div class="cat-stat"><span class="cat-stat-label">합격 체감지수</span><span class="cat-stat-val">${passPower}%</span></div>
                        <div class="cat-stat"><span class="cat-stat-label">현재 단계</span><span class="cat-stat-val" style="font-size:16px;">${passType}</span></div>
                    </div>
                    <p class="cat-text">${passMain}</p>
                    <div class="cat-highlight"><b>🧭 이번 구간 전략:</b><br>${passAction}</div>
                    <div class="cat-advice"><b style="color:#ddd;">실행 방향</b><p style="margin:8px 0 0;color:#cfcfcf;line-height:1.8;">${passFlowHint}</p></div>
                </div>`;

        })();

        window.showCat = function(cat) {
            ['health','wealth','career','love','pass'].forEach(c=>{
                const el = document.getElementById('cat-'+c);
                if(el) el.style.display = c===cat?'block':'none';
            });
            document.querySelectorAll('.cat-tab').forEach((t,i)=>{
                t.classList.toggle('active',['health','wealth','career','love','pass'][i]===cat);
            });
        };


        // 현재 대운 요약 문장
        const daeunSummaryEl = document.getElementById('daeun-summary');
        if(daeunSummaryEl && activeDaeunIdx >= 0) {
            const curDW = daeunData[activeDaeunIdx];
            const curGz = curDW.getGanZhi();
            const curSip = getSipseong(dayStem, curGz[0]);
            const curKr = `${HAN_KOR[curGz[0]]}${HAN_KOR[curGz[1]]}`;
            const dwEndAge = activeDaeunIdx < daeunData.length-1 ? (daeunData[activeDaeunIdx+1].getStartAge()-1) : (curDW.getStartAge()-1)+10;
            daeunSummaryEl.innerHTML = getAgeBasisNoteHtml('block').replace('margin:0 0 12px','margin:0 0 8px') + `현재 <b>${curDW.getStartAge()-1}세 ~ ${dwEndAge}세</b> (만 나이)  · <b style="color:var(--gold);">${curGz[0]}${curGz[1]}(${curKr})</b> 대운 진행 중 &nbsp;·&nbsp; 십성 <b>${curSip || '-'}</b> 축이 10년을 이끕니다.`;
        } else if(daeunSummaryEl) {
            daeunSummaryEl.innerHTML = '만 나이 기준으로 현재 대운 구간을 확인하십시오. 진행 중인 대운이 굵게 표시됩니다.';
        }

        const seunRows = [];
        for (let year = currentYear; year < currentYear + 10; year++) {
            const yLunar = Solar.fromYmd(year, 6, 15).getLunar();
            const yEc = yLunar.getEightChar();
            const gz = yEc.getYear();
            const _ySip = getSipseong(dayStem, gz[0]);
            seunRows.push([
                year + '년',
                sipToManseBadge(_ySip, false),
                `${gz[0]}${gz[1]}`,
                `${HAN_KOR[gz[0]]}${HAN_KOR[gz[1]]}`,
                getUnsung(dayStem, gz[1]) || '-'
            ]);
        }
        buildFortuneCards('seun-table', seunRows, 0);
        // ===== 세운 표 아래 풀이 주입 =====
        (function(){
            var OH={'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            var JO={'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
            var KN={wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};var GK={'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계'},JK={'子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
            var natalP=(globalSajuData&&globalSajuData.pillars)||[];
            var natalS=natalP.map(function(p){return p&&p.h&&p.h[0];}).filter(Boolean);
            var natalB=natalP.map(function(p){return p&&p.h&&p.h[1];}).filter(Boolean);
            var STEM_PAIR={'甲':'己','己':'甲','乙':'庚','庚':'乙','丙':'辛','辛':'丙','丁':'壬','壬':'丁','戊':'癸','癸':'戊'};
            var BRANCH_PAIR={'子':'丑','丑':'子','寅':'亥','亥':'寅','卯':'戌','戌':'卯','辰':'酉','酉':'辰','巳':'申','申':'巳','午':'未','未':'午'};
            var BRANCH_CLASH={'子':'午','午':'子','丑':'未','未':'丑','寅':'申','申':'寅','卯':'酉','酉':'卯','辰':'戌','戌':'辰','巳':'亥','亥':'巳'};
            var sc={wood:0,fire:0,earth:0,metal:0,water:0}; if(yong) sc[yong]+=2; if(hee) sc[hee]+=1; if(gi) sc[gi]-=2; if(goo) sc[goo]-=1;
            function gs(g,j){return (sc[OH[g]]||0)+(sc[JO[j]]||0);}
            function gc(s){return s>=3?'#c7a76a':s>=1?'#00C853':s===0?'#888':s>=-2?'#ff9800':'#e74c3c';}
            function gb(s){return s>=3?'🌟 대길':s>=1?'✦ 길':s===0?'— 평':s>=-2?'⚠ 주의':'❌ 흉';}
            var curY=new Date().getFullYear();
            var wrap=document.getElementById('seun-table');
            if(!wrap) return;
            var detDiv=document.createElement('div');
            detDiv.style.cssText='margin-top:12px;display:flex;flex-direction:column;gap:10px;';
            for(var yr=curY;yr<curY+10;yr++){
                var yL=Solar.fromYmd(yr,6,15).getLunar();
                var gz=yL.getEightChar().getYear();var g=gz[0];var j=gz[1];
                var s=gs(g,j);var col=gc(s);var isThis=(yr===curY);
                var ySip = (typeof getSipseong==='function'&&g)?(getSipseong(dayStem,g)||'비견'):'비견';
                var yUns = (typeof getUnsung==='function'&&j)?(getUnsung(dayStem,j)||'-'):'-';
                var adv = renderFortuneText({ sip:ySip, uns:yUns, score:s, idx:(yr-curY), scope:'year' });
                var d=document.createElement('div');
                d.style.cssText='padding:12px;background:rgba(255,255,255,'+(isThis?'0.07':'0.03')+');border:1px solid '+(isThis?'var(--gold)':'rgba(255,255,255,0.07)')+';border-radius:10px;';
                d.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">'+
                    '<div style="display:flex;align-items:center;gap:7px;"><span style="font-size:18px;font-weight:900;color:var(--gold);font-family:\'Noto Sans KR\',sans-serif;"><span class="sajux-hanja">'+g+j+'</span></span><span style="font-size:13px;font-weight:600;color:#ccc;">('+((HAN_KOR&&HAN_KOR[g])||g)+((HAN_KOR&&HAN_KOR[j])||j)+')</span>'+
                    '<span style="font-size:13px;color:#bbb;">'+yr+'년'+(isThis?' <span style="font-size:10px;background:rgba(199,167,106,0.10);color:var(--gold);border:1px solid rgba(199,167,106,0.40);padding:1px 6px;border-radius:6px;font-weight:600;letter-spacing:0.3px;">올해</span>':'')+'</span></div>'+
                    '<span style="font-size:11px;font-weight:700;color:'+col+';">'+gb(s)+'</span></div>'+
                    '<div style="background:rgba(199,167,106,0.05);border-radius:6px;padding:8px 10px;border-left:2px solid '+col+';"><p style="font-size:12px;color:#ccc;line-height:1.75;margin:0;">'+polishHanjaInText(adv)+'</p></div>';
                detDiv.appendChild(d);
            }
            wrap.appendChild(detDiv);
        })();

        // 올해 세운 요약 문장
        const seunSummaryEl = document.getElementById('seun-summary');
        if(seunSummaryEl && seunRows.length > 0) {
            const thisYear = seunRows[0];
            seunSummaryEl.innerHTML = `올해 ${currentYear}년 세운 : <b style="color:var(--gold);">${thisYear[2]}(${thisYear[3]})</b> &nbsp;·&nbsp; 십성 <b>${thisYear[1]}</b> · 흐름 리듬 <b>${thisYear[4]}</b>이 한 해를 이끕니다.`;
        }

        // 월운: 현재 달부터 12개월
        const wolunRows = [];
        let wolunCurrentIdx = 0;
        for (let i = 0; i < 12; i++) {
            const wYear = currentMonth + i > 12 ? currentYear + 1 : currentYear;
            const wMonth = ((currentMonth - 1 + i) % 12) + 1;
            if(i === 0) wolunCurrentIdx = 0; // 첫 번째가 현재 달
            const mSolar = Solar.fromYmd(wYear, wMonth, 15);
            const mEc = mSolar.getLunar().getEightChar();
            const gz = mEc.getMonth();
            const _mSipW = getSipseong(dayStem, gz[0]);
            wolunRows.push([
                wYear + '.' + wMonth + '월',
                sipToManseBadge(_mSipW, false),
                `${gz[0]}${gz[1]}`,
                `${HAN_KOR[gz[0]]}${HAN_KOR[gz[1]]}`,
                getUnsung(dayStem, gz[1]) || '-'
            ]);
        }
        buildFortuneCards('wolun-table', wolunRows, wolunCurrentIdx);
        // ===== 월운 표 아래 풀이 주입 =====
        (function(){
            var OH={'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            var JO={'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
            var KN={wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};var GK={'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계'},JK={'子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
            var sc={wood:0,fire:0,earth:0,metal:0,water:0}; if(yong) sc[yong]+=2; if(hee) sc[hee]+=1; if(gi) sc[gi]-=2; if(goo) sc[goo]-=1;
            function gs(g,j){return (sc[OH[g]]||0)+(sc[JO[j]]||0);}
            function gc(s){return s>=3?'#c7a76a':s>=1?'#00C853':s===0?'#888':s>=-2?'#ff9800':'#e74c3c';}
            function gb(s){return s>=3?'🌟 대길':s>=1?'✦ 길':s===0?'— 평':s>=-2?'⚠ 주의':'❌ 흉';}
            var curY=currentYear;var curM=currentMonth;
            var wrap=document.getElementById('wolun-table');
            if(!wrap) return;
            var detDiv=document.createElement('div');
            detDiv.style.cssText='margin-top:12px;display:flex;flex-direction:column;gap:8px;';
            for(var i=0;i<12;i++){
                var wY=((curM-1+i)>=12)?curY+1:curY;
                var m=((curM-1+i)%12)+1;
                var mS=Solar.fromYmd(wY,m,15);
                var gz=mS.getLunar().getEightChar().getMonth();var g=gz[0];var j=gz[1];
                var s=gs(g,j);var col=gc(s);var isThis=(i===0);
                var mSip = (typeof getSipseong==='function'&&g)?(getSipseong(dayStem,g)||'비견'):'비견';
                var mUns = (typeof getUnsung==='function'&&j)?(getUnsung(dayStem,j)||'-'):'-';
                var advm = renderFortuneText({ sip:mSip, uns:mUns, score:s, idx:i, scope:'month' });
                var d=document.createElement('div');
                d.style.cssText='padding:11px;background:rgba(255,255,255,'+(isThis?'0.07':'0.02')+');border:1px solid '+(isThis?'var(--gold)':'rgba(255,255,255,0.06)')+';border-radius:8px;';
                d.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;">'+
                    '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;"><span style="font-size:15px;font-weight:800;color:var(--gold);font-family:\'Noto Sans KR\',sans-serif;">'+(typeof formatMonthWithGanzhiHtml==='function'?formatMonthWithGanzhiHtml(m,g,j):formatMonthWithGanzhi(m,g,j))+'</span>'+
                    '<span style="font-size:12px;color:#bbb;">'+wY+'.'+m+'월'+(isThis?' <span style="font-size:10px;background:rgba(199,167,106,0.10);color:var(--gold);border:1px solid rgba(199,167,106,0.40);padding:1px 5px;border-radius:5px;font-weight:600;letter-spacing:0.3px;">이달</span>':'')+'</span></div>'+
                    '<span style="font-size:11px;font-weight:700;color:'+col+';">'+gb(s)+'</span></div>'+
                    '<div style="background:rgba(199,167,106,0.04);border-radius:5px;padding:7px 9px;border-left:2px solid '+col+';"><p style="font-size:11.5px;color:#bbb;line-height:1.7;margin:0;">'+polishHanjaInText(advm)+'</p></div>';
                detDiv.appendChild(d);
            }
            wrap.appendChild(detDiv);
        })();

        // 대운 데이터 수집
        const daeunForReport = filterDaeunRowsByClientAge(daeunData.map(dy => {
            const gz = dy.getGanZhi();
            return { age: dy.getStartAge()-1, name: gz[0]+gz[1], gz: [gz[0], gz[1]] };
        }), getClientAgeYearsAtReport({
            reportBaseAt: reportBaseAt,
            coverSolarY: displaySolarY,
            coverSolarM: displaySolarM,
            coverSolarD: displaySolarD
        }));
        // 각 주별 십성 계산 (일간 기준, getSipseong과 동일 규칙)
        const pillars_sipseong = (pillars||[]).map((p,pi) => {
            if(!p || !p.h) return '';
            const st = p.h[0];
            if (!st) return '';
            // pillars 순서: 0시·1일·2월·3년 — 일주(일간)는 자기 자신
            if (pi === 1) return '(일주)';
            return getSipseong(dayStem, st) || '';
        });
        // 공망 계산 (이전 globalSajuData에서 가져오거나 빈 배열)
        globalSajuData = {
            name: name,
            reportBaseAt: reportBaseAt,
            reportIssuedAt: reportIssuedAt,
            dayStem: dayStem,
            dayBranch: pillars[1].h[1],
            monthBranch: pillars[2].h[1],
            // 자미두수 + Part1 용 추가 필드
            yearBranch: pillars[3].h[1],   // 년지 (명궁/부모궁)
            timeBranch: pillars[0].h && pillars[0].h[1] || '', // 시지 (자녀궁)
            yearStem: pillars[3].h && pillars[3].h[0] || '',   // 년간
            monOh: (function(){
                var GA={'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
                return GA[pillars[2].h && pillars[2].h[0]] || 'earth';
            })(),
            pillars: pillars,
            pillars_sipseong: pillars_sipseong,
            strengthText: strength,
            allShinsal: allShinsal,
            wuxing: counts,
            sipseong: sipCounts,
            sipTotalWeight: sipTotalWeight,
            yong: yong, hee: hee, gi: gi, goo: goo,
            daeunRows: daeunForReport,
            activeDaeunIdx: activeDaeunIdx,
            // buildChapter8_NextDaewun용 daewunList
            daewunList: (daeunForReport||[]).map(function(r){
                var _GA={'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
                return {name: r.name||'', age: r.age||0, oh: _GA[r.gz&&r.gz[0]]||'earth'};
            }),
            birthDate: displaySolarY+'-'+String(displaySolarM).padStart(2,'0')+'-'+String(displaySolarD).padStart(2,'0'),
            interactions: buildRelationLines(pillars).filter(r => r.type !== '없음'),
            birthYear: displaySolarY,
            johu: (window.JOHU_DB && window.JOHU_DB[dayStem] && window.JOHU_DB[dayStem][pillars[2].h[1]]) || '',
            geokguk: (typeof window.getGeokGuk === 'function') ? window.getGeokGuk(pillars, dayStem, ec) : null,
            gongmang: (function(){
                const gmStr = getGongmang(dayStem + ec.getDay()[1]);
                if(!gmStr) return [];
                const KR2HJ = {'자':'子','축':'丑','인':'寅','묘':'卯','진':'辰','사':'巳','오':'午','미':'未','신':'申','유':'酉','술':'戌','해':'亥'};
                return [...gmStr].map(c => KR2HJ[c] || c);
            })(),
            allTwelveShinsal: allTwelveShinsal,
            allExtraShinsal: allExtraShinsal,
            birthTimeKnown: !isUnknown,
            coverSolarY: displaySolarY,
            coverSolarM: displaySolarM,
            coverSolarD: displaySolarD,
            /* 표지/리포트 문구용 시각 = 입력(보정 전). ec·pillars 는 아래 solar(보정 후) 기준 */
            coverSolarHH: !isUnknown ? coverUiHH : null,
            coverSolarMM: !isUnknown ? coverUiMM : null,
            coverLunarY: displayLunarY,
            coverLunarM: displayLunarM,
            coverLunarD: displayLunarD,
            coverLunarLeap: !!displayLunarLeap
        };
        globalSajuData.birthStr = formatCoverBirthLine(globalSajuData);

        // ─── 레거시 추가 주입(비활성) ───
        var USE_LEGACY_APPEND = false;
        if(USE_LEGACY_APPEND){
        (function(){
            var OH={'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            var JO={'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
            var GAN_T={'甲':'갑목의 기운이 지배하는 이 시기는 새로운 시작과 도전의 계절입니다. 봄에 처음 땅을 뚫고 나오는 새싹처럼 강인하고 직진하는 에너지가 넘칩니다. 두려움 없이 앞으로 나아가는 것이 핵심 전략입니다. 새로운 사업, 이직, 이사, 학업 시작 등 도전적 행보가 이 에너지와 정확히 공명합니다.','乙':'을목은 덩굴처럼 유연하게 뻗어나가는 기운입니다. 인간관계와 네트워크가 이 시기 최고의 자산입니다. 직접 밀어붙이기보다 옆으로 돌아가는 유연한 전략이 큰 성과를 냅니다.','丙':'병화는 태양처럼 모든 것을 밝게 드러내는 기운입니다. 숨겨왔던 재능과 성과가 세상에 드러나는 시기입니다. 강의, 출판, 브랜딩, 발표 등 자신을 드러내는 모든 활동이 극대화됩니다.','丁':'정화는 촛불처럼 집중적이고 섬세한 기운입니다. 한 분야를 깊이 파고드는 전문성의 시기입니다. 장인정신, 전문직, 깊이 파고드는 연구가 이 기운과 가장 잘 맞습니다.','戊':'무토는 거대한 산처럼 묵직하고 안정적인 기운입니다. 부동산, 자산 축적, 사업 기반 확장 등 10년 후를 내다보는 투자가 이 에너지를 극대화합니다.','己':'기토는 비옥한 농토처럼 실용적이고 섬세한 기운입니다. 이전에 뿌린 씨앗들이 실질적인 결과물로 돌아오는 시기입니다. 꼼꼼한 관리와 내실 있는 운영이 빛을 발합니다.','庚':'경금은 날카로운 도끼처럼 불필요한 것을 과감히 쳐내는 기운입니다. 혁신과 개혁의 에너지가 강합니다. 과감한 결단과 구조 개혁이 필요하며 망설임이 가장 큰 적입니다.','辛':'신금은 보석을 세공하듯 정밀하게 완성도를 높이는 기운입니다. 디테일에 집중하고 품질을 극대화할 때 최고의 결과물이 나옵니다.','壬':'임수는 큰 강처럼 에너지가 넓게 확산되는 기운입니다. 인맥이 폭발적으로 확장되고 새로운 기회가 사방에서 찾아오는 시기입니다.','癸':'계수는 깊은 지하수처럼 보이지 않는 곳에서 힘을 키우는 기운입니다. 이 시기를 분석·연구·학습으로 채운 사람과 허비한 사람의 차이는 다음 대운에서 극명하게 드러납니다.'};
            var JI_T={'子':'자 지지는 지혜와 집중력의 기운입니다. 분석력이 극대화되는 시기로 계획 수립, 자격증 취득, 학업에 유리합니다.','丑':'축 지지는 인내와 저력의 기운입니다. 눈에 보이는 성과보다 내공이 쌓이는 시기입니다. 이 기간을 묵묵히 견디며 쌓은 실력이 이후 운에서 폭발적 결과로 이어집니다.','寅':'인 지지는 강렬한 활동과 변화의 기운입니다. 이동, 변화, 새로운 출발의 에너지가 강하게 발동합니다. 이 시기에 시작한 일이 오래도록 지속됩니다.','卯':'묘 지지는 성장과 관계의 기운입니다. 인맥이 넓어지고 협력 기회가 풍부해집니다. 혼자보다 함께할 때 성과가 배가됩니다.','辰':'진 지지는 잠재력이 폭발하는 변화의 기운입니다. 예상치 못한 변수가 많지만 유연하게 대응하면 인생의 전환점이 됩니다.','巳':'사 지지는 내면의 결단력이 요구됩니다. 오래 고민해온 문제의 답이 이 시기에 명확해집니다. 과감한 선택이 이후 10년의 방향을 결정합니다.','午':'오 지지는 성취와 인정의 기운입니다. 쌓아온 노력이 사회적으로 드러나고 인정받습니다. 이 기세를 타고 더 큰 목표로 나아가야 합니다.','未':'미 지지는 풍요로운 감성과 창작의 기운입니다. 인간적인 관계가 깊어지고 예술·교육 활동에서 빛을 발합니다.','申':'신 지지는 판단력과 실행력의 기운입니다. 기회가 빠르게 스쳐 지나가므로 체크리스트를 짧게 정한 뒤 검증된 범위에서 신속히 실행에 옮기십시오.','酉':'유 지지는 완성과 보상의 기운입니다. 쌓아온 전문성이 인정받고 노력에 대한 정당한 대가가 돌아옵니다.','戌':'술 지지는 통찰과 마무리의 기운입니다. 불필요한 것을 정리하고 핵심 가치에 집중하게 됩니다.','亥':'해 지지는 잠복과 준비의 기운입니다. 표면적으로는 정체처럼 보이지만 내면에서 엄청난 에너지가 축적됩니다.'};
            var sc={wood:0,fire:0,earth:0,metal:0,water:0}; if(yong) sc[yong]+=2; if(hee) sc[hee]+=1; if(gi) sc[gi]-=2; if(goo) sc[goo]-=1;
            function gs(g,j){return (sc[OH[g]]||0)+(sc[JO[j]]||0);}
            function gc(s){return s>=3?'#c7a76a':s>=1?'#00C853':s===0?'#888':s>=-2?'#ff9800':'#e74c3c';}
            function gb(s){return s>=3?'🌟 대길':s>=1?'✦ 길':s===0?'— 평':s>=-2?'⚠ 주의':'❌ 흉';}
            var h2=`<div class="report-chapter"><h3 class="ch-title">대운 80년 — 10년 단위 완전 해부</h3><p class="ch-text">${nmUi(name)} 대운 흐름 — 각 10년 구간별 기회와 조심 시기를 아래에서 확인하십시오.</p>`;
            daeunData.forEach(function(dy,idx){
                var gz=dy.getGanZhi();var g=gz[0];var j=gz[1];
                var age=dy.getStartAge()-1;
                var endAge=idx<daeunData.length-1?(daeunData[idx+1].getStartAge()-1):age+10;
                var _birthY=(globalSajuData&&globalSajuData.birthYear)||1988;
                var _startYr=_birthY+age-1;var _endYr=_birthY+endAge-2;
                var s=gs(g,j);var isCur=idx===activeDaeunIdx;var col=gc(s);
                var OHK={wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};
                var ganSipD=(typeof getSipseong==='function'&&dayStem)?(getSipseong(dayStem,g)||''):'';
                var jiSipD=(typeof getSipseong==='function'&&dayStem)?(getSipseong(dayStem,j)||''):'';
                var gEl=OH[g]||'earth', jEl=JO[j]||'earth';
                var phaseLead=(s>=2?'상승':'sustain');
                if(s<0) phaseLead='defense';
                var wealthLine=phaseLead==='상승'
                    ?'재물은 수입원을 넓히는 시도에서 성과가 붙기 쉬워, 기존 수익 구조 위에 보조 수익축을 하나 더 얹는 전략이 유리합니다.'
                    :phaseLead==='sustain'
                    ?'재물은 공격적 확장보다 현금흐름의 누수를 줄이는 운영이 더 효과적이며, 고정비 점검 주기를 짧게 가져갈수록 안정성이 올라갑니다.'
                    :'재물은 방어가 우선입니다. 신규 투자보다 보유 자산의 변동성을 낮추고, 지출을 줄여 안전 여력을 확보하는 편이 손실 가능성을 낮춥니다.';
                var careerLine=phaseLead==='상승'
                    ?'직업은 역할 확장 제안이나 직무 전환 시도에 응답이 오기 쉬운 구간입니다.'
                    :phaseLead==='sustain'
                    ?'직업은 자리 이동보다 현재 역할의 완성도를 높일 때 평판 자산이 쌓입니다.'
                    :'직업은 방향 전환보다 리스크 관리가 먼저이며, 큰 결정은 검토 시간을 길게 두는 편이 안전합니다.';
                var relationLine=phaseLead==='상승'
                    ?'관계는 새로운 연결이 열리기 쉬워 협업·인연 모두 문이 넓어지는 흐름입니다.'
                    :phaseLead==='sustain'
                    ?'관계는 폭보다 깊이가 중요한 시기로, 오래 갈 사람을 선별해 밀도를 높일수록 좋습니다.'
                    :'관계는 감정 반응이 커질 수 있어 속도를 늦추고 대화 간격을 조절하는 편이 안정적입니다.';
                var strat=(age+'세~'+(endAge-1)+'세 구간은 '+g+j+' 기운이 중심이 됩니다. 앞기운은 '+g+'('+OHK[gEl]+'), 뒷기운은 '+j+'('+OHK[jEl]+')로 작동해, 같은 기회라도 체감 방식이 달라집니다. ')
                    +(phaseLead==='상승'
                        ?'원국에서 약했던 축을 보완해 주는 편이라 실행력이 붙기 쉬운 대운입니다. 다만 속도를 한 번에 올리기보다 우선순위를 좁혀 정확도를 높일수록 결과가 오래 갑니다. '
                        :phaseLead==='sustain'
                        ?'급등보다 누적에 강한 흐름이라 준비된 것을 정교하게 다듬을수록 다음 구간에서 탄력이 커집니다. 서두르기보다 리듬을 일정하게 유지하는 편이 유리합니다. '
                        :'부담 신호가 먼저 보이기 쉬운 대운이라 확장보다 방어 설계가 중요합니다. 무리하게 판을 키우기보다 손실 가능성을 줄이는 선택이 다음 반등의 발판이 됩니다. ')
                    +wealthLine+' '+careerLine+' '+relationLine;

                h2+='<div style="margin-bottom:18px;padding:18px;background:rgba(255,255,255,'+(isCur?'0.07':'0.03')+');border:1px solid '+(isCur?'var(--gold)':'rgba(255,255,255,0.07)')+';border-radius:12px;">';
                h2+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;"><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:26px;font-weight:900;color:var(--gold);font-family:Noto Sans KR,serif;">'+g+j+'</span><div><div style="font-size:13px;color:#bbb;">'+age+'세 ~ '+(endAge-1)+'세</div>'+(isCur?'<span style="font-size:10px;background:rgba(199,167,106,0.10);color:var(--gold);border:1px solid rgba(199,167,106,0.40);padding:1px 8px;border-radius:8px;font-weight:600;letter-spacing:0.3px;">▶ 현재</span>':'')+'</div></div><span style="font-size:13px;font-weight:700;color:'+col+';padding:4px 12px;border-radius:20px;background:rgba(255,255,255,0.05);">'+gb(s)+'</span></div>';
                var _ageD = age||0;
                var dnarr=(window.PERIOD_NARRATIVE&&window.PERIOD_NARRATIVE[g+j])
                    ||(_ageD+'세~'+(_ageD+9)+'세 — '+(GAN_T[g]||g+' 기운의 10년입니다.')+' '+(JI_T[j]||''));
                h2+='<div style="background:rgba(0,0,0,0.15);border-radius:8px;padding:12px;margin-bottom:12px;"><p style="font-size:12.5px;color:#ddd;line-height:1.8;margin:0;">'+dnarr+'</p></div>';
                h2+='<div style="background:rgba(199,167,106,0.06);border-radius:8px;padding:12px;border-left:2px solid '+col+';"><div style="font-size:10px;color:var(--text-dim);margin-bottom:5px;">이 대운의 전략</div><p style="font-size:13px;color:#ccc;line-height:1.8;margin:0;">'+strat+'</p></div></div>';
            });
            h2+='</div>';
            var rc=document.getElementById('report-container');
            if(rc) rc.insertAdjacentHTML('beforeend',h2);
        })();

        // ─── 세운 10년 상세 풀이 ───
        (function(){
            var OH={'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            var JO={'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
            var KN={wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};var GK={'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계'},JK={'子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
            var natalP=(globalSajuData&&globalSajuData.pillars)||[];
            var natalS=natalP.map(function(p){return p&&p.h&&p.h[0];}).filter(Boolean);
            var natalB=natalP.map(function(p){return p&&p.h&&p.h[1];}).filter(Boolean);
            var STEM_PAIR={'甲':'己','己':'甲','乙':'庚','庚':'乙','丙':'辛','辛':'丙','丁':'壬','壬':'丁','戊':'癸','癸':'戊'};
            var BRANCH_PAIR={'子':'丑','丑':'子','寅':'亥','亥':'寅','卯':'戌','戌':'卯','辰':'酉','酉':'辰','巳':'申','申':'巳','午':'未','未':'午'};
            var BRANCH_CLASH={'子':'午','午':'子','丑':'未','未':'丑','寅':'申','申':'寅','卯':'酉','酉':'卯','辰':'戌','戌':'辰','巳':'亥','亥':'巳'};
            var sc={wood:0,fire:0,earth:0,metal:0,water:0}; if(yong) sc[yong]+=2; if(hee) sc[hee]+=1; if(gi) sc[gi]-=2; if(goo) sc[goo]-=1;
            function gs(g,j){return (sc[OH[g]]||0)+(sc[JO[j]]||0);}
            function gc(s){return s>=3?'#c7a76a':s>=1?'#00C853':s===0?'#888':s>=-2?'#ff9800':'#e74c3c';}
            function gb(s){return s>=3?'🌟 대길':s>=1?'✦ 길':s===0?'— 평':s>=-2?'⚠ 주의':'❌ 흉';}
            var curY2=getReportBaseDate(globalSajuData||{}).getFullYear();
            var h3='<div class="report-chapter"><h3 class="ch-title">세운 10년 — 연도별 완전 분석</h3><p class="ch-text">세운은 그해의 날씨입니다. 용신 기운이 강한 해에 중요한 행동을 집중하고, 기신 기운의 해에는 수비 전략을 택하십시오.</p>';
            for(var yr=curY2;yr<curY2+10;yr++){
                var yL2=Solar.fromYmd(yr,6,15).getLunar();
                var yE2=yL2.getEightChar();
                var gz2=yE2.getYear();var g2=gz2[0];var j2=gz2[1];
                var s2=gs(g2,j2);var col2=gc(s2);var isThis=(yr===curY2);
                var gOh=OH[g2]||'earth';var jOh=JO[j2]||'earth';
                var ganSip2=(typeof getSipseong==='function'&&dayStem)?(getSipseong(dayStem,g2)||''):'';
                var jiSip2=(typeof getSipseong==='function'&&dayStem)?(getSipseong(dayStem,j2)||''):'';
                var gTag=(GK[g2]||g2);
                var jTag=(JK[j2]||j2);
                var reacts=[];
                if(natalS.indexOf(g2)>=0) reacts.push(gTag+getJosa(gTag,'이/가')+' 원국에 겹쳐 같은 성향이 더 강해집니다.');
                if(natalB.indexOf(j2)>=0) reacts.push(jTag+getJosa(jTag,'이/가')+' 원국에 겹쳐 같은 이슈가 크게 드러날 수 있습니다.');
                var sPair=STEM_PAIR[g2], bPair=BRANCH_PAIR[j2], bClash=BRANCH_CLASH[j2];
                if(sPair&&natalS.indexOf(sPair)>=0){var _sk=GK[sPair]||sPair; reacts.push(gTag+getJosa(gTag,'은/는')+' 원국의 '+_sk+getJosa(_sk,'과/와')+' 잘 붙어 사람·기회 연결이 좋아집니다.');}
                if(bPair&&natalB.indexOf(bPair)>=0){var _bk=JK[bPair]||bPair; reacts.push(jTag+getJosa(jTag,'은/는')+' 원국의 '+_bk+getJosa(_bk,'과/와')+' 잘 맞아 협업 흐름이 부드럽습니다.');}
                if(bClash&&natalB.indexOf(bClash)>=0){var _ck=JK[bClash]||bClash; reacts.push(jTag+getJosa(jTag,'은/는')+' 원국의 '+_ck+getJosa(_ck,'과/와')+' 부딪혀 변경·충돌 이슈를 먼저 관리해야 합니다.');}
                var reactTxt=reacts.length?reacts.slice(0,2).join(' '):'원국과 큰 충돌이 적어 계획대로 밀어붙일수록 안정적으로 쌓입니다.';
                var ykSe=(typeof formatYearWithGanzhi==='function')?formatYearWithGanzhi(yr,g2,j2):(String(yr)+'년');
                var ykwSe=yearlyFourDomainKeywords(s2,ganSip2);
                var ykwSeInd=yearlyFourDomainIndicators(s2,ganSip2);
                var seStrip=typeof buildYearlyIndicatorsHtml==='function'?buildYearlyIndicatorsHtml(ykwSeInd):'';
                var adv=s2>=2
                    ?(ykSe+'의 흐름은 '+gTag+jTag+' 기운이 당신 원국과 잘 맞아, 새 시도·협업·확장이 성과로 이어질 가능성이 높습니다. '+reactTxt+' 다만 한 번에 많이 벌이기보다 우선순위를 먼저 정하면 결과가 더 좋아집니다.')
                    :s2>=0
                    ?(ykSe+'의 흐름은 '+gTag+jTag+' 기운이 급한 변화보다 안정 운영에 힘을 싣는 편에 가깝습니다. '+reactTxt+' 큰 승부보다 기존 구조를 다듬고 새는 부분을 줄이는 쪽이 유리합니다.')
                    :(ykSe+'의 흐름은 '+gTag+jTag+' 기운이 부담 구간을 건드릴 수 있습니다. '+reactTxt+' 공격적으로 키우기보다 현금흐름 방어와 계약 재검토를 먼저 하면 손실 가능성을 낮출 수 있습니다.');
                h3+='<div style="margin-bottom:14px;padding:16px;background:rgba(255,255,255,'+(isThis?'0.07':'0.03')+');border:1px solid '+(isThis?'var(--gold)':'rgba(255,255,255,0.07)')+';border-radius:12px;">';
                h3+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;"><div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;"><span style="font-size:20px;font-weight:700;color:var(--gold);font-family:\'Noto Sans KR\',sans-serif;white-space:nowrap;letter-spacing:0.02em;"><span class="sajux-hanja">'+g2+j2+'</span></span><span style="font-size:14px;color:#bbb;white-space:nowrap;">'+yr+'년'+(isThis?' <span style="font-size:10px;background:rgba(199,167,106,0.10);color:var(--gold);border:1px solid rgba(199,167,106,0.40);padding:1px 7px;border-radius:8px;font-weight:600;letter-spacing:0.3px;">올해</span>':'')+'</span></div><span style="font-size:12px;font-weight:700;color:'+col2+';white-space:nowrap;">'+gb(s2)+'</span></div>';
                h3+=seStrip;
                var ynarr=ykSe+'의 흐름은 '+(GK[g2]||g2)+'('+KN[gOh]+') 천간과 '+(JK[j2]||j2)+'('+KN[jOh]+') 지지가 겹쳐 나타납니다. '+(s2>=2?'원국과의 합이 맞아 드는 편이라 실행한 일이 결과로 이어질 가능성이 큽니다. 상반기에 거점을 고정하고 하반기에 확장을 붙이면 리스크가 줄어듭니다.':s2>=0?'급하게 키우기보다 기존 구조를 다듬고 현금흐름을 먼저 안정시키는 편이 유리합니다. 분기마다 우선순위를 세 개 이내로 압축하십시오.':'부담 구간을 건드릴 수 있으니 결정 속도를 늦추고 안전장치를 먼저 챙기십시오. 보증·레버리지·감정적 확장은 가급적 피하는 것이 좋습니다.')+' '+reactTxt;
                h3+='<div style="background:rgba(0,0,0,0.15);border-radius:6px;padding:10px;margin-bottom:10px;"><p style="font-size:12px;color:#ddd;line-height:1.75;margin:0;">'+ynarr+'</p></div>';
                h3+='<div style="background:rgba(199,167,106,0.06);border-radius:6px;padding:10px;border-left:2px solid '+col2+';"><div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;">이 해의 전략</div><p style="font-size:12.5px;color:#ccc;line-height:1.8;margin:0;">'+adv+'</p></div></div>';
            }
            h3+='</div>';
            var rc2=document.getElementById('report-container');
            if(rc2) rc2.insertAdjacentHTML('beforeend',h3);
        })();

        // ─── 월운 12개월 상세 풀이 ───
        (function(){
            var OH={'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
            var JO={'子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
            var KN={wood:'목',fire:'화',earth:'토',metal:'금',water:'수'};var GK={'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계'},JK={'子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
            var natalP=(globalSajuData&&globalSajuData.pillars)||[];
            var natalS=natalP.map(function(p){return p&&p.h&&p.h[0];}).filter(Boolean);
            var natalB=natalP.map(function(p){return p&&p.h&&p.h[1];}).filter(Boolean);
            var STEM_PAIR={'甲':'己','己':'甲','乙':'庚','庚':'乙','丙':'辛','辛':'丙','丁':'壬','壬':'丁','戊':'癸','癸':'戊'};
            var BRANCH_PAIR={'子':'丑','丑':'子','寅':'亥','亥':'寅','卯':'戌','戌':'卯','辰':'酉','酉':'辰','巳':'申','申':'巳','午':'未','未':'午'};
            var BRANCH_CLASH={'子':'午','午':'子','丑':'未','未':'丑','寅':'申','申':'寅','卯':'酉','酉':'卯','辰':'戌','戌':'辰','巳':'亥','亥':'巳'};
            var sc={wood:0,fire:0,earth:0,metal:0,water:0}; if(yong) sc[yong]+=2; if(hee) sc[hee]+=1; if(gi) sc[gi]-=2; if(goo) sc[goo]-=1;
            function gs(g,j){return (sc[OH[g]]||0)+(sc[JO[j]]||0);}
            function gc(s){return s>=3?'#c7a76a':s>=1?'#00C853':s===0?'#888':s>=-2?'#ff9800':'#e74c3c';}
            function gb(s){return s>=3?'🌟 대길':s>=1?'✦ 길':s===0?'— 평':s>=-2?'⚠ 주의':'❌ 흉';}
            var curY3=new Date().getFullYear();var curM3=new Date().getMonth()+1;
            var h4='<div class="report-chapter"><h3 class="ch-title">월운 12개월 — 이달의 기운 완전 해부</h3><p class="ch-text">월운은 그달의 날씨입니다. 언제 액셀을 밟고 언제 브레이크를 밟아야 하는지 — 달력처럼 활용하십시오.</p>';
            for(var m4=1;m4<=12;m4++){
                var mS=Solar.fromYmd(curY3,m4,15);
                var mE=mS.getLunar().getEightChar();
                var gmz=mE.getMonth();var gm4=gmz[0];var jm4=gmz[1];
                var sm4=gs(gm4,jm4);var colm=gc(sm4);var isThisM=(m4===curM3);
                var gOhm=OH[gm4]||'earth';var jOhm=JO[jm4]||'earth';
                var ganSipM=(typeof getSipseong==='function'&&dayStem)?(getSipseong(dayStem,gm4)||''):'';
                var jiSipM=(typeof getSipseong==='function'&&dayStem)?(getSipseong(dayStem,jm4)||''):'';
                var mGTag=(GK[gm4]||gm4);
                var mJTag=(JK[jm4]||jm4);
                var mReacts=[];
                if(natalS.indexOf(gm4)>=0) mReacts.push(mGTag+getJosa(mGTag,'이/가')+' 원국에 겹쳐 같은 성향이 강해집니다.');
                if(natalB.indexOf(jm4)>=0) mReacts.push(mJTag+getJosa(mJTag,'이/가')+' 원국에 겹쳐 같은 일이 반복됩니다.');
                var msPair=STEM_PAIR[gm4], mbPair=BRANCH_PAIR[jm4], mbClash=BRANCH_CLASH[jm4];
                if(msPair&&natalS.indexOf(msPair)>=0){var _msk=GK[msPair]||msPair; mReacts.push(mGTag+getJosa(mGTag,'이/가')+' 원국의 '+_msk+getJosa(_msk,'과/와')+' 잘 붙어 연결 운이 좋아집니다.');}
                if(mbPair&&natalB.indexOf(mbPair)>=0){var _mbk=JK[mbPair]||mbPair; mReacts.push(mJTag+getJosa(mJTag,'이/가')+' 원국의 '+_mbk+getJosa(_mbk,'과/와')+' 잘 맞아 협업이 부드럽습니다.');}
                if(mbClash&&natalB.indexOf(mbClash)>=0){var _mck=JK[mbClash]||mbClash; mReacts.push(mJTag+getJosa(mJTag,'이/가')+' 원국의 '+_mck+getJosa(_mck,'과/와')+' 부딪혀 일정 변경·감정 충돌을 조심해야 합니다.');}
                var mReactTxt=mReacts.length?mReacts[0]:'원국과 큰 충돌이 적어 계획대로 밀어붙이기 좋은 달입니다.';
                var mKey=(typeof formatMonthWithGanzhiHtml==='function')?formatMonthWithGanzhiHtml(m4,gm4,jm4):((typeof formatMonthWithGanzhi==='function')?formatMonthWithGanzhi(m4,gm4,jm4):(String(m4)+'월 '+gm4+jm4));
                var mSalt=(curY3*17+m4*5+(gm4.charCodeAt(0)||0)+(jm4.charCodeAt(0)||0))%12;
                var mTail=[
                    '이번 달 말미에는 지출 앱을 열지 마십시오.',
                    '월 중 한 번만 통장 숫자를 부모·파트너와 맞추십시오.',
                    '회의 초대는 **주 2회**를 넘기지 마십시오.',
                    '**돈·기간이 묶이는 계약서**(전세·근로·투자·가맹 등)는 받은 날 전자서명·날인하지 말고 **영업일 이틀 유예** 후 처리하십시오. 소액 결제는 제외입니다.',
                    '새 투자 제안 문자는 **금요일 오전**에만 일괄 답하십시오.',
                    '이달은 **내부 문서·협업 도구**에 결정 로그 한 줄만 남기십시오.',
                    '야근이 잦으면 **지수형·현금** 비중만이라도 올리십시오.',
                    '소개·모임 인연은 **필터 문장**을 먼저 고치는 달입니다.',
                    '이직·이사 연락은 **다음 달 월요일**로 미루십시오.',
                    '미수 독촉은 **오전 10시 한 번**만 보내십시오.',
                    '고레버리지·단기 매매 앱은 **주말 잠금**을 켜 두십시오.',
                    '온라인 모임 링크는 **취향 태그**가 맞을 때만 들어가십시오.'
                ][mSalt];
                var mNeuBodies=[
                    mKey+'에는 속도보다 정확도가 이깁니다. '+mReactTxt+' **우선순위 한 장**만 월요일에 고치십시오. '+mTail,
                    mKey+'에는 밖보다 속 정비가 이깁니다. '+mReactTxt+' **한 가지 반복 루틴만** 유지하고 새 시도는 다음 달로 미루십시오. '+mTail,
                    mKey+'에는 잡음을 줄이는 쪽이 실속입니다. '+mReactTxt+' **알림 채널 하나**만 남기고 나머지는 끄십시오. '+mTail,
                    mKey+'에는 결정을 잠시 늦추는 편이 안전합니다. '+mReactTxt+' **48시간 유예** 규칙만 지켜도 손실이 줄어듭니다. '+mTail
                ];
                var advm=sm4>=2
                    ?(mKey+'에는 기운이 실행 쪽으로 힘이 실립니다. '+mReactTxt+' 중요한 시작·연락·계약 초안을 진행하면 다음 달로 이어질 가능성이 높습니다. '+mTail)
                    :sm4>=0
                    ?mNeuBodies[mSalt % 4]
                    :(mKey+'에는 부담 신호가 먼저 올 수 있습니다. '+mReactTxt+' 큰 결정보다 검토·보류를 먼저 하면 안정적으로 넘길 가능성이 높습니다. '+mTail);
                h4+='<div style="margin-bottom:12px;padding:14px;background:rgba(255,255,255,'+(isThisM?'0.07':'0.03')+');border:1px solid '+(isThisM?'var(--gold)':'rgba(255,255,255,0.06)')+';border-radius:10px;">';
                h4+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:8px;"><div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;"><span style="font-size:18px;font-weight:900;color:var(--gold);font-family:\'Noto Sans KR\',sans-serif;white-space:nowrap;letter-spacing:0.02em;">'+mKey+'</span><span style="font-size:13px;color:#bbb;white-space:nowrap;">'+m4+'월'+(isThisM?' <span style="font-size:10px;background:rgba(199,167,106,0.10);color:var(--gold);border:1px solid rgba(199,167,106,0.40);padding:1px 6px;border-radius:6px;font-weight:600;letter-spacing:0.3px;">이달</span>':'')+'</span></div><span style="font-size:11px;font-weight:700;color:'+colm+';white-space:nowrap;">'+gb(sm4)+'</span></div>';
                h4+='<div style="background:rgba(199,167,106,0.05);border-radius:6px;padding:8px 10px;border-left:2px solid '+colm+';"><p style="font-size:12px;color:#bbb;line-height:1.7;margin:0;">'+advm.replace(/\*\*([\s\S]*?)\*\*/g,'<strong>$1</strong>')+'</p></div></div>';
            }
            h4+='</div>';
            var rc3=document.getElementById('report-container');
            if(rc3) rc3.insertAdjacentHTML('beforeend',h4);
        })();
        }

        go(2);
        window.scrollTo(0,0);
        try { generateDeepReport(globalSajuData); } catch(e) { console.error(e); }
        const toc = document.getElementById('floating-toc');
        function updateFloatingToc(){
            if(!toc) return;
            toc.style.display = (window.innerWidth > 900) ? 'block' : 'none';
        }
        updateFloatingToc();
        window.addEventListener('resize', updateFloatingToc);
    });
}
