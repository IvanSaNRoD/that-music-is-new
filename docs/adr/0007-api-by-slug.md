# ADR-0007: Genre API keyed by slug; Randomize only picks

- Status: Accepted
- Date: 2026-11-16
- Related: ADR-0003 (Randomizer strategy), ADR-0006 (routing at `/{slug}`), `docs/architecture.md` › API

## Context
- The API was designed (2026-11-09) for a single-screen app: `GET /api/genres/random` returned a genre **and** its tracks; `GET /api/genres/{playlistId}` served history clicks.
- ADR-0006 (2026-11-13) moved each genre to its own page `/{slug}` and left open how the API maps slug → playlistId (consequence 1).
- With the old API, Randomize would call Spotify twice: once in `/random` (tracks thrown away) and again when `/{slug}` loads. The browser only knows the slug from the URL; the catalog (slug → playlistId) is server-only (519 KB).
- The real catalog (E1) has 6,490 genres and **no slug collisions** (checked 2026-11-16), so the slug is a unique key.

## Decision
1. **`GET /api/genres/random?exclude={slug}`** → `{ genre, slug }`. Picks from the catalog only, **no Spotify call**. `exclude` = genre on screen (ADR-0006: Randomize goes to a genre ≠ current). The client then navigates to `/{slug}`.
2. **`GET /api/genres/{slug}`** → `GenreResult` (genre, slug, playlistId, playlistUrl, total, ≤ 10 tracks). Server maps slug → catalog entry, then makes **one** Spotify call with the stored `playlistId` (ADR-0003). Unknown slug → `404` (still no open proxy to Spotify).
3. Every entry point (Randomize, sleeve Play, History, shared URL / reload, retry) ends in request 2 → exactly **one Spotify call per genre view**.
4. History stores the slug (`{ genre, slug, discoveredAt }`), the same key as the URL and the API.
5. Both responses `Cache-Control: no-store`; market from `x-vercel-ip-country` (fallback `US`).

## Consequences
- + Half the Spotify calls per Randomize vs. the old design → lower `429` risk and latency.
- + One endpoint for all ways of opening a genre; reload and shared URLs work the same.
- + The browser never needs the catalog or Spotify ids to navigate.
- − Two round trips to our server for Randomize (pick, then load). The pick is in-memory (µs), so the cost is one extra network hop.
- − Slugs become a public contract: renaming a genre or changing `toSlug` breaks bookmarks and saved history. Accepted (frozen catalog, ADR-0003); a future catalog rebuild must check slug uniqueness and stability.
- Supersedes the API table in the original `architecture.md` and resolves ADR-0006 consequence 1. Human walkthrough: `docs/guides/request-flow.md`.
