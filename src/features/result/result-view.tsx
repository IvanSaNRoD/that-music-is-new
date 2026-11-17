"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Shuffle } from "lucide-react";
import type { Genre } from "@/domain/genre";
import { toneFor } from "@/features/crate";
import { RecentFinds, useHistoryState } from "@/features/history";
import { useRandomize } from "@/features/randomizer";
import { lastInputWasKeyboard } from "@/lib/input-modality";
import { clearListenIntent, hasListenIntent } from "@/lib/listen-intent";
import { blurIfPointer } from "@/lib/utils";
import { BusyNotice, Notice } from "./notice";
import { PlayerSlot } from "./player-slot";
import { TrackTransport } from "./track-transport";
import { TrackList, TrackSkeleton } from "./track-list";
import { Turntable } from "./turntable";
import { useResult } from "./use-result";
import { useSpotifyPlayer } from "./use-spotify-player";
import "./result-view.css";

const focusRing = "focus-visible:outline-primary-ink focus-visible:outline-2 focus-visible:outline-offset-2";

type ResultViewProps = { genre: Genre };

/** Genre page body: the record lands on a turntable; tracks + recent finds beside it. Spec: docs/design/result-screen-brief.md. */
export function ResultView({ genre }: ResultViewProps) {
  const history = useHistoryState();
  const randomize = useRandomize();
  const { add: addToHistory } = history;
  const onFirstPlay = useCallback(() => addToHistory(genre), [addToHistory, genre]);
  const { status, total, tracks, playlistUrl, playingId, retryAfter, retry, playTrack } = useResult(
    genre.slug,
    onFirstPlay,
  );
  // Auto-advance (#55): when a track ends, the next one plays; after the last one, nothing (no loop).
  const player = useSpotifyPlayer({ onEnded: () => playAt(index + 1) });
  const firstTrack = tracks[0]?.id;
  const { cue, play: playEmbed } = player;
  // Opened with listening intent (Randomize, Roll again, sleeve Play; #67)? Read once, cleared on mount.
  const [autoplay] = useState(hasListenIntent);
  const autoplayed = useRef(false);
  useEffect(clearListenIntent, []);
  // Track 01 as soon as the tracks arrive: autoplayed with intent, otherwise cued so the first click plays
  // inside the gesture. Browsers that refuse the audio leave it cued: `player.blocked` shows the hint.
  useEffect(() => {
    if (!firstTrack) return;
    if (!autoplay) return cue(firstTrack);
    if (autoplayed.current) return; // once (StrictMode runs effects twice; `player` changes every render)
    autoplayed.current = true;
    playTrack(firstTrack);
    playEmbed(firstTrack);
  }, [firstTrack, cue, autoplay, playTrack, playEmbed]);
  // Inside the click: the embed's play() must stay close to the user gesture (autoplay rules).
  function play(trackId: string) {
    playTrack(trackId);
    player.play(trackId);
  }
  // Playing track, or track 01 (cued) before the first play: ⏮ / ⏭ count from it.
  const index = Math.max(
    0,
    tracks.findIndex((t) => t.id === playingId),
  );
  function playAt(i: number) {
    const track = tracks[i];
    if (track) play(track.id);
  }
  // Genre Tone Rule: the genre's sleeve tone travels with it (turntable, playing row). AA-safe pairs.
  const [toneBg, toneFg, hole] = toneFor(genre.slug);
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
  // The record spins only while Spotify confirms playback (#61): paused, finished or blocked by the browser → still.
  // Without the embed (fallback: script failed) there is no playback signal, so the chosen track keeps it spinning.
  const sounding = playing !== null && (player.status === "failed" || !player.paused);
  const ready = status === "ready";
  // The genre's "The Sound of …" playlist (from the API); search is only a fallback before it arrives.
  const spotifyUrl =
    playlistUrl ?? `https://open.spotify.com/search/${encodeURIComponent(`The Sound of ${genre.name}`)}`;
  // Long names (e.g. "Musica Popular Brasileira Contemporanea") step down so the title stays within ~2 lines.
  // Below lg the title shares a row with the mini deck, so it scales with the viewport (never overflows at 320px).
  const titleSize =
    genre.name.length > 22
      ? "text-[clamp(21px,6.5vw,36px)] lg:text-[48px]"
      : "text-[clamp(28px,9vw,44px)] lg:text-[56px] xl:text-[64px]";

  return (
    <section aria-labelledby="result-title" className="flex min-w-0 flex-1 flex-col" style={toneVars}>
      <p className="sr-only" aria-live="polite">
        {status === "loading" && `Loading ${genre.name}…`}
        {status === "ready" && `${genre.name}: ${tracks.length} tracks ready.`}
        {status === "empty" && `${genre.name}: no playable tracks.`}
        {status === "error" && `Couldn't load ${genre.name}.`}
        {status === "busy" && `Spotify is busy. Try ${genre.name} again in ${retryAfter} seconds.`}
        {status === "ready" && player.blocked && " Your browser didn't start the music: press play in the player."}
      </p>

      {/* DOM order = reading order: Back → deck (decorative) → title, tracks, finds → player.
          ≥lg: deck | info columns, the grid puts the player under the deck.
          <lg: the column wrappers dissolve (display: contents) into one grid: mini deck beside the title,
          everything else full width, a bar fixed to the bottom: the 152px player when ready (Roll again then sits
          beside "Listen more"), Roll again full width otherwise. */}
      <div
        className={`grid grid-cols-[clamp(88px,28vw,120px)_minmax(0,1fr)] gap-x-4 gap-y-5 ${ready ? "max-lg:pb-[calc(244px+env(safe-area-inset-bottom))]" : "max-lg:pb-[calc(120px+env(safe-area-inset-bottom))]"} lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-4 xl:grid-cols-[minmax(0,440px)_minmax(0,1fr)]`}
      >
        <div className="flex flex-col items-start gap-4 max-lg:contents">
          <Link
            href="/"
            className={`-ml-3 inline-flex items-center gap-2 justify-self-start rounded-full px-3 py-1.5 text-[15px] font-semibold text-primary-ink transition-colors hover:bg-primary-ink/10 max-lg:col-span-2 touch:min-h-11 ${focusRing}`}
          >
            <ArrowLeft size={18} strokeWidth={2.5} aria-hidden="true" />
            Back to the crate
          </Link>
          {/* ≥lg: the transport sits on the plinth (positioned over it, outside the decorative turntable).
              <lg the wrapper dissolves and the transport lives in the bottom bar. */}
          <div className="relative w-full max-w-[440px] max-lg:contents">
            <Turntable
              label={hole}
              spinning={status === "loading" || sounding}
              armDown={playing !== null}
              trackCount={tracks.length}
              track={playing ? tracks.indexOf(playing) : null}
              record={status !== "error" && status !== "busy"}
              arrive
              compact
            />
            {ready && (
              <div className="max-lg:hidden">
                <TrackTransport
                  variant="plinth"
                  index={index}
                  count={tracks.length}
                  onPrev={() => playAt(index - 1)}
                  onNext={() => playAt(index + 1)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-6 max-lg:contents lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {/* Title and page actions share one line, so the page fits the home's height (no corner-vinyl jump). */}
          <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4 max-lg:contents">
            <div className="flex min-w-0 flex-1 basis-80 flex-col gap-3 max-lg:gap-2 max-lg:self-center">
              <h1
                id="result-title"
                ref={headingRef}
                tabIndex={-1}
                className={`font-display ${titleSize} self-start rounded-sm leading-[0.95] font-extrabold tracking-[-0.02em] text-balance [overflow-wrap:anywhere] outline-none data-[kbd=true]:focus:outline-2 data-[kbd=true]:focus:outline-offset-4 data-[kbd=true]:focus:outline-primary-ink data-[kbd=true]:focus:outline-solid`}
              >
                {genre.name}
              </h1>
              <p className="text-[15px] leading-6 text-muted-foreground max-lg:text-sm max-lg:leading-5">
                <span className="font-mono">
                  {status === "loading" ? (
                    "Pulling the record…"
                  ) : total > 0 ? (
                    <>
                      {total} tracks<span className="max-lg:hidden"> in the playlist</span>
                    </>
                  ) : (
                    " "
                  )}
                </span>
                {status === "ready" && !playing && (
                  <span className="max-lg:hidden"> · pick one to start listening</span>
                )}
                {status === "ready" && playing && player.blocked && (
                  <span className="max-lg:hidden"> · press play in the player</span>
                )}
              </p>
            </div>
            {/* <lg: its own row, 44px tall even while loading so nothing shifts when the link appears. */}
            <div className="flex flex-wrap items-center gap-5 max-lg:col-span-2 max-lg:min-h-11">
              {status !== "loading" && (
                <a
                  href={spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1 rounded py-1.5 text-[15px] font-semibold text-primary-ink underline-offset-4 hover:underline touch:min-h-11 ${focusRing}`}
                >
                  Listen more on Spotify
                  <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {/* <lg: Roll again lives in the bottom bar (thumb reach). */}
              {/* <lg: here only while a player fills the bottom bar (152px embed needs the full width), on its own
                  row at full width under "Listen more on Spotify". */}
              <RollAgain onRoll={randomize} className={ready ? "max-lg:w-full" : "max-lg:hidden"} />
            </div>
          </div>

          <div key={status} className="result-body max-lg:col-span-2">
            {status === "ready" && <TrackList tracks={tracks} playingId={playingId} onPlay={play} />}
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

          <div className="mt-auto border-t border-divider pt-5 max-lg:col-span-2">
            <RecentFinds />
          </div>
        </div>

        {/* ≥lg: under the deck. <lg: bottom bar (player + Roll again), safe-area aware.
            The player always keeps its slot (hidden outside "ready") so states never change the geometry. */}
        <div
          data-bottom-bar={ready ? "player" : "roll"}
          className="max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-40 max-lg:border-t-[1.5px] max-lg:border-border-strong max-lg:bg-background max-lg:pb-[env(safe-area-inset-bottom)] lg:col-start-1 lg:row-start-2 lg:self-start"
        >
          <div className="max-lg:mx-auto max-lg:flex max-lg:max-w-[720px] max-lg:items-center max-lg:gap-3 max-lg:px-6 max-lg:py-3">
            <div
              className={`flex min-w-0 flex-1 flex-col gap-2 ${status === "ready" ? "" : "invisible max-lg:hidden"}`}
              aria-hidden={status !== "ready" || undefined}
            >
              {ready && (
                <div className="lg:hidden">
                  <TrackTransport
                    variant="bar"
                    blocked={player.blocked && playing !== null}
                    index={index}
                    count={tracks.length}
                    onPrev={() => playAt(index - 1)}
                    onNext={() => playAt(index + 1)}
                  />
                </div>
              )}
              <PlayerSlot
                track={playing}
                spotifyUrl={spotifyUrl}
                containerRef={player.containerRef}
                playerStatus={player.status}
              />
            </div>
            {!ready && <RollAgain onRoll={randomize} bar="full" className="lg:hidden" />}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Secondary on purpose (DESIGN.md › Buttons). `bar="full"`: 56px tall and full width in the bottom bar (outside ready),
 * always labelled ("Roll again"; a bare shuffle icon reads as "shuffle tracks"). */
function RollAgain({ onRoll, bar, className = "" }: { onRoll: () => void; bar?: "full"; className?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        blurIfPointer(e);
        onRoll();
      }}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-[1.5px] border-border-strong text-[17px] font-bold transition-colors hover:bg-muted/50 active:translate-y-px ${bar ? "h-14 flex-1 bg-background px-5" : "px-5 py-2.5"} ${focusRing} ${className}`}
    >
      <Shuffle size={20} strokeWidth={2.5} aria-hidden="true" />
      <span>Roll again</span>
    </button>
  );
}
