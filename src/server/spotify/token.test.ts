// @vitest-environment node
import { http, HttpResponse } from "msw/http";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "../../../tests/msw/server";

const TOKEN_URL = "https://accounts.spotify.com/api/token";

// Fresh module per test: the token cache is module state.
const loadToken = async () => {
  vi.resetModules();
  return import("./token");
};

/** Serves tokens `token-1`, `token-2`, … and records each request's Authorization header. */
function countTokenRequests(expiresIn = 3600) {
  const auth: (string | null)[] = [];
  server.use(
    http.post(TOKEN_URL, ({ request }) => {
      auth.push(request.headers.get("authorization"));
      return HttpResponse.json({ access_token: `token-${auth.length}`, token_type: "Bearer", expires_in: expiresIn });
    }),
  );
  return auth;
}

beforeEach(() => {
  vi.stubEnv("SPOTIFY_CLIENT_ID", "id");
  vi.stubEnv("SPOTIFY_CLIENT_SECRET", "secret");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe("getToken", () => {
  it("requests a token with the app credentials and caches it", async () => {
    const auth = countTokenRequests();
    const { getToken } = await loadToken();

    expect(await getToken()).toBe("token-1");
    expect(await getToken()).toBe("token-1");
    expect(auth).toEqual(["Basic " + Buffer.from("id:secret").toString("base64")]);
  });

  it("shares one request between concurrent callers", async () => {
    const auth = countTokenRequests();
    const { getToken } = await loadToken();

    expect(await Promise.all([getToken(), getToken(), getToken()])).toEqual(["token-1", "token-1", "token-1"]);
    expect(auth).toHaveLength(1);
  });

  it("refreshes a minute before the token expires", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(0);
    countTokenRequests(3600);
    const { getToken } = await loadToken();

    expect(await getToken()).toBe("token-1");
    vi.setSystemTime(3600_000 - 60_000 - 1);
    expect(await getToken()).toBe("token-1");
    vi.setSystemTime(3600_000 - 60_000);
    expect(await getToken()).toBe("token-2");
  });

  it("requests a new token after invalidateToken()", async () => {
    countTokenRequests();
    const { getToken, invalidateToken } = await loadToken();

    await getToken();
    invalidateToken();
    expect(await getToken()).toBe("token-2");
  });

  it("throws a plain Error (config bug, not a Spotify failure) when credentials are missing", async () => {
    vi.stubEnv("SPOTIFY_CLIENT_SECRET", "");
    const { getToken } = await loadToken();

    await expect(getToken()).rejects.toMatchObject({ name: "Error", message: expect.stringMatching(/Missing/) });
  });

  it.each([
    ["an error status", () => new HttpResponse(null, { status: 500 })],
    ["an unexpected body", () => HttpResponse.json({ nope: true })],
  ])("maps %s to SpotifyError upstream, and recovers on the next call", async (_, reply) => {
    const { getToken } = await loadToken();
    server.use(http.post(TOKEN_URL, reply, { once: true }));

    await expect(getToken()).rejects.toMatchObject({ name: "SpotifyError", kind: "upstream" });
    expect(await getToken()).toBe("test-token");
  });

  it("maps 429 to SpotifyError rate-limited with Retry-After", async () => {
    const { getToken } = await loadToken();
    server.use(http.post(TOKEN_URL, () => new HttpResponse(null, { status: 429, headers: { "Retry-After": "7" } })));

    await expect(getToken()).rejects.toMatchObject({ kind: "rate-limited", retryAfter: 7 });
  });
});
