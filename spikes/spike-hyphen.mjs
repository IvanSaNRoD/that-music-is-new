import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(process.argv[2], "utf8").split(/\r?\n/).filter(l => l.includes("=")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const tok = await (await fetch("https://accounts.spotify.com/api/token", { method: "POST", headers: { Authorization: "Basic " + Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials" })).json();
const queries = ['genre:"trip hop"', "genre:trip-hop", 'genre:"trip-hop"', "genre:triphop", 'genre:"acid jazz"', "genre:acid-jazz", 'genre:"acid-jazz"', "genre:acidjazz", 'genre:"hip hop"', "genre:hip-hop"];
for (const q of queries) {
  const res = await fetch("https://api.spotify.com/v1/search?" + new URLSearchParams({ q, type: "track", limit: "10", offset: "0" }), { headers: { Authorization: `Bearer ${tok.access_token}` } });
  const t = (await res.json()).tracks;
  console.log(`[${res.status}] ${q.padEnd(20)} total=${t?.total} items=${t?.items?.length}  e.g. ${t?.items?.slice(0, 2).map(i => i.name + " — " + i.artists[0].name).join(" | ") || "-"}`);
}
