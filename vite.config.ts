"use strict";
import {resolve} from 'path';
import { defineConfig } from 'vite';
import { name, version } from './package.json';

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
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: NAME,
      formats: ['es', 'cjs', 'iife'],
      fileName: (format: string) => fileName[format],
    },
    target: 'ESNext',
    sourcemap: true,
    minify: 'esbuild',
  },
  esbuild: {
    charset: 'utf8',
    treeShaking: true,
  }
});

