import type { Track, TrackCandidate } from "./track";

/** Keeps playable, non-local, unique tracks (first occurrence wins) as plain `Track`s, preserving order. */
export function filterPlayable(candidates: readonly (TrackCandidate | null)[]): Track[] {
  const seen = new Set<string>();
  const tracks: Track[] = [];
  for (const c of candidates) {
    if (c === null || c.isLocal || !c.isPlayable || seen.has(c.id)) continue;
    seen.add(c.id);
    tracks.push({ id: c.id, title: c.title, artists: c.artists });
  }
  return tracks;
}
