import { headers } from '../lib/kisailu.js';
const allowed = new Set(['game/getscore','game/getmatch','game/getall']);
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  if(req.method==='OPTIONS') return res.status(204).end();
  if(req.method!=='POST') return res.status(405).json({error:'POST only'});
  const endpoint=String(req.body?.endpoint||'');
  const payload=req.body?.payload;
  if(!allowed.has(endpoint)) return res.status(400).json({error:'Endpoint not allowed'});
  if(!payload || typeof payload!=='object' || Array.isArray(payload)) return res.status(400).json({error:'payload must be a JSON object'});
  const started=Date.now();
  try {
    const upstream=await fetch('https://api.kisailu.net/'+endpoint,{method:'POST',headers:headers(),body:JSON.stringify(payload),cache:'no-store'});
    const text=await upstream.text();
    let parsed; try{parsed=JSON.parse(text)}catch{parsed={raw:text}}
    return res.status(upstream.status).json({endpoint,status:upstream.status,elapsedMs:Date.now()-started,receivedAt:new Date().toISOString(),data:parsed});
  } catch(e) { return res.status(502).json({endpoint,status:0,elapsedMs:Date.now()-started,error:String(e.message||e)}); }
}
