import { describe, expect, it } from "vitest";
import { toneFor } from "./tones";

describe("toneFor", () => {
  it("gives a genre the same sleeve tone from its slug", () => {
    // "ab" → 97 + 98 = 195 → 195 % 5 = 0 → first tone
    expect(toneFor("ab")).toEqual(["var(--primary)", "var(--foreground)", "var(--background)"]);
  });
});
