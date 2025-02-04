import { defineConfig } from 'tsup'

export default defineConfig([
  // Main bundle configuration
  {
    entryPoints: {
        'svg-path-commander': 'src/index.ts'
    },
    format: ['esm', 'cjs', 'iife'],
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
        iife: '.js',
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
    format: ['esm', 'cjs', 'iife'],
    clean: true,
    sourcemap: true,
    minify: true,
    splitting: false,
    outDir: 'dist/util',
    target: 'es2020',
    globalName: 'SVGPathCommanderUtil',
    outExtension: ({ format }) => ({
      js: {
        esm: '.mjs',
        iife: '.js',
        cjs: '.cjs'
      }[format]
    }),
    esbuildOptions(options) {
      options.legalComments = 'none'
    }
  }
])