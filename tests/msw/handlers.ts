import { http, HttpResponse } from "msw/http";
import { playlistItemsPage } from "./fixtures";

/**
 * Default Spotify mocks for unit tests (server/ code). Override per test with server.use(...).
 * Not in src/mocks/: that folder holds design-phase placeholder data (ADR-0005 rule 6).
 */
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const ITEMS_URL = "https://api.spotify.com/v1/playlists/:playlistId/items";

export const handlers = [
  // Client Credentials token (ADR-0002).
  http.post(TOKEN_URL, () => HttpResponse.json({ access_token: "test-token", token_type: "Bearer", expires_in: 3600 })),
  http.get(ITEMS_URL, () => HttpResponse.json(playlistItemsPage)),
];

/** Playlist items answer 429 with `Retry-After`. */
export const spotifyRateLimited = (retryAfter = 3) =>
  http.get(ITEMS_URL, () => new HttpResponse(null, { status: 429, headers: { "Retry-After": String(retryAfter) } }));

/** Playlist items answer an error status (default 500). */
export const spotifyServerError = (status = 500) => http.get(ITEMS_URL, () => new HttpResponse(null, { status }));

/** Playlist items answer 401 once (expired/revoked token), then fall through to the default handler. */
export const spotifyUnauthorizedOnce = () =>
  http.get(ITEMS_URL, () => new HttpResponse(null, { status: 401 }), { once: true });
