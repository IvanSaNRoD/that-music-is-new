# Brief — Result screen (desktop)

Confirmed 2026-11-13 via `/impeccable shape`. Builds on the desktop home (DESIGN.md).

1. **Job & audience** — A music lover just rolled a genre and wants to *hear it now* to decide if it hooks them. Mode: Operate (show the genre, pick/play tracks, clear exits).
2. **Outcome** — Primary action: play a track. First track played adds the genre to History. Success: a track plays within seconds; "Listen more on Spotify" if it hooks. Real content (PRD): genre name, track count of its "The Sound of X" playlist, up to 10 tracks (title, artists), Spotify playlist link, one Spotify Embed player. No origin/era (Spotify doesn't provide it).
3. **Direction** — Result replaces **Hero + crate** (two columns); History stays on the right. Focal moment: "the record comes out of the sleeve" — the chosen sleeve morphs into the result header; the die-cut hole becomes the vinyl next to the genre name; track list below. Same world (kinari paper, Sumi outlines, Inter Tight name, Space Mono data); the sleeve's color becomes the result's accent.
4. **Scope** — Desktop only, coded with placeholder data; player is a placeholder until E4.3. Untouched: header, History (except add-on-track-play), steps band. Anti-goals: no Spotify-page look, no dashboard table.
5. **States** — Loading: sleeve vinyl spins + skeleton track rows. Result: 1–10 tracks; genre names up to ~40 chars. Error: plain message + Try again; 429 → "Spotify is busy — try again in N s". Empty (no playable tracks): message + Roll again.
6. **Interaction** — Randomize / Space → straight to result. Play on open sleeve or History row → that genre's result. Track click → player + "now playing" row. Roll again (stays in result), Back (→ hero + crate), Listen more on Spotify (new tab). Result arrival announced via aria-live; focus moves to first track.
7. **Open** — Final player look (Spotify iframe). Clear-all confirm already inline.
