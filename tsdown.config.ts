import { defineConfig, type UserConfig } from "vite-plus/pack";
const pkg = await import("./package.json", { with: { type: "json" } }).then((m) => m.default);

const year = new Date().getFullYear();
const banner = `/*!
* SVGPathCommander $package v${pkg.version} (${pkg.homepage})
* Copyright ${year} © ${pkg.author}
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/`;
const miniBanner = `/*! SVGPathCommander $package v${pkg.version} | ${pkg.author} © ${year} | ${pkg.license}-License */`;

const labels: Record<string, string> = {
  index: "ESM",
  util: "UTIL",
  morph: "MORPH",
  intersect: "INTERSECT",
};

/**
 * The banner of a chunk, labelled with the name of the entry point.
 *
 * @param fallback the label of the entry point the config belongs to
 * @returns the banner of the chunk
 */
const chunkBanner =
  (fallback: string) =>
  ({ fileName }: { fileName: string }): string => {
    const name = fileName.split(".")[0];
    return banner.replace("$package", labels[name] ?? fallback);
  };

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

/**
 * The config of an ESM entry point.
 *
 * Every entry point is built on its own, so the bundle of one entry point
 * never depends on a chunk of another one.
 *
 * @param entry the entry point source
 * @param label the label of the banner
 * @returns the config of the entry point
 */
const esmConfig = (entry: string, label: string): UserConfig => ({
  ...config,
  entry,
  format: ["esm"],
  platform: "neutral",
  target: "esnext",
  treeshake: true,
  banner: chunkBanner(label),
  outputOptions(options) {
    return {
      ...options,
      comments: { legal: true, annotation: false, jsdoc: true }, // temp
    };
  },
});

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
    ...esmConfig("src/index.ts", "ESM"),
    deps: {
      neverBundle: ["@thednp/dommatrix"],
    },
  },
  // UTIL
  esmConfig("src/util.ts", "UTIL"),
  // MORPH
  esmConfig("src/morph.ts", "MORPH"),
  // INTERSECT
  esmConfig("src/intersect.ts", "INTERSECT"),
]);
