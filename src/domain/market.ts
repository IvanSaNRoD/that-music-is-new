// ISO 3166-1 user-assigned codes (AA, QM–QZ, XA–XZ, ZZ): never real countries; Spotify rejects them with 400.
const RESERVED = /^(AA|Q[M-Z]|X[A-Z]|ZZ)$/;

/** Normalises a country code (e.g. Vercel's `x-vercel-ip-country`) to a Spotify `market`, defaulting to "US". */
export function toMarket(country: string | null | undefined): string {
  const code = (country ?? "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) && !RESERVED.test(code) ? code : "US";
}
