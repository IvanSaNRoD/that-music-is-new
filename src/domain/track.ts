export type Track = { id: string; title: string; artists: string };

/** A genre's sample: total tracks in its playlist + up to 10 tracks to play. */
export type GenreSample = { genreId: string; trackCount: number; tracks: Track[] };

/** A playlist entry as read from Spotify, before filtering (ADR-0003 step 2.3). */
export type TrackCandidate = Track & { isLocal: boolean; isPlayable: boolean };
