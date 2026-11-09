# ADR-0003: Randomizer search strategy

- Status: Proposed
- Date: 2026-11-06

## Context
Spotify Search (`GET /v1/search`, Dev Mode 2026):
- `genre` filter supported for `artist` and `track` types.
- `limit` 0–10 (default 5), `offset` 0–1000. Response always includes `total` (even when `items` is empty).
- Source genre list: 6,119 genres (https://www.spudart.org/blog/six-thousand-spotify-genres/, 2024). Many niche genres may return few or 0 results.
- Spotify-owned genre playlists ("The Sound of X") are not usable: blocked for new apps (Nov 2024) and Dev Mode only returns items of the user's own playlists (Feb 2026).

Product requirement (iteration 1): a short list of **10 tracks from 1 random genre**, plus a link to Spotify to keep listening.

Query rule:
- One word → `genre:rock`
- Multiple words → `genre:"acid jazz"`

## Decision
Pure, unit-tested domain functions + a thin service:
1. Pick 1 random genre from `config/genres.ts`.
2. `buildGenreQuery(genre)` → applies the rule above (lowercased, trimmed, quotes escaped).
3. **Optimistic call**: `type=track&limit=10&offset=random(0, 990)`.
4. If `items` is empty → use returned `total`:
   - `total === 0` → discard genre, pick another (max 3 retries, then show empty state).
   - else → second call with `offset=random(0, max(0, min(total, 1000) - 10))`.
5. Deduplicate by track id, shuffle (Fisher–Yates), return up to 10 tracks + the genre.
6. "Listen more on Spotify" link: Spotify search URL for the same query (exact URL format to verify during implementation).
7. Respect `429 Retry-After`.

## Consequences
- + 1 request per Randomizer for large genres, 2 for niche ones, more only for empty genres.
- + Simple UX: "Now playing: Acid Jazz" + 10 tracks + link out.
- − The 10 tracks are contiguous in Spotify's relevance ranking (mitigated by random offset + shuffle).
- Later optimisation: cache `total` per genre (Supabase) → always 1 request and no empty-genre retries.
- Iteration 2: genre blocks / multi-genre mixes; optionally save the list as a playlist in the user's account (`POST /me/playlists`).
- Randomness injected (`random: () => number`) so tests are deterministic.
