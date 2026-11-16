// @vitest-environment node
// Integration: /api/genres/* route handlers called directly; Spotify mocked by MSW (ADR-0007).
import { http, HttpResponse } from "msw/http";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { GET as getGenre } from "@/app/api/genres/[slug]/route";
import { GET as getCrate } from "@/app/api/genres/crate/route";
import { GET as getRandom } from "@/app/api/genres/random/route";
import { spotifyRateLimited, spotifyServerError } from "../msw/handlers";
import { server } from "../msw/server";

// Fixture catalog (Acid Jazz, Trip Hop, Zydeco) instead of the real data file.
vi.mock("../../config/genres.json", async () => ({ default: (await import("../fixtures/catalog")).catalogRows }));

const ITEMS_URL = "https://api.spotify.com/v1/playlists/:playlistId/items";

const genre = (slug: string, headers?: HeadersInit) =>
  getGenre(new Request(`http://localhost/api/genres/${slug}`, { headers }), { params: Promise.resolve({ slug }) });

beforeAll(() => {
  vi.stubEnv("SPOTIFY_CLIENT_ID", "id");
  vi.stubEnv("SPOTIFY_CLIENT_SECRET", "secret");
});
afterAll(() => vi.unstubAllEnvs());

describe("GET /api/genres/random", () => {
  it("returns a genre other than the excluded one", async () => {
    // Randomness is a system boundary: pin it so the excluded first genre would be the pick.
    const random = vi.spyOn(Math, "random").mockReturnValue(0);
    try {
      const res = await getRandom(new Request("http://localhost/api/genres/random?exclude=acid-jazz"));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ genre: "Trip Hop", slug: "trip-hop" });
    } finally {
      random.mockRestore();
    }
  });

  it("is never cached (each roll must differ)", async () => {
    const res = await getRandom(new Request("http://localhost/api/genres/random"));
    expect(res.headers.get("cache-control")).toBe("no-store");
  });
});

describe("GET /api/genres/crate", () => {
  it("returns up to 8 different genres (all 3 of the fixture catalog)", async () => {
    const res = await getCrate();

    expect(res.status).toBe(200);
    const body: { slug: string }[] = await res.json();
    expect(body.map((g) => g.slug).sort()).toEqual(["acid-jazz", "trip-hop", "zydeco"]);
  });

  it("is never cached (each Restock must differ)", async () => {
    expect((await getCrate()).headers.get("cache-control")).toBe("no-store");
  });
});

describe("GET /api/genres/{slug}", () => {
  it("returns the genre with its tracks", async () => {
    const res = await genre("acid-jazz");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ genre: "Acid Jazz", slug: "acid-jazz", playlistId: "7vyHBfRfPOT8Sxy87P5osJ" });
    expect(body.tracks).toHaveLength(2); // default fixture: 2 playable unique tracks
  });

  it("answers 404 for a genre that is not in the catalog", async () => {
    expect((await genre("no-such-genre")).status).toBe(404);
  });

  it("uses the visitor's country from Vercel's header, US when missing", async () => {
    const markets: (string | null)[] = [];
    server.use(
      http.get(ITEMS_URL, ({ request }) => {
        markets.push(new URL(request.url).searchParams.get("market"));
        return HttpResponse.json({ total: 0, items: [] });
      }),
    );

    await genre("acid-jazz", { "x-vercel-ip-country": "ES" });
    await genre("acid-jazz");
    expect(markets).toEqual(["ES", "US"]);
  });

  it("answers 503 with Retry-After when Spotify rate-limits", async () => {
    server.use(spotifyRateLimited(6));
    const res = await genre("acid-jazz");

    expect(res.status).toBe(503);
    expect(res.headers.get("retry-after")).toBe("6");
  });

  it("logs Spotify failures so they show up in the server logs", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      server.use(spotifyServerError(500));
      await genre("acid-jazz");
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("Playlist items failed: 500"));
    } finally {
      warn.mockRestore();
    }
  });

  it("answers 500 without blaming Spotify when the server is misconfigured", async () => {
    vi.resetModules(); // fresh token cache, so the missing credentials are read
    vi.stubEnv("SPOTIFY_CLIENT_SECRET", "");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const { GET } = await import("@/app/api/genres/[slug]/route");
      const res = await GET(new Request("http://localhost/api/genres/acid-jazz"), {
        params: Promise.resolve({ slug: "acid-jazz" }),
      });
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: "Internal error" });
    } finally {
      vi.stubEnv("SPOTIFY_CLIENT_SECRET", "secret");
      error.mockRestore();
    }
  });

  it.each([
    ["a result", "acid-jazz", undefined],
    ["a 404", "no-such-genre", undefined],
    ["a Spotify error", "acid-jazz", () => server.use(spotifyServerError(500))],
  ])("never caches %s", async (_, slug, setup) => {
    setup?.();
    expect((await genre(slug)).headers.get("cache-control")).toBe("no-store");
  });
});
