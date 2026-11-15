# How a request flows through the app

> **Human guide.** A step-by-step explanation of what happens when someone uses *That Music Is New*: where each request starts, which file and function run, and what comes back. The technical contract lives in `docs/architecture.md` › API and ADR-0007; this page explains it.
>
> Files marked **(E3)** are built in phase E3; UI hooks switch from placeholder data to these endpoints in E4.

## The cast

| Role | In the code | Where | Think of it as… |
|---|---|---|---|
| The visitor | **Browser** (pages, buttons) | `src/features/*`, `src/app/(site)/*` | The customer in a record shop |
| Our backend | **Route handlers** | `src/app/api/genres/*/route.ts` **(E3)** | The shop assistant at the counter |
| The genre list | **Catalog**: 6,490 genres with their playlist id | `config/genres.json` + `src/server/catalog.ts` **(E3)** | The shop's notebook of records |
| The decision maker | **Randomizer service** | `src/server/randomizer.ts` **(E3)** | The manager |
| The rules | **Domain** (pure functions, no network) | `src/domain/*.ts` **(E3)** | The rulebook: how to pick, how to shuffle |
| The phone line | **Spotify client** | `src/server/spotify/*` (E2) | The one who calls the warehouse |
| The warehouse | **Spotify Web API** | Internet | — |

Golden rule: **the browser never talks to Spotify directly.** Only our server does, so nobody sees the app's Spotify credentials (ADR-0002).

## Step 0 — The server starts (catalog in memory)

The first time a route needs the catalog, `src/server/catalog.ts`:

1. Reads `config/genres.json` (shipped inside the Vercel deployment).
2. Validates it with zod — a broken file fails here, not halfway through a request.
3. Computes each genre's slug with `toSlug()` (`src/domain/slug.ts`): `Acid Jazz` → `acid-jazz`.
4. Keeps two structures in memory:
   - an **array** of the 6,490 entries → random pick by index;
   - a **`Map` slug → entry** → instant lookup.

Cost: ~10 ms once per server instance; every later request reuses it.

## Request 1 — Randomize ("surprise me")

**Starts in the browser.** Randomize button, `Space` or "Roll again" → `useRandomize()` (`src/features/randomizer/use-randomize.ts`).

```
GET /api/genres/random?exclude=trip-hop
```

`exclude` = the genre on screen, so you never get the same one twice in a row (ADR-0006).

**Runs on the server:**

1. `src/app/api/genres/random/route.ts` **(E3)** reads `exclude`.
2. Gets the catalog from `catalog.ts` (already in memory).
3. Calls `pickGenre(catalog, random, exclude)` (`src/domain/pick-genre.ts` **(E3)**), a pure function. `random` is injected: `Math.random` in production, a fixed fake in tests so results are predictable.
4. Responds:

```json
200 { "genre": "Acid Jazz", "slug": "acid-jazz" }
```

with `Cache-Control: no-store` (each roll must be different).

**Spotify calls: 0.** Time: microseconds on the server plus the network round trip.

**Back in the browser:** `router.push("/acid-jazz")`.

## Request 2 — The genre page `/acid-jazz` loads its tracks

**Starts in the browser.** The page `src/app/(site)/[genre]/page.tsx` reads `acid-jazz` from the URL; `useResult()` (`src/features/result/use-result.ts`) asks for the tracks.

```
GET /api/genres/acid-jazz
```

**Runs on the server, step by step:**

1. **Receive.** `src/app/api/genres/[slug]/route.ts` **(E3)** reads `acid-jazz`.
2. **Is it in the catalog?** `catalog.ts` → `bySlug.get("acid-jazz")` (instant).
   - Not found → **404**. Nobody can use our app to fetch arbitrary Spotify playlists.
   - Found → `{ genre: "Acid Jazz", playlistId: "7vyHBfRfPOT8Sxy87P5osJ", total: 172 }`.
3. **Which country?** Reads the `x-vercel-ip-country` header (added by Vercel, e.g. `ES`). Missing (local dev) or invalid → `US`. Spotify uses it to say which tracks can be played there.
4. **The service works.** `getGenreSample(entry, market)` in `src/server/randomizer.ts` **(E3)**:
   1. **Where to start?** `randomOffset(172, 10, random)` (`src/domain/random-offset.ts` **(E3)**) → a number from 0 to 162, e.g. 40, so it's not always the first 10 tracks.
   2. **Call Spotify** with the stored id: `getPlaylistItems({ playlistId, offset: 40, limit: 10, market: "ES" })` (`src/server/spotify/playlists.ts`, E2):
      - `getToken()` (`token.ts`) returns the cached app token (a new one is requested only when it's about to expire).
      - **The only Spotify call:**
        ```
        GET https://api.spotify.com/v1/playlists/7vyHBfRfPOT8Sxy87P5osJ/items?offset=40&limit=10&market=ES
        ```
      - Validates the response with zod (`schemas.ts`) → a list of candidates, some `null`.
   3. **Drop what can't be played.** `filterPlayable(candidates)` (`src/domain/filter-tracks.ts` **(E3)**) removes `null` entries (removed tracks, podcast episodes), local files, tracks not playable in that country, and duplicates (same id).
   4. **Shuffle.** `shuffle(tracks, random)` (`src/domain/shuffle.ts` **(E3)**), Fisher–Yates: every order is equally likely.
   5. **Build the response:**

```json
{
  "genre": "Acid Jazz",
  "slug": "acid-jazz",
  "playlistId": "7vyHBfRfPOT8Sxy87P5osJ",
  "playlistUrl": "https://open.spotify.com/playlist/7vyHBfRfPOT8Sxy87P5osJ",
  "total": 172,
  "tracks": [{ "id": "2emMoKPdgglwuj8f0bDUrx", "title": "Something in My Eye", "artists": "Corduroy" }]
}
```

   Fewer than 10 tracks is normal if some were dropped; 0 → the page shows its "empty" state.

5. **Respond** `200` with `Cache-Control: no-store`.

**Spotify calls: 1.** Time: dominated by Spotify (~200–400 ms, estimate); everything else is microseconds.

## When something goes wrong (request 2)

Errors are raised by the Spotify client (E2) and translated by `toHttpError()` (`src/server/spotify/errors.ts`):

| What happens | Our API answers | What the visitor sees (E4) |
|---|---|---|
| Spotify says `429` (too many requests) | **503** + `Retry-After: 5` | "Busy" state: try again in 5 s |
| Spotify fails, takes > 8 s, or sends something unexpected | **502** | Error state with Retry |
| Spotify credentials missing on the server (our bug) | **500** | Error state |
| Genre not in the catalog | **404** | Not-found page |

No automatic retry on `429` (ADR-0003): if Spotify asks us to slow down, we do.

## Every way into a genre ends in request 2

| Entry | Before request 2 | Spotify calls |
|---|---|---|
| Randomize · Space · Roll again | Request 1 (pick) → navigate | 1 |
| Sleeve → Play (crate) | Navigate to `/{slug}` | 1 |
| History row | Navigate to `/{slug}` | 1 |
| Shared URL or reload | Already on `/{slug}` | 1 |
| Retry after an error | Repeat request 2 | 1 |

## Who may talk to whom (ADR-0005)

```
Browser (features/)  ──fetch──►  app/api/genres/*/route.ts
                                    │
                                    ├─► server/catalog.ts ──► config/genres.json
                                    ├─► server/randomizer.ts
                                    │       ├─► domain/*  (pick, offset, filter, shuffle)
                                    │       └─► server/spotify/* ──► Spotify
                                    └─► server/spotify/errors.ts (toHttpError)
```

- The browser never imports `server/` — lint blocks it.
- `domain/` knows nothing about the network, React or Spotify: data in, data out, so it is easy to test first (TDD).
- `server/` files start with `import "server-only"`: importing them in browser code fails the build.

## Why this design (ADR-0007)

The first API design returned tracks from `/random` too. Once genres got their own pages (ADR-0006), that meant **two Spotify calls per Randomize** (one thrown away). Splitting *pick* (no Spotify) from *load* (one Spotify call) halves the calls, and the same endpoint serves every way of opening a genre.
