"use client";

import { CircleAlert } from "lucide-react";
import { useRandomizeFailed } from "./use-randomize";

export const RANDOMIZE_FAILED_MESSAGE = "Couldn’t reach the crate — try again.";

/**
 * Visible note next to a Randomize / Roll again CTA after a roll failed (#53). Not live on purpose: the one
 * announcement comes from RandomizeShortcut's polite region (layout), so screen readers hear it once.
 */
export function RandomizeFailedNote({ className = "" }: { className?: string }) {
  if (!useRandomizeFailed()) return null;
  return (
    <p className={`flex items-center gap-2 text-[15px] leading-6 text-foreground ${className}`}>
      <CircleAlert size={16} strokeWidth={2.5} className="shrink-0 text-destructive" aria-hidden="true" />
      {RANDOMIZE_FAILED_MESSAGE}
    </p>
  );
}

/** The single polite announcement of a failed roll, rendered once per page (in the site layout). */
export function RandomizeFailedAnnouncer() {
  const failed = useRandomizeFailed();
  return (
    <p role="status" className="sr-only">
      {failed ? RANDOMIZE_FAILED_MESSAGE : ""}
    </p>
  );
}
