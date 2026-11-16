import { renderHook, waitFor } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { server } from "../../../tests/msw/server";
import { useCrate } from "./use-crate";

const crate = (...names: string[]) => names.map((n) => ({ genre: n, slug: n.toLowerCase().replace(/ /g, "-") }));

describe("useCrate", () => {
  it("fills the crate with genres from the API", async () => {
    server.use(http.get("*/api/genres/crate", () => HttpResponse.json(crate("Acid Jazz", "Zydeco"))));
    const { result } = renderHook(() => useCrate());

    await waitFor(() =>
      expect(result.current.genres).toEqual([
        { name: "Acid Jazz", slug: "acid-jazz" },
        { name: "Zydeco", slug: "zydeco" },
      ]),
    );
  });

  it("opens the first sleeve of each new crate", async () => {
    server.use(http.get("*/api/genres/crate", () => HttpResponse.json(crate("Acid Jazz", "Zydeco"))));
    const { result } = renderHook(() => useCrate());

    await waitFor(() => expect(result.current.selected).toBe("acid-jazz"));
  });

  it("opens the sleeve the user picks", async () => {
    server.use(http.get("*/api/genres/crate", () => HttpResponse.json(crate("Acid Jazz", "Zydeco"))));
    const { result } = renderHook(() => useCrate());
    await waitFor(() => expect(result.current.genres).toHaveLength(2));

    act(() => result.current.pick("zydeco"));
    expect(result.current.selected).toBe("zydeco");
  });

  it("restocks with a new crate from the API", async () => {
    const crates = [crate("Acid Jazz", "Zydeco"), crate("Trip Hop", "Dub")];
    server.use(http.get("*/api/genres/crate", () => HttpResponse.json(crates.shift())));
    const { result } = renderHook(() => useCrate());
    await waitFor(() => expect(result.current.selected).toBe("acid-jazz"));

    act(() => result.current.restock());
    await waitFor(() => expect(result.current.genres.map((g) => g.name)).toEqual(["Trip Hop", "Dub"]));
    expect(result.current.selected).toBe("trip-hop");
  });

  it("reports an error when the crate can't be loaded", async () => {
    server.use(http.get("*/api/genres/crate", () => new HttpResponse(null, { status: 500 })));
    const { result } = renderHook(() => useCrate());

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.genres).toEqual([]);
  });

  it("keeps the latest crate when an earlier, slower one answers late", async () => {
    let calls = 0;
    server.use(
      http.get("*/api/genres/crate", async () => {
        calls++;
        if (calls === 1) {
          await delay(150);
          return HttpResponse.json(crate("Acid Jazz"));
        }
        return HttpResponse.json(crate("Zydeco"));
      }),
    );
    const { result } = renderHook(() => useCrate());
    await waitFor(() => expect(calls).toBe(1)); // the first, slow request is in flight

    act(() => result.current.restock());
    await waitFor(() => expect(result.current.selected).toBe("zydeco"));
    await new Promise((r) => setTimeout(r, 250)); // the slow first answer lands now
    expect(result.current.selected).toBe("zydeco");
  });
});
