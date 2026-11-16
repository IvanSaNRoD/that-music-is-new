import { getCatalog } from "@/server/catalog";
import { OG_SIZE, siteImage } from "@/server/og";

export const alt = "That Music Is New — hear a genre you’ve never heard of";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return siteImage(getCatalog().entries.length);
}
