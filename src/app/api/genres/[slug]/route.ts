import { toMarket } from "@/domain/market";
import { getGenreSample } from "@/server/randomizer";
import { toHttpError } from "@/server/spotify/errors";

const NO_STORE = { "Cache-Control": "no-store" }; // results are random

// Request 2 (ADR-0007): genre + up to 10 tracks, one Spotify call. Every way of opening a genre ends here.
export async function GET(request: Request, ctx: RouteContext<"/api/genres/[slug]">) {
  const { slug } = await ctx.params;
  // Vercel adds the visitor's country; missing locally → US (domain/market.ts).
  const market = toMarket(request.headers.get("x-vercel-ip-country"));
  try {
    const result = await getGenreSample(slug, market);
    if (!result) return Response.json({ error: "Genre not found" }, { status: 404, headers: NO_STORE });
    return Response.json(result, { headers: NO_STORE });
  } catch (error) {
    const { status, headers } = toHttpError(error);
    if (status === 500)
      console.error(error); // our bug (e.g. missing credentials), not Spotify's
    else console.warn(`[api/genres/${slug}] ${status}: ${error instanceof Error ? error.message : String(error)}`);
    const message = status === 500 ? "Internal error" : "Spotify unavailable";
    return Response.json({ error: message }, { status, headers: { ...NO_STORE, ...headers } });
  }
}
