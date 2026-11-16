import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { toneIndex } from "@/domain/tone";

/** Open Graph images: 1200×630 (Facebook, X, LinkedIn, Slack, WhatsApp). */
export const OG_SIZE = { width: 1200, height: 630 };

// Satori (next/og) can't read CSS variables: hex copies of the globals.css tokens. Keep in sync.
const C = {
  kinari: "#F3EBDA",
  sumi: "#1C1C1C",
  seiji: "#8DB6A5",
  agedPaper: "#E6DCC6",
  seijiInk: "#3B705D",
  fadedInk: "#4F5A4D",
};

// Sleeve [bg, text, hole] by tone index — same order as features/crate/tones.ts.
const TONES = [
  [C.seiji, C.sumi, C.kinari],
  [C.sumi, C.kinari, C.seiji],
  [C.agedPaper, C.sumi, C.seijiInk],
  [C.seijiInk, C.kinari, C.kinari],
  [C.fadedInk, C.kinari, C.seiji],
] as const;

// Static TTFs (Satori needs ttf/otf/woff, not next/font): Inter Tight 800 + Space Mono 400, SIL OFL (og-fonts/OFL.txt).
type Font = { name: string; data: Buffer; weight: 400 | 800; style: "normal" };
let fonts: Promise<Font[]> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all(
    ["InterTight-ExtraBold.ttf", "SpaceMono-Regular.ttf"].map((f) =>
      readFile(join(process.cwd(), "src/server/og-fonts", f)),
    ),
  )
    .then(([tight, mono]): Font[] => [
      { name: "Inter Tight", data: tight, weight: 800, style: "normal" },
      { name: "Space Mono", data: mono, weight: 400, style: "normal" },
    ])
    .catch((e) => {
      fonts = undefined; // a failed read must not break every later image of this instance
      throw e;
    }));

// next/og defaults to max-age=0. The image URL carries a content hash (?…), so it can be cached for good
// (Vercel CDN, social crawlers) instead of re-running Satori on every request.
const CACHE = { "Cache-Control": "public, max-age=31536000, immutable" };

/** The brand vinyl (components/brand/vinyl.tsx geometry): Sumi disc, Kinari grooves, label, Sumi spindle hole. */
function Vinyl({ size, label = C.seiji, grooves = 4 }: { size: number; label?: string; grooves?: number }) {
  const rings = grooves === 1 ? [36] : Array.from({ length: grooves }, (_, i) => 25 + (i * 20) / (grooves - 1));
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="49" fill={C.sumi} />
      {rings.map((r) => (
        <circle key={r} cx="50" cy="50" r={r} fill="none" stroke={C.kinari} strokeOpacity="0.22" strokeWidth="1" />
      ))}
      <circle cx="50" cy="50" r="20" fill={label} />
      <circle cx="50" cy="50" r="4" fill={C.sumi} />
    </svg>
  );
}

const mono = { fontFamily: "Space Mono", fontSize: 26, color: C.fadedInk } as const;
const brand = { ...mono, color: C.sumi, letterSpacing: "0.04em" } as const;

/** Site card: the home headline beside a record pulled half out of frame (the home's corner vinyl). */
export async function siteImage(genreCount: number) {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: C.kinari, position: "relative" }}>
      <div style={{ position: "absolute", right: -190, top: 35, display: "flex" }}>
        <Vinyl size={560} grooves={9} />
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, width: 780 }}
      >
        <div style={brand}>THAT MUSIC IS NEW</div>
        <div
          style={{
            fontFamily: "Inter Tight",
            fontSize: 104,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: C.sumi,
          }}
        >
          Hear a genre you’ve never heard of.
        </div>
        <div style={mono}>{`${genreCount.toLocaleString("en-US")} rare genres · 10 tracks each`}</div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: await loadFonts(), headers: CACHE },
  );
}

/** Long names step down so the worst catalog names (~40 chars) fit the 496px column in ≤ 4 lines, never clipped. */
const nameSize = (name: string) => (name.length <= 10 ? 128 : name.length <= 18 ? 96 : name.length <= 26 ? 80 : 60);

/** Genre card: the genre name beside its sleeve (Genre Tone Rule), the record peeking out of it. */
export async function genreImage(name: string, slug: string) {
  const [bg, , hole] = TONES[toneIndex(slug)];
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: C.kinari, position: "relative" }}>
      {/* Record pulled out of the sleeve towards the right edge. */}
      <div style={{ position: "absolute", right: -120, top: 135, display: "flex" }}>
        <Vinyl size={360} grooves={6} label={hole} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 150,
          top: 115,
          width: 400,
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          border: `3px solid ${C.sumi}`,
          borderRadius: 20,
          boxShadow: "0 6px 18px rgba(28,28,28,0.18)",
        }}
      >
        {/* Die-cut hole showing the label, Sumi spindle (DESIGN.md › The Sleeve Palette Rule). */}
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 9999,
            background: hole,
            border: `2px solid ${C.sumi}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 22, height: 22, borderRadius: 9999, background: C.sumi }} />
        </div>
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, width: 640 }}
      >
        <div style={brand}>THAT MUSIC IS NEW</div>
        <div
          style={{
            display: "block",
            lineClamp: 4,
            fontFamily: "Inter Tight",
            fontSize: nameSize(name),
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: C.sumi,
            wordBreak: "break-word",
          }}
        >
          {name}
        </div>
        <div style={{ ...mono, fontSize: 24 }}>Rare genre · 10 tracks to taste</div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: await loadFonts(), headers: CACHE },
  );
}

/** apple-touch-icon: the brand vinyl on Kinari (iOS adds its own rounded mask). */
export function appleIcon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: C.kinari,
      }}
    >
      <Vinyl size={148} grooves={3} />
    </div>,
    { width: 180, height: 180, headers: CACHE },
  );
}
