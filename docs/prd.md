# PRD — That Music Is New (iteration 1: Randomizer)

- Status: Draft
- Date: 2026-11-09
- Related: ADR-0001 (playback), ADR-0002 (auth), ADR-0003 (Randomizer strategy)

## Goal
A door into rare music genres. One click → a random genre from ~7,000 and a short list of its tracks to listen to.
If the user finds a genre interesting, they continue exploring on Spotify.

## Target users
- **Curious listeners**: want something different, no prior knowledge of genres.
- **Music lovers**: tired of their algorithm, looking for niche genres to dig into.

## User stories
1. As a user, I open the home page and see a **Randomizer button**, so I can start discovering immediately (no login).
2. As a user, I press the button and get **1 random genre with up to 10 tracks**, so I can sample it quickly.
3. As a user, I see the **genre context**: name, number of tracks in its playlist, link to the playlist on Spotify.
4. As a user, I can **play a track** in the page (Spotify Embed).
5. As a user, I can **roll again** to get another genre.
6. As a user, I see the **history of genres** I've played, kept between visits.
7. As a user, I can **delete history entries one by one or all at once**.
8. As a user, I can **click a history entry to reload that genre's tracks**, so I can go back to a genre I liked.

## Acceptance criteria
- Home page shows the Randomizer button; no login or account required.
- Pressing the button shows: genre name, track count of its "The Sound of X" playlist, "Listen more on Spotify" link (playlist URL), and up to 10 tracks (title, artists).
- Selecting a track loads it in a single Spotify Embed player (one player, not one per row).
- "Roll again" replaces the current genre and tracks with a new random genre.
- A loading state is shown while fetching; an error state with retry is shown if Spotify fails (incl. `429`).
- A genre is saved to `localStorage` (genre name, playlist id, date) **when its tracks are played**, not when it is merely selected or randomized; it persists after reload.
- Clicking a history entry loads a new sample of up to 10 tracks from that genre's playlist (same view as a Randomizer result); it does not duplicate the history entry.
- History shows the **last 5 played** genres, most recent first (no duplicates; replaying moves an entry to the top); each entry has a delete action; a "clear all" action empties the list (with confirmation).
- If `localStorage` is unavailable, the Randomizer still works (history simply not persisted).
- Responsive (mobile and desktop) and keyboard accessible.

## Out of scope (iteration 1)
- User login, saving playlists to the user's account.
- Multi-genre mixes.
- Choosing genre subgroups / filters.
- Up-to-date lists (source playlists are a frozen snapshot, ADR-0003).
- Server-side persistence (no database).

## Open questions
- **History beyond the last 5** (decided 2026-11-12): the home History card shows only the last 5 played genres because an unbounded list breaks the layout. Long-term we do NOT want history limited to the last 5: decide how older entries are kept and reached (e.g. separate "full history" view, pagination, scroll inside the card) without breaking the home design.

## Future ideas
- Avoid randomizing genres already in the history.
- Select genre subgroups (e.g. by family/region) before randomizing.
- Multi-genre mixes / genre blocks.
- Login to save the list as a playlist (`POST /me/playlists`), full in-app playback (Web Playback SDK).
