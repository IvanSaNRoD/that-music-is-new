/** Number of sleeve tones (DESIGN.md › The Sleeve Palette Rule). */
export const TONE_COUNT = 5;

/** Deterministic sleeve tone index for a genre: sum of the slug's char codes % 5 (crate, genre page, OG image agree). */
export function toneIndex(slug: string) {
  let sum = 0;
  for (const char of slug) sum += char.charCodeAt(0);
  return sum % TONE_COUNT;
}
