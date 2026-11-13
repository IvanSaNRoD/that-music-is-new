"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Shuffle } from "lucide-react";
import { Vinyl } from "@/components/brand/vinyl";
import type { Genre } from "@/domain/genre";
import { toneFor } from "@/features/crate";
import { useHistoryState } from "@/features/history";
import { useRandomize } from "@/features/randomizer";
import { blurIfPointer } from "@/lib/utils";
import { BusyNotice, Notice } from "./notice";
import { PlayerSlot } from "./player-slot";
import { TrackList, TrackSkeleton } from "./track-list";
import { useResult } from "./use-result";
import "./result-view.css";

const focusRing = "focus-visible:outline-primary-ink focus-visible:outline-2 focus-visible:outline-offset-2";

type ResultViewProps = { genre: Genre; catalogIndex: number };

/** Genre page body ("the record comes out of the sleeve"). Spec: docs/design/result-screen-brief.md. */
export function ResultView({ genre, catalogIndex }: ResultViewProps) {
  const history = useHistoryState();
  const randomize = useRandomize();
  const { status, trackCount, tracks, playingId, retryAfter, retry, playTrack } = useResult(
    genre,
    catalogIndex,
    history.add,
  );
  const [bg, fg, hole] = toneFor(catalogIndex);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Keyboard/screen-reader users land on the result when it arrives. Focus goes to the heading
  // (not a track button) so the global Space shortcut still means "roll again".
  useEffect(() => {
    if (status !== "loading") headingRef.current?.focus({ preventScroll: true });
  }, [status]);

  const playing = tracks.find((t) => t.id === playingId) ?? null;

  return (
    <section aria-labelledby="result-title" className="flex min-w-0 flex-1 flex-col gap-5">
      <p className="sr-only" aria-live="polite">
        {status === "loading" && `Loading ${genre.name}…`}
        {status === "ready" && `${genre.name}: ${tracks.length} tracks ready.`}
        {status === "empty" && `${genre.name}: no playable tracks.`}
        {(status === "error" || status === "busy") && `Couldn't load ${genre.name}.`}
      </p>

      <Link
        href="/"
        className={`text-primary-ink hover:bg-primary-ink/10 -ml-3 inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-[15px] font-semibold transition-colors ${focusRing}`}
      >
        <ArrowLeft size={18} strokeWidth={2.5} aria-hidden="true" />
        Back to the crate
      </Link>

      <div className="result-head">
        <div className={`result-record ${status === "loading" ? "is-spinning" : ""}`}>
          <Vinyl size={220} detailed label={hole} />
        </div>
        <div
          className="result-sleeve flex flex-col gap-4 px-8 pt-7 pb-8"
          style={{ "--sleeve-bg": bg, "--sleeve-fg": fg } as CSSProperties}
        >
          <h1
            id="result-title"
            ref={headingRef}
            tabIndex={-1}
            className="font-display max-w-[calc(100%-280px)] text-[64px] leading-[0.95] font-extrabold tracking-[-0.02em] text-balance outline-none"
          >
            {genre.name}
          </h1>
          <p className="font-mono text-[15px]">
            {status === "loading" ? "Pulling the record…" : trackCount > 0 ? `${trackCount} tracks in the playlist` : " "}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={(e) => {
                blurIfPointer(e);
                randomize();
              }}
              className={`inline-flex items-center gap-2 rounded-xl border-[1.5px] border-current px-5 py-2.5 text-[17px] font-bold transition-colors hover:bg-[color-mix(in_srgb,currentColor_10%,transparent)] ${focusRing}`}
            >
              <Shuffle size={20} strokeWidth={2.5} aria-hidden="true" />
              Roll again
            </button>
            {status === "ready" && (
              // PLACEHOLDER: Spotify search until the catalog provides the playlist URL (E1).
              <a
                href={`https://open.spotify.com/search/${encodeURIComponent(`The Sound of ${genre.name}`)}`}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1 rounded text-[15px] font-semibold underline underline-offset-4 ${focusRing}`}
              >
                Listen more on Spotify
                <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div key={status} className="result-body grid gap-5 xl:grid-cols-[1fr_300px]">
        {status === "ready" && <TrackList tracks={tracks} playingId={playingId} onPlay={playTrack} />}
        {status === "loading" && <TrackSkeleton />}
        {status === "empty" && (
          <Notice
            title="This record is blank"
            body="None of this playlist's tracks can be played here."
            action={{ label: "Roll again", onClick: randomize }}
          />
        )}
        {status === "error" && (
          <Notice
            title="Couldn't pull this record"
            body="Something went wrong while loading the tracks from Spotify."
            action={{ label: "Try again", onClick: retry }}
          />
        )}
        {status === "busy" && <BusyNotice seconds={retryAfter} onRetry={retry} />}
        {status === "ready" && <PlayerSlot track={playing} />}
      </div>
    </section>
  );
}
