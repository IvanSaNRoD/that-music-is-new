import { defineConfig } from "vitest/config";

// Unit + component tests (Next.js guide: node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md).
// No @vitejs/plugin-react: Vite compiles JSX with the automatic runtime (tsconfig "jsx": "react-jsx"),
// and the plugin's optional Babel 8 peer conflicts with shadcn's Babel 7.
// Async Server Components can't be unit-tested; cover them with Playwright (tests/e2e).
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}", "tests/msw/**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
