import { cn } from "@/lib/utils";

type VinylProps = {
  size: number;
  /** Adds grooves + a light sheen wedge (large decorative record). */
  detailed?: boolean;
  /** Number of grooves on a simple (non-detailed) vinyl. */
  rings?: number;
  /** Label colour (defaults to Seiji). */
  label?: string;
  /** Detailed vinyl only: number of tracks; draws the gaps between them (track 1 at the rim). */
  bands?: number;
  className?: string;
};

/** Playable groove area of the detailed vinyl, in viewBox units (rim → label). Track 1 starts at `outer`. */
export const VINYL_GROOVES = { outer: 45, inner: 23 } as const;

/** Radius (viewBox units) of the middle of track `index`'s band when the record holds `count` equal bands. */
export const bandCenter = (index: number, count: number) =>
  VINYL_GROOVES.outer - ((index + 0.5) * (VINYL_GROOVES.outer - VINYL_GROOVES.inner)) / count;

// Own vinyl mark (replaces the Spotify logo). Sumi disc, Seiji label, Sumi hole.
export function Vinyl({
  size,
  detailed = false,
  rings = 1,
  label = "var(--primary)",
  bands = 0,
  className,
}: VinylProps) {
  // Banded (turntable): each track is a cluster of fine grooves, tracks separated by a smooth dark gap,
  // like a real LP. Detailed: 11 even grooves (r46 → r22). Simple: grooves spread between label and rim.
  const bandWidth = bands > 0 ? (VINYL_GROOVES.outer - VINYL_GROOVES.inner) / bands : 0;
  const grooves =
    detailed && bands > 0
      ? Array.from({ length: bands }, (_, b) => {
          const top = VINYL_GROOVES.outer - b * bandWidth;
          return [0.18, 0.43, 0.68].map((f) => top - f * bandWidth); // last 30% of each band = the gap
        }).flat()
      : detailed
        ? Array.from({ length: 11 }, (_, i) => 46 - i * 2.4)
        : rings === 1
          ? [36]
          : Array.from({ length: rings }, (_, i) => 25 + (i * 20) / (rings - 1));
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className={cn("shrink-0", className)}>
      <circle cx="50" cy="50" r="49" fill="var(--foreground)" />
      {grooves.map((r) => (
        <circle
          key={r}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--background)"
          strokeOpacity={detailed ? (bands > 0 ? 0.2 : 0.14) : 0.22}
          strokeWidth={detailed ? (bands > 0 ? 0.35 : 0.5) : 1.5}
        />
      ))}
      {detailed && (
        // Single sheen wedge centred just above 2 o'clock (38°→62° clockwise from 12, r48).
        <path d="M50 50 L79.55 12.18 A48 48 0 0 1 92.38 27.47 Z" fill="#fff" fillOpacity="0.16" />
      )}
      <circle cx="50" cy="50" r={detailed ? 18 : 20} fill={label} />
      <circle cx="50" cy="50" r={detailed ? 2.5 : 4} fill="var(--foreground)" />
    </svg>
  );
}
