import "server-only";
import { retryAfterSeconds, SpotifyError } from "./errors";
import { tokenSchema } from "./schemas";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
/** Refresh this long before Spotify's expiry so a token never dies mid-request. */
const EXPIRY_MARGIN_MS = 60_000;
const TIMEOUT_MS = 8_000;

// Per server instance: one token shared by all requests (Client Credentials, ADR-0002).
let cached: { value: string; expiresAt: number } | null = null;
let inFlight: Promise<string> | null = null;

/** Returns a valid app token, requesting a new one only when missing or about to expire. */
export function getToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt) return Promise.resolve(cached.value);
  // Concurrent callers share one token request.
  inFlight ??= requestToken().finally(() => {
    inFlight = null;
  });
  return inFlight;
}

/** Drops the cached token (Spotify answered 401). */
export function invalidateToken(): void {
  cached = null;
}

async function requestToken(): Promise<string> {
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
  // Config bug, not a Spotify failure → plain Error (our API answers 500).
  if (!id || !secret) throw new Error("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET");

  let res: Response;
  try {
    res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    throw new SpotifyError("upstream", `Token request failed: ${String(error)}`);
  }
  if (res.status === 429) throw new SpotifyError("rate-limited", "Token request rate-limited", retryAfterSeconds(res));
  if (!res.ok) throw new SpotifyError("upstream", `Token request failed: ${res.status}`);

  const parsed = tokenSchema.safeParse(await res.json().catch(() => null));
  if (!parsed.success) throw new SpotifyError("upstream", "Unexpected token response");

  const { access_token, expires_in } = parsed.data;
  cached = { value: access_token, expiresAt: Date.now() + expires_in * 1000 - EXPIRY_MARGIN_MS };
  return access_token;
}
