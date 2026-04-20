with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

def replace_func(html, fn_name, new_code):
    sig = f'function {fn_name}('
    start = html.find(sig)
    if start == -1: print(f"{fn_name}: NOT FOUND"); return html
    depth=0; i=start; end=-1
    while i<len(html):
        if html[i]=='{': depth+=1
        elif html[i]=='}':
            depth-=1
            if depth==0: end=i+1; break
        i+=1
    html = html[:start] + new_code + html[end:]
    print(f"{fn_name}: 교체 성공")
    return html

# 신살 상세 표 + 설명 UI
new_shinsal_summary = '''function buildShinsalSummary(data) {
    const shinsal = data.allShinsal || [];
    if(!shinsal || shinsal.length === 0) {
        return '<div class="inline-interp"><div class="ii-label">✦ 신살·길성 분석</div><div class="ii-text">원국에서 특별한 신살이 검출되지 않았습니다. 안정적인 원국 구조입니다.</div></div>';
    }
    const goodCats = ['길성(吉星)'];
    const rows = shinsal.map(s => {
        const info = window.SHINSAL_DESC?.[s] || {cat:'신살', color:'#aaa', short:s, detail:''};
        const catColor = goodCats.includes(info.cat) ? '#c7a76a' : info.color || '#e74c3c';
        return `<div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:14px 16px;margin-bottom:10px;border-left:3px solid ${catColor};">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;">
                <div>
                    <span style="font-size:14px;font-weight:700;color:${catColor};">${s}</span>
                    <span style="margin-left:8px;font-size:11px;color:rgba(255,255,255,0.4);background:rgba(255,255,255,0.07);padding:2px 8px;border-radius:10px;">${info.cat}</span>
                </div>
                <span style="font-size:12px;color:#999;font-style:italic;">${info.short}</span>
            </div>
            ${info.detail ? `<p style="font-size:13px;color:#bbb;line-height:1.8;margin:8px 0 0;">${info.detail}</p>` : ''}
        </div>`;
    }).join('');

    const goodList = shinsal.filter(s => {
        const info = window.SHINSAL_DESC?.[s] || {};
        return info.cat === '길성(吉星)';
    });
    const badList = shinsal.filter(s => {
        const info = window.SHINSAL_DESC?.[s] || {};
        return info.cat !== '길성(吉星)';
    });

    return `<div class="inline-interp">
        <div class="ii-label">✦ 신살(神殺) · 길성(吉星) 상세 분석</div>
        <div class="ii-title">하늘이 새긴 특수 기운 — 총 ${shinsal.length}개 검출</div>
        ${goodList.length > 0 ? `<div style="margin-bottom:6px;padding:10px 14px;background:rgba(199,167,106,0.07);border-radius:8px;"><span style="font-size:12px;color:var(--gold);">✦ 길성(吉星) ${goodList.length}개:</span> <span style="font-size:13px;color:#ddd;">${goodList.join(' · ')}</span></div>` : ''}
        ${badList.length > 0 ? `<div style="margin-bottom:14px;padding:10px 14px;background:rgba(231,76,60,0.06);border-radius:8px;"><span style="font-size:12px;color:#e74c3c;">⚠ 신살 ${badList.length}개:</span> <span style="font-size:13px;color:#ddd;">${badList.join(' · ')}</span><p style="font-size:12px;color:#999;margin:6px 0 0;">신살은 흉이 아닙니다. 당신을 단련시키는 도전의 코드이며, 제대로 다루면 가장 강력한 무기가 됩니다.</p></div>` : ''}
        <div class="ii-text">${rows}</div>
    </div>`;
}'''

html = replace_func(html, 'buildShinsalSummary', new_shinsal_summary)

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"저장 완료 | {len(html):,} bytes")
