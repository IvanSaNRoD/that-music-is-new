import type { CatalogEntry } from "./genre";

/** Picks a uniformly random catalog entry, never the excluded slug when another exists. */
export function pickGenre(entries: readonly CatalogEntry[], random: () => number, exclude?: string): CatalogEntry {
  if (entries.length === 0) throw new Error("pickGenre: empty catalog");
  const excluded = entries.findIndex((e) => e.slug === exclude);
  if (excluded === -1 || entries.length === 1) return entries[Math.floor(random() * entries.length)];
  const index = Math.floor(random() * (entries.length - 1));
  return entries[index >= excluded ? index + 1 : index];
}
