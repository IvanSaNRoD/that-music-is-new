import { SkipBack, SkipForward } from "lucide-react";
import { blurIfPointer } from "@/lib/utils";
import "./track-transport.css";

type TrackTransportProps = {
  /** Index of the playing (or cued) track. */
  index: number;
  count: number;
  onPrev: () => void;
  onNext: () => void;
  /** "plinth": two buttons on the turntable's plinth (≥lg). "bar": the phone bottom bar row, with "Track 03 of 10". */
  variant: "plinth" | "bar";
};

const pad = (n: number) => String(n).padStart(2, "0");

/** ⏮ / ⏭ through the genre's tracks (#55): no wrap-around, so the ends are disabled. */
export function TrackTransport({ index, count, onPrev, onNext, variant }: TrackTransportProps) {
  const button = (label: string, onClick: () => void, disabled: boolean, icon: React.ReactNode) => (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        blurIfPointer(e); // Space stays "roll again"
        onClick();
      }}
      className="track-transport-button"
    >
      {icon}
    </button>
  );
  return (
    <div className="track-transport" data-variant={variant}>
      {button("Previous track", onPrev, index <= 0, <SkipBack aria-hidden="true" fill="currentColor" />)}
      {variant === "bar" && (
        <span className="track-transport-count">
          Track {pad(index + 1)} of {pad(count)}
        </span>
      )}
      {button("Next track", onNext, index >= count - 1, <SkipForward aria-hidden="true" fill="currentColor" />)}
    </div>
  );
}
