# ADR-0006: Routing — genre pages at `/{slug}`, shared shell, independent Randomize

- Status: Accepted
- Date: 2026-11-13
- Related: ADR-0003 (Randomizer strategy), ADR-0005 (feature folders), `docs/architecture.md`, `docs/prd.md`

## Context
- The result ("listen to a genre") was first built as a state inside the home screen. Users can't share or bookmark a genre, and the browser Back button does nothing useful.
- The Crate Flip handoff made Randomize write into the crate (selected sleeve + "replace the top sleeve"). The product intent is different: the crate is a hand-picked selection to choose from; Randomize is a blind jump to any genre.
- History and the crate must survive moving between home and a genre.
- Next.js 16: layouts *"preserve state, remain interactive, and do not rerender"* on navigation; dynamic segments receive `params` as a Promise; with Cache Components (enabled in `next.config.ts`) dynamic params need `generateStaticParams` or a Suspense boundary (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`).

## Decision
1. **Routes**
   - `/` → home (Hero + crate).
   - `/{slug}` → genre page (result: tracks, player, states). Unknown slug → `notFound()` (404 inside the shell).
2. **Slug** (`src/domain/slug.ts`, pure): lowercase, accents stripped (NFKD), `&` → `and`, any other run of non-alphanumerics → `-`, trimmed. `Trip hop` → `trip-hop`, `R&B` → `r-and-b`, `Música popular` → `musica-popular`. `Genre` gets a `slug` field; slug uniqueness is checked when the real catalog is generated (E1).
3. **Shared shell**: route group `src/app/(site)/layout.tsx` holds header, `CrateProvider` + `HistoryProvider` (client contexts), the main row (`{children}`), the steps band and the decorative vinyl. Pages render only their column(s).
   - *Amended 2026-11-13*: the full History column belongs to the home page only (`HomeView`). Genre pages show a compact "Your finds" trail (`features/history/recent-finds.tsx`: last 5, click to open; remove/clear stay on home), so the turntable and track list get the full width. History state still lives in the layout provider.
   - *Amended 2026-11-13*: the main row moved from the layout into each page (`components/layout/page-row.tsx`), so pages can own what sits below it. The "how it works" steps band renders on home only; genre and not-found pages render an invisible, inert copy (desktop only) so the page height and the decorative corner vinyl don't jump.
4. **Entry points → effects**

   | Entry | Goes to | Changes the crate | Adds to History |
   |---|---|---|---|
   | Randomize · Space · Roll again | `/{random slug}` (≠ current) | No | When a track is played |
   | Sleeve → Play | `/{that slug}` | Only which sleeve is open | When a track is played |
   | History row | `/{that slug}` | No | Moves to top when a track is played |

   The handoff rule "random genre replaces the top sleeve" is removed.
5. **Back**: "Back to the crate" links to `/`; browser Back/Forward work natively.
6. **Prerendering**: `generateStaticParams` over the placeholder catalog. For the ~7,000-genre catalog, revisit (prerender none/some + Suspense or `loading.tsx`) when E1/E3 land.
7. **Randomize** becomes its own feature (`features/randomizer`: `useRandomize` + global `RandomizeShortcut`), independent from the crate.

## Consequences
- + Shareable, bookmarkable genre URLs; native browser navigation.
- + Clear separation: crate = selection, Randomize = blind jump, History = trail.
- + Shared state lives in one layout, not threaded through pages.
- − The API design in `architecture.md` (`/api/genres/{playlistId}`) must map slug → playlistId; the genre page may fetch on the server instead of the client — to be decided in E3 (new ADR if the API changes).
- − Slug collisions in the real catalog need a resolution rule (suffix or skip) at catalog build time.
- − With Cache Components the shell streams before the slug is checked, so an unknown slug renders the not-found UI with HTTP 200 (`dynamicParams = false` is not available with Cache Components). Acceptable for iteration 1; revisit with the real catalog (e.g. validate in `proxy`).
