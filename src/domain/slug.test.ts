import { describe, expect, it } from "vitest";
import { findBySlug, toSlug } from "./slug";

describe("toSlug", () => {
  it.each([
    ["Trip hop", "trip-hop"],
    ["R&B", "r-and-b"],
    ["Música popular", "musica-popular"],
    ["  Post-rock!  ", "post-rock"],
    ["Drum & Bass (UK)", "drum-and-bass-uk"],
  ])("%s → %s", (name, slug) => {
    expect(toSlug(name)).toBe(slug);
  });
});

describe("findBySlug", () => {
  const items = [{ slug: "indie-folk" }, { slug: "post-rock" }];

  it("finds the item with that slug", () => {
    expect(findBySlug(items, "post-rock")).toBe(items[1]);
  });

  it("returns undefined for an unknown slug", () => {
    expect(findBySlug(items, "zeuhl")).toBeUndefined();
  });
});
