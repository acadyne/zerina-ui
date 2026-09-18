import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "zerina-ui/styles.css",
        replacement: path.resolve(__dirname, "../src/styles.css"),
      },
      {
        find: "zerina-ui",
        replacement: path.resolve(__dirname, "../src/index.ts"),
      },
    ],
  },
  server: {
    port: 5174,
  },
});