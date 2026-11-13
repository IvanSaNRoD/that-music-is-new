import { Vinyl } from "@/components/brand/vinyl";
import { TrackSkeleton } from "./track-list";
import "./result-view.css";

/**
 * Instant shell for /{genre} while the route params resolve (Next "instant navigation": URL data must be
 * read inside <Suspense>). Same geometry as ResultView so nothing jumps when the real view swaps in.
 */
export function ResultFallback() {
  return (
    <section aria-busy="true" aria-label="Loading genre" className="flex min-w-0 flex-1 flex-col gap-5">
      <span className="h-[34px]" aria-hidden="true" />
      <div className="result-head">
        <div className="result-record is-spinning">
          <Vinyl size={220} detailed />
        </div>
        <div className="result-sleeve bg-muted flex flex-col gap-4 px-8 pt-7 pb-8" style={{ animation: "none" }}>
          <span className="bg-background/60 h-[61px] w-72 rounded-lg motion-safe:animate-pulse" />
          <span className="bg-background/60 h-4 w-48 rounded motion-safe:animate-pulse" />
          <span className="h-[46px]" />
        </div>
      </div>
      <TrackSkeleton />
    </section>
  );
}
