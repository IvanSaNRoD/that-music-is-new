import { renderHook, waitFor } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { server } from "../../../tests/msw/server";
import { useResult } from "./use-result";

const tracks = [
  { id: "t1", title: "Something in My Eye", artists: "Corduroy" },
  { id: "t2", title: "Lift Off", artists: "Groove Collective" },
];
const genreBody = (over: object = {}) => ({
  genre: "Acid Jazz",
  slug: "acid-jazz",
  playlistId: "7vyHBfRfPOT8Sxy87P5osJ",
  playlistUrl: "https://open.spotify.com/playlist/7vyHBfRfPOT8Sxy87P5osJ",
  total: 172,
  tracks,
  ...over,
});
const noop = () => {};

describe("useResult", () => {
  it("loads the genre's tracks from the API", async () => {
    server.use(http.get("*/api/genres/acid-jazz", () => HttpResponse.json(genreBody())));
    const { result } = renderHook(() => useResult("acid-jazz", noop));

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.tracks).toEqual(tracks);
    expect(result.current.total).toBe(172);
    expect(result.current.playlistUrl).toBe("https://open.spotify.com/playlist/7vyHBfRfPOT8Sxy87P5osJ");
  });

  it("is empty when none of the tracks can be played", async () => {
    server.use(http.get("*/api/genres/acid-jazz", () => HttpResponse.json(genreBody({ tracks: [] }))));
    const { result } = renderHook(() => useResult("acid-jazz", noop));

    await waitFor(() => expect(result.current.status).toBe("empty"));
  });

  it("is busy, with the wait in seconds, when Spotify rate-limits", async () => {
    server.use(
      http.get("*/api/genres/acid-jazz", () =>
        HttpResponse.json({ error: "Spotify unavailable" }, { status: 503, headers: { "Retry-After": "6" } }),
      ),
    );
    const { result } = renderHook(() => useResult("acid-jazz", noop));

    await waitFor(() => expect(result.current.status).toBe("busy"));
    expect(result.current.retryAfter).toBe(6);
  });

  it.each([
    ["Spotify fails", () => HttpResponse.json({ error: "Spotify unavailable" }, { status: 502 })],
    ["the network drops", () => HttpResponse.error()],
  ])("shows an error when %s", async (_, reply) => {
    server.use(http.get("*/api/genres/acid-jazz", reply));
    const { result } = renderHook(() => useResult("acid-jazz", noop));

    await waitFor(() => expect(result.current.status).toBe("error"));
  });

  it("loads again on retry", async () => {
    const replies = [new HttpResponse(null, { status: 502 }), HttpResponse.json(genreBody())];
    server.use(http.get("*/api/genres/acid-jazz", () => replies.shift()));
    const { result } = renderHook(() => useResult("acid-jazz", noop));
    await waitFor(() => expect(result.current.status).toBe("error"));

    act(() => result.current.retry());
    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.status).toBe("ready"));
  });

  it("marks the played track and adds the genre to History once per visit", async () => {
    server.use(http.get("*/api/genres/acid-jazz", () => HttpResponse.json(genreBody())));
    const onFirstPlay = vi.fn();
    const { result } = renderHook(() => useResult("acid-jazz", onFirstPlay));
    await waitFor(() => expect(result.current.status).toBe("ready"));

    act(() => result.current.playTrack("t1"));
    act(() => result.current.playTrack("t2"));
    expect(result.current.playingId).toBe("t2");
    expect(onFirstPlay).toHaveBeenCalledTimes(1);
    expect(onFirstPlay).toHaveBeenCalledWith("acid-jazz");
  });

  it("keeps the latest attempt when an earlier, slower one answers late", async () => {
    let calls = 0;
    server.use(
      http.get("*/api/genres/acid-jazz", async () => {
        calls++;
        if (calls === 1) {
          await delay(150);
          return new HttpResponse(null, { status: 502 });
        }
        return HttpResponse.json(genreBody());
      }),
    );
    const { result } = renderHook(() => useResult("acid-jazz", noop));
    await waitFor(() => expect(calls).toBe(1)); // the first, slow request is in flight

    act(() => result.current.retry()); // before its answer arrives
    await waitFor(() => expect(result.current.status).toBe("ready"));
    await new Promise((r) => setTimeout(r, 250)); // the slow first answer lands now
    expect(result.current.status).toBe("ready");
  });
});
