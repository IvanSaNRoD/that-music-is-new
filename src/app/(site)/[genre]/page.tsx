import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageRow } from "@/components/layout/page-row";
import { HowItWorks } from "@/features/home";
import { ResultFallback, ResultView } from "@/features/result";
import { OPEN_GRAPH_BASE } from "@/lib/site";
import { getCatalog } from "@/server/catalog";

// Genre pages render on demand (6,490 genres). Cache Components requires at least one prerendered param,
// so the catalog's first genre validates the route at build time (generate-static-params.md › With Cache
// Components). Taken from the catalog, not hard-coded, so a regenerated catalog never breaks the build.
export function generateStaticParams() {
  return [{ genre: getCatalog().entries[0].slug }];
}

// Title "{Genre} · That Music Is New" (layout template); the OG image comes from ./opengraph-image.tsx.
export async function generateMetadata({ params }: PageProps<"/[genre]">): Promise<Metadata> {
  const { genre: slug } = await params;
  const entry = getCatalog().bySlug.get(slug);
  if (!entry) return { title: "Not in the crate", robots: { index: false } };
  const description = `Hear ${entry.genre}: 10 random tracks from Spotify’s “The Sound of ${entry.genre}”. A rare genre, one click away.`;
  return {
    title: entry.genre,
    description,
    alternates: { canonical: `/${entry.slug}` },
    openGraph: { ...OPEN_GRAPH_BASE, title: entry.genre, description, url: `/${entry.slug}` },
  };
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
  const entry = getCatalog().bySlug.get(slug);
  if (!entry) notFound();
  const genre = { name: entry.genre, slug: entry.slug };
  // key → a new genre always starts a fresh result (loading → ready)
  return <ResultView key={genre.slug} genre={genre} />;
}
