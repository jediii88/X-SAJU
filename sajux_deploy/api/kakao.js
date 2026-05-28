/**
 * SAJUX 카카오 챗봇 웹훅 — Vercel Serverless Function
 * URL: https://x-saju.vercel.app/api/kakao (또는 sajux.com/api/kakao)
 *
 * 환경변수 (Vercel Dashboard > 엑스사주 > Settings > Environment Variables):
 *   ANTHROPIC_API_KEY : sk-ant-api03-...
 */

const SYSTEM_PROMPT = `당신은 사주X(SAJUX) 서비스의 CS 상담 AI입니다.
고객이 카카오톡으로 문의하면 친절하고 전문적으로 응대합니다.

[서비스 정보]
- 서비스명: 사주X (sajux.com)
- 소개: 사주팔자 기반 프리미엄 인생 리포트 서비스
- 리포트 내용: 재물운·직업운·애정운·건강운·10년 대운 타임라인·올해 세운 분석

[가격 — 오픈 이벤트 특가]
- 1인 사주 리포트: 정가 49,000원 → 오픈특가 9,900원
- 커플 사주 리포트: 정가 89,000원 → 오픈특가 14,900원
  (구성: 1인 리포트 + 1인 리포트 + 궁합 리포트, 총 3개)

[리포트 전달 방식]
- 개인 전용 링크로 페이지 공유 (30일 후 자동 폐기)
- 리포트 이미지 ZIP 파일 다운로드 가능

[주문 방법]
1. 아래 계좌로 입금
   - 은행: 토스뱅크
   - 계좌번호: 1002-5945-1146
   - 예금주: 지엑스(GX)
   - 입금자명: 이름+사주 (예: 홍길동사주)
2. 입금 후 이 채팅으로 다음 정보 전송:
   - 이름
   - 생년월일 (양력/음력 구분 필수)
   - 태어난 시간 (모르면 "모름" 가능)
   - 성별
   ※ 커플 사주는 두 분 정보 모두 전송해 주세요

[처리 시간]
- 입금 확인 후 24시간 이내 개인 전용 링크 발송

[응대 규칙]
- 친절하고 간결하게 답변 (너무 길지 않게, 300자 이내)
- 사주 용어는 쉽게 풀어서 설명
- 가격 문의 시 오픈특가 강조
- 서비스 범위 외 질문은 정중히 거절
- 이모지 적절히 사용해서 친근하게
- 응답은 반드시 한국어로`;

// 메모리 대화 기록 (Vercel 함수는 stateless라 요청 간 공유 안 됨 — KV 연동 시 개선 가능)
const sessionStore = new Map();

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

  const userRequest = body?.userRequest;
  const userId = userRequest?.user?.id || 'unknown';
  const userMessage = userRequest?.utterance || '';

  if (!userMessage) {
    return res.status(200).json({
      version: '2.0',
      template: { outputs: [{ simpleText: { text: '안녕하세요! 사주X입니다 😊 무엇이든 물어보세요!' } }] }
    });
  }

  // 대화 기록
  const history = sessionStore.get(userId) || [];
  history.push({ role: 'user', content: userMessage });

  // 최근 10턴만 유지
  const trimmed = history.slice(-20);

  let reply;
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다');

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: trimmed,
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      throw new Error('Claude API 오류: ' + errText);
    }

    const data = await claudeRes.json();
    reply = data.content[0].text;

    trimmed.push({ role: 'assistant', content: reply });
    sessionStore.set(userId, trimmed.slice(-20));

  } catch (e) {
    console.error('웹훅 오류:', e.message);
    reply = '잠시 오류가 발생했습니다. 다시 말씀해 주세요 🙏';
  }

  return res.status(200).json({
    version: '2.0',
    template: {
      outputs: [{ simpleText: { text: reply } }]
    }
  });
};
