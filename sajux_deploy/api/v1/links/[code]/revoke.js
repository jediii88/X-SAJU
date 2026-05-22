const { cors, checkAdmin, revokeLink } = require('../../../_lib/link-store');

module.exports = async function handler(req, res) {
  cors(res, req);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  if (!checkAdmin(req)) return res.status(401).json({ error: 'unauthorized' });

  const code = req.query.code;
  try {
    const ok = await revokeLink(decodeURIComponent(code || ''));
    if (!ok) return res.status(404).json({ error: 'not_found' });
    return res.status(200).json({ ok: true, code });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
};
