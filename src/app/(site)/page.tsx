import type { Metadata } from "next";
import { PageRow } from "@/components/layout/page-row";
import { HomeView, HowItWorks } from "@/features/home";
import { OPEN_GRAPH_BASE } from "@/lib/site";

// Title and description come from the root layout (default title).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...OPEN_GRAPH_BASE, url: "/" },
};

export default function HomePage() {
  return (
    <>
      <PageRow>
        <HomeView />
      </PageRow>
      <HowItWorks />
    </>
  );
}
