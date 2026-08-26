module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  // Keep the client limited to the requested Delta EU FFA server.
  // Delta exposes this server as a WebSocket endpoint; the client prepends
  // wss:// when it receives a host without a scheme.
  const deltaServer = {
    id: 0,
    num_players: 0,
    max_players: 200,
    num_spectators: 0,
    count: 'Delta EU FFA',
    host: 'eu.senpa.io:2001',
    name: 'Delta FFA 2',
    region: 'EU',
    mode: 'ffa',
    mode_name: 'Free For All',
    version: 'Delta',
  };

  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json([deltaServer]);
};
