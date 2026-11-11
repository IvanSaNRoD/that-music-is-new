# That Music Is New

A door into rare music genres. One click → a random genre from ~7,000 and a short list of its tracks to listen to, right in the page. If a genre clicks, keep exploring it on Spotify.

> Status: **design done** (iteration 1 — Randomizer). Next: technical foundations. No app code yet.

## Links

[![Design system on Penpot](https://img.shields.io/badge/Design_system-Penpot-8DB6A5?logo=penpot&logoColor=white)](https://design.penpot.app/?screen=viewer&file-id=110d30a4-9d92-80de-8008-ee26a65adfd7&page-id=110d30a4-9d92-80de-8008-ee26a65adfd8&section=interactions&index=0&share-id=2ffa9ce6-5d22-4f57-a813-66d4d19c4d19)

[![Screens on Penpot](https://img.shields.io/badge/Screens-Penpot-B3412F?logo=penpot&logoColor=white)](https://design.penpot.app/?screen=viewer&file-id=110d30a4-9d92-80de-8008-ee26a65adfd7&page-id=4aa1a90e-d850-80aa-8008-ee4eb67a2ed2&section=interactions&index=0&share-id=aa919e04-9944-4418-955f-303e4a7de80e)

## Features (iteration 1)

- **Randomizer**: one button → 1 random genre + up to 10 tracks (no login).
- **Genre context**: name, track count, link to its "The Sound of X" playlist on Spotify.
- **Playback** in the page via a single Spotify Embed player.
- **History** of discovered genres in `localStorage`: reload, delete one, clear all.

Full scope: [PRD](docs/prd.md).

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Validation | zod |
| Spotify | `fetch` in a server-only module (Client Credentials) + Spotify Embed |
| Tests | Vitest + Testing Library, MSW, Playwright |
| Quality | ESLint, Prettier, Husky + lint-staged, commitlint |
| CI / Hosting | GitHub Actions / Vercel |
| Design | Penpot (design tokens + mockups) |

Why each choice: [ADR-0004](docs/adr/0004-tech-stack.md).

## Design system

Built in Penpot. **Public link:** https://design.penpot.app/?screen=viewer&file-id=110d30a4-9d92-80de-8008-ee26a65adfd7&page-id=110d30a4-9d92-80de-8008-ee26a65adfd8&section=interactions&index=0&share-id=2ffa9ce6-5d22-4f57-a813-66d4d19c4d19

- **Palette**: Seiji–Kinari (traditional Japanese colors): Kinari `#F3EBDA` background, Seiji `#8DB6A5` primary, Matsuba `#6E7B6A` borders, Sumi `#1C1C1C` text. All text pairs pass WCAG AA.
- **Type**: Space Grotesk (display) + Inter (body), Tailwind type scale.
- **Tokens**: color, font size/weight, spacing (4 px scale), radius — named like shadcn/ui variables (`background`, `primary`, `muted-foreground`…) so they map 1:1 to code.
- **Screens** (page *Screens*, desktop 1440 + mobile 390): home (genre cloud, prominent Randomize + `Space` shortcut, how-it-works steps, illustrated empty history), loading (skeleton), result (genre, Spotify Embed, 10 tracks, history), error (retry), clear-history confirmation.

## AI-assisted workflow

Built with Claude Code. Decision: **one main agent, no subagents by default.**

Why:
- **Small, sequential project**: one-page app, 36 issues that mostly depend on each other (scaffold → domain → API → UI → tests). Little truly parallel work.
- **Cost and context**: each subagent starts cold — it doesn't know prior decisions (ADRs, palette, conventions), re-reads files and risks inconsistencies.
- **Learning**: a linear flow (issue → code → tests → commit → README) is easier to follow and review than parallel agents and branch merges.
- **Penpot MCP**: the connection depends on one active browser tab; several agents on it would be fragile.

Where subagents/extra reviews *are* used:

| Case | When | Why |
|---|---|---|
| `/code-review` | Before closing logic-heavy issues (E3, E4) | Independent review of code the main agent wrote |
| `/security-review` | F1 (hardening) | Specialized security pass |
| Parallel work (optional) | E2 Spotify client ∥ E4 UI with mock data | Independent; only if pace needs it |

## Docs

- [PRD](docs/prd.md) · [Architecture](docs/architecture.md) · [Backlog](docs/backlog.md)
- ADRs: [0001 Playback](docs/adr/0001-playback-spotify-embed.md) · [0002 Auth](docs/adr/0002-auth-spotify-oauth-pkce.md) · [0003 Randomizer strategy](docs/adr/0003-randomizer-search-strategy.md) · [0004 Tech stack](docs/adr/0004-tech-stack.md)
- Task board: [GitHub Projects](https://github.com/users/IvanSaNRoD/projects/1)

## Progress

| Date | Issue | Done |
|---|---|---|
| 2026-11-09 | — | Definition: PRD, architecture, ADR-0001…0004, Spotify API spike |
| 2026-11-10 | — | Planning: backlog → 36 issues on GitHub Projects |
| 2026-11-11 | [#1](https://github.com/IvanSaNRoD/that-music-is-new/issues/1) | Penpot connected to Claude Code via MCP |
| 2026-11-11 | [#2](https://github.com/IvanSaNRoD/that-music-is-new/issues/2) | Design tokens in Penpot (Seiji–Kinari palette, type, spacing, radius) |
| 2026-11-11 | [#3](https://github.com/IvanSaNRoD/that-music-is-new/issues/3) | Screens in Penpot: home, loading, result, error, clear-history dialog — desktop + mobile |
