# Changelog

## [2.3.6] - 2026-11-20

### Added

- `getPropertiesAtLength()` returns the frame of the path at the given length — the `point` at that length, the unit `tangent` vector, the unit `normal` vector (the left normal of the tangent) and the `angle` of the tangent in degrees; the result is the union of the segment metadata and the frame, so the existing destructuring of `{ segment, index, length, lengthAtSegment }` keeps working
- `SVGPathCommander#getPropertiesAtLength(length)` — the instance method of the frame, the counterpart of `getPointAtLength()`:
  ```js
  new SVGPathCommander("M0 0L100 0").getPropertiesAtLength(50);
  // => { segment: ["L", 100, 0], index: 1, length: 100, lengthAtSegment: 0,
  //      point: { x: 50, y: 0 }, tangent: { x: 1, y: 0 },
  //      normal: { x: 0, y: 1 }, angle: 0 }
  ```
- `simplifyPath()` — the Douglas-Peucker simplification of a path: the path is measured along its length and the points that are needed to keep its shape within the tolerance are kept, the result is a path of straight lines, one sub-path for every sub-path of the source:
  ```js
  SVGPathCommander.simplifyPath("M0 0L10 0L20 0L30 0", 1);
  // => [["M", 0, 0], ["L", 30, 0]]
  ```
- `SVGPathCommander#simplify(tolerance)` — the instance method of the simplification, the counterpart of `normalize()`:
  ```js
  new SVGPathCommander("M0 0L10 0L20 0L30 0").simplify(1).toString();
  // => "M0 0L30 0"
  ```
- `equalize()` — the recommended entry point for morphing two paths: it picks the right strategy for the paths, aligns their points and normalizes their winding, so the two paths hold the same number of segments of the same type:
  ```js
  const [eq1, eq2] = SVGPathCommander.equalize("M0 0L100 0L50 100Z", "M0 0L100 0L100 100L0 100Z", {
    strategy: "arcLength",
  });
  // eq1.length === eq2.length === 5 — ready for morphing
  ```
- `resamplePath()` — the resampling of a path to a given number of points, spread evenly over its length: the distance between two points of the result is the same over the whole path, and the corners of the path are points of the result too, so the shape of the path keeps its vertices:
  ```js
  SVGPathCommander.resamplePath("M0 0L100 0L100 100", 3);
  // => [["M", 0, 0], ["L", 100, 0], ["L", 100, 100]]
  ```
- `equalizeSegments()` and `equalizePaths()` accept the `strategy` option — `segment` (the default) splits the segments of the paths, so the points of the result are the points of the paths, while `arcLength` spreads the points of the result evenly over the length of the paths and keeps their corners
- `equalizeSegments()` and `equalizePaths()` accept the `align` option — the points of the second path are rotated onto the points of the first one by default, `align: false` keeps them where they are
- `equalizeSegments()` and `equalizePaths()` accept `reverse: "auto"` — the path that is reversed is the one that leaves the two paths closest to each other, instead of always the second one
- `equalizeSegments()` and `equalizePaths()` accept the `mode: "line"` option — the result of the equalization is a polyline, even when the paths hold curves

### Fixed

- `samplePolygon()` no longer throws on a quadratic segment — the winding of a path with a `Q` segment could not be read, so the equalization of such a path failed with `path command "Q" is not supported`
- `getPointAtLength()` no longer jumps to the end of a zero radius arc — the SVG spec treats a zero radius as a straight line to the end point, and the length of such an arc was already measured that way, but the point lookup returned the end point for every distance along it
- `reversePath()` no longer corrupts the geometry of a `T` segment — a reversed `T` was emitted as the `T` shorthand whenever the original predecessor was not a `Q`/`T`, but in the reversed path the predecessor of a segment is its original _successor_, so when that successor was a `Q` the shorthand reflected the `Q`'s control point instead of the `T`'s own control point and silently changed the curve; e.g. `M0 0L10 0T20 20Q30 30 40 40` was off by up to 21 units — the shorthand is now kept wherever it is provably safe and falls back to an explicit `Q` otherwise
- `arcToCubic()` no longer produces `NaN` control points for a zero radius arc — the SVG spec treats a zero radius as a straight line to the end point, which is what the conversion produces now
- `getArcLength()` measures a zero radius arc as the straight line to its end point, the same as `getPointAtArcLength()` already did
- `arcToCubic()` uses the absolute value of a negative radius, as the spec says — the converted curve used to be a different shape than the arc it came from, and the length of `pathToCurve(arc)` was 7.4 % off the length of the arc itself
- `getPathSplits()` no longer hangs when the target cannot be reached — a target below the segment count, a fractional target and a non-finite target all made the adjustment loop wrap around forever (the hang was live: `getPathSplits([['M',0,0],['L',10,0],['L',20,0]], 2)` never returned); the target is now clamped to the segment count, fractional targets are floored and non-finite targets are rejected with a `TypeError`
- `equalizeSegments()` and `equalizePaths()` no longer mutate the module level defaults — the options of the first call were written into the defaults object, so every later call without options inherited them (`mode: "curve"` leaked, and so did `reverse: false`, which `equalizePaths()` passes for every matched subpath pair and which permanently disabled the winding normalisation of every later `equalizeSegments()` call — two paths with an opposite winding were then morphed without being aligned)
- Empty input has a defined contract everywhere — `getPathBBox([])` returns a zeroed bounding box, `getPointAtLength([], 10)` returns `{ x: 0, y: 0 }`, `isClosedPath([])` returns `false`, `getPropertiesAtPoint([])` returns `{ closest: { x: 0, y: 0 }, distance: Infinity }`, `getSegmentOfPoint([])` returns `undefined`, `isPointInStroke([])` returns `false`, `getClosestPoint([])` returns `{ x: 0, y: 0 }`, `getPropertiesAtLength([])` returns a synthetic `["M", 0, 0]` segment and `isValidPath("   ")` returns `false`; `getPathBBox()` was the worst of them — the guard tested the truthiness of the _input_, so an empty array (which is truthy) slipped through and the result was `{ x: Infinity, y: Infinity, x2: -Infinity, cx: NaN }`
- `getPropertiesAtLength()` no longer returns `undefined` for a negative distance (which made `getSegmentAtLength(path, -5)` throw) — a negative distance takes the same early return as a distance of zero
- A malformed segment (`[[]]`, `[[1, 2, 3]]`) now throws a descriptive `TypeError` naming the offending index, instead of "Cannot read properties of undefined" from deep inside the iterator
- `roundPath()` no longer modifies the caller's array — it returned the caller's own array with the segments replaced in place
- `transformPath()` no longer writes the default origin into the caller's transform object, where it was the _same array_ as `SVGPathCommander.options.origin` — a caller who mutated the origin they passed in corrupted the library's global default for the rest of the process
- `getSVGMatrix()` falls back to the default origin instead of throwing "origin is not iterable"
- `splitLineToCount()` splits a line into equal lengths — the breakpoints were computed from the _original_ start point, so a 90 unit line split in three became 30, 15 and 45 units long; this is the point distribution `equalizeSegments()` is built on, so an edge split in ten used to bunch its points at the start instead of spreading them evenly
- `matchPaths()` no longer destroys the caller's arrays — it sorted them in place and emptied them with `shift()`
- `splitPath()` no longer drops the segments before the first `M` and always returns absolute segments, as its docstring promises
- `isPathArray()` — and with it `isMultiPath()`, `isAbsoluteArray()` and `isRelativeArray()` — answers `false` for a malformed segment instead of throwing
- `projection2d()` no longer returns `Infinity` or `NaN` when the relative position has no `z` — the guard `Math.abs(originZ) / Math.abs(relativePositionZ) || 1` returns `Infinity` for a zero denominator, and `Infinity` is truthy, so the fallback never applied
- `classifyPaths()` no longer inverts outer and inner paths — the classification was purely `signedArea > 0 ? outer : inner`, but in the SVG coordinate system (y pointing down) the usual outer contour has a _negative_ signed area, so a square and its hole both came back as holes; a path is now an inner path when another path of the same set contains it, which does not depend on the winding at all
- The parser accepts a leading zero again (`M09 09`) — the SVG path grammar defines a number as a digit sequence and every browser accepts it; the rejection came from a borrowed Esprima rule that belongs to the JavaScript numeric literal grammar
- The parser rejects a number it cannot represent (`M1e999 0`) with a descriptive `TypeError`, instead of parsing it into an infinite coordinate that propagated into every length, bounding box and transformation
- `pathToAbsolute()` absolutizes a leading relative moveto — the SVG spec says "If a relative moveto (m) appears as the first element of the path, then it is treated as a pair of absolute coordinates", but `absolutizeSegment()` returned the first segment untouched
- `getPolyPath()` drops an incomplete point pair instead of producing a segment with an `undefined` coordinate
- `getSegmentAtLength(path, Infinity)` clamps to the last segment like every other out of range distance, instead of returning the first one
- An explicit `origin: [x, y, 0]` is no longer overwritten by the instance origin — `originZ || cz` treated a zero as missing
- A non numeric transform value is ignored instead of being stored as `NaN` — `typeof Number(v) === "number"` is true for every value

### Performance

- `getPropertiesAtLength()` no longer measures the path O(n²) times — it truncated the path and called `getTotalLength()` on the truncated copy once per segment; it now reads the shared measure table and picks the segment with one scan: **16.7x** faster at 200 segments and **514x** at 4 000 (1 105 ms -> 2.15 ms)
- `getPropertiesAtPoint()` and `getPointAtLength()` are served from a length table — every sample of the closest point search walked the whole path from the start, so the search was quadratic: **21.5x** faster at 50 segments and **489x** at 1 600 (615 ms -> 1.26 ms)
- `getPropertiesAtPoint()` no longer normalizes the path again for every sample of its search — **2.7x - 3.1x** faster
- `getRotatedPath()` no longer materialises a copy of the path for every possible start segment — at 4 000 segments the search needed 145 MB of heap for the copies alone and 933 ms; it now needs 2 MB and 3 ms
- `getDrawDirection()` converts the path to a curve once instead of twice — **1.78x** faster on a 6 000 segment path (12.80 ms -> 7.19 ms)
- The parser no longer builds a 25 element array for every character it reads — **5.47x** faster (20.55 ms -> 3.75 ms per 1 000 000 calls)

### Changed

- The `mode` option of `equalizeSegments()` accepts `"line"` — the option was documented but not implemented: a `"line"` mode fell through to the curve branch, so the result of the equalization always held cubic segments
- The frame of `getPropertiesAtLength()` shares one `t` ratio between the point and the tangent — the point and the frame are computed from the very same spot on the curve, which is **1.9x - 3.7x** faster than looking both up separately
- The Douglas-Peucker simplification splits a range at its worst point _and_ in its middle when the worst point sits at the edge of the range — a split at the edge alone makes the recursion as deep as the range is long, which was quadratic on a path that alternates between two sides of a line: a 4 000 curve path went from **1 090 ms** to **17 ms**, and the result keeps the same shape within the tolerance
- `getTotalLength()` and `getPathSplits()` now share one length measurement pass — `measureSegments()` yields the length of every segment together with the length accumulated before it, so the two can no longer disagree and `getPathSplits()` no longer computes every segment length twice; the pass handles every command the way `getTotalLength()` does, where the old `getPathSplits()` measured `H`, `V` and `Z` segments as cubics and produced `NaN` for them
- `equalizeSegments("", "")` returns `[[], []]` instead of `[[], null]` — an empty path has no rotation, and the morph facade no longer reports a `null` one
- The benchmark harness (`scripts/bench.js`) measures with `performance.now()` instead of `new Date().getTime()` (1 ms resolution, on operations that take single-digit milliseconds), runs 30 times after 5 warmups and reports the **median** and the **best** of the runs in separate columns; it only rewrites the README when `--write` is passed, so `vpr bench` no longer leaves the working tree dirty
- `interHelper` imports `distanceEpsilon` directly instead of through the barrel, which removes the import cycle between the intersection engine and `src/util.ts`
- Nine `@example` blocks were corrected to match what the code returns (`getPathArea`, `getTotalLength`, `pathToCurve`, `toCurve`, `normalize`, `reversePath`, `optimizePath`, `transformPath`)
- Updated dev dependencies: `vite-plus` `1.7.0`, `vitest` / `@vitest/*` `5.1.0`, `vite` -> `@voidzero-dev/vite-plus-core` `8.3.8000`
- Rebuilt `dist` and `docs` bundles

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
