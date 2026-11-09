import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(process.argv[2], "utf8").split(/\r?\n/).filter(l => l.includes("=")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const tok = (await (await fetch("https://accounts.spotify.com/api/token", { method: "POST", headers: { Authorization: "Basic " + Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials" })).json()).access_token;
const api = async (path, params) => { const r = await fetch(`https://api.spotify.com/v1/${path}` + (params ? "?" + new URLSearchParams(params) : ""), { headers: { Authorization: `Bearer ${tok}` } }); return { status: r.status, body: await r.json() }; };
const genresOf = async id => { const r = await api(`artists/${id}`); return r.status === 200 ? JSON.stringify(r.body.genres) : `ERR ${r.status}`; };

console.log("== A) Artists of tracks returned by genre: track search ==");
for (const q of ['genre:"acid jazz"', 'genre:"trip hop"', "genre:jazz"]) {
  const r = await api("search", { q, type: "track", limit: "4" });
  for (const t of r.body.tracks.items) for (const a of t.artists.slice(0, 1)) console.log(`${q.padEnd(18)} ${a.name.padEnd(28)} genres=${await genresOf(a.id)}`);
}
console.log("\n== B) Artist search with genre: filter ==");
for (const q of ['genre:"acid jazz"', 'genre:"trip hop"']) {
  const r = await api("search", { q, type: "artist", limit: "10" });
  console.log(`${q} total=${r.body.artists?.total}`);
  for (const a of r.body.artists.items) console.log(`   ${a.name.padEnd(28)} genres=${JSON.stringify(a.genres)}`);
}
console.log("\n== C) Canonical artists of those genres ==");
for (const name of ["Jamiroquai", "Incognito", "Brand New Heavies", "Massive Attack", "Portishead", "Tricky"]) {
  const r = await api("search", { q: name, type: "artist", limit: "1" });
  const a = r.body.artists.items[0];
  console.log(`${name.padEnd(20)} -> ${a?.name.padEnd(24)} genres=${await genresOf(a.id)}`);
}
