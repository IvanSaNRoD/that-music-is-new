import { ChevronRight, History, X } from "lucide-react";
import type { Genre } from "@/domain/genres";
import type { HistoryItem } from "@/hooks/use-crate";
import { Vinyl } from "./vinyl";

type HistoryPanelProps = {
  catalog: Genre[];
  items: HistoryItem[];
  selected: string;
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
};

export function HistoryPanel({ catalog, items, selected, onOpen, onRemove, onClear }: HistoryPanelProps) {
  return (
    <section
      aria-labelledby="history-title"
      className="bg-card border-border-strong flex min-h-[500px] flex-col overflow-hidden rounded-2xl border-[1.5px] lg:w-80 lg:shrink-0"
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h2 id="history-title" className="font-display text-[30px] font-extrabold tracking-[-0.02em]">
          History
        </h2>
        <History size={24} strokeWidth={2.25} aria-hidden="true" />
      </div>

      {items.length === 0 ? (
        <p className="border-divider text-muted-foreground flex-1 border-t px-5 py-6 text-sm">
          Nothing here yet. Randomize a genre and it shows up here.
        </p>
      ) : (
        <ul className="flex-1">
          {items.map(({ id, date }) => {
            const g = catalog.find((x) => x.id === id);
            if (!g) return null;
            const isSelected = id === selected;
            return (
              <li
                key={id}
                className={`group border-divider relative border-t transition-colors hover:bg-muted ${isSelected ? "bg-muted" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => onOpen(id)}
                  aria-current={isSelected || undefined}
                  className="focus-visible:outline-primary-ink flex w-full items-center gap-3.5 py-4 pr-4 pl-5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2"
                >
                  <Vinyl size={44} />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-[17px] font-bold">{g.name}</span>
                    <span className="text-muted-foreground font-mono text-[13px]">10 tracks · {date}</span>
                  </span>
                  <ChevronRight
                    size={20}
                    aria-hidden="true"
                    className="transition-opacity group-focus-within:opacity-0 group-hover:opacity-0"
                  />
                </button>
                {/* ✕ only on hover / keyboard focus (desktop); always reachable by Tab. */}
                <button
                  type="button"
                  onClick={() => onRemove(id)}
                  aria-label={`Remove ${g.name} from history`}
                  className="hover:bg-background focus-visible:outline-primary-ink absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:outline-2"
                >
                  <X size={16} strokeWidth={2.75} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="border-divider border-t px-5 py-4">
        <button
          type="button"
          onClick={onClear}
          disabled={items.length === 0}
          className="text-primary-ink focus-visible:outline-primary-ink rounded text-[15px] font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
        >
          Clear all history
        </button>
      </div>
    </section>
  );
}
