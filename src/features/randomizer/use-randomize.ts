"use client";

import { useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { markListenIntent } from "@/lib/listen-intent";

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
    const query = current ? `?${new URLSearchParams({ exclude: current })}` : "";
    try {
      const res = await fetch(`/api/genres/random${query}`);
      if (!res.ok) return;
      const { slug }: { slug: string } = await res.json();
      markListenIntent(); // Randomize / Space / Roll again: the genre page autoplays track 01 (#67)
      router.push(`/${slug}`);
    } catch {
      // Network failure: stay on the current page; the user can press Randomize again.
    } finally {
      inFlight.current = false;
    }
  }, [router, current]);
}
