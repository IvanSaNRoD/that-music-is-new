import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(process.argv[2], "utf8").split(/\r?\n/).filter(l => l.includes("=")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const tok = (await (await fetch("https://accounts.spotify.com/api/token", { method: "POST", headers: { Authorization: "Basic " + Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials" })).json()).access_token;
const api = async (path, params) => { const r = await fetch(`https://api.spotify.com/v1/${path}` + (params ? "?" + new URLSearchParams(params) : ""), { headers: { Authorization: `Bearer ${tok}` } }); let b; try { b = await r.json(); } catch { b = null; } return { status: r.status, body: b }; };
let firstId;
console.log("== 1) Search API: find 'The Sound of X' playlists ==");
for (const g of ["Filmi", "Acid Jazz", "Trip Hop", "Aberdeen Indie"]) {
  const r = await api("search", { q: `"The Sound of ${g}"`, type: "playlist", limit: "5" });
  const hit = r.body?.playlists?.items?.filter(Boolean).find(p => p.name.toLowerCase() === `the sound of ${g}`.toLowerCase());
  console.log(`[${r.status}] ${g.padEnd(16)} -> ${hit ? `${hit.id} owner=${hit.owner?.id} (${hit.owner?.display_name})` : "not found; first: " + (r.body?.playlists?.items?.filter(Boolean)[0]?.name ?? "-")}`);
  if (hit && !firstId) firstId = hit.id;
}
if (firstId) {
  console.log(`\n== 2) Read playlist ${firstId} via API ==`);
  for (const p of [`playlists/${firstId}`, `playlists/${firstId}/items`, `playlists/${firstId}/tracks`]) {
    const r = await api(p, p.endsWith("s") && p.includes("/t") || p.endsWith("items") ? { limit: "3" } : undefined);
    console.log(`[${r.status}] GET ${p}  ${r.status === 200 ? "items/tracks=" + JSON.stringify(r.body.items?.length ?? r.body.tracks?.total ?? r.body.items) : JSON.stringify(r.body?.error)}`);
  }
  console.log(`\n== 3) Embed ==`);
  const e = await fetch(`https://open.spotify.com/embed/playlist/${firstId}`);
  console.log(`[${e.status}] https://open.spotify.com/embed/playlist/${firstId}`);
}
