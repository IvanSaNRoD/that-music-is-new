import { http, HttpResponse } from "msw/http";

/**
 * Default Spotify mocks for unit tests (server/ code in Phase E). Override per test with server.use(...).
 * Not in src/mocks/: that folder holds design-phase placeholder data (ADR-0005 rule 6).
 */
export const handlers = [
  // Client Credentials token (ADR-0002).
  http.post("https://accounts.spotify.com/api/token", () =>
    HttpResponse.json({ access_token: "test-token", token_type: "Bearer", expires_in: 3600 }),
  ),
];
