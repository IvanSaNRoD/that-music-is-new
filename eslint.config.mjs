import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

// Architecture boundaries (ADR-0005). In flat config a later block replaces the rule for the files it
// matches, so each block repeats the patterns that still apply.
const deepFeatureImport = {
  group: ["@/features/*/**"],
  message: "Import another feature only via its public entry: @/features/<name> (ADR-0005 rule 2).",
};
const serverImport = {
  group: ["@/server", "@/server/**"],
  message: "server/ is server-only; client code must not import it (ADR-0005 rule 4).",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: { "no-restricted-imports": ["error", { patterns: [deepFeatureImport] }] },
  },
  {
    files: ["src/features/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}", "src/lib/**/*.{ts,tsx}"],
    rules: { "no-restricted-imports": ["error", { patterns: [deepFeatureImport, serverImport] }] },
  },
  {
    files: ["src/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react", "react-dom", "react/*", "next", "next/*"],
              message: "domain/ is pure TypeScript: no React or Next (ADR-0005 rule 3).",
            },
            {
              group: ["@/features/**", "@/components/**", "@/server/**", "@/mocks/**", "@/features", "@/server"],
              message: "domain/ imports nothing from features, components, server or mocks (ADR-0005 rules 3, 6).",
            },
          ],
        },
      ],
    },
  },
  // Last: turns off stylistic rules that would fight Prettier.
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
