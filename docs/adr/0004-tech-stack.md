# ADR-0004: Tech stack (iteration 1)

- Status: Accepted
- Date: 2026-11-09

## Context
- Iteration 1 (PRD): one page, Randomizer button, 10 tracks + Spotify Embed, history in `localStorage`. No login, no database.
- Spotify secrets must stay server-side (ADR-0002) → need a server runtime for API calls.
- Portfolio project: clear structure, typed code, tests and CI matter as much as features.
- Local env: Windows, Node v24.

## Decision

| Area | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router)** | React UI + server code (route handlers / server actions) in one project; secrets stay server-side. |
| Language | **TypeScript (strict)** | Type safety, typed Spotify responses. |
| Package manager | **npm** | Bundled with Node, zero extra setup. |
| Styling | **Tailwind CSS** + **shadcn/ui** | Utility CSS + accessible components copied into the repo (no heavy UI dependency). |
| Validation | **zod** | Validate Spotify API responses and `localStorage` data at runtime. |
| Spotify client | **`fetch`** in a `server-only` module | Few endpoints (token, playlist items) → no SDK needed. |
| Client state | React state + small `localStorage` hook | History is the only persisted state; no state library. |
| Unit tests | **Vitest** + Testing Library | Domain logic (random offset, shuffle, filtering) and components. |
| API mocking | **MSW** | Mock Spotify in tests without hitting the real API. |
| E2E tests | **Playwright** | Main flow: randomize → list → play → history. |
| Quality | ESLint, Prettier, Husky + lint-staged, commitlint | Consistent code and conventional commits. |
| CI | **GitHub Actions** | lint · typecheck · unit · build · e2e on every PR. |
| Hosting | **Vercel** | Native Next.js support, preview deploy per PR, env vars for secrets. |

Versions: latest stable at scaffold time, pinned via lockfile.

## Consequences
- + Single deployable app, no separate backend.
- + Small dependency surface; every dependency has a concrete use.
- − Vercel lock-in for preview deploys (Next.js remains portable).
- Not in iteration 1: Supabase (no DB needed), OAuth libraries (Arctic, `jose`) — re-evaluate with login (ADR-0002 Future).
