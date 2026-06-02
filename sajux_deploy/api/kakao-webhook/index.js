/**
 * SAJUX 카카오 챗봇 웹훅 — Cloudflare Worker
 * 카카오 i 오픈빌더 → 이 워커 → Claude API → 카카오 답장
 *
 * 환경변수 (Cloudflare Dashboard > Workers > Settings > Variables):
 *   ANTHROPIC_API_KEY : sk-ant-api03-...
 *   KAKAO_APP_KEY     : 6a169b6806bca080bd86d380
 *   ADMIN_PASS        : 1357642  (관리자 링크 생성용)
 *   PUBLIC_SITE_URL   : https://sajux.com
 */

// ── 시스템 프롬프트 ──────────────────────────────────────────
const SYSTEM_PROMPT = `당신은 사주X(SAJUX) 서비스의 CS 상담 AI입니다.
고객이 카카오톡으로 문의하면 친절하고 전문적으로 응대합니다.

[서비스 정보]
- 서비스명: 사주X (sajux.com)
- 소개: 사주팔자 기반 프리미엄 인생 리포트 서비스
- 리포트 내용: 재물운·직업운·애정운·건강운·10년 대운 타임라인·올해 세운 분석

[가격]
- 1인 리포트: 정가 49,900원 → 오픈특가 19,900원
- 커플 리포트 (2인+궁합): 정가 89,900원 → 오픈특가 24,900원
- 당근 단골 맺기: 1만 원 할인 쿠폰 (인증 후 1인 9,900원 / 커플 14,900원)
- 패밀리 리포트 (3~4인): 개발 중, 신청 불가

[주문 방법]
1. 아래 계좌로 입금
   - 은행: 카카오뱅크
   - 계좌번호: 3333-03-8072022
   - 예금주: 장경현
   - 입금자명: 본명만 (예: 홍길동)
2. 입금 후 이 채팅으로 다음 정보 전송:
   - 이름
   - 생년월일 (양력/음력 구분)
   - 태어난 시간 (모르면 "모름" 가능)
   - 성별

[처리 시간]
- 입금 확인 후 24시간 이내 개인 전용 링크 발송

[응대 규칙]
- 친절하고 간결하게 답변 (너무 길지 않게)
- 사주 용어는 쉽게 풀어서 설명
- 가격 문의 시 오픈특가 강조
- 서비스 범위 외 질문(타 점술, 의료 등)은 정중히 거절
- 이모지 적절히 사용해서 친근하게
- 응답은 반드시 한국어로`;

// ── 대화 기록 저장 (KV 또는 메모리) ─────────────────────────
// Cloudflare KV 없으면 메모리 (Worker 재시작 시 초기화)
const memoryStore = new Map();

async function getHistory(userId, env) {
  try {
    if (env.CHAT_KV) {
      const data = await env.CHAT_KV.get('chat:' + userId, 'json');
      return data || [];
    }
  } catch(e) {}
  return memoryStore.get(userId) || [];
}

async function saveHistory(userId, history, env) {
  // 최근 10턴만 유지
  const trimmed = history.slice(-20);
  try {
    if (env.CHAT_KV) {
      await env.CHAT_KV.put('chat:' + userId, JSON.stringify(trimmed), { expirationTtl: 86400 });
      return;
    }
  } catch(e) {}
  memoryStore.set(userId, trimmed);
}

// ── Claude API 호출 ──────────────────────────────────────────
async function callClaude(messages, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error('Claude API 오류: ' + err);
  }
  const data = await res.json();
  return data.content[0].text;
}

// ── 카카오 응답 포맷 ─────────────────────────────────────────
function kakaoResponse(text) {
  return new Response(JSON.stringify({
    version: '2.0',
    template: {
      outputs: [{
        simpleText: { text }
      }]
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// ── 메인 핸들러 ──────────────────────────────────────────────
export default {
  async fetch(request, env) {
    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch(e) {
      return new Response('Bad Request', { status: 400 });
    }

    // 카카오 요청 파싱
    const userRequest = body?.userRequest;
    const userId = userRequest?.user?.id || 'unknown';
    const userMessage = userRequest?.utterance || '';

    if (!userMessage) {
      return kakaoResponse('메시지를 입력해주세요 😊');
    }

    // 대화 기록 불러오기
    const history = await getHistory(userId, env);

    // 사용자 메시지 추가
    history.push({ role: 'user', content: userMessage });

    // Claude 호출
    let reply;
    try {
      const apiKey = env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error('ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다');
      reply = await callClaude(history, apiKey);
    } catch(e) {
      console.error(e);
      reply = '잠시 오류가 발생했습니다. 다시 말씀해 주세요 🙏';
    }

    // AI 답장 기록 저장
    history.push({ role: 'assistant', content: reply });
    await saveHistory(userId, history, env);

    return kakaoResponse(reply);
  }
};
