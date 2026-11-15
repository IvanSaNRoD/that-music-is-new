import { Fragment } from "react";
import { Vinyl } from "@/components/brand/vinyl";

const STEPS = [
  { title: "Roll", body: "Get a random genre from the catalog." },
  { title: "Listen", body: "Play its tracks right here." },
  { title: "Dig deeper", body: "Liked it? Continue on Spotify." },
];

// Below lg (phones, tablets): one centred column, cards stacked with vertical connectors.
// Desktop: same 1440px container as the row above; 3 equal card columns + tagline on the right.
/**
 * `placeholder`: invisible, inert copy that keeps the band's height on desktop (genre pages), so the
 * page height — and the decorative corner vinyl — doesn't jump between home and a genre.
 */
export function HowItWorks({ placeholder = false }: { placeholder?: boolean }) {
  return (
    <section
      aria-label={placeholder ? undefined : "How it works"}
      aria-hidden={placeholder || undefined}
      inert={placeholder}
      className={`${placeholder ? "invisible max-lg:hidden " : ""}mx-auto flex w-full max-w-[720px] flex-col gap-8 px-6 pt-6 pb-12 lg:grid lg:max-w-[1440px] lg:grid-cols-[1fr_auto] lg:items-center lg:gap-x-14 lg:gap-y-6 lg:px-12`}
    >
      <ol className="flex flex-col items-stretch lg:grid lg:items-center lg:grid-cols-[1fr_32px_1fr_32px_1fr]">
        {STEPS.map((s, i) => (
          <Fragment key={s.title}>
            {i > 0 && <li aria-hidden="true" className="bg-border mx-auto h-6 w-px lg:mx-0 lg:h-px lg:w-full" />}
            {/* Lighter than the main panels: tonal card, no ink outline, so the crate stays the focus. */}
            <li className="bg-card flex items-center gap-4 rounded-[14px] px-5 py-4 lg:h-[96px] lg:min-w-0 lg:py-0">
              <span className="bg-primary font-display flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-extrabold">
                {i + 1}
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-display text-lg leading-tight font-extrabold tracking-[-0.02em]">{s.title}</span>
                <span className="text-muted-foreground text-sm leading-snug">{s.body}</span>
              </span>
            </li>
          </Fragment>
        ))}
      </ol>

      <div className="flex items-center gap-4 self-end lg:self-center">
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
