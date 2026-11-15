import tsdownConfig from "./tsdown.config.js";

import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: ["dist/**", "docs/index.min.js", "docs/index.min.js.map"],
  },
  lint: {
    ignorePatterns: ["dist/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        // the chai assertions are property getters (`to.be.true`, `to.exist`),
        // the base rule reports them as unused expressions
        files: ["test/**"],
        rules: { "no-unused-expressions": "off" },
      },
    ],
  },
  pack: tsdownConfig,
});
