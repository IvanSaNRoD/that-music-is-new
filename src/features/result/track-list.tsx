"use client";

import { AudioLines } from "lucide-react";
import type { Track } from "@/domain/track";
import { blurIfPointer } from "@/lib/utils";

export function TrackList({ tracks, playingId, onPlay }: { tracks: Track[]; playingId: string | null; onPlay: (id: string) => void }) {
  return (
    <ol className="bg-card border-border-strong overflow-hidden rounded-2xl border-[1.5px]" aria-label="Tracks">
      {tracks.map((t, i) => {
        const isPlaying = t.id === playingId;
        return (
          <li key={t.id} className="border-divider border-t first:border-t-0">
            <button
              type="button"
              aria-current={isPlaying || undefined}
              onClick={(e) => {
                blurIfPointer(e);
                onPlay(t.id);
              }}
              className={`flex w-full items-center gap-4 px-5 py-3 text-left transition-colors ${isPlaying ? "bg-muted" : "hover:bg-muted/50"} focus-visible:outline-primary-ink focus-visible:outline-2 focus-visible:-outline-offset-2`}
            >
              <span className="text-muted-foreground w-6 shrink-0 text-right font-mono text-[13px]" aria-hidden="true">
                {isPlaying ? (
                  <AudioLines size={18} strokeWidth={2.5} className="text-primary-ink ml-auto" />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[16px] font-bold">{t.title}</span>
                <span className="text-muted-foreground truncate text-sm">{t.artists}</span>
              </span>
              {isPlaying && <span className="sr-only">(now playing)</span>}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export function TrackSkeleton() {
  return (
    <ol aria-hidden="true" className="bg-card border-border-strong overflow-hidden rounded-2xl border-[1.5px]">
      {Array.from({ length: 10 }, (_, i) => (
        <li key={i} className="border-divider flex items-center gap-4 border-t px-5 py-[15px] first:border-t-0">
          <span className="bg-muted h-3 w-6 rounded motion-safe:animate-pulse" />
          <span className="flex flex-col gap-2">
            <span className="bg-muted h-3.5 rounded motion-safe:animate-pulse" style={{ width: 140 + ((i * 53) % 120) }} />
            <span className="bg-muted/70 h-3 w-24 rounded motion-safe:animate-pulse" />
          </span>
        </li>
      ))}
    </ol>
  );
}
