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
