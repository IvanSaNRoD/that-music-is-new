// Shared e2e setup: import `test` / `expect` from here instead of "@playwright/test".
// - Every test blocks the Spotify Embed (open.spotify.com): no third-party network, no flakiness.
//   Its iFrame API script is replaced by a fake that loads /embed/track/{id} into a blank iframe.
// - mock* helpers stub OUR API from the browser (page.route) so UI specs don't depend on the server data.
import { test as base, expect, type Page, type Route } from "@playwright/test";
import type { GenreResult } from "@/domain/genre";

/** GET /api/genres/crate item. */
export type CrateEntry = Pick<GenreResult, "genre" | "slug">;
/** Non-200 answer: status (+ headers, e.g. Retry-After) and an optional JSON body. */
export type MockReply = { status: number; headers?: Record<string, string>; body?: unknown };

export const sampleGenre: GenreResult = {
  genre: "Acid Jazz",
  slug: "acid-jazz",
  playlistId: "e2e-acid-jazz",
  playlistUrl: "https://open.spotify.com/playlist/e2e-acid-jazz",
  total: 172,
  tracks: [
    { id: "track-1", title: "Sample track 01", artists: "Sample artist 1" },
    { id: "track-2", title: "Sample track 02", artists: "Sample artist 2, Sample artist 3" },
  ],
};

export const sampleOtherGenre: GenreResult = {
  genre: "Trip Hop",
  slug: "trip-hop",
  playlistId: "e2e-trip-hop",
  playlistUrl: "https://open.spotify.com/playlist/e2e-trip-hop",
  total: 90,
  tracks: [{ id: "track-9", title: "Sample track 09", artists: "Sample artist 9" }],
};

export const sampleCrate: CrateEntry[] = [
  { genre: "Acid Jazz", slug: "acid-jazz" },
  { genre: "Trip Hop", slug: "trip-hop" },
];

const isReply = (r: unknown): r is MockReply => typeof r === "object" && r !== null && "status" in r;

function fulfill(route: Route, r: unknown) {
  if (!isReply(r)) return route.fulfill({ json: r, headers: { "Cache-Control": "no-store" } });
  const { status, headers, body = { error: "Mocked error" } } = r;
  return route.fulfill({ status, json: body, headers: { "Cache-Control": "no-store", ...headers } });
}

/** Path match (query ignored) so `/api/genres/<slug>` never catches `random` or `crate`. */
const apiPath = (path: string) => (url: URL) => url.pathname === path;

/** Stubs GET /api/genres/{slug}. */
export const mockGenre = (page: Page, slug: string, r: GenreResult | MockReply) =>
  page.route(apiPath(`/api/genres/${slug}`), (route) => fulfill(route, r));

/** Stubs GET /api/genres/random (any query). */
export const mockRandom = (page: Page, r: GenreResult | MockReply) =>
  page.route(apiPath("/api/genres/random"), (route) => fulfill(route, r));

/** Stubs GET /api/genres/crate. */
export const mockCrate = (page: Page, r: CrateEntry[] | MockReply) =>
  page.route(apiPath("/api/genres/crate"), (route) => fulfill(route, r));

/**
 * Stand-in for Spotify's iFrame API script: same contract (onSpotifyIframeApiReady → createController), but the
 * controller just points an iframe at /embed/track/{id}, so specs can assert which track the player loaded.
 * Like the real embed it reports playback through "playback_update": play() → playing, pause() → paused.
 * Specs drive it with window.__fakeEmbed: pause() (the listener pauses in the embed), end() (the track reaches its
 * end) and blocked = true (the browser refuses to start audio: play() reports nothing, as Safari / strict autoplay
 * policies do).
 */
const FAKE_IFRAME_API = `
  window.__fakeEmbed = window.__fakeEmbed || { blocked: false };
  window.onSpotifyIframeApiReady?.({
    createController(el, options, cb) {
      const frame = document.createElement("iframe");
      frame.title = "Spotify Embed";
      const show = (uri) => { frame.src = "https://open.spotify.com/embed/track/" + uri.split(":").pop(); };
      show(options.uri);
      el.replaceWith(frame);
      const listeners = {};
      const update = (isPaused, position = 1000) =>
        listeners.playback_update?.({ data: { isPaused, isBuffering: false, position, duration: 30000 } });
      window.__fakeEmbed.pause = () => update(true);
      window.__fakeEmbed.end = () => update(true, 30000);
      cb({
        loadEntity: show,
        play() { if (!window.__fakeEmbed.blocked) setTimeout(() => update(false), 50); },
        pause() { update(true); },
        destroy() { frame.remove(); },
        addListener(event, fn) { listeners[event] = fn; },
      });
    },
  });
`;

export const test = base.extend<{ blockSpotifyEmbed: void }>({
  blockSpotifyEmbed: [
    async ({ context }, use) => {
      await context.route("https://open.spotify.com/**", (route) =>
        route.fulfill({ status: 200, contentType: "text/html", body: "<html></html>" }),
      );
      // Registered last → wins over the catch-all above for the API script.
      await context.route("https://open.spotify.com/embed/iframe-api/**", (route) =>
        route.fulfill({ status: 200, contentType: "text/javascript", body: FAKE_IFRAME_API }),
      );
      await use();
    },
    { auto: true },
  ],
});

export { expect };
