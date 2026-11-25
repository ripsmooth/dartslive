import { headers } from '../lib/kisailu.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { SeasonId = 'SEA#sdlsml202627', OrganizationId = 'ORG#937795', TeamType = 'SmLiiga', Active = true } = req.body || {};
  try {
    const upstream = await fetch('https://api.kisailu.net/organization/teams', {
      method: 'POST', headers: headers(),
      body: JSON.stringify({ SeasonId, Search: 'ByType', OrganizationId, TeamType, Active })
    });
    const body = await upstream.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(upstream.status).send(body);
  } catch (e) { return res.status(502).json({ error: 'Kisailu teams request failed', detail: String(e) }); }
}
