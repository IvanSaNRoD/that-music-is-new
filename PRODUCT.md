# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary — music lovers**: people who already listen to a lot of music and are tired of their streaming algorithm recommending more of the same. They open the app in exploration moments (desktop or mobile) to break out of their bubble and dig into niche genres.
- **Secondary — curious listeners**: no prior knowledge of genres; want to try something different quickly, with zero effort.

## Product Purpose

A door into rare music genres. One click gives a random genre from ~7,000 and up to 10 of its tracks to sample. If a genre hooks the listener, they continue exploring it on Spotify. Success = the listener hears a genre they had never heard of and keeps a trail of what they found.

## Positioning

- **Pure chance, one click**: a random genre with no login, no onboarding, no questions.
- **Rare genres**: niches the streaming algorithm never surfaces (catalog based on Spotify "The Sound of X" playlists, a frozen snapshot — ADR-0003).
- **Sample and jump**: 10 tracks to taste fast, then continue on Spotify.
- **A collection of finds**: the history works like a crate of records the listener has dug up.

## Operating Context

- Iteration 1 scope and acceptance criteria: `docs/prd.md`. Architecture and decisions: `docs/architecture.md`, `docs/adr/`.
- Playback via a single Spotify Embed player (ADR-0001); Spotify Client Credentials, no user auth (ADR-0002).
- History persists in `localStorage` (no server-side persistence); the Randomizer must still work if `localStorage` is unavailable.
- Keyboard shortcut: Space = randomize.

## Capabilities and Constraints

- Randomize → genre name, track count of its playlist, "Listen more on Spotify" link, up to 10 tracks (title, artists).
- Roll again; loading state; error state with retry (incl. Spotify `429`).
- History: most recent first, delete per entry, clear all (with confirmation), click to reload a genre.
- Clicking a suggested genre in the home picker loads that genre.
- Out of scope (iteration 1): login, saving playlists, multi-genre mixes, genre filters/subgroups, up-to-date lists, server persistence.
- Stack: Next.js (App Router) + Tailwind + shadcn/ui.

## Brand Commitments

- Name: **That Music Is New**.
- UI copy in **English**.
- Voice: warm, curious record-store digger — friendly, no technical jargon.
- Own vinyl mark instead of the Spotify logo for decoration (Spotify branding only where its terms require it).

## Evidence on Hand

- Learning / portfolio project: no customers, testimonials, usage metrics, pricing or press exist. Never fabricate them.
- Genre data comes from Spotify; placeholder catalog in `src/domain/genres.ts` until the API integration lands.

## Product Principles

1. One click to something new — never put a step between the listener and the first genre.
2. Curiosity over curation — chance is the feature; don't over-explain or over-filter.
3. Taste, then leave — sample fast, hand off to Spotify for the deep listen.
4. The finds belong to the listener — history is their collection, easy to revisit or clear.

## Accessibility & Inclusion

- WCAG 2.2 AA required: text contrast ≥ 4.5:1 (large ≥ 3:1), full keyboard operation, visible focus, `prefers-reduced-motion` respected.
- Responsive: mobile and desktop.
