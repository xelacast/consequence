import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/tests/**/*.{spec,test}.?(c|m)[jt]s?(x)"],
  },
});
