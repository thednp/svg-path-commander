# SVG Path Commander

[![SVG Path Commander](img/apple-touch-icon.png)](https://thednp.github.io/svg-path-commander/)

A modern set of ES6/ES7 JavaScript tools for manipulating the `d` (description) attribute for *SVGPathElement* items, and is implementing modern JavaScript API to produce reusable path strings with lossless quality.

While you may find familiar tools inside, this library brings ***new additions***:
* a tool that can *reverse path draw direction* without altering path commands, even with specific shorthand path commands;
* a unique tool that can *reverse path draw direction* for path strings with only 'C' path commands;
* a new and unique tool to *apply transform functions to path commands* via modern API.

**The key differences with other libraries**:
* ES6/ES7 sourced with modernized codebase and build tools; all inherited codebase has been modernized as well;
* you can use this library in both web apps and Node.js, where others are restricted to a single environment;
* path command transformations are all consistent with the SVG coordinates system, where others compute transform origin only for rotation transformation.

**SVGPathCommander** implements the [DOMMatrix API](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix) for *SVGPathElement* path command transformation and falls back to a modernized [CSSMatrix shim](https://github.com/thednp/DOMMatrix) on older browsers as well as Node.js.
There are a couple of good reasons for this implementation:
* *WebKitCSSMatrix* and *SVGMatrix* APIs are slowly pushed away by DOMMatrix, the green light for new and modern implementations;
* in the future we might actually be able to apply a [3D transformation](https://github.com/ndebeiss/svg3d) matrix to SVG path commands;
* when most tools available will be rendered absolete, we are ready for new challenges.

This library is available on [CDN](https://www.jsdelivr.com/package/npm/svg-path-commander) and [npm](https://www.npmjs.com/package/svg-path-commander). 

[![NPM Version](https://img.shields.io/npm/v/svg-path-commander.svg?style=flat-square)](https://www.npmjs.com/package/svg-path-commander)
[![NPM Downloads](https://img.shields.io/npm/dm/svg-path-commander.svg?style=flat-square)](http://npm-stat.com/charts.html?svg-path-commander)
[![jsDeliver](https://data.jsdelivr.com/v1/package/npm/svg-path-commander/badge)](https://www.jsdelivr.com/package/npm/svg-path-commander)


# What Is It For?

* converting and optimizing *SVGPathElement* for use in third party application; our [KUTE.js](https://github.com/thednp/kute.js) animation engine is using it to process *SVGPathElement* coordinates for [SVG morphing](https://thednp.github.io/kute.js/svgMorph.html) and [SVG cubic morphing](https://thednp.github.io/kute.js/svgCubicMorph.html);
* animators that work with SVGs and need tools for performing specific path command processing;
* font-icon creators can use it in both Node.js and web applications to process and test their creations.


# Install

```
npm install svg-path-commander
```

# CDN

Find ***SVGPathCommander*** on [jsDelivr](https://www.jsdelivr.com/package/npm/svg-path-commander).


# ES6/ES7 Usage

On a regular basis, you can import, initialize and call multiple instance methods, or return the values right away.

**Example**
```js
// import the constructor
import SVGPathCommander from 'svg-path-commander'

let pathString = 'M0 0l50 0l50 50z';

// initializing
let mySVGPathCommanderInit = new SVGPathCommander(pathString);
/* returns => {
  pathValue: 'M0 0l50 0l50 50z',
  segments: [ ['M',0,0], ['l',50,0], ['l',50,50], ['z'] ]
}
*/
```


# Node.js

```js
// import the constructor
let SVGPathCommander = require('svg-path-commander');

let pathString = 'M0 0l50 0l50 50z';

// initializing
let mySVGPathCommanderInit = new SVGPathCommander(pathString);
/* returns => {
  pathValue: 'M0 0l50 0l50 50z',
  segments: [ ['M',0,0], ['l',50,0], ['l',50,50], ['z'] ]
}
*/
```


# Instance Methods

The SVGPathCommander construct comes with some instance methods you can call:

* ***.toAbsolute()*** - will convert all path commands of a *SVGPathElement* with or without sub-path to ***absolute*** values; in addition it will convert `O` or shorthand `U` (ellipse) to `A` (arc) path commands, as well as `R` (catmulRom) path commands to `C` (cubicBezier), since the absolute path is used by all other tools for specific processing;
* ***.toRelative()*** - will convert all path commands of a shape with or without sub-path to ***relative*** values;
* ***.reverse(onlySubpath)*** - will reverse the shape draw direction by changing the order of all path segments and their coordinates; when the `onlySubpath` option is true, it will only reverse the draw direction of subpath shapes
* ***.normalize()*** - will convert path command values to absolute and convert shorthand `S`, `T`, `H`, `V` to `C`, `Q` and `L` respectivelly;
* ***.optimize()*** - will compute two `pathArray`s one with absolute and the other with relative values, then update the `pathArray` segments using the values that convert to shortest string;
* ***.transform(transformObject)*** - will normalize all path commands and apply a 2D transformation matrix to all path commands;
* ***.flipX()*** - will call the above `transform()` method to apply a 180deg rotation on the X axis;
* ***.flipY()*** - will call the above `transform()` method to apply a 180deg rotation on the Y axis;
* ***.toString()*** - will return the `pathString` of the current `pathArray` stored in the `instance.segments` object.

**Examples**
```js
// reuse same init object to call different methods
// for instance convert to ABSOLUTE and return the initialization object
mySVGPathCommanderInit.toAbsolute()

// or convert to RELATIVE and return the string path directly
mySVGPathCommanderInit.toRelative().toString()

// reverse and return the string path
mySVGPathCommanderInit.reverse().toString()

// ONLY reverse subpaths and return the string path
// if the shape has no sub-path, this call will produce no effect
mySVGPathCommanderInit.reverse(1).toString()

// converts to both absolute and relative then return the shorter segment string
mySVGPathCommanderInit.optimize().toString()

// or return directly what you need
// reverse subpaths and return the optimized pathString
let myReversedPath = new SVGPathCommander(pathString).reverse(1).optimize().toString()

// flip the shape vertically and return the pathString
mySVGPathCommanderInit.flipX().toString()

// apply a skew transformation and return the pathString
mySVGPathCommanderInit.transform({skew:25}).toString()
```


# Instance Options
* `round` *Boolean* - option to enable/disable value rounding for the processing output; the default value is *TRUE*
* `decimals` *Number* - option to set a certain amount of decimals to round values to; the default value is *3*
* `origin` *Object* - `{x:Number, y:Number}` - option to set a transform origin for the transformation, by default `50% 50%` of the shape's bounding box is used; ***absolute values*** relative to a parent `SVGElement` are expected

**Example**
```js 
// disable rounding values
let mySVGPath = new SVGPathCommander('M0 0L0 0', { round: 0 })

// OR set a certain amount of decimals
let mySVGPath = new SVGPathCommander('M0 0L0 0', { decimals: 4 })

// Apply a 45deg rotation on Z axis and use a custom transform origin 
let mySVGPath = new SVGPathCommander( 'M0 0L0 0', { origin: { x:50, y:50 } })
                    .transform({ rotate:[0,0,45] }) 
```


# Apply Transform To Path Commands
You can either call the *SVGPathCommander* methods `flipX()` or `flipY()` to perform a quick transformation or set custom functions, in which case you can provide a `transformObject` *Object*

**Example**

```js
// define properties you want to transform
let transformObject = {
  scale: 0.3,
  translate: 20,
  rotate:45,
  skew:20
}

// the above is equivalent with the following
let transformObject = {
  scale: [0.3,0.3,0.3], // all axes scale
  translate: [20,0,0],  // translateX
  rotate:[0,0,45],      // rotateZ
  skew:[20,0]           // skewX
}

let myPathString = new SVGPathCommander('M0 0L0 0')
                      .transform(transformObject)
                      .toString()
```
As you can see we've provided all X, Y, Z axes values for most transform functions, but SVG currently only supports 2D transform functions. That is because again, this library implements the DOMMatrix API for calculating the values we need. The library doesn't rely on *SVGMatrix* API. Instead of this:

```js
var transformMatrix = ownerSVGElement.createSVGTransform()

transformMatrix.setMatrix(elem.getCTM())
```

we now can do this:

```js
let transformMatrix = new DOMMatrix()

// apply transform from string
transformMatrix.setMatrixValue('rotate(45deg)')

// or call instance methods directly
transformMatrix.rotate(45)
```

The `transformMatrix` is all we need really need to perform the path command transformation. Also, for simplicity reasons and other considerations, we've decided not to include support for axis specific transform functions like `rotateX` or `scaleY`, since DOMMatrix and WebKitCSSMatrix APIs both support shorthand functions and would not make sense to just alocate more memory for aliases.


# Determine Shape Draw Direction
When reversing path strings, you might want to know their draw direction first:

**Example**
```js
import pathToCurve from 'svg-path-commander/src/convert/pathToCurve.js'
import getDrawDirection from 'svg-path-commander/src/util/getDrawDirection.js'

// init
let shapeDrawDirection = getDrawDirection(pathToCurve(pathString))
// => returns TRUE if shape draw direction is clockwise or FALSE otherwise
```


# Advanced Usage

In most cases, you can import only the tools you need, without importing the entire library.

**Example**
```js
import pathToAbsolute from 'svg-path-commander/src/convert/pathToAbsolute.js'
import pathToString from 'svg-path-commander/src/convert/pathToString.js'

let mySVGAbsolutePath = pathToString(pathToAbsolute(pathString))
```
Most of these tools are already exported to global and are listed below.


# Tools

When using the distribution files, type in "SVGPathCommander." in your browser console and have a look, there are a wide range of tools to play with. 
Here are some notable utilities:

* `SVGPathCommander.parsePathString(pathString,decimals)` - returns a *pathArray* which is used by all of ***SVGPathCommander*** processing tools;
* `SVGPathCommander.pathToAbsolute(pathString|pathArray,decimals)` - returns a new *pathArray* having all path commands as **absolute** coordinates;
* `SVGPathCommander.pathToRelative(pathString|pathArray,decimals)` - returns a new *pathArray* having all path commands as **relative** coordinates;
* `SVGPathCommander.pathToCurve(pathString|pathArray,decimals)` - returns a new *pathArray* having all path commands converted to cubicBezier (`C`) and absolute values;
* `SVGPathCommander.clonePath(pathArray)` - returns a **deep clone** of a *pathArray*, which is the result of any of the above functions;
* `SVGPathCommander.roundPath(pathArray,decimals)` - returns a new *pathArray* with all float path command values rounded to 3 decimals by default, or provide a number to be used as the amount of decimals to round values to;
* `SVGPathCommander.reversePath(pathString|pathArray,decimals)` - returns a new *pathArray* with all path commands having absolute values and in reverse order, but only for a single M->Z shape, for paths having sub-path(s) you need to use `pathToAbsolute` -> `pathToString` -> `splitPath` -> `reversePath` for each subpath;
* `SVGPathCommander.optimizePath(pathArray,decimals)` - returns a new *pathArray* with all segments that have the shortest strings from either absolute or relative `pathArray` segments
* `SVGPathCommander.normalizePath(pathString|pathArray,decimals)` - returns a new *pathArray* with all shorthand path command segments such as `S`, `T` are converted to `C` and `Q` respectively, `V` and `H` to `L`, all in absolute values; the utility is used by `pathToCurve` and `reversePath`;
* `SVGPathCommander.getDrawDirection(pathCurveArray)` - returns **TRUE** if a shape draw direction is **clockwise**, it should not be used for shapes with sub-paths, but each path/sub-path individually;
* `SVGPathCommander.getPathBBox(pathCurveArray)` - returns the bounding box of a shape in the form of the following object: `{x1,y1, x2,y2, width,height, cx,cy}`, where *cx* &amp; *cy* are the shape's center point;
* `SVGPathCommander.splitPath(pathString)` - returns an *Array* of sub-path strings.
The `decimals` option can be passed to override the `defaultOptions.decimals` value of `3`. 


# Custom Builds
You can now build your own custom builds, go to the root of `svg-path-commander` and type

`npm run custom-build INPUTFILE:src/index-custom.js,OUTPUTFILE:path-to/svg-path-commander-custom.js,FORMAT:umd,MIN:false`

* *INPUTFILE* - specify your custom build path, (create a copy of `src/index.js` to `src/index-custom.js` with your desired version);
* *OUTPUTFILE* - specify the path to the file you want to build into;
* *FORMAT* - specify either `umd`,`cjs`,`iife`, you know the thing;
* *MIN* - set `TRUE`/`FALSE` to minify the output or NOT.


# Technical Considerations
* as mentioned above, the `optimize()` method will not simplify/merge the path commands or determine and create shorthand notations; you might need [SVGO](https://github.com/svg/svgo) and its `convertPathData` plugin; however, while computing path command values, the library will try to deliver the best outcome in path reverse or transformation;
* all tools processing path segments will always round float values to 3 decimals; EG: 0.5666 => 0.566, 0.50 => 0.5; you can change the default option with `SVGPathCommander.options.decimals = 2` or remove the value rounding all together with `SVGPathCommander.options.round = 0`; you can also control this feature via instance options;
* the `getSVGMatrix` utility will always compute the matrix by applying the transform functions in the following order: `translate`, `rotate`, `skew` and `scale`, which is the default composition/recomposition order specified in the W3C draft;
* most tools included with **SVGPathCommander** should work in your Node.js apps, but if you choose to use other complimentary 3rd party libraries, make sure you have the proper tools for them;
* normalization can mean many things to many people and our library is developed to convert path command values to absolute and shorthand to non-shorthand commands to provide a solid foundation for the main processing


# Special Thanks

* Dmitry Baranovskiy for his [Raphael.js](https://dmitrybaranovskiy.github.io/raphael/)
* Vitaly Puzrin & Alex Kocharin for their [SvgPath](https://github.com/fontello/svgpath)
* Jürg Lehni & Jonathan Puckey for their [Paper.js](https://github.com/paperjs/paper.js/)
* Andrew Willems for his [awesome guide](https://stackoverflow.com/users/5218951/andrew-willems)
* Mike 'Pomax' Kamermans for his awesome [svg-path-reverse](https://github.com/Pomax/svg-path-reverse) and [bezierjs](https://github.com/Pomax/bezierjs)

# License
**SVGPathCommander** is released under [MIT Licence](https://github.com/thednp/svg-path-commander/blob/master/LICENSE).