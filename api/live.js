export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { eventId, gameIds } = req.body || {};
  if (!eventId || !Array.isArray(gameIds) || !gameIds.length) return res.status(400).json({ error: 'eventId and gameIds required' });
  const headers = {
    'content-type': 'application/json',
    'langcode': 'fi',
    'requestid': String(Date.now()),
    'x-api-key': process.env.KISAILU_API_KEY || '',
    'x-api-validation': process.env.KISAILU_API_VALIDATION || ''
  };
  if (process.env.KISAILU_AUTHORIZATION) headers.authorization = process.env.KISAILU_AUTHORIZATION;
  try {
    const upstream = await fetch('https://api.kisailu.net/game/getall', {
      method: 'POST', headers,
      body: JSON.stringify({ EventId: eventId, NumGames: gameIds.length, GameIds: gameIds })
    });
    const body = await upstream.text();
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(upstream.status).send(body);
  } catch (e) { return res.status(502).json({ error: 'Kisailu API request failed', detail: String(e) }); }
}
