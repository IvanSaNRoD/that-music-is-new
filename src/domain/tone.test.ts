import { describe, expect, it } from "vitest";
import { toneIndex } from "./tone";

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
