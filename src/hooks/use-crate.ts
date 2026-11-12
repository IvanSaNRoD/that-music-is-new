"use client";

import { useCallback, useEffect, useState } from "react";
import type { Genre } from "@/domain/genres";

export const CRATE_SIZE = 8;
const HISTORY_MAX = 8;

export type HistoryItem = { id: string; date: string };

const today = () =>
  new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const shuffle = <T,>(list: T[]) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Crate + History state (see docs/claude-design/design_handoff_crate_flip/README.md › State management).
 * Initial values are deterministic so server and client render the same markup.
 */
export function useCrate(catalog: Genre[], initialHistory: HistoryItem[] = []) {
  const [stock, setStock] = useState(() => catalog.slice(0, CRATE_SIZE).map((g) => g.id));
  const [selected, setSelected] = useState(stock[0]);
  const [history, setHistory] = useState(initialHistory);

  const pick = useCallback((id: string) => {
    setSelected(id);
    // Not in the crate → replaces the oldest (top) sleeve, so the crate always holds 8.
    setStock((s) => (s.includes(id) ? s : [...s.slice(1), id]));
    setHistory((h) =>
      [{ id, date: today() }, ...h.filter((x) => x.id !== id)].slice(0, HISTORY_MAX),
    );
  }, []);

  const randomize = useCallback(() => {
    const pool = catalog.filter((g) => g.id !== selected);
    pick(pool[Math.floor(Math.random() * pool.length)].id);
  }, [catalog, selected, pick]);

  const restock = useCallback(() => {
    const next = shuffle(catalog).slice(0, CRATE_SIZE).map((g) => g.id);
    setStock(next);
    pick(next[0]);
  }, [catalog, pick]);

  const removeFromHistory = useCallback(
    (id: string) => setHistory((h) => h.filter((x) => x.id !== id)),
    [],
  );
  const clearHistory = useCallback(() => setHistory([]), []);

  // Space = Randomize, except while typing or when a control has focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.code !== "Space" || /INPUT|TEXTAREA|BUTTON|SELECT/.test(tag)) return;
      e.preventDefault();
      randomize();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [randomize]);

  return { stock, selected, history, pick, randomize, restock, removeFromHistory, clearHistory };
}
