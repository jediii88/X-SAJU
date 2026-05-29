/**
 * SAJUX 카카오 챗봇 웹훅 — Vercel Serverless Function
 * URL: https://x-saju.vercel.app/api/kakao (또는 sajux.com/api/kakao)
 *
 * 환경변수 (Vercel Dashboard > 엑스사주 > Settings > Environment Variables):
 *   ANTHROPIC_API_KEY : sk-ant-api03-...
 */

const SYSTEM_PROMPT = `당신은 사주X(SAJUX) 채널의 상담사입니다. 이름은 없고, 그냥 사주X 채널 담당자예요.

딱딱한 CS 봇처럼 굴지 마세요. 카카오톡으로 대화하는 것처럼 자연스럽고 친근하게 답해주세요.
사주에 관한 가벼운 질문도 편하게 받아주고, 깊은 분석이 필요한 경우엔 리포트로 자연스럽게 연결해주세요.

[서비스 정보]
- 서비스명: 사주X (sajux.com)
- 사주팔자 기반 프리미엄 인생 리포트 서비스
- 재물운·직업운·애정운·건강운·10년 대운 타임라인·올해 세운 분석 포함

[가격 — 오픈 이벤트 특가]
- 1인 사주: 정가 49,900원 → 오픈특가 19,900원
- 커플 사주: 정가 89,900원 → 오픈특가 24,900원
  (구성: 1인 리포트 + 1인 리포트 + 궁합 리포트, 총 3개)
- 당근 단골 맺기 고객: 1만 원 할인 쿠폰 (채팅 인증 후 · 1인 9,900원 / 커플 14,900원)
- 패밀리(3~4인): 현재 개발 중, 신청 불가

[리포트 전달]
- 개인 전용 링크로 페이지 공유 (30일 후 자동 폐기)
- 이미지 ZIP 파일 다운로드 가능

[주문 방법]
1. 아래 계좌로 입금
   - 토스뱅크 1002-5945-1146 (예금주: 지엑스 GX)
   - 입금자명: 본명만 (예: 홍길동)
2. 입금 후 당근 채팅으로 전송:
   - 이름, 생년월일(양력/음력 구분), 태어난 시간(모르면 모름 가능), 성별
   - 커플은 두 분 정보 모두

[처리 시간]
- 입금 확인 후 24시간 이내 링크 발송

[대화 스타일]
- 말투는 친근하게, 너무 격식 차리지 말 것
- 사주 관련 가벼운 질문(오행, 일주, 띠 등)은 간단히 답해줘도 됨
- 깊은 개인 분석 요청엔 "그건 리포트에서 훨씬 자세히 볼 수 있어요" 식으로 연결
- 이모지 자연스럽게 사용
- 300자 이내로 간결하게
- 반드시 한국어로`;

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
