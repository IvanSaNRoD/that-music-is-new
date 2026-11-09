import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(process.argv[2], "utf8").split(/\r?\n/).filter(l => l.includes("=")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const tok = (await (await fetch("https://accounts.spotify.com/api/token", { method: "POST", headers: { Authorization: "Basic " + Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials" })).json()).access_token;
for (const [name, id] of [["Filmi", "1uny7o4LNoe7C5qJJ8S1k1"], ["Acid Jazz", "7vyHBfRfPOT8Sxy87P5osJ"], ["Aberdeen Indie", "4JaG749wpqi42yvjyRDvrU"]]) {
  const r = await fetch(`https://api.spotify.com/v1/playlists/${id}/items?limit=10&offset=100`, { headers: { Authorization: `Bearer ${tok}` } });
  const b = await r.json();
  console.log(`\n[${r.status}] ${name} total=${b.total} returned=${b.items?.length} keys=${Object.keys(b.items?.[0] ?? {}).join(",")}`);
  for (const it of (b.items ?? []).slice(0, 3)) { const t = it.item ?? it.track; console.log(`   - ${t ? `${t.name} — ${t.artists?.map(a => a.name).join(", ")} (id=${t.id})` : JSON.stringify(it).slice(0, 150)}`); }
}
