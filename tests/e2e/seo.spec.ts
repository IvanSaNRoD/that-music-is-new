// SEO and metadata (#31): titles, 404s, robots, sitemap, Open Graph images. Our API is mocked from the browser.
import { expect, mockCrate, mockGenre, sampleCrate, sampleGenre, test } from "./fixtures";

const ogImage = (page: import("@playwright/test").Page) =>
  page.locator('meta[property="og:image"]').getAttribute("content");

test("the home has the site title, description and a site preview image", async ({ page, request }) => {
  await mockCrate(page, sampleCrate);
  await page.goto("/");

  await expect(page).toHaveTitle("That Music Is New — hear a genre you’ve never heard of");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /random rare genre/);
  const image = await request.get(new URL((await ogImage(page))!).pathname);
  expect(image.headers()["content-type"]).toBe("image/png");
});

test("a genre page is titled after its genre, with its own preview image", async ({ page, request }) => {
  await mockGenre(page, "acid-jazz", sampleGenre);
  await page.goto("/acid-jazz");

  await expect(page).toHaveTitle("Acid Jazz · That Music Is New");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/acid-jazz$/);
  const src = (await ogImage(page))!;
  expect(src).toContain("/acid-jazz/opengraph-image");
  const image = await request.get(new URL(src).pathname);
  expect(image.headers()["content-type"]).toBe("image/png");
});

test("deeper unknown URLs get the site's own 404", async ({ page }) => {
  const response = await page.goto("/no-such/deeper/path");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Not in the crate" })).toBeVisible();
  await expect(page).toHaveTitle("Not in the crate · That Music Is New");
});

test("an unknown genre is titled as a 404 and kept out of search", async ({ page }) => {
  await page.goto("/no-such-genre-e2e");

  await expect(page).toHaveTitle("Not in the crate · That Music Is New");
  // Streamed page (status 200 once the shell is sent): noindex is what keeps it out of search. Next adds its own
  // noindex tag for a streamed notFound() too, hence first().
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
});

test("robots keeps crawlers out of the API and points to a sitemap of every genre", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /api/");
  expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/acid-jazz</loc>");
  expect(sitemap.match(/<url>/g)?.length).toBeGreaterThan(6000);
});
