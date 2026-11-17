// The turntable follows the Spotify Embed's real playback (#61), driven through the fake iFrame API (fixtures.ts).
import { expect, mockCrate, mockGenre, mockRandom, sampleCrate, sampleGenre, test } from "./fixtures";

// Only the genre page's turntable: the <Suspense> fallback (result-fallback.tsx) draws an empty one too, and
// in a production build it can linger in the DOM for a moment after the page is revealed (CI flake).
const outsideFallback = ":not([aria-label='Loading genre'] *)";
const record = (page: import("@playwright/test").Page) => page.locator(`.turntable-spin${outsideFallback}`);
const arm = (page: import("@playwright/test").Page) => page.locator(`.turntable-arm${outsideFallback}`);

test.beforeEach(async ({ page }) => {
  await mockGenre(page, "acid-jazz", sampleGenre);
});

test("the record spins while the track plays and stops, arm in place, when the listener pauses", async ({ page }) => {
  await page.goto("/acid-jazz");
  await page.getByText("Sample track 02").click();

  await expect(record(page)).toHaveAttribute("data-spinning", "true");
  await expect(arm(page)).toHaveAttribute("data-down", "true");

  await page.evaluate(() => (window as unknown as { __fakeEmbed: { pause(): void } }).__fakeEmbed.pause());
  await expect(record(page)).toHaveAttribute("data-spinning", "false");
  await expect(arm(page)).toHaveAttribute("data-down", "true"); // paused in place, never snaps back
});

test("the record stays still when the browser blocks the audio", async ({ page }) => {
  await page.addInitScript(() => ((window as unknown as { __fakeEmbed: object }).__fakeEmbed = { blocked: true }));
  await page.goto("/acid-jazz");
  await page.getByText("Sample track 02").click();

  await expect(page.getByTitle("Spotify Embed")).toHaveAttribute("src", /track-2$/); // the track was loaded
  await expect(record(page)).toHaveAttribute("data-spinning", "false");
});

type FakeEmbed = { __fakeEmbed: { pause(): void; end(): void } };
const embedTrack = (page: import("@playwright/test").Page) => page.getByTitle("Spotify Embed");

test("⏮ / ⏭ move through the list and stop at both ends (no wrap-around)", async ({ page }) => {
  await page.goto("/acid-jazz");
  const prev = page.getByRole("button", { name: "Previous track" });
  const next = page.getByRole("button", { name: "Next track" });
  await expect(prev).toBeDisabled(); // track 01 is cued: nothing before it

  await next.click();
  await expect(embedTrack(page)).toHaveAttribute("src", /track-2$/);
  await expect(next).toBeDisabled(); // sampleGenre has 2 tracks: this is the last one

  await prev.click();
  await expect(embedTrack(page)).toHaveAttribute("src", /track-1$/);
  await expect(prev).toBeDisabled();
});

test("when a track ends the next one plays; after the last one it stops", async ({ page }) => {
  await page.goto("/acid-jazz");
  await page.getByText("Sample track 01").click();
  await expect(record(page)).toHaveAttribute("data-spinning", "true");

  await page.evaluate(() => (window as unknown as FakeEmbed).__fakeEmbed.end());
  await expect(embedTrack(page)).toHaveAttribute("src", /track-2$/);
  await expect(record(page)).toHaveAttribute("data-spinning", "true");

  await page.evaluate(() => (window as unknown as FakeEmbed).__fakeEmbed.end());
  await expect(record(page)).toHaveAttribute("data-spinning", "false");
  await expect(embedTrack(page)).toHaveAttribute("src", /track-2$/); // no loop back to track 01
});

test("on phones, Roll again spans the full column width once the player is ready", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "phone layout only (< 1024px)");
  await page.goto("/acid-jazz");
  await expect(page.getByText("Sample track 02")).toBeVisible();

  const roll = page.getByRole("button", { name: "Roll again" });
  const column = page.getByRole("link", { name: "Back to the crate" }).locator("xpath=ancestor::section[1]");
  const [r, c] = await Promise.all([roll.boundingBox(), column.boundingBox()]);
  expect(Math.round(r!.width)).toBe(Math.round(c!.width));
});

// Autoplay with listening intent (#67, docs/prd.md › Autoplay).
test.describe("autoplay", () => {
  test.beforeEach(async ({ page }) => {
    await mockCrate(page, sampleCrate);
    await mockRandom(page, sampleGenre);
  });

  test("Randomize opens the genre already playing track 01", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Randomize" }).click();

    await expect(page).toHaveURL(/\/acid-jazz$/);
    await expect(page.getByText("Sample track 02")).toBeVisible(); // ready: the record also spins while loading
    await expect(embedTrack(page)).toHaveAttribute("src", /track-1$/);
    await expect(record(page)).toHaveAttribute("data-spinning", "true"); // no track was tapped
  });

  test("the crate sleeve's Play opens the genre already playing track 01", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Play 10 tracks of Acid Jazz" }).click();

    await expect(page).toHaveURL(/\/acid-jazz$/);
    await expect(page.getByText("Sample track 02")).toBeVisible(); // ready: the record also spins while loading
    await expect(record(page)).toHaveAttribute("data-spinning", "true");
  });

  test("a shared URL or reload never autoplays", async ({ page }) => {
    await page.goto("/acid-jazz");
    await expect(embedTrack(page)).toHaveAttribute("src", /track-1$/); // cued
    await page.waitForTimeout(1000);

    await expect(record(page)).toHaveAttribute("data-spinning", "false");
  });

  test("when the browser blocks it, the record stays still and asks to press play", async ({ page }) => {
    await page.addInitScript(() => ((window as unknown as { __fakeEmbed: object }).__fakeEmbed = { blocked: true }));
    await page.goto("/");
    await page.getByRole("button", { name: "Randomize" }).click();

    await expect(page.getByText(/press play in the player/i).first()).toBeVisible();
    await expect(record(page)).toHaveAttribute("data-spinning", "false");
  });
});
