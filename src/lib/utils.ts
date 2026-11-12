import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Drop focus after a mouse/pen click (detail > 0) so the global Space shortcut keeps working.
 * Keyboard activation (detail === 0) keeps focus, preserving native Space/Enter behaviour.
 */
export function blurIfPointer(e: { detail: number; currentTarget: HTMLElement }) {
  if (e.detail > 0) e.currentTarget.blur();
}
