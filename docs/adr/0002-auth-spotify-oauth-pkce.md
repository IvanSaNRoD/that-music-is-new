# ADR-0002: Authentication — Client Credentials in iteration 1, no user login

- Status: Accepted
- Date: 2026-11-09 (supersedes 2026-11-06 version: user login via OAuth PKCE in iteration 1)

## Context
- Iteration 1 Randomizer only reads public data: "The Sound of X" playlists (ADR-0003).
- Spike (2026-11-09, Dev Mode): **Client Credentials** token can call `GET /users/{id}/playlists`, `GET /playlists/{id}/items` and `GET /search` (200). No user token needed.
- Playback uses the Spotify Embed (ADR-0001): no token needed; the user's own Spotify session in the browser decides preview vs full playback.
- Iteration 1 needs no database.

## Decision
- **No user login in iteration 1.** The app is usable anonymously.
- Server obtains an app token via **Client Credentials** (`POST https://accounts.spotify.com/api/token`, `grant_type=client_credentials`).
- `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` only in server env (`.env.local`, git-ignored; hosting env vars in prod). Never exposed to the browser.
- All Spotify API calls happen server-side (`server-only` module). Token cached in memory until shortly before expiry (1h); re-requested on expiry or `401`.

## Consequences
- + Zero friction: no login screen, no consent, no session/cookie handling.
- + Minimal security surface: one server-side secret, no user tokens stored.
- − All users share the app's rate limit → respect `429 Retry-After` (ADR-0003).
- − No user-specific features (saving playlists, Web Playback SDK) until user login is added.

## Future (iteration 2+)
User login only when a feature needs user scopes (e.g. `POST /me/playlists`, Web Playback SDK `streaming`). Planned approach, re-evaluate then:
- Authorization Code + **PKCE + state** in Next.js route handlers (e.g. Arctic).
- Tokens in an encrypted, httpOnly, Secure, SameSite=Lax cookie (JWE via `jose`); refresh server-side.
- Not Supabase Auth: Spotify Dev Mode (Feb 2026) removed `email` from `GET /me`, and Supabase Auth requires a provider email (https://github.com/supabase/auth/issues/214). Supabase may still be used for persistence, keyed by Spotify user id.
