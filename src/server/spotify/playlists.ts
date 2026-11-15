import "server-only";
import type { TrackCandidate } from "@/domain/track";
import { retryAfterSeconds, SpotifyError } from "./errors";
import { type PlaylistEntry, playlistItemsSchema } from "./schemas";
import { getToken, invalidateToken } from "./token";

const API_URL = "https://api.spotify.com/v1";
const TIMEOUT_MS = 8_000;

export type PlaylistItemsQuery = {
  playlistId: string;
  offset: number;
  limit: number;
  /** ISO 3166-1 alpha-2 country; makes Spotify report `is_playable` for that market. */
  market: string;
};

/** Raw page of a playlist: `total` + entries (`null` = removed track, episode or unreadable entry). */
export type PlaylistItemsPage = { total: number; items: (TrackCandidate | null)[] };

/** One call to `GET /playlists/{id}/items` (ADR-0003 step 2.2). Filtering is left to the domain. */
export async function getPlaylistItems(query: PlaylistItemsQuery): Promise<PlaylistItemsPage> {
  let res = await request(query, await getToken());
  if (res.status === 401) {
    // Token revoked/expired early: get a fresh one and retry once.
    invalidateToken();
    res = await request(query, await getToken());
  }
  if (res.status === 429) throw new SpotifyError("rate-limited", "Playlist items rate-limited", retryAfterSeconds(res));
  if (!res.ok) throw new SpotifyError("upstream", `Playlist items failed: ${res.status}`);

  const parsed = playlistItemsSchema.safeParse(await res.json().catch(() => null));
  if (!parsed.success) throw new SpotifyError("upstream", "Unexpected playlist items response");
  return { total: parsed.data.total, items: parsed.data.items.map(toCandidate) };
}

async function request({ playlistId, offset, limit, market }: PlaylistItemsQuery, token: string) {
  const params = new URLSearchParams({ offset: String(offset), limit: String(limit), market });
  try {
    return await fetch(`${API_URL}/playlists/${encodeURIComponent(playlistId)}/items?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    throw new SpotifyError("upstream", `Playlist items request failed: ${String(error)}`);
  }
}

function toCandidate(entry: PlaylistEntry): TrackCandidate | null {
  const track = entry?.item ?? entry?.track;
  if (!track || track.type !== "track" || !track.id) return null;
  return {
    id: track.id,
    title: track.name,
    artists: track.artists.map((a) => a.name).join(", "),
    isLocal: Boolean(track.is_local ?? entry?.is_local),
    // Spotify omits `is_playable` only without `market`; treat unknown as playable.
    isPlayable: track.is_playable ?? true,
  };
}
