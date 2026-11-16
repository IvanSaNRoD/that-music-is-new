"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import type { Genre } from "@/domain/genre";
import { HISTORY_MAX, type HistoryItem, parseHistory } from "@/domain/history";

const KEY = "tmin:history";
const NONE: HistoryItem[] = [];
const noop = () => () => {};

/**
 * History store: kept in memory, mirrored to `localStorage`. Read once per page load (and when another tab
 * changes it). Without `localStorage` (blocked, private mode, full) History still works, just not between visits.
 */
let items: HistoryItem[] | null = null;
const listeners = new Set<() => void>();

function load(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? parseHistory(JSON.parse(raw)) : NONE;
  } catch {
    return NONE; // no storage, or corrupt JSON
  }
}

function getSnapshot() {
  items ??= load();
  return items;
}

function write(next: HistoryItem[]) {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // not persisted; the in-memory History still works
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY && e.key !== null) return;
    items = load();
    listener();
  };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Local calendar day as ISO "YYYY-MM-DD" (toISOString would use UTC and shift late-night plays). */
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** History of played genres: newest first, no duplicates, max 5, kept between visits; remove with undo, clear all. */
export function useGenreHistory() {
  // Server and hydration render: empty History (no localStorage there), so the markup matches.
  const list = useSyncExternalStore(subscribe, getSnapshot, () => NONE);
  // False on the server and during hydration: lets the UI tell "not read yet" from "empty".
  const loaded = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  // Last removed entry + its position, so a single ✕ can be undone.
  const [lastRemoved, setLastRemoved] = useState<{ item: HistoryItem; index: number } | null>(null);

  // A genre enters History only when its tracks are played, not when a sleeve is opened.
  const add = useCallback(({ name, slug }: Genre) => {
    const h = getSnapshot();
    write([{ id: slug, name, date: today() }, ...h.filter((x) => x.id !== slug)].slice(0, HISTORY_MAX));
  }, []);

  const remove = useCallback((id: string) => {
    const h = getSnapshot();
    const index = h.findIndex((x) => x.id === id);
    if (index === -1) return;
    setLastRemoved({ item: h[index], index });
    write(h.filter((x) => x.id !== id));
  }, []);

  // Writes outside the state updater: updaters run during render, and write() notifies subscribers.
  const undoRemove = useCallback(() => {
    if (!lastRemoved) return;
    const { item, index } = lastRemoved;
    const h = getSnapshot().filter((x) => x.id !== item.id);
    write([...h.slice(0, index), item, ...h.slice(index)].slice(0, HISTORY_MAX));
    setLastRemoved(null);
  }, [lastRemoved]);

  const dismissUndo = useCallback(() => setLastRemoved(null), []);

  const clear = useCallback(() => {
    write(NONE);
    setLastRemoved(null);
  }, []);

  return { items: list, loaded, lastRemoved: lastRemoved?.item ?? null, add, remove, undoRemove, dismissUndo, clear };
}
