# Backlog — iteration 1

- Status: Draft (to review, then load into GitHub Projects as issues)
- Date: 2026-11-10
- Sources: `docs/roadmap.pdf` (phases C–F), `docs/prd.md`, `docs/architecture.md`, ADR-0001…0004

Estimates: hours of focused work, AI-assisted, **tests included** (TDD for domain). Risk: L / M / H.

## Phase C — Design

| ID | Task | Est. | Risk | Depends | Notes / assumptions |
|---|---|---|---|---|---|
| C1 | Connect Penpot (account + MCP) | 1 | M | — | Penpot MCP setup on Windows not verified. |
| C2 | Design tokens (color, type, spacing, radius) | 2 | L | C1 | Spotify-inspired but own identity (no Spotify branding misuse). |
| C3 | Screens: home, result, history, loading, error, empty history; mobile + desktop | 4 | M | C2 | Embed iframe has fixed styling (ADR-0001). |

## Phase D — Technical foundations

| ID | Task | Est. | Risk | Depends | Notes / assumptions |
|---|---|---|---|---|---|
| D1 | Scaffold: Next.js App Router, TS strict, Tailwind, shadcn/ui, folders per architecture | 2 | L | — | npm (ADR-0004). |
| D2 | Quality: ESLint, Prettier, Husky + lint-staged, commitlint | 1.5 | L | D1 | |
| D3 | Tests setup: Vitest + Testing Library, MSW, Playwright | 2 | M | D1 | MSW with Next.js server code may need config tweaks. |
| D4 | Claude config: CLAUDE.md, subagents, PR template | 2 | L | D1 | |
| D5 | GitHub: protected `main`, Actions CI (lint · typecheck · unit · build · e2e) | 2 | M | D2, D3 | Repo already created in roadmap step 5. |
| D6 | Vercel: link repo, env vars (`SPOTIFY_CLIENT_ID/SECRET`), preview deploys | 1 | L | D5 | |
| D7 | **Milestone: walking skeleton** — empty page deployed, CI green | 0.5 | L | D6 | |

## Phase E — Development (one issue = one branch + PR)

### E1 — Genre catalog
| ID | Task | Est. | Risk | Depends | Notes / assumptions |
|---|---|---|---|---|---|
| E1.1 | `scripts/build-genres.mjs`: paginate `thesoundsofspotify`, keep "The Sound of …", drop `total = 0`, throttle + `429` | 3 | M | D1 | ~700 requests; Dev Mode rate limit unknown. |
| E1.2 | Generate + commit `config/genres.json`, sanity check (count, sample) | 0.5 | L | E1.1 | |

### E2 — Spotify client (server-only)
| ID | Task | Est. | Risk | Depends | Notes / assumptions |
|---|---|---|---|---|---|
| E2.1 | `token.ts`: client credentials + in-memory cache, refresh on expiry / `401` | 2 | L | D3 | |
| E2.2 | `playlists.ts` + zod `schemas.ts`: `getPlaylistItems(id, offset, limit)` | 2 | L | E2.1 | Response has both `track` and `item` keys (spike). |
| E2.3 | Error mapping: `429` → `503` + `Retry-After`, other → `502` | 1.5 | L | E2.2 | |
| E2.4 | MSW handlers for Spotify (token, items, 429, 5xx) | 1.5 | L | E2.2 | Reused by unit + e2e tests. |

### E3 — Randomizer logic + API
| ID | Task | Est. | Risk | Depends | Notes / assumptions |
|---|---|---|---|---|---|
| E3.1 | Domain (TDD): `pickGenre`, `randomOffset`, `filterPlayable` + dedupe, `shuffle` | 3 | L | D3 | Injected `random`. |
| E3.2 | `catalog.ts`: load + validate `genres.json`, lookup by `playlistId` | 1 | L | E1.2 | |
| E3.3 | `randomizer.ts` service | 2 | L | E2, E3.1, E3.2 | |
| E3.4 | Route handlers: `/api/genres/random`, `/api/genres/[playlistId]` (404 if not in catalog), `no-store` | 2 | L | E3.3 | |

### E4 — Randomizer UI
| ID | Task | Est. | Risk | Depends | Notes / assumptions |
|---|---|---|---|---|---|
| E4.1 | Home page layout + Randomizer button | 2 | L | C3, E3.4 | |
| E4.2 | `GenreResult` (name, track count, Spotify link) + `TrackList` | 2 | L | E4.1 | |
| E4.3 | `TrackPlayer`: single Spotify Embed, switch track on select | 2 | M | E4.2 | iFrame API behaviour to verify (ADR-0001). |
| E4.4 | Loading + error (retry) states, roll again | 1.5 | L | E4.2 | |

### E5 — History
| ID | Task | Est. | Risk | Depends | Notes / assumptions |
|---|---|---|---|---|---|
| E5.1 | `useGenreHistory` hook: zod on read, add (dedupe), remove, clear; works without `localStorage` | 2 | L | D3 | SSR: read only on client to avoid hydration mismatch. |
| E5.2 | `History` component: list (recent first), delete one, clear all with confirmation | 2 | L | E5.1, C3 | |
| E5.3 | Click entry → `/api/genres/[playlistId]` → show result | 1 | L | E5.2, E3.4 | |

### E6 — E2E
| ID | Task | Est. | Risk | Depends | Notes / assumptions |
|---|---|---|---|---|---|
| E6.1 | Playwright: randomize → list → play → roll again → history (reload, delete, clear) | 3 | M | E4, E5 | Spotify mocked; Embed iframe not asserted beyond `src`. |

### E7 — Polish
| ID | Task | Est. | Risk | Depends | Notes / assumptions |
|---|---|---|---|---|---|
| E7.1 | Accessibility (keyboard, focus, labels, contrast) | 1.5 | L | E4, E5 | |
| E7.2 | Responsive review mobile/desktop | 1 | L | E4, E5 | |
| E7.3 | SEO/metadata, favicon, 404/500 pages | 1.5 | L | E4 | |

## Phase F — Production

| ID | Task | Est. | Risk | Depends | Notes / assumptions |
|---|---|---|---|---|---|
| F1 | Hardening: CSP (allow `open.spotify.com` frame), security headers, Lighthouse, `/security-review` | 3 | M | E | CSP must not break the Embed. |
| F2 | Spotify production: prod secrets in Vercel, check Dev Mode limits for anonymous use | 1 | M | D6 | Dev Mode quota for Client Credentials not verified. |
| F3 | Release v1.0.0: tag, CHANGELOG, GitHub Release | 1 | L | F1 | |
| F4 | README for portfolio: GIF, diagram, decisions | 3 | L | F3 | |
| F5 | Retrospective: estimated vs real hours | 1 | L | F4 | |

## Summary

| Phase | Hours |
|---|---|
| C — Design | 7 |
| D — Foundations | 11 |
| E — Development | 38 |
| F — Production | 9 |
| **Total** | **65** |
| + 20% contingency | **78** |

## Main risks
- **Spotify closes access** to `thesoundsofspotify` playlists or the listing endpoint → no catalog / no tracks (ADR-0003, no fallback).
- **Dev Mode rate limits / quotas** for the catalog script and shared app token.
- **Embed + CSP** interplay; Embed iFrame API control from React.
- **Tooling setup** (Penpot MCP, MSW with Next.js) on Windows.
