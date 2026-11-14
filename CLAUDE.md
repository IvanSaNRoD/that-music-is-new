# CLAUDE.md — That Music Is New

Project rules for Claude Code. They override defaults. When a rule and a request conflict, ask.

@AGENTS.md

## Sources of truth (read before acting)

| Topic | File |
|---|---|
| Product, users, scope, acceptance criteria | `PRODUCT.md`, `docs/prd.md` |
| Architecture, folder structure, API, import rules | `docs/architecture.md`, `docs/adr/*` (ADR-0005 = frontend structure) |
| Visual system (tokens, components, rules) | `DESIGN.md` (+ `.impeccable/design.json`) |
| Screen briefs | `docs/design/*-brief.md` |
| Backlog / phases | `docs/backlog.md`, GitHub Project board |

- Next.js 16 differs from training data: check `node_modules/next/dist/docs/` before any Next API or structure decision.
- Other libraries (Tailwind v4, shadcn/ui, Radix, Vitest, Playwright, MSW, zod): use Context7 docs when unsure; never guess APIs.

## Architecture rules (ADR-0005)

```
src/app/         routing only (page.tsx, layout.tsx, api/**/route.ts, globals.css)
src/features/    one folder per feature: home, crate, result, history (UI + client state)
src/components/  shared UI: ui/ (shadcn), brand/, layout/
src/domain/      pure TS, unit-tested — no React, no I/O
src/server/      server-only (import "server-only")
src/mocks/       design-phase placeholder data
src/lib/         tiny helpers
```

- **Before creating a file or folder, state where it goes and why, citing the rule above. If it does not fit, STOP and propose (new ADR) — do not improvise.**
- Features import other features only via `features/<name>/index.ts`.
- `domain/` never imports React, `features/`, `components/` or `server/`.
- Component CSS: `<component>.css` next to the component, class names prefixed by the component (CSS Modules don't work with the Turbopack `*.css` rule in `next.config.ts`).
- Placeholder data only in `src/mocks/`; never in `domain/`.
- Design tokens only via CSS variables in `globals.css`; no hard-coded colours in components.

## Workflow

1. **Plan first** for anything touching >2 files or adding files: list files to create/modify with their location, wait for approval.
2. UI work: use the `impeccable` skill; design in code; Penpot is documentation only.
3. New screen: `/impeccable shape` → brief in `docs/design/` → implement → `/impeccable live` → audit/critique → `/impeccable document` → **document it in Penpot** (tokens + screenshots of the coded design). A screen's design is not done until it is in Penpot.
4. Phase order: no Phase E (catalog, Spotify client) until all designs and all Phase D tasks are done.

## Definition of done

- `npx tsc --noEmit`, `npm run lint`, `npm run build` pass (stop `npm run dev` before building).
- `impeccable detect` has no unexplained findings for changed UI.
- WCAG 2.2 AA: contrast, keyboard, visible focus, `prefers-reduced-motion`.
- Docs updated when behaviour changes: PRD (rules), `DESIGN.md` (visual), architecture/ADR (structure).

## Git

- Never commit, push, merge, rebase or delete branches unless asked.
- Conventional commits; one issue = one branch + PR; PR description lists scope, out-of-scope and test plan.
- When an issue closes, add its row to the README Progress table.

## Language

- Chat with the user in Spanish. Code, comments, docs, commits and UI copy in English.
