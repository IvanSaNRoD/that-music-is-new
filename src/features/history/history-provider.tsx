"use client";

import { createContext, useContext, type ReactNode } from "react";
import { SAMPLE_HISTORY } from "@/mocks/history";
import { useGenreHistory } from "./use-genre-history";

type HistoryState = ReturnType<typeof useGenreHistory>;

const HistoryContext = createContext<HistoryState | null>(null);

/** Lives in the shared (site) layout, so History survives navigation between home and results. */
export function HistoryProvider({ children }: { children: ReactNode }) {
  const history = useGenreHistory(SAMPLE_HISTORY);
  return <HistoryContext value={history}>{children}</HistoryContext>;
}

export function useHistoryState() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("useHistoryState must be used inside <HistoryProvider>");
  return ctx;
}
