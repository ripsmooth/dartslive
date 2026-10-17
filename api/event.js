import { headers } from '../lib/kisailu.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });
  const id = String(req.query?.id || '');
  if (!/^EVE#[A-Za-z0-9_-]+$/.test(id)) return res.status(400).json({ error: 'Valid event id required' });
  try {
    const upstream = await fetch('https://api.kisailu.net/event/' + encodeURIComponent(id.replace(/^EVE#/, '')), { headers: headers() });
    const body = await upstream.text();
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(upstream.status).send(body);
  } catch (e) { return res.status(502).json({ error: 'Kisailu event request failed', detail: String(e) }); }
}
