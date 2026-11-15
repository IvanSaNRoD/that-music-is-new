import type { Track } from "./track";

export type Genre = {
  id: string;
  /** URL segment, see domain/slug.ts (ADR-0006). */
  slug: string;
  name: string;
  origin: string;
  era: string;
};

/** One genre of the real catalog (config/genres.json + slug, ADR-0007). */
export type CatalogEntry = {
  /** Display name, e.g. "Acid Jazz". */
  genre: string;
  /** URL + API key, see domain/slug.ts. */
  slug: string;
  playlistId: string;
  /** Tracks in the "The Sound of …" playlist. */
  total: number;
};

/** Response of GET /api/genres/{slug} (docs/architecture.md › API). */
export type GenreResult = {
  genre: string;
  slug: string;
  playlistId: string;
  playlistUrl: string;
  total: number;
  /** Up to 10 playable tracks, shuffled. */
  tracks: Track[];
};
