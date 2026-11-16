"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { X } from "lucide-react";
import { Vinyl } from "@/components/brand/vinyl";
import { toneFor } from "@/features/crate";
import { useHistoryState } from "./history-provider";
import "./recent-finds.css";

const UNDO_MS = 6000; // same as the home History panel

/**
 * Compact History trail for the genre page: one click back to a recent find, and visible proof that
 * playing a track kept the genre. Each pill wears its genre's sleeve tone, like the crate tabs. Current genre = Sumi ring.
 * A find can be dropped (✕, with undo); clearing all stays on the home page.
 */
export function RecentFinds() {
  const { items, loaded, remove, lastRemoved, undoRemove, dismissUndo } = useHistoryState();
  const params = useParams<{ genre?: string }>();
  const undoRef = useRef<HTMLButtonElement>(null);
  const focusUndo = useRef(false); // set by a keyboard ✕
  // Entries present once History is read don't animate; only a genre added while here drops in.
  const [initial, setInitial] = useState<Set<string> | null>(null);
  if (loaded && !initial) setInitial(new Set(items.map((x) => x.id)));

  // The undo offer expires after a few seconds.
  useEffect(() => {
    if (!lastRemoved) return;
    const t = setTimeout(dismissUndo, UNDO_MS);
    return () => clearTimeout(t);
  }, [lastRemoved, dismissUndo]);

  // Keyboard removal: the ✕ disappears, so focus lands on Undo instead of the page body.
  useEffect(() => {
    if (focusUndo.current && lastRemoved) undoRef.current?.focus();
    focusUndo.current = false;
  }, [lastRemoved]);

  return (
    <section aria-labelledby="recent-finds-title" className="flex flex-col gap-3">
      <h2 id="recent-finds-title" className="font-display text-[18px] font-extrabold tracking-[-0.02em]">
        Your finds
      </h2>
      {!loaded ? null : items.length === 0 ? (
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
              <li
                key={id}
                style={{ "--find-bg": bg, "--find-fg": fg, "--find-hole": hole } as CSSProperties}
                className={`recent-finds-entry group relative shrink-0 ${initial && !initial.has(id) ? "recent-finds-new" : ""}`}
              >
                {/* Below lg: a mini sleeve (tone + die-cut hole) with the name under it, like the crate. lg+: tone pill. */}
                <Link
                  href={`/${g.slug}`}
                  aria-current={current ? "page" : undefined}
                  className={`recent-finds-item flex font-semibold max-lg:w-[76px] max-lg:flex-col max-lg:gap-1.5 max-lg:rounded-lg max-lg:text-[13px] max-lg:leading-tight lg:max-w-[16rem] lg:items-center lg:gap-2 lg:rounded-full lg:border-[1.5px] lg:border-border-strong lg:bg-(--find-bg) lg:py-1 lg:pr-10 lg:pl-1 lg:text-[15px] lg:text-(--find-fg) lg:touch:py-[7px] ${current ? "lg:outline-2 lg:outline-offset-2 lg:outline-border-strong" : ""} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink`}
                >
                  <span className="recent-finds-cover lg:hidden" aria-hidden="true" />
                  <Vinyl size={28} rings={3} label={hole} className="recent-finds-disc max-lg:hidden" />
                  <span className="max-lg:line-clamp-2 lg:truncate">{g.name}</span>
                </Link>
                {/* ✕ on hover / keyboard focus with a pointer; always visible on touch; always reachable by Tab.
                    lg: inside the pill's reserved right end, in the tone's ink. <lg: a price-tag dot on the sleeve corner. */}
                <button
                  type="button"
                  onClick={(e) => {
                    focusUndo.current = e.detail === 0;
                    remove(id);
                  }}
                  aria-label={`Remove ${g.name} from your finds`}
                  className="recent-finds-remove opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink touch:opacity-100"
                >
                  <X size={14} strokeWidth={2.75} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <div aria-live="polite">
        {lastRemoved && (
          <p className="flex items-center gap-3 text-sm">
            <span className="min-w-0 truncate text-muted-foreground">
              Removed <span className="font-semibold text-foreground">{lastRemoved.name}</span>
            </span>
            <button
              ref={undoRef}
              type="button"
              onClick={undoRemove}
              className="inline-flex items-center rounded text-[15px] font-semibold text-primary-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink touch:min-h-11"
            >
              Undo
            </button>
          </p>
        )}
      </div>
    </section>
  );
}
