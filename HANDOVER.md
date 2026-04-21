# HANDOVER.md — 하이쿠(Haiku) 인수인계 문서
> 작성일: 2026-04-21 | 작성: Sonnet → Haiku 전환 시점

---

## 🎯 프로젝트 한 줄 요약
**SAJUX** — 사주 분석 서비스. 고객이 생년월일 입력 → 자동으로 사주 리포트 생성 → PDF 출력.

---

## 📁 핵심 파일

| 파일 | 설명 |
|------|------|
| `X-SAJU_MASTER.html` | **메인 파일** (~6,100줄). 여기만 수정하면 됨 |
| `deploy_now.py` | GitHub API로 배포 (`python3 deploy_now.py`) |
| `automated_qa.js` | QA 테스트 (`node automated_qa.js`) — 5/5 PASS 필수 |
| `sajux_landing.html` | 랜딩페이지 |
| `backups/` | 백업 폴더 |

---

## 🔒 절대 원칙 (어기면 안 됨)

1. **수정 전 반드시 백업**: `cp X-SAJU_MASTER.html backups/backup_$(date +%Y%m%d_%H%M).html`
2. **`write` 툴로 전체 파일 덮어쓰기 절대 금지** → `edit` 툴로 부분 교체만
3. **배포 전 QA 통과 필수**: `node automated_qa.js` → 5/5 PASS 확인 후 `python3 deploy_now.py`
4. **한자 단독 사용 금지** — 한글만 표기 (JS 연산용 키 제외)
5. **천간/지지 단어 고객 화면 노출 금지**
6. **"Axe" 브랜드명 고객 화면 노출 금지**

---

## 🌐 배포 정보

- **라이브 URL**: `https://sajux.com` (GitHub Pages)
- **GitHub 레포**: `jediii88/X-SAJU` (public), branch: `main`
- **GitHub 토큰**: `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`
- **배포 대상 파일**: `sajux_deploy/index.html` → GitHub `index.html`
- **배포 명령**: `python3 /home/node/.openclaw/workspace/deploy_now.py`

---

## ✅ 현재 상태 (2026-04-21 기준)

### 완료된 것
- 사주 계산 엔진 (5/5 QA PASS)
- 60갑자 이미지 (`zodiac_en/`)
- 리포트 챕터 1~9 + 대운/세운/월운 루프
- 대운 카드에 연도 표시 (예: "39세 구간 2026~2035년")
- 세운 카드 천간/지지 교과서 설명 제거
- `y1 before initialization` 버그 수정

### 미완료 (다음 작업)
- LIFE_MAP 원국 종합 통변 텍스트 확장 (metal/water 2개 오행 미완)
- CH4 재물운 (2,148자 → 5,000자+ 목표)
- CH5 직업운 (2,500자 → 5,000자+ 목표)
- CH6 애정운 (2,000자 → 5,000자+ 목표)
- CH9 개운법 (820자 → 3,000자+ 목표)
- 세운 챕터 내 `세운 활용 핵심 전략` 박스의 "세운 초반에는 천간의 에너지가..." 잔재 제거

---

## 🛠️ 수정 방법 (반드시 이 순서로)

```
1. grep -n "찾을텍스트" X-SAJU_MASTER.html  ← 위치 확인
2. sed -n '줄번호p' X-SAJU_MASTER.html      ← 정확한 텍스트 확인
3. edit 툴로 oldText → newText 교체         ← 수정
4. node automated_qa.js                     ← QA 확인
5. python3 deploy_now.py                    ← 배포
```

---

## 📐 HTML 구조 핵심

```
X-SAJU_MASTER.html
├── window.SAJU_DB (line ~1319)     ← 60일주 DB
├── window.SHINSAL_DESC (line ~54)  ← 신살 DB
├── buildChapter1_Basic()           ← LIFE_MAP 원국 통변
├── buildChapter2~9()               ← 각 챕터
├── buildDaewunLoop()               ← 대운 루프
├── buildSewunLoop()                ← 세운 루프
├── buildWolunLoop()                ← 월운 루프
└── generateDeepReport()            ← 전체 조립
```

---

## 💰 비즈니스 정보

- **서비스명**: SAJUX (sajux.com)
- **가격**: 1인 9,900원 / 커플 19,900원 / 패밀리 29,900원 (할인가)
- **결제**: 무통장 입금 (Phase 1)
- **미완료**: Notion 폼 URL, 이메일 계정, 계좌번호 입력 필요

---

## ⚠️ 주의사항

- 파일이 ~6,100줄이라 전체 읽기 시 분할 필요 (offset/limit 사용)
- Python 스크립트로 교체 시 `content.count(old)` 로 반드시 개수 확인 후 진행
- `PERIOD_NARRATIVE`는 `window.PERIOD_NARRATIVE`로만 참조 (선언 없음 → 폴백 처리됨)
- `globalSajuData.birthYear`로 출생년도 접근
