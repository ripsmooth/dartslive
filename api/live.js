import { headers } from '../lib/kisailu.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { eventId, gameIds } = req.body || {};
  if (!eventId || !/^EVE#[A-Za-z0-9_-]+$/.test(String(eventId))) return res.status(400).json({ error: 'Valid eventId required' });
  const payload = { Reverse: eventId };
  if (Array.isArray(gameIds) && gameIds.length) {
    payload.NumGames = gameIds.length;
    payload.GameIds = gameIds;
  }
  try {
    const upstream = await fetch('https://api.kisailu.net/game/getall', {
      method: 'POST', headers: headers(), body: JSON.stringify(payload)
    });
    const body = await upstream.text();
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(upstream.status).send(body);
  } catch (e) { return res.status(502).json({ error: 'Kisailu API request failed', detail: String(e) }); }
}
