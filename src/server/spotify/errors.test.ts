// @vitest-environment node
import { describe, expect, it } from "vitest";
import { retryAfterSeconds, SpotifyError, toHttpError } from "./errors";

describe("toHttpError", () => {
  it("maps rate-limited to 503 with Retry-After", () => {
    expect(toHttpError(new SpotifyError("rate-limited", "429", 4))).toEqual({
      status: 503,
      headers: { "Retry-After": "4" },
    });
  });

  it("maps upstream to 502", () => {
    expect(toHttpError(new SpotifyError("upstream", "500"))).toEqual({ status: 502 });
  });

  it("maps anything else to 500", () => {
    expect(toHttpError(new Error("config"))).toEqual({ status: 500 });
  });
});

describe("retryAfterSeconds", () => {
  const res = (value?: string) => new Response(null, { headers: value ? { "Retry-After": value } : {} });

  it.each([
    ["3", 3],
    ["2.5", 3],
    [undefined, 1],
    ["0", 1],
    ["soon", 1],
  ])("Retry-After %s → %i s", (value, expected) => {
    expect(retryAfterSeconds(res(value))).toBe(expected);
  });
});
