
/** ═══ 사주X 오행 조합 엔진 + 120세 인생 길흉 지도 ═══ */
var SAJUX_OH_KR_SHORT = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' };
var SAJUX_OH_KR_LONG = { wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)' };
var SAJUX_SHENG_NEXT = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
var SAJUX_KE_TARGET = { wood: 'earth', fire: 'metal', metal: 'wood', water: 'fire', earth: 'water' };

function sajuxOhRelation(fromOh, toOh) {
    if (!fromOh || !toOh) return 'none';
    if (fromOh === toOh) return 'same';
    if (SAJUX_SHENG_NEXT[fromOh] === toOh) return 'sheng_out';
    if (SAJUX_SHENG_NEXT[toOh] === fromOh) return 'sheng_in';
    if (SAJUX_KE_TARGET[fromOh] === toOh) return 'ke_out';
    if (SAJUX_KE_TARGET[toOh] === fromOh) return 'ke_in';
    return 'cross';
}

function sajuxNatalWxProfile(data) {
    var wx = data.wuxing || {};
    var keys = ['wood', 'fire', 'earth', 'metal', 'water'];
    var total = 0;
    keys.forEach(function (k) { total += Math.max(0, Number(wx[k]) || 0); });
    if (total <= 0) total = 1;
    var pct = {};
    keys.forEach(function (k) { pct[k] = Math.round((Math.max(0, Number(wx[k]) || 0) / total) * 100); });
    var weakest = keys[0], strongest = keys[0];
    keys.forEach(function (k) {
        if (pct[k] < pct[weakest]) weakest = k;
        if (pct[k] > pct[strongest]) strongest = k;
    });
    return {
        pct: pct, weakest: weakest, strongest: strongest,
        dayOh: _SAJUX_FORTUNE_GAN_OH[data.dayStem] || 'earth',
        yong: data.yong || '', hee: data.hee || '', gi: data.gi || '', goo: data.goo || ''
    };
}

function sajuxGilHeungLabel(sc) {
    if (sc >= 4) return { tag: '대길', tone: 'good' };
    if (sc >= 2) return { tag: '길', tone: 'good' };
    if (sc >= 0) return { tag: '평', tone: 'flat' };
    if (sc >= -2) return { tag: '주의', tone: 'caution' };
    return { tag: '흉', tone: 'tough' };
}

function sajuxAnalyzePeriod(data, g, j) {
    var ganOh = _SAJUX_FORTUNE_GAN_OH[g] || '';
    var jiOh = _SAJUX_FORTUNE_JI_OH[j] || '';
    var natal = sajuxNatalWxProfile(data);
    var sc = sajuxFortuneScore(data, g, j);
    var HK = sajuxFortuneHK();
    var sipGan = (typeof getSipseong === 'function') ? (getSipseong(data.dayStem, g) || '') : '';
    var sipJi = (typeof getSipseong === 'function' && j) ? (getSipseong(data.dayStem, j) || '') : '';
    var pctStrong = natal.pct[natal.strongest] || 0;
    return {
        g: g, j: j, gzKr: (HK[g] || g) + (HK[j] || j),
        ganOh: ganOh, jiOh: jiOh,
        ganJiRel: sajuxOhRelation(ganOh, jiOh),
        yongHit: (ganOh === natal.yong || jiOh === natal.yong),
        heeHit: (ganOh === natal.hee || jiOh === natal.hee),
        giHit: (ganOh === natal.gi || jiOh === natal.gi || ganOh === natal.goo || jiOh === natal.goo),
        fillsWeak: (ganOh === natal.weakest || jiOh === natal.weakest),
        floodsStrong: (pctStrong >= 32 && (ganOh === natal.strongest || jiOh === natal.strongest)),
        score: sc, gil: sajuxGilHeungLabel(sc),
        sipGan: sipGan, sipJi: sipJi, natal: natal
    };
}

function sajuxNarratePeriod(data, g, j, seed) {
    if (!g || !j) return '';
    var a = sajuxAnalyzePeriod(data, g, j);
    var nm = data.name || '고객';
    var parts = [];
    parts.push('<strong>' + a.gzKr + '(' + g + j + ')</strong> — 천간 ' + SAJUX_OH_KR_LONG[a.ganOh] + ', 지지 ' + SAJUX_OH_KR_LONG[a.jiOh] + '이 한 덩어리로 들어옵니다.');
    var relLine = {
        sheng_out: '천간이 지지를 생(生)해, 겉으로 드러나는 방향이 속바탕을 끌고 올라오는 형태예요.',
        sheng_in: '지지가 천간을 받쳐 생(生)해, 겉은 조용해도 밑에서 힘이 쌓이는 형태예요.',
        ke_out: '천간이 지지를 극(克)해, 말·결정과 현장 리듬이 어긋나기 쉬운 형태예요.',
        ke_in: '지지가 천간을 눌러, 겉으론 버티는데 속이 먼저 지치는 형태예요.',
        same: '천간·지지 오행이 겹쳐 한 기운이 짙게 깔립니다. 방향은 분명한데 과하면 한쪽으로 치우칠 수 있어요.',
        cross: '천간·지지 오행이 엇갈려, 한 시기 안에 두 결이 동시에 움직입니다.'
    }[a.ganJiRel] || '';
    if (relLine) parts.push(relLine);
    if (a.yongHit) parts.push(pickVoiceLine([
        '이 조합은 ' + nmUi(nm) + ' 용신(用) 오행과 직접 맞물려, 같은 글자라도 체감이 달라집니다.',
        '용신(用) 쪽 오행이 들어와, 원국에서 비어 있던 자리를 이 시기에 채우는 쪽에 가깝습니다.'
    ], seed + '|yong'));
    else if (a.heeHit) parts.push('희신(喜) 쪽으로 받쳐 주는 시기라, 무리하지 않아도 흐름이 붙기 쉽습니다.');
    else if (a.giHit) parts.push('기신(忌)·구신(仇) 쪽 오행이 겹쳐, 크게 벌리기보다 지키는 쪽이 ' + nmUi(nm) + ' 사주와 맞습니다.');
    if (a.fillsWeak && !a.giHit) parts.push('원국에서 상대적으로 약했던 ' + SAJUX_OH_KR_LONG[a.natal.weakest] + ' 기운이 보충됩니다.');
    if (a.floodsStrong && !a.yongHit) parts.push('원국에서 이미 두툼한 ' + SAJUX_OH_KR_LONG[a.natal.strongest] + ' 기운에 더해져, 과열·지출·성급함을 한 단계 낮추는 게 이득입니다.');
    if (a.sipGan) parts.push('천간은 일간 기준 <strong>' + a.sipGan + '</strong>(십성)으로 ' + nmEulReul(nm) + ' 둘러싸며, 이 시기의 일·관계의 결이 여기서 갈립니다.');
    if (a.sipJi && a.sipJi !== a.sipGan) parts.push('지지는 <strong>' + a.sipJi + '</strong>(십성) 쪽으로 현장·몸·돈의 결을 만듭니다.');
    return parts.join(' ');
}

function sajuxNarrateLayeredStack(data, daeun, seyunG, seyunJ, wolunG, wolunJ, yr, mo) {
    var parts = [];
    if (daeun && daeun.g && daeun.j) {
        var dA = sajuxAnalyzePeriod(data, daeun.g, daeun.j);
        parts.push('바탕 대운 <strong>' + dA.gzKr + '</strong> — ' + SAJUX_OH_KR_LONG[dA.ganOh] + '·' + SAJUX_OH_KR_LONG[dA.jiOh] + ' (' + dA.gil.tag + ')');
    }
    if (seyunG && seyunJ) {
        var sA = sajuxAnalyzePeriod(data, seyunG, seyunJ);
        parts.push((yr ? yr + '년 ' : '') + '세운 <strong>' + sA.gzKr + '</strong> — ' + SAJUX_OH_KR_LONG[sA.ganOh] + '·' + SAJUX_OH_KR_LONG[sA.jiOh] + ' (' + sA.gil.tag + ')');
        if (daeun && daeun.j && sajuxBranchPairHit(_SAJUX_BRANCH_CHUNG, daeun.j, seyunJ)) parts.push('대운·세운 지지 충(沖) — 한 해 안 방향 전환이 잦을 수 있습니다.');
        if (daeun && daeun.g) {
            var delta = sA.score - sajuxFortuneScore(data, daeun.g, daeun.j);
            if (delta >= 2) parts.push('세운이 대운보다 밝아 올해가 10년 안에서 돋보입니다.');
            else if (delta <= -2) parts.push('대운은 무겁고 세운이 가볍지 않아, 올해는 지키고 내년을 준비하는 해입니다.');
        }
    }
    if (wolunG && wolunJ) {
        var mA = sajuxAnalyzePeriod(data, wolunG, wolunJ);
        parts.push((yr && mo ? yr + '년 ' + mo + '월 ' : '') + '월운 <strong>' + mA.gzKr + '</strong> — ' + SAJUX_OH_KR_LONG[mA.ganOh] + '·' + SAJUX_OH_KR_LONG[mA.jiOh] + ' (' + mA.gil.tag + ')');
        if (seyunJ && sajuxBranchPairHit(_SAJUX_BRANCH_CHUNG, seyunJ, wolunJ)) parts.push('세운·월운 지지 충(沖) — 이번 달 감정·일정이 급변하기 쉽습니다.');
        if (daeun && daeun.g && seyunG) {
            var base = (sajuxFortuneScore(data, daeun.g, daeun.j) + sajuxFortuneScore(data, seyunG, seyunJ)) / 2;
            if (mA.score - base >= 2) parts.push('월운이 위 두 층보다 밝아 이번 달이 작은 전성기처럼 느껴질 수 있습니다.');
            else if (mA.score - base <= -2) parts.push('월운이 무거워 쉬고 점검하는 달이 낫습니다.');
        }
    }
    return parts.join(' ');
}

function sajuxParseDaeunRow(r) {
    var g = (r.gz && r.gz[0]) || (r.h && r.h[0]) || r.gan || '';
    var j = (r.gz && r.gz[1]) || (r.h && r.h[1]) || r.ji || '';
    var gz = (r.name || (g && j ? g + j : '')) || '';
    if (!g && gz.length > 1) { g = gz.charAt(0); j = gz.charAt(1); }
    var age = (typeof r.age === 'number') ? r.age : (typeof r.startAge === 'number' ? r.startAge : 0);
    return { g: g, j: j, age: age };
}

function buildLifeGilHeungMapHtml(data) {
    var rows = (data.daeunRows && data.daeunRows.length) ? data.daeunRows : (data.daewunList || []);
    if (!rows.length) return '';
    var name = data.name || '고객';
    var items = [], best = null, worst = null;
    for (var i = 0; i < rows.length; i++) {
        var p = sajuxParseDaeunRow(rows[i]);
        if (!p.g || !p.j || p.age > 115) continue;
        var sc = sajuxFortuneScore(data, p.g, p.j);
        var gil = sajuxGilHeungLabel(sc);
        var HK = sajuxFortuneHK();
        var it = { age: p.age, end: p.age + 9, g: p.g, j: p.j, gzKr: (HK[p.g] || p.g) + (HK[p.j] || p.j), sc: sc, gil: gil };
        items.push(it);
        if (!best || sc > best.sc) best = it;
        if (!worst || sc < worst.sc) worst = it;
    }
    if (!items.length) return '';
    var macro = (best && worst && best.age !== worst.age)
        ? nmDnim(name) + ' 인생을 10년 계절로 훑으면, <strong>' + best.gzKr + '(' + best.age + '세~' + best.end + '세)</strong>이 가장 밝고, <strong>' + worst.gzKr + '(' + worst.age + '세~' + worst.end + '세)</strong>은 단단히 지키셔야 하는 구간입니다. 아래는 길·흉·평만 골라 둔 지도예요.'
        : nmDnim(name) + ' 인생을 10년 단위 큰 계절로 펼친 지도입니다.';
    var cells = items.map(function (it) {
        var col = sajuxFortuneToneColor(it.gil.tone);
        return '<div style="flex:0 0 auto;min-width:72px;padding:10px 8px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid ' + col + '33;border-left:3px solid ' + col + ';text-align:center;box-sizing:border-box;">'
            + '<motion style="font-size:9px;color:' + col + ';font-weight:700;">' + it.gil.tag + '</div>'
            + '<div style="font-size:14px;font-weight:800;color:#fff;margin:4px 0;">' + it.gzKr + '</div>'
            + '<div style="font-size:10px;color:#888;">' + it.age + '세~' + it.end + '세</motion>'
            + '<div style="font-size:9px;color:rgba(255,255,255,0.4);margin-top:3px;">' + SAJUX_OH_KR_SHORT[_SAJUX_FORTUNE_GAN_OH[it.g]] + '·' + SAJUX_OH_KR_SHORT[_SAJUX_FORTUNE_JI_OH[it.j]] + '</div></div>';
    }).join('<div style="flex:0 0 8px;align-self:stretch;"></div>');
    return '<motion class="life-gilheung-map" style="margin:20px 0 28px;padding:18px 16px;border-radius:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(199,167,106,0.15);">'
        + '<p style="font-size:11px;letter-spacing:0.12em;color:rgba(199,167,106,0.75);font-weight:700;margin:0 0 8px;">인생 120세 · 10년마다 큰 길흉</p>'
        + '<p style="font-size:13px;color:#ccc;line-height:1.9;margin:0 0 14px;">' + macro + '</p>'
        + '<div style="display:flex;align-items:stretch;gap:0;overflow-x:auto;padding-bottom:6px;-webkit-overflow-scrolling:touch;">' + cells + '</div></motion>';
}

function sajuxLifeArcBeatForRange(data, lo, hi, seed) {
    var rows = data.daeunRows || data.daewunList || [];
    var hits = [];
    for (var i = 0; i < rows.length; i++) {
        var p = sajuxParseDaeunRow(rows[i]);
        if (!p.g || !p.j) continue;
        if (p.age + 9 < lo || p.age > hi) continue;
        hits.push({ p: p, sc: sajuxFortuneScore(data, p.g, p.j) });
    }
    if (!hits.length) return '';
    hits.sort(function (a, b) { return a.p.age - b.p.age; });
    var main = hits[0];
    for (var h = 1; h < hits.length; h++) {
        if (Math.abs(hits[h].sc) > Math.abs(main.sc)) main = hits[h];
    }
    var HK = sajuxFortuneHK();
    var gzKr = (HK[main.p.g] || main.p.g) + (HK[main.p.j] || main.p.j);
    var gil = sajuxGilHeungLabel(main.sc);
    var narr = sajuxNarratePeriod(data, main.p.g, main.p.j, seed + '|' + lo + '-' + hi);
    return pickVoiceLine([
        '이 무렵(' + lo + '~' + hi + '세) 큰 계절은 <strong>' + gzKr + ' 대운</strong>(' + main.p.age + '세부터, ' + gil.tag + ')입니다. ' + narr,
        lo + '세부터 ' + hi + '세 사이, 겉으로 드러나는 10년의 중심은 <strong>' + gzKr + '</strong>(' + gil.tag + ')입니다. ' + narr
    ], seed + '|beat');
}
