# SAJUX — 노션 고객 입력 폼 설계 가이드

## 노션 DB 구조 (컬럼 목록)

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| 이름 | Text | 고객 이름 |
| 성별 | Select | 남성 / 여성 |
| 생년월일 | Text | 8자리 (예: 19880312) |
| 태어난시간 | Text | 4자리 (예: 0104) / "모름" |
| 달력구분 | Select | 양력 / 음력 |
| 이메일 | Email | 리포트 발송 주소 |
| 상품 | Select | BASIC / DOUBLE / FAMILY |
| 결제상태 | Select | 대기 / 입금확인 / 발송완료 |
| 입금자명 | Text | 계좌이체 입금자 이름 |
| 신청일 | Created time | 자동 생성 |
| 비고 | Text | 특이사항 |

## 2인 이상 (DOUBLE/FAMILY) 추가 컬럼

| 컬럼명 | 타입 |
|--------|------|
| 2번 이름 | Text |
| 2번 성별 | Select |
| 2번 생년월일 | Text |
| 2번 태어난시간 | Text |
| 3번 이름 | Text |
| 3번 성별 | Select |
| 3번 생년월일 | Text |
| 3번 태어난시간 | Text |
| 4번 이름 | Text |
| 4번 성별 | Select |
| 4번 생년월일 | Text |
| 4번 태어난시간 | Text |

## 운영 프로세스

1. 고객이 노션 폼 링크에서 정보 입력
2. DB에 행 자동 생성 (결제상태: 대기)
3. 고객이 계좌이체
4. 주인님이 입금 확인 → 결제상태: 입금확인 으로 변경
5. 주인님이 Discord에서 "OOO 입금됨" 알림
6. AI가 사주 분석 + 이메일 발송
7. 결제상태: 발송완료 업데이트

## 노션 폼 URL 설정 방법

1. 노션에서 새 Database 생성
2. 위 컬럼 구조 설정
3. 오른쪽 상단 Share → "Allow duplicate as template" OFF
4. "Share to web" ON
5. 실제 폼은 Database 우상단 "..." → "Create linked database" 또는
   Notion Forms (서드파티: notionforms.io) 활용 권장

## 향후 자동화 연동 (Phase 2)

- Make.com 시나리오:
  Notion (결제상태 = 입금확인 감지)
  → Node.js 서버 (사주 계산)  
  → Claude API (리포트 생성)
  → Resend/Gmail API (이메일 발송)
  → Notion DB 업데이트 (발송완료)
