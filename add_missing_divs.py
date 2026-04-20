with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. 십성 분포 섹션 끝에 sipseong-inline-summary 추가
old1 = '''            <div id="sipseong-summary" style="font-size:12px;color:var(--text-soft);margin-bottom:12px;padding:8px 12px;background:#111;border-radius:8px;border-left:3px solid #8a9bb5;line-height:1.6;"></div>
            <div class="bar-group" id="sipseong-bars"></div>
        </div>'''

new1 = '''            <div id="sipseong-summary" style="font-size:12px;color:var(--text-soft);margin-bottom:12px;padding:8px 12px;background:#111;border-radius:8px;border-left:3px solid #8a9bb5;line-height:1.6;"></div>
            <div class="bar-group" id="sipseong-bars"></div>
            <div id="sipseong-inline-summary" class="section-interp" style="display:none;"></div>
        </div>'''

if old1 in html:
    html = html.replace(old1, new1)
    print("십성 inline-summary 추가 성공")
else:
    print("십성 패턴 불일치")

# 2. 용신/희신 섹션 끝에 yong-inline-summary 추가
old2 = '''            <div class="pill-grid" id="yonghee-grid">
                <div class="info-card"><div class="info-label">✦ 용신 — 나의 수호신</div><div class="info-value" id="yong-val">-</div></div>
                <div class="info-card"><div class="info-label">✦ 희신 — 나를 돕는 기운</div><div class="info-value" id="hee-val">-</div></div>
                <div class="info-card"><div class="info-label">✦ 기신 — 나를 방해하는 기운</div><div class="info-value" id="gi-val">-</div></div>
                <div class="info-card"><div class="info-label">✦ 구신 — 기신을 돕는 기운</div><div class="info-value" id="goo-val">-</div></div>
            </div>
        </div>'''

new2 = '''            <div class="pill-grid" id="yonghee-grid">
                <div class="info-card"><div class="info-label">✦ 용신 — 나의 수호신</div><div class="info-value" id="yong-val">-</div></div>
                <div class="info-card"><div class="info-label">✦ 희신 — 나를 돕는 기운</div><div class="info-value" id="hee-val">-</div></div>
                <div class="info-card"><div class="info-label">✦ 기신 — 나를 방해하는 기운</div><div class="info-value" id="gi-val">-</div></div>
                <div class="info-card"><div class="info-label">✦ 구신 — 기신을 돕는 기운</div><div class="info-value" id="goo-val">-</div></div>
            </div>
            <div id="yong-inline-summary" class="section-interp" style="display:none;"></div>
        </div>'''

if old2 in html:
    html = html.replace(old2, new2)
    print("용신 inline-summary 추가 성공")
else:
    print("용신 패턴 불일치")

# 3. 신강신약 섹션 확인 및 strength-inline-summary 추가
# sec-fortune 섹션 끝 찾기
idx = html.find('id="sec-fortune"')
print(f"sec-fortune 위치: line {html[:idx].count(chr(10))+1}")
print(html[idx:idx+800])

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"\n파일 저장 완료 | {len(html):,} bytes")
