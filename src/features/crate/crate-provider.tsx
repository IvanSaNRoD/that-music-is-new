"use client";

import { createContext, useContext, type ReactNode } from "react";
import { GENRES } from "@/mocks/genres";
import { useCrate } from "./use-crate";

type CrateState = ReturnType<typeof useCrate>;

const CrateContext = createContext<CrateState | null>(null);

/** Lives in the shared (site) layout, so the crate keeps its state across navigation. */
export function CrateProvider({ children }: { children: ReactNode }) {
  const crate = useCrate(GENRES);
  return <CrateContext value={crate}>{children}</CrateContext>;
}

export function useCrateState() {
  const ctx = useContext(CrateContext);
  if (!ctx) throw new Error("useCrateState must be used inside <CrateProvider>");
  return ctx;
}
