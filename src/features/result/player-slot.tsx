import type { RefObject } from "react";
import { ArrowUpRight } from "lucide-react";
import { Vinyl } from "@/components/brand/vinyl";
import type { Track } from "@/domain/track";
import type { PlayerStatus } from "./use-spotify-player";

type PlayerSlotProps = {
  track: Track | null;
  spotifyUrl: string;
  /** Where the one Spotify Embed (152px, ADR-0001) is created by useSpotifyPlayer. */
  containerRef?: RefObject<HTMLDivElement | null>;
  playerStatus?: PlayerStatus;
};

/**
 * The single player: the Spotify Embed (track 01 cued, then whatever plays) sits on top of a 152px placeholder, so the
 * slot never looks empty while the embed loads. If the embed script fails (blocked, offline), only the placeholder
 * remains, as the fallback: now-playing track + "Dig deeper" hand-off.
 */
export function PlayerSlot({ track, spotifyUrl, containerRef, playerStatus = "failed" }: PlayerSlotProps) {
  const embedded = playerStatus !== "failed";
  const shown = embedded ? null : track; // with the embed, the track is shown by Spotify, not here
  return (
    <aside aria-label="Player" className="relative h-[152px] w-full lg:max-w-[440px]">
      <div className="absolute inset-0 flex items-center gap-3 rounded-2xl border-[1.5px] border-dashed border-border px-4 py-3 max-sm:px-3 lg:gap-4 lg:px-5">
        <Vinyl size={36} rings={4} className="max-lg:hidden" />
        {shown ? (
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[16px] font-bold">{shown.title}</span>
            <span className="truncate text-sm text-muted-foreground">{shown.artists}</span>
          </span>
        ) : (
          <span className="truncate text-sm text-muted-foreground">Nothing playing yet.</span>
        )}
        {shown ? (
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex shrink-0 items-center justify-center gap-1 rounded-full border-[1.5px] border-border-strong px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink max-sm:size-11 max-sm:px-0 touch:min-h-11"
          >
            {/* Below 1280: shorter visible label; below 640: icon only (room for the title). Same accessible name. */}
            <span className="max-sm:sr-only">Dig deeper</span>{" "}
            <span className="sr-only xl:not-sr-only">on Spotify</span>
            <ArrowUpRight size={15} strokeWidth={2.5} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <span className="ml-auto shrink-0 font-mono text-[13px] text-muted-foreground max-sm:hidden">
            Spotify player
          </span>
        )}
      </div>
      {embedded && (
        // React never renders inside this div: the embed API appends (and later removes) the iframe itself.
        <div ref={containerRef} className="absolute inset-0 overflow-hidden rounded-2xl [&_iframe]:block" />
      )}
    </aside>
  );
}
