import { ArrowUpRight } from "lucide-react";
import { Vinyl } from "@/components/brand/vinyl";
import type { Track } from "@/domain/track";

export function PlayerSlot({ track, spotifyUrl }: { track: Track | null; spotifyUrl: string }) {
  // Placeholder for the single compact Spotify Embed player (E4.3, ~80px tall). Dashed = not real yet.
  // Once something plays, the hand-off ("Taste, then leave") gets its moment here, next to what's playing.
  return (
    <aside
      aria-label="Player"
      className="flex min-h-20 w-full items-center gap-3 rounded-2xl border-[1.5px] border-dashed border-border px-4 py-3 max-sm:px-3 lg:max-w-[440px] lg:gap-4 lg:px-5"
    >
      <Vinyl size={36} rings={4} className="max-lg:hidden" />
      {track ? (
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[16px] font-bold">{track.title}</span>
          <span className="truncate text-sm text-muted-foreground">{track.artists}</span>
        </span>
      ) : (
        <span className="truncate text-sm text-muted-foreground">Nothing playing yet.</span>
      )}
      {track ? (
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noreferrer"
          className="ml-auto inline-flex shrink-0 items-center justify-center gap-1 rounded-full border-[1.5px] border-border-strong px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink max-sm:size-11 max-sm:px-0 touch:min-h-11"
        >
          {/* Below 1280 (narrow deck, bottom bar): shorter visible label; below 640: icon only (room for the title). Same accessible name. */}
          <span className="max-sm:sr-only">Dig deeper</span> <span className="sr-only xl:not-sr-only">on Spotify</span>
          <ArrowUpRight size={15} strokeWidth={2.5} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : (
        <span className="ml-auto shrink-0 font-mono text-[13px] text-muted-foreground max-sm:hidden">
          Spotify player
        </span>
      )}
    </aside>
  );
}
