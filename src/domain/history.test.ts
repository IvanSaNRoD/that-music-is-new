import { describe, expect, it } from "vitest";
import { parseHistory } from "./history";

describe("parseHistory", () => {
  it("keeps valid entries in order", () => {
    const stored = [
      { id: "zeuhl", name: "Zeuhl", date: "2026-11-16" },
      { id: "indie-folk", name: "Indie Folk", date: "2026-11-15" },
    ];
    expect(parseHistory(stored)).toEqual(stored);
  });

  it.each([null, undefined, "zeuhl", 42, { id: "zeuhl" }])("returns no entries for %s", (raw) => {
    expect(parseHistory(raw)).toEqual([]);
  });

  it("drops invalid entries and keeps the rest", () => {
    const zeuhl = { id: "zeuhl", name: "Zeuhl", date: "2026-11-16" };
    const stored = [
      { id: "krautrock", name: "Krautrock", date: "24 Oct" }, // pre-ISO format
      zeuhl,
      { id: "", name: "Nameless", date: "2026-11-15" },
      { id: "afrobeat", date: "2026-11-14" },
      "bossa-nova",
    ];
    expect(parseHistory(stored)).toEqual([zeuhl]);
  });

  it("keeps only the newest copy of a genre and at most 5 entries", () => {
    const entry = (id: string, date: string) => ({ id, name: id, date });
    const stored = [
      entry("zeuhl", "2026-11-16"),
      entry("krautrock", "2026-11-15"),
      entry("zeuhl", "2026-11-14"),
      entry("afrobeat", "2026-11-13"),
      entry("bossa-nova", "2026-11-12"),
      entry("indie-folk", "2026-11-11"),
      entry("zydeco", "2026-11-10"),
    ];
    expect(parseHistory(stored).map((x) => x.id)).toEqual([
      "zeuhl",
      "krautrock",
      "afrobeat",
      "bossa-nova",
      "indie-folk",
    ]);
  });
});
