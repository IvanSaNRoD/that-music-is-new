"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Genre } from "@/domain/genre";
import type { Track } from "@/domain/track";
import { sampleFor } from "@/mocks/tracks";

export type ResultStatus = "loading" | "ready" | "empty" | "error" | "busy";

const FAKE_LATENCY_MS = 900;

/**
 * Preview helper (design phase only): force a state with `?state=loading|empty|error|busy`.
 * Replaced by the real data source in E3/E4.
 */
function forcedState(): ResultStatus | null {
  const s = new URLSearchParams(window.location.search).get("state");
  return s === "loading" || s === "empty" || s === "error" || s === "busy" ? s : null;
}

/**
 * Data + playback state for one genre page. The page keys this by genre, so a new genre
 * always starts fresh in "loading".
 */
export function useResult(genre: Genre, catalogIndex: number, onFirstPlay: (genreId: string) => void) {
  const [status, setStatus] = useState<ResultStatus>("loading");
  const [trackCount, setTrackCount] = useState(0);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const counted = useRef(false); // genre already added to History for this page

  useEffect(() => {
    const forced = forcedState();
    if (forced === "loading") return;
    const t = setTimeout(() => {
      const sample = sampleFor(genre, catalogIndex);
      if (forced === "error") return setStatus("error");
      if (forced === "busy") {
        setRetryAfter(8);
        return setStatus("busy");
      }
      setTrackCount(sample.trackCount);
      if (forced === "empty") return setStatus("empty");
      setTracks(sample.tracks);
      setStatus("ready");
    }, FAKE_LATENCY_MS);
    return () => clearTimeout(t);
  }, [genre, catalogIndex, attempt]);

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
        onFirstPlay(genre.id);
      }
    },
    [genre.id, onFirstPlay],
  );

  return { status, trackCount, tracks, playingId, retryAfter, retry, playTrack };
}
