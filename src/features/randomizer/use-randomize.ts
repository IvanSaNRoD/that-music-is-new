"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import { markListenIntent } from "@/lib/listen-intent";

/**
 * Did the last roll fail (#53)? Shared by every useRandomize on the page (hero, Roll again, the Space shortcut),
 * so the message shows next to the CTA whichever one rolled. In memory only.
 */
let failed = false;
const listeners = new Set<() => void>();

function setFailed(value: boolean) {
  if (failed === value) return;
  failed = value;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Forget a failure: a new roll starts, or the listener moved to another page (RandomizeShortcut). */
export function clearRandomizeFailed() {
  setFailed(false);
}

/** True after a roll fails (non-2xx or network error), until the next successful one. */
export function useRandomizeFailed() {
  return useSyncExternalStore(
    subscribe,
    () => failed,
    () => false,
  );
}

/**
 * Randomize: ask the API for a random genre and go to its page (ADR-0007 request 1).
 * Independent from the crate — it never changes which sleeves are in it (ADR-0006).
 */
export function useRandomize() {
  const router = useRouter();
  const current = useParams<{ genre?: string }>().genre;
  const inFlight = useRef(false);

  return useCallback(async () => {
    if (inFlight.current) return; // double click / held Space: one roll at a time
    inFlight.current = true;
    setFailed(false); // a retry withdraws the old note, so a second failure shows and is announced again
    const query = current ? `?${new URLSearchParams({ exclude: current })}` : "";
    try {
      const res = await fetch(`/api/genres/random${query}`);
      if (!res.ok) return setFailed(true);
      const { slug }: { slug: string } = await res.json();
      setFailed(false);
      markListenIntent(); // Randomize / Space / Roll again: the genre page autoplays track 01 (#67)
      router.push(`/${slug}`);
    } catch {
      setFailed(true); // network failure: stay on the page; the listener is told and can try again
    } finally {
      inFlight.current = false;
    }
  }, [router, current]);
}
