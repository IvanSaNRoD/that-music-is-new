import { describe, expect, it } from "vitest";
import { spreadTones, toneIndex } from "./tone";

describe("toneIndex", () => {
  it.each([
    ["a", 2], // 97 % 5
    ["ab", 0], // 97 + 98 = 195
    ["acid-jazz", 3], // worked out by hand: 893 % 5
  ])("%s → tone %i", (slug, tone) => {
    expect(toneIndex(slug)).toBe(tone);
  });

  it("is the same for the same slug, so a genre keeps its tone everywhere", () => {
    expect(toneIndex("zeuhl")).toBe(toneIndex("zeuhl"));
  });
});

// One-letter slugs: tone = char code % 5. "a", "f", "k" → 2; "b" → 3; "c" → 4.
const g = (...slugs: string[]) => slugs.map((slug) => ({ slug }));
const slugs = (items: { slug: string }[]) => items.map((i) => i.slug);
const repeats = (items: { slug: string }[]) =>
  items.filter((item, i) => i > 0 && toneIndex(item.slug) === toneIndex(items[i - 1]!.slug)).length;

describe("spreadTones", () => {
  it("parts neighbours that share a tone", () => {
    const out = spreadTones(g("a", "f", "b", "c"));
    expect(repeats(out)).toBe(0);
    expect(slugs(out).sort()).toEqual(["a", "b", "c", "f"]);
  });

  it("keeps the order when every tone differs", () => {
    expect(slugs(spreadTones(g("a", "b", "c")))).toEqual(["a", "b", "c"]);
  });

  it("leaves as few repeats as it can when one tone fills more than half", () => {
    expect(repeats(spreadTones(g("a", "f", "k", "b")))).toBe(1);
  });

  it("returns a new list and leaves the input alone", () => {
    const input = g("a", "f", "b");
    expect(spreadTones(input)).not.toBe(input);
    expect(slugs(input)).toEqual(["a", "f", "b"]);
    expect(spreadTones([])).toEqual([]);
  });
});
