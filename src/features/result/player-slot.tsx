import { ArrowUpRight } from "lucide-react";
import { Vinyl } from "@/components/brand/vinyl";
import type { Track } from "@/domain/track";

export function PlayerSlot({ track, spotifyUrl }: { track: Track | null; spotifyUrl: string }) {
  // Placeholder for the single compact Spotify Embed player (E4.3, ~80px tall). Dashed = not real yet.
  // Once something plays, the hand-off ("Taste, then leave") gets its moment here, next to what's playing.
  return (
    <aside
      aria-label="Player"
      className="border-border flex min-h-20 w-full max-w-[440px] items-center gap-4 rounded-2xl border-[1.5px] border-dashed px-5 py-3"
    >
      <Vinyl size={36} rings={4} />
      {track ? (
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[16px] font-bold">{track.title}</span>
          <span className="text-muted-foreground truncate text-sm">{track.artists}</span>
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">Nothing playing yet.</span>
      )}
      {track ? (
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noreferrer"
          className="border-border-strong hover:bg-muted/50 focus-visible:outline-primary-ink ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border-[1.5px] px-3 py-1.5 text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {/* Narrow deck (1024–1279): shorter visible label, same accessible name. */}
          Dig deeper <span className="sr-only xl:not-sr-only">on Spotify</span>
          <ArrowUpRight size={15} strokeWidth={2.5} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : (
        <span className="text-muted-foreground ml-auto shrink-0 font-mono text-[13px]">Spotify player</span>
      )}
    </aside>
  );
}
