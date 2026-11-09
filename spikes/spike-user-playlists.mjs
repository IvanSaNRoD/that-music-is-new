import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(process.argv[2], "utf8").split(/\r?\n/).filter(l => l.includes("=")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const tok = (await (await fetch("https://accounts.spotify.com/api/token", { method: "POST", headers: { Authorization: "Basic " + Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials" })).json()).access_token;
const get = async u => { const r = await fetch(u, { headers: { Authorization: `Bearer ${tok}` } }); return { status: r.status, body: await r.json().catch(() => null) }; };
for (const off of [0, 3000]) {
  const r = await get(`https://api.spotify.com/v1/users/thesoundsofspotify/playlists?limit=10&offset=${off}`);
  console.log(`[${r.status}] offset=${off} total=${r.body?.total} items=${r.body?.items?.length} ${r.status !== 200 ? JSON.stringify(r.body?.error) : ""}`);
  r.body?.items?.slice(0, 3).forEach(p => console.log(`   - ${p?.name} ${p?.id}`));
}
const r = await get(`https://api.spotify.com/v1/search?${new URLSearchParams({ q: "The Sound of Trip Hop", type: "playlist", limit: "10" })}`);
console.log(`\nsearch unquoted 'The Sound of Trip Hop' [${r.status}]:`);
r.body?.playlists?.items?.filter(Boolean).forEach(p => console.log(`   - ${p.name} | owner=${p.owner?.id} | ${p.id}`));
