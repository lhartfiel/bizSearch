// vite.config.ts
import { defineProject } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import tanstackRouter from "@tanstack/router-plugin/vite";

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
    tanstackRouter(),
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({ customViteReactPlugin: true }),
    react(),
  ],
});
