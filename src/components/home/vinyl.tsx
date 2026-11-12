import { cn } from "@/lib/utils";

type VinylProps = {
  size: number;
  /** Adds grooves + a light sheen wedge (large decorative record). */
  detailed?: boolean;
  className?: string;
};

// Own vinyl mark (replaces the Spotify logo). Sumi disc, Seiji label, Kinari hole.
export function Vinyl({ size, detailed = false, className }: VinylProps) {
  const grooves = detailed ? [44, 40, 36, 32, 28] : [36];
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
        // Single sheen wedge around 1 o'clock.
        <path d="M50 50 L62 3 A48 48 0 0 1 80 12 Z" fill="#fff" fillOpacity="0.16" />
      )}
      <circle cx="50" cy="50" r={detailed ? 18 : 20} fill="var(--primary)" />
      <circle cx="50" cy="50" r={detailed ? 2.5 : 4} fill="var(--background)" />
    </svg>
  );
}
