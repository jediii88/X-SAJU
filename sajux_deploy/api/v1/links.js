const { cors, checkAdmin, publicUrl, saveLink } = require('../_lib/link-store');

module.exports = async function handler(req, res) {
  cors(res, req);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  if (!checkAdmin(req)) return res.status(401).json({ error: 'unauthorized' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const type = body.type === 'couple' ? 'couple' : 'single';
    if (!body.payload || typeof body.payload !== 'object') {
      return res.status(400).json({ error: 'invalid_payload' });
    }
    const expAt = parseInt(body.expAt, 10) || 0;
    const record = await saveLink(type, body.payload, expAt);
    return res.status(201).json({
      code: record.code,
      type: record.type,
      url: publicUrl(req, record.type, record.code),
      expAt: record.expAt,
    });
  } catch (err) {
    console.error(err);
    const msg = String(err.message || err);
    if (msg.includes('KV') || msg.includes('kv')) {
      return res.status(503).json({ error: 'storage_not_configured' });
    }
    return res.status(500).json({ error: 'server_error', message: msg });
  }
};
