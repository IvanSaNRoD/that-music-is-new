import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw/http";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "../../../tests/msw/server";
import { useRandomize } from "./use-randomize";

// Next's router is a framework boundary: fake it and record navigations.
const nav = vi.hoisted(() => ({ push: vi.fn(), params: {} as { genre?: string } }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: nav.push }), useParams: () => nav.params }));

beforeEach(() => {
  nav.push.mockReset();
  nav.params = {};
});

describe("useRandomize", () => {
  it("goes to the genre the API picked", async () => {
    server.use(http.get("*/api/genres/random", () => HttpResponse.json({ genre: "Zydeco", slug: "zydeco" })));
    const { result } = renderHook(() => useRandomize());

    await act(() => result.current());
    await waitFor(() => expect(nav.push).toHaveBeenCalledWith("/zydeco"));
  });

  it("asks the API to exclude the genre on screen", async () => {
    nav.params = { genre: "trip-hop" };
    let exclude: string | null = null;
    server.use(
      http.get("*/api/genres/random", ({ request }) => {
        exclude = new URL(request.url).searchParams.get("exclude");
        return HttpResponse.json({ genre: "Zydeco", slug: "zydeco" });
      }),
    );
    const { result } = renderHook(() => useRandomize());

    await act(() => result.current());
    expect(exclude).toBe("trip-hop");
  });

  it("stays put when the API fails", async () => {
    server.use(http.get("*/api/genres/random", () => new HttpResponse(null, { status: 500 })));
    const { result } = renderHook(() => useRandomize());

    await expect(act(() => result.current())).resolves.toBeUndefined();
    expect(nav.push).not.toHaveBeenCalled();
  });

  it("ignores a second press while a roll is in flight", async () => {
    let requests = 0;
    server.use(
      http.get("*/api/genres/random", () => {
        requests++;
        return HttpResponse.json({ genre: "Zydeco", slug: "zydeco" });
      }),
    );
    const { result } = renderHook(() => useRandomize());

    await act(() => Promise.all([result.current(), result.current()]));
    expect(requests).toBe(1);
    expect(nav.push).toHaveBeenCalledTimes(1);
  });
});
