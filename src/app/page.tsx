import { Vinyl } from "@/components/brand/vinyl";
import { SiteHeader } from "@/components/layout/site-header";
import { HomeScreen, HowItWorks } from "@/features/home";

export default function Home() {
  return (
    <div className="relative isolate flex flex-1 flex-col overflow-clip">
      <SiteHeader />
      <main className="flex flex-1 flex-col lg:justify-center">
        <HomeScreen />
        <HowItWorks />
      </main>
      {/* Decorative record: centre on the left edge, lower part cut off by the page bottom. */}
      <Vinyl
        size={360}
        detailed
        className="pointer-events-none absolute bottom-[-150px] left-[-180px] -z-10 hidden lg:block"
      />
    </div>
  );
}
