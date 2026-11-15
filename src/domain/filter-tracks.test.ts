import { describe, expect, it } from "vitest";
import { filterPlayable } from "./filter-tracks";
import type { TrackCandidate } from "./track";

const candidate = (id: string, flags: Partial<TrackCandidate> = {}): TrackCandidate => ({
  id,
  title: `Title ${id}`,
  artists: `Artist ${id}`,
  isLocal: false,
  isPlayable: true,
  ...flags,
});

describe("filterPlayable", () => {
  it("returns playable tracks as plain tracks, in order", () => {
    expect(filterPlayable([candidate("a"), candidate("b")])).toEqual([
      { id: "a", title: "Title a", artists: "Artist a" },
      { id: "b", title: "Title b", artists: "Artist b" },
    ]);
  });

  it("drops null, local and unplayable candidates", () => {
    const result = filterPlayable([
      null,
      candidate("local", { isLocal: true }),
      candidate("ok"),
      candidate("blocked", { isPlayable: false }),
    ]);
    expect(result.map((t) => t.id)).toEqual(["ok"]);
  });

  it("dedupes by id, keeping the first occurrence", () => {
    const result = filterPlayable([candidate("a"), candidate("b"), { ...candidate("a"), title: "Duplicate" }]);
    expect(result).toEqual([
      { id: "a", title: "Title a", artists: "Artist a" },
      { id: "b", title: "Title b", artists: "Artist b" },
    ]);
  });
});
