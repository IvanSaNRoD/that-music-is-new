import { renderHook } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const KEY = "tmin:history";

/** A fresh page load: the module (and its in-memory History) is re-imported. */
async function load() {
  vi.resetModules();
  const { useGenreHistory } = await import("./use-genre-history");
  return renderHook(() => useGenreHistory()).result;
}

const genre = (name: string) => ({ name, slug: name.toLowerCase().replace(/ /g, "-") });

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 10, 16, 12));
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("useGenreHistory", () => {
  it("adds a played genre with today's date", async () => {
    const history = await load();

    act(() => history.current.add(genre("Zeuhl")));

    expect(history.current.items).toEqual([{ id: "zeuhl", name: "Zeuhl", date: "2026-11-16" }]);
  });

  it("keeps History between visits", async () => {
    const first = await load();
    act(() => first.current.add(genre("Zeuhl")));
    act(() => first.current.add(genre("Indie Folk")));

    const next = await load();

    expect(next.current.items.map((x) => x.name)).toEqual(["Indie Folk", "Zeuhl"]);
  });

  it("moves a replayed genre to the top and keeps the last 5", async () => {
    const history = await load();
    for (const name of ["Zeuhl", "Krautrock", "Afrobeat", "Bossa Nova", "Indie Folk", "Zeuhl", "Zydeco"]) {
      act(() => history.current.add(genre(name)));
    }

    expect(history.current.items.map((x) => x.name)).toEqual([
      "Zydeco",
      "Zeuhl",
      "Indie Folk",
      "Bossa Nova",
      "Afrobeat",
    ]);
  });

  it("removes an entry for good; the undo offer lasts until reload", async () => {
    const history = await load();
    for (const name of ["Zeuhl", "Krautrock", "Afrobeat"]) act(() => history.current.add(genre(name)));

    act(() => history.current.remove("krautrock"));
    expect(history.current.lastRemoved?.name).toBe("Krautrock");
    expect((await load()).current.items.map((x) => x.name)).toEqual(["Afrobeat", "Zeuhl"]);

    const reloaded = await load();
    expect(reloaded.current.lastRemoved).toBeNull(); // the undo offer doesn't survive a reload
  });

  it("puts an undone entry back where it was", async () => {
    const history = await load();
    for (const name of ["Zeuhl", "Krautrock", "Afrobeat"]) act(() => history.current.add(genre(name)));

    act(() => history.current.remove("krautrock"));
    act(() => history.current.undoRemove());

    expect(history.current.lastRemoved).toBeNull();
    expect((await load()).current.items.map((x) => x.name)).toEqual(["Afrobeat", "Krautrock", "Zeuhl"]);
  });

  it("withdraws the undo offer after 6 seconds", async () => {
    vi.useFakeTimers();
    const history = await load();
    act(() => history.current.add(genre("Zeuhl")));

    act(() => history.current.remove("zeuhl"));
    act(() => vi.advanceTimersByTime(5_900));
    expect(history.current.lastRemoved?.name).toBe("Zeuhl");
    act(() => vi.advanceTimersByTime(200));
    expect(history.current.lastRemoved).toBeNull();
  });

  it("withdraws the undo offer when another genre is played, so undo never pushes an entry out", async () => {
    const history = await load();
    for (const name of ["Zeuhl", "Krautrock", "Afrobeat", "Bossa Nova", "Indie Folk"]) {
      act(() => history.current.add(genre(name)));
    }
    act(() => history.current.remove("bossa-nova"));

    act(() => history.current.add(genre("Zydeco")));

    expect(history.current.lastRemoved).toBeNull();
    expect(history.current.items.map((x) => x.name)).toEqual([
      "Zydeco",
      "Indie Folk",
      "Afrobeat",
      "Krautrock",
      "Zeuhl",
    ]);
  });

  it("clears all History for good", async () => {
    const history = await load();
    act(() => history.current.add(genre("Zeuhl")));

    act(() => history.current.clear());

    expect(history.current.items).toEqual([]);
    expect((await load()).current.items).toEqual([]);
  });

  it("ignores corrupt stored History", async () => {
    localStorage.setItem(KEY, "{not json");
    const history = await load();

    expect(history.current.items).toEqual([]);
    act(() => history.current.add(genre("Zeuhl")));
    expect(history.current.items.map((x) => x.name)).toEqual(["Zeuhl"]);
  });

  it("still works when localStorage is unavailable, just not between visits", async () => {
    const blocked = () => {
      throw new DOMException("blocked", "SecurityError");
    };
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(blocked);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(blocked);
    const history = await load();

    act(() => history.current.add(genre("Zeuhl")));
    expect(history.current.items.map((x) => x.name)).toEqual(["Zeuhl"]);

    expect((await load()).current.items).toEqual([]);
  });

  it("follows History changed in another tab", async () => {
    const history = await load();
    localStorage.setItem(KEY, JSON.stringify([{ id: "zeuhl", name: "Zeuhl", date: "2026-11-16" }]));

    act(() => window.dispatchEvent(new StorageEvent("storage", { key: KEY })));

    expect(history.current.items.map((x) => x.name)).toEqual(["Zeuhl"]);
  });
});
