import { HomeScreen } from "@/components/home/home-screen";
import { HowItWorks } from "@/components/home/how-it-works";
import { SiteHeader } from "@/components/home/site-header";
import { Vinyl } from "@/components/home/vinyl";

export default function Home() {
  return (
    <div className="relative isolate flex flex-1 flex-col overflow-x-clip">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <HomeScreen />
        <HowItWorks />
      </main>
      {/* Decorative record: centre hole sits on the left screen edge. */}
      <Vinyl
        size={360}
        detailed
        className="pointer-events-none absolute bottom-[-92px] left-[-180px] -z-10 hidden lg:block"
      />
    </div>
  );
}
