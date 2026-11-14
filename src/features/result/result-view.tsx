"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Shuffle } from "lucide-react";
import type { Genre } from "@/domain/genre";
import { toneFor } from "@/features/crate";
import { RecentFinds, useHistoryState } from "@/features/history";
import { useRandomize } from "@/features/randomizer";
import { lastInputWasKeyboard } from "@/lib/input-modality";
import { blurIfPointer } from "@/lib/utils";
import { BusyNotice, Notice } from "./notice";
import { PlayerSlot } from "./player-slot";
import { TrackList, TrackSkeleton } from "./track-list";
import { Turntable } from "./turntable";
import { useResult } from "./use-result";
import "./result-view.css";

const focusRing = "focus-visible:outline-primary-ink focus-visible:outline-2 focus-visible:outline-offset-2";

type ResultViewProps = { genre: Genre; catalogIndex: number };

/** Genre page body: the record lands on a turntable; tracks + recent finds beside it. Spec: docs/design/result-screen-brief.md. */
export function ResultView({ genre, catalogIndex }: ResultViewProps) {
  const history = useHistoryState();
  const randomize = useRandomize();
  const { status, trackCount, tracks, playingId, retryAfter, retry, playTrack } = useResult(
    genre,
    catalogIndex,
    history.add,
  );
  // Genre Tone Rule: the genre's sleeve tone travels with it (turntable, playing row). AA-safe pairs.
  const [toneBg, toneFg, hole] = toneFor(catalogIndex);
  // Light tones (Seiji 1.89:1, Aged Paper 1.15:1 against the page) can't mark a row by fill alone:
  // their playing row gets a Sumi edge, and the cue tint is mixed from Sumi instead of the tone.
  const lightTone = toneBg === "var(--primary)" || toneBg === "var(--muted)";
  const toneVars = {
    "--genre-bg": toneBg,
    "--genre-fg": toneFg,
    "--genre-edge": lightTone ? "var(--border-strong)" : "transparent",
    "--genre-cue": lightTone ? "var(--border-strong)" : toneBg,
  } as CSSProperties;
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Keyboard/screen-reader users land on the result when it arrives. Focus goes to the heading
  // (not a track button) so the global Space shortcut still means "roll again".
  useEffect(() => {
    if (status !== "loading") {
      const h = headingRef.current;
      if (!h) return;
      // Ring only for keyboard users (Chromium ignores the focusVisible option on programmatic focus).
      h.dataset.kbd = String(lastInputWasKeyboard());
      h.focus({ preventScroll: true });
    }
  }, [status]);

  const playing = tracks.find((t) => t.id === playingId) ?? null;
  // PLACEHOLDER: Spotify search until the catalog provides the playlist URL (E1).
  const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(`The Sound of ${genre.name}`)}`;
  // Long names (e.g. "Musica Popular Brasileira Contemporanea") step down so the title stays within ~2 lines.
  const titleSize = genre.name.length > 22 ? "text-[48px]" : "text-[56px] xl:text-[64px]";

  return (
    <section aria-labelledby="result-title" className="flex min-w-0 flex-1 flex-col" style={toneVars}>
      <p className="sr-only" aria-live="polite">
        {status === "loading" && `Loading ${genre.name}…`}
        {status === "ready" && `${genre.name}: ${tracks.length} tracks ready.`}
        {status === "empty" && `${genre.name}: no playable tracks.`}
        {status === "error" && `Couldn't load ${genre.name}.`}
        {status === "busy" && `Spotify is busy. Try ${genre.name} again in ${retryAfter} seconds.`}
      </p>

      {/* DOM order = reading order: Back → deck (decorative) → title, tracks, finds → player.
          The grid puts the player under the deck on desktop. */}
      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-y-4">
        <div className="flex flex-col items-start gap-4">
          <Link
            href="/"
            className={`text-primary-ink hover:bg-primary-ink/10 -ml-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[15px] font-semibold transition-colors ${focusRing}`}
          >
            <ArrowLeft size={18} strokeWidth={2.5} aria-hidden="true" />
            Back to the crate
          </Link>
          <Turntable
            label={hole}
            spinning={status === "loading" || playing !== null}
            armDown={playing !== null}
            trackCount={tracks.length}
            track={playing ? tracks.indexOf(playing) : null}
            record={status !== "error" && status !== "busy"}
            arrive
          />
        </div>

        <div className="flex min-w-0 flex-col gap-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {/* Title and page actions share one line, so the page fits the home's height (no corner-vinyl jump). */}
          <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
            <div className="flex min-w-0 flex-1 basis-80 flex-col gap-3">
              <h1
                id="result-title"
                ref={headingRef}
                tabIndex={-1}
                className={`font-display ${titleSize} leading-[0.95] font-extrabold tracking-[-0.02em] self-start text-balance outline-none rounded-sm data-[kbd=true]:focus:outline-primary-ink data-[kbd=true]:focus:outline-2 data-[kbd=true]:focus:outline-solid data-[kbd=true]:focus:outline-offset-4`}
              >
                {genre.name}
              </h1>
              <p className="text-muted-foreground text-[15px] leading-6">
                <span className="font-mono">
                  {status === "loading"
                    ? "Pulling the record…"
                    : trackCount > 0
                      ? `${trackCount} tracks in the playlist`
                      : " "}
                </span>
                {status === "ready" && !playing && <span> · pick one to start listening</span>}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              {status !== "loading" && (
                <a
                  href={spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-primary-ink inline-flex items-center gap-1 rounded py-1.5 text-[15px] font-semibold underline-offset-4 hover:underline ${focusRing}`}
                >
                  Listen more on Spotify
                  <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              <button
                type="button"
                onClick={(e) => {
                  blurIfPointer(e);
                  randomize();
                }}
                className={`border-border-strong hover:bg-muted/50 inline-flex items-center gap-2 rounded-xl border-[1.5px] px-5 py-2.5 text-[17px] font-bold transition-colors active:translate-y-px ${focusRing}`}
              >
                <Shuffle size={20} strokeWidth={2.5} aria-hidden="true" />
                Roll again
              </button>
            </div>
          </div>

          <div key={status} className="result-body">
            {status === "ready" && <TrackList tracks={tracks} playingId={playingId} onPlay={playTrack} />}
            {status === "loading" && <TrackSkeleton />}
            {status === "empty" && (
              <Notice title="This record is blank" body="None of this playlist's tracks can be played here." />
            )}
            {status === "error" && (
              <Notice
                title="Couldn't pull this record"
                body="Something went wrong while loading the tracks from Spotify."
                action={{ label: "Try again", onClick: retry }}
              />
            )}
            {status === "busy" && <BusyNotice seconds={retryAfter} onRetry={retry} />}
          </div>

          <div className="border-divider mt-auto border-t pt-5">
            <RecentFinds />
          </div>
        </div>

        {/* Always in the layout (hidden outside "ready") so loading → ready → error never changes the page height. */}
        <div
          className={`lg:col-start-1 lg:row-start-2 lg:self-start ${status === "ready" ? "" : "invisible max-lg:hidden"}`}
          aria-hidden={status !== "ready" || undefined}
        >
          <PlayerSlot track={playing} spotifyUrl={spotifyUrl} />
        </div>
      </div>
    </section>
  );
}
