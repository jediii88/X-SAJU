with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'r', encoding='utf-8') as f:
    html = f.read()

old = """function buildRelationLines(pillars) {
    const stems = pillars.map(p => p.h[0]).filter(Boolean);
    const branches = pillars.map(p => p.h[1]).filter(Boolean);
    const lines = [];

    const stemCombine = [['갑','기','갑기합'],['을','경','을경합'],['병','신','병신합'],['정','임','정임합'],['무','계','무계합']];
    stemCombine.forEach(([a,b,label]) => { if (stems.includes(a) && stems.includes(b)) lines.push({type:'천간 합', label, chars:[a,b]}); });

    const branchSix = [['자','축','자축합'],['인','해','인해합'],['묘','술','묘술합'],['진','유','진유합'],['사','신','사신합'],['오','미','오미합']];
    branchSix.forEach(([a,b,label]) => { if (branches.includes(a) && branches.includes(b)) lines.push({type:'지지 합', label, chars:[a,b]}); });

    const branchChung = [['자','오','자오충'],['축','미','축미충'],['인','신','인신충'],['묘','유','묘유충'],['진','술','진술충'],['사','해','사해충']];
    branchChung.forEach(([a,b,label]) => { if (branches.includes(a) && branches.includes(b)) lines.push({type:'지지 충', label, chars:[a,b]}); });

    const branchHyung = [['자','묘','자묘형'],['인','사','인사형'],['사','신','사신형'],['축','술','축술형'],['술','미','술미형']];
    branchHyung.forEach(([a,b,label]) => { if (branches.includes(a) && branches.includes(b)) lines.push({type:'지지 형', label, chars:[a,b]}); });

    if (branches.includes('인') && branches.includes('묘') && branches.includes('진')) lines.push({type:'방합', label:'인묘진 방합', chars:['인','묘','진']});
    if (branches.includes('자') && branches.includes('진')) lines.push({type:'반합', label:'자진 반합', chars:['자','진']});
    
    if (!lines.length) lines.push({type:'없음', label:'특기할 합충형파해 구조 없음', chars:[]});
    return lines;
}"""

new = """function buildRelationLines(pillars) {
    const stems = pillars.map(p => p.h[0]).filter(Boolean);
    const branches = pillars.map(p => p.h[1]).filter(Boolean);
    const lines = [];

    const stemCombine = [['甲','己','갑기합'],['乙','庚','을경합'],['丙','辛','병신합'],['丁','壬','정임합'],['戊','癸','무계합']];
    stemCombine.forEach(([a,b,label]) => { if (stems.includes(a) && stems.includes(b)) lines.push({type:'천간 합', label, chars:[a,b]}); });

    const branchSix = [['子','丑','자축합'],['寅','亥','인해합'],['卯','戌','묘술합'],['辰','酉','진유합'],['巳','申','사신합'],['午','未','오미합']];
    branchSix.forEach(([a,b,label]) => { if (branches.includes(a) && branches.includes(b)) lines.push({type:'지지 합', label, chars:[a,b]}); });

    const branchChung = [['子','午','자오충'],['丑','未','축미충'],['寅','申','인신충'],['卯','酉','묘유충'],['辰','戌','진술충'],['巳','亥','사해충']];
    branchChung.forEach(([a,b,label]) => { if (branches.includes(a) && branches.includes(b)) lines.push({type:'지지 충', label, chars:[a,b]}); });

    const branchHyung = [['子','卯','자묘형'],['寅','巳','인사형'],['巳','申','사신형'],['丑','戌','축술형'],['戌','未','술미형']];
    branchHyung.forEach(([a,b,label]) => { if (branches.includes(a) && branches.includes(b)) lines.push({type:'지지 형', label, chars:[a,b]}); });

    if (branches.includes('寅') && branches.includes('卯') && branches.includes('辰')) lines.push({type:'방합', label:'인묘진 방합', chars:['寅','卯','辰']});
    if (branches.includes('巳') && branches.includes('午') && branches.includes('未')) lines.push({type:'방합', label:'사오미 방합', chars:['巳','午','未']});
    if (branches.includes('申') && branches.includes('酉') && branches.includes('戌')) lines.push({type:'방합', label:'신유술 방합', chars:['申','酉','戌']});
    if (branches.includes('亥') && branches.includes('子') && branches.includes('丑')) lines.push({type:'방합', label:'해자축 방합', chars:['亥','子','丑']});
    if (branches.includes('子') && branches.includes('辰')) lines.push({type:'반합', label:'자진 반합', chars:['子','辰']});
    
    if (!lines.length) lines.push({type:'없음', label:'특기할 합충형파해 구조 없음', chars:[]});
    return lines;
}"""

if old in html:
    html = html.replace(old, new)
    print('buildRelationLines 복원 완료')
else:
    print('패턴 못 찾음')
    # 위치 확인
    idx = html.find('function buildRelationLines')
    print(f'함수 위치: {idx}')
    if idx > 0:
        print(repr(html[idx:idx+300]))

with open('/home/node/.openclaw/workspace/X-SAJU_MASTER.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('저장 완료')
