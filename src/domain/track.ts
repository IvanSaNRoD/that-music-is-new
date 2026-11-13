export type Track = { id: string; title: string; artists: string };

/** A genre's sample: total tracks in its playlist + up to 10 tracks to play. */
export type GenreSample = { genreId: string; trackCount: number; tracks: Track[] };
