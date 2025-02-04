# SVGPathCommander
[![Coverage Status](https://coveralls.io/repos/github/thednp/svg-path-commander/badge.svg)](https://coveralls.io/github/thednp/svg-path-commander)
[![ci](https://github.com/thednp/svg-path-commander/actions/workflows/ci.yml/badge.svg)](https://github.com/thednp/svg-path-commander/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/svg-path-commander.svg)](https://www.npmjs.com/package/svg-path-commander)
[![NPM Downloads](https://img.shields.io/npm/dm/svg-path-commander.svg)](http://npm-stat.com/charts.html?svg-path-commander)
[![jsDeliver](https://img.shields.io/jsdelivr/npm/hw/svg-path-commander)](https://www.jsdelivr.com/package/npm/svg-path-commander)
[![typescript version](https://img.shields.io/badge/typescript-5.7.3-brightgreen)](https://www.typescriptlang.org/)
[![vitest version](https://img.shields.io/badge/vitest-3.0.5-brightgreen)](https://vitest.dev/)
[![vite version](https://img.shields.io/badge/vite-6.0.11-brightgreen)](https://vitejs.dev/)

![image](./docs/assets/SVGPathCommander.svg)

A modern set of Typescript tools for manipulating the `d` (description) attribute for *SVGPathElement* items. The library is implementing modern JavaScript API to produce reusable path strings with lossless quality. In addition, you also have a powerful tool to convert other SVG shapes like `<circle>` or `<rect>` to `<path>`.


While you may find familiar tools inside, this library brings ***new additions***:
* the build in `getBBox`, `getPointAtLength` and `getTotalLength` are more reliable and much more accurate than the native methods, not to mention their high [performance](https://github.com/thednp/svg-path-commander/issues/44) ratings;
* thanks to the community contributions we've implemented useful tools like `getPropertiesAtLength`, `getSegmentOfPoint` or `isPointInStroke`;
* a tool that can *reverse path draw direction* without altering path commands, even with specific shorthand path commands;
* a unique tool that can *reverse path draw direction* for path strings with only 'C' path commands;
* a new and unique tool to *apply transform functions to path commands* via the modern *DOMMatrix* API.

**The key differences with other libraries**:
* Typescript sourced with modernized codebase, all inherited codebase has been modernized as well;
* along with the modern codebase, the library also comes with strong TypeScript definitions;
* this library can create 3D to 2D projections, making your SVGs look like 3D but in the SVG coordinate system;
* you can use this library in both web apps and Node.js, you are not restricted to a single environment;
* path command transformations are all consistent with the SVG coordinates system, where others compute transform origin only for rotation transformation.

**SVGPathCommander** can use the [DOMMatrix API](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix) for *SVGPathElement* path command transformation and implements a very fast and modernized [DOMMatrix shim](https://github.com/thednp/dommatrix).
There are a couple of good reasons for this implementation:
* *WebKitCSSMatrix* and *SVGMatrix* APIs are slowly pushed away by DOMMatrix, the green light for new and modern implementations;
* we can actually apply a [3D transformation](https://github.com/ndebeiss/svg3d) matrix to SVG path commands, by calculating a 2D projection of the actual shape in 3D coordinates;
* when most tools available will be rendered absolete, we are ready for new challenges.

This library is available on [CDN](https://www.jsdelivr.com/package/npm/svg-path-commander) and [npm](https://www.npmjs.com/package/svg-path-commander). 


# Install

```
npm install svg-path-commander
```


# CDN
```html
<script src="https://cdn.jsdelivr.net/npm/svg-path-commander/dist/svg-path-commander.js">
```

# Quick Guide

Flip a path on the X axis:
```js
import SVGPathCommander from 'svg-path-commander';

const path = 'M0 0L100 0L50 100';

const flippedPathString = new SVGPathCommander(path).flipX().toString();
// result => 'M0 100h100L50 0'
```

Optimize a path string by using the `round` option, to round numbers to 2 decimals and finding shorthand where possible:
```js
const optimizedPathString = new SVGPathCommander(path, {round: 2}).optimize().toString();
```

Or why not apply a **2D transformation** and even a **3D transformation**:
```js
// a transform object
const transform = {
  translate: 15, // X axis translation
  rotate: 15, // Z axis rotation
  scale: 0.75, // uniform scale on X, Y, Z axis
  skew: 15, // skew 15deg on the X axis
  origin: [15, 0] // if not specified, it will use the default origin value [0, 0]
}
const transformed2DPathString = new SVGPathCommander(path).transform(transform).toString();

// apply a 3D transformation
const transform = {
  translate: [15, 15, 15], // `[15, 15]` would apply a 2D translation, and only `15` for X axis translation
  rotate: [15, 15, 15], // or only "15" for 2D rotation on Z axis
  scale: [0.7, 0.75, 0.8], // or only "0.7" for 2D scale on all X, Y, Z axis
  skew: [15, 15], // or only "15" for the X axis
  origin: [15, 15, 15] // full `transform-origin` for a typical 3D transformation
}
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
  origin: [cx, cy, cz] // the origin
}
const transformed3DPathString = transformed3DPath.transform(transform).toString();
```

SVGPathCommander comes with a full range of additional static methods, here's how to normalize a path:
```js
const path = 'M0 0 H50';

const normalizedPath = SVGPathCommander.normalizePath(path);
// result => [['M', 0, 0], ['L', 50, 0]]
```

Reverse a path:
```js
const path = SVGPathCommander.parsePathString('M0 0 H50');

const reversedPath = SVGPathCommander.reversePath(path);
// result => [['M', 50, 0], ['H', 0]]
```

Export to string:
```js
const myPathString = SVGPathCommander.pathToString([['M', 0, 0], ['L', 50, 0]]);
// result => 'M0 0 L50 0'
```

Check a path string validity:
```js
SVGPathCommander.isValidPath(path);
// result => boolean
```

Check if path is a certain kind of `PathArray`:
```js
SVGPathCommander.isAbsoluteArray([['M', 0, 0], ['L', 50, 0]]);
// result => true
```

Use treeshake and create a custom function to apply a 3D transformation using static methods:
```ts
import { parsePathString, getPathBBox, transformPath, pathToString } from 'svg-path-commander/util';

function myTransformFn(pathInput: string | PathArray, transformObject: TransformObject) {
  const path = parsePathString(pathInput);
  const { cx, cy, cz } = getPathBBox(path);

  return pathToString(
    transformPath(path, {
      ...transformObject, origin: [cx, cy, cz]
    })
  )
}
```
In extreme cases where performance is paramount, you can consider the parent SVG `viewBox` attribute to extract a bounding box required for a consistent transform origin.

```ts
// const svgViewBox = document.getElementById('my-svg').getAttribute('viewBox');
const viewBox = '0 0 24 24';

const [x, y, width, height] = viewBox.split(/\s/).map(Number);
const origin = [
  x + width / 2, // CX
  y + height / 2, // CY
  Math.max(width, height) + Math.min(width, height) / 2, // CZ
];

// use this origin for your shape transformation
const myNewString = new SVGPathCommander('M0 0 H50')
  .transform({ rotate: [35, 0, 0], origin })
  .toString();
```


Convert a shape to `<path>` and transfer all non-specific attributes
```js
const myCircle = document.getElementById('myCircle');
SVGPathCommander.shapeToPath(myCircle, true);
```

Alternatively you can create `<path>` from specific attributes:
```js
const myRectAttr = {
  type: 'rect',
  x: 25,
  y: 25,
  width: 50,
  height: 50,
  rx: 5
};

const myRectPath = SVGPathCommander.shapeToPath(myRectAttr);
document.getElementById('mySVG').append(myRectPath);
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
  }
).window;

const myRect = document.getElementById('myRect');
SVGPathCommander.shapeToPath(myRect, true, document);
```

Get the path length:
```js
const myPathLength = SVGPathCommander.getTotalLength('M0 0L50 0L25 50z');
// result => 161.80339887498948
```

Get a point along the path:
```js
const myPoint = SVGPathCommander.getPointAtLength('M0 0L50 0L25 50z', 85);
// result => {x: 34.34752415750147, y: 31.304951684997057}
```

Get the path bounding box:
```js
const myPathBBox = SVGPathCommander.getPathBBox('M0 0L50 0L25 50z');
// result => {width: 50, height: 50, x: 0, y: 0, x2: 50, y2: 50, cx: 25, cy: 25, cz: 75}
```

# WIKI
For developer guidelines, and a complete list of static methods, head over to the [wiki pages](https://github.com/thednp/svg-path-commander/wiki).


# What Is It For?

* converting and optimizing *SVGPathElement* for use in third party application; our [KUTE.js](https://github.com/thednp/kute.js) animation engine is using it to process *SVGPathElement* coordinates for [SVG morphing](https://thednp.github.io/kute.js/svgMorph.html) and [SVG cubic morphing](https://thednp.github.io/kute.js/svgCubicMorph.html);
* animators that work with SVGs and need tools for performing specific path command processing;
* front-end developers looking to spice up the content by combining, splitting or transforming paths;
* font-icon creators can use it in both Node.js and web applications to process, optimize and test their creations.


# Technical Considerations

* the `optimize()` instance method will not merge path segments (for instance two or more cubic-bezier segments into one or more arc segments); however, the script will try to provide shorthand notations where possible, pick the shortest string for each segment, and generally try to deliver the best possible outcome;
* all tools processing path segments will never round float values, however `pathToString`, `optimizePath` and especially `roundPath` will always round values to the default of 4 decimals; EG: 0.56676 => 0.567, 0.50 => 0.5; you can change the default option with `SVGPathCommander.options.round = 2` or remove the value rounding all together with `SVGPathCommander.options.round = false`; you can also control this feature via instance options;
* the `getSVGMatrix` utility we developed will always compute the matrix by applying the transform functions in the following order: `translate`, `rotate`, `skew` and `scale`, which is the default composition/recomposition order specified in the W3C draft;
* all 3d transformations as well as skews will convert `A` (arc) path commands to `C` (cubic bezier) due to the lack of resources;
* most tools included with **SVGPathCommander** should work in your Node.js apps, but feel free to report any issue;
* other path commands like `R` (catmulRomBezier), `O`, `U` (ellipse and shorthand ellipse) are not present in the current draft and are not supported;
* normalization can mean many things to many people and our library is developed to convert path command values to absolute and shorthand to longhand commands to provide a solid foundation for the main processing tools of our library;
* when compared to the native methods like `SVGPathElement.getTotalLength()` or `SVGPathElement.getPointAtLength()`, the output of our static methods is within a [0.002 - 0.05] margin delta, but from our experience it's proven to be a more consistent outcome.


# Special Thanks

* Dmitry Baranovskiy for his [Raphael.js](https://dmitrybaranovskiy.github.io/raphael/)
* Vitaly Puzrin & Alex Kocharin for their [SvgPath](https://github.com/fontello/svgpath)
* Jürg Lehni & Jonathan Puckey for their [Paper.js](https://github.com/paperjs/paper.js/)
* Andrew Willems for his [awesome guide](https://stackoverflow.com/users/5218951/andrew-willems)
* Mike 'Pomax' Kamermans for his awesome [svg-path-reverse](https://github.com/Pomax/svg-path-reverse), [bezierjs](https://github.com/Pomax/bezierjs) and [bezierinfo](https://pomax.github.io/bezierinfo/)
* Nicolas Debeissat for the inspiration on [svg3d](https://github.com/ndebeiss/svg3d)
* Mike Bostock for his awesome [closestPoint](https://bl.ocks.org/mbostock/8027637)
* James Halliday for his excelent [point-at-length](https://github.com/substack/point-at-length)
* Eric Eastwood for his excelent [svg-curve-lib](https://github.com/MadLittleMods/svg-curve-lib)
* PhET Interactive Simulations for their [kite](https://github.com/phetsims/kite)
* [herrstrietzel](https://github.com/herrstrietzel) for his awesome [svg-pathdata-getbbox](https://github.com/herrstrietzel/svg-pathdata-getbbox)

# License
**SVGPathCommander** is released under [MIT Licence](https://github.com/thednp/svg-path-commander/blob/master/LICENSE).
