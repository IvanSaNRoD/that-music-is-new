import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(process.argv[2], "utf8").split(/\r?\n/).filter(l => l.includes("=")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const tok = await (await fetch("https://accounts.spotify.com/api/token", { method: "POST", headers: { Authorization: "Basic " + Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials" })).json();
const q = g => (g.includes(" ") ? `genre:"${g}"` : `genre:${g}`);
for (const genre of ["acid jazz", "trip hop", "bossa nova", "jazz", "flamenco"]) {
  for (const market of ["ES", "US", null]) {
    const p = { q: q(genre), type: "track", limit: "10", offset: "0" };
    if (market) p.market = market;
    const res = await fetch("https://api.spotify.com/v1/search?" + new URLSearchParams(p), { headers: { Authorization: `Bearer ${tok.access_token}` } });
    const t = (await res.json()).tracks;
    console.log(`[${res.status}] ${q(genre).padEnd(20)} market=${String(market).padEnd(4)} total=${t?.total} items=${t?.items?.length}  e.g. ${t?.items?.[0] ? t.items[0].name + " — " + t.items[0].artists[0].name : "-"}`);
  }
}
