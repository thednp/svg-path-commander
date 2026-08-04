# Usage

Import, initialize and call multiple instance methods, or return the values right away.

**Example**
```js
// import the constructor
import SVGPathCommander from 'svg-path-commander'

let pathString = 'M0 0l50 0l50 50z';

// initialize
let mySVGPCInit = new SVGPathCommander(pathString);
/* 
returns => {
  segments: [ ['M',0,0], ['l',50,0], ['l',50,50], ['z'] ],
  round: 4,
  origin: [0, 0, 0]
}
*/

// direct access to methods
let mySVGPCInit = new SVGPathCommander(pathString).flipX().toString();
// returns => "M100 0H50L0 50Z"

```

# Node.js

```js
// import the constructor
import SVGPathCommander from 'svg-path-commander';

let pathString = 'M0 0l50 0l50 50z';

// initialize
let mySVGPCInit = new SVGPathCommander(pathString);

// or do whatever you want, perhaps you're a font creator?
let mySVGPCString = new SVGPathCommander(pathString)
                  .flipX()
                  .optimize()
                  .toString();
// returns => "M100 0H50L0 50Z"
```

# Main Methods Examples

```js
// reuse same init object to call different methods
// for instance convert to ABSOLUTE and return the initialization object
mySVGPCInit.toAbsolute()

// or convert to RELATIVE and return the string path directly
mySVGPCInit.toRelative().toString()

// or convert to CURVE and return the string path directly
mySVGPCInit.toCurve().toString()

// reverse and return the string path
mySVGPCInit.reverse().toString()
// => "M100 50L50 0L0 0Z"

// ONLY reverse subpaths and return the string path
// if the shape has no sub-path, this call will produce no effect
mySVGPCInit.reverse(1).toString()

// converts to both absolute and relative then return the shorter segment string
mySVGPCInit.optimize().toString()
// => "M0 0h50l50 50z"

// or return directly what you need
// reverse subpaths and return the optimized pathString
let myReversedPath = new SVGPathCommander(pathString).reverse(1).optimize().toString()

// flip the shape vertically and return the pathString
mySVGPCInit.flipX().toString()

// apply a skew transformation and return the pathString
mySVGPCInit.transform({skew:25}).toString()
```


# Instance Options Example

```js 
// disable rounding values
let mySVGPath = new SVGPathCommander('M0 0L0 0', { round: "off" })

// OR set a certain amount of decimals
let mySVGPath = new SVGPathCommander('M0 0L0 0', { round: 9 })

// Apply a 45deg rotation on Z axis and use a custom transform origin 
let mySVGPath = new SVGPathCommander( 'M0 0L50 0' )
                    .transform({ rotate:[0,0,45], origin: [25,25] }) 
```


# Apply Transform To Path Commands

You can either call the *SVGPathCommander* methods `flipX()` or `flipY()` to perform a quick transformation or set custom functions, in which case you can provide a `transformObject` *Object*

**2D Transformation Example**

```js
// define properties you want to transform
let transformObject = {
  scale: 0.3,
  translate: 20,
  rotate:45,
  skew:20
}

let myPathString = new SVGPathCommander('M0 0L0 0')
                      .transform(transformObject)
                      .toString()
```


**3D Transformation Example**

The `transformObject` can also set the **transform-origin** required for the transformation, if *origin* property is not set, by default `50% 50%` of the shape's bounding box is used; ***absolute values*** relative to a parent `SVGElement` are expected.

```js
// define properties to apply a transformation for 
// also provide a transform origin with the "origin" Object property
let transformObject = {
  origin: [205,205,205], // transform origin assumes the shape bounding box is 410 wide and 410 tall
  scale: [0.3,0.3,0.3],  // all axes scale
  translate: [20,0,0],   // translateX
  rotate:[0,0,45],       // rotateZ
  skew:[20,0]            // skewX
}

let myPathString = new SVGPathCommander('M0 0L0 0')
                      .transform(transformObject)
                      .toString()
```

For simplicity reasons and other considerations, we've decided not to include support for axis specific transform functions like `rotateX` or `scaleY`, since DOMMatrix and WebKitCSSMatrix APIs both support shorthand functions and would not make sense to just alocate more memory for aliases.


# Determine Shape Draw Direction

When reversing path strings, you might want to know their draw direction first:

**Example**
```js
import { getDrawDirection } from 'svg-path-commander/util'

// init
let shapeDrawDirection = getDrawDirection(pathString)
// => returns TRUE if shape draw direction is clockwise or FALSE otherwise
```
Keep in mind that paths with sub-paths may skew your result, you may want to split them and perform this check on each.


# Path Intersection

Find where two paths cross via the `SVGPathCommander.pathsIntersection()` static method. By default it returns the number of intersection points; pass `false` as the third argument to get the actual points.

**Example**
```js
import SVGPathCommander from 'svg-path-commander'

const path1 = 'M0 50C0 0,100 0,100 50';
const path2 = 'M50 0C100 0,100 100,50 100';

// count intersections
const count = SVGPathCommander.pathsIntersection(path1, path2, true);
// => 1

// get the intersection points
const points = SVGPathCommander.pathsIntersection(path1, path2, false);
// => [ { x: 80.4136, y: 19.5864, t1: 0.7262, t2: 0.2738 } ]
```

You can also quickly check whether two bounding boxes overlap:

```js
import { boundingBoxIntersect } from 'svg-path-commander/util'

const overlap = boundingBoxIntersect([0, 0, 50, 50], [25, 25, 100, 100]);
// => true
```


# Path Morphing

To morph between two paths they must have the same number of segments. Use `SVGPathCommander.equalizePaths()` to match two paths, then interpolate the corresponding segments between them.

**Example**
```js
import SVGPathCommander from 'svg-path-commander'

// paths with different segment counts
const path1 = 'M0 0L100 0L50 100Z';
const path2 = 'M0 0L100 0L100 100L0 100Z';

// equalize both paths so they share the same segment count
const [eq1, eq2] = SVGPathCommander.equalizePaths(path1, path2, { close: true });
// eq1.length === eq2.length

// now interpolate between the matching segments at any progress value
const progress = 0.5;
const morph = eq1.map((seg, i) => {
  const target = eq2[i];
  return seg.map((value, j) => {
    return typeof value === 'number'
      ? value + (target[j] - value) * progress
      : value;
  });
});
```

When you only need the same number of segments for each path, `SVGPathCommander.equalizeSegments()` does the same with fewer options:

```js
const [eq1, eq2] = SVGPathCommander.equalizeSegments(
  'M0 0L100 0L50 100Z',
  'M0 0L100 0L100 100L0 100Z'
);
// eq1.length === eq2.length
```


# Advanced Usage

In most cases, you can import only the tools you need, without importing the entire library. All static methods are exposed as named exports from the tree-shakeable `svg-path-commander/util` entry, with proper TypeScript definitions.

```js
import { pathToAbsolute, pathToString } from 'svg-path-commander/util'

let mySVGAbsolutePath = pathToString(pathToAbsolute(pathString))
```
Most important of these tools are already exported to global and are part of the [Static Methods](JavaScript-API.md#static-methods).


# Convert Shape To Path
You can convert any shape to `<path>` via the `SVGPathCommander.shapeToPath()` static method.

```js
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
