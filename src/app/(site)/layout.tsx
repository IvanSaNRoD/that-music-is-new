import { Vinyl } from "@/components/brand/vinyl";
import { SiteHeader } from "@/components/layout/site-header";
import { CrateProvider } from "@/features/crate";
import { HistoryColumn, HistoryProvider } from "@/features/history";
import { HowItWorks } from "@/features/home";
import { RandomizeShortcut } from "@/features/randomizer";

/**
 * Shared shell for home (/) and genre pages (/{slug}) — ADR-0006.
 * Layouts don't re-render on navigation, so crate + History state persist between pages.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <CrateProvider>
      <HistoryProvider>
        <RandomizeShortcut />
        <div className="relative isolate flex flex-1 flex-col overflow-clip">
          <SiteHeader />
          <main className="flex flex-1 flex-col lg:justify-center">
            <div className="flex flex-col gap-8 px-6 pt-14 pb-8 lg:mx-auto lg:w-full lg:max-w-[1440px] lg:flex-row lg:items-stretch lg:px-12">
              {children}
              <HistoryColumn />
            </div>
            <HowItWorks />
          </main>
          {/* Decorative record: centre on the left edge, lower part cut off by the page bottom. */}
          <Vinyl
            size={360}
            detailed
            className="pointer-events-none absolute bottom-[-150px] left-[-180px] -z-10 hidden lg:block"
          />
        </div>
      </HistoryProvider>
    </CrateProvider>
  );
}
