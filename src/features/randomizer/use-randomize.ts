"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { GENRES } from "@/mocks/genres";

/**
 * Randomize: pick any genre from the whole catalog (not the one on screen) and go to its page.
 * Independent from the crate — it never changes which sleeves are in it (ADR-0006).
 */
export function useRandomize() {
  const router = useRouter();
  const params = useParams<{ genre?: string }>();
  const current = params.genre;

  return useCallback(() => {
    const pool = GENRES.filter((g) => g.slug !== current);
    const next = pool[Math.floor(Math.random() * pool.length)];
    router.push(`/${next.slug}`);
  }, [router, current]);
}
