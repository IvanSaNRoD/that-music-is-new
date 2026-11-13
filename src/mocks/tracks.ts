import type { Genre } from "@/domain/genre";
import type { GenreSample } from "@/domain/track";

// PLACEHOLDER data until the Spotify client lands (E2/E3). Names are deliberately generic:
// we must not invent real-looking songs or artists for a genre.
export function sampleFor(genre: Genre, catalogIndex: number): GenreSample {
  const trackCount = 40 + ((catalogIndex * 37) % 160);
  const tracks = Array.from({ length: 10 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return { id: `${genre.id}-${n}`, title: `Sample track ${n}`, artists: `Sample artist ${((i * 3) % 7) + 1}` };
  });
  return { genreId: genre.id, trackCount, tracks };
}
