"use strict";
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from "vite-plugin-dts";

const NAME = 'SVGPathCommanderUtil';

const fileName = {
  es: `util.mjs`,
  cjs: `util.cjs`,
  // iife: `util.js`,
  umd: `util.js`,

};

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      "~": resolve(__dirname, "src"),
    },
  },
  // plugins: [
  //   dts({
  //     outDir: 'dist/util',
  //     copyDtsFiles: false,
  //     rollupTypes: true,
  //   }),
  // ],
  build: {
    emptyOutDir: true,
    outDir: 'dist/util',
    lib: {
      entry: resolve(__dirname, 'src/util.ts'),
      name: NAME,
      formats: ['es', 'umd', 'cjs'],
      fileName: (format: string) => fileName[format],
    },
    sourcemap: true,
    reportCompressedSize: true,
  },
  esbuild: {
    legalComments: 'none'
  }
});

