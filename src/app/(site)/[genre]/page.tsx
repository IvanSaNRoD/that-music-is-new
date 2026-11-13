import { Suspense } from "react";
import { notFound } from "next/navigation";
import { findBySlug } from "@/domain/slug";
import { ResultFallback, ResultView } from "@/features/result";
import { GENRES } from "@/mocks/genres";

// Known genres are prerendered; unknown slugs → not-found. Revisit for the ~7,000-genre catalog (ADR-0006).
export function generateStaticParams() {
  return GENRES.map((g) => ({ genre: g.slug }));
}

// Instant navigation: the URL param is read inside <Suspense>, so the shell (header, History, fallback)
// renders immediately and the genre streams in.
export default function GenrePage({ params }: PageProps<"/[genre]">) {
  return (
    <Suspense fallback={<ResultFallback />}>
      <GenreResult params={params} />
    </Suspense>
  );
}

async function GenreResult({ params }: { params: PageProps<"/[genre]">["params"] }) {
  const { genre: slug } = await params;
  const genre = findBySlug(GENRES, slug);
  if (!genre) notFound();
  // key → a new genre always starts a fresh result (loading → ready)
  return <ResultView key={genre.id} genre={genre} catalogIndex={GENRES.indexOf(genre)} />;
}
