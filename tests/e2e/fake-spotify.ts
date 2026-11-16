// Local fake Spotify for full-stack e2e: Next runs with SPOTIFY_ACCOUNTS_URL / SPOTIFY_API_URL pointing here
// (playwright.config.ts), so CI never calls the real API and needs no secrets.
// Run by Playwright's webServer with plain Node 24 (built-in type stripping): `node tests/e2e/fake-spotify.ts`.
import { createServer } from "node:http";
// @ts-expect-error -- Node's type stripping needs the explicit extension; tsconfig has no allowImportingTsExtensions.
import { playlistItemsPage } from "../msw/fixtures.ts";

const port = Number(process.env.FAKE_SPOTIFY_PORT ?? 4010);
const itemsPath = /^\/v1\/playlists\/[^/]+\/items$/;

const server = createServer((req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  const json = (status: number, body: unknown) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
  };

  if (req.method === "GET" && pathname === "/health") return json(200, { ok: true }); // Playwright readiness
  if (req.method === "POST" && pathname === "/api/token") {
    req.resume(); // body (grant_type) is irrelevant
    return json(200, { access_token: "e2e-token", token_type: "Bearer", expires_in: 3600 });
  }
  if (req.method === "GET" && itemsPath.test(pathname)) return json(200, playlistItemsPage);
  json(404, { error: { status: 404, message: `fake-spotify: no route for ${req.method} ${pathname}` } });
});

server.listen(port, "127.0.0.1");
