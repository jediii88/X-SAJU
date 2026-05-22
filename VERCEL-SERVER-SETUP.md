# 고객 생일 저장 서버 (Vercel) — 주인님용 체크리스트

**목적:** 고객 링크에 생년월일이 안 보이게 (`?code=…` 만 전달)

코딩 없이 **Vercel 화면에서만** 하시면 됩니다.

---

## 1. 코드가 GitHub에 올라가 있어야 함

개발 쪽에서 `sajux_deploy/api` 폴더가 포함된 상태로 push 되어 있어야 합니다.  
(이미 되어 있으면 Vercel이 자동으로 다시 배포합니다.)

---

## 2. 저장소 연결 (생일 보관함)

화면에 **KV** 가 없으면 정상입니다. 아래만 하세요.

1. [vercel.com](https://vercel.com) → 프로젝트 **x-saju**
2. 상단 **Storage** 탭
3. 아래쪽 **Marketplace Database Providers** 에서 **Upstash** 찾기  
   (설명: *Serverless DB · Redis…*)
4. 오른쪽 **Create** 클릭
5. 안내에 따라 Upstash 연결(처음이면 가입·무료 플랜) → 데이터베이스 이름 아무거나 → **Connect to x-saju**

(Vercel이 `UPSTASH_REDIS_*` 변수를 프로젝트에 넣어 줍니다.)

---

## 3. 관리자 비밀번호 등록

1. **Settings** → **Environment Variables**
2. 추가:
   - **Name:** `ADMIN_PASS`
   - **Value:** 관리자 화면 로그인 비밀번호와 **동일**
   - Environment: Production (Preview도 같이 체크해도 됨)
3. **Save**

---

## 4. 다시 배포

1. **Deployments** 탭
2. 맨 위 배포 오른쪽 **⋯** → **Redeploy**

---

## 5. 확인

1. `https://(프로젝트주소).vercel.app/admin/` 로그인
2. **고객용 링크 생성** → 주소에 `?code=b…` 만 있는지 확인
3. 그 링크로 궁합/1인 리포트가 열리는지 확인

---

## 참고

- **미리보기**는 예전처럼 관리자만 (생일이 URL에 있어도 됨)
- **sajux.com** 도메인은 Pages에 남아 있으면, **관리자·고객 링크는 Vercel 주소**로 쓰거나 도메인을 Vercel로 옮겨야 서버와 같은 주소가 됩니다.
