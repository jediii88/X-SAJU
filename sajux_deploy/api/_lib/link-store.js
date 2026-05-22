const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();

function cors(res, req) {
  const origin = (req && req.headers && req.headers.origin) || '';
  const allowed = [
    'https://sajux.com',
    'http://127.0.0.1:8080',
    'http://localhost:8080',
  ];
  let allow = allowed.includes(origin);
  if (!allow && /\.vercel\.app$/i.test(origin)) allow = true;
  res.setHeader('Access-Control-Allow-Origin', allow ? origin : 'https://sajux.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
}

function checkAdmin(req) {
  const pass = process.env.ADMIN_PASS;
  if (!pass) return false;
  const auth = req.headers.authorization || '';
  return auth === 'Bearer ' + pass;
}

function generateCode(type) {
  const prefix = type === 'couple' ? 'b' : 'a';
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let tail = '';
  for (let i = 0; i < 14; i++) {
    tail += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return prefix + tail;
}

function publicUrl(req, type, code) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const base = proto + '://' + host;
  if (type === 'couple') {
    return base + '/couple/?code=' + encodeURIComponent(code);
  }
  return base + '/report/saju.html?code=' + encodeURIComponent(code);
}

async function saveLink(type, payload, expAt) {
  for (let i = 0; i < 8; i++) {
    const code = generateCode(type);
    const record = {
      code,
      type,
      payload,
      expAt: expAt || 0,
      createdAt: Date.now(),
      revoked: false,
    };
    const key = 'link:' + code;
    const exists = await redis.get(key);
    if (exists) continue;
    await redis.set(key, record);
    return record;
  }
  throw new Error('code_generation_failed');
}

async function loadLink(code) {
  const record = await redis.get('link:' + code);
  if (!record) return { status: 'not_found' };
  if (record.revoked) return { status: 'revoked', record };
  if (record.expAt && Date.now() > record.expAt) return { status: 'expired', record };
  return { status: 'ok', record };
}

async function revokeLink(code) {
  const key = 'link:' + code;
  const record = await redis.get(key);
  if (!record) return false;
  record.revoked = true;
  await redis.set(key, record);
  return true;
}

module.exports = { cors, checkAdmin, publicUrl, saveLink, loadLink, revokeLink };
