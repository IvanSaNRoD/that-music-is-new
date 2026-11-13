"use client";

import { useCallback, useEffect, useState } from "react";
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
 * Crate state: the 8 genres standing in the crate and the open sleeve (see the Crate Flip handoff README).
 * Also owns Randomize and its Space shortcut.
 * Initial values are deterministic so server and client render the same markup.
 */
export function useCrate(catalog: Genre[]) {
  const [stock, setStock] = useState(() => catalog.slice(0, CRATE_SIZE).map((g) => g.id));
  const [selected, setSelected] = useState(stock[0]);

  const pick = useCallback((id: string) => {
    setSelected(id);
    // Not in the crate → replaces the oldest (top) sleeve, so the crate always holds 8.
    setStock((s) => (s.includes(id) ? s : [...s.slice(1), id]));
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

  // Space = Randomize on pointer devices with hover (desktop), except while typing or when a
  // control has keyboard focus (native Space activation wins). Mouse clicks drop focus (blurIfPointer).
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.code !== "Space" || /INPUT|TEXTAREA|BUTTON|SELECT|A/.test(tag)) return;
      e.preventDefault();
      randomize();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [randomize]);

  return { stock, selected, pick, randomize, restock };
}
