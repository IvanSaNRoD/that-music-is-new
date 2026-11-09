// Spike: does Client Credentials allow /v1/search with genre filter (Dev Mode 2026)?
// Usage: node spike-client-credentials.mjs <path-to-.env.local>
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(process.argv[2], "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);
const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = env;
if (!id || !secret) throw new Error("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET");

const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials",
});
console.log("token:", tokenRes.status);
const token = await tokenRes.json();
if (!tokenRes.ok) { console.log(token); process.exit(1); }

const q = (g) => (g.includes(" ") ? `genre:"${g}"` : `genre:${g}`);
for (const [genre, offset] of [["acid jazz", 0], ["acid jazz", 500], ["filmi", 37], ["aberdeen indie", 0], ["rock", 990]]) {
  const url = new URL("https://api.spotify.com/v1/search");
  url.search = new URLSearchParams({ q: q(genre), type: "track", limit: "10", offset: String(offset), market: "ES" });
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token.access_token}` } });
  const body = await res.json();
  const t = body.tracks;
  console.log(`\n[${res.status}] ${q(genre)} offset=${offset} total=${t?.total} items=${t?.items?.length}`);
  if (!res.ok) console.log(JSON.stringify(body));
  t?.items?.slice(0, 3).forEach((i) => console.log("  -", i.name, "—", i.artists.map((a) => a.name).join(", ")));
}
