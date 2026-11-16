import { expect, test } from "./fixtures";

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

  // Track 01 is cued in the one Spotify Embed as soon as the list arrives (fake iFrame API, see fixtures)…
  const embed = page.locator('iframe[title="Spotify Embed"]');
  await expect(embed).toHaveAttribute("src", /\/embed\/track\/track-\d$/);
  // …and clicking another track loads that one into the same embed.
  await page.getByText("Sample track 02").click();
  await expect(embed).toHaveAttribute("src", "https://open.spotify.com/embed/track/track-2");
  await expect(page.locator('iframe[title="Spotify Embed"]')).toHaveCount(1);
});
