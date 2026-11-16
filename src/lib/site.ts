export const SITE_NAME = "That Music Is New";

/**
 * Absolute origin for metadata, sitemap and robots: Vercel's production domain (set by Vercel at build and
 * run time), else localhost for dev, tests and CI.
 */
export function siteUrl() {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return host ? `https://${host}` : `http://localhost:${process.env.PORT ?? 3000}`;
}

/** Open Graph fields every page repeats: a page's `openGraph` replaces the layout's instead of merging with it. */
export const OPEN_GRAPH_BASE = { siteName: SITE_NAME, type: "website", locale: "en" } as const;
