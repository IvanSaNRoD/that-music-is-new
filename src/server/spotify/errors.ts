import "server-only";

/**
 * Failure talking to Spotify. `rate-limited` = Spotify answered 429 (no retry, ADR-0003);
 * `upstream` = any other error status, network failure, timeout or unexpected response shape.
 */
export class SpotifyError extends Error {
  constructor(
    readonly kind: "rate-limited" | "upstream",
    message: string,
    /** Seconds to wait, from Spotify's `Retry-After` (only for `rate-limited`). */
    readonly retryAfter?: number,
  ) {
    super(message);
    this.name = "SpotifyError";
  }
}

export type HttpError = { status: 500 | 502 | 503; headers?: Record<string, string> };

/** Maps an error to the status our API answers with (architecture.md › API: 429 → 503, other → 502). */
export function toHttpError(error: unknown): HttpError {
  if (!(error instanceof SpotifyError)) return { status: 500 };
  if (error.kind === "rate-limited") return { status: 503, headers: { "Retry-After": String(error.retryAfter ?? 1) } };
  return { status: 502 };
}

/** Reads `Retry-After` in seconds; Spotify sends an integer, anything else falls back to 1. */
export function retryAfterSeconds(res: Response): number {
  const seconds = Number(res.headers.get("retry-after"));
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : 1;
}
