with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 모든 inline-summary div를 display:none 대신 display:block으로 (JS가 내용 채움)
# 단, 내용이 없으면 빈 공간이 생기므로 min-height를 없애고 내용 채워지면 자동 표시

changes = 0

# section-interp class인 것들만 → JS가 채우기 전까지 보이지 않게 visibility:hidden → block으로 전환
# 더 나은 방법: JS에서 항상 display:block으로 세팅하되, 내용을 반드시 채우도록 보장

# 가장 확실한 방법: generateDeepReport 안에서 각 섹션 div에 강제로 내용을 주입하고 표시
# injectSectionInterpretations가 실패할 경우를 대비해 fallback 추가

old_inject = '''function injectSectionInterpretations(data) {
    // 1. 사주원국 아래 → Chapter 1 (일주 본질)
    const ch1 = buildChapter1_Basic(data);
    injectBelow('manse-inline-summary', ch1);
    
    // 2. 합충형파해 아래 → 관계 해석
    const relEl = document.getElementById('relation-inline-summary');
    if(relEl) {
        relEl.innerHTML = buildRelationSummary(data);
        relEl.style.display = 'block';
    }
    
    // 3. 신살 아래 → 신살 해석
    const shinsalEl = document.getElementById('shinsal-inline-summary');
    if(shinsalEl) {
        shinsalEl.innerHTML = buildShinsalSummary(data);
        shinsalEl.style.display = 'block';
    }
    
    // 4. 오행 아래 → Chapter 2 (오행)
    const ch2 = buildChapter2_Wuxing(data);
    injectBelow('wuxing-inline-summary', ch2);
    
    // 5. 십성 아래 → Chapter 3 (십성)
    const sipEl = document.getElementById('sipseong-inline-summary');
    if(sipEl) {
        sipEl.innerHTML = buildChapter3_Sipseong(data);
        sipEl.style.display = 'block';
    }
    
    // 6. 신강신약 아래 → 강약 해석
    const ch_str = buildStrengthSummary(data);
    injectBelow('strength-inline-summary', ch_str);
    
    // 7. 용신 아래 → Chapter 7 (지장간) + 개운 힌트
    const yongEl = document.getElementById('yong-inline-summary');
    if(yongEl) {
        yongEl.innerHTML = buildChapter7_Hidden(data);
        yongEl.style.display = 'block';
    }
    
    // 8. 인생시기 아래 → Chapter 4~6 (재물/직업/애정 요약)
    const lifeEl = document.getElementById('lifecycle-inline-summary');
    if(lifeEl) {
        lifeEl.innerHTML = buildChapter4_Wealth(data) + buildChapter5_Career(data) + buildChapter6_Love(data);
        lifeEl.style.display = 'block';
    }
}'''

new_inject = '''function injectSectionInterpretations(data) {
    function setEl(id, html) {
        const el = document.getElementById(id);
        if(el) { el.innerHTML = html; el.style.display = 'block'; }
        else console.warn('inject: #'+id+' not found');
    }
    // 1. 만세력 원국 아래 → 4주 전체 해설
    setEl('manse-inline-summary', buildChapter1_Basic(data));
    // 2. 합충형파해 아래
    setEl('relation-inline-summary', buildRelationSummary(data));
    // 3. 신살 아래
    setEl('shinsal-inline-summary', buildShinsalSummary(data));
    // 4. 오행 아래
    setEl('wuxing-inline-summary', buildChapter2_Wuxing(data));
    // 5. 십성 아래
    setEl('sipseong-inline-summary', buildChapter3_Sipseong(data));
    // 6. 신강신약 아래
    setEl('strength-inline-summary', buildStrengthSummary(data));
    // 7. 용신/희신 아래
    setEl('yong-inline-summary', buildChapter7_Hidden(data));
    // 8. 인생 시기별 아래 → 재물+직업+애정
    setEl('lifecycle-inline-summary', buildChapter4_Wealth(data) + buildChapter5_Career(data) + buildChapter6_Love(data) + buildChapter8_Health(data) + buildChapter9_Remedy(data));
}'''

if old_inject in html:
    html = html.replace(old_inject, new_inject)
    print("injectSectionInterpretations 교체 성공")
    changes += 1
else:
    print("injectSectionInterpretations 패턴 불일치")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 완료 | {len(html):,} bytes | 변경 {changes}개")
