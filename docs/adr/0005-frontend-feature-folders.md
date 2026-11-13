# ADR-0005: Frontend structure — feature folders

- Status: Accepted
- Date: 2026-11-13
- Related: ADR-0004 (tech stack), `docs/architecture.md` › Folder structure

## Context
- `docs/architecture.md` defined a layer-based layout: `app/` (routes), `domain/` (pure), `server/` (server-only) and a flat `components/` + `hooks/` for the UI.
- The redesign grew the UI well beyond the 5 components foreseen (Randomizer, GenreResult, TrackList, TrackPlayer, History): crate + sleeves, result view with 4 states, history with confirm/undo, brand marks, layout. Everything ended up in `src/components/home/`, placeholder data in `domain/`, and one hook (`use-crate`) mixing crate, history and keyboard concerns.
- Next.js does not impose UI folder names. Its project-structure guide (`node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`) lists equally valid strategies — *"Store project files outside of `app`"*, *"Split project files by feature or route"* — and asks only to *"choose a strategy … and be consistent"*. `components`, `lib`, `hooks` have *"no special framework significance"*.
- The app has a single route (`/`), so colocating UI inside `app/` (route-split strategy) adds nothing.

## Decision
Keep the layer-based backbone and organise the **UI by feature**, using Next's *"project files outside of `app`"* strategy:

```
src/
  app/                  # routing only: page.tsx, layout.tsx, api/**/route.ts, globals.css
  features/             # one folder per product feature (UI + its client state)
    home/               # screen composition: home-screen, hero, how-it-works
    crate/              # crate-flip (+ .css), tones, use-crate
    result/             # result-view (+ .css), track list, player slot, notices, use-result
    history/            # history-panel, use-genre-history
  components/           # shared, feature-agnostic UI
    ui/                 # shadcn/ui primitives
    brand/              # vinyl, sparkle
    layout/             # site-header
  domain/               # pure TypeScript, unit-tested, no React / no I/O
  server/               # server-only (catalog, randomizer, spotify/)
  mocks/                # placeholder data for the design phase (genres, tracks, history)
  lib/                  # tiny shared helpers (cn, blurIfPointer)
```

Rules:
1. `app/` holds only Next special files; screens are imported from `features/`.
2. A feature may import from `components/`, `domain/`, `lib/`, `mocks/` and other features' **public entry** (`features/<name>/index.ts`) — never another feature's internals.
3. `domain/` imports nothing from React, `features/`, `components/` or `server/`.
4. `server/` is never imported by client code (`import "server-only"`).
5. Component-scoped CSS lives next to its component as `<component>.css` with prefixed class names (CSS Modules are broken by the Turbopack `*.css` rule in `next.config.ts`).
6. Placeholder data lives in `mocks/` and is deleted when the real source lands.
7. A new top-level folder or a deviation from these rules requires a new ADR.

Enforcement (planned, D2/D5): ESLint import boundaries (`eslint-plugin-boundaries` or `no-restricted-imports`) so violations fail lint and CI.

## Consequences
- + Everything about a feature is in one place; new features add a folder instead of growing a flat list.
- + Keeps the tested, framework-free `domain/` and the isolated `server/` from the original architecture.
- + Matches a documented Next.js strategy; `page.tsx` stays a thin route entry.
- − One-off refactor (~15 files) and import updates; behaviour must stay identical.
- − Public entries (`index.ts`) add a little ceremony per feature.
