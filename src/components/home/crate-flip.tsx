import type { CSSProperties } from "react";
import { Play } from "lucide-react";
import type { Genre } from "@/domain/genres";
import "./crate-flip.css";

// Sleeve [bg, text] pairs by catalog index % 6 — alternating light/dark, all WCAG AA.
const TONES = [
  ["var(--primary)", "var(--foreground)"],
  ["var(--foreground)", "var(--background)"],
  ["var(--card)", "var(--foreground)"],
  ["var(--primary-ink)", "var(--background)"],
  ["var(--muted)", "var(--foreground)"],
  ["var(--muted-foreground)", "var(--background)"],
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
      className="bg-card border-border-strong flex min-h-[500px] min-w-0 flex-1 flex-col gap-3.5 overflow-hidden rounded-2xl border-[1.5px] p-[26px]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-extrabold tracking-[-0.02em] whitespace-nowrap">
          The crate
        </h2>
        <button
          type="button"
          onClick={onRestock}
          className="text-primary-ink hover:bg-primary-ink/10 active:bg-primary-ink/[0.18] focus-visible:outline-primary-ink rounded-full px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Restock
        </button>
      </div>

      <div className="crate-stack">
        {stock.map((id) => {
          const index = catalog.findIndex((x) => x.id === id);
          const g = catalog[index];
          const [bg, fg] = TONES[index % TONES.length];
          const open = id === selected;
          return (
            <button
              key={id}
              type="button"
              className="crate-sleeve"
              aria-expanded={open}
              aria-label={open ? `Play 10 tracks of ${g.name}` : g.name}
              style={{ "--sleeve-bg": bg, "--sleeve-fg": fg } as CSSProperties}
              onClick={() => (open ? onPlay?.(g) : onSelect(id))}
            >
              <span className="crate-tab">{g.name}</span>
              {open && (
                <>
                  <span className="crate-name">{g.name}</span>
                  <span className="crate-meta">
                    {g.origin} · {g.era}
                  </span>
                  <span className="crate-play inline-flex items-center gap-1.5">
                    <Play size={14} strokeWidth={2.75} fill="currentColor" aria-hidden="true" />
                    Play 10 tracks
                  </span>
                </>
              )}
            </button>
          );
        })}
        <div className="crate-front" aria-hidden="true" />
      </div>
    </section>
  );
}
