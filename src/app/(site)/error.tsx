"use client"; // error boundaries must be Client Components

import { useEffect, useRef } from "react";
import Link from "next/link";
import { PageRow } from "@/components/layout/page-row";
import { HowItWorks } from "@/features/home";

/** 500 inside the site layout (header and History survive): same shape as not-found, with a retry. */
export default function SiteError({ error, retry }: { error: unknown; retry: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  // Production messages are generic (digest only); the console keeps it for whoever is debugging.
  // The page content was swapped without a navigation: move focus to the heading so it is announced.
  useEffect(() => {
    console.error(error);
    heading.current?.focus();
  }, [error]);

  return (
    <>
      <PageRow>
        <section className="flex min-w-0 flex-1 flex-col items-start gap-4">
          <h1
            ref={heading}
            tabIndex={-1}
            className="font-display text-[48px] leading-none font-extrabold tracking-[-0.02em] outline-none"
          >
            The needle skipped
          </h1>
          <p className="max-w-[46ch] text-muted-foreground">
            Something went wrong on our side. Try again, or go back and dig through the crate.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => retry()}
              className="rounded-xl border-[1.5px] border-border-strong bg-primary px-5 py-2.5 text-[17px] font-bold transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink active:translate-y-px"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center rounded text-[15px] font-semibold text-primary-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink touch:min-h-11"
            >
              Back to the crate
            </Link>
          </div>
        </section>
      </PageRow>
      <HowItWorks placeholder />
    </>
  );
}
