# -*- coding: utf-8 -*-
from interpreter import Interpreter

def generate_deep_sample():
    # User's Won-guk from the template (Mocked based on reference)
    won_guk = {
        'year': ['戊', '辰'],
        'month': ['乙', '卯'],
        'day': ['丙', '寅'],
        'hour': ['戊', '子']
    }
    
    interp = Interpreter(won_guk)
    
    # Custom Deep Analysis for "Byeong-in (丙寅) Il-ju"
    # Focusing on high-end editorial tone (Museum Curation style)
    
    sample = f"""
[ Axe Engine: Deep Analysis Sample v0.9.0 ]
--------------------------------------------------
### 丙寅 (병인) : 태양을 품은 숲의 불꽃

**[ 01. 본질의 풍경 : Museum Curation ]**
당신의 사주는 '이른 봄날, 울창한 숲 위로 떠오르는 찬란한 태양'의 형상입니다. 
지지의 인목(寅木)은 태양인 병화(丙火)의 강력한 뿌리가 되어주며, 
이는 당신이 가진 지식과 영감이 단순히 일시적인 것이 아니라, 
거대한 뿌리를 둔 '생명력 있는 지혜'임을 상징합니다.

**[ 02. 운명의 알고리즘 : 木-火 통명(通明) ]**
사주 전체에 목(木)과 화(火)의 기운이 조화롭게 흐르고 있습니다. 
이는 현대 사회에서 '콘텐츠의 창조자'이자 '정보의 전달자'로서 최고의 효율을 낼 수 있는 구성입니다. 
하지만, 숲이 너무 무성하면(木多) 빛이 가려지고 공기가 정체될 수 있습니다. 
이때 필요한 것이 바로 **Axe(시스템/金)**의 날카로운 '전지(剪枝)' 작업입니다.

**[ 03. Axe-System의 처방 : '금(金)'의 보완 ]**
당신에게는 방대한 아이디어를 하나로 꿰어 실질적인 수익으로 전환하는 '정교한 시스템'이 필요합니다. 
Axe 엔진은 당신의 180페이지 리포트에서 다음과 같은 구체적 솔루션을 제안할 것입니다:
- **수치화(Digitizing):** 감성적 아이디어를 데이터로 치환하는 법.
- **가지치기(Pruning):** 10개의 프로젝트 중 가장 '돈이 되는' 1개에 집중하는 타이밍.
- **결실의 타이밍:** 2026년 적월(Red Moon) 시점을 기점으로 한 자산의 구조조정 전략.

---
이것은 전체 180페이지 중 단 **0.5%**에 해당하는 요약본입니다. 
Axe 엔진은 이러한 정밀 분석을 120개 이상의 카테고리(신살, 12운성, 대운 결합)로 확장하여, 
한 권의 '운명 경영 지침서'를 완성해 낼 것입니다.
"""
    return sample

if __name__ == "__main__":
    print(generate_deep_sample())
