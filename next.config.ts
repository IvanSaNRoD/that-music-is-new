import type { NextConfig } from "next";

// Security headers on every response (F1, ADR-0008). CSP without nonces: a nonce needs every page rendered per
// request, which Partial Prerendering (cacheComponents) can't do, so Next's inline scripts need 'unsafe-inline'.
// Third parties = the Spotify Embed only: its iFrame API script (which loads one more from spotifycdn) + its iframe.
// 'unsafe-eval' in production too: Spotify ships that script as a webpack "eval" build (every module in eval()),
// so without it the player is never created. (Dev needs it anyway for React's debugging.)
const isPreview = process.env.VERCEL_ENV === "preview"; // Vercel's preview toolbar / comments (vercel.live)
const live = isPreview ? " https://vercel.live" : "";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://open.spotify.com https://embed-cdn.spotifycdn.com${live}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${live}`,
  `frame-src https://open.spotify.com${live}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  // HSTS: already sent by Vercel on every deployment.
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Clients that ask for the legacy icon paths directly (Slack, RSS readers, old iOS) would otherwise hit
  // /[genre] and get a 200 HTML page. Temporary (307), so a real .ico can replace them later.
  async redirects() {
    return ["/favicon.ico", "/apple-touch-icon.png", "/apple-touch-icon-precomposed.png"].map((source) => ({
      source,
      destination: "/apple-icon",
      permanent: false,
    }));
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
