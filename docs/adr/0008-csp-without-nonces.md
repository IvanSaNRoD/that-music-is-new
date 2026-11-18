# ADR-0008: Security headers; CSP without nonces, with `'unsafe-eval'` for the Spotify Embed

- Status: Accepted
- Date: 2026-11-18
- Related: ADR-0001 (single Spotify Embed), ADR-0004 (Next.js stack), `next.config.ts`, `tests/e2e/security.spec.ts`, issue #32 (F1)

## Context
- F1 asks for a Content Security Policy and security headers before v1.0.0, with one constraint: **the CSP must not break the Embed**.
- There is little to protect: no login, no forms, no user-generated HTML. The only third party is the Spotify Embed (ADR-0001). Measured on production (2026-11-18), our document loads `https://open.spotify.com/embed/iframe-api/v1`, which loads `https://embed-cdn.spotifycdn.com/_next/static/iframe_api.*.js`, and it frames `https://open.spotify.com/embed/track/…`. Fonts are self-hosted (`next/font`). There is no analytics.
- The strictest CSP uses a per-request **nonce**. Next 16 (`node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`) says this needs dynamic rendering on every page and is **incompatible with Partial Prerendering**. This app uses `cacheComponents` (prerendered shells; production answers `X-Vercel-Cache: PRERENDER`).
- Spotify's iFrame API script is a webpack build with the **"eval" devtool**: every module is wrapped in `eval("…")`, as its own header comment says. Under a CSP without `'unsafe-eval'` it throws at load and the player is never created (checked on a production build: no iframe, `script-src eval` violations).

## Decision
1. Security headers are set for every route (`/:path*`) in `next.config.ts` › `headers()`, with no proxy and no per-request work:
   - `Content-Security-Policy`:
     - `default-src 'self'`
     - `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://open.spotify.com https://embed-cdn.spotifycdn.com`
     - `style-src 'self' 'unsafe-inline'`
     - `img-src 'self' data: blob:`, `font-src 'self'`, `connect-src 'self'`
     - `frame-src https://open.spotify.com`
     - `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`
     - On Vercel previews only (`VERCEL_ENV=preview`), `https://vercel.live` is added to `script-src`, `connect-src` and `frame-src` for the preview toolbar and comments.
   - `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`.
   - HSTS is already sent by Vercel on every deployment.
2. **No nonces.** Next's inline scripts (the RSC payload) are allowed with `'unsafe-inline'`.
3. **`'unsafe-eval'` in production too**, only because of Spotify's script.
4. No `upgrade-insecure-requests`: everything we load is already HTTPS, and the e2e production build is served over `http://localhost`.
5. Guarded by `tests/e2e/security.spec.ts`. It checks that every page and API answer carries the headers, and that the listener flow (home → genre → play) runs with zero `securitypolicyviolation` events. The fake iFrame API in `tests/e2e/fixtures.ts` runs through `eval()` like the real one, so removing `'unsafe-eval'` fails CI (which tests the production build) instead of silently breaking the player.

## Consequences
- \+ Prerendering, CDN caching and PPR stay as they are, at no runtime cost.
- \+ The policy still restricts:
  - **scripts and frames:** only us and Spotify; we cannot be framed (clickjacking);
  - **plugins, `<base>` and forms:** no plugins, no `<base>` hijack, no form posting to another site;
  - **connections:** to our own origin only.
- \+ Third parties are explicit: a new script or frame origin fails the e2e and has to be decided on purpose.
- − Weaker against XSS than a nonce CSP. Injected inline script and `eval` would run. Accepted: nothing user-controlled is rendered as HTML (React escapes text, and genre names come from our frozen catalog), and there is no session or secret in the browser to steal.
- − We depend on Spotify's build: new script origins would need a policy update (the e2e only covers the fake).
- Revisit if the app ever renders third-party HTML or adds accounts, if Next supports nonces with PPR, or if Spotify ships its iFrame API without `eval` (then drop `'unsafe-eval'`).
