import { Fragment } from "react";
import { Vinyl } from "./vinyl";

const STEPS = [
  { title: "Roll", body: "Get a random genre from the catalog." },
  { title: "Listen", body: "Play its tracks right here." },
  { title: "Dig deeper", body: "Liked it? Continue on Spotify." },
];

// Tablet: cards + tagline form one centred group.
// Desktop: same 1440px container as the row above; 3 equal card columns + tagline on the right.
export function HowItWorks() {
  return (
    <section
      aria-label="How it works"
      className="flex flex-col gap-8 px-6 pt-6 pb-12 md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-x-14 md:gap-y-6 md:px-12 lg:mx-auto lg:grid lg:w-full lg:max-w-[1440px] lg:grid-cols-[1fr_auto]"
    >
      <ol className="flex flex-col items-stretch md:flex-row md:items-center lg:grid lg:grid-cols-[1fr_32px_1fr_32px_1fr]">
        {STEPS.map((s, i) => (
          <Fragment key={s.title}>
            {i > 0 && (
              <li aria-hidden="true" className="bg-border mx-auto h-6 w-px md:mx-0 md:h-px md:w-8 lg:w-full" />
            )}
            {/* Lighter than the main panels: tonal card, no ink outline, so the crate stays the focus. */}
            <li className="bg-card flex items-center gap-4 rounded-[14px] px-5 max-md:py-4 md:h-[96px] md:w-[290px] md:max-w-[26vw] lg:w-auto lg:max-w-none lg:min-w-0">
              <span className="bg-primary font-display flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-extrabold">
                {i + 1}
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-display text-lg leading-tight font-extrabold tracking-[-0.02em]">
                  {s.title}
                </span>
                <span className="text-muted-foreground text-sm leading-snug">{s.body}</span>
              </span>
            </li>
          </Fragment>
        ))}
      </ol>

      <div className="flex items-center gap-4 self-end md:self-center">
        <Vinyl size={48} rings={4} />
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
