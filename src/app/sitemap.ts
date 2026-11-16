import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getCatalog } from "@/server/catalog";

// Home + every genre page (6,490 URLs, well under the 50,000 per-sitemap limit). No lastModified: the catalog is a frozen snapshot (ADR-0003).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [{ url: base }, ...getCatalog().entries.map((e) => ({ url: `${base}/${e.slug}` }))];
}
