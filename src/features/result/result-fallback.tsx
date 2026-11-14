import { TrackSkeleton } from "./track-list";
import { Turntable } from "./turntable";

/**
 * Instant shell for /{genre} while the route params resolve (Next "instant navigation": URL data must be
 * read inside <Suspense>). Same geometry as ResultView so nothing jumps; the empty platter waits for the record.
 */
export function ResultFallback() {
  return (
    <section aria-busy="true" aria-label="Loading genre" className="flex min-w-0 flex-1 flex-col">
      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <span className="h-[34px]" aria-hidden="true" />
          <Turntable record={false} />
          <span className="hidden h-20 lg:block" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="bg-muted h-[61px] w-72 rounded-lg motion-safe:animate-pulse" />
            <span className="bg-muted h-4 w-48 rounded motion-safe:animate-pulse" />
          </div>
          <TrackSkeleton />
        </div>
      </div>
    </section>
  );
}
