## Instance Methods

The **SVGPathCommander** class comes with most useful public methods, intuitive and easy to use:

### instance.getBBox()

Returns the path bounding box, equivalent to native `path.getBBox()`.

```js
const rect = new SVGPathCommander(
  "M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z",
).getBBox();
// => { cx: 8, cy: 8, cz: 24, height: 16, width: 16, x: 0, x2: 16, y: 0, y2: 16 }
```

### instance.getTotalLength()

Returns the total path length, equivalent to native `path.getTotalLength()`.

```js
const len = new SVGPathCommander(
  "M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z",
).getTotalLength();
// => 60.56637061435917
```

### instance.getPointAtLength()

Returns a `{x,y}` point in path stroke at a given length, equivalent to native `path.getPointAtLength()`.

```js
const pt = new SVGPathCommander(
  "M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z",
).getPointAtLength(25);
// => { x: 8.716814692820414, y: 16 }
```

### instance.getPropertiesAtLength()

Returns the properties of the path at a given length: the segment the length
spans, the index of the segment, the length of the segment, the length to the
segment and the frame of the path at that length — the point, the unit tangent
vector, the unit normal vector and the angle of the tangent in degrees.

```js
const properties = new SVGPathCommander("M0 0L100 0").getPropertiesAtLength(50);
// => { segment: ["L", 100, 0], index: 1, length: 100, lengthAtSegment: 0,
//      point: { x: 50, y: 0 }, tangent: { x: 1, y: 0 },
//      normal: { x: 0, y: 1 }, angle: 0 }
```

The normal is the **left** normal of the tangent, so it points to the left of
the direction of the path, and the angle is the angle of the tangent in
degrees, in the `-180` to `180` range. A `moveto` has no direction, so its
tangent and its normal are the zero vector.

### instance.toRelative()

Converts all path commands of a shape with or without sub-path to _**relative**_ values.

```js
const rel = new SVGPathCommander(
  "M2 0A2 2 0 0 0 0 2V14A2 2 0 0 0 2 16H14A2 2 0 0 0 16 14V2A2 2 0 0 0 14 0H2Z",
)
  .toRelative()
  .toString();
// => "M2 0a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-12z"
```

### instance.toAbsolute()

Converts all path commands of a shape with or without sub-path to _**absolute**_ values.

```js
const abs = new SVGPathCommander(
  "M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z",
)
  .toAbsolute()
  .toString();
// => "M2 0A2 2 0 0 0 0 2V14A2 2 0 0 0 2 16H14A2 2 0 0 0 16 14V2A2 2 0 0 0 14 0H2Z"
```

### instance.toCurve()

Will convert all segments of a _SVGPathElement_ to _**cubicBezier**_ segments; this method will also remove unnecessary `Z` segments.

```js
const curve = new SVGPathCommander(
  "M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z",
  { round: "off" },
)
  .toCurve()
  .toString();
// => "M2 0C0.8954305003384135 2.0290612532945332e-16 -1.3527075021963556e-16 0.8954305003384133 0 2C0 6 0 10 0 14C1.3527075021963556e-16 15.104569499661586 0.8954305003384133 16 2 16..."
```

### instance.reverse(_onlySubpath_: boolean | undefined)

Will reverse the shape draw direction by changing the order of all path segments and their coordinates; when the `onlySubpath` option is true, it will only reverse the draw direction of subpath shapes.

```js
const rev = new SVGPathCommander(
  "M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z",
)
  .reverse()
  .toString();
// => "M2 0H14A2 2 0 0 1 16 2V14A2 2 0 0 1 14 16H2A2 2 0 0 1 0 14V2A2 2 0 0 1 2 0Z"
```

### instance.reverseSubPath(_index_: number)

Reverses the draw direction of the sub-path at the given zero-based index, the other sub-paths are left untouched.

```js
const rev = new SVGPathCommander("M0 0L100 0ZM0 100L100 100").reverseSubPath(1).toString();
// => "M0 0L100 0ZM100 100L0 100"
```

### instance.join(_path_: string | PathArray)

Joins another path to the path of the instance: the result holds two sub-paths and absolute values.

```js
const joined = new SVGPathCommander("M0 0L100 0").join("M0 100L100 100").toString();
// => "M0 0L100 0M0 100L100 100"
```

### instance.normalize()

Converts path command values to absolute and convert shorthand `S`, `T`, `H`, `V` to `C`, `Q` and `L` respectively.

```js
const norm = new SVGPathCommander(
  "M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z",
)
  .normalize()
  .toString();
// => "M2 0A2 2 0 0 0 0 2L0 14A2 2 0 0 0 2 16L14 16A2 2 0 0 0 16 14L16 2A2 2 0 0 0 14 0L2 0Z"
```

### instance.optimize()

Will execute an algorithm to find shorthand notation for eligible segments then will compute two `PathArray`s one with absolute and the other with relative values, then update the `PathArray` segments using the values that convert to shortest string.

```js
const opt = new SVGPathCommander(
  "M2 0A2 2 0 0 0 0 2L0 14A2 2 0 0 0 2 16L14 16A2 2 0 0 0 16 14L16 2A2 2 0 0 0 14 0L2 0Z",
)
  .optimize()
  .toString();
// => "M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2z"
```

### instance.simplify(_tolerance_: number | SimplifyOptions)

Simplifies the path while preserving curves: straight-line runs are reduced with Douglas-Peucker and curve runs are fitted with adaptive Schneider cubic Béziers. Arcs and original curves are retained whenever fitting would not reduce the segment count, and every source sub-path and closure is preserved.

```js
const simplified = new SVGPathCommander("M0 0L10 0L20 0L30 0").simplify(1).toString();
// => "M0 0L30 0"
```

The tolerance is the target geometric error of the sampled fitting. A smaller tolerance keeps more detail, a bigger one removes more. The tolerance defaults to `1` and it can be given as an object too:

```js
new SVGPathCommander("M0 0L10 0L20 0L30 0").simplify({ tolerance: 1 });
```

### instance.offset(_distance_: number, _options_: OffsetOptions)

Offsets the path along its normals: the path is sampled along its length, every sample is shifted along the normal of the path, and the result is a path of straight lines.

```js
const offset = new SVGPathCommander("M0 0L100 0").offset(10).toString();
// => "M0 10L100 10"
```

The `side` option is literal — the left side is the left normal of the direction of travel, the same normal `getPropertiesAtLength()` returns — and the `both` side is the outline of the stroke, the band between the two sides of the path:

```js
new SVGPathCommander("M0 0L100 0").offset(10, { side: "both" });
// => "M0 10L100 10L100 -10L0 -10Z"
```

The offset accepts the `join` option (`"miter"`, the default, `"bevel"` or `"round"`), the `miterLimit` option (the ratio of the miter length to the offset distance, `4` by default), the `cap` option (`"butt"`, the default, `"square"` or `"round"`), the `steps` option (the number of the intervals a curve is sampled with, `16` by default) and the `precision` option (the number of the decimals of the result, `4` by default). The defaults are the initial values of the SVG presentation attributes.

The offset is not cleaned up: an offset distance larger than the local radius of curvature of the path produces a self-crossing curve.

### instance.isPointInStroke(_point_: { x: number; y: number }, _options_: StrokeOptions)

Checks if a given point is in the stroke of the path.

```js
new SVGPathCommander("M0 0L100 0").isPointInStroke({ x: 50, y: 5 });
// => false — the point is not on the path
```

Without a width the point has to be on the path itself, within the distance epsilon of it. With a width the stroke is the band around the path: the point is in the stroke when it is at most half the width away from the path. The ends of an open path are treated as if the stroke had round caps.

```js
new SVGPathCommander("M0 0L100 0").isPointInStroke({ x: 50, y: 5 }, { width: 10 });
// => true — the point is inside the stroke
```

### instance.isPointInPath(_point_: { x: number; y: number }, _options_: PointInPathOptions)

Checks if a given point is inside the filled shape of the path.

```js
new SVGPathCommander("M0 0L100 0L100 100L0 100Z").isPointInPath({ x: 50, y: 50 });
// => true
```

The path is flattened into polygons and the point is tested against them with the fill rule of the path: the `nonzero` rule (the default) counts the windings of the polygons around the point, the `evenodd` rule counts the crossings of the polygons with a ray from the point. A point on the boundary of the shape is inside of it, the way the browser answers it with `isPointInFill()`, and the curves of the path are approximated with chords, so the answer can differ from the exact geometry for the points that are within the `tolerance` (0.1 by default) of the boundary of a curve.

```js
const shape = new SVGPathCommander("M0 0L100 0L100 100L0 100ZM25 25L75 25L75 75L25 75Z");
shape.isPointInPath({ x: 50, y: 50 }); // => true — the inner square is not a hole
shape.isPointInPath({ x: 50, y: 50 }, { fillRule: "evenodd" }); // => false
```

### instance.transform(_transform_: Partial<TransformObject>)

Normalizes the path and applies a 2D or 3D transformation. A 3D transformation is projected into the SVG coordinate system.

```js
const tr = new SVGPathCommander("M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z")
  .transform({ rotate: [15, 15], skew: [-15, 15] })
  .toString();
// => "M1.829 0.5176C0.8189 0.2318 -0.1718 0.8649 -0.3837 1.9319L-2.6856 13.523C-2.8975 14.5899 -2.2504 15.6866 -1.2403 15.9725L9.734 19.0783C10.7442 19.3642 11.7349 18.731 11.9468 17.6641L14.2487 6.073C14.4606 5.006 13.8135 3.9094 12.8033 3.6235L1.829 0.5176Z"
```

### instance.flipX()

Mirrors the path around the vertical centerline of its bounding box.

```js
const fx = new SVGPathCommander("M0 0L16 0 L8 16").flipX().toString();
// => "M16 0H0L8 16"
```

### instance.flipY()

Mirrors the path around the horizontal centerline of its bounding box.

```js
const fy = new SVGPathCommander("M0 0L16 0 L8 16").flipY().toString();
// => "M0 16H16L8 0"
```

### instance.toString()

Will return the `pathString` of the current `PathArray` stored in the `instance.segments` object.

```js
const str = new SVGPathCommander("M0 0l50 0l50 50z").toString();
// => "M0 0l50 0l50 50z"
```

### instance.dispose()

Will destroy the current instance.

```js
const inst = new SVGPathCommander("M0 0L50 0");
inst.dispose();
// inst.segments === undefined
```

## Instance Getters

### instance.bbox

A new **getter** that returns the path bounding box.

```js
const { bbox } = new SVGPathCommander(
  "M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z",
);
// => { cx: 8, cy: 8, cz: 24, height: 16, width: 16, x: 0, x2: 16, y: 0, y2: 16 }
```

### instance.length

A new **getter** that returns the path total length.

```js
const { length } = new SVGPathCommander(
  "M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z",
);
// => 60.56637061435917
```

## Instance Options

- `round` _Number | "off"_ - option to enable/disable value rounding for the processing output; the default value is _4_ but you can disable rounding the values with `round: "off"`
- `origin` _[Number, Number, Number]_ - option to set a transform origin for transformations; if not provided, the default value `[0, 0, 0]` will be used.

## Static Methods

When using the distribution files, type in "SVGPathCommander." in your browser console and have a look, there are a wide range of tools to play with. Here are some notable utilities:

- **SVGPathCommander.isValidPath(_pathString_: string)** - checks if a path string is valid;
  ```js
  SVGPathCommander.isValidPath("M0 0L10 0"); // => true
  SVGPathCommander.isValidPath("M0 0Z10"); // => false
  ```
- **SVGPathCommander.getSVGMatrix(_transform_: Partial<TransformObject>): CSSMatrix** returns the _CSSMatrix_ (_DOMMatrix_ compatible instance) for a given transform (EG: `{ scale?: [x: number, y: number, z: number], translate: [x: number, y: number, z: number], ... }`)
- **SVGPathCommander.shapeToPath(_element_, _replace_?, _ownerDocument_?)** - returns a new `<path>` element, or `false` when the generated path is invalid, from a given `<line>`, `<polyline>`, `<polygon>`, `<rect>`, `<ellipse>`, `<circle>` or `<glyph>` element; the newly created `<path>` element keeps all non-specific attributes like `class`, `fill`, etc.; when the `replace` parameter is `true`, it replaces the target element; pass an `ownerDocument` when creating the element outside the current browser document; you can also create `<path>` elements on the fly by providing the minimum required specific attributes:
  ```js
  SVGPathCommander.shapeToPath({ type: "circle", r: 5, cx: 15, cy: 15 });
  ```
- **SVGPathCommander.shapeToPathArray(_element_)** - returns the _PathArray_ of a given shape element without creating a `<path>` element, or `false` when no valid path can be created;
  ```js
  SVGPathCommander.shapeToPathArray({ type: "line", x1: 0, y1: 0, x2: 10, y2: 10 });
  // => [['M', 0, 0], ['L', 10, 10]]
  ```
- **SVGPathCommander.parsePathString(_pathInput_: string | PathArray)** - returns a _PathArray_ which is used by all of _**SVGPathCommander**_ processing tools; a path array is cloned, so the source is not modified;
  ```js
  SVGPathCommander.parsePathString("M0 0l50 0l50 50z");
  // => [['M', 0, 0], ['l', 50, 0], ['l', 50, 50], ['z']]
  ```
- **SVGPathCommander.pathToAbsolute(_path_: string | PathArray)** - returns a new _PathArray_ having all path commands as **absolute** coordinates;
  ```js
  SVGPathCommander.pathToAbsolute(
    "M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z",
  );
  // => [['M', 2, 0], ['A', 2, 2, 0, 0, 0, 0, 2], ['V', 14], ['A', 2, 2, 0, 0, 0, 2, 16], ...]
  ```
- **SVGPathCommander.pathToRelative(_path_: string | PathArray)** - returns a new _PathArray_ having all path commands as **relative** coordinates;
- **SVGPathCommander.pathToCurve(_path_: string | PathArray)** - returns a new _PathArray_ having all path commands converted to _cubicBezierTo_ (`C`) and absolute values;
- **SVGPathCommander.pathToString(_path_: PathArray, _round_?: number | "off")** - converts any _PathArray_ to string and returns it, also allowing you to set the amount of decimals to round values to or to disable rounding with `"off"`;
  ```js
  SVGPathCommander.pathToString([
    ["M", 0, 0],
    ["L", 1.123456789, 2.987654321],
  ]);
  // => "M0 0L1.1235 2.9877"
  ```
- **SVGPathCommander.roundPath(_path_: PathArray, _round_: number)** - returns a new _PathArray_ with all float path command values rounded to 4 decimals by default, or provide a number to be used as the amount of decimals to round values to; the _round_ parameter allows you to disable rounding by using the value: "off";
  ```js
  SVGPathCommander.roundPath([
    ["M", 0, 0],
    ["L", 1.123456789, 2.987654321],
  ]);
  // => [['M', 0, 0], ['L', 1.1235, 2.9877]]
  ```
- **SVGPathCommander.reversePath(_path_: string | PathArray)** - returns a new _PathArray_ with all path commands having absolute values and in reverse order; every sub-path is reversed on its own, so the `M` and the `Z` of a sub-path are swapped with each other, and the sub-paths keep their original order;
- **SVGPathCommander.optimizePath(_path_: string | PathArray, _round_?: number)** - returns a new _PathArray_ with all segments that have the shortest strings from either absolute or relative `PathArray` segments; the values are rounded to 2 decimals by default;
- **SVGPathCommander.transformPath(_path_: PathArray | string, _transformObject_?: Partial<TransformObject>)** - returns a new _PathArray_ with all segments transformed according to the properties defined in the `transformObject`;
- **SVGPathCommander.normalizePath(_path_: string | PathArray)** - returns a new _PathArray_ with all shorthand path command segments such as `S`, `T` are converted to `C` and `Q` respectively, `V` and `H` to `L`, all in absolute values; the utility is used by `pathToCurve` and `reversePath`;
  ```js
  SVGPathCommander.normalizePath("M2 0V16");
  // => [['M', 2, 0], ['L', 2, 16]]
  ```
- **SVGPathCommander.simplifyPath(_path_: string | PathArray, _tolerance_: number | SimplifyOptions)** - returns a new _PathArray_ simplified while preserving curves: straight-line runs are reduced with Douglas-Peucker, curve runs are fitted with adaptive Schneider cubic Béziers, and arcs and original curves are retained whenever fitting would not reduce the segment count; every source sub-path and closure is preserved;
  ```js
  SVGPathCommander.simplifyPath("M0 0L10 0L20 0L30 0", 1);
  // => [['M', 0, 0], ['L', 30, 0]]
  ```
  The tolerance is the target geometric error of the sampled fitting. A smaller tolerance keeps more detail, a bigger one removes more. The tolerance defaults to `1`.
- **SVGPathCommander.resamplePath(_path_: string | PathArray, _count_: number, _mode_: "line" | "curve")** - returns a new _PathArray_ with the given number of points for every sub-path, distributed along the length of that sub-path: the source segment boundaries and corners are kept when the requested count allows it, so the shape of the path keeps its vertices; the result is a polyline, or a path of exact cubic pieces of the source curves in the `curve` mode;
  ```js
  SVGPathCommander.resamplePath("M0 0L100 0L100 100", 3);
  // => [['M', 0, 0], ['L', 100, 0], ['L', 100, 100]]

  SVGPathCommander.resamplePath("M0 0L10 0M20 0L30 0", 2);
  // => [['M', 0, 0], ['L', 10, 0], ['M', 20, 0], ['L', 30, 0]]
  ```
  The mode defaults to `line`. Every sub-path is resampled on its own, so the result never connects two sub-paths and `count` is the number of points of each one. The extra intervals are distributed in proportion to the lengths of the source segments, while the source segment boundaries remain knots. When the corners of a sub-path are more than its points, they cannot all be kept: the points are spread evenly then, and the shape of the sub-path is approximated by its chords or by the best available fixed controls.
- **SVGPathCommander.offsetPath(_path_: string | PathArray, _distance_: number, _options_: OffsetOptions)** - returns a new _PathArray_ with the path offset along its normals: the path is sampled along its length, every sample is shifted along the normal of the path, and the result is a path of straight lines;
  ```js
  SVGPathCommander.offsetPath("M0 0L100 0", 10);
  // => [['M', 0, 10], ['L', 100, 10]]
  ```
  The `side` option is literal — the left side is the left normal of the direction of travel, the same normal `getPropertiesAtLength()` returns — and the `both` side is the outline of the stroke, the band between the two sides of the path. The `join` option (`"miter"`, the default, `"bevel"` or `"round"`), the `miterLimit` option (the ratio of the miter length to the offset distance, `4` by default), the `cap` option (`"butt"`, the default, `"square"` or `"round"`), the `steps` option (the number of the intervals a curve is sampled with, `16` by default) and the `precision` option (the number of the decimals of the result, `4` by default) are the other options, and their defaults are the initial values of the SVG presentation attributes. The offset is not cleaned up: an offset distance larger than the local radius of curvature of the path produces a self-crossing curve.
- **SVGPathCommander.joinPath(_pathA_: string | PathArray, _pathB_: string | PathArray)** - returns a new _PathArray_ with the two paths joined into a single path with two sub-paths, in absolute values;
  ```js
  SVGPathCommander.joinPath("M0 0L100 0", "M0 100L100 100");
  // => [['M', 0, 0], ['L', 100, 0], ['M', 0, 100], ['L', 100, 100]]
  ```
- **SVGPathCommander.reverseSubPath(_path_: string | PathArray, _index_: number)** - returns a new _PathArray_ with the sub-path at the given zero-based index reversed, the other sub-paths are left untouched;
  ```js
  SVGPathCommander.reverseSubPath("M0 0L100 0ZM0 100L100 100", 1);
  // => [['M', 0, 0], ['L', 100, 0], ['Z'], ['M', 100, 100], ['L', 0, 100]]
  ```
  An index that is out of the range of the sub-paths is rejected with a `TypeError`.
- **SVGPathCommander.getDrawDirection(_path_: string | PathArray)** - converts the path to curves and returns _TRUE_ if a shape draw direction is **clockwise**, it _should work_ for shapes with sub-paths, but it might skew your results, so make sure you split your path and test each sub-path separately;
  ```js
  SVGPathCommander.getDrawDirection("M0 0L100 0L50 100Z"); // => true
  ```
- **SVGPathCommander.getPathBBox(_path_: string | PathArray)** - computes the bounding box of a shape directly from its segments in the form of the following object: `{x, y, x2, y2, width, height, cx, cy, cz}`, where _cx_ & _cy_ are the shape's center point, _cz_ is more of a `transformOriginZ` for 3D projections; for faster processing, you might want to split the path with sub-paths and return the bounding box you know is the largest;
  ```js
  SVGPathCommander.getPathBBox("M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z");
  // => { cx: 8, cy: 8, cz: 24, height: 16, width: 16, x: 0, x2: 16, y: 0, y2: 16 }
  ```
- **SVGPathCommander.getPathArea(_path_: PathArray | string)** - converts the _PathArray_ to curve and returns the total area of the shape; a positive value indicates a **clockwise** draw direction;
  ```js
  SVGPathCommander.getPathArea("M0 0L100 0L50 100Z"); // => 4999.999999999999
  ```
  The result is the shoelace sum for the polygon; a positive value indicates a **clockwise** draw direction.
- **SVGPathCommander.getTotalLength(_path_: PathArray | string)** - will normalize the _PathArray_ and return the total length of the shape; this is equivalent to _SVGPathElement.prototype.getTotalLength()_ and should work in Node.js;
- **SVGPathCommander.getPointAtLength(_path_: PathArray | string, _distance_: number)** - normalizes the _PathArray_ and looks into each segment to return an `{x,y}` object which represents a point at the given `distance`;
- **SVGPathCommander.splitPath(_path_: string | PathArray)** - returns an _Array_ comprised of `PathArray` items;
  ```js
  SVGPathCommander.splitPath(
    "M2 0A2 2 0 0 0 0 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2A2 2 0 0 0 14 0H2zM4 4h8l-4 8z",
  ).map((path) => path.length);
  // => [10, 4]
  ```
- **SVGPathCommander.fixPath(_path_: string | PathArray)** - returns a new _PathArray_ without an unnecessary `Z` segment; the source path is not modified.
- **SVGPathCommander.getPropertiesAtLength(_path_: PathArray | string, _distance_: number)** - returns an object with the following properties: the segment in which the distance spans, the index of the segment, the length of the segment, the length to the segment and the frame of the path at that length — the `point` at that length, the unit `tangent` vector, the unit `normal` vector (the left normal of the tangent) and the `angle` of the tangent in degrees;
  ```js
  SVGPathCommander.getPropertiesAtLength("M10 10C20 20,40 20,50 10", 50);
  // => { segment: ['C', 20, 20, 40, 20, 50, 10], index: 1, length: 43.8086,
  //      lengthAtSegment: 0, point: { x: 50, y: 10 },
  //      tangent: { x: 0.7071, y: -0.7071 }, normal: { x: 0.7071, y: 0.7071 },
  //      angle: -45 }
  ```
- **SVGPathCommander.getPropertiesAtPoint(_path_: PathArray | string, _point_: { x: number, y: number })** - returns an object with the following properties: the closest point in stroke, the distance to closest point and the segment which contains the closest point, with its frame;
  ```js
  SVGPathCommander.getPropertiesAtPoint("M10 90C25 80,25 50,40 10", { x: 30.0725, y: 41.4282 });
  // => { closest: { x: 30.1572, y: 41.4507 }, distance: 0.0877,
  //      segment: { segment: ['C', 25, 80, 25, 50, 40, 10], index: 1,
  //                  length: 86.5325, lengthAtSegment: 0,
  //                  point: { x: 30.1572, y: 41.4507 },
  //                  tangent: { x: 0.2566, y: -0.9665 },
  //                  normal: { x: 0.9665, y: 0.2566 }, angle: -75.1299 } }
  ```
- **SVGPathCommander.getClosestPoint(_path_: PathArray | string, _point_: { x: number, y: number })** - returns an _{x,y}_ object with the coordinates of a point that is closest to a given _{x,y}_ point;
  ```js
  SVGPathCommander.getClosestPoint("M10 90C25 80,25 50,40 10", { x: 10, y: 90 });
  // => { x: 10, y: 90 }
  ```
- _*SVGPathCommander.isPointInStroke(*path*: PathArray | string*, *point*: { x: number, y: number }, *options*: StrokeOptions)_* - checks if a given _{x,y}_ point is along the stroke of a path;
  ```js
  SVGPathCommander.isPointInStroke("M10 90C25 80,25 50,40 10", { x: 10, y: 90 }); // => true
  ```
  Without a width the point has to be on the path itself, within the distance epsilon of it. With a width the stroke is the band around the path: the point is in the stroke when it is at most half the width away from the path. The ends of an open path are treated as if the stroke had round caps.
  ```js
  SVGPathCommander.isPointInStroke("M0 0L100 0", { x: 50, y: 5 }); // => false
  SVGPathCommander.isPointInStroke("M0 0L100 0", { x: 50, y: 5 }, { width: 10 }); // => true
  ```
- **SVGPathCommander.isPointInPath(_path_: PathArray | string, _point_: { x: number, y: number }, _options_: PointInPathOptions)** - checks if a given _{x,y}_ point is inside the filled shape of a path, with the `nonzero` or the `evenodd` fill rule of the SVG `fill-rule` attribute;
  ```js
  SVGPathCommander.isPointInPath("M0 0L100 0L100 100L0 100Z", { x: 50, y: 50 }); // => true
  SVGPathCommander.isPointInPath("M0 0L100 0L100 100L0 100Z", { x: 150, y: 50 }); // => false
  ```
- **SVGPathCommander.getSegmentOfPoint(_path_: PathArray | string, _point_: { x: number, y: number })** - returns the segment that contains a given _{x,y}_ point, with the segment metadata and its frame;
  ```js
  SVGPathCommander.getSegmentOfPoint("M10 90C25 80,25 50,40 10", { x: 10, y: 90 });
  // => { segment: ['M', 10, 90], index: 0, length: 0, lengthAtSegment: 0,
  //      point: { x: 10, y: 90 }, tangent: { x: 0, y: 0 },
  //      normal: { x: 0, y: 0 }, angle: 0 }
  ```
- **SVGPathCommander.getSegmentAtLength(_path_: PathArray | string, _distance_: number)** - returns the segment reached by a given distance;
  ```js
  SVGPathCommander.getSegmentAtLength("M10 80a6 4 10 1 0 8 0", 15);
  // => ['a', 6, 4, 10, 1, 0, 8, 0]
  ```
- **SVGPathCommander.equalizePaths(_path1_: PathArray | string, _path2_: PathArray | string, _options_: PathsEqualizationOptions)** - equalizes two paths for morphing, supports multi-subpath paths; returns a tuple of two equalized _PathArrays_;
  ```js
  const [eq1, eq2] = SVGPathCommander.equalizePaths(
    "M0 0L100 0L50 100Z",
    "M0 0L100 0L100 100L0 100Z",
    { close: true },
  );
  // eq1.length === eq2.length === 6
  ```
  Multi-subpath paths are classified into outer contours and holes. Outer contours only match outer
  contours and holes only match holes. The paths are reversed as whole paths, so the outer/hole
  relationships are preserved, and an unmatched contour receives a placeholder at its own centroid
  instead of being dropped.
- **SVGPathCommander.equalizeSegments(_path1_: PathArray | string, _path2_: PathArray | string, _options_: EqualizationOptions)** - equalizes two single-subpath paths for morphing; returns a tuple of two equalized _MorphPathArrays_;
  ```js
  const [eq1, eq2] = SVGPathCommander.equalizeSegments(
    "M0 0L100 0L50 100Z",
    "M0 0L100 0L100 100L0 100Z",
  );
  // eq1.length === eq2.length === 6
  ```
- **SVGPathCommander.equalize(_path1_: PathArray | string, _path2_: PathArray | string, _options_: EqualizeOptions)** - equalizes two paths for morphing, the recommended entry point: a path with a single sub-path is equalized on its own, a path with more sub-paths is split into sub-paths, the sub-paths are matched by their shape and every pair is equalized on its own; returns a tuple of two equalized _PathArrays_;
  ```js
  const [eq1, eq2] = SVGPathCommander.equalize("M0 0L100 0L50 100Z", "M0 0L100 0L100 100L0 100Z", {
    strategy: "arcLength",
  });
  // eq1.length === eq2.length === 6
  ```
  The `points` option is the number of points of the result, the `strategy` option decides how the points are placed (`segment` splits the segments of the paths, `arcLength` distributes the points along the path length and keeps the source segment boundaries and corners when the requested count allows it), the `align` option turns the rotation of the points of the second path off, the `reverse` option decides what happens when the two paths draw in opposite directions (`true` reverses the second path, `false` leaves the paths as they are, `auto` reverses the path that leaves the two paths closest to each other), and the `mode` option decides the type of the segments of the result (`auto` uses lines when both paths are polylines and curves otherwise). Closed contours keep their `Z` commands by default, open paths stay open, and a mixed pair is closed on both sides; `close: false` leaves both results open.
- **SVGPathCommander.pathsIntersection(_path1_: string | PathArray, _path2_: string | PathArray, _justCount_?: boolean)** - returns the number of intersection points between two paths by default; pass `false` for `_justCount_` to return the intersection points instead;
  ```js
  SVGPathCommander.pathsIntersection("M0 50C0 0,100 0,100 50", "M50 0C100 0,100 100,50 100");
  // => 1
  SVGPathCommander.pathsIntersection("M0 50C0 0,100 0,100 50", "M50 0C100 0,100 100,50 100", false);
  // => [{ x: 80.4136, y: 19.5864, t1: 0.7262, t2: 0.2738 }]
  ```
- **SVGPathCommander.boundingBoxIntersect(_a_: BBoxMaxima, _b_: BBoxMaxima)** - checks if two bounding boxes intersect;
  ```js
  SVGPathCommander.boundingBoxIntersect([0, 0, 50, 50], [25, 25, 100, 100]); // => true
  ```
- **SVGPathCommander.isPointInsideBBox(_bbox_: BBoxMaxima, _point_: PointTuple)** - checks if a point is inside or on the edge of a bounding box;
  ```js
  SVGPathCommander.isPointInsideBBox([0, 0, 50, 50], [25, 25]); // => true
  ```
- **SVGPathCommander.isPathArray(_path_: PathArray)** - checks if a value is a _PathArray_;
  ```js
  SVGPathCommander.isPathArray([
    ["M", 0, 0],
    ["L", 10, 0],
  ]); // => true
  ```
- **SVGPathCommander.isAbsoluteArray(_path_: PathArray)** - checks if a _PathArray_ has only absolute path commands;
  ```js
  SVGPathCommander.isAbsoluteArray([
    ["M", 0, 0],
    ["L", 10, 0],
  ]); // => true
  ```
- **SVGPathCommander.isRelativeArray(_path_: PathArray)** - checks if a _PathArray_ has only relative path commands;
  ```js
  SVGPathCommander.isRelativeArray([
    ["M", 0, 0],
    ["l", 10, 0],
  ]); // => true
  ```
- **SVGPathCommander.isNormalizedArray(_path_: PathArray)** - checks if a _PathArray_ has only normalized path commands;
- **SVGPathCommander.isCurveArray(_path_: PathArray)** - checks if a _PathArray_ has only `M` and `C` path commands;
  ```js
  SVGPathCommander.isCurveArray([
    ["M", 0, 0],
    ["C", 5, 5, 10, 5, 10, 0],
  ]); // => true
  ```
- **SVGPathCommander.isPolygonArray(_path_: PathArray)** - checks if a _PathArray_ is a closed polygon;
  ```js
  SVGPathCommander.isPolygonArray([["M", 0, 0], ["L", 10, 0], ["L", 10, 10], ["Z"]]); // => true
  ```
- **SVGPathCommander.isPolylineArray(_path_: PathArray)** - checks if a _PathArray_ is an open polyline;
  ```js
  SVGPathCommander.isPolylineArray([
    ["M", 0, 0],
    ["L", 10, 0],
    ["L", 10, 10],
  ]); // => true
  ```
- **SVGPathCommander.isMultiPath(_path_: PathArray | string)** - checks if a path has multiple subpaths;
  ```js
  SVGPathCommander.isMultiPath("M2 0H4ZM6 0H8Z"); // => true
  ```
- **SVGPathCommander.isClosedPath(_path_: PathArray)** - checks if a path is closed;
  ```js
  SVGPathCommander.isClosedPath([["M", 0, 0], ["L", 10, 0], ["L", 10, 10], ["Z"]]); // => true
  ```
- **SVGPathCommander.samplePolygon(_path_: NormalArray)** - samples the endpoints of the path segments into a polygon approximation;
  ```js
  SVGPathCommander.samplePolygon(SVGPathCommander.pathToAbsolute("M0 0L10 0L10 10Z"));
  // => [[0, 0], [10, 0], [10, 10], [0, 0]]
  ```
- **SVGPathCommander.version** - the current library version.
  ```js
  SVGPathCommander.version; // => "2.4.0"
  ```

## Empty and Malformed Input

Every static method has a defined answer for an empty path, so a tool never throws because the
caller had nothing to give it:

| Call                                       | Result                                            |
| ------------------------------------------ | ------------------------------------------------- |
| `getPathBBox([])`                          | a zeroed bounding box                             |
| `getPointAtLength([], 10)`                 | `{ x: 0, y: 0 }`                                  |
| `getClosestPoint([], { x: 0, y: 0 })`      | `{ x: 0, y: 0 }`                                  |
| `getPropertiesAtPoint([], { x: 0, y: 0 })` | `{ closest: { x: 0, y: 0 }, distance: Infinity }` |
| `getPropertiesAtLength([])`                | `{ segment: ["M", 0, 0], index: 0, ... }`         |
| `getSegmentOfPoint([], { x: 0, y: 0 })`    | `undefined`                                       |
| `isClosedPath([])`                         | `false`                                           |
| `isPointInStroke([], { x: 0, y: 0 })`      | `false`                                           |
| `isPointInPath([], { x: 0, y: 0 })`        | `false`                                           |
| `isValidPath("   ")`                       | `false`                                           |

A negative distance is not an error either — it takes the same early return as a distance of `0`.
A malformed segment (`[[]]` or `[[1, 2, 3]]`) throws a `TypeError` naming the index of the
offending segment.

A path that does not begin with a moveto command is in error, as the SVG spec says, so the parser
rejects it with a `TypeError` — for a path string and for a path array alike:

```js
SVGPathCommander.parsePathString("L10 10");
// => TypeError: SVGPathCommanderError: path data must begin with a moveto command
```

A leading _relative_ moveto is the one exception: it is a pair of absolute coordinates, so it is
rewritten as an absolute one — `parsePathString("m10 10")` answers `[["M", 10, 10]]`.

The copy-based path processors and queries leave their source path unchanged: `roundPath`, `matchPaths` and
`transformPath` all work on copies. `iterate()` is the explicit exception and updates the path array it
receives. The chainable `SVGPathCommander` instance methods intentionally replace the path of their
instance.

## Utility Functions

The standalone tools are also exported as individual, tree-shakeable functions from the `svg-path-commander/util` entry, including the morphing and intersection tools:

```js
import {
  equalize,
  getPathBBox,
  parsePathString,
  pathsIntersection,
  resamplePath,
} from "svg-path-commander/util";

parsePathString("M0 0L50 0");
// => [['M', 0, 0], ['L', 50, 0]]
```

| Entry point               | Holds                                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `svg-path-commander`      | the `SVGPathCommander` class, its static methods and the public types                                                      |
| `svg-path-commander/util` | every standalone tool — parsing, conversion, geometry, processing, morphing and intersection — in one tree-shakeable entry |

The class holds every engine as a static field, so the main entry includes the morphing and intersection implementations. The utility entry exposes those tools as standalone functions, and a bundler drops the exports an application does not use.

### Utility exports

The `svg-path-commander/util` entry exports the parser, conversion, processing, geometry-query, morphing and intersection helpers without the class:

| Function                | Description                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| `parsePathString`       | Returns a `PathArray` from a path string                              |
| `pathToString`          | Returns the string of a `PathArray`                                   |
| `pathToAbsolute`        | Returns a new `PathArray` with absolute coordinates                   |
| `pathToRelative`        | Returns a new `PathArray` with relative coordinates                   |
| `pathToCurve`           | Returns a new `PathArray` with `C` segments and absolute values       |
| `normalizePath`         | Returns a new `PathArray` without shorthand segments                  |
| `optimizePath`          | Returns a new `PathArray` with shortest-string segments               |
| `simplifyPath`          | Returns a new `PathArray` simplified within a tolerance               |
| `offsetPath`            | Returns a new `PathArray` offset along its normals                    |
| `reversePath`           | Returns a new `PathArray` with reversed segments                      |
| `reverseSubPath`        | Returns a new `PathArray` with one sub-path reversed                  |
| `joinPath`              | Returns a new `PathArray` with two paths joined                       |
| `reverseCurve`          | Returns a new reversed `PathArray` of curve segments only             |
| `transformPath`         | Returns a new `PathArray` with transformed segments                   |
| `roundPath`             | Returns a new `PathArray` with rounded values                         |
| `splitPath`             | Returns an array of `PathArray` items                                 |
| `getTotalLength`        | Returns the total path length                                         |
| `getPointAtLength`      | Returns the `{x,y}` point at a given distance                         |
| `getPropertiesAtLength` | Returns the segment, length and frame properties at a distance        |
| `getPropertiesAtPoint`  | Returns the closest point and segment for a given point               |
| `getClosestPoint`       | Returns the `{x,y}` point closest to a given point                    |
| `getSegmentAtLength`    | Returns the segment at a given distance                               |
| `getSegmentOfPoint`     | Returns the segment containing a given point                          |
| `getPathBBox`           | Returns the path bounding box                                         |
| `getPathArea`           | Returns the total area of a shape                                     |
| `getDrawDirection`      | Returns `true` if a shape draws clockwise                             |
| `isPointInStroke`       | Checks if a point is along the stroke                                 |
| `isPointInPath`         | Checks if a point is inside the filled shape of a path                |
| `isPathArray`           | Checks if a value is a `PathArray`                                    |
| `isAbsoluteArray`       | Checks for absolute path commands only                                |
| `isRelativeArray`       | Checks for relative path commands only                                |
| `isNormalizedArray`     | Checks for normalized path commands only                              |
| `isCurveArray`          | Checks for `M` and `C` path commands only                             |
| `isPolygonArray`        | Checks if a `PathArray` is a closed polygon                           |
| `isPolylineArray`       | Checks if a `PathArray` is an open polyline                           |
| `isMultiPath`           | Checks if a path has multiple subpaths                                |
| `isClosedPath`          | Checks if a path is closed                                            |
| `isValidPath`           | Checks if a path string is valid                                      |
| `shapeToPath`           | Returns a new `<path>` element from a shape element                   |
| `shapeToPathArray`      | Returns a `PathArray` from a shape element                            |
| `fixPath`               | Returns a copy of a path without an unnecessary `Z` segment           |
| `splitCubicSegment`     | Splits a cubic Bézier segment into two cubic segments                 |
| `equalize`              | Equalizes two paths for morphing, the recommended entry point         |
| `equalizePaths`         | Equalizes two single- or multi-subpath paths for morphing             |
| `equalizeSegments`      | Equalizes two single-subpath paths for morphing                       |
| `resamplePath`          | Returns a new `PathArray` with points distributed along each sub-path |
| `pathsIntersection`     | Returns the intersection count or points between two paths            |
| `boundingBoxIntersect`  | Checks if two bounding boxes intersect                                |
| `isPointInsideBBox`     | Checks if a point is inside a bounding box                            |

The utility entry also exposes the following low-level tools:

| Function             | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| `arcTools`           | Geometry helpers for elliptical arcs                          |
| `bezierTools`        | Geometry helpers for generic Bézier curves                    |
| `cubicTools`         | Geometry helpers for cubic Bézier curves                      |
| `lineTools`          | Geometry helpers for straight lines                           |
| `quadTools`          | Geometry helpers for quadratic Bézier curves                  |
| `polygonTools`       | Geometry helpers for polygons                                 |
| `distanceSquareRoot` | Returns the distance between two points                       |
| `midPoint`           | Returns the point at a ratio between two points               |
| `rotateVector`       | Rotates a 2D vector by an angle in radians                    |
| `roundTo`            | Rounds a number to a number of decimal places                 |
| `finalizeSegment`    | Finalizes a parsed path segment                               |
| `invalidPathValue`   | Reports an invalid path value                                 |
| `isArcCommand`       | Checks whether a command is an elliptical arc                 |
| `isDigit`            | Checks whether a character is a decimal digit                 |
| `isDigitStart`       | Checks whether a character can start a number                 |
| `isMoveCommand`      | Checks whether a command is a moveto                          |
| `isPathCommand`      | Checks whether a command is a valid path command              |
| `isSpace`            | Checks whether a character is SVG path whitespace             |
| `paramsCounts`       | Holds the parameter count of every path command               |
| `paramsParser`       | Holds the mutable coordinates and controls used by the parser |
| `PathParser`         | Provides the low-level path string scanner state              |
| `scanFlag`           | Scans an elliptical-arc flag                                  |
| `scanParam`          | Scans a numeric path parameter                                |
| `scanSegment`        | Scans one path segment                                        |
| `skipSpaces`         | Advances the parser past SVG path whitespace                  |
| `distanceEpsilon`    | Holds the distance tolerance used by the point queries        |
| `shapeParams`        | Holds the shape-specific attributes read by the shape tools   |
| `getSVGMatrix`       | Builds a DOMMatrix-compatible transformation matrix           |
| `iterate`            | Iterates over the segments of a path and updates it in place  |
| `absolutizeSegment`  | Converts one segment to absolute coordinates                  |
| `arcToCubic`         | Converts an elliptical arc to a cubic Bézier                  |
| `lineToCubic`        | Converts a line to a cubic Bézier                             |
| `normalizeSegment`   | Normalizes one path segment                                   |
| `projection2d`       | Projects a 3D point into the SVG 2D coordinate system         |
| `quadToCubic`        | Converts a quadratic Bézier to a cubic Bézier                 |
| `relativizeSegment`  | Converts one segment to relative coordinates                  |
| `roundSegment`       | Rounds the values of one segment                              |
| `segmentToCubic`     | Converts one segment to a cubic Bézier when applicable        |
| `shortenSegment`     | Converts one segment to its shortest equivalent command       |
