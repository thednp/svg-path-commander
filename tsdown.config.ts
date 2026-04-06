import { defineConfig, type UserConfig } from "tsdown";
import stripComments from "vite-plugin-strip-comments";
const pkg = await import("./package.json", { with: { type: "json" } }).then(
  (m) => m.default,
);

const year = new Date().getFullYear();
const banner = `/*!
* SVGPathCommander v${pkg.version} (${pkg.homepage})
* Copyright ${year} © ${pkg.author}
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/`;
const miniBanner = `/*! SVGPathCommander $package v${pkg.version} | ${pkg.author} © ${year} | ${pkg.license}-License */`;

const config: UserConfig = {
  exports: true,
  dts: true,
  clean: true,
  sourcemap: true,
  // skipNodeModulesBundle: true,
  // outDir: "dist"
  // plugins: [stripComments({ type: "keep-jsdoc" })],
  globalName: "SVGPathCommander",
};

export default defineConfig([
  { // UMD
    ...config,
    entry: "src/index.ts",
    format: "umd",
    minify: true,
    target: "esnext",
    platform: "browser",
    banner: miniBanner.replace("$package", "UMD"),
    plugins: [stripComments({ type: "none" })],
    deps: {
      alwaysBundle: ["@thednp/dommatrix"],
    },
    outputOptions: {
      file: "dist/index.min.js",
    },
  },
  { // ESM
    ...config,
    entry: "src/index.ts",
    target: "esnext",
    platform: "neutral",
    treeshake: true,
    format: ["esm"],
    plugins: [stripComments({ type: "keep-jsdoc" })],
    banner: banner.replace("$package", "ESM"),
    deps: {
      skipNodeModulesBundle: true,
      neverBundle: ["@thednp/dommatrix"],
    },
    outputOptions: {
      dir: "dist",
    },
  },
  { // UTIL
    ...config,
    entry: {
      util: "src/util.ts",
    },
    format: "esm",
    platform: "neutral",
    target: "esnext",
    treeshake: true,
    plugins: [stripComments({ type: "keep-jsdoc" })],
    banner: banner.replace("$package", "UTIL"),
    outputOptions: {
      dir: "dist",
    },
  },
]);
