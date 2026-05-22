/**
 * SAJUX link API — short code resolves to birth payload (server-side only).
 * POST /v1/links (admin) · GET /v1/links/:code · POST /v1/links/:code/revoke (admin)
 */

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

function corsHeaders(env, request) {
  const allowed = String(env.ALLOWED_ORIGINS || 'https://sajux.com')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const origin = request.headers.get('Origin') || '';
  const ok = allowed.includes(origin) || allowed.includes('*');
  return {
    'Access-Control-Allow-Origin': ok ? origin || allowed[0] : allowed[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data, status, extra) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...(extra || {}) },
  });
}

function unauthorized(cors) {
  return json({ error: 'unauthorized' }, 401, cors);
}

function checkAdmin(request, env) {
  const key = env.ADMIN_PASS || env.ADMIN_API_KEY;
  if (!key) return false;
  const auth = request.headers.get('Authorization') || '';
  return auth === 'Bearer ' + key;
}

function generateCode(type) {
  const prefix = type === 'couple' ? 'b' : 'a';
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(14));
  let tail = '';
  for (let i = 0; i < bytes.length; i++) {
    tail += alphabet[bytes[i] % alphabet.length];
  }
  return prefix + tail;
}

function publicUrl(type, code) {
  if (type === 'couple') {
    return 'https://sajux.com/couple/?code=' + encodeURIComponent(code);
  }
  return 'https://sajux.com/report/saju.html?code=' + encodeURIComponent(code);
}

async function insertLink(env, type, payload, expAt) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateCode(type);
    try {
      await env.LINKS_DB.prepare(
        'INSERT INTO links (code, type, payload, exp_at, created_at, revoked) VALUES (?, ?, ?, ?, ?, 0)',
      )
        .bind(code, type, JSON.stringify(payload), expAt || 0, Date.now())
        .run();
      return code;
    } catch (e) {
      if (String(e.message || e).includes('UNIQUE')) continue;
      throw e;
    }
  }
  throw new Error('code_generation_failed');
}

async function getLink(env, code) {
  return env.LINKS_DB.prepare(
    'SELECT code, type, payload, exp_at, created_at, revoked FROM links WHERE code = ?',
  )
    .bind(code)
    .first();
}

function linkStatus(row) {
  if (!row) return 'not_found';
  if (row.revoked) return 'revoked';
  if (row.exp_at && Date.now() > row.exp_at) return 'expired';
  return 'ok';
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(env, request);
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    try {
      if (path === '/v1/links' && request.method === 'POST') {
        if (!checkAdmin(request, env)) return unauthorized(cors);
        const body = await request.json();
        const type = body.type === 'couple' ? 'couple' : 'single';
        if (!body.payload || typeof body.payload !== 'object') {
          return json({ error: 'invalid_payload' }, 400, cors);
        }
        const expAt = parseInt(body.expAt, 10) || 0;
        const code = await insertLink(env, type, body.payload, expAt);
        return json(
          {
            code,
            type,
            url: publicUrl(type, code),
            expAt,
          },
          201,
          cors,
        );
      }

      const getMatch = path.match(/^\/v1\/links\/([^/]+)$/);
      if (getMatch && request.method === 'GET') {
        const code = decodeURIComponent(getMatch[1]);
        const row = await getLink(env, code);
        const st = linkStatus(row);
        if (st === 'not_found') return json({ error: 'not_found' }, 404, cors);
        if (st === 'revoked') return json({ error: 'revoked' }, 410, cors);
        if (st === 'expired') return json({ error: 'expired', expAt: row.exp_at }, 410, cors);
        return json(
          {
            code: row.code,
            type: row.type,
            payload: JSON.parse(row.payload),
            expAt: row.exp_at,
            createdAt: row.created_at,
          },
          200,
          cors,
        );
      }

      const revokeMatch = path.match(/^\/v1\/links\/([^/]+)\/revoke$/);
      if (revokeMatch && request.method === 'POST') {
        if (!checkAdmin(request, env)) return unauthorized(cors);
        const code = decodeURIComponent(revokeMatch[1]);
        const row = await getLink(env, code);
        if (!row) return json({ error: 'not_found' }, 404, cors);
        await env.LINKS_DB.prepare('UPDATE links SET revoked = 1 WHERE code = ?').bind(code).run();
        return json({ ok: true, code }, 200, cors);
      }

      if (path === '/v1/health' && request.method === 'GET') {
        return json({ ok: true, service: 'sajux-link-api' }, 200, cors);
      }

      return json({ error: 'not_found' }, 404, cors);
    } catch (err) {
      console.error(err);
      return json({ error: 'server_error', message: String(err.message || err) }, 500, cors);
    }
  },
};
