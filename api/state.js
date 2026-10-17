const API = 'https://api.github.com';
function config() {
  const repo = process.env.GITHUB_REPOSITORY || '';
  const [owner, name] = repo.split('/');
  return { owner, name, token: process.env.GITHUB_TOKEN, path: (process.env.GITHUB_STATE_PATH || 'data/darts-state.json').replace(/^\/+/, ''), branch: process.env.GITHUB_BRANCH || 'main' };
}
function ghHeaders(token, json=true) {
  return { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(json ? {'Content-Type':'application/json'} : {}) };
}
async function getFile(c) {
  const url = `${API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.name)}/contents/${c.path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(c.branch)}`;
  const r = await fetch(url, { headers: ghHeaders(c.token), cache:'no-store' });
  if (r.status === 404) return { value: null, sha: null };
  if (!r.ok) throw new Error(`GitHub read HTTP ${r.status}: ${(await r.text()).slice(0,300)}`);
  const d = await r.json();
  const raw = Buffer.from(String(d.content || '').replace(/\n/g,''), 'base64').toString('utf8');
  return { value: JSON.parse(raw), sha: d.sha };
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, x-darts-control-token');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  const c = config();
  if (!c.owner || !c.name || !c.token) return res.status(503).json({error:'GitHub-asetukset puuttuvat. Tarkista GITHUB_REPOSITORY ja GITHUB_TOKEN.'});
  if (req.method === 'GET') {
    try { const f = await getFile(c); return res.status(200).json(f.value || {date:'',eventId:'',eventTitle:'',matchId:'auto',updatedAt:null}); }
    catch(e) { return res.status(502).json({error:'GitHub-valinnan lukeminen epäonnistui',detail:String(e.message||e)}); }
  }
  if (req.method !== 'POST') return res.status(405).json({error:'GET or POST only'});
  const expected = process.env.DARTS_CONTROL_TOKEN || '';
  if (!expected || req.headers['x-darts-control-token'] !== expected) return res.status(401).json({error:'Ohjaustunnus puuttuu tai on väärä.'});
  const b = req.body || {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(b.date||'')) || !/^EVE#[A-Za-z0-9_-]+$/.test(String(b.eventId||''))) return res.status(400).json({error:'Päivä tai kilpailun tunniste ei kelpaa.'});
  const state = { date:String(b.date), eventId:String(b.eventId), eventTitle:String(b.eventTitle||''), matchId:String(b.matchId||'auto'), updatedAt:new Date().toISOString() };
  try {
    const old = await getFile(c);
    const url = `${API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.name)}/contents/${c.path.split('/').map(encodeURIComponent).join('/')}`;
    const body = { message:'Update darts live control state', content:Buffer.from(JSON.stringify(state,null,2)+'\n').toString('base64'), branch:c.branch, ...(old.sha?{sha:old.sha}:{}) };
    const r = await fetch(url,{method:'PUT',headers:ghHeaders(c.token),body:JSON.stringify(body)});
    const text = await r.text();
    if (!r.ok) return res.status(502).json({error:`GitHub-tallennus epäonnistui (HTTP ${r.status})`,detail:text.slice(0,400)});
    return res.status(200).json({ok:true,state});
  } catch(e) { return res.status(502).json({error:'GitHub-tallennus epäonnistui',detail:String(e.message||e)}); }
}
