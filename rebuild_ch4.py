with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

ch4_start = 3458  # 0-indexed
ch4_end = 3580    # exclusive

NEW_CH4 = r"""function buildChapter4_Wealth(data) {
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
        ? `${name}님은 돈을 직접 움직이는 구조입니다. 사업, 투자, 영업처럼 내가 직접 움직일수록 수입이 커지는 방식이 맞습니다. 고정 월급보다 성과 기반 보상 구조에서 더 강합니다.`
        : `${name}님은 전문성과 신뢰가 쌓일수록 돈이 따라오는 구조입니다. 화려한 한탕보다 한 사람 한 사람에게 신뢰를 쌓아가는 방식이 장기적으로 더 강력한 재물 흐름을 만듭니다.`;

    const wealthCaution = wealthType === 'active'
        ? `큰 수익을 향해 달리다가 한 번의 실수로 모든 것을 잃는 패턴을 가장 조심하십시오. 분산투자와 리스크 관리가 필수입니다.`
        : `돈을 직접 쫓기보다 나의 가치를 높이는 데 집중하십시오. 가치가 올라가면 돈은 자연스럽게 따라옵니다.`;

    // 대운별 재물 흐름
    const rows = data.daeunRows || [];
    const OH2 = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water','子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water'};
    const HK2 = {'甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계','子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해'};
    const yong = data.yong; const gi = data.gi; const hee = data.hee;
    const actIdx = data.activeDaeunIdx || 0;

    const daewunRows = rows.slice(0, 8).map((r, i) => {
        const age = r.age !== undefined ? r.age : (Array.isArray(r) ? r[0] : 0);
        const gz = r.gz || (Array.isArray(r) ? r[1] : '') || '';
        if (!gz) return '';
        const g0 = gz[0] || ''; const g1 = gz[1] || '';
        const ganOh = OH2[g0] || ''; const jiOh = OH2[g1] || '';
        const ganKr = HK2[g0] || g0; const jiKr = HK2[g1] || g1;
        const isGood = ganOh === yong || jiOh === yong || ganOh === hee || jiOh === hee;
        const isBad = ganOh === gi || jiOh === gi;
        const isCur = i === actIdx;
        const score = isGood ? '🟢 재물 상승기' : isBad ? '🔴 수비 필요' : '🟡 유지기';
        const txt = isGood
            ? '이 10년은 재물 에너지가 가장 강하게 살아나는 구간입니다. 새로운 수입원 개발, 사업 확장, 투자 진입 — 용기 있는 행동이 결실을 맺습니다. 기회가 왔을 때 머뭇거리지 마십시오.'
            : isBad
            ? '이 10년은 재물 흐름이 막히거나 새는 구간입니다. 무리한 투자나 보증은 절대 금물입니다. 지금 있는 것을 지키는 전략이 먼저입니다.'
            : '큰 변동 없이 안정적으로 유지되는 10년입니다. 꾸준한 수입 관리와 저축에 집중하십시오.';
        const curBadge = isCur ? '<span style="font-size:10px;background:var(--gold);color:#000;padding:1px 6px;border-radius:6px;font-weight:700;">▶ 현재</span>' : '';
        return `<div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:12px 14px;margin-bottom:8px;border-left:3px solid ${isGood ? '#c7a76a' : isBad ? '#e74c3c' : '#555'};">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                <span style="font-size:12px;color:${isGood ? 'var(--gold)' : isBad ? '#e74c3c' : '#888'};">${age}세 ${ganKr}${jiKr}</span>
                <span style="font-size:11px;">${score}</span>
                ${curBadge}
            </div>
            <p style="font-size:12.5px;color:#bbb;margin:0;line-height:1.75;">${txt}</p>
        </div>`;
    }).join('');

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 4. 재물운 — 언제, 어떻게 돈이 들어오는가</h3>
        <p class="ch-text">사람들이 사주를 보는 가장 큰 이유 중 하나는 "언제 돈이 들어오는가"입니다. 사주의 재물운은 단순히 부자가 되는지 가난하게 사는지를 말하는 것이 아닙니다. 어떤 방식으로 수입이 생기고, 어느 시기에 재물 기회가 집중되는지를 파악하는 것입니다.</p>

        <div style="background:rgba(199,167,106,0.07);border-left:3px solid var(--gold);padding:16px 18px;border-radius:0 8px 8px 0;margin:16px 0;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">${name}님의 재물 구조</div>
            <p style="font-size:14.5px;color:#ddd;line-height:1.9;margin:0 0 10px;">${wealthDesc}</p>
            <p style="font-size:13px;color:#ccc;line-height:1.8;margin:0;">⚠ 조심할 것: ${wealthCaution}</p>
        </div>

        <div style="background:rgba(199,167,106,0.05);border-radius:12px;padding:20px;margin:20px 0;border:1px solid rgba(199,167,106,0.15);">
            <div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:16px;letter-spacing:1px;">💰 대운별 재물 흐름 — ${name}님의 인생 재물 타임라인</div>
            <p style="font-size:12.5px;color:#aaa;line-height:1.8;margin:0 0 14px;">10년 단위 대운에서 재물이 어떻게 변화하는지 보여줍니다. 용신 대운에 재물 기회를 잡고, 기신 대운에 지키는 전략을 쓰십시오.</p>
            ${daewunRows || '<p style="color:#666;font-size:12px;">대운 데이터가 없습니다.</p>'}
        </div>

        <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px;margin:20px 0;">
            <div style="font-size:12px;color:var(--gold);margin-bottom:14px;letter-spacing:1px;">&#9670; 재물을 지키는 핵심 원칙</div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">
                    <div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:8px;">기신 기운이 강한 시기 — 이것만은 하지 마십시오</div>
                    <p style="font-size:13px;color:#bbb;line-height:1.88;margin:0;">기신 대운·세운에서는 무리한 투자, 보증, 충동적 사업 확장을 절대 피하십시오. 이 시기의 판단은 평소보다 흐려집니다. 72시간 규칙(큰 결정 전 72시간 숙고)을 철저히 지키십시오. 특히 가까운 사람의 투자 제안은 더욱 신중하게 검토해야 합니다.</p>
                </div>
                <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:14px;">
                    <div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:8px;">용신 기운이 강한 시기 — 이때 움직이십시오</div>
                    <p style="font-size:13px;color:#bbb;line-height:1.88;margin:0;">용신·희신 대운·세운이 겹치는 구간이 인생에서 재물 도약의 황금 타이밍입니다. 이 시기를 미리 알고 준비하는 사람과 모르고 지나치는 사람의 차이는 10년 후에 극명하게 드러납니다. 기회가 왔을 때 행동할 준비를 지금부터 해두십시오.</p>
                </div>
            </div>
        </div>
    </div>`;
}

"""

new_lines = lines[:ch4_start] + [NEW_CH4] + lines[ch4_end:]
with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print(f"✅ Ch4 전체 재작성 완료 (기존 {ch4_end-ch4_start}줄 → 새 버전)")
