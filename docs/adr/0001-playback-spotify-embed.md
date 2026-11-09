# ADR-0001: Playback via Spotify Embed (iframe)

- Status: Proposed
- Date: 2026-11-06

## Context
Iteration 1 must work for **non-Premium** users.
- Web Playback SDK requires Premium for the listening user.
- `preview_url` is deprecated and returns `null` for new apps (Nov 2024).
- The official Spotify Embed (`https://open.spotify.com/embed/track/{id}`) works for any user: 30s preview when not logged in to Spotify in the browser, full playback when logged in.

## Decision
Use the official Spotify Embed (iFrame API) to play tracks in iteration 1.
Wrap it in a `TrackPlayer` component so the playback implementation can be swapped.

## Consequences
- + Works for Free and Premium users, zero extra scopes, ToS-compliant.
- + No audio streaming logic of our own.
- − Limited UI control (iframe styling, no custom controls).
- − One iframe per track is heavy → render a single player for the selected track, not one per row.
- Iteration 2: add Web Playback SDK behind the same `TrackPlayer` interface for Premium users (`streaming` scope).
