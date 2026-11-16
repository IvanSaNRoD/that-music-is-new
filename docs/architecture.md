# Architecture — iteration 1

Related: PRD (`docs/prd.md`), ADR-0001…0007. Human walkthrough of each request: `docs/guides/request-flow.md`.

## Components

```mermaid
flowchart LR
  subgraph Browser
    UI["Pages / and /{slug}<br/>Randomize · crate · result · History"]
    LS[("localStorage<br/>genre history")]
    EMB["Spotify Embed<br/>(iframe, 1 player)"]
  end
  subgraph Next["Next.js server (Vercel)"]
    API["Route handlers<br/>/api/genres/*"]
    SVC["Randomizer service"]
    DOM["Domain (pure)<br/>pick · offset · filter · shuffle"]
    CAT[("config/genres.json<br/>6,490 genres")]
    SP["Spotify client<br/>(server-only, token cache)"]
  end
  SAPI["Spotify Web API"]
  SACC["accounts.spotify.com"]

  UI -- fetch --> API --> SVC
  SVC --> DOM
  SVC --> CAT
  SVC --> SP
  SP -- "playlist items" --> SAPI
  SP -- "client credentials" --> SACC
  UI <--> LS
  UI -- "track id" --> EMB
```

- **Browser** never sees Spotify credentials or tokens (ADR-0002). It only calls our own API.
- **Domain** is pure TypeScript with injected randomness → unit-tested without mocks.
- **Spotify client** is the only code that talks to Spotify; responses validated with zod.
- **Catalog** is a static JSON generated offline (ADR-0003), read only on the server.

## Routes (ADR-0006)

| URL | Page | Notes |
|---|---|---|
| `/` | Home: Hero + crate + History column + steps band | Row via `PageRow` (`components/layout`) |
| `/{slug}` | Genre page: turntable, tracks, player, "Your finds" trail, loading/error/empty | `slug` from `domain/slug.ts` (`R&B` → `r-and-b`); unknown → 404 |

Entry points: Randomize/Space/Roll again → random `/{slug}`; sleeve Play → that genre; History row → that genre. **Only crate actions change the crate.** Crate + History state live in layout providers, so they persist across navigation.

## API (ADR-0007)

| Endpoint | Purpose | Spotify calls |
|---|---|---|
| `GET /api/genres/random?exclude={slug}` | Pick a random catalog genre ≠ `exclude` (Randomize · Space · Roll again). Returns `{ genre, slug }`; the client navigates to `/{slug}`. | 0 |
| `GET /api/genres/crate` | 8 random genres for the home crate; Restock calls it again. Returns `{ genre, slug }[]`. | 0 |
| `GET /api/genres/{slug}` | Genre + up to 10 tracks, for every way of opening a genre (after Randomize, sleeve Play, History, shared URL/reload, retry). `slug` must exist in the catalog, otherwise `404` (no open proxy to Spotify). | 1 |

Both are dynamic and send `Cache-Control: no-store` (results are random). `{slug}` returns:

```ts
type GenreResult = {
  genre: string;          // "Acid Jazz"
  slug: string;           // "acid-jazz"
  playlistId: string;
  playlistUrl: string;    // https://open.spotify.com/playlist/{id}
  total: number;          // tracks in the playlist (genre context)
  tracks: { id: string; title: string; artists: string }[]; // ≤ 10, domain Track
};
```

Errors (`server/spotify/errors.ts` › `toHttpError`): Spotify `429` → `503` + `Retry-After`; other Spotify/network/timeout/shape errors → `502`; anything else (e.g. missing credentials) → `500`; unknown slug → `404`. The UI shows busy/error states with retry.

Market: Spotify only reports `is_playable` when the request has `market`. Users are anonymous, so `/{slug}` passes the visitor's country from Vercel's `x-vercel-ip-country` header (fallback `US`); unplayable tracks are filtered out for that country.

## Randomizer flow

```mermaid
sequenceDiagram
  actor U as User
  participant UI as Browser
  participant R as /api/genres/random
  participant G as /api/genres/{slug}
  participant C as Catalog (memory)
  participant D as Domain
  participant S as Spotify client
  participant SP as Spotify API

  U->>UI: Randomize / Space / Roll again
  UI->>R: GET ?exclude=current
  R->>C: catalog
  R->>D: pickGenre(catalog, random, exclude)
  R-->>UI: { genre, slug }
  UI->>UI: navigate to /{slug}
  UI->>G: GET
  G->>C: bySlug(slug) (404 if missing)
  G->>D: randomOffset(total, 10, random)
  G->>S: getPlaylistItems(playlistId, offset, 10, market)
  S->>S: token cached? else client credentials
  S->>SP: GET /playlists/{id}/items?limit=10&offset=n&market=XX
  SP-->>S: items
  S-->>G: candidates (zod-validated)
  G->>D: filterPlayable (+ dedupe) → shuffle
  G-->>UI: GenreResult
  U->>UI: play a track
  UI->>UI: load track in Embed + add genre to History (localStorage)
```

Sleeve Play, History row, shared URL/reload and retry skip the first request: they go straight to `/{slug}`.

## Client state
- `useGenreHistory()` hook (`features/history`): `{ id: slug, name, date: "YYYY-MM-DD" }[]` under `localStorage` key `tmin:history`, most recent first, max 5. Read once per page load with `useSyncExternalStore` (server/hydration render = empty, so markup matches; `loaded` tells "not read yet" from "empty"), re-read when another tab changes it. Validated on read by `parseHistory` (`domain/history.ts`, zod): invalid entries dropped one by one, corrupt JSON → empty list. Without `localStorage` it keeps working in memory (not persisted). Actions: add (dedupe by `slug`, ADR-0007), remove one (with undo), clear all.
- Current result and selected track: React state on the page. No state library.

## Folder structure

Layer-based backbone (routes · pure domain · server-only) with the UI organised by feature — see **ADR-0005**. Next.js strategy: *"store project files outside of `app`"* (`node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`).

```
config/genres.json            # generated catalog (committed)
scripts/build-genres.mjs      # one-time: thesoundsofspotify → genres.json
src/
  app/                        # routing only (Next special files)
    layout.tsx  globals.css   # root layout: html, fonts, design tokens, site metadata (title template, OG/Twitter base, metadataBase)
    global-error.tsx          # last resort if the root layout fails (own <html>, fonts, styles)
    icon.svg  apple-icon.tsx  # brand vinyl favicon + 180px touch icon (drawn by server/og.tsx)
    opengraph-image.tsx       # site share card (server/og.tsx)
    robots.ts  sitemap.ts     # robots (no /api/) + sitemap: home + every genre from the catalog
    (site)/layout.tsx         # shared shell: header, crate + history providers, decorative vinyl (ADR-0006)
    (site)/page.tsx           # / → features/home (Hero + crate)
    (site)/[genre]/page.tsx   # /{slug} → features/result; unknown slug → not-found; generateMetadata (title, canonical, OG)
    (site)/[genre]/opengraph-image.tsx  # per-genre share card: name + sleeve in its tone (server/og.tsx)
    (site)/[genre]/[...rest]/page.tsx   # deeper URLs (/a/b) → the site's own 404 (instead of experimental global-not-found)
    (site)/not-found.tsx
    (site)/error.tsx          # 500 inside the site layout: "The needle skipped" + Try again (retry)
    api/genres/crate/route.ts
    api/genres/random/route.ts
    api/genres/[slug]/route.ts
  features/                   # UI + client state, one folder per feature
    home/                     # HomeView (Hero + crate), HowItWorks
    crate/                    # CrateFlip, CrateProvider, tones, useCrate
    randomizer/               # useRandomize (→ /{random slug}), RandomizeShortcut (Space)
    result/                   # ResultView = GenreResult · TrackList · PlayerSlot (TrackPlayer) · notices, useResult
    history/                  # HistoryPanel, HistoryColumn (home), RecentFinds (genre page), HistoryProvider, useGenreHistory
  components/                 # shared, feature-agnostic
    ui/                       # shadcn/ui primitives
    brand/                    # Vinyl, Sparkle
    layout/                   # SiteHeader
  domain/                     # pure, unit-tested (TDD) — no React, no I/O
    slug.ts  pick-genre.ts  random-offset.ts  filter-tracks.ts  shuffle.ts  tone.ts  history.ts  (+ types: genre, track)
  server/                     # server-only
    catalog.ts                # loads/validates genres.json once: array (random pick) + Map slug → entry
    randomizer.ts             # service: domain + catalog + spotify
    og.tsx  og-fonts/         # next/og images (OG cards, apple-icon); static TTFs (Inter Tight 800, Space Mono 400, SIL OFL) — Satori can't use next/font or CSS variables
    spotify/ token.ts  playlists.ts  schemas.ts  errors.ts   # errors.ts: SpotifyError + toHttpError (429 → 503, other → 502)
  mocks/                      # design-phase placeholder data; empty and removed since E5 (2026-11-16), recreate only for new design work
  lib/                        # tiny shared helpers (fonts.ts: next/font for layout + global-error; site.ts: SITE_NAME, siteUrl, OG base)
tests/e2e/                    # Playwright: desktop + touch phone (Pixel 7); fixtures.ts, fake-spotify.ts
tests/api/                    # route handlers called directly (Spotify via MSW); tests/fixtures/catalog.ts = test catalog
tests/msw/                    # MSW server + Spotify handlers for unit tests
# Unit/component tests sit next to their file: src/**/<name>.test.ts(x) (Vitest + Testing Library, jsdom).
# Async Server Components are covered by e2e only (Vitest can't render them).
# e2e never calls real Spotify (decided 2026-11-16, E4), 3 layers:
#   1. tests/api (Vitest): routes + Spotify client against MSW.
#   2. UI specs mock OUR API from the browser (page.route helpers in tests/e2e/fixtures.ts): states, deterministic.
#   3. Full stack: Playwright starts tests/e2e/fake-spotify.ts (port 4010) and Next with SPOTIFY_ACCOUNTS_URL /
#      SPOTIFY_API_URL pointing at it (read per request in server/spotify). Next's experimental testmode rejected
#      (undocumented; its MSW glue breaks on MSW 3).
#   open.spotify.com is blocked in every e2e; its iFrame API script is replaced by a fake that loads /embed/track/{id}.
# Logic tests use tests/fixtures/catalog.ts; only server/catalog.test.ts reads the real genres.json (invariants).
```

Import rules (ADR-0005): features use each other only through `features/<name>/index.ts`; `domain/` imports nothing from React/UI/server; `server/` is never imported by client code.

## Genre catalog script
- Run manually (`npm run genres:build`, i.e. `node --env-file=.env.local scripts/build-genres.mjs`); not part of the build.
- Paginates `GET /users/thesoundsofspotify/playlists` (limit 50 → ~142 requests at 1 req/s ≈ 2.5 min, honours `429` `Retry-After`; aborts without writing on 403/repeated errors).
- Keeps names starting with `The Sound of ` (minus non-genres such as *The Sound of Everything*; drops *The Needle* country lists), stores `{ genre, playlistId, total }`, sorted by genre. 2026-11-15 run: 7,085 listed → 6,490 genres.
- Output committed → app has no runtime dependency on the listing endpoint.
- Playlists with fewer than 10 tracks are kept (shorter lists are fine); only empty playlists (`total = 0`) are dropped.
