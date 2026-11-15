// Spotify response fixtures, shaped like the live API (checked 2026-11-15): each entry has the track
// under both `item` and `track`; `is_playable` is present because requests pass `market`.

type FixtureTrack = { id: string | null; name: string; artists: string[]; isLocal?: boolean; isPlayable?: boolean };

function entry({ id, name, artists, isLocal = false, isPlayable = true }: FixtureTrack) {
  const track = {
    type: "track",
    id,
    name,
    artists: artists.map((artist) => ({ name: artist })),
    is_local: isLocal,
    is_playable: isPlayable,
  };
  return { is_local: isLocal, item: track, track };
}

/** One page of `GET /v1/playlists/{id}/items`, covering every case the randomizer must filter. */
export const playlistItemsPage = {
  total: 172,
  limit: 10,
  offset: 0,
  items: [
    entry({ id: "track-1", name: "Sample track 01", artists: ["Sample artist 1"] }),
    entry({ id: "track-2", name: "Sample track 02", artists: ["Sample artist 2", "Sample artist 3"] }),
    entry({ id: "track-3", name: "Sample track 03", artists: ["Sample artist 4"], isPlayable: false }),
    entry({ id: null, name: "Local file", artists: ["Someone"], isLocal: true }),
    entry({ id: "track-1", name: "Sample track 01", artists: ["Sample artist 1"] }), // duplicate
    { is_local: false, item: null, track: null }, // track removed from Spotify
    { is_local: false, item: { type: "episode", id: "episode-1", name: "Podcast episode" } }, // no artists
    { is_local: false, item: { type: "episode", id: "episode-2", name: "Podcast episode", artists: [] } },
  ],
};
