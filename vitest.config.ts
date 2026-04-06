import { defineConfig } from "vitest/config";
import { resolve } from 'node:path';
// import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  resolve: {
    alias: {
      "~": resolve(__dirname, "src"),
    },
  },

  test: {
    css: true,
    globals: true,
    include: [
      "test/**.test.ts"
    ],
    environment: "happy-dom",
    coverage: {
      provider: "istanbul",
      reporter: ["html", "text", "lcov"],
      enabled: true,
      include: ["src/**/*.{ts,tsx}"],
    },
    // browser: {
    //   provider: playwright(),
    //   enabled: true,
    //   headless: true,
    //   instances: [
    //     {
    //       name: 'chromium',
    //       browser: 'chromium',
    //       headless: true,
    //     },
    //   ]
    // },
  },
});
