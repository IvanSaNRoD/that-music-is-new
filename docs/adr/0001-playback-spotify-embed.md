# ADR-0001: Playback via Spotify Embed (iframe)

- Status: Accepted
- Date: 2026-11-06

## Context
Iteration 1 must work for **non-Premium** users.
- Web Playback SDK requires Premium for the listening user.
- `preview_url` is deprecated and returns `null` for new apps (Nov 2024).
- The official Spotify Embed (`https://open.spotify.com/embed/track/{id}`) works for any user: 30s preview when not logged in to Spotify in the browser, full playback when logged in.

## Decision
Use the official Spotify Embed (iFrame API) to play tracks in iteration 1.
Wrap it in a `TrackPlayer` component so the playback implementation can be swapped.

*Implementation (E4, 2026-11-16, researched against Spotify's iFrame API docs):* `src/features/result/spotify-embed.ts` loads `https://open.spotify.com/embed/iframe-api/v1` once per page (singleton promise, 10s timeout); `use-spotify-player.ts` keeps ONE controller in the player slot: the first played track creates it (`createController`, height **152px** — Spotify's compact track player; 80px is legacy), later tracks call `loadEntity("spotify:track:ID")` + `play()` inside the click (`loadUri` is legacy). Browsers may block autoplay; anonymous listeners usually get ~30s previews. If the script fails or times out, the slot falls back to the "Dig deeper on Spotify" link. CSP (F1): `script-src` and `frame-src` `https://open.spotify.com`.

## Consequences
- + Works for Free and Premium users, zero extra scopes, ToS-compliant.
- + No audio streaming logic of our own.
- − Limited UI control (iframe styling, no custom controls).
- − One iframe per track is heavy → render a single player for the selected track, not one per row.
- Iteration 2: add Web Playback SDK behind the same `TrackPlayer` interface for Premium users (`streaming` scope).
