import { Vinyl } from "@/components/brand/vinyl";
import type { Track } from "@/domain/track";

export function PlayerSlot({ track }: { track: Track | null }) {
  // Placeholder for the single Spotify Embed player (E4.3).
  return (
    <aside aria-label="Player" className="bg-card border-border-strong flex h-fit flex-col gap-4 rounded-2xl border-[1.5px] p-5">
      <span className="text-muted-foreground font-mono text-[13px] uppercase">Now playing</span>
      {track ? (
        <span className="flex flex-col">
          <span className="text-[17px] font-bold">{track.title}</span>
          <span className="text-muted-foreground text-sm">{track.artists}</span>
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">Pick a track to start listening.</span>
      )}
      <div className="border-divider flex h-20 items-center justify-center gap-3 rounded-xl border border-dashed">
        <Vinyl size={36} rings={4} />
        <span className="text-muted-foreground font-mono text-[13px]">Spotify player</span>
      </div>
    </aside>
  );
}
