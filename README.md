# SVGPathCommander

[![Coverage Status](https://coveralls.io/repos/github/thednp/svg-path-commander/badge.svg)](https://coveralls.io/github/thednp/svg-path-commander)
[![ci](https://github.com/thednp/svg-path-commander/actions/workflows/ci.yml/badge.svg)](https://github.com/thednp/svg-path-commander/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/svg-path-commander.svg)](https://www.npmjs.com/package/svg-path-commander)
[![JSR Version](https://img.shields.io/jsr/v/@thednp/svg-path-commander.svg)](https://jsr.io/@thednp/svg-path-commander)
[![NPM Downloads](https://img.shields.io/npm/dm/svg-path-commander.svg)](http://npm-stat.com/charts.html?svg-path-commander)
[![jsDeliver](https://img.shields.io/jsdelivr/npm/hw/svg-path-commander)](https://www.jsdelivr.com/package/npm/svg-path-commander)

![image](./docs/assets/SVGPathCommander.svg)

A modern set of Typescript tools for manipulating the `d` (description) attribute for _SVGPathElement_ items. The library is implementing modern JavaScript API to produce reusable path strings with lossless quality. In addition, you also have a powerful tool to convert other SVG shapes like `<circle>` or `<rect>` to `<path>`.

While you may find familiar tools inside, this library brings _**new additions**_:

- the build in `getBBox`, `getPointAtLength` and `getTotalLength` are more reliable and much more accurate than the native methods, not to mention their high [performance](https://github.com/thednp/svg-path-commander/issues/44) ratings;
- thanks to the community contributions we've implemented useful tools like `getPropertiesAtLength`, `getSegmentOfPoint` or `isPointInStroke`;
- `getPropertiesAtLength` returns the frame of the path at a given length — the point, the unit tangent vector, the unit normal vector and the angle of the tangent in degrees;
- `simplifyPath` reduces the number of points of a path with the Douglas-Peucker algorithm, within a tolerance you choose;
- `resamplePath` spreads the points of a path evenly over its length, so the distance between two points is the same over the whole path, and the corners of the path are kept;
- `equalize` brings two paths to the same shape, so they can be morphed into each other;
- a tool that can _reverse path draw direction_ without altering path commands, even with specific shorthand path commands;
- a unique tool that can _reverse path draw direction_ for path strings with only 'C' path commands;
- a new and unique tool to _apply transform functions to path commands_ via the modern _DOMMatrix_ API;
- the geometry queries read a shared length table, so `getPropertiesAtLength`, `getPointAtLength` and the closest point search are linear in the number of segments instead of quadratic — a 4 000 segment path answers a length query in about 2 ms;
- the tools are split over three tree-shakeable entry points — the main one holds everything, `svg-path-commander/util` holds the tools, `svg-path-commander/morph` holds the morphing engine and `svg-path-commander/intersect` holds the intersection engine;
- every tool has a defined answer for an empty or malformed path, and none of them touches the data you hand them.

**The key differences with other libraries**:

- Typescript sourced with modernized codebase, all inherited codebase has been modernized as well;
- along with the modern codebase, the library also comes with strong TypeScript definitions;
- this library can create 3D to 2D projections, making your SVGs look like 3D but in the SVG coordinate system;
- you can use this library in both web apps and Node.js, you are not restricted to a single environment;
- path command transformations are all consistent with the SVG coordinates system, where others compute transform origin only for rotation transformation.

**SVGPathCommander** can use the [DOMMatrix API](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix) for _SVGPathElement_ path command transformation and implements a very fast and modernized [DOMMatrix shim](https://github.com/thednp/dommatrix).
There are a couple of good reasons for this implementation:

- _WebKitCSSMatrix_ and _SVGMatrix_ APIs are slowly pushed away by DOMMatrix, the green light for new and modern implementations;
- we can actually apply a [3D transformation](https://github.com/ndebeiss/svg3d) matrix to SVG path commands, by calculating a 2D projection of the actual shape in 3D coordinates;
- when most tools available will be rendered absolete, we are ready for new challenges.

This library is available on [CDN](https://www.jsdelivr.com/package/npm/svg-path-commander), [npm](https://www.npmjs.com/package/svg-path-commander) and [JSR](https://jsr.io/@thednp/svg-path-commander).

<!-- BENCH:start -->

# Performance

A comparison of **SVGPathCommander** with the [SvgPath](https://github.com/fontello/svgpath) library v2.6.0 and its [svg-path-bbox](https://github.com/fontello/svg-path-bbox) helper v2.1.0, run with `vpr bench` against a sample path with `11650` path segments. All values are in **milliseconds**, reported as the **median** and the **best** of 30 runs after 5 warmups; lower is better. The `vs svgpath` column is the median ratio of SVGPathCommander to svgpath.

`transform2d` uses `{ scale: 0.8 }`, `transform3d` uses `{ rotate: [15, 15, 30] }`. [SvgPath](https://github.com/fontello/svgpath) only supports 2D transforms, so `transform3d` is marked `n/a` for it.

## Static methods

| Operation   | SVGPathCommander median | SVGPathCommander best | svgpath median | svgpath best | vs svgpath |
| ----------- | ----------------------- | --------------------- | -------------- | ------------ | ---------- |
| parse       | **6.1**                 | 5.9                   | 9.2            | 8.9          | **0.7x**   |
| bbox        | **4.7**                 | 4.5                   | 6              | 5.7          | **0.8x**   |
| transform2d | **1.2**                 | 1.1                   | 1.2            | 1.1          | **1x**     |
| transform3d | **12.8**                | 11.3                  | n/a            | n/a          | n/a        |
| string      | **3.1**                 | 3                     | 3.5            | 3.3          | **0.9x**   |

## Instance methods

| Operation   | SVGPathCommander median | SVGPathCommander best | svgpath median | svgpath best | vs svgpath |
| ----------- | ----------------------- | --------------------- | -------------- | ------------ | ---------- |
| parse       | **6**                   | 5.9                   | 9.2            | 8.9          | **0.6x**   |
| bbox        | **4.4**                 | 4.2                   | 6              | 5.7          | **0.7x**   |
| transform2d | **0.7**                 | 0.6                   | 1.2            | 1.1          | **0.6x**   |
| transform3d | **7.6**                 | 6.8                   | n/a            | n/a          | n/a        |
| string      | **1.3**                 | 1.2                   | 3.5            | 3.3          | **0.4x**   |

Last benchmark run on `2026-11-20`. Generated by [`scripts/bench.js`](scripts/bench.js); update with `vpr bench --write`.

<!-- BENCH:end -->

# Install

```sh
npm install svg-path-commander
# or pnpm add svg-path-commander
# or bun add svg-path-commander
# or deno add npm:svg-path-commander
# or deno add jsr:@thednp/svg-path-commander
# or npx jsr add @thednp/svg-path-commander
```

In a Deno project, install from [JSR](https://jsr.io/@thednp/svg-path-commander) and import the raw TypeScript source directly:

```ts
import SVGPathCommander from "jsr:@thednp/svg-path-commander";
```

# Entry Points

The library ships four entry points, so a bundle only carries the tools it uses:

| Entry point                    | Holds                                                                                                                 |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `svg-path-commander`           | everything — the `SVGPathCommander` class and its static methods                                                      |
| `svg-path-commander/util`      | the tools, without the class — the tree-shakeable entry point                                                         |
| `svg-path-commander/morph`     | the morphing engine — `equalize`, `equalizePaths`, `equalizeSegments`, `resamplePath`, `fixPath`, `splitCubicSegment` |
| `svg-path-commander/intersect` | the intersection engine — `pathsIntersection`, `boundingBoxIntersect`, `isPointInsideBBox`                            |

```ts
import SVGPathCommander from "svg-path-commander";
import { getPathBBox, pathToCurve } from "svg-path-commander/util";
import { equalize } from "svg-path-commander/morph";
import { pathsIntersection } from "svg-path-commander/intersect";
```

The JSR package has the same subpaths: `jsr:@thednp/svg-path-commander/morph`.

# CDN

Version 2.2.0+

```html
<script src="https://cdn.jsdelivr.net/npm/svg-path-commander/dist/index.min.js">
```

Versions before 2.2.0

```html
<script src="https://cdn.jsdelivr.net/npm/svg-path-commander/dist/svg-path-commander.js">
```

# Quick Guide

Flip a path on the X axis:

```js
import SVGPathCommander from "svg-path-commander";

const path = "M0 0L100 0L50 100";

const flippedPathString = new SVGPathCommander(path).flipX().toString();
// result => 'M100 0H0L50 100'
```

Optimize a path string by using the `round` option, to round numbers to 2 decimals and finding shorthand where possible:

```js
const optimizedPathString = new SVGPathCommander(path, { round: 2 }).optimize().toString();
```

Or why not apply a **2D transformation** and even a **3D transformation**:

```js
// a transform object
const transform = {
  translate: 15, // X axis translation
  rotate: 15, // Z axis rotation
  scale: 0.75, // uniform scale on X, Y, Z axis
  skew: 15, // skew 15deg on the X axis
  origin: [15, 0], // if not specified, it will use the default origin value [0, 0]
};
const transformed2DPathString = new SVGPathCommander(path).transform(transform).toString();

// apply a 3D transformation
const transform = {
  translate: [15, 15, 15], // `[15, 15]` would apply a 2D translation, and only `15` for X axis translation
  rotate: [15, 15, 15], // or only "15" for 2D rotation on Z axis
  scale: [0.7, 0.75, 0.8], // or only "0.7" for 2D scale on all X, Y, Z axis
  skew: [15, 15], // or only "15" for the X axis
  origin: [15, 15, 15], // full `transform-origin` for a typical 3D transformation
};
const transformed3DPathString = new SVGPathCommander(path).transform(transform).toString();
```

Access the `bbox` instance property to apply a consistent `transform-origin`:

```js
// apply a 3D transformation with a consistent origin
const transformed3DPath = new SVGPathCommander(path);
const { cx, cy, cz } = transformed3DPath.bbox;
const transform = {
  translate: [15, 15, 15], // `[15, 15]` would apply a 2D translation, and only `15` for X axis translation
  rotate: [15, 15, 15], // or only "15" for 2D rotation on Z axis
  scale: [0.7, 0.75, 0.8], // or only "0.7" for 2D scale on all X, Y, Z axis
  skew: [15, 15], // or only "15" for the X axis
  origin: [cx, cy, cz], // the origin
};
const transformed3DPathString = transformed3DPath.transform(transform).toString();
```

SVGPathCommander comes with a full range of additional static methods, here's how to normalize a path:

```js
const path = "M0 0 H50";

const normalizedPath = SVGPathCommander.normalizePath(path);
// result => [['M', 0, 0], ['L', 50, 0]]
```

Reverse a path:

```js
const path = SVGPathCommander.parsePathString("M0 0 H50");

const reversedPath = SVGPathCommander.reversePath(path);
// result => [['M', 50, 0], ['H', 0]]
```

Export to string:

```js
const myPathString = SVGPathCommander.pathToString([
  ["M", 0, 0],
  ["L", 50, 0],
]);
// result => 'M0 0L50 0'
```

Check a path string validity:

```js
SVGPathCommander.isValidPath(path);
// result => boolean
```

Check if path is a certain kind of `PathArray`:

```js
SVGPathCommander.isAbsoluteArray([
  ["M", 0, 0],
  ["L", 50, 0],
]);
// result => true
```

Use treeshake and create a custom function to apply a 3D transformation using static methods:

```ts
import { parsePathString, getPathBBox, transformPath, pathToString } from "svg-path-commander";

function myTransformFn(pathInput: string | PathArray, transformObject: TransformObject) {
  const path = parsePathString(pathInput);
  const { cx, cy, cz } = getPathBBox(path);

  return pathToString(
    transformPath(path, {
      ...transformObject,
      origin: [cx, cy, cz],
    }),
  );
}
```

In extreme cases where performance is paramount, you can consider the parent SVG `viewBox` attribute to extract a bounding box required for a consistent transform origin.

```ts
// const svgViewBox = document.getElementById('my-svg').getAttribute('viewBox');
const viewBox = "0 0 24 24";

const [x, y, width, height] = viewBox.split(/\s/).map(Number);
const origin = [
  x + width / 2, // CX
  y + height / 2, // CY
  Math.max(width, height) + Math.min(width, height) / 2, // CZ
];

// use this origin for your shape transformation
const myNewString = new SVGPathCommander("M0 0 H50")
  .transform({ rotate: [35, 0, 0], origin })
  .toString();
```

Convert a shape to `<path>` and transfer all non-specific attributes

```js
const myCircle = document.getElementById("myCircle");
SVGPathCommander.shapeToPath(myCircle, true);
```

Alternatively you can create `<path>` from specific attributes:

```js
const myRectAttr = {
  type: "rect",
  x: 25,
  y: 25,
  width: 50,
  height: 50,
  rx: 5,
};

const myRectPath = SVGPathCommander.shapeToPath(myRectAttr);
document.getElementById("mySVG").append(myRectPath);
```

Server-side using `jsdom`:

```js
const { document } = new JSDOM(
  `<html>
  <head></head>
  <body>
    <svg id="mySVG" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect id="myRect" x="0" width="100" height="100" rx="15" />
    </svg>
  </body>
</html>`,
  {
    pretendToBeVisual: true,
  },
).window;

const myRect = document.getElementById("myRect");
SVGPathCommander.shapeToPath(myRect, true, document);
```

Get the path length:

```js
const myPathLength = SVGPathCommander.getTotalLength("M0 0L50 0L25 50z");
// result => 161.80339887498948
```

Get a point along the path:

```js
const myPoint = SVGPathCommander.getPointAtLength("M0 0L50 0L25 50z", 85);
// result => {x: 34.34752415750147, y: 31.304951684997057}
```

Get the frame of the path at a given length — the point, the unit tangent vector, the unit
normal vector and the angle of the tangent in degrees:

```js
const myFrame = SVGPathCommander.getPropertiesAtLength("M0 0L50 0L25 50z", 85);
// result => { segment: ["L", 25, 50], index: 2, length: 55.90169943749474, lengthAtSegment: 50,
//             point: {x: 34.34752415750147, y: 31.304951684997057},
//             tangent: {x: -0.4472135954999579, y: 0.8944271909999159},
//             normal: {x: -0.8944271909999159, y: -0.4472135954999579},
//             angle: 116.56505117707799 }
```

Get the path bounding box:

```js
const myPathBBox = SVGPathCommander.getPathBBox("M0 0L50 0L25 50z");
// result => {width: 50, height: 50, x: 0, y: 0, x2: 50, y2: 50, cx: 25, cy: 25, cz: 75}
```

Simplify the path, within a tolerance:

```js
const mySimplifiedPath = SVGPathCommander.simplifyPath("M0 0L10 0L20 0L30 0", 1);
// result => [["M", 0, 0], ["L", 30, 0]]
```

Resample the path to a given number of points, spread evenly over its length:

```js
const myResampledPath = SVGPathCommander.resamplePath("M0 0L100 0L100 100", 3);
// result => [["M", 0, 0], ["L", 100, 0], ["L", 100, 100]]
```

Find intersection points between two paths:

```js
const count = SVGPathCommander.pathsIntersection(
  "M0 50C0 0,100 0,100 50",
  "M50 0C100 0,100 100,50 100",
  true,
);
// result => 1

const points = SVGPathCommander.pathsIntersection(
  "M0 50C0 0,100 0,100 50",
  "M50 0C100 0,100 100,50 100",
  false,
);
// result => [{ x: 80.41363825007447, y: 19.586361749925548, t1: 0.7262151274035185, t2: 0.27378487259648177 }]
```

Equalize two paths for morphing (single subpath):

```js
const [eq1, eq2] = SVGPathCommander.equalizeSegments(
  "M0 0L100 0L50 100Z",
  "M0 0L100 0L100 100L0 100Z",
);
// eq1.length === eq2.length — ready for morphing
```

Equalize two paths for morphing (single or multi subpath):

```js
const [eq1, eq2] = SVGPathCommander.equalizePaths(
  "M0 0L100 0L50 100Z",
  "M0 0L100 0L100 100L0 100Z",
  { close: true },
);
// Both paths now have the same number of segments
```

Equalize two paths for morphing — the recommended entry point, it picks the right
strategy for the paths, aligns their points and normalizes their winding:

```js
const [eq1, eq2] = SVGPathCommander.equalize("M0 0L100 0L50 100Z", "M0 0L100 0L100 100L0 100Z", {
  strategy: "arcLength",
});
// eq1.length === eq2.length — ready for morphing
```

The `strategy` option decides how the points of the paths are placed: `segment`
(the default) splits the segments of the paths, so the points of the result are
the points of the paths, while `arcLength` spreads the points of the result
evenly over the length of the paths and keeps their corners:

```js
const [eq1, eq2] = SVGPathCommander.equalize("M0 0C50 100 100 100 150 0", "M0 0L150 0L150 100Z", {
  strategy: "arcLength",
  points: 8,
  mode: "curve",
});
// eq1.length === eq2.length === 8 — ready for morphing
```

# WIKI

For developer guidelines, and a complete list of static methods, head over to the [`wiki/`](wiki/) folder in this repository.

# What Is It For?

- converting and optimizing _SVGPathElement_ for use in third party application; our [KUTE.js](https://github.com/thednp/kute.js) animation engine is using it to process _SVGPathElement_ coordinates for [SVG morphing](https://thednp.github.io/kute.js/svgMorph.html) and [SVG cubic morphing](https://thednp.github.io/kute.js/svgCubicMorph.html);
- animators that work with SVGs and need tools for performing specific path command processing;
- front-end developers looking to spice up the content by combining, splitting or transforming paths;
- font-icon creators can use it in both Node.js and web applications to process, optimize and test their creations.

# Technical Considerations

- the `optimize()` instance method will not merge path segments (for instance two or more cubic-bezier segments into one or more arc segments); however, the script will try to provide shorthand notations where possible, pick the shortest string for each segment, and generally try to deliver the best possible outcome;
- all tools processing path segments will never round float values, however `pathToString`, `optimizePath` and especially `roundPath` will always round values to the default of 4 decimals; EG: 0.56676 => 0.567, 0.50 => 0.5; you can change the default option with `SVGPathCommander.options.round = 2` or remove the value rounding all together with `SVGPathCommander.options.round = false`; you can also control this feature via instance options;
- the `getSVGMatrix` utility we developed will always compute the matrix by applying the transform functions in the following order: `translate`, `rotate`, `skew` and `scale`, which is the default composition/recomposition order specified in the W3C draft;
- all 3d transformations as well as skews will convert `A` (arc) path commands to `C` (cubic bezier) due to the lack of resources;
- while converting `A` segments to `C` segments is the shipped behavior, a validated arc-preserving alternative exists: an affine-transformed elliptical arc is still an exact elliptical arc, so `A` segments can be transformed directly via the singular value decomposition of the transformed ellipse shape matrix (radii and rotation from the eigenvalues/eigenvectors of the Gram matrix, sweep flag flipped for negative-determinant matrices). This works for any 2D matrix, and even for 3D matrices whenever the projection is orthographic (default `origin: [0,0,0]` — the `z = 0` plane is untouched by the matrix's z rows/columns, so only the 2x2 submatrix matters); the conversion to `C` is only mathematically required for perspective projections (non-zero `origin` z value or a matrix with perspective), where the arc image is a general conic. See `experiments/transformArc-tested.ts` for the implementation and rationale;
- most tools included with **SVGPathCommander** should work in your Node.js apps, but feel free to report any issue;
- other path commands like `R` (catmulRomBezier), `O`, `U` (ellipse and shorthand ellipse) are not present in the current draft and are not supported;
- normalization can mean many things to many people and our library is developed to convert path command values to absolute and shorthand to longhand commands to provide a solid foundation for the main processing tools of our library;
- when compared to the native methods like `SVGPathElement.getTotalLength()` or `SVGPathElement.getPointAtLength()`, the output of our static methods is within a [0.002 - 0.05] margin delta, but from our experience it's proven to be a more consistent outcome.

# Special Thanks

- Dmitry Baranovskiy for his [Raphael.js](https://dmitrybaranovskiy.github.io/raphael/)
- Vitaly Puzrin & Alex Kocharin for their [SvgPath](https://github.com/fontello/svgpath)
- Jürg Lehni & Jonathan Puckey for their [Paper.js](https://github.com/paperjs/paper.js/)
- Andrew Willems for his [awesome guide](https://stackoverflow.com/users/5218951/andrew-willems)
- Mike 'Pomax' Kamermans for his awesome [svg-path-reverse](https://github.com/Pomax/svg-path-reverse), [bezierjs](https://github.com/Pomax/bezierjs) and [bezierinfo](https://pomax.github.io/bezierinfo/)
- Nicolas Debeissat for the inspiration on [svg3d](https://github.com/ndebeiss/svg3d)
- Mike Bostock for his awesome [closestPoint](https://bl.ocks.org/mbostock/8027637)
- James Halliday for his excelent [point-at-length](https://github.com/substack/point-at-length)
- Eric Eastwood for his excelent [svg-curve-lib](https://github.com/MadLittleMods/svg-curve-lib)
- PhET Interactive Simulations for their [kite](https://github.com/phetsims/kite)
- [herrstrietzel](https://github.com/herrstrietzel) for his awesome [svg-pathdata-getbbox](https://github.com/herrstrietzel/svg-pathdata-getbbox)
- a special thanks goes to [@vltansky](https://github.com/vltansky) for fixing tree-shaking in **SVGPathCommander**!

# License

**SVGPathCommander** is released under [MIT Licence](LICENSE).
