// History kept between visits (localStorage), with OUR API mocked from the browser.
import type { Page } from "@playwright/test";
import { expect, mockCrate, mockGenre, sampleCrate, sampleGenre, test } from "./fixtures";

const KEY = "tmin:history";

/** Stores History as if played on earlier visits, then reloads so the app reads it. */
async function seedHistory(page: Page, names: string[]) {
  const items = names.map((name) => ({ id: name.toLowerCase().replace(/ /g, "-"), name, date: "2026-11-16" }));
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [KEY, JSON.stringify(items)]);
  await page.reload();
}

const finds = (page: Page) => page.getByRole("region", { name: "Your finds" });
const history = (page: Page) => page.getByRole("region", { name: "History" });

test.beforeEach(async ({ page }) => {
  await mockCrate(page, sampleCrate);
  await mockGenre(page, "acid-jazz", sampleGenre);
});

test("a played genre is still in History after a reload", async ({ page }) => {
  await page.goto("/acid-jazz");
  await page.getByText("Sample track 02").click();
  await expect(finds(page).getByRole("link", { name: "Acid Jazz", exact: true })).toBeVisible();

  await page.reload();
  await expect(finds(page).getByRole("link", { name: "Acid Jazz", exact: true })).toBeVisible();

  await page.goto("/");
  await expect(history(page).getByRole("button", { name: /^Acid Jazz/ })).toBeVisible();
  await expect(history(page).getByText(/^10 tracks · d{1,2} [A-Z][a-z]{2}$/)).toBeVisible();

  await history(page)
    .getByRole("button", { name: /^Acid Jazz/ })
    .click();
  await expect(page).toHaveURL(/\/acid-jazz$/);
  await expect(page.getByText("Sample track 02")).toBeVisible();
});

test("removes a find on the genre page, with undo", async ({ page }) => {
  await page.goto("/acid-jazz");
  await seedHistory(page, ["Zeuhl", "Krautrock"]);

  await finds(page).getByRole("button", { name: "Remove Zeuhl from your finds" }).click();
  await expect(finds(page).getByRole("link", { name: "Zeuhl" })).toHaveCount(0);
  await finds(page).getByRole("button", { name: "Undo" }).click();
  await expect(finds(page).getByRole("link", { name: "Zeuhl" })).toBeVisible();

  await finds(page).getByRole("button", { name: "Remove Krautrock from your finds" }).click();
  await page.reload();
  await expect(finds(page).getByRole("link", { name: "Zeuhl" })).toBeVisible();
  await expect(finds(page).getByRole("link", { name: "Krautrock" })).toHaveCount(0);
});

test("a keyboard ✕ moves focus to Undo", async ({ page }) => {
  await page.goto("/acid-jazz");
  await seedHistory(page, ["Zeuhl"]);

  await finds(page).getByRole("button", { name: "Remove Zeuhl from your finds" }).focus();
  await page.keyboard.press("Enter");

  await expect(finds(page).getByRole("button", { name: "Undo" })).toBeFocused();
});

test("Clear all empties History for good", async ({ page }) => {
  await page.goto("/");
  await seedHistory(page, ["Zeuhl", "Krautrock"]);

  await history(page).getByRole("button", { name: "Clear all history" }).click();
  await history(page).getByRole("button", { name: "Clear", exact: true }).click();
  await page.reload();

  await expect(history(page).getByText("Nothing here yet.")).toBeVisible();
});
