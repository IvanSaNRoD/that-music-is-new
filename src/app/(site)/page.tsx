import { PageRow } from "@/components/layout/page-row";
import { HomeView, HowItWorks } from "@/features/home";

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
