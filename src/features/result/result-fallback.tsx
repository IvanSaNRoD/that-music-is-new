import { TrackSkeleton } from "./track-list";
import { Turntable } from "./turntable";

/**
 * Instant shell for /{genre} while the route params resolve (Next "instant navigation": URL data must be
 * read inside <Suspense>). Same geometry as ResultView so nothing jumps; the empty platter waits for the record.
 */
export function ResultFallback() {
  return (
    <section aria-busy="true" aria-label="Loading genre" className="flex min-w-0 flex-1 flex-col">
      <div className="grid grid-cols-[clamp(88px,28vw,120px)_minmax(0,1fr)] gap-x-4 gap-y-5 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-8 xl:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4 max-lg:contents">
          <span className="h-[34px] max-lg:col-span-2 touch:h-11" aria-hidden="true" />
          <Turntable record={false} compact />
          <span className="hidden h-20 lg:block" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-col gap-6 max-lg:contents">
          <div className="flex flex-col gap-3 max-lg:gap-2 max-lg:self-center">
            <span className="h-9 w-full max-w-72 rounded-lg bg-muted motion-safe:animate-pulse lg:h-[61px]" />
            <span className="h-4 w-48 max-w-full rounded bg-muted motion-safe:animate-pulse" />
          </div>
          <span className="min-h-11 max-lg:col-span-2 lg:hidden" aria-hidden="true" />
          <div className="max-lg:col-span-2">
            <TrackSkeleton />
          </div>
        </div>
      </div>
    </section>
  );
}
