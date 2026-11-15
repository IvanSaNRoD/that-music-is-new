import { pickRandomGenre } from "@/server/randomizer";

// Request 1 (ADR-0007): pick a random genre ≠ ?exclude, no Spotify call.
export function GET(request: Request) {
  const exclude = new URL(request.url).searchParams.get("exclude") ?? undefined;
  return Response.json(pickRandomGenre(exclude), { headers: { "Cache-Control": "no-store" } });
}
