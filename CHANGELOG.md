# Changelog

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
