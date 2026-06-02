# 사주X v1.0 — 오픈 직전 정본

**릴리스 일자:** 2026-06-01  
**빌드:** `1780364969`  
**태그:** `v1.0`  
**사이트:** https://sajux.com

> 오픈 직전까지 반영한 **최종 1.0** 스냅샷입니다.

---

## 1인 사주 리포트

- 프리미엄 1:1 상담 톤 (`SAJUX_VOICE`, `voiceModernizeSipseong`, `fortunePolishPlain`)
- 만세력 · 오행/십성 게이지 · 대운·세운·월운
- PDF 저장 (라이트 테마 강제, 카드 단위 레이아웃, 절 단위 페이지 나눔)
- 마지막 인사: **「마지막 인사 · 당신의 빛나는 여정을 위하여」**

## 궁합(커플) 리포트

- 두 사람 원국 만세력 (천간/지지 한글 발음 회색)
- 시너지·케미스트리·성격·재물·위기·가정·운 Mix·대운 싱크 타임라인
- **마지막 순서:** 스토리 → **「마치며 · 함께 걸어갈 두 분에게」** → 💌 공유 CTA
- 공유 CTA 문구: *「…궁합 리포트를 함께 읽으며, 서로를 더 깊이 이해하는 특별한 대화 시간을 가져보세요.」*

## 운영·배포

- 고객 링크 `?code=` 전용, 30일 만료
- 관리자 링크 발급 (1인 / 커플)
- 배포: `python3 deploy_now.py` → GitHub Pages (sajux.com)
- Vercel API: 카카오·링크·render-report

## 복원 방법

```bash
git fetch origin
git checkout v1.0
```

또는 특정 파일만:

```bash
git show v1.0:report/report-core.js
```

## 핵심 경로

| 경로 | 역할 |
|------|------|
| `report/report-core.js` | 리포트 엔진·본문 생성 |
| `report/report-print.css` | 화면/PDF 인쇄 스타일 |
| `couple/index.html` | 궁합 리포트 페이지 |
| `deploy_now.py` | Pages 배포·빌드 번호 bump |
| `sajux_deploy/` | Pages/Vercel 업로드 묶음 |
