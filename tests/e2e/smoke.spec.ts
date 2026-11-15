import { expect, test } from "@playwright/test";

const genreUrl = /\/[a-z0-9-]+$/;

test("Randomize opens a genre page with tracks and Roll again", async ({ page }) => {
  test.slow(); // a cold `next dev` compiles each route on first visit
  await page.goto("/");

  // Click until the page is hydrated (a cold dev server serves the button before its handler exists);
  // once the URL changed, only wait for it.
  await expect(async () => {
    if (!genreUrl.test(page.url())) await page.getByRole("button", { name: "Randomize" }).click({ timeout: 2_000 });
    await expect(page).toHaveURL(genreUrl, { timeout: 5_000 });
  }).toPass({ timeout: 60_000 });

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Sample track 01")).toBeVisible();
  // Desktop: next to the title; mobile: in the bottom bar. Exactly one is rendered visibly.
  await expect(page.getByRole("button", { name: "Roll again" })).toBeVisible();

  // Playing a track hands off to Spotify with a full, spaced accessible name.
  await page.getByText("Sample track 01").click();
  await expect(
    page.getByRole("link", { name: "Dig deeper on Spotify (opens in a new tab)", exact: true }),
  ).toBeVisible();
});
