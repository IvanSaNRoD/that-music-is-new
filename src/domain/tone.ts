/** Number of sleeve tones (DESIGN.md › The Sleeve Palette Rule). */
export const TONE_COUNT = 5;

/** Deterministic sleeve tone index for a genre: sum of the slug's char codes % 5 (crate, genre page, OG image agree). */
export function toneIndex(slug: string) {
  let sum = 0;
  for (const char of slug) sum += char.charCodeAt(0);
  return sum % TONE_COUNT;
}

/**
 * Orders a crate so neighbouring sleeves wear different tones (#91); each genre keeps its own tone. Greedy: each
 * place takes, among the items whose tone differs from the previous one, the most frequent remaining tone (earliest
 * item on a tie, so an already varied list keeps its order). Repeats only when one tone fills more than half.
 */
export function spreadTones<T extends { slug: string }>(items: readonly T[]): T[] {
  const left = [...items];
  const out: T[] = [];
  const count = (tone: number) => left.filter((item) => toneIndex(item.slug) === tone).length;
  let prev = -1;
  while (left.length > 0) {
    let best = -1;
    for (let i = 0; i < left.length; i++) {
      const tone = toneIndex(left[i]!.slug);
      if (tone === prev) continue;
      if (best === -1 || count(tone) > count(toneIndex(left[best]!.slug))) best = i;
    }
    if (best === -1) best = 0; // only the previous tone is left
    const [next] = left.splice(best, 1);
    out.push(next!);
    prev = toneIndex(next!.slug);
  }
  return out;
}
