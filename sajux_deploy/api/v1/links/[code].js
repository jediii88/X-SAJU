const { cors, loadLink } = require('../../_lib/link-store');

module.exports = async function handler(req, res) {
  cors(res, req);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'method_not_allowed' });

  const code = req.query.code;
  try {
    const result = await loadLink(decodeURIComponent(code || ''));
    if (result.status === 'not_found') return res.status(404).json({ error: 'not_found' });
    if (result.status === 'revoked') return res.status(410).json({ error: 'revoked' });
    if (result.status === 'expired') {
      return res.status(410).json({ error: 'expired', expAt: result.record.expAt });
    }
    const r = result.record;
    return res.status(200).json({
      code: r.code,
      type: r.type,
      payload: r.payload,
      expAt: r.expAt,
      createdAt: r.createdAt,
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
