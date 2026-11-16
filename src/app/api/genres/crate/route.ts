import { pickCrate } from "@/server/randomizer";

const CRATE_SIZE = 8;

// The crate (ADR-0007): 8 random genres, no Spotify call. Restock calls it again.
// Math.random stops prerendering, so this runs per request (route-handlers.md › With Cache Components).
export function GET() {
  return Response.json(pickCrate(CRATE_SIZE), { headers: { "Cache-Control": "no-store" } });
}
