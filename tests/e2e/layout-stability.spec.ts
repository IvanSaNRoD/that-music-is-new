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
