import { defineConfig } from 'tsup'

export default defineConfig([
  // Node bundle configuration
  // Browser bundle is handled by Vite
  {
    entryPoints: {
      'svg-path-commander': 'src/index.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    minify: true,
    splitting: false,
    outDir: 'dist',
    target: 'es2020',
    globalName: 'SVGPathCommander',
    outExtension: ({ format }) => ({
      js: {
        esm: '.mjs',
        cjs: '.cjs'
      }[format]
    }),
    esbuildOptions(options) {
      options.legalComments = 'none'
    }
  },
  // Util bundle configuration
  {
    entry: ['src/util.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    minify: true,
    splitting: false,
    outDir: 'dist/util',
    target: 'es2020',
    treeshake: true,
    globalName: 'SVGPathCommanderUtil',
    outExtension: ({ format }) => ({
      js: {
        esm: '.mjs',
        cjs: '.cjs'
      }[format]
    }),
    esbuildOptions(options) {
      options.legalComments = 'none'
    }
  }
])