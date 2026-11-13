"use client";

import { useCallback, useState } from "react";
import type { HistoryItem } from "@/domain/history";

const HISTORY_MAX = 5; // last 5 played; older entries TBD (docs/prd.md › Open questions)

const today = () => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/** History of played genres: newest first, no duplicates, max 5; remove with undo, clear all. */
export function useGenreHistory(initial: HistoryItem[] = []) {
  const [items, setItems] = useState(initial);
  // Last removed entry + its position, so a single ✕ can be undone.
  const [lastRemoved, setLastRemoved] = useState<{ item: HistoryItem; index: number } | null>(null);

  // A genre enters History only when its tracks are played, not when a sleeve is opened.
  const add = useCallback((id: string) => {
    setItems((h) => [{ id, date: today() }, ...h.filter((x) => x.id !== id)].slice(0, HISTORY_MAX));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((h) => {
      const index = h.findIndex((x) => x.id === id);
      if (index !== -1) setLastRemoved({ item: h[index], index });
      return h.filter((x) => x.id !== id);
    });
  }, []);

  const undoRemove = useCallback(() => {
    setLastRemoved((r) => {
      if (r) setItems((h) => [...h.slice(0, r.index), r.item, ...h.slice(r.index)].slice(0, HISTORY_MAX));
      return null;
    });
  }, []);

  const dismissUndo = useCallback(() => setLastRemoved(null), []);

  const clear = useCallback(() => {
    setItems([]);
    setLastRemoved(null);
  }, []);

  return { items, lastRemoved: lastRemoved?.item ?? null, add, remove, undoRemove, dismissUndo, clear };
}
