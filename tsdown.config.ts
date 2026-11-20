import { defineConfig, type UserConfig } from "vite-plus/pack";
const pkg = await import("./package.json", { with: { type: "json" } }).then((m) => m.default);

const year = new Date().getFullYear();
const banner = `/*!
* SVGPathCommander $package v${pkg.version} (${pkg.homepage})
* Copyright ${year} © ${pkg.author}
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/`;
const miniBanner = `/*! SVGPathCommander $package v${pkg.version} | ${pkg.author} © ${year} | ${pkg.license}-License */`;

const config: UserConfig = {
  exports: {
    inlinedDependencies: false,
    packageJson: true,
  },
  dts: {
    sourcemap: true,
    sideEffects: false,
  },
  // clean: true,
  sourcemap: true,
  globalName: "SVGPathCommander",
};

export default defineConfig([
  {
    // UMD
    ...config,
    entry: "src/browser.ts",
    format: "umd",
    clean: true,
    minify: true,
    target: "esnext",
    platform: "browser",
    banner: miniBanner.replace("$package", "UMD"),
    deps: {
      alwaysBundle: ["@thednp/dommatrix"],
      onlyBundle: false,
    },
    dts: false,
    outputOptions(options) {
      return {
        ...options,
        comments: false, // temp
        dir: undefined,
        file: "dist/index.min.js",
        exports: "default",
      };
    },
  },
  {
    // ESM
    ...config,
    entry: "src/index.ts",
    target: "esnext",
    platform: "neutral",
    treeshake: true,
    format: ["esm"],
    banner: banner.replace("$package", "ESM"),
    deps: {
      neverBundle: ["@thednp/dommatrix"],
    },
    outputOptions(options) {
      return {
        ...options,
        comments: { legal: true, annotation: false, jsdoc: true }, // temp
      };
    },
  },
  {
    // UTIL
    ...config,
    entry: {
      util: "src/util.ts",
    },
    format: "esm",
    platform: "neutral",
    target: "esnext",
    treeshake: true,
    banner: banner.replace("$package", "UTIL"),
    outputOptions(options) {
      return {
        ...options,
        comments: { legal: true, annotation: false, jsdoc: true }, // temp
      };
    },
  },
]);
