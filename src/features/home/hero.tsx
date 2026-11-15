import { Shuffle } from "lucide-react";
import { Sparkle } from "@/components/brand/sparkle";

export function Hero({ onRandomize }: { onRandomize: () => void }) {
  return (
    <section className="flex flex-col gap-8 lg:w-[36%] lg:flex-none">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[15px] tracking-wide uppercase">~7,000 genres · one click</span>
        <span className="h-px flex-1 bg-border-strong" aria-hidden="true" />
      </div>

      <h1 className="font-display text-[56px] leading-[0.95] font-extrabold tracking-[-0.02em] text-balance sm:text-[80px]">
        Hear a{" "}
        <span className="relative inline-block">
          genre
          <Sparkle size={34} className="absolute -top-3 -right-11" />
          {/* Phones: the small sparkle would be cut by the screen edge. */}
          <Sparkle size={16} className="absolute top-6 -right-14 max-sm:hidden" />
        </span>{" "}
        you’ve never heard of.
      </h1>

      <p className="max-w-[30em] font-mono text-[17px] leading-relaxed text-muted-foreground">
        Discover a random genre. Listen to 10 tracks. Find your next obsession.
      </p>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="button"
          onClick={onRandomize}
          className="inline-flex items-center justify-center gap-3 rounded-2xl border-[1.5px] border-border-strong bg-primary px-10 py-[22px] text-[26px] font-bold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-ink active:translate-y-px max-lg:w-full"
        >
          <Shuffle size={28} strokeWidth={2.5} aria-hidden="true" />
          Randomize
        </button>
        {/* Keyboard hint: desktop only (shortcut is disabled on touch devices). */}
        <span className="hidden items-center gap-6 lg:flex">
          <span className="h-12 w-px bg-border-strong" aria-hidden="true" />
          <span className="flex items-center gap-2 text-[15px] text-muted-foreground">
            or press
            <kbd className="rounded-md border-[1.5px] border-border-strong px-2.5 py-1 font-mono text-[15px] text-foreground">
              Space
            </kbd>
          </span>
        </span>
      </div>
    </section>
  );
}
