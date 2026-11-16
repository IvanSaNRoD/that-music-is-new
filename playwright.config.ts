import { defineConfig, devices } from "@playwright/test";

// E2E (Next.js guide: node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md).
// Desktop + a touch phone, because layout and touch rules differ below 1024px (DESIGN.md › Layout).
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // CI: annotations on the PR + an HTML report uploaded as an artifact when e2e fails.
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: "http://localhost:3000", trace: "on-first-retry" },
  // Local runs use `next dev`, which compiles a route on its first visit and may reload the page once:
  // give assertions more time there. CI serves a production build, where the 5s default is plenty.
  expect: { timeout: process.env.CI ? 5_000 : 15_000 },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: [
    {
      // Fake Spotify (tests/e2e/fake-spotify.ts): Next calls it instead of the real API — no secrets, no network.
      command: "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON tests/e2e/fake-spotify.ts",
      url: "http://127.0.0.1:4010/health",
      reuseExistingServer: !process.env.CI,
    },
    {
      // CI tests the production build; locally `next dev`.
      command: process.env.CI ? "npm run build && npm run start" : "npm run dev",
      // Port, not a page: readiness must not depend on any route rendering (a broken page would hang startup).
      port: 3000,
      // Never reuse: an already running `npm run dev` has the real .env.local and would call real Spotify.
      // Stop it before `npm run test:e2e` (one `next dev` per project).
      reuseExistingServer: false,
      timeout: 180_000,
      // Explicit env wins over .env.local (Next never overrides variables already set).
      env: {
        SPOTIFY_ACCOUNTS_URL: "http://127.0.0.1:4010",
        SPOTIFY_API_URL: "http://127.0.0.1:4010/v1",
        SPOTIFY_CLIENT_ID: "e2e",
        SPOTIFY_CLIENT_SECRET: "e2e",
      },
    },
  ],
});
