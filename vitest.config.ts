import { defineConfig } from "vitest/config";
import { resolve } from 'node:path';
import process from 'node:process';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  resolve: {
    alias: {
      "~": resolve(process.cwd(), "src"),
    },
  },

  test: {
    css: true,
    globals: true,
    include: [
      "test/**.test.ts"
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
    ],
    coverage: {
      provider: "istanbul",
      reporter: ["html", "text", "lcov"],
      enabled: true,
      include: ["src/**/*.{ts,js}"],
    },
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
      instances: [
        {
          name: 'chromium',
          browser: 'chromium',
          headless: true,
        },
      ]
    },
  },
});
