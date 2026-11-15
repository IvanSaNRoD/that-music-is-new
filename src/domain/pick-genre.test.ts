import { describe, expect, it } from "vitest";
import type { CatalogEntry } from "./genre";
import { pickGenre } from "./pick-genre";

const entry = (slug: string): CatalogEntry => ({ genre: slug, slug, playlistId: `pl-${slug}`, total: 100 });
const entries = [entry("jazz"), entry("dub"), entry("zeuhl"), entry("trip-hop")];

describe("pickGenre", () => {
  it("picks the entry at the drawn position", () => {
    expect(pickGenre(entries, () => 0.6).slug).toBe("zeuhl");
  });

  it.each([
    [0, "jazz"],
    [0.4, "zeuhl"],
    [0.99, "trip-hop"],
  ])("never returns the excluded slug (random %s → %s)", (r, slug) => {
    expect(pickGenre(entries, () => r, "dub").slug).toBe(slug);
  });

  it("returns the only entry even when it is excluded", () => {
    expect(pickGenre([entry("dub")], () => 0.5, "dub").slug).toBe("dub");
  });

  it("ignores an exclude slug that is not in the catalog", () => {
    expect(pickGenre(entries, () => 0.3, "polka").slug).toBe("dub");
  });

  it("throws on an empty catalog", () => {
    expect(() => pickGenre([], () => 0)).toThrow("empty");
  });
});
