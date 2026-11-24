import { headers } from '../lib/kisailu.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { Start, End } = req.body || {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(Start || '') || !/^\d{4}-\d{2}-\d{2}$/.test(End || '')) {
    return res.status(400).json({ error: 'Start and End must be YYYY-MM-DD' });
  }
  try {
    const upstream = await fetch('https://api.kisailu.net/event/all', {
      method: 'POST', headers: headers(),
      body: JSON.stringify({ Start, End, Forward: true, AllCollectionDates: true })
    });
    const body = await upstream.text();
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(upstream.status).send(body);
  } catch (e) { return res.status(502).json({ error: 'Kisailu event list request failed', detail: String(e) }); }
}
