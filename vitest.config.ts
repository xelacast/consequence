import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "~": path.resolve(__dirname, "./src/") },
  },
  test: {
    include: ["./tests/**/*.{spec,test}.?(c|m)[jt]s?(x)"],
    setupFiles: ["./tests/vitest-setup.ts"],
  },
});
