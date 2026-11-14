"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Vinyl } from "@/components/brand/vinyl";
import { toneFor } from "@/features/crate";
import { GENRES } from "@/mocks/genres";
import { useHistoryState } from "./history-provider";
import "./recent-finds.css";

/**
 * Compact History trail for the genre page: one click back to a recent find, and visible proof that
 * playing a track kept the genre. Each pill wears its genre's sleeve tone, like the crate tabs. Current genre = Sumi ring. Managing the collection (remove, clear) stays on the home page.
 */
export function RecentFinds() {
  const { items } = useHistoryState();
  const params = useParams<{ genre?: string }>();
  // Entries present on arrival don't animate; only a genre added while here drops in.
  const [initial] = useState(() => new Set(items.map((x) => x.id)));

  return (
    <section aria-labelledby="recent-finds-title" className="flex flex-col gap-3">
      <h2 id="recent-finds-title" className="font-display text-[18px] font-extrabold tracking-[-0.02em]">
        Your finds
      </h2>
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">Play a track and this genre lands here.</p>
      ) : (
        <ul className="flex flex-wrap gap-2" aria-live="polite">
          {items.map(({ id }) => {
            const index = GENRES.findIndex((g) => g.id === id);
            const g = GENRES[index];
            if (!g) return null;
            const current = g.slug === params.genre;
            const [bg, fg, hole] = toneFor(index);
            return (
              <li key={id} className={initial.has(id) ? undefined : "recent-finds-new"}>
                <Link
                  href={`/${g.slug}`}
                  aria-current={current ? "page" : undefined}
                  style={{ backgroundColor: bg, color: fg }}
                  className={`recent-finds-pill border-border-strong flex max-w-[16rem] items-center gap-2 rounded-full border-[1.5px] py-1 pr-4 pl-1 text-[15px] font-semibold ${current ? "outline-border-strong outline-2 outline-offset-2" : ""} focus-visible:outline-primary-ink focus-visible:outline-2 focus-visible:outline-offset-2`}
                >
                  <Vinyl size={28} rings={3} label={hole} className="recent-finds-disc" />
                  <span className="truncate">{g.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
