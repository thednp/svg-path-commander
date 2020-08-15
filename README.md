# SVGPathCommander
A modern set of ES6/ES7 JavaScript tools to split, normalize, parse, convert and revert *SVGPathElement* description attribute. 

This library is made possible thanks to [Raphael.js](https://dmitrybaranovskiy.github.io/raphael/), [Paper.js](https://github.com/paperjs/paper.js/) and is used by [KUTE.js](https://github.com/thednp/kute.js) and probably more.

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
// ES6+ stuff
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

// or convert to CURVE and return the string path
mySVGPathCommanderInit.toCurve().toString()

// reverse and return the string path
mySVGPathCommanderInit.reverse().toString()

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

* the `reverse()` method may not return the same number of path commands as the input path when `arcTo` path commands have `largeArcFlag` set to 1
* the `toCurve()` method will convert all path commands to `toCubicBezier` path command, including `Z`, which might make it difficult to work with and knowing the 
* all tools processing path segments will always round float values to 3 decimals, but only float numbers; EG: 0.5666 => 0.566

# Tools
Type in "SVGPathCommander." in your browser console and have a look, there are a wide range of tools to play with.

# Special Thanks

* Jürg Lehni & Jonathan Puckey for their [Paper.js](https://github.com/paperjs/paper.js/)
* Dmitry Baranovskiy for his [Raphael.js](https://dmitrybaranovskiy.github.io/raphael/)
* Andrew Willems for his [awesome guide](https://stackoverflow.com/users/5218951/andrew-willems)

# License
SVGPathCommander is [MIT Licenced](https://github.com/thednp/svg-path-commander/blob/master/LICENSE)