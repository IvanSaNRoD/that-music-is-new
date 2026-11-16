export type Track = { id: string; title: string; artists: string };

/** A playlist entry as read from Spotify, before filtering (ADR-0003 step 2.3). */
export type TrackCandidate = Track & { isLocal: boolean; isPlayable: boolean };
