import { expect, test } from "./fixtures";

// Browser-less full stack: request → Next route → server/ → fake Spotify (tests/e2e/fake-spotify.ts).
// Same for both projects (no viewport involved), so it runs once.
test.skip(({ isMobile }) => isMobile, "API only: viewport-independent");

test("GET /api/genres/{slug} returns the genre with filtered tracks from Spotify", async ({ request }) => {
  const res = await request.get("/api/genres/acid-jazz");

  expect(res.status()).toBe(200);
  expect(res.headers()["cache-control"]).toContain("no-store");
  const body = await res.json();
  expect(body).toMatchObject({ genre: "Acid Jazz", slug: "acid-jazz" });
  // Fake page: 8 entries → unplayable, local, duplicate, removed and episodes filtered out.
  expect(body.tracks).toHaveLength(2);
  expect(body.tracks.map((t: { id: string }) => t.id).sort()).toEqual(["track-1", "track-2"]);
});

test("GET /api/genres/{unknown} answers 404", async ({ request }) => {
  const res = await request.get("/api/genres/no-such-genre");

  expect(res.status()).toBe(404);
});
