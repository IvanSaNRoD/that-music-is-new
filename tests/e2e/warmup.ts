// Local runs only (`next dev`): compile the main routes once before the parallel tests start. A route's first
// compile makes `next dev` reload open pages, which breaks tests mid-flight (e.g. "execution context was
// destroyed"). CI serves a production build: nothing to warm.
const BASE = "http://localhost:3000";

export default async function warmup() {
  if (process.env.CI) return;
  const html = await (await fetch(`${BASE}/acid-jazz`)).text();
  const genreOg = html.match(/\/acid-jazz\/opengraph-image[^"?]*/)?.[0];
  const routes = ["/", "/opengraph-image", "/sitemap.xml", "/robots.txt", "/no-such/deeper/path", "/api/genres/crate"];
  for (const path of genreOg ? [...routes, genreOg] : routes) await fetch(`${BASE}${path}`);
}
