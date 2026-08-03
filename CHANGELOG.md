# Changelog

## [2.2.2] - 2026-08-03

### Added
- `getBezierLengthAtT()` / `bezierLengthAtT()` — arc length up to a `t` ratio via Gauss-Legendre quadrature
- `arcLength()` / `arcLengthAtAngle()` / `arcLengthBetween()` — Gauss-Legendre ellipse arc length helpers
- Static-method cross-consistency tests (length/point lookup, conversions, transforms, geometry measurements, intersections)
- Native browser API parity tests — `getBBox()`, `getTotalLength()`, `getPointAtLength()` verified against real Chromium

### Fixed
- `getPointAtLength()` returning the start of the next segment at interior distances on a `Z` (closing line) segment (#61)
- `getPointAtLength()` returning stale coordinates for distances beyond the path end
- Arc length accuracy for `getTotalLength()` and `getPointAtLength()` (Gauss-Legendre quadrature)
- Bezier / quad length accuracy for arc-length sampling in `cubicTools` and `quadTools`
- Deno minimum-dependency-age policy blocking fresh `@thednp/dommatrix` releases — `minimumDependencyAge` disabled in `deno.json` (mirrors the pnpm `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`)

### Changed
- Migrated tests to Vitest browser mode (Playwright Chromium) with Istanbul coverage — 100% line, branch, function and statement coverage
- Updated test fixtures and expected values to match the current implementation
- Rebuilt `dist` and `docs` bundles
- Full Deno / JSR compatibility — `deno.json` publishing as `@thednp/svg-path-commander`, `deno task` equivalents for test / check / lint / build, `.ts` extensions on all relative imports and explicit return types across the public API; `deno check src`, `deno lint src` and `deno publish --dry-run` all clean
- Upgraded `@thednp/dommatrix` to v3.0.6 and toolchain (tsdown, Vite, Vitest, pnpm 11)

### Added
- `llms.txt` with an LLM-friendly project summary
- README installation section for JSR (`deno add jsr:@thednp/svg-path-commander`, raw TypeScript import) and JSR badge fix

## [2.2.1] - 2026-04-06

### Added
- Reorganized intersection tools into `src/intersect/` — `pathsIntersection()`, `boundingBoxIntersect()`, `isPointInsideBBox()`, `interHelper()`

### Changed
- tsdown config and CI workflow versions, `.npmignore` cleanup, demo fixes

## [2.2.0] - 2026-04-06

### Added
- **Path intersection** — `pathsIntersection()`, `boundingBoxIntersect()`, `isPointInsideBBox()`
- **Path equalization** — `equalizePaths()`, `equalizeSegments()` for matching segment counts
- Full JSDoc coverage with `@param`, `@returns`, `@example` tags
- New demo page for path morphing
- `polyonArea` utility
- `isMultiPath()`, `isClosedPath()`, `isPolygonArray()` and `isPolylineArray` utilities
- CHANGELOG.md and AGENTS.md

### Removed
- badge workflow and script in package.json

### Fixed
- **pathToCurve** inconsistencies
- reworked all exports as named exports

### Changed
- Added a separate export for utilities in `svg-path-commander/util`
- Migrated test runner from Playwright to happy-dom
- updated tests
- tsdown bundler
