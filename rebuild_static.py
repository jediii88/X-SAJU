"""
핵심 전략 변경:
- JS 동적 innerHTML 주입 방식 완전 폐기
- 각 섹션 아래 풀이가 항상 HTML에 존재하되, JS로 내용을 교체
- display:none → block 전환도 없앰 (항상 block)
- JS가 실패해도 "분석 중..." 텍스트라도 보임
"""

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. 모든 inline-summary div를 display:none에서 항상 보이게 + 기본 텍스트 삽입
replacements = [
    (
        'id="manse-inline-summary" class="section-interp" style="display:none;">',
        'id="manse-inline-summary" class="section-interp"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">사주 원국 풀이를 불러오는 중...</div></div>'
    ),
    (
        'id="relation-inline-summary" class="section-interp" style="display:none;">',
        'id="relation-inline-summary" class="section-interp"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">합·충·형·파·해 풀이를 불러오는 중...</div></div>'
    ),
    (
        'id="shinsal-inline-summary" class="section-interp" style="display:none;">',
        'id="shinsal-inline-summary" class="section-interp"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">신살 풀이를 불러오는 중...</div></div>'
    ),
    (
        'id="wuxing-inline-summary" class="section-interp" style="display:none;">',
        'id="wuxing-inline-summary" class="section-interp"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">오행 풀이를 불러오는 중...</div></div>'
    ),
    (
        'id="sipseong-inline-summary" class="section-interp" style="display:none;">',
        'id="sipseong-inline-summary" class="section-interp"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">십성 풀이를 불러오는 중...</div></div>'
    ),
    (
        'id="strength-inline-summary" style="display:none; margin:0 0 8px 0;">',
        'id="strength-inline-summary" style="margin:0 0 8px 0;"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">신강신약 풀이를 불러오는 중...</div></div>'
    ),
    (
        'id="yong-inline-summary" class="section-interp" style="display:none;">',
        'id="yong-inline-summary" class="section-interp"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">용신·기신 풀이를 불러오는 중...</div></div>'
    ),
    (
        'id="lifecycle-inline-summary" class="section-interp" style="display:none;">',
        'id="lifecycle-inline-summary" class="section-interp"><div class="inline-interp"><div class="ii-text" style="color:#888;font-size:13px;">재물·직업·애정·건강 풀이를 불러오는 중...</div></div>'
    ),
]

for old, new in replacements:
    if old in html:
        html = html.replace(old, new, 1)
        print(f"✅ 교체: {old[:50]}")
    else:
        print(f"❌ 불일치: {old[:50]}")

# 2. injectBelow도 display:block 명시
old_inject_below = '''function injectBelow(id, html_content) {
    const el = document.getElementById(id);
    if(el) { el.innerHTML = html_content; el.style.display = 'block'; }
}'''
new_inject_below = '''function injectBelow(id, html_content) {
    const el = document.getElementById(id);
    if(el) { el.innerHTML = html_content; }
    else console.warn('injectBelow: #'+id+' not found');
}'''
if old_inject_below in html:
    html = html.replace(old_inject_below, new_inject_below)
    print("✅ injectBelow 수정")

# 3. setEl도 display:block 제거 (이미 block)
old_setel = '''    function setEl(id, html) {
        const el = document.getElementById(id);
        if(el) { el.innerHTML = html; el.style.display = 'block'; }
        else console.warn('inject: #'+id+' not found');
    }'''
new_setel = '''    function setEl(id, content) {
        const el = document.getElementById(id);
        if(el) { el.innerHTML = content; }
        else console.warn('inject: #'+id+' not found');
    }'''
if old_setel in html:
    html = html.replace(old_setel, new_setel)
    print("✅ setEl 수정")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"\n저장 | {len(html):,} bytes")
