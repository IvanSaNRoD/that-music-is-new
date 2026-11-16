import { notFound } from "next/navigation";
import { getCatalog } from "@/server/catalog";
import { genreImage, OG_SIZE } from "@/server/og";

export const alt = "The genre’s record sleeve on That Music Is New";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ genre: string }> }) {
  const { genre: slug } = await params;
  const entry = getCatalog().bySlug.get(slug);
  if (!entry) notFound();
  return genreImage(entry.genre, entry.slug);
}
