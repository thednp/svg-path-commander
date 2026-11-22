# AGENTS.md — SVGPathCommander

## Project Overview

SVGPathCommander v2.4.0 — TypeScript library for manipulating SVG `<path>` `d` attributes. Works in browser and Node.js.

## Commands

```bash
vp install                      # Install dependencies
vpr dev                         # Serve docs on localhost:3000
vpr test                        # Run all tests (Vitest + Istanbul coverage)
vpr test:ui                     # Run tests with UI and --watch option
vpr test:watch                  # Run tests with --watch option
vpr test -- class.test.ts       # Run a single test file
vpr test -- -t "Test name"      # Run a single test by name
vpr bench                       # Benchmark vs svgpath (prints the table; --write updates the README)
vpr lint                        # oxlint src + tsc --noEmit
vpr lint:ts                     # oxlint src
vpr fix:ts                      # oxlint src --fix
vpr format                      # oxfmt src
vpr build                       # Build with tsdown (vp pack) + copy the bundle to docs/
vpr check:ts                    # tsc --noEmit (type check only)
```

Always run `vpr lint` and `vpr test` after making changes.

The benchmark harness measures with `performance.now()` and reports the median and the best of 30
runs; it only rewrites the README when `--write` is passed, so a plain `vpr bench` leaves the
working tree clean.

Deno equivalents (via `deno.json`):

```bash
deno task test       # vitest run
deno task lint       # deno lint src
deno task check      # deno check src (no --sloppy-imports needed)
deno task format     # deno fmt src
deno publish --dry-run --allow-dirty   # JSR dry run
```

## CI Workflows

The GitHub Actions workflows are driven by Vite+; they use the `voidzero-dev/setup-vp` action (pinned to the exact release that ships with the pinned Vite+ version — never the frozen `v1` tag), which installs the `vp`/`vpr`/`vpx` binaries, the Node.js runtime, the package manager and the dependency cache.

- `.github/workflows/ci.yml` — runs on pushes and pull requests; `vpr lint`, `vpr build` and `vpr test` (with `vp exec playwright install` for the browsers), then uploads the coverage report to Coveralls.
- `.github/workflows/publish.yml` — runs on a published GitHub Release; sets up Deno as well, then publishes to npm with `vp pm publish` (provenance, `--ignore-scripts` so the release is built from the committed sources instead of the `prepublishOnly` dependency bump) and to JSR with `deno publish --allow-dirty` (the build step regenerates the committed `dist/` and `docs/` artifacts).
- `.github/workflows/codeql.yml` — CodeQL analysis; the build step uses `vpr build` so the job has the same toolchain as the other workflows.

Keep the `paths` filters of all three workflows in sync when adding a file that affects the build, the tests or the toolchain.

## Tech Stack

- **Language:** TypeScript (strict, ES2020 target, `allowImportingTsExtensions`)
- **Package manager:** vite-plus aka vp — dependencies are pinned through the `catalog:` in `pnpm-workspace.yaml`
- **Build:** tsdown via `vp pack` (ESM + UMD outputs), wired through `vite.config.ts`
- **Test:** Vitest 5 in **browser mode** (Playwright + Chromium, headless) + Istanbul coverage (`test/class.test.ts`, `test/static.test.ts`)
- **Lint/Format:** Vite+ (oxlint / oxfmt via `vp lint src` and `vp fmt src`) — not Deno; `deno lint` / `deno fmt` still gate the JSR publish
- **JSR:** `deno.json` publishes as `@thednp/svg-path-commander` — `deno check src`, `deno lint src` and `deno publish --dry-run --allow-dirty` must all pass
- **Dependency:** `@thednp/dommatrix` `^3.1.4` (DOMMatrix shim)

## Source Structure (`src/`)

| Directory      | Purpose                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| `index.ts`     | Main entry — exports SVGPathCommander class + all types                 |
| `main.ts`      | SVGPathCommander class (core, chainable instance methods)               |
| `types.ts`     | TypeScript type definitions (PathCommand, PathSegment, PathArray, etc.) |
| `interface.ts` | Interfaces (Options, TransformObject, PathBBox, shape attrs)            |
| `util.ts`      | Re-export of every standalone tool (tree-shakeable entry)               |
| `morph.ts`     | Internal barrel for the morphing tools                                  |
| `intersect.ts` | Internal barrel for the intersection tools                              |
| `convert/`     | Path format conversion (absolute, relative, curve, string)              |
| `parser/`      | SVG path string tokenizer/scanner                                       |
| `process/`     | Manipulation algorithms (normalize, optimize, reverse, transform, etc.) |
| `math/`        | Low-level math (bezier, cubic, quad, line, arc, polygon tools)          |
| `morph/`       | Path morphing (equalize, split, sample, classify, match)                |
| `util/`        | Query helpers (bbox, length, point-at-length, intersection, etc.)       |
| `options/`     | Default configuration                                                   |

The library ships two entry points:

| Entry point               | Source         | Holds                                           |
| ------------------------- | -------------- | ----------------------------------------------- |
| `svg-path-commander`      | `src/index.ts` | the class, its static methods and all the types |
| `svg-path-commander/util` | `src/util.ts`  | every standalone tool                           |

The utility entry includes the morphing and intersection tools through the internal `src/morph.ts` and
`src/intersect.ts` barrels. The class holds every engine as a static field (`static equalize = equalize;`),
so the main entry always includes those implementations. A bundler drops the unused standalone exports
from the utility entry. The package and JSR exports maps must expose the same two entry points.

The Douglas-Peucker simplification lives in `process/` and is built from four modules:

| Module                      | Purpose                                                              |
| --------------------------- | -------------------------------------------------------------------- |
| `process/simplifyPath.ts`   | The public API — normalizes, splits and rebuilds the simplified path |
| `process/samplePath.ts`     | Samples a normalized path along its own parameterization             |
| `process/douglasPeucker.ts` | The Douglas-Peucker core — the indexes of the points to keep         |
| `process/splitSubPaths.ts`  | Splits an already normalized path into its sub-paths                 |

Only `simplifyPath` is public — it is re-exported from `src/util.ts`. The internal
`splitSubPaths` helper is shared with the resampler: it operates on an already normalized path and
does not parse or absolutize it again. It is distinct from the public `splitPath`, whose contract is
to parse a path of any command form and return absolute path arrays.

The path offsetting lives in `process/` and is built from three modules:

| Module                   | Purpose                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `process/offsetPath.ts`  | The public API — measures the path, offsets it and assembles the result |
| `process/offsetNodes.ts` | Samples the segments of a sub-path into points with their tangent       |
| `process/offsetJoin.ts`  | The join and the cap geometry — the miter, the bevel and the round arc  |

Only `offsetPath` is public — it is re-exported from `src/util.ts`. The offset reuses the frame of
`util/segmentFrame.ts`, so the normal of a sample is the normal `getPropertiesAtLength()` returns.
The offset is not cleaned up: an offset distance larger than the local radius of curvature produces
a self-crossing curve, and the removal of the self-intersections needs a polygon clipping pass.

The hit test of a filled shape lives in `util/` and is built from three modules:

| Module                   | Purpose                                                                       |
| ------------------------ | ----------------------------------------------------------------------------- |
| `util/isPointInPath.ts`  | The public API — validates the options, flattens the path and tests the point |
| `process/flattenPath.ts` | Flattens a curve path into one polygon per sub-path, within a tolerance       |
| `math/pointInPolygon.ts` | The crossings, the winding number and the boundary test of a polygon          |

Only `isPointInPath` is public — it is re-exported from `src/util.ts`. The `nonzero` and the
`evenodd` fill rules of the SVG `fill-rule` attribute are both supported, and a point on the
boundary of a shape is inside of it, the way the browser answers it with `isPointInFill()`. The
answer is checked against the browser in `test/static.test.ts`, with a fixed set of points and
with a seeded sweep of the points, so the two answers cannot drift apart.

The morphing toolkit lives in `morph/` and is built from four modules:

| Module                      | Purpose                                                                      |
| --------------------------- | ---------------------------------------------------------------------------- |
| `morph/equalize.ts`         | The public facade — routes single and multi sub-path pairs to the right tool |
| `morph/equalizePaths.ts`    | Splits the paths into sub-paths, matches them and equalizes every pair       |
| `morph/equalizeSegments.ts` | Equalizes a single sub-path pair, with the `segment` or `arcLength` strategy |
| `morph/resamplePath.ts`     | Resamples every sub-path to a given number of points, spread over its length |

`equalize` and `resamplePath` are public — they are re-exported through `src/morph.ts` and
`src/util.ts`, next to the `equalizeSegments` and `equalizePaths` they build on. The public resampler
uses the shared `splitSubPaths` helper: every sub-path is resampled on its own, `count` is the number
of points of each sub-path, and the result never connects two sub-paths. The public result type is
`PathArray`, because a multi-subpath result holds more than one `M` command.

Two modules in `util/` are the backbone of the length machinery and are shared by every query:

| Module                    | Purpose                                                                      |
| ------------------------- | ---------------------------------------------------------------------------- |
| `util/measureSegments.ts` | One pass that measures every segment and the length accumulated before it    |
| `util/pathLengthTable.ts` | The measured path as a searchable table (lengths + start points + endpoints) |

A third one answers the frame of the path at a given length:

| Module                 | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `util/segmentFrame.ts` | The point, the unit tangent, the unit normal and the angle of a segment |

All three are internal — they are not re-exported from `src/util.ts`, and a new public export has
to be added to `src/util.ts` **and** to the `exports` map in `deno.json` (the JSR package has its
own map).

## Code Conventions

### Imports

- Use `.ts` extension on all imports: `import { foo } from "./bar.ts"`
- Path alias `~/*` maps to `src/` (e.g., `import SVGPathCommander from '~/index'`)
- Group imports: external libs → internal modules → types
- Use `import type` for type-only imports

### Formatting & Linting

- **No comments** unless explicitly asked
- Run `vpr format` then `vpr lint:ts` before committing
- Vite+ formatter and linter enforced (`vp fmt`, `vp lint`); `deno fmt` / `deno lint` still gate the JSR publish

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

### Empty and Malformed Input

The contract is fixed — do not change it without a changelog entry:

| Input                               | Answer                                                    |
| ----------------------------------- | --------------------------------------------------------- |
| empty path                          | zeroed bbox / `{x:0,y:0}` / `false` / `undefined` segment |
| empty path, `getPropertiesAtLength` | a synthetic `["M", 0, 0]` segment, `index: 0`             |
| empty path, `getPropertiesAtPoint`  | `{ closest: {x:0,y:0}, distance: Infinity }`              |
| negative distance                   | the same early return as a distance of `0`                |
| malformed segment (`[[]]`)          | `TypeError: invalid path segment at index N`              |
| a path that does not begin with `M` | `TypeError: path data must begin with a moveto command`   |

A leading relative moveto is the one exception to the last row — it is a pair of absolute
coordinates, so the parser rewrites it as an absolute one.

Static methods never modify the data they are given — `roundPath`, `matchPaths` and `transformPath`
all work on copies, and the transform origin is copied before it is written to.

### Class Design

- Instance methods are chainable — always `return this`
- Expose functionality as both instance methods and static methods
- Use getters for computed properties (`get bbox()`, `get length()`)
- Instance options validated in constructor with fallback to `defaultOptions`

### Testing

- Tests run with Vitest + Istanbul coverage via `vpr test`
- Test files: `test/class.test.ts` (instance API), `test/static.test.ts` (static methods),
  `test/getPropertiesAtLength.parity.test.ts` (the parity of the length lookup)
- Fixtures in `test/fixtures/`
- Use `expect().to.deep.equal()` for object comparison, `expect().to.equal()` for primitives
- Coverage provider: Istanbul — the suite has to stay at 100 %

## Build Outputs

| File                | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `dist/index.min.js` | UMD bundle (minified, browser-ready, includes dommatrix) |
| `dist/index.js`     | ESM bundle (tree-shakeable, neutral platform)            |
| `dist/util.js`      | Every standalone tool (tree-shakeable)                   |
| `dist/index.d.ts`   | Type declarations                                        |

The main and utility entry points are built on their own, so a bundle never depends on a chunk of
another one.

## Releases

- The version lives in `package.json` and is mirrored into `deno.json` — `node scripts/update-deno.js`
  syncs it (the script rewrites `deno.json` with `JSON.stringify`, so run `deno fmt deno.json` after
  it to keep the formatting).
- Every release needs a `CHANGELOG.md` entry; the entry lists the _behaviour_, not the commits.
- `dist/` and `docs/` are committed build artifacts — rebuild them (`vpr build`) with the release
  commit, never separately.
- Publishing happens from the GitHub Release workflow (`publish.yml`); the npm publish runs with
  `--ignore-scripts` so the committed sources are what ships, and the JSR publish runs
  `deno publish --allow-dirty` against the same sources.
- `prepublishOnly` (`vp up --latest && vpr up:deno && ...`) is a **dependency bump**, not a release
  step — it moves the Vitest pins off the version Vite+ bundles. Keep the `catalog:` pins aligned
  with `vp toolchain vitest` instead.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

## Workflow notes

- **Harness folders**: dev repro/harness scaffolding (debugging the Vite plugin,
  a compiler, or the browser) goes in `TMP/`; fixtures imported by vitest suites
  go in `test/fixtures/` — **never** in the root or in OS temp dirs. Root-level
  harness files break `tsdown`/`vitest` path resolution, and temp dirs outside
  the project get swept by OS cleaners and leave stale `node_modules`/`.vite`
  state that corrupts the next run. (`test/fixtures/` is covered by
  `vp lint` + `tsc` like the rest of `test/` — keep fixtures valid;
  intentionally-broken inputs don't belong there.)
- **Never delete files**: do not `rm` source/test files. If a file must be
  removed from the tree, **rename it to `<name>-bak.<ext>`** (e.g. `foo.ts` →
  `foo-bak.ts`) and leave it in place. The `-bak` suffix is the only sanctioned
  way to retire a file; the repo may be scanned for history or references later.
