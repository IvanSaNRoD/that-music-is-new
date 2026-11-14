import type { CSSProperties } from "react";
import { bandCenter, Vinyl } from "@/components/brand/vinyl";
import "./turntable.css";

type TurntableProps = {
  /** Record label colour (the genre's sleeve tone). */
  label?: string;
  /** Record turns (loading or playing). Pauses in place, never snaps back. */
  spinning?: boolean;
  /** Tonearm lowered onto the record (a track is playing). */
  armDown?: boolean;
  /** Record lands on the platter on mount ("the record comes out of the sleeve"). */
  arrive?: boolean;
  /** false = empty platter (route still resolving). */
  record?: boolean;
  /** Tracks on the record (draws one band each). */
  trackCount?: number;
  /** Index of the playing track: the needle sits in its band (track 1 at the rim, last near the label). */
  track?: number | null;
};

// Plinth geometry (px in the 440×400 design box; see turntable.css): tonearm pivot, arm length, record.
const PIVOT = { x: 388, y: 50 };
const ARM = 250;
const RECORD = { x: 194, y: 200, scale: 340 / 100 }; // centre + px per vinyl viewBox unit

/** Tonearm angle (deg) that puts the needle at `radius` px from the record centre (bisection; distance falls as the angle grows). */
function armAngleFor(radius: number) {
  let lo = 5;
  let hi = 45;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    const t = (mid * Math.PI) / 180;
    const d = Math.hypot(PIVOT.x - ARM * Math.sin(t) - RECORD.x, PIVOT.y + ARM * Math.cos(t) - RECORD.y);
    if (d > radius) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Decorative deck that mirrors playback state. Plinth colour = `--genre-bg` / `--genre-fg` (card when unset). All geometry is in % of a fixed 440×400 plinth,
 * so it scales with its column. Spec: docs/design/result-screen-brief.md.
 */
export function Turntable({
  label,
  spinning = false,
  armDown = false,
  arrive = false,
  record = true,
  trackCount = 0,
  track = null,
}: TurntableProps) {
  const angle =
    track !== null && trackCount > 0 ? armAngleFor(bandCenter(track, trackCount) * RECORD.scale) : undefined;
  return (
    <div className="turntable" aria-hidden="true">
      <span className="turntable-platter-mat" />
      {record ? (
        <div className={`turntable-record ${arrive ? "is-arriving" : ""}`}>
          <div className="turntable-spin" data-spinning={spinning}>
            <Vinyl size={340} detailed label={label} bands={trackCount} className="h-auto w-full" />
          </div>
        </div>
      ) : (
        <span className="turntable-platter" />
      )}
      <div
        className="turntable-arm"
        data-down={armDown}
        style={angle === undefined ? undefined : ({ "--arm-angle": `${angle.toFixed(2)}deg` } as CSSProperties)}
      >
        <span className="turntable-arm-head" />
      </div>
      <span className="turntable-pivot" />
      <span className="turntable-speed">33⅓</span>
    </div>
  );
}
