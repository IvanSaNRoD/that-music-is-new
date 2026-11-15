/** Returns a uniform random integer offset in [0, max(0, total - limit)] for a paged fetch. */
export function randomOffset(total: number, limit: number, random: () => number): number {
  return Math.floor(random() * (Math.max(0, total - limit) + 1));
}
