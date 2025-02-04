"use strict";
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { name } from './package.json';

const getPackageName = () => {
  return name.includes('@') ? name.split('/')[1] : name;
};

const NAME = 'SVGPathCommander';

const fileName = {
  es: `${getPackageName()}.mjs`,
  cjs: `${getPackageName()}.cjs`,
  iife: `${getPackageName()}.js`,
};

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      "~": resolve(__dirname, "src"),
    },
  },
  build: {
    emptyOutDir: false,
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: NAME,
      formats: ['iife'],
      fileName: (format: string) => fileName[format],
      
    },
    sourcemap: true,
    reportCompressedSize: true,
    
  },
  esbuild: {
    legalComments: 'none',
  }
});