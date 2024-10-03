import { defineConfig } from 'tsup';
import { name } from './package.json';

const getPackageName = () => {
  return name.includes('@') ? name.split('/')[1] : name;
};

const fileName = {
    es: `${getPackageName()}.mjs`,
    cjs: `${getPackageName()}.cjs`,
    iife: `${getPackageName()}.js`,
};

export default defineConfig({
  // Set the output name
  name: 'svg-path-commander',
  globalName: 'SVGPathCommander',

  // Target Node.js 18 (adjust as needed)
  target: 'node20',
  entry: ['./src/index.ts'],
  minifyWhitespace: false,
  minifySyntax: false,
  minify: false,

  // Enable DTS (TypeScript declaration files) generation
  dts: {
    // Resolve type declarations for all files
    resolve: true,

    // Specify an entry point for DTS generation (optional)
    entry: './src/index.ts',
  },
  outDir: './dist',
  format: ['cjs', 'esm', 'iife']
});