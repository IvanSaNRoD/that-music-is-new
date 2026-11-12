import type { CSSProperties } from "react";
import { Play } from "lucide-react";
import type { Genre } from "@/domain/genres";
import { blurIfPointer } from "@/lib/utils";
import "./crate-flip.css";

// Sleeve [bg, text, hole] by catalog index % 5 — text pairs WCAG AA; no white/card sleeve (blends into the panel).
// "hole" = the die-cut circle showing the record label; picked to contrast with the sleeve.
const TONES = [
  ["var(--primary)", "var(--foreground)", "var(--background)"],
  ["var(--foreground)", "var(--background)", "var(--primary)"],
  ["var(--muted)", "var(--foreground)", "var(--primary-ink)"],
  ["var(--primary-ink)", "var(--background)", "var(--background)"],
  ["var(--muted-foreground)", "var(--background)", "var(--primary)"],
] as const;

type CrateFlipProps = {
  catalog: Genre[];
  stock: string[];
  selected: string;
  onSelect: (id: string) => void;
  onRestock: () => void;
  onPlay?: (genre: Genre) => void;
};

export function CrateFlip({ catalog, stock, selected, onSelect, onRestock, onPlay }: CrateFlipProps) {
  return (
    <section
      aria-label="Genre crate"
      className="bg-card border-border-strong flex min-h-[500px] min-w-0 flex-1 flex-col gap-3.5 lg:ml-[3%] overflow-hidden rounded-2xl border-[1.5px] p-[26px]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[30px] font-extrabold tracking-[-0.02em] whitespace-nowrap">
          The crate
        </h2>
        <button
          type="button"
          onClick={(e) => {
            blurIfPointer(e);
            onRestock();
          }}
          className="text-primary-ink hover:bg-primary-ink/10 active:bg-primary-ink/[0.18] focus-visible:outline-primary-ink rounded-full px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Restock
        </button>
      </div>

      <div className="crate-stack">
        {stock.map((id) => {
          const index = catalog.findIndex((x) => x.id === id);
          const g = catalog[index];
          const [bg, fg, hole] = TONES[index % TONES.length];
          const open = id === selected;
          return (
            <button
              key={id}
              type="button"
              className="crate-sleeve"
              aria-expanded={open}
              aria-label={open ? `Play 10 tracks of ${g.name}` : g.name}
              style={{ "--sleeve-bg": bg, "--sleeve-fg": fg, "--sleeve-hole": hole } as CSSProperties}
              onClick={(e) => {
                blurIfPointer(e);
                if (open) onPlay?.(g);
                else onSelect(id);
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
