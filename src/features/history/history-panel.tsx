"use client";

import { useEffect, useState } from "react";
import { ChevronRight, History, X } from "lucide-react";
import { Vinyl } from "@/components/brand/vinyl";
import type { HistoryItem } from "@/domain/history";
import { blurIfPointer } from "@/lib/utils";

const UNDO_MS = 6000;

/** "2026-11-16" → "16 Nov" (parsed as a local day, not UTC midnight). */
const shortDate = (iso: string) =>
  new Date(`${iso}T00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

type HistoryPanelProps = {
  items: HistoryItem[];
  /** False until History is read from storage (server render, hydration): no empty-state flash. */
  loaded: boolean;
  selected?: string;
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  lastRemoved: HistoryItem | null;
  onUndo: () => void;
  onDismissUndo: () => void;
};

const linkButton =
  "text-primary-ink focus-visible:outline-primary-ink touch:min-h-11 inline-flex items-center rounded text-[15px] font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2";

export function HistoryPanel({
  items,
  loaded,
  selected,
  onOpen,
  onRemove,
  onClear,
  lastRemoved,
  onUndo,
  onDismissUndo,
}: HistoryPanelProps) {
  // Inline confirmation for the destructive "Clear all" (PRD: clear all needs confirmation).
  const [confirming, setConfirming] = useState(false);

  // The undo offer for a single ✕ expires after a few seconds.
  useEffect(() => {
    if (!lastRemoved) return;
    const t = setTimeout(onDismissUndo, UNDO_MS);
    return () => clearTimeout(t);
  }, [lastRemoved, onDismissUndo]);

  return (
    <section
      aria-labelledby="history-title"
      className="flex flex-col overflow-hidden rounded-2xl border-[1.5px] border-border-strong bg-card lg:min-h-[500px] lg:w-[27%] lg:flex-none"
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h2 id="history-title" className="font-display text-[30px] font-extrabold tracking-[-0.02em]">
          History
        </h2>
        <History size={24} strokeWidth={2.25} aria-hidden="true" />
      </div>

      {!loaded ? (
        <div className="flex-1" />
      ) : items.length === 0 ? (
        <p className="flex-1 border-t border-divider px-5 py-6 text-sm text-muted-foreground">
          Nothing here yet. Play a genre and it lands here.
        </p>
      ) : (
        <ul className="flex-1">
          {items.map(({ id, name, date }) => {
            const g = { name, slug: id };
            const isSelected = id === selected;
            return (
              <li
                key={id}
                // Hover is a lighter tint than "selected", so the two states stay distinguishable.
                className={`group relative border-t border-divider transition-colors ${isSelected ? "bg-muted" : "hover:bg-muted/50"}`}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    blurIfPointer(e);
                    onOpen(id);
                  }}
                  aria-current={isSelected || undefined}
                  className="flex w-full items-center gap-3.5 py-4 pr-4 pl-5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-ink touch:pr-16"
                >
                  <Vinyl size={44} rings={4} />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-[17px] font-bold">{g.name}</span>
                    <span className="font-mono text-[13px] whitespace-nowrap text-muted-foreground">
                      10 tracks · {shortDate(date)}
                    </span>
                  </span>
                  <ChevronRight
                    size={20}
                    aria-hidden="true"
                    className="transition-opacity group-focus-within:opacity-0 group-hover:opacity-0 touch:hidden"
                  />
                </button>
                {/* ✕ on hover / keyboard focus with a pointer; always visible (44px) on touch; always reachable by Tab. */}
                <button
                  type="button"
                  onClick={() => onRemove(id)}
                  aria-label={`Remove ${g.name} from history`}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-background focus-visible:outline-2 focus-visible:outline-primary-ink touch:right-2 touch:p-3.5 touch:opacity-100"
                >
                  <X size={16} strokeWidth={2.75} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="border-t border-divider px-5 py-4" aria-live="polite">
        {lastRemoved ? (
          <p className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-muted-foreground">
              Removed <span className="font-semibold text-foreground">{lastRemoved.name}</span>
            </span>
            <button type="button" onClick={onUndo} className={linkButton}>
              Undo
            </button>
          </p>
        ) : confirming ? (
          <p className="flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-foreground">Clear all history?</span>
            <span className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="inline-flex items-center rounded text-[15px] font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink touch:min-h-11"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setConfirming(false);
                }}
                className="inline-flex items-center rounded text-[15px] font-semibold text-destructive underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink touch:min-h-11"
              >
                Clear
              </button>
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={items.length === 0}
            className={`${linkButton} disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50`}
          >
            Clear all history
          </button>
        )}
      </div>
    </section>
  );
}
