import Link from "next/link";
import { PageRow } from "@/components/layout/page-row";
import { HowItWorks } from "@/features/home";

export default function GenreNotFound() {
  return (
    <>
      <PageRow>
        <section className="flex min-w-0 flex-1 flex-col items-start gap-4">
          <h1 className="font-display text-[48px] leading-none font-extrabold tracking-[-0.02em]">Not in the crate</h1>
          <p className="text-muted-foreground max-w-[46ch]">
            We couldn&apos;t find that genre. Roll a random one or dig through the crate.
          </p>
          <Link
            href="/"
            className="bg-primary border-border-strong hover:bg-primary-hover focus-visible:outline-primary-ink rounded-xl border-[1.5px] px-5 py-2.5 text-[17px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Back to the crate
          </Link>
        </section>
      </PageRow>
      <HowItWorks placeholder />
    </>
  );
}
