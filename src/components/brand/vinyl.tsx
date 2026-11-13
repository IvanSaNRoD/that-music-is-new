import { cn } from "@/lib/utils";

type VinylProps = {
  size: number;
  /** Adds grooves + a light sheen wedge (large decorative record). */
  detailed?: boolean;
  /** Number of grooves on a simple (non-detailed) vinyl. */
  rings?: number;
  /** Label colour (defaults to Seiji). */
  label?: string;
  className?: string;
};

// Own vinyl mark (replaces the Spotify logo). Sumi disc, Seiji label, Sumi hole.
export function Vinyl({ size, detailed = false, rings = 1, label = "var(--primary)", className }: VinylProps) {
  // Simple vinyl: grooves spread evenly between the label (r20) and the rim (r49).
  const grooves = detailed
    ? Array.from({ length: 11 }, (_, i) => 46 - i * 2.4) // r46 → r22
    : rings === 1
      ? [36]
      : Array.from({ length: rings }, (_, i) => 25 + (i * 20) / (rings - 1));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <circle cx="50" cy="50" r="49" fill="var(--foreground)" />
      {grooves.map((r) => (
        <circle
          key={r}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--background)"
          strokeOpacity={detailed ? 0.14 : 0.22}
          strokeWidth={detailed ? 0.5 : 1.5}
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
