"use client";

import { useCallback, useEffect, useState } from "react";
import type { Genre } from "@/domain/genre";

type ApiGenre = { genre: string; slug: string };

/**
 * Crate state: the genres standing in the crate (8 random ones from GET /api/genres/crate) and the open sleeve.
 * Only crate actions change it (open a sleeve, Restock) — Randomize and History never do (ADR-0006).
 */
export function useCrate() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [round, setRound] = useState(0); // each Restock asks for a new crate

  useEffect(() => {
    const controller = new AbortController(); // a newer Restock drops this crate's answer
    void (async () => {
      try {
        const res = await fetch("/api/genres/crate", { signal: controller.signal });
        if (!res.ok) throw new Error(`Crate request failed: ${res.status}`);
        const body: ApiGenre[] = await res.json();
        const next = body.map((g) => ({ name: g.genre, slug: g.slug }));
        setGenres(next);
        setSelected(next[0]?.slug);
        setStatus("ready");
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    })();
    return () => controller.abort();
  }, [round]);

  const pick = useCallback((slug: string) => setSelected(slug), []);
  const restock = useCallback(() => {
    setStatus("loading");
    setRound((n) => n + 1);
  }, []);

  return { genres, selected, status, pick, restock };
}
