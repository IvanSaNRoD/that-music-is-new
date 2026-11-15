import "server-only";
import { z } from "zod";
// Imported (not read from disk) so the JSON ships inside the server bundle on Vercel.
import genres from "../../config/genres.json";
import type { CatalogEntry } from "@/domain/genre";
import { toSlug } from "@/domain/slug";

export type Catalog = { entries: readonly CatalogEntry[]; bySlug: ReadonlyMap<string, CatalogEntry> };
const rowsSchema = z.array(
  z.object({ genre: z.string().min(1), playlistId: z.string().min(1), total: z.number().int().positive() }),
);

/** Validates rows, adds slugs and indexes them. Throws on invalid rows or a slug collision (ADR-0007). */
export function buildCatalog(rows: unknown): Catalog {
  const entries = rowsSchema.parse(rows).map((row) => ({ ...row, slug: toSlug(row.genre) }));
  const bySlug = new Map<string, CatalogEntry>();
  for (const entry of entries) {
    const clash = bySlug.get(entry.slug);
    if (clash) throw new Error(`Slug collision "${entry.slug}": "${clash.genre}" and "${entry.genre}"`);
    bySlug.set(entry.slug, entry);
  }
  return { entries, bySlug };
}

let catalog: Catalog | null = null;

/** The genre catalog (config/genres.json, ADR-0003/0007), built once per server instance. */
export function getCatalog(): Catalog {
  catalog ??= buildCatalog(genres);
  return catalog;
}
