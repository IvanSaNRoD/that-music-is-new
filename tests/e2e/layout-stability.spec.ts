// #80: when the web fonts arrive late (slow network), swapping them in must not move the page. The fallback faces
// (globals.css) take the same space as Inter Tight 800 and Space Mono, so the home row keeps its height.
import { expect, mockCrate, sampleCrate, test } from "./fixtures";

test("the desktop home doesn't shift when the web fonts arrive late", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop layout: the headline column is narrowest between 1024 and 1400px");
  await page.setViewportSize({ width: 1350, height: 940 });
  await mockCrate(page, sampleCrate);
  await page.route(/\.woff2$/, async (route) => {
    await new Promise((r) => setTimeout(r, 1500)); // first paint happens with the fallback fonts
    await route.continue();
  });
  await page.addInitScript(() => {
    const w = window as unknown as { __cls: number };
    w.__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[])
        if (!e.hadRecentInput) w.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto("/");
  await page.waitForFunction(
    () => document.fonts.status === "loaded" && [...document.fonts].some((f) => f.status === "loaded"),
  );
  await page.waitForTimeout(500); // let the swap lay out

  const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
  expect(cls).toBeLessThan(0.1); // Core Web Vitals "good"
});

// #86: the headline scales with its column on desktop, so it stays 3 lines and the row doesn't grow. A taller
// row stretched the crate panel and opened an empty band above its bottom-aligned sleeves (200px+ at 1280px).
const fullCrate = [
  "Acid Jazz",
  "Trip Hop",
  "Zamba",
  "Afropop",
  "Brass Band",
  "Chant Basque",
  "Westcoast Flow",
  "Yacht Rock",
].map((genre) => ({ genre, slug: genre.toLowerCase().replace(/ /g, "-") })); // the API always sends 8
for (const width of [1024, 1180, 1280, 1366, 1440]) {
  test(`at ${width}px the headline stays 3 lines and the crate has no empty band`, async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop layout");
    await page.setViewportSize({ width, height: 900 });
    await mockCrate(page, fullCrate);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".crate-sleeve").first()).toBeVisible();

    const { lines, band } = await page.evaluate(() => {
      const h1 = document.querySelector("h1")!;
      const heading = [...document.querySelectorAll("h2")].find((h) => h.textContent?.trim() === "The crate")!;
      const sleeve = document.querySelector(".crate-sleeve")!;
      return {
        lines: Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight)),
        band: sleeve.getBoundingClientRect().top - heading.getBoundingClientRect().bottom,
      };
    });
    expect(lines).toBe(3);
    expect(band).toBeLessThanOrEqual(40); // DESIGN.md: ~40px of air above the stack (26px + the panel gap)
  });
}
