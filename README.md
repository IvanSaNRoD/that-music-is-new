# That Music Is New

A door into rare music genres. One click → a random genre from ~7,000 and a short list of its tracks to listen to, right in the page. If a genre clicks, keep exploring it on Spotify.

> Status: **technical foundations** (iteration 1 — Randomizer). Next.js app scaffolded; Randomizer not built yet.

## Links

[![Design system on Penpot](https://img.shields.io/badge/Design_system-Penpot-8DB6A5?logo=penpot&logoColor=white)](https://design.penpot.app/?screen=viewer&file-id=110d30a4-9d92-80de-8008-ee26a65adfd7&page-id=110d30a4-9d92-80de-8008-ee26a65adfd8&section=interactions&index=0&share-id=2ffa9ce6-5d22-4f57-a813-66d4d19c4d19)

[![Screens on Penpot](https://img.shields.io/badge/Screens-Penpot-B3412F?logo=penpot&logoColor=white)](https://design.penpot.app/?screen=viewer&file-id=110d30a4-9d92-80de-8008-ee26a65adfd7&page-id=4aa1a90e-d850-80aa-8008-ee4eb67a2ed2&section=interactions&index=0&share-id=aa919e04-9944-4418-955f-303e4a7de80e)

[![Release v0.1.0](https://img.shields.io/github/v/release/IvanSaNRoD/that-music-is-new?include_prereleases&label=release&color=1C1C1C)](https://github.com/IvanSaNRoD/that-music-is-new/releases/tag/v0.1.0)

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
| Design | Designed in code with the [impeccable](https://github.com/pbakaus/impeccable) skill · exploration in Claude Design · Penpot for documentation |

Why each choice: [ADR-0004](docs/adr/0004-tech-stack.md).

## Design system

**Source of truth: [`DESIGN.md`](DESIGN.md)** (North Star "The Record Crate": tokens, named rules, components; machine-readable sidecar in `.impeccable/design.json`) and the code itself. Screen briefs live in [`docs/design/`](docs/design/). Penpot mirrors the finished design as documentation: [public link](https://design.penpot.app/?screen=viewer&file-id=110d30a4-9d92-80de-8008-ee26a65adfd7&page-id=110d30a4-9d92-80de-8008-ee26a65adfd8&section=interactions&index=0&share-id=2ffa9ce6-5d22-4f57-a813-66d4d19c4d19).

- **Palette**: Seiji–Kinari (traditional Japanese colors): Kinari `#F3EBDA` paper, Seiji `#8DB6A5` single accent, Sumi `#1C1C1C` ink and outlines. Five sleeve tones give each genre its own color (Genre Tone Rule). All text pairs pass WCAG AA.
- **Type**: Inter Tight (display) + Inter (UI) + Space Mono (catalog data: counts, dates, shortcuts).
- **Tokens**: CSS variables in [`src/app/globals.css`](src/app/globals.css), named like shadcn/ui (`background`, `primary`, `muted-foreground`…).
- **Status**: desktop home and genre page (turntable) are final in code. Mobile, tablet and touch are next; open points are listed in `DESIGN.md › Layout`. The *Screens* page in Penpot still holds the early drafts until it is updated from the coded design.

## Design workflow

Changed on 2026-11-12: screens built in Penpot through its plugin API were assembled "blind" and lacked polish, so design moved into code, where the see-fix loop is immediate.

1. **Explore in Claude Design.** Visual options for a screen are generated in Claude Design and exported as a handoff (HTML/React reference) into [`docs/claude-design/`](docs/claude-design/) (Crate Flip for the home, Turntable for the genre page). Handoffs are references, not code: they are re-implemented with the project's tokens and rules.
2. **Build in code with impeccable.** The [impeccable](https://github.com/pbakaus/impeccable) skill drives every step: `shape` (brief in `docs/design/`) → implement → `live` (variants in the browser) → `audit` (technical: a11y, performance, responsive) → `critique` (UX heuristics, personas) → `layout` / `harden` / `polish` (fixes) → `document` (updates `DESIGN.md`). Its detector also runs on every UI edit through a hook.
3. **Critique with isolated subagents.** `critique` runs two subagents in parallel that never see each other's output: one does the design review (heuristics, cognitive load, personas) and the other gathers deterministic evidence (detector scans, headless-browser measurements such as contrast, focus order and layout stability). Keeping them apart stops the detector's findings from anchoring the design judgment. Each re-run uses fresh subagents without access to earlier reports.
4. **Document in Penpot.** Once a screen is final, its tokens and screenshots are copied to Penpot so the design stays documented outside the code.

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
| `/impeccable critique` | Every design review | Two isolated subagents (design review ∥ detector/browser evidence) so findings don't anchor each other |
| Parallel work (optional) | E2 Spotify client ∥ E4 UI with mock data | Independent; only if pace needs it |

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

Design tokens live in [`src/app/globals.css`](src/app/globals.css); the rules that use them are in [`DESIGN.md`](DESIGN.md).

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
| 2026-11-11 | [v0.1.0](https://github.com/IvanSaNRoD/that-music-is-new/releases/tag/v0.1.0) | Milestone: definition, planning and design done (phases A–C) |
| 2026-11-12 | [#4](https://github.com/IvanSaNRoD/that-music-is-new/issues/4) | Scaffold: Next.js 16 (App Router, TS strict), Tailwind v4, shadcn/ui (Radix); Penpot tokens → CSS variables; architecture folders |
