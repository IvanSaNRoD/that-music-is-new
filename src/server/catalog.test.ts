// @vitest-environment node
import { describe, expect, it } from "vitest";
import { buildCatalog, getCatalog } from "./catalog";

// The only test that reads the real config/genres.json: it guards the committed data in CI
// (invariants only — no names, order or counts, so regenerating the catalog doesn't break it).
describe("getCatalog (real config/genres.json)", () => {
  it("is a non-empty catalog with one entry per slug", () => {
    const { entries, bySlug } = getCatalog();
    expect(entries.length).toBeGreaterThan(0);
    expect(bySlug.size).toBe(entries.length);
  });

  it("finds every entry by its slug", () => {
    const { entries, bySlug } = getCatalog();
    expect(entries.every((entry) => bySlug.get(entry.slug) === entry)).toBe(true);
  });

  it("is built once per server instance", () => {
    expect(getCatalog()).toBe(getCatalog());
  });
});

describe("buildCatalog", () => {
  it("rejects two genres with the same slug", () => {
    const rows = [
      { genre: "R&B", playlistId: "a", total: 10 },
      { genre: "R and B", playlistId: "b", total: 10 },
    ];
    expect(() => buildCatalog(rows)).toThrow('Slug collision "r-and-b": "R&B" and "R and B"');
  });

  it.each([
    ["an empty genre name", { genre: "", playlistId: "a", total: 10 }],
    ["an empty playlist", { genre: "Zydeco", playlistId: "a", total: 0 }],
    ["a missing playlist id", { genre: "Zydeco", total: 10 }],
  ])("rejects a row with %s", (_, row) => {
    expect(() => buildCatalog([row])).toThrow();
  });
});
