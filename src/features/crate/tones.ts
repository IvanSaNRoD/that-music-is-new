// Sleeve [bg, text, hole] by catalog index % 5 — text pairs WCAG AA; no white/card sleeve (blends into the panel).
// "hole" = the die-cut circle showing the record label; picked to contrast with the sleeve.
export const TONES = [
  ["var(--primary)", "var(--foreground)", "var(--background)"],
  ["var(--foreground)", "var(--background)", "var(--primary)"],
  ["var(--muted)", "var(--foreground)", "var(--primary-ink)"],
  ["var(--primary-ink)", "var(--background)", "var(--background)"],
  ["var(--muted-foreground)", "var(--background)", "var(--primary)"],
] as const;

export const toneFor = (catalogIndex: number) => TONES[catalogIndex % TONES.length];
