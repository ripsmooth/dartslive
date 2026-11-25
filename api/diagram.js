import { headers } from '../lib/kisailu.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const eventId = String(req.body?.eventId || '');
  if (!/^EVE#[A-Za-z0-9_-]+$/.test(eventId)) {
    return res.status(400).json({ error: 'Valid eventId required' });
  }

  // Sama payload-muoto kuin Kisailun ottelupäivän getall-pyynnössä.
  const payload = {
    EventId: eventId,
    Now: Date.now(),
    Delta: false
  };

  try {
    const upstream = await fetch('https://api.kisailu.net/game/getall', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
      cache: 'no-store'
    });
    const body = await upstream.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(upstream.status).send(body);
  } catch (e) {
    return res.status(502).json({
      error: 'Kisailu game/getall request failed',
      detail: String(e.message || e)
    });
  }
}
