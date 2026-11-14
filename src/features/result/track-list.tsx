"use client";

import { AudioLines, Play } from "lucide-react";
import type { Track } from "@/domain/track";
import { blurIfPointer } from "@/lib/utils";

// Playing row = the genre tone (--genre-bg/--genre-fg/--genre-edge, set by ResultView).
// Before the first play, row 01 is "cued": a soft tint (--genre-cue at 14%) and a resting ▶, so the primary
// action reads at a glance. No ring: rings are reserved for keyboard focus.
// Two columns of five from 1024px (01–05 | 06–10), so the list matches the deck's height.
const listLayout = "grid gap-x-6 gap-y-0.5 lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-5";

export function TrackList({
  tracks,
  playingId,
  onPlay,
}: {
  tracks: Track[];
  playingId: string | null;
  onPlay: (id: string) => void;
}) {
  return (
    <ol className={listLayout} aria-label="Tracks">
      {tracks.map((t, i) => {
        const isPlaying = t.id === playingId;
        const cued = playingId === null && i === 0;
        return (
          <li key={t.id} className="min-w-0">
            <button
              type="button"
              aria-current={isPlaying || undefined}
              onClick={(e) => {
                blurIfPointer(e);
                onPlay(t.id);
              }}
              className={`group flex w-full items-center gap-4 rounded-full px-4 py-2 text-left transition-colors ${isPlaying ? "bg-(--genre-bg) text-(--genre-fg) inset-ring-[1.5px] inset-ring-(--genre-edge)" : cued ? "bg-[color-mix(in_srgb,var(--genre-cue)_14%,transparent)]" : "hover:bg-muted/50"} focus-visible:outline-primary-ink focus-visible:outline-2 focus-visible:outline-offset-0`}
            >
              <span
                className={`${isPlaying ? "" : "text-muted-foreground"} w-6 shrink-0 text-right font-mono text-[13px]`}
                aria-hidden="true"
              >
                {isPlaying ? (
                  <AudioLines size={18} strokeWidth={2.5} className="ml-auto" />
                ) : (
                  <>
                    <span className={cued ? "hidden" : "group-hover:hidden group-focus-visible:hidden"}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Play
                      size={14}
                      strokeWidth={2.5}
                      fill="currentColor"
                      className={`text-foreground ml-auto ${cued ? "block" : "hidden group-hover:block group-focus-visible:block"}`}
                    />
                  </>
                )}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[16px] font-bold">{t.title}</span>
                {/* Separator for the accessible name ("Title by Artist"), not "TitleArtist". */}
                <span className="sr-only">by </span>
                {/* On the tone fill, secondary text keeps the full tone foreground (alpha would break AA on Seiji Ink). */}
                <span className={`${isPlaying ? "" : "text-muted-foreground"} truncate text-sm`}>{t.artists}</span>
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
    <ol aria-hidden="true" className={listLayout}>
      {Array.from({ length: 10 }, (_, i) => (
        <li key={i} className="flex items-center gap-4 px-4 py-[13px]">
          <span className="bg-muted h-3 w-6 rounded motion-safe:animate-pulse" />
          <span className="flex flex-col gap-2">
            <span
              className="bg-muted h-3.5 rounded motion-safe:animate-pulse"
              style={{ width: 120 + ((i * 53) % 100) }}
            />
            <span className="bg-muted/70 h-3 w-24 rounded motion-safe:animate-pulse" />
          </span>
        </li>
      ))}
    </ol>
  );
}
