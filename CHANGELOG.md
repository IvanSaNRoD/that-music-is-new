# Changelog

All notable changes to **That Music Is New**. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [Semantic Versioning](https://semver.org/). Full notes for each version are on [GitHub Releases](https://github.com/IvanSaNRoD/that-music-is-new/releases).

## [1.0.0] — That music is new to you — 2026-11-19

First stable release: iteration 1 (Randomizer) is complete, hardened and live.

### Security

- #32 CSP and security headers on every response (`nosniff`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'`); frames only from `open.spotify.com`, so the Spotify Embed keeps working ([ADR-0008](docs/adr/0008-csp-without-nonces.md)). Security review: no findings.

### Performance

- #80 No layout shift when the web fonts load: own fallback faces sized like Inter Tight 800 and Space Mono; desktop home CLS 0.165 → 0–0.06 on production.

### Known limits

- Mobile Total Blocking Time is still high (#81, postponed).
- Spotify Dev Mode quota is shared per developer account and the app needs the owner's Premium (see `docs/backlog.md` › Main risks).

## [0.6.0] — Every listener, every screen — 2026-11-18

### Added

- #57 Crate loading feels alive: sleeves riffle while loading, Restock dims the old ones, new genres drop in one by one (reduced motion: opacity only).
- #28 Full listener flow e2e on the full stack, Spotify faked server-side.

### Fixed

- #65 A keyboard ✕ in History moves focus to Undo.
- #29 Accessibility audit (axe WCAG 2.2 AA, keyboard, reduced motion): focus kept on Undo and Clear all, the Spotify player has a name, the open sleeve's name includes its visible text.
- #30 Responsive review (320–1920px, touch, landscape): no empty band under phone pages.

### Changed

- #33 Spotify production secrets on Vercel verified; Dev Mode limits logged as a risk.

## [0.5.0] — The record player grows up — 2026-11-17

### Added

- #67 Track 01 autoplays when a genre is opened to listen; never on a shared URL, reload or History (research in #62).
- #61 The turntable spins only while Spotify really plays.
- #55 ⏮ / ⏭ controls, auto-advance with no loop.
- #31 Titles and canonical URLs, share images, favicon, own 404/500 pages, robots and sitemap.

### Fixed

- #58 Long genre names no longer push the Play pill into the die-cut hole.
- #53 A failed roll says so next to the CTA and is announced once to screen readers.

## [0.4.0] — Your finds, kept — 2026-11-16

### Added

- #25 History kept in `localStorage`, validated on read, synced across tabs, works without storage.
- #26 History panel: recent first, delete one with undo, clear all with confirmation.
- #27 A History row opens the genre page with a fresh sample.
- #54 Remove finds from the genre page with undo.

### Removed

- Design placeholder data (`src/mocks/`): everything on screen is real.

## [0.3.0] — Real genres, real music — 2026-11-16

### Added

- #11 #12 Genre catalog: 6,490 "The Sound of …" genres from Spotify.
- #13–#16 Server-only Spotify client: Client Credentials, zod-validated playlist items, error mapping (`429` → `503`), MSW mocks.
- #17–#20 Randomizer domain and API by slug ([ADR-0007](docs/adr/0007-api-by-slug.md)).
- #21–#24 Randomizer UI on real data: crate of 8 genres, genre pages, one Spotify Embed player, loading/empty/error states.

## [0.2.0] — Technical foundations + final design — 2026-11-15

### Added

- #37–#42 Design moved into code with impeccable: desktop home, genre pages as routes ([ADR-0006](docs/adr/0006-routing-genre-pages.md)), mobile and touch; feature folders ([ADR-0005](docs/adr/0005-frontend-feature-folders.md)).
- #4–#10 Phase D: Next.js 16 scaffold, quality tooling, tests (Vitest, MSW, Playwright), CI, Vercel, walking skeleton.

## [0.1.0] — Definition, planning & design — 2026-11-11

### Added

- Phase A: PRD, architecture, ADRs 0001–0004, Spotify API spike.
- Phase B: backlog of 36 issues on GitHub Projects.
- Phase C: Penpot via MCP, design tokens, first screens.

[1.0.0]: https://github.com/IvanSaNRoD/that-music-is-new/compare/v0.6.0...v1.0.0
[0.6.0]: https://github.com/IvanSaNRoD/that-music-is-new/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/IvanSaNRoD/that-music-is-new/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/IvanSaNRoD/that-music-is-new/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/IvanSaNRoD/that-music-is-new/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/IvanSaNRoD/that-music-is-new/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/IvanSaNRoD/that-music-is-new/releases/tag/v0.1.0
