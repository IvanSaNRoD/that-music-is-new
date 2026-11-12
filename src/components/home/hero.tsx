import { Shuffle } from "lucide-react";
import { Sparkle } from "./sparkle";

export function Hero({ onRandomize }: { onRandomize: () => void }) {
  return (
    <section className="flex flex-col gap-8 lg:w-[36%] lg:flex-none">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[15px] tracking-wide uppercase">~7,000 genres · one click</span>
        <span className="bg-border-strong h-px flex-1" aria-hidden="true" />
      </div>

      <h1 className="font-display text-[56px] leading-[0.95] font-extrabold tracking-[-0.02em] text-balance sm:text-[80px]">
        Hear a{" "}
        <span className="relative inline-block">
          genre
          <Sparkle size={34} className="absolute -top-3 -right-11" />
          <Sparkle size={16} className="absolute top-6 -right-14" />
        </span>{" "}
        you’ve never heard of.
      </h1>

      <p className="text-muted-foreground max-w-[30em] font-mono text-[17px] leading-relaxed">
        Discover a random genre. Listen to 10 tracks. Find your next obsession.
      </p>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="button"
          onClick={onRandomize}
          className="bg-primary text-primary-foreground border-border-strong hover:bg-primary-hover focus-visible:outline-primary-ink inline-flex items-center gap-3 rounded-2xl border-[1.5px] px-10 py-[22px] text-[26px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-px"
        >
          <Shuffle size={28} strokeWidth={2.5} aria-hidden="true" />
          Randomize
        </button>
        <span className="bg-border-strong h-12 w-px" aria-hidden="true" />
        <span className="text-muted-foreground flex items-center gap-2 text-[15px]">
          or press
          <kbd className="border-border-strong text-foreground rounded-md border-[1.5px] px-2.5 py-1 font-mono text-[15px]">
            Space
          </kbd>
        </span>
      </div>
    </section>
  );
}
