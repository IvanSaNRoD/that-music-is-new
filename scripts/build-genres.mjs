// One-time genre catalog builder (ADR-0003): thesoundsofspotify playlists → config/genres.json.
// Usage: npm run genres:build   (reads SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET from .env.local)
import { writeFileSync } from "node:fs";

const OWNER = "thesoundsofspotify";
const PREFIX = "The Sound of ";
// Owner playlists that use the prefix but are not a genre.
const NOT_GENRES = new Set(["Everything"]);
const PAGE_SIZE = 50;
const DELAY_MS = 1000; // 1 request/second: well under Spotify's rolling 30 s rate limit
const MAX_RETRIES = 3;
const OUT = new URL("../config/genres.json", import.meta.url);

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
  console.error("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET (expected in .env.local).");
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`Token request failed: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

let token = await getToken();

async function getPage(offset) {
  const url = `https://api.spotify.com/v1/users/${OWNER}/playlists?limit=${PAGE_SIZE}&offset=${offset}`;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) return res.json();
    if (res.status === 429) {
      const wait = (Number(res.headers.get("retry-after")) || 5) + 1;
      console.warn(`429 at offset ${offset}: waiting ${wait}s`);
      await sleep(wait * 1000);
      continue; // rate limit waits don't count as failed attempts
    }
    if (res.status === 401) token = await getToken();
    else if (res.status === 403) throw new Error(`403 at offset ${offset}: Spotify may have closed access.`);
    if (attempt >= MAX_RETRIES) throw new Error(`Failed at offset ${offset}: ${res.status} ${await res.text()}`);
    await sleep(2 ** attempt * 1000);
  }
}

const byId = new Map();
let listed = 0;
let notPrefixed = 0;
const otherDropped = []; // dropped names outside the known "The Needle" country series
let empty = 0;
let total = Infinity;

for (let offset = 0, page = 0; offset < total; offset += PAGE_SIZE, page++) {
  const body = await getPage(offset);
  total = body.total;
  for (const p of body.items ?? []) {
    if (!p) continue;
    listed++;
    if (!p.name?.startsWith(PREFIX)) {
      notPrefixed++;
      if (!p.name?.startsWith("The Needle")) otherDropped.push(p.name);
      continue;
    }
    // Feb 2026 API renamed some `tracks` fields to `items`: accept both.
    const count = p.tracks?.total ?? p.items?.total ?? 0;
    if (count === 0) {
      empty++;
      continue;
    }
    const genre = p.name.slice(PREFIX.length).trim();
    if (NOT_GENRES.has(genre)) continue;
    byId.set(p.id, { genre, playlistId: p.id, total: count });
  }
  if (page % 10 === 0) console.log(`offset ${offset}/${total}: kept ${byId.size}`);
  await sleep(DELAY_MS);
}

const genres = [...byId.values()].sort((a, b) => a.genre.localeCompare(b.genre, "en"));
writeFileSync(OUT, "[\n" + genres.map((g) => "  " + JSON.stringify(g)).join(",\n") + "\n]\n");

const names = new Map();
for (const g of genres) names.set(g.genre, (names.get(g.genre) ?? 0) + 1);
const dupes = [...names].filter(([, n]) => n > 1).map(([name]) => name);

console.log(`\nListed ${listed} (API total ${total}) · kept ${genres.length}`);
console.log(
  `Dropped: ${notPrefixed} without "${PREFIX}" prefix, ${empty} empty, ${listed - notPrefixed - empty - genres.length} non-genre or duplicate id`,
);
console.log(`Dropped other than "The Needle": ${otherDropped.join(" | ") || "none"}`);
console.log(`Duplicate genre names: ${dupes.length ? dupes.join(", ") : "none"}`);
console.log("Samples:");
for (let i = 0; i < 5; i++) {
  const g = genres[Math.floor(Math.random() * genres.length)];
  console.log(`  ${g.genre} (${g.total}) https://open.spotify.com/playlist/${g.playlistId}`);
}
console.log(`\nWrote ${OUT.pathname}`);
