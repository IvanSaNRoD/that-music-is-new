import { Vinyl } from "@/components/brand/vinyl";
import { SiteHeader } from "@/components/layout/site-header";
import { CrateProvider } from "@/features/crate";
import { HistoryProvider } from "@/features/history";
import { RandomizeShortcut } from "@/features/randomizer";

/**
 * Shared shell for home (/) and genre pages (/{slug}) — ADR-0006.
 * Layouts don't re-render on navigation, so crate + History state persist between pages.
 * The History column belongs to the home page; genre pages show a compact "Your finds" trail.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <CrateProvider>
      <HistoryProvider>
        <RandomizeShortcut />
        <div className="relative isolate flex flex-1 flex-col overflow-clip">
          <SiteHeader />
          {/* Pages render their own <PageRow> (+ steps band on home, an invisible spacer elsewhere). */}
          <main className="flex flex-1 flex-col lg:justify-center">{children}</main>
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
