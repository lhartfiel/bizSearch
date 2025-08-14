// vite.config.ts
import { defineProject } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineProject({
  test: {
    globals: true,
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    environment: "jsdom",
    setupFiles: "./vitest-setup.js",
  },
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths(),
    react(),
    tailwindcss(),
    tanstackStart({ customViteReactPlugin: true }),
  ],
});
