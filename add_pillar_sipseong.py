with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# globalSajuData에 pillars_sipseong, gongmang 추가
old = '''globalSajuData = {
            name: name,
            dayStem: dayStem,
            dayBranch: pillars[1].h[1],
            monthBranch: pillars[2].h[1],
            pillars: pillars,
            strengthText: strength,
            allShinsal: allShinsal,
            wuxing: counts,
            sipseong: sipCounts,
            sipTotalWeight: sipTotalWeight,
            yong: yong, hee: hee, gi: gi, goo: goo,
            daeunRows: daeunForReport,
            activeDaeunIdx: activeDaeunIdx
        };'''

new = '''// 각 주별 십성 계산 (일간 기준)
        const SIP_MAP = {
            wood: {wood:'비견',fire:'식신',earth:'편재',metal:'편관',water:'편인'},
            fire: {fire:'비견',earth:'식신',metal:'편재',water:'편관',wood:'편인'},
            earth: {earth:'비견',metal:'식신',water:'편재',wood:'편관',fire:'편인'},
            metal: {metal:'비견',water:'식신',wood:'편재',fire:'편관',earth:'편인'},
            water: {water:'비견',wood:'식신',fire:'편재',earth:'편관',metal:'편인'}
        };
        const STEM_OH = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
        const dayOh = STEM_OH[dayStem] || 'earth';
        const dayStemYin = ['乙','丁','己','辛','癸'].includes(dayStem);
        const pillars_sipseong = (pillars||[]).map((p,pi) => {
            if(!p || !p.h) return '';
            const st = p.h[0]; const oh = STEM_OH[st] || 'earth';
            const base = (SIP_MAP[dayOh]||{})[oh] || '';
            const stYin = ['乙','丁','己','辛','癸'].includes(st);
            if(!base) return '';
            // 음양 동일 = 비견/식신/편재/편관/편인, 음양 다름 = 겁재/상관/정재/정관/정인
            if(pi === 2) return '(일주)'; // 일주는 자기 자신
            const yinDiff = (dayStemYin !== stYin);
            if(base==='비견') return yinDiff ? '겁재' : '비견';
            if(base==='식신') return yinDiff ? '상관' : '식신';
            if(base==='편재') return yinDiff ? '정재' : '편재';
            if(base==='편관') return yinDiff ? '정관' : '편관';
            if(base==='편인') return yinDiff ? '정인' : '편인';
            return base;
        });
        // 공망 계산
        const gongmangBranches = data && data.gongmang ? data.gongmang : (globalSajuData && globalSajuData.gongmang ? globalSajuData.gongmang : []);
        globalSajuData = {
            name: name,
            dayStem: dayStem,
            dayBranch: pillars[1].h[1],
            monthBranch: pillars[2].h[1],
            pillars: pillars,
            pillars_sipseong: pillars_sipseong,
            strengthText: strength,
            allShinsal: allShinsal,
            wuxing: counts,
            sipseong: sipCounts,
            sipTotalWeight: sipTotalWeight,
            yong: yong, hee: hee, gi: gi, goo: goo,
            daeunRows: daeunForReport,
            activeDaeunIdx: activeDaeunIdx
        };'''

if old in html:
    html = html.replace(old, new)
    print("pillars_sipseong 추가 성공")
else:
    print("패턴 불일치")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 완료 | {len(html):,} bytes")
