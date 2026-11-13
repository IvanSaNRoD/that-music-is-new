"use client";

import { useCallback, useState } from "react";
import type { Genre } from "@/domain/genre";

export const CRATE_SIZE = 8;

const shuffle = <T,>(list: T[]) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Crate state: the 8 genres standing in the crate and the open sleeve.
 * Only crate actions change it (open a sleeve, Restock) — Randomize and History never do (ADR-0006).
 * Initial values are deterministic so server and client render the same markup.
 */
export function useCrate(catalog: Genre[]) {
  const [stock, setStock] = useState(() => catalog.slice(0, CRATE_SIZE).map((g) => g.id));
  const [selected, setSelected] = useState(stock[0]);

  const pick = useCallback((id: string) => setSelected(id), []);

  const restock = useCallback(() => {
    const next = shuffle(catalog).slice(0, CRATE_SIZE).map((g) => g.id);
    setStock(next);
    setSelected(next[0]);
  }, [catalog]);

  return { stock, selected, pick, restock };
}
