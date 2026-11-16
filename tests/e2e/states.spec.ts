// UI states with OUR API mocked from the browser (layer 2 of the e2e strategy): deterministic, no server data.
import { expect, mockCrate, mockGenre, sampleCrate, sampleGenre, test } from "./fixtures";

test.describe("crate", () => {
  test("shows the genres the API sends", async ({ page }) => {
    await mockCrate(page, sampleCrate);
    await page.goto("/");

    const crate = page.getByRole("region", { name: "Genre crate" });
    await expect(crate.getByRole("button", { name: "Play 10 tracks of Acid Jazz" })).toBeVisible();
    await expect(crate.getByRole("button", { name: "Trip Hop" })).toBeAttached();
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
