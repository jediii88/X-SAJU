with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

# lifecycle-inline-summary 추가 (lifecycle-cards 뒤)
old = '''            <div id="lifecycle-cards" style="display:flex;flex-direction:column;gap:12px;"></div>
        </div>

        <!-- 카테고리별 심층 분석 -->'''

new = '''            <div id="lifecycle-cards" style="display:flex;flex-direction:column;gap:12px;"></div>
            <div id="lifecycle-inline-summary" class="section-interp" style="display:none;"></div>
        </div>

        <!-- 카테고리별 심층 분석 -->'''

if old in html:
    html = html.replace(old, new)
    print("lifecycle-inline-summary 추가 성공")
else:
    print("lifecycle 패턴 불일치")

# 이제 전체 누락 체크
ids = ['manse-inline-summary','relation-inline-summary','shinsal-inline-summary',
  'wuxing-inline-summary','sipseong-inline-summary','strength-inline-summary',
  'yong-inline-summary','lifecycle-inline-summary']
for id_ in ids:
    found = f'id="{id_}"' in html
    print(f"  {'✅' if found else '❌'} {id_}")

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"\n저장 완료 | {len(html):,} bytes")
