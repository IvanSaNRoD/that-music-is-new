import { Fragment } from "react";
import { Vinyl } from "./vinyl";

const STEPS = [
  { title: "Roll", body: "Get a random genre from the catalog." },
  { title: "Listen", body: "Play its tracks right here." },
  { title: "Dig deeper", body: "Liked it? Continue on Spotify." },
];

export function HowItWorks() {
  return (
    <section
      aria-label="How it works"
      className="flex flex-col gap-8 px-6 pt-6 pb-12 lg:flex-row lg:items-center lg:justify-between lg:pr-12 lg:pl-60"
    >
      <ol className="flex flex-col items-stretch lg:flex-row lg:items-center">
        {STEPS.map((s, i) => (
          <Fragment key={s.title}>
            {i > 0 && (
              <li aria-hidden="true" className="bg-border-strong mx-auto h-6 w-[1.5px] lg:mx-0 lg:h-[1.5px] lg:w-8" />
            )}
            <li className="bg-card border-border-strong flex items-center gap-4 rounded-[14px] border-[1.5px] px-5 lg:h-[110px] lg:w-[290px] max-lg:py-4">
              <span className="bg-primary border-border-strong font-display flex size-11 shrink-0 items-center justify-center rounded-full border-[1.5px] text-xl font-extrabold">
                {i + 1}
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-display text-[22px] leading-tight font-extrabold tracking-[-0.02em]">
                  {s.title}
                </span>
                <span className="text-muted-foreground text-sm leading-snug">{s.body}</span>
              </span>
            </li>
          </Fragment>
        ))}
      </ol>

      <div className="flex items-center gap-4 self-end lg:self-auto">
        <Vinyl size={48} />
        <span className="relative font-mono text-[15px] leading-snug font-bold uppercase">
          Discover
          <br />
          something new
          {/* Hand-drawn underline */}
          <svg
            viewBox="0 0 160 12"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="text-primary-ink absolute -bottom-3 left-0 h-3 w-full"
          >
            <path
              d="M2 8 C 30 3, 60 10, 90 5 S 140 4, 158 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
    </section>
  );
}
