module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  // Delta EU Dual server (fast multi-bot respawn like Dual mode).
  // Client prepends wss:// when host has no scheme.
  const deltaServer = {
    id: 0,
    num_players: 0,
    max_players: 200,
    num_spectators: 0,
    count: 'Delta Dual EU',
    host: 'ffa.delt.io',
    name: 'Delta Dual EU',
    region: 'EU',
    mode: 'dual',
    mode_name: 'Dual',
    version: 'Delta',
  };

  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json([deltaServer]);
};
