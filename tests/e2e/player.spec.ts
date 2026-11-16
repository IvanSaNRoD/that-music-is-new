// The turntable follows the Spotify Embed's real playback (#61), driven through the fake iFrame API (fixtures.ts).
import { expect, mockGenre, sampleGenre, test } from "./fixtures";

const record = (page: import("@playwright/test").Page) => page.locator(".turntable-spin");
const arm = (page: import("@playwright/test").Page) => page.locator(".turntable-arm");

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
