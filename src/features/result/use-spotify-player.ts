"use client";

import { useEffect, useRef, useState } from "react";
import { type EmbedController, type IFrameAPI, loadIframeApi, trackUri } from "./spotify-embed";

export type PlayerStatus = "loading" | "ready" | "failed";

/** Spotify iFrame API `playback_update` event (developer.spotify.com › Embeds › iFrame API). */
type PlaybackUpdate = { data: { isPaused: boolean; isBuffering: boolean; position: number; duration: number } };

/** Paused, or at the end of the track (a finished preview may not report isPaused). */
const atEnd = ({ position, duration }: PlaybackUpdate["data"]) => duration > 0 && position >= duration;
const isStopped = (data: PlaybackUpdate["data"]) => data.isPaused || atEnd(data);

/**
 * One Spotify embed controller per mount, living in `containerRef`.
 * A play before the API (or the controller) is ready is queued; the latest track wins.
 * Pass a stable `loadApi` (module-level), or the API load re-runs on every render.
 */
export function useSpotifyPlayer(
  options: {
    loadApi?: () => Promise<IFrameAPI>;
    height?: number;
    /** The playing track reached its end (once per track; not on a pause). For auto-advance (#55). */
    onEnded?: () => void;
  } = {},
) {
  const { loadApi = loadIframeApi, height = 152, onEnded } = options;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<IFrameAPI | null>(null);
  const controllerRef = useRef<EmbedController | null>(null);
  const creatingRef = useRef(false);
  const pendingRef = useRef<string | null>(null);
  const cuedRef = useRef<string | null>(null); // shown in the embed without playing
  const mountedRef = useRef(false);
  const heightRef = useRef(height); // initial value only: the one controller is created once
  const onEndedRef = useRef(onEnded); // latest callback, read by the one listener
  const endedRef = useRef(false); // this track's end was already reported (Spotify repeats the last update)
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);
  const [status, setStatus] = useState<PlayerStatus>("loading");
  // Spotify's word, not ours: false only once the embed reports playback (a blocked play() never does).
  const [paused, setPaused] = useState(true);

  /** Plays the queued track on the existing controller, or creates the one controller (with the queued or cued track). */
  const flushRef = useRef(() => {
    const queued = pendingRef.current;
    const trackId = queued ?? cuedRef.current;
    const api = apiRef.current;
    const container = containerRef.current;
    if (!trackId || creatingRef.current) return;
    const controller = controllerRef.current;
    if (controller && !queued) return; // a cue never changes an existing embed
    if (controller) {
      pendingRef.current = null;
      controller.loadEntity(trackUri(trackId));
      controller.play();
      return;
    }
    if (!api || !container) return;
    pendingRef.current = null;
    creatingRef.current = true;
    // Spotify replaces the element with its iframe, so give it a div React doesn't own.
    const el = document.createElement("div");
    container.appendChild(el);
    api.createController(el, { uri: trackUri(trackId), width: "100%", height: heightRef.current }, (created) => {
      creatingRef.current = false;
      // Unmounted (or StrictMode cleanup) before Spotify answered: don't leak the iframe.
      if (!mountedRef.current) return created.destroy();
      controllerRef.current = created;
      created.addListener("playback_update", (e) => {
        const data = (e as PlaybackUpdate).data;
        setPaused(isStopped(data));
        if (!atEnd(data))
          endedRef.current = false; // a track is (again) before its end
        else if (!endedRef.current) {
          endedRef.current = true;
          onEndedRef.current?.();
        }
      });
      if (queued) created.play(); // a cue only prepares the embed
      flushRef.current(); // a click made while the controller was being created
    });
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    loadApi().then(
      (api) => {
        apiRef.current = api;
        setStatus("ready");
        flushRef.current();
      },
      () => setStatus("failed"),
    );
  }, [loadApi]);

  /** Prepares the embed with a track without playing it, so the first click plays inside the user gesture. */
  function cue(trackId: string) {
    cuedRef.current = trackId;
    flushRef.current();
  }

  function play(trackId: string) {
    pendingRef.current = trackId;
    flushRef.current();
  }

  return { containerRef, status, paused, cue, play };
}
