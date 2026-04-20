with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

def replace_func(html, fn_name, new_code):
    start = html.find(f'function {fn_name}(data) {{')
    if start == -1: print(f"{fn_name}: NOT FOUND"); return html
    depth=0; i=start; end=-1
    while i<len(html):
        if html[i]=='{': depth+=1
        elif html[i]=='}':
            depth-=1
            if depth==0: end=i+1; break
        i+=1
    if end==-1: print(f"{fn_name}: END NOT FOUND"); return html
    html = html[:start] + new_code + html[end:]
    print(f"{fn_name}: 교체 성공")
    return html

# Chapter 9: 개운법
ch9 = '''function buildChapter9_Remedy(data) {
    const stemEl = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'}[data.dayStem] || 'earth';
    const yong = data.yong || stemEl;
    const ohKr = {wood:'목(木)',fire:'화(火)',earth:'토(土)',metal:'금(金)',water:'수(水)'};
    const yongKr = ohKr[yong] || ohKr[stemEl];
    const colorDB = {
        wood:{good:'초록·청색·청록·연두',bad:'흰색·금색·은색',dir:'동쪽·동남쪽',num:'3, 8',gem:'에메랄드·옥(翠玉)·공작석·녹마노',food:'신맛 음식 — 레몬·식초·매실·키위·녹차',time:'봄(3~5월), 이른 아침 시간대',guien:'수(水) 기운 일간(壬·癸)을 가진 사람'},
        fire:{good:'빨강·주황·분홍·보라',bad:'검정·짙은 파랑',dir:'남쪽·동남쪽',num:'2, 7',gem:'루비·가넷·레드코랄·레드재스퍼',food:'쓴맛 음식 — 녹차·여주·쑥·아메리카노',time:'여름(6~8월), 오전~정오 시간대',guien:'목(木) 기운 일간(甲·乙)을 가진 사람'},
        earth:{good:'노랑·황토·베이지·오렌지',bad:'파랑·청록',dir:'중앙·북동·남서',num:'5, 10',gem:'황수정·호박(琥珀)·타이거아이·황철석',food:'단맛 음식 — 꿀·고구마·호박·옥수수·대추',time:'환절기, 오후 시간대',guien:'화(火) 기운 일간(丙·丁)을 가진 사람'},
        metal:{good:'흰색·금색·은색·회색',bad:'빨강·주황·분홍',dir:'서쪽·북서쪽',num:'4, 9',gem:'백수정·문스톤·다이아몬드·플루오라이트',food:'매운맛 음식 — 생강·마늘·고추·도라지·무',time:'가을(9~11월), 저녁 시간대',guien:'토(土) 기운 일간(戊·己)을 가진 사람'},
        water:{good:'검정·파랑·감색·보라·남색',bad:'노랑·황토·갈색',dir:'북쪽',num:'1, 6',gem:'흑요석·사파이어·아쿠아마린·청금석',food:'짠맛 음식 — 된장·미역·검은콩·블루베리·흑임자',time:'겨울(12~2월), 밤~새벽 시간대',guien:'금(金) 기운 일간(庚·辛)을 가진 사람'}
    }[yong] || {good:'흰색',bad:'검정',dir:'서쪽',num:'4, 9',gem:'백수정',food:'매운맛',time:'가을',guien:'토(土) 기운 일간'};

    return `<div class="report-chapter">
        <h3 class="ch-title">Chapter 9. 開運法(개운법) — 운명을 바꾸는 실전 처방</h3>
        <p class="ch-text">사주는 운명의 지도입니다. 지도가 있다면 그 지형에 맞게 전략을 바꿀 수 있습니다. 用神(용신)인 <b style="color:var(--gold);">${yongKr}</b> 기운을 생활 속에 쌓아가는 것이 당신 인생의 가장 강력한 개운법입니다. 큰 의식이나 특별한 노력이 필요한 것이 아닙니다. 매일의 선택 — 색깔, 방향, 음식, 인연 — 이 쌓이면 운의 흐름이 바뀝니다.</p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0;">
            <div style="background:rgba(0,200,83,0.06);border-radius:10px;padding:16px;">
                <div style="font-size:11px;color:#00C853;margin-bottom:10px;letter-spacing:1px;">✦ 행운의 색상 (적극 활용)</div>
                <div style="font-size:14px;color:#ddd;line-height:1.7;">${colorDB.good}<br><span style="font-size:12px;color:#888;margin-top:4px;display:block;">옷·인테리어·소품에 의식적으로 사용하십시오</span></div>
            </div>
            <div style="background:rgba(231,76,60,0.06);border-radius:10px;padding:16px;">
                <div style="font-size:11px;color:#e74c3c;margin-bottom:10px;letter-spacing:1px;">✗ 주의 색상 (최소화)</div>
                <div style="font-size:14px;color:#ddd;line-height:1.7;">${colorDB.bad}<br><span style="font-size:12px;color:#888;margin-top:4px;display:block;">기신(忌神) 기운을 자극하는 색상입니다</span></div>
            </div>
            <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:16px;">
                <div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;letter-spacing:1px;">행운 방위 · 숫자</div>
                <div style="font-size:13px;color:#ddd;line-height:1.7;">${colorDB.dir}<br>${colorDB.num}이 포함된 날짜·번호가 당신에게 우호적입니다</div>
            </div>
            <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:16px;">
                <div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;letter-spacing:1px;">행운 보석 · 광물</div>
                <div style="font-size:13px;color:#ddd;line-height:1.7;">${colorDB.gem}<br><span style="font-size:12px;color:#888;margin-top:4px;display:block;">항상 지니거나 가까이 두는 것이 좋습니다</span></div>
            </div>
        </div>

        <div style="background:rgba(199,167,106,0.06);border-radius:10px;padding:16px;margin-bottom:14px;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">🥗 식이 개운법</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.8;margin:0;">${colorDB.food} — 이 맛과 음식이 당신의 用神(용신) 에너지를 보충합니다. 일상의 식단에 의식적으로 포함시키십시오. 忌神(기신) 기운의 음식은 특별히 피할 필요는 없지만, 과다 섭취는 피하는 것이 좋습니다.</p>
        </div>

        <div style="background:rgba(199,167,106,0.06);border-radius:10px;padding:16px;margin-bottom:14px;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">⏰ 최적 활동 시간대</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.8;margin:0;">${colorDB.time} — 이 시간대에 중요한 결정·계약·창의적 작업을 배치하면 용신 에너지를 최대로 활용할 수 있습니다. 중요한 미팅이나 발표를 이 시간대에 잡으십시오.</p>
        </div>

        <div style="background:rgba(199,167,106,0.06);border-radius:10px;padding:16px;">
            <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;letter-spacing:1px;">💑 귀인의 조건</div>
            <p style="font-size:13.5px;color:#ddd;line-height:1.8;margin:0;">${colorDB.guien}이 당신에게 가장 강력한 귀인 에너지를 줍니다. 이 일간을 가진 사람들과의 협력과 동업은 용신 보충의 가장 빠른 지름길입니다. 주변에 이런 기운을 가진 사람이 있다면 적극적으로 가까이 하십시오.</p>
        </div>
    </div>`;
}'''

html = replace_func(html, 'buildChapter9_Remedy', ch9)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"완료 | {len(html):,} bytes")
