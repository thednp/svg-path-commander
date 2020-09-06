# SVG Path Commander

[![SVG Path Commander](img/apple-touch-icon.png)](https://github.com/thednp/svg-path-commander)

A modern set of ES6/ES7 JavaScript tools for manipulating *SVGPathElement* `d` (description) attribute, developed to solve over-optimized path strings and provide a solid solution for parsing, normalizing, converting and reversing *SVGPathElement* draw direction. Another purpose of the library is to produce reusable path strings with lossless quality.

This library is available on [CDN](https://www.jsdelivr.com/package/npm/svg-path-commander) and [npm](https://www.npmjs.com/package/svg-path-commander). 

[![NPM Version](https://img.shields.io/npm/v/svg-path-commander.svg?style=flat-square)](https://www.npmjs.com/package/svg-path-commander)
[![NPM Downloads](https://img.shields.io/npm/dm/svg-path-commander.svg?style=flat-square)](http://npm-stat.com/charts.html?svg-path-commander)
[![jsDeliver](https://data.jsdelivr.com/v1/package/npm/svg-path-commander/badge)](https://www.jsdelivr.com/package/npm/svg-path-commander)

# What is the library for?

* our [KUTE.js](https://github.com/thednp/kute.js) animation engine is using it to process *SVGPathElement* coordinates for [SVG morphing](https://thednp.github.io/kute.js/svgMorph.html) and [SVG cubic morphing](https://thednp.github.io/kute.js/svgCubicMorph.html);
* animators that work with SVGs and need to normalize, convert or optimize path strings;
* creators of font-icons can use it to normalize, reverse and optimize svg path strings in both Node.js and browser applications.


# Install

```
npm install svg-path-commander
```

# CDN

Find ***SVGPathCommander*** on [jsDelivr](https://www.jsdelivr.com/package/npm/svg-path-commander).


# ES6/ES7 Usage

On a regular basis, you can import, initialize and access methods, or return the values right away.

```js
// import the constructor
import SVGPathCommander from 'svg-path-commander'

let pathString = 'M0 0l50 0l50 50z';

// initializing
let mySVGPathCommanderInit = new SVGPathCommander(pathString);
/* returns => {
  segments: [ ['M',0,0], ['l',50,0], ['l',50,50], ['z'] ]
}
*/
```


# Node.js

```js
// import the constructor
let SVGPathCommander = require('svg-path-commander')

let pathString = 'M0 0l50 0l50 50z';

// initializing
let mySVGPathCommanderInit = new SVGPathCommander(pathString);
/* returns => {
  segments: [ ['M',0,0], ['l',50,0], ['l',50,50], ['z'] ]
}
*/
```


# Instance Methods

The SVGPathCommander construct comes with some instance methods you can call:

* ***.toAbsolute()*** - will convert all path commands of a *SVGPathElement* with or without sub-path to ***absolute*** values; in addition it will convert `O` or shorthand `U` (ellipse) to `A` (arc) path commands, as well as `R` (catmulRom) path commands to `C` (cubicBezier), since the absolute path is used by all other tools for specific processing
* ***.toRelative()*** - will convert all path commands of a shape with or without sub-path to ***relative*** values 
* ***.reverse(onlySubpath)*** - will reverse the shape draw direction by changing the order of all path segments and their coordinates; when the `onlySubpath` option is true, it will only reverse the draw direction of subpath shapes
* ***.normalize()*** - will convert path command values to absolute and convert shorthand `S`, `T`, `H`, `V` to `C`, `Q` and `L` respectivelly
* ***.optimize()*** - will compute two `pathArray`s one with absolute and the other with relative values, then update the `pathArray` segments using the values that convert to shortest string
* ***.toString()*** - will return the `pathString` of the current `pathArray`

***Examples***
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
```

# Instance Options
* `round` *Boolean* - option to enable/disable value rounding for the processing output; the default value is *TRUE*
* `decimals` *Number* - option to set a certain amount of decimals to round values to; the default value is *3*

***Example***
```js 
// disable rounding values
let mySVGPath = new SVGPathCommander('M0 0L0 0',{
  round: 0
})
// OR set a certain amount of decimals
let mySVGPath = new SVGPathCommander('M0 0L0 0',{
  decimals: 4
})
```


# Advanced Usage

In most cases, you can import only the tools you need, without importing the entire library.

```js
import pathToAbsolute from 'svg-path-commander/src/convert/pathToAbsolute.js'
import pathToString from 'svg-path-commander/src/convert/pathToString.js'

let mySVGAbsolutePath = pathToString(pathToAbsolute(pathString))
```

# Determine Shape Draw Direction
When reversing path strings, you might want to know their draw direction first:

```js
import pathToCurve from 'svg-path-commander/src/convert/pathToCurve.js'
import getDrawDirection from 'svg-path-commander/src/util/getDrawDirection.js'

// init
let shapeDrawDirection = getDrawDirection(pathToCurve(pathString))
// => returns TRUE if shape draw direction is clockwise or FALSE otherwise
```


# Tools

When using the library as a module, type in "SVGPathCommander." in your browser console and have a look, there are a wide range of tools to play with. 
Here are some notable utilities:

* `SVGPathCommander.parsePathString(pathString)` - returns a *pathArray* which is used by all of ***SVGPathCommander*** processing tools
* `SVGPathCommander.pathToAbsolute(pathString|pathArray)` - returns a new *pathArray* having all path commands as **absolute** coordinates
* `SVGPathCommander.pathToRelative(pathString|pathArray)` - returns a new *pathArray* having all path commands as **relative** coordinates
* `SVGPathCommander.pathToCurve(pathString|pathArray)` - returns a new *pathArray* having all path commands converted to cubicBezier (`C`) and absolute values
* `SVGPathCommander.clonePath(pathArray)` - returns a **deep clone** of a *pathArray*, which is the result of any of the above functions
* `SVGPathCommander.roundPath(pathArray)` - returns a new *pathArray* with all float path command values rounded to 3 decimals by default
* `SVGPathCommander.reversePath(pathString|pathArray)` - returns a new *pathArray* with all path commands having absolute values and in reverse order, but only for a single M->Z shape, for paths having sub-path(s) you need to use `pathToAbsolute` -> `pathToString` -> `splitPath` -> `reversePath` for each subpath
* `SVGPathCommander.optimizePath(pathArray)` - returns a new *pathArray* with all segments that have the shortest strings from either absolute or relative `pathArray` segments
* `SVGPathCommander.normalizePath(pathString|pathArray)` - returns a new *pathArray* with all shorthand path command segments such as `S`, `T` are converted to `C` and `Q` respectively, `V` and `H` to `L`, all in absolute values; the utility is used by `pathToCurve` and `reversePath`
* `SVGPathCommander.getDrawDirection(pathCurveArray)` - returns **TRUE** if a shape draw direction is **clockwise**, it should not be used for shapes with sub-paths, but each path/sub-path individually
* `SVGPathCommander.splitPath(pathString)` - returns an *Array* of sub-path strings
*There are other tools not exported to SVGPathCommander object, some of which would like to have access to a mockup browser.*


# Technical Considerations
* as mentioned above, the `optimize()` method will not simplify/merge the path commands; you might need [SVGO](https://github.com/svg/svgo) and its `convertPathData` plugin;
* all tools processing path segments will always round float values to 3 decimals, remember: ***only float numbers***; EG: 0.5666 => 0.566, 0.50 => 0.5, 5 => 5; you can change the default option with `SVGPathCommander.options.decimals = 2` or remove the value rounding all together with `SVGPathCommander.options.round = 0`;
* other processing you may need may require the `SVGMatrix` or `SVGPathElement` APIs (those that do are not exported to global), these will likelly need a mockup browser in Node.js environment.


# Special Thanks

* Dmitry Baranovskiy for his [Raphael.js](https://dmitrybaranovskiy.github.io/raphael/)
* Vitaly Puzrin & Alex Kocharin for their [SvgPath](https://github.com/fontello/svgpath)
* Jürg Lehni & Jonathan Puckey for their [Paper.js](https://github.com/paperjs/paper.js/)
* Andrew Willems for his [awesome guide](https://stackoverflow.com/users/5218951/andrew-willems)
* Mike 'Pomax' Kamermans for his awesome [svg-path-reverse](https://github.com/Pomax/svg-path-reverse) and [bezierjs](https://github.com/Pomax/bezierjs)

# License
SVGPathCommander is released under [MIT Licence](https://github.com/thednp/svg-path-commander/blob/master/LICENSE).