import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Any deeper URL (/a/b…) gets the site's own 404 (../../not-found.tsx, inside the site layout) instead of
// Next's bare default. Avoids the experimental global-not-found.
// Only the root app/not-found can export metadata, so the 404 title lives with the routes that 404
// (here, and in ../page.tsx › generateMetadata for unknown genres).
export const metadata: Metadata = { title: "Not in the crate", robots: { index: false } };

export default function DeeperPath() {
  notFound();
}
