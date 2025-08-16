// vite.config.ts
import { defineProject } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineProject(({ command, mode }) => {
  const isTest = mode === "test"; // don't run tanstack start in test mode because it can't find hooks
  return {
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
    test: {
      globals: true,
      include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
      environment: "jsdom",
      setupFiles: "./vitest-setup.ts",
    },
    server: {
      port: 3000,
    },
    plugins: [
      tsConfigPaths(),
      tailwindcss(),
      ...(!isTest ? [tanstackStart({ customViteReactPlugin: true })] : []),
      react(),
    ],
  };
});
