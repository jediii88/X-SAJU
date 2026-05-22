# 고객 링크 저장 (생일 URL 노출 방지)

고객에게는 `?code=b7k2m9…` 만 보이고, 생년월일·시각은 **이 Worker + D1** 에만 있습니다.

## 한 번만 (개발)

```bash
cd api
wrangler login
wrangler d1 create sajux-links
# wrangler.toml 의 database_id 교체
wrangler d1 execute sajux-links --remote --file=./schema.sql
wrangler secret put ADMIN_PASS
# → 관리자 화면 로그인 비밀번호와 동일하게 입력
wrangler deploy
```

배포된 주소(예: `https://sajux-link-api.xxx.workers.dev`)를  
`report/assets/sajux-link-api.js` 의 `SAJUX_LINK_API_BASE` 한 줄에 넣고 `python3 deploy_now.py` 실행.

## 매일 (담당자)

관리자 로그인 → **고객용 링크 생성** → 복사·전송.  
추가 키·API 설정 입력 **없음**. 미리보기는 예전처럼 관리자만.
