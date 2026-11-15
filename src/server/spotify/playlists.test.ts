// @vitest-environment node
import { http, HttpResponse } from "msw/http";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { playlistItemsPage } from "../../../tests/msw/fixtures";
import { spotifyRateLimited, spotifyServerError } from "../../../tests/msw/handlers";
import { server } from "../../../tests/msw/server";
import { getPlaylistItems } from "./playlists";

const ITEMS_URL = "https://api.spotify.com/v1/playlists/:playlistId/items";
const query = { playlistId: "7vyHBfRfPOT8Sxy87P5osJ", offset: 40, limit: 10, market: "ES" };

beforeAll(() => {
  vi.stubEnv("SPOTIFY_CLIENT_ID", "id");
  vi.stubEnv("SPOTIFY_CLIENT_SECRET", "secret");
});
afterAll(() => vi.unstubAllEnvs());

describe("getPlaylistItems", () => {
  it("sends the query and the app token", async () => {
    let seen: Request | undefined;
    server.use(
      http.get(ITEMS_URL, ({ request }) => {
        seen = request;
        return HttpResponse.json({ total: 0, items: [] });
      }),
    );

    await getPlaylistItems(query);
    const url = new URL(seen!.url);
    expect(url.pathname).toBe("/v1/playlists/7vyHBfRfPOT8Sxy87P5osJ/items");
    expect(Object.fromEntries(url.searchParams)).toEqual({ offset: "40", limit: "10", market: "ES" });
    expect(seen!.headers.get("authorization")).toBe("Bearer test-token");
  });

  it("maps entries to track candidates; unreadable entries become null", async () => {
    const page = await getPlaylistItems(query);

    expect(page.total).toBe(172);
    expect(page.items).toEqual([
      { id: "track-1", title: "Sample track 01", artists: "Sample artist 1", isLocal: false, isPlayable: true },
      {
        id: "track-2",
        title: "Sample track 02",
        artists: "Sample artist 2, Sample artist 3",
        isLocal: false,
        isPlayable: true,
      },
      { id: "track-3", title: "Sample track 03", artists: "Sample artist 4", isLocal: false, isPlayable: false },
      null, // local file without id
      { id: "track-1", title: "Sample track 01", artists: "Sample artist 1", isLocal: false, isPlayable: true },
      null, // removed track
      null, // episode (fails the schema: no artists)
      null, // episode (valid shape, rejected by type)
    ]);
  });

  it("retries once with a new token after a 401", async () => {
    // Fresh modules: start with an empty token cache, so the retry must request a second token.
    vi.resetModules();
    const { getPlaylistItems: fresh } = await import("./playlists");
    let tokenRequests = 0;
    const sent: (string | null)[] = [];
    server.use(
      http.post("https://accounts.spotify.com/api/token", () => {
        tokenRequests++;
        return HttpResponse.json({ access_token: `fresh-${tokenRequests}`, expires_in: 3600 });
      }),
      http.get(ITEMS_URL, ({ request }) => {
        sent.push(request.headers.get("authorization"));
        return sent.length === 1 ? new HttpResponse(null, { status: 401 }) : HttpResponse.json(playlistItemsPage);
      }),
    );

    await expect(fresh(query)).resolves.toMatchObject({ total: 172 });
    expect(tokenRequests).toBe(2);
    expect(sent).toEqual(["Bearer fresh-1", "Bearer fresh-2"]);
  });

  it("throws rate-limited with Retry-After on 429 (no retry)", async () => {
    server.use(spotifyRateLimited(5));
    await expect(getPlaylistItems(query)).rejects.toMatchObject({ kind: "rate-limited", retryAfter: 5 });
  });

  it.each([500, 404, 403])("throws upstream on %i", async (status) => {
    server.use(spotifyServerError(status));
    await expect(getPlaylistItems(query)).rejects.toMatchObject({ kind: "upstream" });
  });

  it("throws upstream on an unexpected response shape", async () => {
    server.use(http.get(ITEMS_URL, () => HttpResponse.json({ items: "nope" })));
    await expect(getPlaylistItems(query)).rejects.toMatchObject({ kind: "upstream" });
  });

  it("throws upstream on a network failure", async () => {
    server.use(http.get(ITEMS_URL, () => HttpResponse.error()));
    await expect(getPlaylistItems(query)).rejects.toMatchObject({ kind: "upstream" });
  });
});
