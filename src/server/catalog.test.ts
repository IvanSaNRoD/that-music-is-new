// @vitest-environment node
import { describe, expect, it } from "vitest";
import { buildCatalog, getCatalog } from "./catalog";

describe("getCatalog", () => {
  it("loads every genre of config/genres.json", () => {
    expect(getCatalog().entries).toHaveLength(6490);
  });

  it("finds a genre by its slug", () => {
    expect(getCatalog().bySlug.get("acid-jazz")).toEqual({
      genre: "Acid Jazz",
      slug: "acid-jazz",
      playlistId: "7vyHBfRfPOT8Sxy87P5osJ",
      total: expect.any(Number),
    });
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
