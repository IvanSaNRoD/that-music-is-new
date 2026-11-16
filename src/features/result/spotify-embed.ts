/** Spotify iFrame API controller (subset we use). */
export type EmbedController = {
  loadEntity(uri: string): void;
  play(): void;
  pause(): void;
  destroy(): void;
  addListener(event: string, fn: (e: unknown) => void): void;
};

/** Object passed by Spotify to `window.onSpotifyIframeApiReady`. */
export type IFrameAPI = {
  createController(
    el: HTMLElement,
    options: { uri: string; width?: string | number; height?: number },
    cb: (c: EmbedController) => void,
  ): void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
  }
}

const SRC = "https://open.spotify.com/embed/iframe-api/v1";

// The script throws if loaded twice: it is injected once per page, and its one "ready" call is remembered.
let api: IFrameAPI | null = null;
let script: HTMLScriptElement | null = null;
let pending: Promise<IFrameAPI> | null = null;
const waiters = new Set<(api: IFrameAPI) => void>();

/**
 * Loads the Spotify iFrame API once per page. Rejects after `timeoutMs` (default 10000) or on script error, but a
 * failure is not final: a late "ready" is still kept for the next call, and a script that failed is injected again.
 */
export function loadIframeApi(timeoutMs = 10000): Promise<IFrameAPI> {
  if (api) return Promise.resolve(api);
  if (pending) return pending;
  // Must be defined before the script runs: Spotify calls it once when ready.
  window.onSpotifyIframeApiReady = (ready) => {
    api = ready;
    for (const resolve of waiters) resolve(ready);
    waiters.clear();
  };
  const promise = new Promise<IFrameAPI>((resolve, reject) => {
    const onReady = (ready: IFrameAPI) => settle(() => resolve(ready));
    const settle = (fn: () => void) => {
      clearTimeout(timer);
      waiters.delete(onReady);
      if (pending === promise) pending = null;
      fn();
    };
    const timer = setTimeout(() => settle(() => reject(new Error("Spotify iFrame API timed out"))), timeoutMs);
    waiters.add(onReady);
    if (!script) {
      script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      script.onerror = () => {
        script?.remove();
        script = null; // the next call tries again
        settle(() => reject(new Error("Spotify iFrame API failed to load")));
      };
      document.head.appendChild(script);
    }
  });
  pending = promise;
  return promise;
}

export const trackUri = (trackId: string) => `spotify:track:${trackId}`;
