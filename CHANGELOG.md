# Changelog

## [2.3.5] - 2026-11-16

### Fixed

- `reversePath()` no longer loses the `Z` of a sub-path ([#65](https://github.com/thednp/svg-path-commander/issues/65)) — the reversal was applied to the whole path as a single shape, so the `M`/`Z` pairs of the sub-paths were mixed up and the closing command was dropped; e.g. `reversePath("M0 0L10 0L10 10Zm4 4")` returned `M4 4M0 0M10 10L10 0L0 0` instead of `M10 10L10 0L0 0ZM4 4`; every sub-path is now reversed on its own and the sub-paths keep their original order, so the static method returns the same result as the `reverse()` instance method (this was still broken in 2.3.4)
- `reversePath()` no longer throws for an empty path — it returns an empty array, like the other static methods
- No `dist` bundle contains `istanbul` comments anymore (except for the source maps) — the bundled `@thednp/dommatrix` shipped its coverage hints with the `@preserve` suffix, which the bundlers treat as a legal-comment marker, so the comment survived the minification of the UMD bundle

### Changed

- The `istanbul` coverage hints no longer carry the `@preserve` suffix — the suffix is a legal-comment marker for the bundlers, not a coverage hint
- Removed dependencies: `vite-plugin-strip-comments` — the comments are now stripped by the bundler itself through `outputOptions.comments`; the `vite` and `tsdown` packages are no longer direct dev dependencies (`vite-plus` provides them), and the browser provider comes from `vite-plus/test/browser-playwright`
- Updated dependencies: `@thednp/dommatrix` `^3.1.4` — the dependency is now published with its comments stripped, so the `dist` bundles no longer carry its `istanbul` comments
- Rebuilt `dist` and `docs` bundles

## [2.3.4] - 2026-11-15

### Fixed

- `getPathBBox()` returned mirrored extrema for elliptical arcs rotated by more than 90 degrees ([#65](https://github.com/thednp/svg-path-commander/issues/65)) — `getArcBBox()` (`src/math/arcTools.ts:440`) assumed the same extremum order for the X and Y axis, but the extrema swap sides when `cos(alpha) < 0`, so e.g. `M-4 0A22 5 156 0 0 3 -21` reported `[-34.21, -21, 3, 6.26]` instead of `[-4, -27.26, 33.21, 0]`
- `S`/`s` smooth-cubic shorthand no longer reflects a control point that does not exist ([#65](https://github.com/thednp/svg-path-commander/issues/65)) — per the SVG spec the control point of an `S` is only reflected when the previous command is a `C`/`c`/`S`/`s`, otherwise it coincides with the current point; `normalizePath()`, `pathToCurve()` and `optimizePath()` read the reflectable control point from the previous segment whatever its type, so an `S` after a `Q` or an `A` reflected a quadratic control point or even an arc flag, and a legitimate `0` coordinate was treated as a missing value
- `reversePath()` no longer produces `NaN` coordinates for a path with a trailing moveto or a segment following a `Z` ([#65](https://github.com/thednp/svg-path-commander/issues/65)) — the previous point was read from the previous segment, which has no coordinates for a `Z` segment
- `reverse()` no longer collapses the control points of an `S` segment that is not preceded by a cubic ([#66](https://github.com/thednp/svg-path-commander/issues/66)) — the reversed segment kept the `S` shorthand although the reflected control point cannot be recovered from the previous segment of the reversed path, so the control points collapsed onto the current point and the path length changed
- `optimize()` no longer rewrites a cubic as a smooth cubic when the control points do not match ([#66](https://github.com/thednp/svg-path-commander/issues/66)) — `shortenSegment()` (`src/process/shortenSegment.ts:54`) checked a second, unrelated condition that ignored the control points of the cubic, so any cubic following a segment whose control point matched its end point was shortened to an `s`, changing the shape of the path

### Changed

- `ParserParams.x2` / `ParserParams.y2` are now `number | null`, `null` marks a previous segment without a reflectable control point (the same sentinel used by `ParserParams.qx` / `ParserParams.qy`)
- `normalizeSegment()` accepts the command of the previous segment as an optional third argument, required to tell a reflectable control point from a missing one
- Migrated the toolchain from pnpm to Vite+ (`vp`) — the `package.json` scripts now run through `vp` / `vpr` (`vp test`, `vp pack`, `vp lint src`, `vp fmt src`), the docs are served with `vp dev docs --port 3000`, the shared dependencies are pinned through the `catalog:` in `pnpm-workspace.yaml` and the GitHub Actions workflows are driven by the `voidzero-dev/setup-vp` action (`vpr lint`, `vpr build`, `vpr test`, `vp pm publish`)
- The source is now formatted with oxfmt (`vp fmt src`) instead of `deno fmt src`, and linted with oxlint (`vp lint src`) instead of `deno lint src`; `deno lint` / `deno check` still gate the JSR publish
- The `lint` script now runs the type check as well (`vpr lint:ts && vpr check:ts`), so `vpr lint` covers both oxlint and `tsc --noEmit`
- Updated dev dependencies: `vitest` / `@vitest/*` `5.1.0`, `vite-plus` `1.6.0`, `happy-dom` `^21.0.4`, `playwright` `^1.65.1`, `@types/node` `^26.6.6` — `tsdown` is no longer a direct dev dependency, `vite-plus` provides it, and the browser provider comes from `vite-plus/test/browser-playwright`
- Updated dependencies: `@thednp/dommatrix` `^3.1.3`
- Rebuilt `dist` and `docs` bundles

## [2.3.3] - 2026-09-02

### Changed

- Updated dependencies: `@thednp/dommatrix` `^3.1.2`

## [2.3.2] - 2026-09-02

### Fixed

- `T`/`t` smooth-quadratic shorthand without a preceding `Q`/`q`/`T`/`t` now correctly uses the current point as control point per the SVG spec ([#64](https://github.com/thednp/svg-path-commander/pull/64), thanks @nattyluke) — `normalizeSegment` (`src/process/normalizeSegment.ts:4`), `getPathBBox` (`src/util/getPathBBox.ts:12`) and `getTotalLength` (`src/util/getTotalLength.ts:12`) previously reflected a `0`-defaulted control point, so a `t` following a non-`Q` command (e.g. Illustrator `c...t` output) produced an inflated control/bbox/length (thanks @nattyluke)

### Changed

- Updated dev dependencies: `@types/node` `^26.4.1`, `vitest` / `@vitest/*` `^4.1.11`, `happy-dom` `^20.12.2`, `vite` `^8.2.2`
- Rebuilt `dist` and `docs` bundles

## [2.3.1] - 2026-08-05

### Changed

- Updated `@thednp/dommatrix` to `^3.1.1` — the 3.1.x line carries the shim's matrix-math rework (specialized `translate` / `scale` / `skew` / `multiply` and constructor fast paths), which directly accelerates the 3D transform path through `getSVGMatrix()` and `projection2d()`; 3.1.1 makes `setMatrixValue()` mutate the instance in place and return `this`, matching native `DOMMatrix` (SVGPathCommander does not use `setMatrixValue()`, so output is byte-identical and the 2D single-pass fast path is untouched)
- Rebuilt `dist` and `docs` bundles

## [2.3.0] - 2026-08-04

### Added

- `pnpm bench` — head-to-head benchmark against the [SvgPath](https://github.com/fontello/svgpath) library (vendored reference in `scripts/svgpath/`), comparing parse / bbox / transform / string output, with results embedded in the README

### Changed

- **Performance**: allocation-free parsing — `scanParam()` converts validated number substrings without allocating new strings, `finalizeSegment()` builds segments with pre-sized arrays and index-based slicing instead of `splice()`
- **Performance**: single-pass 2D transforms — `transformPath()` now uses a dedicated `transform2D()` fast path that transforms segments in place (no per-segment absolutize / copy / DOMMatrix projection), falling back to the 3D-capable `iterate()` path for 3D matrices; output is byte-identical to the previous implementation (~2.8x faster 2D transforms)
- **Performance**: fast 2D branch in `projection2d()`, char-code based command detection in `iterate()` / `getPathBBox()`, allocation-free rounding in `pathToString()`, and a dedicated `C` case in `absolutizeSegment()`
- Rebuilt `dist` and `docs` bundles

## [2.2.4] - 2026-08-04

### Fixed

- Build warnings: UMD bundle now uses a dedicated `src/browser.ts` entry so the `SVGPathCommander` global remains the class itself (no mixed-exports namespace), and the `output.dir`/`output.file` conflict is resolved — tree-shaking, named exports and type declarations are unaffected
- ESM bundle exports the `SVGPathCommander` named export alongside the default, with all types available in `dist/index.d.ts`

## [2.2.3] - 2026-08-04

### Added

- Named `SVGPathCommander` export alongside the default export for better JSR documentation rendering
- Full JSDoc coverage for all class statics, instance properties, getters and every interface / type member — zero undocumented symbols per `deno doc --json` on both `index` and `util` entry points
- JSR `./util` subpath export in `deno.json`, mirroring the npm `svg-path-commander/util` entry

### Changed

- Documentation moved from the GitHub wiki into the repository `wiki/` folder — the GitHub-hosted wiki pages are no longer available, and the README and wiki pages now reference the local `wiki/` folder instead
- Merged `NPM.md` and `JSR.md` into a single `Installation.md` (npm, pnpm, bun, Deno/JSR and CDN installation)
- Updated `Usage-Examples.md` with corrected output values verified against the current implementation
- Rebuilt `dist` and `docs` bundles

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
