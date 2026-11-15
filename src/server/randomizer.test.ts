// @vitest-environment node
import { http, HttpResponse } from "msw/http";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { server } from "../../tests/msw/server";
import { getGenreSample, pickRandomGenre } from "./randomizer";

const ITEMS_URL = "https://api.spotify.com/v1/playlists/:playlistId/items";
const lowest = () => 0; // injected randomness: always the first draw

beforeAll(() => {
  vi.stubEnv("SPOTIFY_CLIENT_ID", "id");
  vi.stubEnv("SPOTIFY_CLIENT_SECRET", "secret");
});
afterAll(() => vi.unstubAllEnvs());

describe("pickRandomGenre", () => {
  it("returns a catalog genre and its slug", () => {
    expect(pickRandomGenre(undefined, lowest)).toEqual({ genre: "2-Step", slug: "2-step" });
  });

  it("never returns the excluded genre", () => {
    expect(pickRandomGenre("2-step", lowest)).toEqual({
      genre: "21st Century Classical",
      slug: "21st-century-classical",
    });
  });
});

describe("getGenreSample", () => {
  it("returns null for a genre that is not in the catalog", async () => {
    expect(await getGenreSample("no-such-genre", "ES", lowest)).toBeNull();
  });

  it("asks Spotify for 10 tracks of the genre's playlist in the visitor's market", async () => {
    let url: URL | undefined;
    server.use(
      http.get(ITEMS_URL, ({ request }) => {
        url = new URL(request.url);
        return HttpResponse.json({ total: 0, items: [] });
      }),
    );

    await getGenreSample("acid-jazz", "ES", lowest);
    expect(url?.pathname).toBe("/v1/playlists/7vyHBfRfPOT8Sxy87P5osJ/items");
    expect(Object.fromEntries(url!.searchParams)).toEqual({ offset: "0", limit: "10", market: "ES" });
  });

  it("returns the genre with its playable tracks, deduped and shuffled", async () => {
    // Default MSW fixture: 7 entries → 2 playable unique tracks; Fisher–Yates with random 0 swaps them.
    expect(await getGenreSample("acid-jazz", "ES", lowest)).toEqual({
      genre: "Acid Jazz",
      slug: "acid-jazz",
      playlistId: "7vyHBfRfPOT8Sxy87P5osJ",
      playlistUrl: "https://open.spotify.com/playlist/7vyHBfRfPOT8Sxy87P5osJ",
      total: expect.any(Number),
      tracks: [
        { id: "track-2", title: "Sample track 02", artists: "Sample artist 2, Sample artist 3" },
        { id: "track-1", title: "Sample track 01", artists: "Sample artist 1" },
      ],
    });
  });

  it("reports the playlist's live track count from Spotify", async () => {
    server.use(http.get(ITEMS_URL, () => HttpResponse.json({ total: 250, items: [] })));
    expect(await getGenreSample("acid-jazz", "ES", lowest)).toMatchObject({ total: 250 });
  });
});
