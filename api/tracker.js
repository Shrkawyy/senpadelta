module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  // Restore the endpoint selected by the supplied ONYX reference.
  // The client prepends wss:// when the host has no scheme.
  const deltaServer = {
    id: 0,
    num_players: 0,
    max_players: 200,
    num_spectators: 0,
    count: 'EU - ONYX 404',
    host: 'eu.senpa.io:2001',
    name: 'EU - ONYX 404',
    region: 'EU',
    mode: 'ffa',
    mode_name: 'FFA',
    version: 'ONYX',
  };

  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json([deltaServer]);
};
