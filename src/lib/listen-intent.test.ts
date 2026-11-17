import { describe, expect, it, vi } from "vitest";

/** A fresh page load: the module (and the intent it holds in memory) is re-imported. */
const load = async () => {
  vi.resetModules();
  return import("./listen-intent");
};

describe("listen intent", () => {
  it("is there after being marked (Randomize, Roll again, sleeve Play) until the genre page clears it", async () => {
    const { markListenIntent, hasListenIntent, clearListenIntent } = await load();
    markListenIntent();

    expect(hasListenIntent()).toBe(true);
    expect(hasListenIntent()).toBe(true); // reading is pure (React may render twice)
    clearListenIntent();
    expect(hasListenIntent()).toBe(false); // a later visit to a genre page doesn't autoplay
  });

  it("is absent on a page load nobody marked (shared URL, reload)", async () => {
    const { hasListenIntent } = await load();

    expect(hasListenIntent()).toBe(false);
  });
});
