"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GenreResult } from "@/domain/genre";
import type { Track } from "@/domain/track";

export type ResultStatus = "loading" | "ready" | "empty" | "error" | "busy";

/**
 * Data + playback state for one genre page: GET /api/genres/{slug} (ADR-0007 request 2).
 * The page keys this by genre, so a new genre always starts fresh in "loading".
 */
export function useResult(slug: string, onFirstPlay: (slug: string) => void) {
  const [status, setStatus] = useState<ResultStatus>("loading");
  const [result, setResult] = useState<GenreResult | null>(null);
  const [retryAfter, setRetryAfter] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const counted = useRef(false); // genre already added to History for this page

  useEffect(() => {
    const controller = new AbortController(); // a retry or leaving the page drops this attempt's answer
    void (async () => {
      try {
        const res = await fetch(`/api/genres/${encodeURIComponent(slug)}`, { signal: controller.signal });
        if (controller.signal.aborted) return;
        if (res.status === 503) {
          setRetryAfter(Number(res.headers.get("retry-after")) || 1);
          return setStatus("busy");
        }
        if (!res.ok) return setStatus("error");
        const body: GenreResult = await res.json();
        if (controller.signal.aborted) return;
        setResult(body);
        setStatus(body.tracks.length > 0 ? "ready" : "empty");
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    })();
    return () => controller.abort();
  }, [slug, attempt]);

  const retry = useCallback(() => {
    setStatus("loading");
    setAttempt((n) => n + 1);
  }, []);

  const playTrack = useCallback(
    (trackId: string) => {
      setPlayingId(trackId);
      // History rule: the first track played adds the genre (once per page visit).
      if (!counted.current) {
        counted.current = true;
        onFirstPlay(slug);
      }
    },
    [slug, onFirstPlay],
  );

  const tracks: Track[] = result?.tracks ?? [];
  return {
    status,
    tracks,
    total: result?.total ?? 0,
    playlistUrl: result?.playlistUrl,
    retryAfter,
    retry,
    playingId,
    playTrack,
  };
}
