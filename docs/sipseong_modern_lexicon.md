# 십성(Ten Gods) 현대적 언어화 사전

사주X 리포트·LLM 텍스트 생성 공통 규칙. 구현: `report/report-core.js` → `SAJUX_SIP_MODERN`, `voiceModernizeSipseong()`, `getSajuxSipseongModernPromptBlock()`.

## 1. 전문 용어 노출 금지 · 1:1 치환

분석은 십성으로 하되, **고객에게 보이는 최종 문장**에 아래 한자명을 직접 쓰지 않습니다.

| 묶음 | 치환 키워드 (현대적 컨설팅) |
|------|---------------------------|
| 비견·겁재 | 주체성, 독립적 실행력, 승부욕, 돌파력 |
| 식신·상관 | 장인정신, 깊은 전문성, 혁신적 기획력, 탁월한 표현력 |
| 편재·정재 | 거시적 안목, 네트워크 확장, 치밀한 디테일, 안정적 데이터 관리 |
| 편관·정관 | 난세의 리더십, 막중한 책임감, 원칙과 신뢰, 시스템 최적화 |
| 편인·정인 | 비판적 직관력, 철학적 통찰, 지적 수용력, 스펀지 같은 흡수력 |

개별 십성 기본 매핑: `SAJUX_SIP_MODERN.individual` (예: 비견→주체성, 정관→원칙과 신뢰).

## 2. 부정적 단어 금지 · 프리미엄 컨설팅 톤

금지 예: 고집이 세다, 돈이 샨다, 구설수, 나약하다, 게으르다.

승화 예:
- 확고한 기준 → 타협에 에너지가 소모될 수 있다
- 과다·고립 → 에너지가 풍부한 쪽으로 읽고, 한 시즌에 한 축만 조율

## 3. LLM 프롬프트 주입

```javascript
// 브라우저 / Node에서 report-core 로드 후
var block = getSajuxSipseongModernPromptBlock();
// 또는
var block = SAJUX_VOICE.sipseongModernPrompt;
// system prompt 앞부분에 block 붙여 넣기
```

## 4. 렌더링 파이프라인

모든 고객 본문은 `voicePolishParagraph` → `voiceModernizeSipseong` → `voiceCustomerLexicon` 순으로 통과합니다.

만세력 표 `sipToManseBadge()`는 기술 표기용으로 비견·식신 등을 유지합니다.
