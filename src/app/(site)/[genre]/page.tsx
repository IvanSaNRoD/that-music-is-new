import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageRow } from "@/components/layout/page-row";
import { findBySlug } from "@/domain/slug";
import { HowItWorks } from "@/features/home";
import { ResultFallback, ResultView } from "@/features/result";
import { GENRES } from "@/mocks/genres";

// Known genres are prerendered; unknown slugs → not-found. Revisit for the ~7,000-genre catalog (ADR-0006).
export function generateStaticParams() {
  return GENRES.map((g) => ({ genre: g.slug }));
}

// Instant navigation: the URL param is read inside <Suspense>, so the shell (header, fallback)
// renders immediately and the genre streams in.
// No steps band on genre pages, only its invisible spacer (keeps the corner vinyl in place).
export default function GenrePage({ params }: PageProps<"/[genre]">) {
  return (
    <>
      <PageRow>
        <Suspense fallback={<ResultFallback />}>
          <GenreResult params={params} />
        </Suspense>
      </PageRow>
      <HowItWorks placeholder />
    </>
  );
}

async function GenreResult({ params }: { params: PageProps<"/[genre]">["params"] }) {
  const { genre: slug } = await params;
  const genre = findBySlug(GENRES, slug);
  if (!genre) notFound();
  // key → a new genre always starts a fresh result (loading → ready)
  return <ResultView key={genre.id} genre={genre} catalogIndex={GENRES.indexOf(genre)} />;
}
