"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Vinyl } from "@/components/brand/vinyl";
import { toneFor } from "@/features/crate";
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
        <p className="text-sm text-muted-foreground">Play a track and this genre lands here.</p>
      ) : (
        // Below lg: one row that scrolls sideways, bleeding to the screen edges (py/px keep the current-pill ring unclipped).
        <ul
          className="flex gap-2 py-1 max-lg:-mx-6 max-lg:[scrollbar-width:none] max-lg:gap-3 max-lg:overflow-x-auto max-lg:px-6 lg:-m-1 lg:flex-wrap lg:p-1"
          aria-live="polite"
        >
          {items.map(({ id, name }) => {
            const g = { name, slug: id };
            const current = g.slug === params.genre;
            const [bg, fg, hole] = toneFor(g.slug);
            return (
              <li key={id} className={`shrink-0 ${initial.has(id) ? "" : "recent-finds-new"}`}>
                {/* Below lg: a mini sleeve (tone + die-cut hole) with the name under it, like the crate. lg+: tone pill. */}
                <Link
                  href={`/${g.slug}`}
                  aria-current={current ? "page" : undefined}
                  style={{ "--find-bg": bg, "--find-fg": fg, "--find-hole": hole } as CSSProperties}
                  className={`recent-finds-item flex font-semibold max-lg:w-[76px] max-lg:flex-col max-lg:gap-1.5 max-lg:rounded-lg max-lg:text-[13px] max-lg:leading-tight lg:max-w-[16rem] lg:items-center lg:gap-2 lg:rounded-full lg:border-[1.5px] lg:border-border-strong lg:bg-(--find-bg) lg:py-1 lg:pr-4 lg:pl-1 lg:text-[15px] lg:text-(--find-fg) lg:touch:py-[7px] ${current ? "lg:outline-2 lg:outline-offset-2 lg:outline-border-strong" : ""} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink`}
                >
                  <span className="recent-finds-cover lg:hidden" aria-hidden="true" />
                  <Vinyl size={28} rings={3} label={hole} className="recent-finds-disc max-lg:hidden" />
                  <span className="max-lg:line-clamp-2 lg:truncate">{g.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
