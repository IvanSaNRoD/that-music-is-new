"use client";

import { useRef, useState, type CSSProperties } from "react";
import { Play } from "lucide-react";
import type { Genre } from "@/domain/genre";
import { lastInputWasKeyboard } from "@/lib/input-modality";
import { blurIfPointer } from "@/lib/utils";
import "./crate-flip.css";
import { toneFor } from "./tones";

type CrateFlipProps = {
  genres: Genre[];
  status: "loading" | "ready" | "error";
  selected?: string;
  onSelect: (slug: string) => void;
  onRestock: () => void;
  onPlay?: (genre: Genre) => void;
};

export function CrateFlip({ genres, status, selected, onSelect, onRestock, onPlay }: CrateFlipProps) {
  const loading = status === "loading";
  // Restock: the old sleeves stay (dimmed, inert) until the new ones arrive, so the crate never looks empty (#57).
  const restocking = loading && genres.length > 0;
  // Sleeves drop in only when fresh genres arrive while this crate is on screen, not when the home remounts it
  // with the crate kept in CrateProvider (state adjusted during render, React's "storing info from previous renders").
  const [sawLoading, setSawLoading] = useState(loading);
  if (loading && !sawLoading) setSawLoading(true);
  const restockRef = useRef<HTMLButtonElement>(null);

  return (
    <section
      aria-label="Genre crate"
      className="flex min-h-[500px] min-w-0 flex-1 flex-col gap-3.5 overflow-hidden rounded-2xl border-[1.5px] border-border-strong bg-card p-[26px] lg:ml-[3%]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[30px] font-extrabold tracking-[-0.02em] whitespace-nowrap">The crate</h2>
        <button
          ref={restockRef}
          type="button"
          onClick={(e) => {
            blurIfPointer(e);
            onRestock();
          }}
          className="rounded-full px-3 py-1.5 text-sm font-semibold text-primary-ink transition-colors hover:bg-primary-ink/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink active:bg-primary-ink/[0.18] touch:min-h-11"
        >
          Restock
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {loading && LOADING_MESSAGE}
        {status === "error" && "Couldn't fill the crate."}
      </p>

      {/* aria-busy on the stack only: the live region above stays outside it, so screen readers announce it. */}
      <div
        className="crate-stack"
        aria-busy={loading}
        data-loading={loading || undefined}
        data-arrive={sawLoading || undefined}
      >
        {status !== "ready" && !restocking && <EmptySleeves />}
        {loading && !restocking && (
          <div className="crate-message" aria-hidden="true">
            <p className="font-display text-[18px] leading-tight font-extrabold tracking-[-0.02em]">
              {LOADING_MESSAGE}
            </p>
            <p className="text-[15px] text-muted-foreground">Pulling eight rare genres for you.</p>
          </div>
        )}
        {status === "error" && (
          <div className="crate-message">
            <p className="font-display text-[18px] leading-tight font-extrabold tracking-[-0.02em]">
              Couldn&apos;t fill the crate
            </p>
            <p className="text-[15px] text-muted-foreground">The record bins didn&apos;t answer. Give it another go.</p>
            <button
              type="button"
              onClick={(e) => {
                blurIfPointer(e);
                onRestock();
                // This button leaves with the error: keyboard focus moves to Restock instead of the page body.
                if (lastInputWasKeyboard()) restockRef.current?.focus();
              }}
              className="mt-1 self-start rounded-full border-[1.5px] border-border-strong px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink touch:min-h-11"
            >
              Try again
            </button>
          </div>
        )}
        {(status === "ready" || restocking) &&
          genres.map((g, i) => {
            const [bg, fg, hole] = toneFor(g.slug);
            const open = g.slug === selected;
            return (
              <button
                key={g.slug}
                type="button"
                className="crate-sleeve"
                inert={restocking}
                aria-expanded={open}
                aria-label={open ? `${g.name}, play 10 tracks` : g.name} // visible text in the name (WCAG 2.5.3)
                style={{ "--sleeve-bg": bg, "--sleeve-fg": fg, "--sleeve-hole": hole, "--i": i } as CSSProperties}
                onClick={(e) => {
                  blurIfPointer(e);
                  if (open) onPlay?.(g);
                  else onSelect(g.slug);
                }}
              >
                {/* All parts always rendered: CSS reveals them as the sleeve rises (smooth open/close). */}
                <span className="crate-tab" aria-hidden={open}>
                  {g.name}
                </span>
                <span
                  className="crate-name"
                  data-length={nameLength(g.name)}
                  style={{ "--name-chars": g.name.length } as CSSProperties}
                  aria-hidden={!open}
                >
                  {g.name}
                </span>
                <span className="crate-play inline-flex items-center gap-1.5" aria-hidden={!open}>
                  <Play size={14} strokeWidth={2.75} fill="currentColor" aria-hidden="true" />
                  Play 10 tracks
                </span>
                <span className="crate-hole" aria-hidden="true" />
              </button>
            );
          })}
        <div className="crate-front" aria-hidden="true" />
      </div>
    </section>
  );
}

const LOADING_MESSAGE = "Digging through the bins…";

/** Size step for the open sleeve's name (crate-flip.css): long names step down so the Play pill never moves. */
const nameLength = (name: string) => (name.length <= 15 ? "short" : name.length <= 30 ? "medium" : "long");

/** Stand-in sleeves while the crate first loads (or failed): same geometry as 8 real ones, so nothing jumps. */
function EmptySleeves() {
  return Array.from({ length: 8 }, (_, i) => (
    <span
      key={i}
      aria-hidden="true"
      className="crate-sleeve crate-sleeve-empty"
      style={{ "--i": i } as CSSProperties}
      data-open={i === 0 || undefined}
    />
  ));
}
