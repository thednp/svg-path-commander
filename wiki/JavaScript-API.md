## Instance Methods

The **SVGPathCommander** class comes with most useful public methods, intuitive and easy to use:

### instance.getBBox()
Returns the path bounding box, equivalent to native `path.getBBox()`.

```js
const rect = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').getBBox();
// => { cx: 8, cy: 8, cz: 24, height: 16, width: 16, x: 0, x2: 16, y: 0, y2: 16 }
```

### instance.getTotalLength()
Returns the total path length, equivalent to native `path.getTotalLength()`.

```js
const len = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').getTotalLength();
// => 61
```

### instance.getPointAtLength()
Returns a `{x,y}` point in path stroke at a given length, equivalent to native `path.getPointAtLength()`.

```js
const pt = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').getPointAtLength(25);
// => { x: 8.716814692820414, y: 16 }
```

### instance.toRelative()
Converts all path commands of a shape with or without sub-path to ***relative*** values.

```js
const rel = new SVGPathCommander('M2 0A2 2 0 0 0 0 2V14A2 2 0 0 0 2 16H14A2 2 0 0 0 16 14V2A2 2 0 0 0 14 0H2Z').toRelative().toString();
// => "M2 0a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-12z"
```

### instance.toAbsolute()
Converts all path commands of a shape with or without sub-path to ***absolute*** values.

```js
const abs = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z').toAbsolute().toString();
// => "M2 0A2 2 0 0 0 0 2V14A2 2 0 0 0 2 16H14A2 2 0 0 0 16 14V2A2 2 0 0 0 14 0H2Z"
```

### instance.toCurve()
Will convert all segments of a *SVGPathElement* to ***cubicBezier*** segments; this method will also remove unnecessary `Z` segments.

```js
const curve = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z', { round: 'off' }).toCurve().toString();
// => "M2 0C0.8954305003384135 2.0290612532945332e-16 -1.3527075021963556e-16 0.8954305003384133 0 2C0 6 0 10 0 14C1.3527075021963556e-16 15.104569499661586 0.8954305003384133 16 2 16..."
```

### instance.reverse(*onlySubpath*: boolean | undefined)
Will reverse the shape draw direction by changing the order of all path segments and their coordinates; when the `onlySubpath` option is true, it will only reverse the draw direction of subpath shapes.

```js
const rev = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z').reverse().toString();
// => "M2 0H14A2 2 0 0 1 16 2V14A2 2 0 0 1 14 16H2A2 2 0 0 1 0 14V2A2 2 0 0 1 2 0Z"
```

### instance.normalize()
Converts path command values to absolute and convert shorthand `S`, `T`, `H`, `V` to `C`, `Q` and `L` respectively.

```js
const norm = new SVGPathCommander('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z').normalize().toString();
// => "M2 0A2 2 0 0 0 0 2L0 14A2 2 0 0 0 2 16L14 16A2 2 0 0 0 16 14L16 2A2 2 0 0 0 14 0L2 0Z"
```

### instance.optimize()
Will execute an algorithm to find shorthand notation for eligible segments then will compute two `PathArray`s one with absolute and the other with relative values, then update the `PathArray` segments using the values that convert to shortest string.

```js
const opt = new SVGPathCommander('M2 0A2 2 0 0 0 0 2L0 14A2 2 0 0 0 2 16L14 16A2 2 0 0 0 16 14L16 2A2 2 0 0 0 14 0L2 0Z').optimize().toString();
// => "M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z"
```

### instance.transform(*transform*: TransformObject)
Will normalize all path commands and apply a 2D transformation matrix to all path commands.

```js
const tr = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z')
  .transform({ rotate: [15, 15], skew: [-15, 15] })
  .toString();
// => "M1.829 0.5176C0.8189 0.2318 -0.1718 0.8649 -0.3837 1.9319L-2.6856 13.523C-2.8975 14.5899 -2.2504 15.6866 -1.2403 15.9725L9.734 19.0783C10.7442 19.3642 11.7349 18.731 11.9468 17.6641L14.2487 6.073C14.4606 5.006 13.8135 3.9094 12.8033 3.6235L1.829 0.5176Z"
```

### instance.flipX()
Will call the above `transform()` method to apply a 180deg rotation on the X axis.

```js
const fx = new SVGPathCommander('M0 0L16 0 L8 16').flipX().toString();
// => "M16 0H0L8 16"
```

### instance.flipY()
Will call the above `transform()` method to apply a 180deg rotation on the Y axis.

```js
const fy = new SVGPathCommander('M0 0L16 0 L8 16').flipY().toString();
// => "M0 16H16L8 0"
```

### instance.toString()
Will return the `pathString` of the current `PathArray` stored in the `instance.segments` object.

```js
const str = new SVGPathCommander('M0 0l50 0l50 50z').toString();
// => "M0 0l50 0l50 50z"
```

### instance.dispose()
Will destroy the current instance.

```js
const inst = new SVGPathCommander('M0 0L50 0');
inst.dispose();
// inst.segments === undefined
```


## Instance Getters

### instance.bbox
A new **getter** that returns the path bounding box.

```js
const { bbox } = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z');
// => { cx: 8, cy: 8, cz: 24, height: 16, width: 16, x: 0, x2: 16, y: 0, y2: 16 }
```

### instance.length
A new **getter** that returns the path total length.

```js
const { length } = new SVGPathCommander('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z');
// => 61
```


## Instance Options
* `round` *Number | "off"* - option to enable/disable value rounding for the processing output; the default value is *4* but you can disable rounding the values with `round: "off"`
* `origin` *[Number, Number, Number]* - option to set a transform origin for transformations; if not provided, the default value `[0, 0, 0]` will be used.

## Static Methods

When using the distribution files, type in "SVGPathCommander." in your browser console and have a look, there are a wide range of tools to play with. Here are some notable utilities:

* **SVGPathCommander.isValidPath(*pathString*: string)** - checks if a path string is valid;
  ```js
  SVGPathCommander.isValidPath('M0 0L10 0'); // => true
  SVGPathCommander.isValidPath('M0 0Z10');   // => false
  ```
* **SVGPathCommander.getSVGMatrix(transform: *TransformObject*): CSSMatrix** returns the *CSSMatrix* (*DOMMatrix* compatible instance) for a given *TransformObject* (EG: `{ scale?: [x: number, y: number, z: number], translate: [x: number, y: number, z: number], ... }`)
* **SVGPathCommander.shapeToPath(*element*, *replace*)** - returns a new `<path>` element from a given `<line>`, `<polyline>`, `<polygon>`, `<rect>`, `<ellipse>`, `<circle>` or `<glyph>` element; the newly created `<path>` element keeps all non-specific attributes like `class`, `fill`, etc.; when the `replace` parameter is `true`, it will replace the target element; you can also create `<path>` elements on the fly by providing the minimum required specific attributes:
  ```js
  SVGPathCommander.shapeToPath({ type: 'circle', r: 5, cx: 15, cy: 15 });
  ```
* **SVGPathCommander.shapeToPathArray(*element*, *round*)** - returns the *PathArray* of a given shape element without creating a `<path>` element;
  ```js
  SVGPathCommander.shapeToPathArray({ type: 'line', x1: 0, y1: 0, x2: 10, y2: 10 });
  // => [['M', 0, 0], ['L', 10, 10]]
  ```
* **SVGPathCommander.parsePathString(*pathString*: string)** - returns a *PathArray* which is used by all of ***SVGPathCommander*** processing tools;
  ```js
  SVGPathCommander.parsePathString('M0 0l50 0l50 50z');
  // => [['M', 0, 0], ['l', 50, 0], ['l', 50, 50], ['z']]
  ```
* **SVGPathCommander.pathToAbsolute(*path*: string | PathArray)** - returns a new *PathArray* having all path commands as **absolute** coordinates;
  ```js
  SVGPathCommander.pathToAbsolute('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z');
  // => [['M', 2, 0], ['A', 2, 2, 0, 0, 0, 0, 2], ['V', 14], ['A', 2, 2, 0, 0, 0, 2, 16], ...]
  ```
* **SVGPathCommander.pathToRelative(*path*: string | PathArray)** - returns a new *PathArray* having all path commands as **relative** coordinates;
* **SVGPathCommander.pathToCurve(*path*: string | PathArray)** - returns a new *PathArray* having all path commands converted to *cubicBezierTo* (`C`) and absolute values;
* **SVGPathCommander.pathToString(*path*: PathArray, *round*: number)** - converts any *PathArray* to string and returns it, also allowing you to set the amount of decimals to round values to;
  ```js
  SVGPathCommander.pathToString([['M', 0, 0], ['L', 1.123456789, 2.987654321]]);
  // => "M0 0L1.1235 2.9877"
  ```
* **SVGPathCommander.roundPath(*path*: PathArray, *round*: number)** - returns a new *PathArray* with all float path command values rounded to 4 decimals by default, or provide a number to be used as the amount of decimals to round values to; the *round* parameter allows you to disable rounding by using the value: "off";
  ```js
  SVGPathCommander.roundPath([['M', 0, 0], ['L', 1.123456789, 2.987654321]]);
  // => [['M', 0, 0], ['L', 1.1235, 2.9877]]
  ```
* **SVGPathCommander.reversePath(*path*: string | PathArray)** - returns a new *PathArray* with all path commands having absolute values and in reverse order, but only for a single M->Z shape, for paths having sub-path(s) you need to use the **SVGPathCommander** constructor itself;
* **SVGPathCommander.optimizePath(*path*: PathArray)** - returns a new *PathArray* with all segments that have the shortest strings from either absolute or relative `PathArray` segments;
* **SVGPathCommander.transformPath(*path*: PathArray | string, *transformObject*: TransformObject)** - returns a new *PathArray* with all segments transformed according to the properties defined in the `transformObject`;
* **SVGPathCommander.normalizePath(*path*: string | PathArray)** - returns a new *PathArray* with all shorthand path command segments such as `S`, `T` are converted to `C` and `Q` respectively, `V` and `H` to `L`, all in absolute values; the utility is used by `pathToCurve` and `reversePath`;
  ```js
  SVGPathCommander.normalizePath('M2 0V16');
  // => [['M', 2, 0], ['L', 2, 16]]
  ```
* **SVGPathCommander.getDrawDirection(*path*: PathArray)** - converts the *PathArray* to curve and returns *TRUE* if a shape draw direction is **clockwise**, it *should work* for shapes with sub-paths, but it might skew your results, so make sure you split your path and test each sub-path separately;
  ```js
  SVGPathCommander.getDrawDirection('M0 0L100 0L50 100Z'); // => true
  ```
* **SVGPathCommander.getPathBBox(*path*: PathArray)** - converts the *PathArray* to curve and returns the bounding box of a shape in the form of the following object: `{x1,y1, x2,y2, width,height, cx,cy,cz}`, where *cx* & *cy* are the shape's center point, *cz* is more of a `transformOriginZ` for 3D projections; for faster processing, you might want to split the path with sub-paths and return the bounding box you know is the largest;
  ```js
  SVGPathCommander.getPathBBox('M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z');
  // => { cx: 8, cy: 8, cz: 24, height: 16, width: 16, x: 0, x2: 16, y: 0, y2: 16 }
  ```
* **SVGPathCommander.getPathArea(*path*: PathArray | string)** - converts the *PathArray* to curve and returns the total area of the shape; a negative value indicates a **clockwise** draw direction;
  ```js
  SVGPathCommander.getPathArea('M0 0L100 0L50 100Z'); // => 4999.999999999999
  ```
  The result is the shoelace sum for the polygon; a negative value indicates a **clockwise** draw direction.
* **SVGPathCommander.getTotalLength(*path*: PathArray | string)** - will normalize the *PathArray* and return the total length of the shape; this is equivalent to *SVGPathElement.prototype.getTotalLength()* and should work in Node.js;
* **SVGPathCommander.getPointAtLength(*path*: PathArray | string, *distance*: number)** - normalizes the *PathArray* and looks into each segment to return an `{x,y}` object which represents a point at the given `distance`;
* **SVGPathCommander.splitPath(*path*: PathArray)** - returns an *Array* comprised of `PathArray` items;
  ```js
  SVGPathCommander.splitPath('M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2zM4 4h8l-4 8z').map(path => path.length);
  // => [10, 4]
  ```
* **SVGPathCommander.fixPath(*path*: string | PathArray)** - checks if a *PathArray* has an unnecessary `Z` segment and removes it in place.
* **SVGPathCommander.getPropertiesAtLength(*path*: PathArray | string, *distance*: number)** - returns an object with the following properties: the segment in which the distance spans, the index of the segment, the length of the segment and length to the segment;
  ```js
  SVGPathCommander.getPropertiesAtLength('M10 10C20 20,40 20,50 10', 50);
  // => { segment: ['C', 20, 20, 40, 20, 50, 10], index: 1, length: 43.8086, lengthAtSegment: 0 }
  ```
* **SVGPathCommander.getPropertiesAtPoint(*path*: PathArray | string, *point*: { x: number, y: number })** - returns an object with the following properties: the closest point in stroke, the distance to closest point and the segment which contains the closest point;
  ```js
  SVGPathCommander.getPropertiesAtPoint('M10 90C25 80,25 50,40 10', { x: 30.0725, y: 41.4282 });
  // => { closest: { x: 30.1572, y: 41.4507 }, distance: 0.0877, segment: { segment: ['C', 25, 80, 25, 50, 40, 10], index: 1, length: 86.5325, lengthAtSegment: 0 } }
  ```
* **SVGPathCommander.getClosestPoint(*path*: PathArray | string, *point*: { x: number, y: number })** - returns an *{x,y}* object with the coordinates of a point that is closest to a given *{x,y}* point;
  ```js
  SVGPathCommander.getClosestPoint('M10 90C25 80,25 50,40 10', { x: 10, y: 90 });
  // => { x: 10, y: 90 }
  ```
* **SVGPathCommander.isPointInStroke(*path*: PathArray | string*, *point*: { x: number, y: number })** - checks if a given *{x,y}* point is along the stroke of a path;
  ```js
  SVGPathCommander.isPointInStroke('M10 90C25 80,25 50,40 10', { x: 10, y: 90 }); // => true
  ```
* **SVGPathCommander.getSegmentOfPoint(*path*: PathArray | string, *point*: { x: number, y: number })** - returns the segment that contains a given *{x,y}* point;
  ```js
  SVGPathCommander.getSegmentOfPoint('M10 90C25 80,25 50,40 10', { x: 10, y: 90 });
  // => { segment: ['M', 10, 90], index: 0, length: 0, lengthAtSegment: 0 }
  ```
* **SVGPathCommander.getSegmentAtLength(*path*: PathArray | string, *distance*: number)** - returns the segment reached by a given distance;
  ```js
  SVGPathCommander.getSegmentAtLength('M10 80a6 4 10 1 0 8 0', 15);
  // => ['a', 6, 4, 10, 1, 0, 8, 0]
  ```
* **SVGPathCommander.equalizePaths(*path1*: PathArray | string, *path2*: PathArray | string, *options*: PathsEqualizationOptions)** - equalizes two paths for morphing, supports multi-subpath paths; returns a tuple of two equalized *MorphPathArrays*;
  ```js
  const [eq1, eq2] = SVGPathCommander.equalizePaths(
    'M0 0L100 0L50 100Z',
    'M0 0L100 0L100 100L0 100Z',
    { close: true }
  );
  // eq1.length === eq2.length === 6
  ```
* **SVGPathCommander.equalizeSegments(*path1*: PathArray | string, *path2*: PathArray | string, *options*: EqualizationOptions)** - equalizes two single-subpath paths for morphing; returns a tuple of two equalized *MorphPathArrays*;
  ```js
  const [eq1, eq2] = SVGPathCommander.equalizeSegments(
    'M0 0L100 0L50 100Z',
    'M0 0L100 0L100 100L0 100Z'
  );
  // eq1.length === eq2.length === 6
  ```
* **SVGPathCommander.pathsIntersection(*path1*: string | PathArray, *path2*: string | PathArray)** - returns an array of intersection points between two paths;
  ```js
  SVGPathCommander.pathsIntersection(
    'M0 50C0 0,100 0,100 50',
    'M50 0C100 0,100 100,50 100',
    false
  );
  // => [{ x: 80.4136, y: 19.5864, t1: 0.7262, t2: 0.2738 }]
  ```
* **SVGPathCommander.boundingBoxIntersect(*a*: BBoxMaxima, *b*: BBoxMaxima)** - checks if two bounding boxes intersect;
  ```js
  SVGPathCommander.boundingBoxIntersect([0, 0, 50, 50], [25, 25, 100, 100]); // => true
  ```
* **SVGPathCommander.isPointInsideBBox(*bbox*: BBoxMaxima, *point*: PointTuple)** - checks if a point is inside or on the edge of a bounding box;
  ```js
  SVGPathCommander.isPointInsideBBox([0, 0, 50, 50], [25, 25]); // => true
  ```
* **SVGPathCommander.isPathArray(*path*: PathArray)** - checks if a value is a *PathArray*;
  ```js
  SVGPathCommander.isPathArray([['M', 0, 0], ['L', 10, 0]]); // => true
  ```
* **SVGPathCommander.isAbsoluteArray(*path*: PathArray)** - checks if a *PathArray* has only absolute path commands;
  ```js
  SVGPathCommander.isAbsoluteArray([['M', 0, 0], ['L', 10, 0]]); // => true
  ```
* **SVGPathCommander.isRelativeArray(*path*: PathArray)** - checks if a *PathArray* has only relative path commands;
  ```js
  SVGPathCommander.isRelativeArray([['M', 0, 0], ['l', 10, 0]]); // => true
  ```
* **SVGPathCommander.isNormalizedArray(*path*: PathArray)** - checks if a *PathArray* has only normalized path commands;
* **SVGPathCommander.isCurveArray(*path*: PathArray)** - checks if a *PathArray* has only `M` and `C` path commands;
  ```js
  SVGPathCommander.isCurveArray([['M', 0, 0], ['C', 5, 5, 10, 5, 10, 0]]); // => true
  ```
* **SVGPathCommander.isPolygonArray(*path*: PathArray)** - checks if a *PathArray* is a closed polygon;
  ```js
  SVGPathCommander.isPolygonArray([['M', 0, 0], ['L', 10, 0], ['L', 10, 10], ['Z']]); // => true
  ```
* **SVGPathCommander.isPolylineArray(*path*: PathArray)** - checks if a *PathArray* is an open polyline;
  ```js
  SVGPathCommander.isPolylineArray([['M', 0, 0], ['L', 10, 0], ['L', 10, 10]]); // => true
  ```
* **SVGPathCommander.isMultiPath(*path*: PathArray | string)** - checks if a path has multiple subpaths;
  ```js
  SVGPathCommander.isMultiPath('M2 0H4ZM6 0H8Z'); // => true
  ```
* **SVGPathCommander.isClosedPath(*path*: PathArray | string)** - checks if a path is closed;
  ```js
  SVGPathCommander.isClosedPath('M0 0L10 0L10 10L0 10Z'); // => true
  ```
* **SVGPathCommander.samplePolygon(*path*: NormalArray, *sampleSize*: number)** - samples a polygon path into a given number of points;
  ```js
  SVGPathCommander.samplePolygon(SVGPathCommander.pathToAbsolute('M0 0L10 0L10 10Z'), 3);
  // => [[0, 0], [10, 0], [10, 10], [0, 0]]
  ```
* **SVGPathCommander.version** - the current library version.
  ```js
  SVGPathCommander.version; // => "2.3.1"
  ```


## Utility Functions

All static methods are also exported as individual, tree-shakeable functions from the `svg-path-commander/util` subpath:

```js
import { parsePathString, getPathBBox, pathToAbsolute } from 'svg-path-commander/util';

parsePathString('M0 0L50 0');
// => [['M', 0, 0], ['L', 50, 0]]
```

| Function | Description |
|---|---|
| `parsePathString` | Returns a `PathArray` from a path string |
| `pathToString` | Returns the string of a `PathArray` |
| `pathToAbsolute` | Returns a new `PathArray` with absolute coordinates |
| `pathToRelative` | Returns a new `PathArray` with relative coordinates |
| `pathToCurve` | Returns a new `PathArray` with `C` segments and absolute values |
| `normalizePath` | Returns a new `PathArray` without shorthand segments |
| `optimizePath` | Returns a new `PathArray` with shortest-string segments |
| `reversePath` | Returns a new `PathArray` with reversed segments |
| `reverseCurve` | Returns a new reversed `PathArray` of curve segments only |
| `transformPath` | Returns a new `PathArray` with transformed segments |
| `roundPath` | Returns a new `PathArray` with rounded values |
| `splitPath` | Returns an array of `PathArray` items |
| `getTotalLength` | Returns the total path length |
| `getPointAtLength` | Returns the `{x,y}` point at a given distance |
| `getPropertiesAtLength` | Returns the segment and length properties at a given distance |
| `getPropertiesAtPoint` | Returns the closest point and segment for a given point |
| `getClosestPoint` | Returns the `{x,y}` point closest to a given point |
| `getSegmentAtLength` | Returns the segment at a given distance |
| `getSegmentOfPoint` | Returns the segment containing a given point |
| `getPathBBox` | Returns the path bounding box |
| `getPathArea` | Returns the total area of a shape |
| `getDrawDirection` | Returns `true` if a shape draws clockwise |
| `isPointInStroke` | Checks if a point is along the stroke |
| `isPointInsideBBox` | Checks if a point is inside a bounding box |
| `isPathArray` | Checks if a value is a `PathArray` |
| `isAbsoluteArray` | Checks for absolute path commands only |
| `isRelativeArray` | Checks for relative path commands only |
| `isNormalizedArray` | Checks for normalized path commands only |
| `isCurveArray` | Checks for `M` and `C` path commands only |
| `isPolygonArray` | Checks if a `PathArray` is a closed polygon |
| `isPolylineArray` | Checks if a `PathArray` is an open polyline |
| `isMultiPath` | Checks if a path has multiple subpaths |
| `isClosedPath` | Checks if a path is closed |
| `isValidPath` | Checks if a path string is valid |
| `shapeToPath` | Returns a new `<path>` element from a shape element |
| `shapeToPathArray` | Returns a `PathArray` from a shape element |
| `pathsIntersection` | Returns the intersection points between two paths |
| `boundingBoxIntersect` | Checks if two bounding boxes intersect |
| `equalizePaths` | Equalizes two paths for morphing |
| `equalizeSegments` | Equalizes two single-subpath paths for morphing |
