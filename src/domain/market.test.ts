import { describe, expect, it } from "vitest";
import { toMarket } from "./market";

describe("toMarket", () => {
  it.each([
    ["ES", "ES"],
    [" mx ", "MX"],
  ])("normalises country %j to market %s", (country, market) => {
    expect(toMarket(country)).toBe(market);
  });

  it.each([[null], [undefined], [""], ["USA"], ["e1"]])("falls back to US for %j", (country) => {
    expect(toMarket(country)).toBe("US");
  });

  // Spotify answers 400 "Invalid market" for these (checked with XX, 2026-11-16); CDNs use XX for "unknown".
  it.each([["XX"], ["ZZ"], ["AA"], ["QM"], ["XA"]])("falls back to US for the reserved code %s", (country) => {
    expect(toMarket(country)).toBe("US");
  });
});
