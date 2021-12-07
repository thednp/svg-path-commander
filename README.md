![image](./assets/SVGPathCommander.svg)

A modern set of ES6+ JavaScript tools for manipulating the `d` (description) attribute for *SVGPathElement* items. The library is implementing modern JavaScript API to produce reusable path strings with lossless quality. In addition, you also have a powerful tool to convert other SVG shapes like `<circle>` or `<rect>` to `<path>`.

[![NPM Version](https://img.shields.io/npm/v/svg-path-commander.svg?style=flat-square)](https://www.npmjs.com/package/svg-path-commander)
[![NPM Downloads](https://img.shields.io/npm/dm/svg-path-commander.svg?style=flat-square)](http://npm-stat.com/charts.html?svg-path-commander)
[![jsDeliver](https://data.jsdelivr.com/v1/package/npm/svg-path-commander/badge)](https://www.jsdelivr.com/package/npm/svg-path-commander)

While you may find familiar tools inside, this library brings ***new additions***:
* a tool that can *reverse path draw direction* without altering path commands, even with specific shorthand path commands;
* a unique tool that can *reverse path draw direction* for path strings with only 'C' path commands;
* a new and unique tool to *apply transform functions to path commands* via the modern *DOMMatrix* API.

**The key differences with other libraries**:
* ES6+ sourced with modernized codebase and build tools; all inherited codebase has been modernized as well;
* along with the modern codebase, the library also comes with strong TypeScript definitions;
* you can use this library in both web apps and Node.js, you are not restricted to a single environment;
* path command transformations are all consistent with the SVG coordinates system, where others compute transform origin only for rotation transformation;
* this library can create 3D to 2D projections, making your SVGs look like 3D but in the SVG coordinate system.

**SVGPathCommander** implements the [DOMMatrix API](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix) for *SVGPathElement* path command transformation and falls back to a modernized [CSSMatrix shim](https://github.com/thednp/DOMMatrix) on older browsers as well as Node.js.
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
<script src="https://cdn.jsdelivr.net/npm/svg-path-commander/dist/svg-path-commander.min.js">
```

# Quick Guide
```js
import SVGPathCommander from 'svg-path-commander';

const path = 'M0 0 L50 100';

// flip a path on X axis
const flippedPathString = new SVGPathCommander(path).flipX().toString();

// apply a 2D transformation
const transform = {
  translate: 15, // X axis translation
  rotate: 15, // Z axis rotation
  scale: 0.75, // uniform scale on X, Y, Z axis
  skew: 15, // skew 15deg on the X axis
  origin: [15, 0] // if not specified, it will calculate a bounding box to determine a proper `transform-origin`
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

// optimize a path string for best outcome by using the `round: 'auto'` option
// which will determine the amount of decimals based on the shape's bounding box
const optimizedPathString = new SVGPathCommander(path, {round: 'auto'}).optimize().toString();

// convert a shape to `<path>` and transfer all non-specific attributes
const circle = document.getElementById('myCircle');
SVGPathCommander.shapeToPath(circle, true);

// alternatively you can create <path> from specific attributes
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

# WIKI
For developer guidelines, head over to the [wiki pages](https://github.com/thednp/svg-path-commander/wiki).


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
* normalization can mean many things to many people and our library is developed to convert path command values to absolute and shorthand to non-shorthand commands to provide a solid foundation for the main processing tools of our library.


# Special Thanks

* Dmitry Baranovskiy for his [Raphael.js](https://dmitrybaranovskiy.github.io/raphael/)
* Vitaly Puzrin & Alex Kocharin for their [SvgPath](https://github.com/fontello/svgpath)
* Jürg Lehni & Jonathan Puckey for their [Paper.js](https://github.com/paperjs/paper.js/)
* Andrew Willems for his [awesome guide](https://stackoverflow.com/users/5218951/andrew-willems)
* Mike 'Pomax' Kamermans for his awesome [svg-path-reverse](https://github.com/Pomax/svg-path-reverse) and [bezierjs](https://github.com/Pomax/bezierjs)
* Nicolas Debeissat for the inspiration on [svg3d](https://github.com/ndebeiss/svg3d)

# License
**SVGPathCommander** is released under [MIT Licence](https://github.com/thednp/svg-path-commander/blob/master/LICENSE).
