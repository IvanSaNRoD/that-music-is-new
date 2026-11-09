# ADR-0002: Authentication with Spotify OAuth (Authorization Code + PKCE), not Supabase Auth

- Status: Proposed
- Date: 2026-11-06

## Context
- Spotify Development Mode (Feb 2026 migration) removed `email` from `GET /me`.
  Source: https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide
- Supabase Auth OAuth expects an email from the provider ("Error getting user email from external provider",
  https://github.com/supabase/auth/issues/214). Login via Supabase's Spotify provider is therefore at risk.
- Iteration 1 needs no database: only a Spotify access token to call Search.
- Spotify access tokens expire after 1h → refresh must happen server-side.

## Decision
- Implement the OAuth flow in Next.js route handlers using **Arctic** (minimal, typed OAuth client with a Spotify provider) with **PKCE + state**.
- Store tokens in an **encrypted, httpOnly, Secure, SameSite=Lax cookie** (JWE via `jose`). No tokens in `localStorage` or client JS.
- Refresh the access token server-side when expired, before calling Spotify.
- All Spotify API calls happen server-side (`server-only` module); the browser never sees tokens.
- Supabase is kept for persistence starting iteration 2 (e.g. randomizer history), keyed by Spotify user id.

## Consequences
- + No dependency on provider email; works with current Dev Mode rules.
- + Small, auditable auth surface; good showcase of OAuth/PKCE knowledge.
- − We own session security (encryption key rotation, cookie flags, CSRF via `state`) → covered by tests and `security-guidance`.
- − Cookie size limit (~4KB) — tokens fit, but keep the session payload minimal.

## Alternatives considered
- Supabase Auth (Spotify provider): blocked by missing email.
- Auth.js / Better Auth: more abstraction and setup than needed for a single provider with no DB in iteration 1.
