// Sleeve [bg, text, hole] by slug (sum of char codes % 5) — text pairs WCAG AA; no white/card sleeve (blends into the panel).
// "hole" = the die-cut circle showing the record label; picked to contrast with the sleeve.
export const TONES = [
  ["var(--primary)", "var(--foreground)", "var(--background)"],
  ["var(--foreground)", "var(--background)", "var(--primary)"],
  ["var(--muted)", "var(--foreground)", "var(--primary-ink)"],
  ["var(--primary-ink)", "var(--background)", "var(--background)"],
  ["var(--muted-foreground)", "var(--background)", "var(--primary)"],
] as const;

/** Deterministic tone for a genre: the same slug always gets the same sleeve colour (server and client agree). */
export function toneFor(slug: string) {
  let sum = 0;
  for (const char of slug) sum += char.charCodeAt(0);
  return TONES[sum % TONES.length];
}
