import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { EmbedController, IFrameAPI } from "./spotify-embed";
import { useSpotifyPlayer } from "./use-spotify-player";

/** Fake API whose readiness the test controls. */
function deferredApi() {
  let resolve!: (api: IFrameAPI) => void;
  let reject!: (e: Error) => void;
  const promise = new Promise<IFrameAPI>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { loadApi: () => promise, resolve, reject };
}

/** Fake IFrameAPI that records createController calls; the test fires the callback. */
function fakeApi() {
  const calls: { el: HTMLElement; options: unknown; cb: (c: EmbedController) => void }[] = [];
  const api: IFrameAPI = { createController: (el, options, cb) => calls.push({ el, options, cb }) };
  return { api, calls };
}

function fakeController() {
  const listeners = new Map<string, (e: unknown) => void>();
  return {
    loadEntity: vi.fn(),
    play: vi.fn(),
    pause: vi.fn(),
    destroy: vi.fn(),
    addListener: vi.fn((event: string, fn: (e: unknown) => void) => listeners.set(event, fn)),
    /** What Spotify sends after a playback change (docs: playback_update → { data: { isPaused, … } }). */
    update: (data: { isPaused: boolean; position?: number; duration?: number }) =>
      listeners.get("playback_update")?.({ data: { isBuffering: false, position: 1000, duration: 30000, ...data } }),
  };
}

/** Renders the hook with a ready API and a container attached (as React would via `ref`). */
async function renderReady() {
  const { api, calls } = fakeApi();
  const loadApi = () => Promise.resolve(api);
  const hook = renderHook(() => useSpotifyPlayer({ loadApi }));
  const container = document.createElement("div");
  hook.result.current.containerRef.current = container;
  await waitFor(() => expect(hook.result.current.status).toBe("ready"));
  return { ...hook, calls, container };
}

describe("useSpotifyPlayer", () => {
  it("cue prepares the embed with a track without playing, so the first click plays inside the gesture", async () => {
    const { result, calls } = await renderReady();
    act(() => result.current.cue("abc"));
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toEqual({ uri: "spotify:track:abc", width: "100%", height: 152 });
    const controller = fakeController();
    act(() => calls[0].cb(controller));
    expect(controller.play).not.toHaveBeenCalled();

    act(() => result.current.play("def")); // the click: synchronous on the existing controller
    expect(controller.loadEntity).toHaveBeenCalledWith("spotify:track:def");
    expect(controller.play).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(1);
  });

  it("first play creates one controller in a div appended to the container, then plays", async () => {
    const { result, calls, container } = await renderReady();
    act(() => result.current.play("abc"));
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toEqual({ uri: "spotify:track:abc", width: "100%", height: 152 });
    expect(calls[0].el.parentElement).toBe(container);
    expect(calls[0].el).not.toBe(container);
    const controller = fakeController();
    act(() => calls[0].cb(controller));
    expect(controller.play).toHaveBeenCalledTimes(1);
  });

  it("later plays load the new track on the same controller", async () => {
    const { result, calls } = await renderReady();
    act(() => result.current.play("abc"));
    const controller = fakeController();
    act(() => calls[0].cb(controller));
    act(() => result.current.play("def"));
    expect(calls).toHaveLength(1);
    expect(controller.loadEntity).toHaveBeenCalledWith("spotify:track:def");
    expect(controller.play).toHaveBeenCalledTimes(2);
  });

  it("destroys the controller on unmount", async () => {
    const { result, calls, unmount } = await renderReady();
    act(() => result.current.play("abc"));
    const controller = fakeController();
    act(() => calls[0].cb(controller));
    unmount();
    expect(controller.destroy).toHaveBeenCalledTimes(1);
  });

  it("destroys a controller whose callback arrives after unmount, without playing it", async () => {
    const { result, calls, unmount } = await renderReady();
    act(() => result.current.play("abc"));
    unmount();
    const controller = fakeController();
    calls[0].cb(controller);
    expect(controller.destroy).toHaveBeenCalledTimes(1);
    expect(controller.play).not.toHaveBeenCalled();
  });

  it("queues a play made before the API is ready (latest track wins)", async () => {
    const { api, calls } = fakeApi();
    const deferred = deferredApi();
    const { result } = renderHook(() => useSpotifyPlayer({ loadApi: deferred.loadApi }));
    result.current.containerRef.current = document.createElement("div");
    act(() => result.current.play("abc"));
    act(() => result.current.play("def"));
    expect(calls).toHaveLength(0);
    await act(async () => deferred.resolve(api));
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toEqual({ uri: "spotify:track:def", width: "100%", height: 152 });
  });

  it("a play made while the controller is being created loads on it once it exists", async () => {
    const { result, calls } = await renderReady();
    act(() => result.current.play("abc"));
    act(() => result.current.play("def"));
    expect(calls).toHaveLength(1);
    const controller = fakeController();
    act(() => calls[0].cb(controller));
    expect(controller.loadEntity).toHaveBeenCalledWith("spotify:track:def");
  });

  it("uses a custom height", async () => {
    const { api, calls } = fakeApi();
    const loadApi = () => Promise.resolve(api);
    const { result } = renderHook(() => useSpotifyPlayer({ loadApi, height: 80 }));
    result.current.containerRef.current = document.createElement("div");
    await waitFor(() => expect(result.current.status).toBe("ready"));
    act(() => result.current.play("abc"));
    expect(calls[0].options).toEqual({ uri: "spotify:track:abc", width: "100%", height: 80 });
  });

  it("is paused until Spotify reports that the track is really playing", async () => {
    const { result, calls } = await renderReady();
    expect(result.current.paused).toBe(true);
    act(() => result.current.play("abc"));
    const controller = fakeController();
    act(() => calls[0].cb(controller));
    expect(result.current.paused).toBe(true); // play() asked, not confirmed (the browser may block it)

    act(() => controller.update({ isPaused: false }));
    expect(result.current.paused).toBe(false);
  });

  it("is paused again when the listener pauses in the embed or the track reaches its end", async () => {
    const { result, calls } = await renderReady();
    act(() => result.current.play("abc"));
    const controller = fakeController();
    act(() => calls[0].cb(controller));
    act(() => controller.update({ isPaused: false }));

    act(() => controller.update({ isPaused: true }));
    expect(result.current.paused).toBe(true);

    act(() => controller.update({ isPaused: false }));
    act(() => controller.update({ isPaused: false, position: 30000, duration: 30000 })); // preview over
    expect(result.current.paused).toBe(true);
  });

  it("reports the end of a track once, not on a pause", async () => {
    const onEnded = vi.fn();
    const { api, calls } = fakeApi();
    const hook = renderHook(() => useSpotifyPlayer({ loadApi: () => Promise.resolve(api), onEnded }));
    hook.result.current.containerRef.current = document.createElement("div");
    await waitFor(() => expect(hook.result.current.status).toBe("ready"));
    act(() => hook.result.current.play("abc"));
    const controller = fakeController();
    act(() => calls[0].cb(controller));

    act(() => controller.update({ isPaused: true, position: 12000 })); // the listener pauses mid-track
    expect(onEnded).not.toHaveBeenCalled();

    act(() => controller.update({ isPaused: false, position: 30000, duration: 30000 }));
    act(() => controller.update({ isPaused: true, position: 30000, duration: 30000 })); // Spotify repeats the end
    expect(onEnded).toHaveBeenCalledTimes(1);
  });

  it("reports the end again for the next track", async () => {
    const onEnded = vi.fn();
    const { api, calls } = fakeApi();
    const hook = renderHook(() => useSpotifyPlayer({ loadApi: () => Promise.resolve(api), onEnded }));
    hook.result.current.containerRef.current = document.createElement("div");
    await waitFor(() => expect(hook.result.current.status).toBe("ready"));
    act(() => hook.result.current.play("abc"));
    const controller = fakeController();
    act(() => calls[0].cb(controller));
    act(() => controller.update({ isPaused: false, position: 30000, duration: 30000 }));

    act(() => hook.result.current.play("def"));
    act(() => controller.update({ isPaused: false, position: 500, duration: 29000 }));
    act(() => controller.update({ isPaused: false, position: 29000, duration: 29000 }));
    expect(onEnded).toHaveBeenCalledTimes(2);
  });

  it("is loading until the API resolves, then ready", async () => {
    const api = deferredApi();
    const { result } = renderHook(() => useSpotifyPlayer({ loadApi: api.loadApi }));
    expect(result.current.status).toBe("loading");
    await act(async () => api.resolve({ createController: () => {} }));
    await waitFor(() => expect(result.current.status).toBe("ready"));
  });

  it("is failed when the API cannot load", async () => {
    const api = deferredApi();
    const { result } = renderHook(() => useSpotifyPlayer({ loadApi: api.loadApi }));
    await act(async () => api.reject(new Error("timed out")));
    await waitFor(() => expect(result.current.status).toBe("failed"));
  });
});
