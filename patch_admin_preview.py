#!/usr/bin/env python3
with open('/home/node/.openclaw/workspace/sajux_deploy/admin/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ─── 1. 리포트 링크 생성 버튼 아래에 미리보기 버튼 + 링크 전송 박스 교체 ───
OLD_BTN = """      <hr class="divider">
      <button class="btn" onclick="generateReportLink()">🔗 리포트 링크 생성</button>
      <div id="link-result" style="display:none;">
        <div class="link-box" id="link-url-text"></div>
        <div style="margin-top:10px;font-size:12px;color:#888;">만료일: <span id="link-expiry" style="color:var(--gold);"></span></div>
        <button class="btn sec" style="margin-top:10px;" onclick="copyLink('link-url-text')">📋 링크 복사</button>
      </div>"""

NEW_BTN = """      <hr class="divider">
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn" onclick="previewReport()" style="flex:1;">👁 미리보기 (검토)</button>
        <button class="btn sec" onclick="generateReportLink()" style="flex:1;">🔗 링크 생성</button>
      </div>
      <div id="link-result" style="display:none;margin-top:16px;">
        <div style="font-size:11px;color:#888;margin-bottom:6px;">고객에게 전달할 링크</div>
        <div class="link-box" id="link-url-text"></div>
        <div style="margin-top:8px;font-size:12px;color:#888;">만료일: <span id="link-expiry" style="color:var(--gold);"></span></div>
        <div style="display:flex;gap:8px;margin-top:10px;">
          <button class="btn sec" onclick="copyLink('link-url-text')" style="flex:1;">📋 링크 복사</button>
          <button class="btn sec" onclick="previewReport()" style="flex:1;background:rgba(124,141,255,0.12);color:var(--purple);border-color:var(--purple);">👁 다시 확인</button>
        </div>
      </div>"""

c1 = content.count(OLD_BTN)
print(f"버튼 교체: {c1}")
if c1: content = content.replace(OLD_BTN, NEW_BTN)

# ─── 2. generateReportLink 함수에 previewReport 함수 추가 ───
OLD_GENERATE = """function generateReportLink(){
  const name=document.getElementById('lnk-name').value.trim();
  if(!name)return alert('이름을 입력하세요');
  const parsed=parseDateInput(document.getElementById('lnk-date').value);
  if(!parsed)return alert('생년월일을 입력하세요');
  const unknown=document.getElementById('lnk-unknown').checked;
  const t=parseTimeInput(document.getElementById('lnk-time').value);
  const expDays=parseInt(document.getElementById('lnk-expire').value);
  const expAt=expDays?calcExpAt(expDays):0;
  const cust={id:selectedLinkCust?selectedLinkCust.id:Date.now(),name,
    gender:document.getElementById('lnk-gender').value,
    cal:document.getElementById('lnk-cal').value,
    y:parsed.y,mo:parsed.mo,d:parsed.d,h:t.h,mi:t.mi};
  const url=buildReportUrl(cust,expAt,unknown);
  document.getElementById('link-url-text').textContent=url;
  document.getElementById('link-expiry').textContent=fmtExpAt(expAt);
  document.getElementById('link-result').style.display='block';
  // 링크 저장
  const linkObj={id:Date.now(),customerId:selectedLinkCust?selectedLinkCust.id:0,type:'single',url,expAt,createdAt:today(),bCustomerId:null};
  const links=getLinks();links.push(linkObj);saveLinks(links);
}"""

NEW_GENERATE = """function getLinkParams() {
  const name=document.getElementById('lnk-name').value.trim();
  if(!name){alert('이름을 입력하세요');return null;}
  const parsed=parseDateInput(document.getElementById('lnk-date').value);
  if(!parsed){alert('생년월일을 입력하세요');return null;}
  const unknown=document.getElementById('lnk-unknown').checked;
  const t=parseTimeInput(document.getElementById('lnk-time').value);
  const expDays=parseInt(document.getElementById('lnk-expire').value);
  const expAt=expDays?calcExpAt(expDays):0;
  const cust={id:selectedLinkCust?selectedLinkCust.id:Date.now(),name,
    gender:document.getElementById('lnk-gender').value,
    cal:document.getElementById('lnk-cal').value,
    y:parsed.y,mo:parsed.mo,d:parsed.d,h:t.h,mi:t.mi};
  return {cust, expAt, unknown};
}
function previewReport() {
  const p=getLinkParams();if(!p)return;
  // 만료 없이 미리보기 (무제한)
  const url=buildReportUrl(p.cust,0,p.unknown);
  window.open(url,'_blank');
}
function generateReportLink(){
  const p=getLinkParams();if(!p)return;
  const url=buildReportUrl(p.cust,p.expAt,p.unknown);
  document.getElementById('link-url-text').textContent=url;
  document.getElementById('link-expiry').textContent=fmtExpAt(p.expAt);
  document.getElementById('link-result').style.display='block';
  // 링크 저장
  const linkObj={id:Date.now(),customerId:selectedLinkCust?selectedLinkCust.id:0,type:'single',url,expAt:p.expAt,createdAt:today(),bCustomerId:null};
  const links=getLinks();links.push(linkObj);saveLinks(links);
}"""

c2 = content.count(OLD_GENERATE)
print(f"함수 교체: {c2}")
if c2: content = content.replace(OLD_GENERATE, NEW_GENERATE)

with open('/home/node/.openclaw/workspace/sajux_deploy/admin/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ 완료")
