import { describe, expect, it } from "vitest";
import { shuffle } from "./shuffle";

const sequence = (values: number[]) => {
  let i = 0;
  return () => values[i++];
};

describe("shuffle", () => {
  it("reorders items following the random sequence (Fisher–Yates)", () => {
    expect(shuffle(["a", "b", "c", "d"], sequence([0, 0.5, 0]))).toEqual(["c", "d", "b", "a"]);
  });

  it.each([[[]], [["solo"]]])("returns %j unchanged", (items) => {
    expect(shuffle(items, () => 0)).toEqual(items);
  });

  it("returns a new array and leaves the input untouched", () => {
    const items = ["a", "b", "c"];
    const result = shuffle(items, () => 0);
    expect(result).not.toBe(items);
    expect(items).toEqual(["a", "b", "c"]);
  });

  it("keeps the same elements", () => {
    expect(shuffle([1, 2, 3, 4, 5], () => 0.7).sort()).toEqual([1, 2, 3, 4, 5]);
  });
});
