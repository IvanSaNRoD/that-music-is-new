import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const SRC = "https://open.spotify.com/embed/iframe-api/v1";

async function load() {
  return import("./spotify-embed");
}

const scripts = () => document.querySelectorAll(`script[src="${SRC}"]`);

describe("loadIframeApi", () => {
  beforeEach(() => {
    vi.resetModules();
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    delete window.onSpotifyIframeApiReady;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("injects the Spotify iFrame API script", async () => {
    const { loadIframeApi } = await load();
    void loadIframeApi();
    expect(scripts()).toHaveLength(1);
  });

  it("resolves with the IFrameAPI Spotify passes to onSpotifyIframeApiReady", async () => {
    const { loadIframeApi } = await load();
    const api = { createController: vi.fn() };
    const promise = loadIframeApi();
    window.onSpotifyIframeApiReady?.(api);
    await expect(promise).resolves.toBe(api);
  });

  it("returns the same promise on later calls and never injects the script twice", async () => {
    const { loadIframeApi } = await load();
    const first = loadIframeApi();
    const second = loadIframeApi();
    expect(second).toBe(first);
    expect(scripts()).toHaveLength(1);
  });

  it("rejects when Spotify is not ready within the timeout", async () => {
    vi.useFakeTimers();
    const { loadIframeApi } = await load();
    const promise = loadIframeApi(500);
    const assertion = expect(promise).rejects.toThrow(/timed out/i);
    await vi.advanceTimersByTimeAsync(500);
    await assertion;
  });

  it("rejects when the script fails to load", async () => {
    const { loadIframeApi } = await load();
    const promise = loadIframeApi();
    scripts()[0].dispatchEvent(new Event("error"));
    await expect(promise).rejects.toThrow(/failed to load/i);
  });

  it("tries the script again on the next call after it failed to load", async () => {
    const { loadIframeApi } = await load();
    const failed = loadIframeApi();
    const broken = scripts()[0];
    broken.dispatchEvent(new Event("error"));
    await expect(failed).rejects.toThrow(/failed to load/i);

    const retry = loadIframeApi();
    expect(scripts()).toHaveLength(1); // the broken one was removed…
    expect(scripts()[0]).not.toBe(broken); // …and a fresh one injected
    const api = { createController: vi.fn() };
    window.onSpotifyIframeApiReady?.(api);
    await expect(retry).resolves.toBe(api);
  });

  it("still uses Spotify when it answers after a timeout (the next page gets the player)", async () => {
    vi.useFakeTimers();
    const { loadIframeApi } = await load();
    const late = loadIframeApi(100);
    const timedOut = expect(late).rejects.toThrow(/timed out/i);
    await vi.advanceTimersByTimeAsync(100);
    await timedOut;

    const api = { createController: vi.fn() };
    window.onSpotifyIframeApiReady?.(api); // the slow script finally runs
    await expect(loadIframeApi(100)).resolves.toBe(api);
    expect(scripts()).toHaveLength(1);
  });
});

describe("trackUri", () => {
  it("builds a Spotify track URI", async () => {
    const { trackUri } = await load();
    expect(trackUri("4uLU6hMCjMI75M1A2tKUQC")).toBe("spotify:track:4uLU6hMCjMI75M1A2tKUQC");
  });
});
