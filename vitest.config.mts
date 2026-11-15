import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit + component tests (Next.js guide: node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md).
// No @vitejs/plugin-react: Vite compiles JSX with the automatic runtime (tsconfig "jsx": "react-jsx"),
// and the plugin's optional Babel 8 peer conflicts with shadcn's Babel 7.
// Async Server Components can't be unit-tested; cover them with Playwright (tests/e2e).
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    // `server-only` throws unless resolved with Next's react-server condition; Vitest doesn't use it,
    // so map it to the package's own empty module to let tests load src/server/** files.
    alias: { "server-only": fileURLToPath(new URL("./node_modules/server-only/empty.js", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}", "tests/msw/**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
