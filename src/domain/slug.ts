/**
 * URL slug for a genre name (ADR-0006): lowercase, accents stripped, "&" → "and",
 * any other run of non-alphanumerics → "-", no leading/trailing "-".
 * e.g. "Trip hop" → "trip-hop", "R&B" → "r-and-b", "Música popular" → "musica-popular".
 * Uniqueness across the real catalog is checked when the catalog is generated (E1).
 */
export function toSlug(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findBySlug<T extends { slug: string }>(items: readonly T[], slug: string): T | undefined {
  return items.find((item) => item.slug === slug);
}
