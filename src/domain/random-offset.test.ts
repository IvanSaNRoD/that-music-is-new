import { describe, expect, it } from "vitest";
import { randomOffset } from "./random-offset";

describe("randomOffset", () => {
  it.each([
    [0, 0],
    [0.5, 40],
    [0.999, 80],
  ])("maps random %s to offset %s within [0, total - limit]", (r, offset) => {
    expect(randomOffset(100, 20, () => r)).toBe(offset);
  });

  it.each([
    [20, 20],
    [5, 20],
    [0, 20],
  ])("returns 0 when total %s does not exceed limit %s", (total, limit) => {
    expect(randomOffset(total, limit, () => 0.9)).toBe(0);
  });
});
