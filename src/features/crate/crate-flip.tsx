import type { CSSProperties } from "react";
import { Play } from "lucide-react";
import type { Genre } from "@/domain/genre";
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
  return (
    <section
      aria-label="Genre crate"
      aria-busy={status === "loading"}
      className="flex min-h-[500px] min-w-0 flex-1 flex-col gap-3.5 overflow-hidden rounded-2xl border-[1.5px] border-border-strong bg-card p-[26px] lg:ml-[3%]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[30px] font-extrabold tracking-[-0.02em] whitespace-nowrap">The crate</h2>
        <button
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
        {status === "loading" && "Filling the crate…"}
        {status === "error" && "Couldn't fill the crate."}
      </p>

      <div className="crate-stack">
        {status !== "ready" && <EmptySleeves pulsing={status === "loading"} />}
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
              }}
              className="mt-1 self-start rounded-full border-[1.5px] border-border-strong px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink touch:min-h-11"
            >
              Try again
            </button>
          </div>
        )}
        {status === "ready" &&
          genres.map((g) => {
            const [bg, fg, hole] = toneFor(g.slug);
            const open = g.slug === selected;
            return (
              <button
                key={g.slug}
                type="button"
                className="crate-sleeve"
                aria-expanded={open}
                aria-label={open ? `Play 10 tracks of ${g.name}` : g.name}
                style={{ "--sleeve-bg": bg, "--sleeve-fg": fg, "--sleeve-hole": hole } as CSSProperties}
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
                <span className="crate-name" aria-hidden={!open}>
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

/** Stand-in sleeves while the crate loads (or failed): same geometry as 8 real ones, so nothing jumps. */
function EmptySleeves({ pulsing }: { pulsing: boolean }) {
  return Array.from({ length: 8 }, (_, i) => (
    <span
      key={i}
      aria-hidden="true"
      className={`crate-sleeve crate-sleeve-empty ${pulsing ? "motion-safe:animate-pulse" : ""}`}
      data-open={i === 0 || undefined}
    />
  ));
}
