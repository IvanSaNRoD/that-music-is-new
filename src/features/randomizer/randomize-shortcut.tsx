"use client";

import { useEffect } from "react";
import { installInputModality } from "@/lib/input-modality";
import { useRandomize } from "./use-randomize";

/**
 * Global Space = Randomize on hover-capable (desktop) devices. Ignored while focus is on a field, button
 * or link, so native Space activation keeps working; pointer clicks drop focus (lib/utils › blurIfPointer).
 */
export function RandomizeShortcut() {
  const randomize = useRandomize();

  // Mounted in the (site) layout from the first load, so it also starts the keyboard/pointer tracking
  // that genre pages use to show a focus ring on the heading for keyboard users only.
  useEffect(installInputModality, []);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.code !== "Space" || /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/.test(tag)) return;
      e.preventDefault();
      randomize();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [randomize]);

  return null;
}
