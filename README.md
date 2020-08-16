# SVGPathCommander
A modern set of ES6/ES7 JavaScript tools for *SVGPathElement* description attribute. This library was developed to try and solve over-optimized `arcTo` segment strings and provide a solid solution to parse, convert and reverse *SVGPathElement* draw direction, but keep in mind it's still under development.

This library is made possible thanks to [Raphael.js](https://dmitrybaranovskiy.github.io/raphael/), [Paper.js](https://github.com/paperjs/paper.js/) and is used by [KUTE.js](https://github.com/thednp/kute.js) for SVG path morphing.

[![NPM Version](https://img.shields.io/npm/v/svg-path-commander.svg?style=flat-square)](https://www.npmjs.com/package/svg-path-commander)
[![NPM Downloads](https://img.shields.io/npm/dm/svg-path-commander.svg?style=flat-square)](http://npm-stat.com/charts.html?svg-path-commander)
[![jsDeliver](https://data.jsdelivr.com/v1/package/npm/svg-path-commander/badge)](https://www.jsdelivr.com/package/npm/svg-path-commander)

# Install

```
npm install svg-path-commander
```

# CDN

Find SVGPathCommander on [jsDelivr](https://www.jsdelivr.com/package/npm/svg-path-commander) or [cdnjs](https://cdnjs.com/libraries/svg-path-commander)

# Usage

On a regular basis, you can import, initialize and access methods, or return the values right away.

```js
// import the constructor
import SVGPathCommander from 'svg-path-commander'

let pathString = 'M0 0l50 0l50 50z';

// initializing
let mySVGPathCommanderInit = new SVGPathCommander(pathString);
/* returns => {
  segments: [ ['M',0,0], ['l',50,0], ['l',50,50], ['z'] ],
  pathValue: 'M0 0l50 0l50 50z'
}
*/

// reuse same init object to call different methods
// for instance convert to ABSOLUTE and return the string path
mySVGPathCommanderInit.toAbsolute().toString()

// or convert to RELATIVE and return the string path
mySVGPathCommanderInit.toRelative().toString()

// reverse and return the string path
mySVGPathCommanderInit.reverse().toString()

// ONLY reverse subpaths and return the string path
mySVGPathCommanderInit.reverse(1).toString()

// converts to both absolute and relative then return the shorter path string
mySVGPathCommanderInit.optimize().toString()

// or return directly what you need
let mySVGAbsolutePath = new SVGPathCommander(pathString).toAbsolute().toString()
```

# Advanced Usage

In some cases, you can also import only the tool you need, without importing the entire library.

```js
import pathToAbsolute from 'svg-path-commander/src/convert/pathToAbsolute.js'
import toString from 'svg-path-commander/src/convert/toString.js'

let mySVGAbsolutePath = toString(pathToAbsolute(pathString))
```

# Some Technical Considerations
* the `reverse()` method may not return the same number of path commands as the input path when `arcTo` path commands have `largeArcFlag` set to 1; this method will split the original path string into multiple sub-path strings, reverse the draw direction of each sub-path and return a new *pathArray* instance;
* all tools processing path segments will always round float values to 3 decimals, but only float numbers; EG: 0.5666 => 0.566, 0.50 => 0.5;

# Tools
Type in "SVGPathCommander." in your browser console and have a look, there are a wide range of tools to play with. Here are some notable utilities:

* `parsePathString(pathString)` - returns a *pathArray* and is used by/for most of SVGPathCommander conversion tools
* `toAbsolute(pathString)` - returns a *pathArray* with all path commands with absolute coordinates
* `clonePath(pathArray)` - returns a deep clone of a *pathArray*, which is the element of the SVGPathCommander initialization object, or the result of the `parsePath`
* `getDrawDirection(pathCurve)` - returns *TRUE* if a shape draw direction is clockwise
* `splitPath(pathString)` - returns and *Array* of path strings

# Special Thanks

* Jürg Lehni & Jonathan Puckey for their [Paper.js](https://github.com/paperjs/paper.js/)
* Dmitry Baranovskiy for his [Raphael.js](https://dmitrybaranovskiy.github.io/raphael/)
* Vitaly Puzrin & Alex Kocharin for their [SvgPath](https://github.com/fontello/svgpath)
* Andrew Willems for his [awesome guide](https://stackoverflow.com/users/5218951/andrew-willems)

# License
SVGPathCommander is released under [MIT Licence](https://github.com/thednp/svg-path-commander/blob/master/LICENSE).