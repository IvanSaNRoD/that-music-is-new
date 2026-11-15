import { http, HttpResponse } from "msw/http";
import { describe, expect, it } from "vitest";
import { server } from "./server";

describe("MSW", () => {
  it("serves the default Spotify token mock", async () => {
    const res = await fetch("https://accounts.spotify.com/api/token", { method: "POST" });
    expect(await res.json()).toMatchObject({ access_token: "test-token", token_type: "Bearer" });
  });

  it("lets a test override a handler", async () => {
    server.use(http.post("https://accounts.spotify.com/api/token", () => new HttpResponse(null, { status: 429 })));
    const res = await fetch("https://accounts.spotify.com/api/token", { method: "POST" });
    expect(res.status).toBe(429);
  });
});
