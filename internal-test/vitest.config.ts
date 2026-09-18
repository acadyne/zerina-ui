import path from "node:path";

import react from "@vitejs/plugin-react";

import {
  defineConfig,
} from "vitest/config";


export default defineConfig({
  plugins: [
    react(),
  ],

  resolve: {
    alias: [
      {
        find:
          "zerina-ui/styles.css",

        replacement:
          path.resolve(
            __dirname,
            "../src/styles.css"
          ),
      },

      {
        find:
          "zerina-ui",

        replacement:
          path.resolve(
            __dirname,
            "../src/index.ts"
          ),
      },
    ],
  },

  test: {
    environment: "jsdom",

    setupFiles: [
      "./tests/setup.ts",
    ],

    include: [
      "tests/**/*.{test,spec}.{ts,tsx}",
    ],

    restoreMocks: true,
    clearMocks: true,
  },
});