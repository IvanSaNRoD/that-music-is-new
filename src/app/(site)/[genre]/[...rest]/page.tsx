import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OPEN_GRAPH_BASE } from "@/lib/site";

// Any deeper URL (/a/b…) gets the site's own 404 (../../not-found.tsx, inside the site layout) instead of
// Next's bare default. Avoids the experimental global-not-found.
// Only the root app/not-found can export metadata, so the 404 title lives with the routes that 404
// (here, and in ../page.tsx › generateMetadata for unknown genres).
// images: [] → no inherited og:image from ../opengraph-image (it would point at a genre that doesn't exist).
export const metadata: Metadata = {
  title: "Not in the crate",
  robots: { index: false },
  openGraph: { ...OPEN_GRAPH_BASE, images: [] },
};

// Always a 404: nothing to validate for instant navigation (dev logged "Could not validate `instant`").
export const instant = false;

export default function DeeperPath() {
  notFound();
}
