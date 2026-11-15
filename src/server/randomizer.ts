import "server-only";
import { filterPlayable } from "@/domain/filter-tracks";
import type { GenreResult } from "@/domain/genre";
import { pickGenre } from "@/domain/pick-genre";
import { randomOffset } from "@/domain/random-offset";
import { shuffle } from "@/domain/shuffle";
import { getCatalog } from "./catalog";
import { getPlaylistItems } from "./spotify/playlists";

const SAMPLE_SIZE = 10;

/** Request 1 (ADR-0007): a random catalog genre ≠ `exclude` — no Spotify call. */
export function pickRandomGenre(exclude?: string, random: () => number = Math.random) {
  const { genre, slug } = pickGenre(getCatalog().entries, random, exclude);
  return { genre, slug };
}

/**
 * Request 2 (ADR-0003 step 2, ADR-0007): up to 10 playable tracks of a genre, from one Spotify call.
 * `null` = slug not in the catalog. Spotify failures throw `SpotifyError` (mapped by the route).
 */
export async function getGenreSample(
  slug: string,
  market: string,
  random: () => number = Math.random,
): Promise<GenreResult | null> {
  const entry = getCatalog().bySlug.get(slug);
  if (!entry) return null;
  const { total, items } = await getPlaylistItems({
    playlistId: entry.playlistId,
    offset: randomOffset(entry.total, SAMPLE_SIZE, random),
    limit: SAMPLE_SIZE,
    market,
  });
  return {
    ...entry,
    playlistUrl: `https://open.spotify.com/playlist/${entry.playlistId}`,
    total, // live count from Spotify (the catalog's is a 2026-11-15 snapshot)
    tracks: shuffle(filterPlayable(items), random),
  };
}
