// F1 (#32): security headers on every response, and a CSP that doesn't break the app or the Spotify Embed.
import { expect, mockGenre, sampleGenre, test } from "./fixtures";

test("every page and API answer sends the security headers", async ({ request }) => {
  for (const path of ["/", "/acid-jazz", "/no-such-genre", "/api/genres/crate"]) {
    const res = await request.get(path);
    const h = res.headers();
    const csp = h["content-security-policy"] ?? "";
    expect(csp, path).toContain("default-src 'self'");
    expect(csp, path).toContain("frame-src https://open.spotify.com");
    expect(csp, path).toContain("frame-ancestors 'none'"); // no clickjacking: nobody frames us
    expect(csp, path).toContain("object-src 'none'");
    expect(h["x-content-type-options"], path).toBe("nosniff");
    expect(h["referrer-policy"], path).toBe("strict-origin-when-cross-origin");
    expect(h["permissions-policy"], path).toContain("camera=()");
  }
});

test("the listener flow runs under the CSP without a single violation", async ({ page }) => {
  // Collected from the first script on: anything the policy blocks (script, frame, style, connection).
  await page.addInitScript(() => {
    const w = window as unknown as { __csp: string[] };
    w.__csp = [];
    document.addEventListener("securitypolicyviolation", (e) => w.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  });
  await mockGenre(page, "acid-jazz", sampleGenre);

  await page.goto("/");
  await expect(page.getByRole("region", { name: "Genre crate" })).toBeVisible();
  await page.goto("/acid-jazz");
  await page.getByText("Sample track 02", { exact: true }).filter({ visible: true }).click();
  await expect(page.locator('iframe[title="Spotify Embed"]').filter({ visible: true })).toHaveAttribute(
    "src",
    /\/track-2$/,
  );

  expect(await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp)).toEqual([]);
});
