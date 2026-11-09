# ADR-0003: Randomizer strategy — "The Sound of X" playlists

- Status: Accepted
- Date: 2026-11-09 (supersedes 2026-11-06 version based on `genre:` search)

## Context
Product requirement (iteration 1): a short list of **10 tracks from 1 random genre**, plus a link to Spotify to keep listening.
Goal is discovery: a **door into rare genres**, not up-to-date lists. If a genre is interesting, the user continues exploring on Spotify.

Spike (2026-11-09, Client Credentials, Dev Mode; base script `spikes/spike-client-credentials.mjs`):

`genre:` search filter (`GET /v1/search?type=track`) — **rejected, insufficient quality**:
- Multi-word genres return almost nothing: `genre:"acid jazz"` → 4 tracks, `genre:"trip hop"` → 1 (wrong genre). Not caused by `market` nor spelling (`trip-hop`, `"trip-hop"` → same).
- Single-word genres are loose: `genre:jazz` includes artists with `genres: []` (Laufey) or only a related genre (Jamiroquai → `["acid jazz"]`).
- Artist genre data itself is fine (Massive Attack → `["trip hop","downtempo"]`), yet `type=artist` + `genre:"trip hop"` → `total=0`.
- `total` is not the real count: grows with `offset` (100 at offset 0, 1000 at offset 990). Matches community reports.

"The Sound of X" playlists (owner `thesoundsofspotify`, created by Every Noise at Once) — **works**:
- `GET /v1/users/thesoundsofspotify/playlists` → 200, `total=7085`, paginable.
- `GET /v1/playlists/{id}/items?limit=10&offset=100` → 200 with full track objects (Filmi 768, Acid Jazz 172, Aberdeen Indie 174 tracks). Tracks are representative of the genre.
- Not affected by the Nov 2024 block (applies to playlists owned by `spotify`, not `thesoundsofspotify`).
- Embed `https://open.spotify.com/embed/playlist/{id}` → 200 (compatible with ADR-0001).
- Search by name is unreliable (`"The Sound of Trip Hop"` quoted → not found, unquoted → found) → don't rely on runtime search.
- everynoise.com is down (522) → not a usable source.

## Decision
1. **Genre catalog built offline**: one-time script paginates `GET /users/thesoundsofspotify/playlists`, keeps names starting with `The Sound of `, writes `config/genres.json` → `{ genre, playlistId, total }[]`. Committed to the repo; regenerated manually if ever needed.
2. **Randomizer** (pure domain functions + thin service, randomness injected `random: () => number` for deterministic tests):
   1. Pick 1 random entry from the catalog.
   2. One call: `GET /v1/playlists/{id}/items?limit=10&offset=random(0, max(0, total - 10))`.
   3. Drop null/local/unavailable items, dedupe by track id, shuffle (Fisher–Yates), return up to 10 tracks + genre.
3. **"Listen more on Spotify"** link → the playlist URL (`https://open.spotify.com/playlist/{id}`).
4. Respect `429 Retry-After`. Client Credentials token is enough (no user login needed for the Randomizer).

## Consequences
- + 1 request per Randomizer, no retries, real `total` known upfront.
- + Curated, genre-representative tracks across ~7,000 genres, including very niche ones.
- + Link out to a full genre playlist: natural next step for the user.
- − Playlists are no longer maintained (frozen snapshot; Every Noise's author left Spotify end of 2023 — not verified). Accepted: freshness is not a goal.
- − Some tracks may become unavailable over time → filtered in step 2.3; a list may have < 10 tracks.
- − Depends on Spotify keeping these playlists public and readable via API. If access is lost, a new source must be found (no fallback in iteration 1; `genre:` search is not an acceptable fallback).
- Iteration 2: genre blocks / multi-genre mixes; optionally save the list as a playlist in the user's account (`POST /me/playlists`).
