# AGENTS.md — SVGPathCommander

## Project Overview

SVGPathCommander v2.2.0 — TypeScript library for manipulating SVG `<path>` `d` attributes. Works in browser and Node.js.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Serve docs on localhost:3000
pnpm test             # Run all tests (vitest + happy-dom)
pnpm test-ui          # Run tests with UI
pnpm test -- -t "Test name"    # Run a single test by name
pnpm test -- class.test.ts     # Run a single test file
pnpm lint             # Deno lint + tsc type check
pnpm lint:ts          # Deno lint only
pnpm fix:ts           # Deno lint --fix
pnpm format           # Deno format
pnpm build            # Build with tsdown
pnpm check:ts         # tsc --noEmit (type check only)
```

## Tech Stack

- **Language:** TypeScript (strict, ES2020 target, `allowImportingTsExtensions`)
- **Package manager:** pnpm (v10.33.0)
- **Build:** tsdown (ESM + UMD outputs)
- **Test:** Vitest + happy-dom (Istanbul coverage)
- **Lint/Format:** Deno (`deno lint`, `deno fmt`)
- **Dependency:** `@thednp/dommatrix` (DOMMatrix shim)

## Source Structure (`src/`)

| Directory | Purpose |
|---|---|
| `index.ts` | Main entry — exports SVGPathCommander class + all types |
| `main.ts` | SVGPathCommander class (core, chainable instance methods) |
| `types.ts` | TypeScript type definitions (PathCommand, PathSegment, PathArray, etc.) |
| `interface.ts` | Interfaces (Options, TransformObject, PathBBox, shape attrs) |
| `util.ts` | Re-export of all static methods (tree-shakeable entry) |
| `convert/` | Path format conversion (absolute, relative, curve, string) |
| `parser/` | SVG path string tokenizer/scanner |
| `process/` | Manipulation algorithms (normalize, optimize, reverse, transform, etc.) |
| `math/` | Low-level math (bezier, cubic, quad, line, arc, polygon tools) |
| `morph/` | Path morphing (equalize, split, sample, classify, match) |
| `util/` | Query helpers (bbox, length, point-at-length, intersection, etc.) |
| `options/` | Default configuration |

## Code Conventions

### Imports
- Use `.ts` extension on all imports: `import { foo } from "./bar.ts"`
- Path alias `~/*` maps to `src/` (e.g., `import SVGPathCommander from '~/index'`)
- Group imports: external libs → internal modules → types
- Use `import type` for type-only imports

### Formatting & Linting
- **No comments** unless explicitly asked
- Run `pnpm format` then `pnpm lint:ts` before committing
- Deno formatter and linter enforced (`deno fmt`, `deno lint`)

### TypeScript
- Strict mode enabled — no `any`, no implicit `any`
- `noUnusedLocals` and `noUnusedParameters` enforced
- `noImplicitReturns` enforced
- `allowImportingTsExtensions` — always include `.ts` in imports
- Use `type` aliases for unions, `interface` for object shapes

### Naming Conventions
- **Classes:** PascalCase (`SVGPathCommander`, `PathParser`)
- **Functions/Methods:** camelCase (`parsePathString`, `normalizePath`)
- **Types:** PascalCase ending in semantic suffix (`PathArray`, `NormalSegment`, `IteratorCallback`)
- **Command types:** Suffix with `Command`/`Segment` (`AbsoluteCommand`, `MSegment`)
- **Constants:** camelCase for module-level constants (`defaultOptions`, `distanceEpsilon`)
- **Test descriptions:** Start with `Test` (`Test init with no parameter`)

### Error Handling
- Throw `TypeError` with descriptive message for invalid inputs
- Use the shared `error` prefix from `~/util/error.ts`
- Validate inputs early, fail fast with clear messages
- Static methods return safe defaults for empty/invalid input (e.g., `getPathBBox('')`)

### Class Design
- Instance methods are chainable — always `return this`
- Expose functionality as both instance methods and static methods
- Use getters for computed properties (`get bbox()`, `get length()`)
- Instance options validated in constructor with fallback to `defaultOptions`

### Testing
- Tests run with happy-dom (headless browser simulation)
- Fixtures in `test/fixtures/`
- Two test files: `test/class.test.ts` (instance API), `test/static.test.ts` (static methods)
- Tests render actual SVG and verify `d` attribute output
- Use `vi.waitFor()` for async DOM queries (timeout: 200ms)
- Use `expect().to.deep.equal()` for object comparison, `expect().to.equal()` for primitives
- Coverage provider: Istanbul

## Build Outputs

| File | Description |
|---|---|
| `dist/index.min.js` | UMD bundle (minified, browser-ready, includes dommatrix) |
| `dist/index.js` | ESM bundle (tree-shakeable, neutral platform) |
| `dist/util.js` | Static methods only (tree-shakeable) |
| `dist/index.d.ts` | Type declarations |
