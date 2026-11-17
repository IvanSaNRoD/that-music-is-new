// UI states with OUR API mocked from the browser (layer 2 of the e2e strategy): deterministic, no server data.
import type { Page } from "@playwright/test";
import { expect, mockCrate, mockGenre, mockRandom, sampleCrate, sampleGenre, test } from "./fixtures";

test.describe("crate", () => {
  test("shows the genres the API sends", async ({ page }) => {
    await mockCrate(page, sampleCrate);
    await page.goto("/");

    const crate = page.getByRole("region", { name: "Genre crate" });
    await expect(crate.getByRole("button", { name: "Play 10 tracks of Acid Jazz" })).toBeVisible();
    await expect(crate.getByRole("button", { name: "Trip Hop" })).toBeAttached();
  });

  // The longest real catalog names (#58): the open sleeve's Play pill must stay clear of the die-cut hole.
  for (const name of [
    "Auteur-Compositeur-Interprète Québécois",
    "Historically Informed Performance",
    "Progressive Bluegrass",
  ]) {
    test(`keeps the Play pill above the die-cut hole for "${name}"`, async ({ page }, info) => {
      // Desktop also at 1024px: the narrowest crate column (≈210px), where the pill used to wrap.
      if (info.project.name === "desktop") await page.setViewportSize({ width: 1024, height: 800 });
      await mockCrate(page, [{ genre: name, slug: "long-name-e2e" }, ...sampleCrate]);
      await page.goto("/");

      const sleeve = page.getByRole("button", { name: `Play 10 tracks of ${name}` });
      const play = sleeve.locator(".crate-play");
      const hole = sleeve.locator(".crate-hole");
      await expect(play).toBeVisible();
      await expect(async () => {
        const [p, h, s] = await Promise.all([play.boundingBox(), hole.boundingBox(), sleeve.boundingBox()]);
        expect(p!.y + p!.height).toBeLessThanOrEqual(h!.y); // pill ends above the hole
        expect(p!.x + p!.width).toBeLessThanOrEqual(s!.x + s!.width); // and inside the sleeve
      }).toPass();
    });
  }

  // #57: while the crate request is in flight the crate says so and never looks empty.
  /** Holds GET /api/genres/crate until `release()` answers it with `body`. */
  async function holdCrate(page: Page, body: unknown) {
    let release!: () => void;
    const held = new Promise<void>((r) => (release = r));
    await page.route(
      (url) => url.pathname === "/api/genres/crate",
      async (route) => {
        await held;
        await route.fulfill({ json: body, headers: { "Cache-Control": "no-store" } });
      },
    );
    return release;
  }

  test("says it is digging while the first crate loads", async ({ page }) => {
    const release = await holdCrate(page, sampleCrate);
    await page.goto("/");

    const crate = page.getByRole("region", { name: "Genre crate" });
    await expect(crate.locator(".crate-message").getByText("Digging through the bins…", { exact: true })).toBeVisible();
    await expect(crate.locator("[aria-busy=true]")).toBeAttached();
    release();
    await expect(crate.getByRole("button", { name: "Play 10 tracks of Acid Jazz" })).toBeVisible();
    await expect(crate.getByText("Digging through the bins…")).toHaveCount(0);
  });

  test("keeps the old sleeves while Restock brings new ones", async ({ page }) => {
    await mockCrate(page, sampleCrate);
    await page.goto("/");
    const crate = page.getByRole("region", { name: "Genre crate" });
    await expect(crate.getByRole("button", { name: "Play 10 tracks of Acid Jazz" })).toBeVisible();

    // The later route wins over mockCrate's (Playwright tries routes newest first).
    const release = await holdCrate(page, [{ genre: "Zydeco", slug: "zydeco" }]);
    await crate.getByRole("button", { name: "Restock" }).click();
    await expect(crate.locator("[aria-busy=true]")).toBeAttached();
    await expect(crate.getByText("Acid Jazz", { exact: true }).first()).toBeVisible(); // still there, dimmed
    release();
    await expect(crate.getByRole("button", { name: "Play 10 tracks of Zydeco" })).toBeVisible();
  });

  test("offers a retry when the crate can't be filled", async ({ page }) => {
    await mockCrate(page, { status: 500 });
    await page.goto("/");

    await expect(page.getByText("Couldn't fill the crate", { exact: true })).toBeVisible();
    await page.unrouteAll({ behavior: "ignoreErrors" });
    await mockCrate(page, sampleCrate);
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByRole("button", { name: "Play 10 tracks of Acid Jazz" })).toBeVisible();
  });
  test("keeps keyboard focus on Restock after Try again (#57)", async ({ page }) => {
    await mockCrate(page, { status: 500 });
    await page.goto("/");
    const crate = page.getByRole("region", { name: "Genre crate" });
    await crate.getByRole("button", { name: "Try again" }).focus();

    await mockCrate(page, sampleCrate);
    await page.keyboard.press("Enter");
    await expect(crate.getByRole("button", { name: "Restock" })).toBeFocused();
  });
});

test.describe("genre page", () => {
  test("lists the tracks and the playlist link", async ({ page }) => {
    await mockGenre(page, "acid-jazz", sampleGenre);
    await page.goto("/acid-jazz");

    await expect(page.getByText("Sample track 02")).toBeVisible();
    await expect(page.getByText("172 tracks")).toBeVisible();
    await expect(page.getByRole("link", { name: /Listen more on Spotify/ })).toHaveAttribute(
      "href",
      "https://open.spotify.com/playlist/e2e-acid-jazz",
    );
  });

  test("says so when no track can be played", async ({ page }) => {
    await mockGenre(page, "acid-jazz", { ...sampleGenre, tracks: [] });
    await page.goto("/acid-jazz");
    await expect(page.getByText("This record is blank")).toBeVisible();
  });

  test("asks to wait when Spotify is busy", async ({ page }) => {
    await mockGenre(page, "acid-jazz", { status: 503, headers: { "Retry-After": "8" } });
    await page.goto("/acid-jazz");
    await expect(page.getByText("Spotify is busy right now")).toBeVisible();
  });

  test("recovers from an error with Try again", async ({ page }) => {
    await mockGenre(page, "acid-jazz", { status: 502 });
    await page.goto("/acid-jazz");
    await expect(page.getByText("Couldn't pull this record")).toBeVisible();

    await page.unrouteAll({ behavior: "ignoreErrors" });
    await mockGenre(page, "acid-jazz", sampleGenre);
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByText("Sample track 02")).toBeVisible();
  });

  test("adds a real catalog genre to Your finds once a track plays", async ({ page }) => {
    await mockGenre(page, "acid-jazz", sampleGenre);
    await page.goto("/acid-jazz");

    await page.getByText("Sample track 02").click();
    await expect(page.getByRole("link", { name: "Acid Jazz", exact: true })).toBeVisible();
  });

  test("answers 404 for a genre that isn't in the catalog", async ({ page }) => {
    await page.goto("/no-such-genre-e2e");
    await expect(page.getByRole("heading", { level: 1, name: "Not in the crate" })).toBeVisible();
  });
});

// #53: a failed roll is said next to the CTA (and announced once), and the next good roll clears it.
test.describe("randomize failure", () => {
  const note = /Couldn’t reach the crate — try again/;

  test("tells the listener on the home and stays put", async ({ page }) => {
    await mockCrate(page, sampleCrate);
    await mockRandom(page, { status: 500 });
    await page.goto("/");

    await page.getByRole("button", { name: "Randomize" }).click();
    await expect(page.locator("p:not([role=status])").filter({ hasText: note, visible: true })).toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: note })).toBeAttached();
    await expect(page).toHaveURL("/");

    await page.unroute((url) => url.pathname === "/api/genres/random");
    await mockRandom(page, sampleGenre);
    await mockGenre(page, "acid-jazz", sampleGenre);
    await page.getByRole("button", { name: "Randomize" }).click();
    await expect(page).toHaveURL("/acid-jazz");
    await expect(page.getByText(note)).toHaveCount(0);
  });

  test("tells the listener next to Roll again on a genre page", async ({ page }) => {
    await mockGenre(page, "acid-jazz", { status: 500 }); // error state: on phones Roll again sits in the bottom bar
    await mockRandom(page, { status: 500 });
    await page.goto("/acid-jazz");

    await page.getByRole("button", { name: "Roll again" }).click();
    await expect(page.locator("p:not([role=status])").filter({ hasText: note, visible: true })).toBeVisible();
    await expect(page).toHaveURL("/acid-jazz");

    // The note belongs to the page it happened on: going back to the crate drops it.
    await mockCrate(page, sampleCrate);
    await page.getByRole("link", { name: "Back to the crate" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByText(note)).toHaveCount(0);
  });
});
