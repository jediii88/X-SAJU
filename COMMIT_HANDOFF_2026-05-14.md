# GitHub 커밋용 작업 기록 (2026-05-14)

나중에 한 번에 커밋할 때 아래 요약과 제안 메시지를 사용하면 됩니다.

## 제안 커밋 메시지 (한 줄)

```
사주X 리포트: report-core 분리, UI/인쇄/TOC, 궁합 더미, 배포·링크 만료 처리
```

## 제안 커밋 본문 (선택)

```
- report/report-core.js: 공통 로직 분리(십성 조사, 세운/대운/월운 문구, 인트로 등)
- report/view.html, report/saju.html: 라이트/다크 변수, @media print, TOC 5부·sticky 하단 네비
- report/compatibility/index.html: 궁합 5페이즈 더미
- deploy_now.py: compatibility 폴더 동기화·업로드
- sajux_deploy/report/*: 배포 산출물 동기화
- tools/sync_report_core.py: report-core 동기화 스크립트(있을 경우)
- X-SAJU_MASTER.html: 마스터 HTML 변경(해당 세션 내용 반영 시)
- 링크: exp 만료 시 만료 안내; n/y 없으면 자동 로드 없이 입력 화면만
```

## 현재 워킹트리에서 다룬 경로 (git status 기준)

| 상태 | 경로 |
|------|------|
| 수정 | `X-SAJU_MASTER.html`, `deploy_now.py`, `report/index.html`, `report/saju.html`, `report/view.html` |
| 수정 | `sajux_deploy/report/index.html`, `sajux_deploy/report/saju.html`, `sajux_deploy/report/view.html` |
| 신규(추적 필요) | `report/report-core.js`, `report/compatibility/` |
| 신규(추적 필요) | `sajux_deploy/report/report-core.js`, `sajux_deploy/report/compatibility/` |
| 신규(추적 필요) | `tools/` (`sync_report_core.py` 등) |

**참고:** `report/report-core.js`는 현재 **untracked**일 수 있으므로 첫 커밋 시 `git add report/report-core.js`를 잊지 말 것.

## 나중에 커밋하는 예시 명령

```bash
cd /Users/ea/.openclaw/workspace
git status
git add X-SAJU_MASTER.html deploy_now.py report/ sajux_deploy/report/ tools/
# 필요 시 제외: git restore --staged <파일>
git commit -m "사주X 리포트: report-core 분리, UI/인쇄/TOC, 궁합 더미, 배포·링크 만료 처리"
git push origin main
```

브랜치명이 `main`이 아니면 원격 브랜치에 맞게 수정합니다.

## 배포

배포는 `python3 deploy_now.py`로 수행; 빌드 번호는 스크립트의 `bump_build_version`으로 갱신됩니다.

## 이 파일 자체

이 `COMMIT_HANDOFF_2026-05-14.md`는 **작업 메모**입니다. 커밋에 포함해도 되고, 커밋 후 삭제해도 됩니다.
