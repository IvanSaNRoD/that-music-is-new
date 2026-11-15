import Link from "next/link";
import { PageRow } from "@/components/layout/page-row";
import { HowItWorks } from "@/features/home";

export default function GenreNotFound() {
  return (
    <>
      <PageRow>
        <section className="flex min-w-0 flex-1 flex-col items-start gap-4">
          <h1 className="font-display text-[48px] leading-none font-extrabold tracking-[-0.02em]">Not in the crate</h1>
          <p className="max-w-[46ch] text-muted-foreground">
            We couldn&apos;t find that genre. Roll a random one or dig through the crate.
          </p>
          <Link
            href="/"
            className="rounded-xl border-[1.5px] border-border-strong bg-primary px-5 py-2.5 text-[17px] font-bold transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink"
          >
            Back to the crate
          </Link>
        </section>
      </PageRow>
      <HowItWorks placeholder />
    </>
  );
}
