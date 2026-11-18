// E6.1 (#28): one listener's whole visit, on the full stack — our API and catalog for real, Spotify faked by
// tests/e2e/fake-spotify.ts (no API mocks in the browser). Genres are random, so names are read from the page.
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const genreUrl = /\/[a-z0-9-]+$/;
const slugOf = (url: string) => new URL(url).pathname.slice(1);

// After a client navigation Next keeps the previous page in the DOM, hidden: only look at what is on screen.
const heading = (page: Page) => page.getByRole("heading", { level: 1 }).filter({ visible: true });
const track = (page: Page, title: string) => page.getByText(title, { exact: true }).filter({ visible: true });

const history = (page: Page) => page.getByRole("region", { name: "History" });
const finds = (page: Page) => page.getByRole("region", { name: "Your finds" });
const historyRow = (page: Page, name: string) =>
  history(page)
    .getByRole("listitem")
    .filter({ has: page.getByText(name, { exact: true }) });

/** Plays a track on the genre page and returns the genre's name (its heading). */
async function playTrack(page: Page, title: string, trackId: string) {
  const name = (await heading(page).textContent())!.trim();
  await track(page, title).click();
  await expect(page.locator('iframe[title="Spotify Embed"]').filter({ visible: true })).toHaveAttribute(
    "src",
    new RegExp(`/${trackId}$`),
  );
  await expect(finds(page).filter({ visible: true }).getByRole("link", { name, exact: true })).toBeVisible(); // played → kept as a find
  return name;
}

test("randomize → play → roll again → History kept, opened, trimmed and cleared", async ({ page }) => {
  test.slow(); // the whole visit, several routes (a cold `next dev` compiles each on first visit)
  await page.goto("/");

  // 1. Randomize. Click until hydrated (a cold dev server serves the button before its handler exists).
  await expect(async () => {
    if (!genreUrl.test(page.url())) await page.getByRole("button", { name: "Randomize" }).click({ timeout: 2_000 });
    await expect(page).toHaveURL(genreUrl, { timeout: 5_000 });
  }).toPass({ timeout: 60_000 });
  const firstSlug = slugOf(page.url());

  // 2. The genre's tracks, then play one.
  await expect(track(page, "Sample track 01")).toBeVisible();
  const first = await playTrack(page, "Sample track 02", "track-2");

  // 3. Roll again: another genre (never the one on screen), play it too.
  await page.getByRole("button", { name: "Roll again" }).filter({ visible: true }).click();
  await expect(page).not.toHaveURL(new RegExp(`/${firstSlug}$`));
  await expect(heading(page)).not.toHaveText(first);
  await expect(track(page, "Sample track 01")).toBeVisible();
  const secondSlug = slugOf(page.url());
  const second = await playTrack(page, "Sample track 01", "track-1");
  expect(second).not.toBe(first);

  // 4. Back home: History lists both, most recent first.
  await page.getByRole("link", { name: "Back to the crate" }).filter({ visible: true }).click();
  await expect(page).toHaveURL("/");
  const rows = history(page).getByRole("listitem");
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0)).toContainText(second);
  await expect(rows.nth(1)).toContainText(first);

  // 5. Kept between visits.
  await page.reload();
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0)).toContainText(second);

  // 6. A row reopens its genre page.
  await historyRow(page, second).getByText(second, { exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/${secondSlug}$`));
  await expect(heading(page)).toHaveText(second);
  await page.getByRole("link", { name: "Back to the crate" }).filter({ visible: true }).click();
  await expect(page).toHaveURL("/");

  // 7. Remove one (the ✕ is on hover with a pointer, always visible on touch), for good.
  await historyRow(page, first).hover();
  await history(page)
    .getByRole("button", { name: `Remove ${first} from history` })
    .click();
  await expect(history(page).getByText(`Removed ${first}`)).toBeVisible();
  await expect(rows).toHaveCount(1);
  await page.reload();
  await expect(rows).toHaveCount(1);
  await expect(rows.nth(0)).toContainText(second);

  // 8. Clear all, with confirmation, for good.
  await history(page).getByRole("button", { name: "Clear all history" }).click();
  await history(page).getByRole("button", { name: "Clear", exact: true }).click();
  await expect(history(page).getByText("Nothing here yet.")).toBeVisible();
  await page.reload();
  await expect(history(page).getByText("Nothing here yet.")).toBeVisible();
  await expect(rows).toHaveCount(0);
});
