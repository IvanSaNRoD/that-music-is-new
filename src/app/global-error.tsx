"use client"; // error boundaries must be Client Components

import { useEffect } from "react";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

/**
 * Last resort when the root layout itself fails: it replaces the whole document, so it brings its own
 * <html>, fonts and styles. No metadata export here (Client Component): React's <title> instead.
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => console.error(error), [error]);

  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col items-start justify-center gap-4 px-6 py-12 sm:px-12">
        <title>Something went wrong · That Music Is New</title>
        <p className="font-mono text-[15px] tracking-wide uppercase">That Music Is New</p>
        <h1 className="font-display text-[48px] leading-none font-extrabold tracking-[-0.02em]">The needle skipped</h1>
        <p className="max-w-[46ch] text-muted-foreground">Something went wrong on our side. Give it another spin.</p>
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-xl border-[1.5px] border-border-strong bg-primary px-5 py-2.5 text-[17px] font-bold transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink active:translate-y-px"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
