/*!
* SVGPathCommander v2.3.3 (http://thednp.github.io/svg-path-commander)
* Copyright 2026 © thednp
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/
import CSSMatrix from "@thednp/dommatrix";
//#region src/interface.d.ts
/** The properties of a path segment found by segment lookup utilities. */
type SegmentProperties = {
  /** The path segment. */
  segment: PathSegment;
  /** The index of the segment in the path. */
  index: number;
  /** The length of the segment. */
  length: number;
  /** The distance from the start of the path to the end of the segment. */
  lengthAtSegment: number;
};
/** The closest point on the path to a given point, with the distance and optional segment. */
type PointProperties = {
  /** The closest point on the path to the given point. */
  closest: {
    /** The X coordinate of the closest point. */
    x: number;
    /** The Y coordinate of the closest point. */
    y: number;
  };
  /** The distance from the given point to the closest point on the path. */
  distance: number;
  /** The segment which contains the closest point. */
  segment?: SegmentProperties;
};
/** The attributes of a `<line>` element read by `shapeToPath`. */
type LineAttr = {
  /** The element type. */
  type: "line";
  /** The X coordinate of the start point. */
  x1: number;
  /** The Y coordinate of the start point. */
  y1: number;
  /** The X coordinate of the end point. */
  x2: number;
  /** The Y coordinate of the end point. */
  y2: number;
  [key: string]: string | number;
};
/** The attributes of a `<polygon>` or `<polyline>` element read by `shapeToPath`. */
type PolyAttr = {
  /** The element type. */
  type: "polygon" | "polyline";
  /** The points attribute value. */
  points: string;
  [key: string]: string | number;
};
/** The attributes of a `<circle>` element read by `shapeToPath`. */
type CircleAttr = {
  /** The element type. */
  type: "circle";
  /** The X coordinate of the center. */
  cx: number;
  /** The Y coordinate of the center. */
  cy: number;
  /** The circle radius. */
  r: number;
  [key: string]: string | number;
};
/** The attributes of an `<ellipse>` element read by `shapeToPath`. */
type EllipseAttr = {
  /** The element type. */
  type: "ellipse";
  /** The X coordinate of the center. */
  cx: number;
  /** The Y coordinate of the center. */
  cy: number;
  /** The X axis radius. */
  rx: number;
  /** The Y axis radius. */
  ry?: number;
  [key: string]: string | number | undefined;
};
/** The attributes of a `<rect>` element read by `shapeToPath`. */
type RectAttr = {
  /** The element type. */
  type: "rect";
  /** The rectangle width. */
  width: number;
  /** The rectangle height. */
  height: number;
  /** The X coordinate of the top-left corner. */
  x: number;
  /** The Y coordinate of the top-left corner. */
  y: number;
  /** The X axis corner radius. */
  rx?: number;
  /** The Y axis corner radius. */
  ry?: number;
  [key: string]: string | number | undefined;
};
/** The attributes of a `<glyph>` element read by `shapeToPath`. */
type GlyphAttr = {
  /** The element type. */
  type: "glyph";
  /** The path data of the glyph. */
  d: string;
  [key: string]: string | number;
};
/** The parameter names read from each SVG shape element by `shapeToPath`. */
type ShapeParams = {
  /** The parameter names read from the `<line>` element. */
  line: ["x1", "y1", "x2", "y2"];
  /** The parameter names read from the `<circle>` element. */
  circle: ["cx", "cy", "r"];
  /** The parameter names read from the `<ellipse>` element. */
  ellipse: ["cx", "cy", "rx", "ry"];
  /** The parameter names read from the `<rect>` element. */
  rect: ["width", "height", "x", "y", "rx", "ry"];
  /** The parameter names read from the `<polygon>` element. */
  polygon: ["points"];
  /** The parameter names read from the `<polyline>` element. */
  polyline: ["points"];
  /** The parameter names read from the `<glyph>` element. */
  glyph: ["d"];
};
/** The bounding box of a path, equivalent to the native `getBBox()` result. */
type PathBBox = {
  /** The width of the bounding box. */
  width: number;
  /** The height of the bounding box. */
  height: number;
  /** The X coordinate of the top-left corner. */
  x: number;
  /** The Y coordinate of the top-left corner. */
  y: number;
  /** The X coordinate of the bottom-right corner. */
  x2: number;
  /** The Y coordinate of the bottom-right corner. */
  y2: number;
  /** The X coordinate of the center. */
  cx: number;
  /** The Y coordinate of the center. */
  cy: number;
  /** The Z coordinate of the center, used as transform origin for 3D projections. */
  cz: number;
};
/** The minimum and maximum points of a segment bounding box. */
type SegmentLimits = {
  /** The minimum coordinates of the segment. */
  min: {
    /** The minimum X coordinate. */
    x: number;
    /** The minimum Y coordinate. */
    y: number;
  };
  /** The maximum coordinates of the segment. */
  max: {
    /** The maximum X coordinate. */
    x: number;
    /** The maximum Y coordinate. */
    y: number;
  };
};
/** The current state tracked by the SVG path string parser. */
type ParserParams = {
  /** The X coordinate of the previous moveto point. */
  mx: number;
  /** The Y coordinate of the previous moveto point. */
  my: number;
  /** The X coordinate of the previous control point. */
  x1: number;
  /** The Y coordinate of the previous control point. */
  y1: number;
  /** The X coordinate of the second control point. */
  x2: number;
  /** The Y coordinate of the second control point. */
  y2: number;
  /** The X coordinate of the current point. */
  x: number;
  /** The Y coordinate of the current point. */
  y: number;
  /** The X coordinate of the previous quadratic control point. */
  qx: number | null;
  /** The Y coordinate of the previous quadratic control point. */
  qy: number | null;
};
/** The result of a length computation factory: length, point and segment limits. */
type LengthFactory = {
  /** The total length of the segment. */
  length: number;
  /** The point on the segment at the given length. */
  point: {
    /** The X coordinate of the point at the given length. */
    x: number;
    /** The Y coordinate of the point at the given length. */
    y: number;
  };
  /** The minimum coordinates of the segment. */
  min: {
    /** The minimum X coordinate of the segment. */
    x: number;
    /** The minimum Y coordinate of the segment. */
    y: number;
  };
  /** The maximum coordinates of the segment. */
  max: {
    /** The maximum X coordinate of the segment. */
    x: number;
    /** The maximum Y coordinate of the segment. */
    y: number;
  };
};
/** The `SVGPathCommander` instance options. */
type Options = {
  /** The amount of decimals to round path values to, or "off" to disable rounding. */
  round: "off" | number;
  /** The transform origin used for path transformations. */
  origin: number[];
};
/** A path segment and its transformation context (command letter and coordinates). */
type PathTransform = {
  /** The current path segment. */
  s: PathSegment;
  /** The current path command letter. */
  c: string;
  /** The current X coordinate. */
  x: number;
  /** The current Y coordinate. */
  y: number;
};
/** A transform function object with translate, rotate, scale, skew and origin. */
type TransformObject = {
  /** A translate value, a number for all axes or an array of values. */
  translate: number | number[];
  /** A rotate value, a number for all axes or an array of values. */
  rotate: number | number[];
  /** A scale value, a number for all axes or an array of values. */
  scale: number | number[];
  /** A skew value, a number for all axes or an array of values. */
  skew: number | number[];
  /** The transform origin. */
  origin: number[];
};
/** The keys of a `TransformObject`. */
type TransformProps = keyof TransformObject;
/** The entries of a `TransformObject` (key-value pairs). */
type TransformEntries = [TransformProps, TransformObject[TransformProps]][];
//#endregion
//#region src/types.d.ts
/** Whitespace character codes recognized by the SVG path string tokenizer. */
type SpaceNumber = 0x1680 | 0x180e | 0x2000 | 0x2001 | 0x2002 | 0x2003 | 0x2004 | 0x2005 | 0x2006 | 0x2007 | 0x2008 | 0x2009 | 0x200a | 0x202f | 0x205f | 0x3000 | 0xfeff | 0x0a | 0x0d | 0x2028 | 0x2029 | 0x20 | 0x09 | 0x0b | 0x0c | 0xa0 | 0x1680;
/** Character codes of all SVG path command letters. */
type PathCommandNumber = 0x6d | 0x7a | 0x6c | 0x68 | 0x76 | 0x63 | 0x73 | 0x71 | 0x74 | 0x61;
/** Character codes of the decimal digits 0-9. */
type DigitNumber = 0x30 | 0x31 | 0x32 | 0x33 | 0x34 | 0x35 | 0x36 | 0x37 | 0x38 | 0x39;
/** The absolute moveto command letter. */
type MCommand = "M";
/** The relative moveto command letter. */
type mCommand = "m";
/** The absolute lineto command letter. */
type LCommand = "L";
/** The relative lineto command letter. */
type lCommand = "l";
/** The absolute vertical lineto command letter. */
type VCommand = "V";
/** The relative vertical lineto command letter. */
type vCommand = "v";
/** The absolute horizontal lineto command letter. */
type HCommand = "H";
/** The relative horizontal lineto command letter. */
type hCommand = "h";
/** The absolute closepath command letter. */
type ZCommand = "Z";
/** The relative closepath command letter. */
type zCommand = "z";
/** The absolute cubic Bezier command letter. */
type CCommand = "C";
/** The relative cubic Bezier command letter. */
type cCommand = "c";
/** The absolute smooth cubic Bezier command letter. */
type SCommand = "S";
/** The relative smooth cubic Bezier command letter. */
type sCommand = "s";
/** The absolute quadratic Bezier command letter. */
type QCommand = "Q";
/** The relative quadratic Bezier command letter. */
type qCommand = "q";
/** The absolute smooth quadratic Bezier command letter. */
type TCommand = "T";
/** The relative smooth quadratic Bezier command letter. */
type tCommand = "t";
/** The absolute elliptical arc command letter. */
type ACommand = "A";
/** The relative elliptical arc command letter. */
type aCommand = "a";
/** The union of all absolute path command letters. */
type AbsoluteCommand = MCommand | LCommand | VCommand | HCommand | ZCommand | CCommand | SCommand | QCommand | TCommand | ACommand;
/** The union of all relative path command letters. */
type RelativeCommand = mCommand | lCommand | vCommand | hCommand | zCommand | cCommand | sCommand | qCommand | tCommand | aCommand;
/** Any SVG path command letter, absolute or relative. */
type PathCommand = AbsoluteCommand | RelativeCommand;
/** The absolute moveto segment tuple `[M, x, y]`. */
type MSegment = [MCommand, number, number];
/** The relative moveto segment tuple `[m, dx, dy]`. */
type mSegment = [mCommand, number, number];
/** The moveto segment, absolute or relative. */
type MoveSegment = MSegment | mSegment;
/** The absolute lineto segment tuple `[L, x, y]`. */
type LSegment = [LCommand, number, number];
/** The relative lineto segment tuple `[l, dx, dy]`. */
type lSegment = [lCommand, number, number];
/** The lineto segment, absolute or relative. */
type LineSegment = LSegment | lSegment;
/** The absolute vertical lineto segment tuple `[V, y]`. */
type VSegment = [VCommand, number];
/** The relative vertical lineto segment tuple `[v, dy]`. */
type vSegment = [vCommand, number];
/** The vertical lineto segment, absolute or relative. */
type VertLineSegment = vSegment | VSegment;
/** The absolute horizontal lineto segment tuple `[H, x]`. */
type HSegment = [HCommand, number];
/** The relative horizontal lineto segment tuple `[h, dx]`. */
type hSegment = [hCommand, number];
/** The horizontal lineto segment, absolute or relative. */
type HorLineSegment = HSegment | hSegment;
/** The absolute closepath segment tuple `[Z]`. */
type ZSegment = [ZCommand];
/** The relative closepath segment tuple `[z]`. */
type zSegment = [zCommand];
/** The closepath segment, absolute or relative. */
type CloseSegment = ZSegment | zSegment;
/** The absolute cubic Bezier segment tuple `[C, x1, y1, x2, y2, x, y]`. */
type CSegment = [CCommand, number, number, number, number, number, number];
/** The relative cubic Bezier segment tuple `[c, dx1, dy1, dx2, dy2, dx, dy]`. */
type cSegment = [cCommand, number, number, number, number, number, number];
/** The cubic Bezier segment, absolute or relative. */
type CubicSegment = CSegment | cSegment;
/** The absolute smooth cubic Bezier segment tuple `[S, x2, y2, x, y]`. */
type SSegment = [SCommand, number, number, number, number];
/** The relative smooth cubic Bezier segment tuple `[s, dx2, dy2, dx, dy]`. */
type sSegment = [sCommand, number, number, number, number];
/** The smooth cubic Bezier segment, absolute or relative. */
type ShortCubicSegment = SSegment | sSegment;
/** The absolute quadratic Bezier segment tuple `[Q, x1, y1, x, y]`. */
type QSegment = [QCommand, number, number, number, number];
/** The relative quadratic Bezier segment tuple `[q, dx1, dy1, dx, dy]`. */
type qSegment = [qCommand, number, number, number, number];
/** The quadratic Bezier segment, absolute or relative. */
type QuadSegment = QSegment | qSegment;
/** The absolute smooth quadratic Bezier segment tuple `[T, x, y]`. */
type TSegment = [TCommand, number, number];
/** The relative smooth quadratic Bezier segment tuple `[t, dx, dy]`. */
type tSegment = [tCommand, number, number];
/** The smooth quadratic Bezier segment, absolute or relative. */
type ShortQuadSegment = TSegment | tSegment;
/** The absolute elliptical arc segment tuple `[A, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y]`. */
type ASegment = [ACommand, number, number, number, number, number, number, number];
/** The relative elliptical arc segment tuple `[a, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, dx, dy]`. */
type aSegment = [aCommand, number, number, number, number, number, number, number];
/** The elliptical arc segment, absolute or relative. */
type ArcSegment = ASegment | aSegment;
/** Any SVG path command segment. */
type PathSegment = MoveSegment | LineSegment | VertLineSegment | HorLineSegment | CloseSegment | CubicSegment | ShortCubicSegment | QuadSegment | ShortQuadSegment | ArcSegment;
/** Any shorthand or single-coordinate path segment. */
type ShortSegment = VertLineSegment | HorLineSegment | ShortCubicSegment | ShortQuadSegment | CloseSegment;
/** Any absolute path command segment. */
type AbsoluteSegment = MSegment | LSegment | VSegment | HSegment | CSegment | SSegment | QSegment | TSegment | ASegment | ZSegment;
/** Any relative path command segment. */
type RelativeSegment = mSegment | lSegment | vSegment | hSegment | cSegment | sSegment | qSegment | tSegment | aSegment | zSegment;
/** The path segments used by the normalized form (no shorthand commands). */
type NormalSegment = MSegment | LSegment | CSegment | QSegment | ASegment | ZSegment;
/** A parsed SVG path string as an array of path segments. */
type PathArray = [MSegment | mSegment, ...PathSegment[]];
/** A `PathArray` with only absolute path segments. */
type AbsoluteArray = [MSegment, ...AbsoluteSegment[]];
/** A `PathArray` with only relative path segments. */
type RelativeArray = [MSegment, ...RelativeSegment[]];
/** A `PathArray` with only normalized segments (no shorthand commands). */
type NormalArray = [MSegment, ...NormalSegment[]];
/** A `PathArray` with only moveto and cubic Bezier segments. */
type CurveArray = [MSegment, ...CSegment[]];
/** A `CurveArray` ending with a closepath segment. */
type ClosedCurveArray = [MSegment, ...CSegment[], ZSegment];
/** A `PathArray` describing a closed polygon (moveto, lineto and closepath). */
type PolygonArray = [MSegment, ...LSegment[], ZSegment];
/** A `PathArray` describing an open polyline (moveto and lineto). */
type PolylineArray = [MSegment, ...LSegment[]];
/** The `PathArray` shapes supported by path morphing. */
type MorphPathArray = PolygonArray | PolylineArray | CurveArray | ClosedCurveArray;
/** The SVG element types that can be converted to a path. */
type ShapeTypes = SVGPolylineElement | SVGPolygonElement | SVGLineElement | SVGEllipseElement | SVGCircleElement | SVGRectElement;
/** The tag names of the SVG elements that can be converted to a path. */
type ShapeTags = "line" | "polyline" | "polygon" | "ellipse" | "circle" | "rect" | "glyph";
/** The shape attributes mapped to each supported SVG element type. */
type ShapeOps = LineAttr | PolyAttr | PolyAttr | EllipseAttr | CircleAttr | RectAttr | GlyphAttr;
/** A `TransformObject` with a required 3D origin. */
type TransformObjectValues = Partial<TransformObject> & {
  /** The transform origin. */
  origin: [number, number, number];
};
/** A 2D point with `x` and `y` coordinates. */
type Point = {
  /** The X coordinate. */
  x: number;
  /** The Y coordinate. */
  y: number;
};
/** A 2D point as a tuple `[x, y]`. */
type PointTuple = [number, number];
/** A `Point` with a `t` parameter (a point on a curve at ratio `t`). */
type DerivedPoint = Point & {
  /** The parameter ratio in `[0-1]`. */
  t: number;
};
/** The six points of a quadratic Bezier curve (on-curve and off-curve control points). */
type QuadPoints = [Point, Point, Point, Point, Point, Point];
/** The eight points of a cubic Bezier curve (on-curve and off-curve control points). */
type CubicPoints = [Point, Point, Point, Point, Point, Point, Point, Point];
/** The six derived points of a quadratic Bezier curve, each with a `t` parameter. */
type DerivedQuadPoints = [DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint];
/** The eight derived points of a cubic Bezier curve, each with a `t` parameter. */
type DerivedCubicPoints = [DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint];
/** The six coordinates of a quadratic Bezier segment `[x1, y1, cx, cy, x, y]`. */
type QuadCoordinates = [number, number, number, number, number, number];
/** The eight coordinates of a cubic Bezier segment. */
type CubicCoordinates = [number, number, number, number, number, number, number, number];
/** The coordinates of an arc segment (the eight numbers after the command letter). */
type ArcCoordinates = [number, number, number, number, number, number, number, number, number];
/** The four coordinates of a line segment `[x1, y1, x2, y2]`. */
type LineCoordinates = [number, number, number, number];
/** A function that derives a point on a curve at a given `t` ratio. */
type DeriveCallback = (t: number) => Point;
/** A callback invoked for each segment while iterating over a `PathArray`. */
type IteratorCallback<T extends PathArray, K extends keyof T = number> = (segment: PathSegment & T[K], index: number, lastX: number, lastY: number) => PathSegment | T[K] | false | void | undefined;
/** The bounding box extremes `[minX, minY, maxX, maxY]`. */
type BBoxMaxima = [minX: number, minY: number, maxX: number, maxY: number];
/** A point on the path at a given length, including the `t` ratio. */
type PointAtLength = {
  /** The X coordinate. */
  x: number;
  /** The Y coordinate. */
  y: number;
  /** The parameter ratio in `[0-1]`. */
  t: number;
};
/** An intersection point between two curves, including both `t` ratios. */
type IntersectionPoint = {
  /** The X coordinate of the intersection point. */
  x: number;
  /** The Y coordinate of the intersection point. */
  y: number;
  /** The parameter ratio of the first curve. */
  t1: number;
  /** The parameter ratio of the second curve. */
  t2: number;
};
/** Options for computing intersections between two curves. */
interface IntersectionOptions {
  /** Whether to only count the intersections without computing points. */
  justCount?: boolean;
  /** The epsilon value used for precision. */
  epsilon?: number;
}
/** Options for equalizing a single path to a given segment count. */
interface PathEqualizationOptions {
  /** The equalization mode. @default "auto" */
  mode?: "line" | "curve" | "auto";
  /** The number of sample points for the line mode. */
  sampleSize?: number;
  /** The amount of decimals to round values to. */
  roundValues?: number;
  /** Whether to close the path before equalization. */
  close?: boolean;
}
/** Options for equalizing two paths for morphing. */
interface EqualizationOptions {
  /** The equalization mode. @default "auto" */
  mode?: "curve" | "auto";
  /** The number of sample points for the line mode. */
  sampleSize?: number;
  /** The amount of decimals to round values to. */
  roundValues?: number;
  /** Whether to reverse the second path before equalization. */
  reverse?: boolean;
  /** Whether to close the path before equalization. */
  close?: boolean;
  /** The target segment count for both paths. */
  target?: number;
}
/** `EqualizationOptions` without `reverse` and `target`, used for path pairs. */
type PathsEqualizationOptions = Omit<EqualizationOptions, "reverse" | "target">;
/** The geometric features of a path used for matching during morphing. */
interface PathFeature {
  /** Whether the path is a polygon. */
  isPoly: boolean;
  /** The normalized path array. */
  path: NormalArray;
  /** The number of segments in the path. */
  size: number;
  /** The absolute area of the path. */
  area: number;
  /** The signed area of the path, negative for clockwise direction. */
  signedArea: number;
  /** The bounding box of the path. */
  bbox: PathBBox;
}
//#endregion
//#region src/math/distanceSquareRoot.d.ts
/**
 * Returns the square root of the distance
 * between two given points.
 *
 * @param a the first point coordinates
 * @param b the second point coordinates
 * @returns the distance value
 */
declare const distanceSquareRoot: (a: PointTuple, b: PointTuple) => number;
//#endregion
//#region src/math/midPoint.d.ts
/**
 * Returns the coordinates of a specified distance
 * ratio between two points.
 *
 * @param a the first point coordinates
 * @param b the second point coordinates
 * @param t the ratio
 * @returns the midpoint coordinates
 */
declare const midPoint: ([ax, ay]: PointTuple, [bx, by]: PointTuple, t: number) => PointTuple;
//#endregion
//#region src/math/rotateVector.d.ts
/**
 * Returns an {x,y} vector rotated by a given
 * angle in radian.
 *
 * @param x the initial vector x
 * @param y the initial vector y
 * @param rad the radian vector angle
 * @returns the rotated vector
 */
declare const rotateVector: (x: number, y: number, rad: number) => {
  x: number;
  y: number;
};
//#endregion
//#region src/math/roundTo.d.ts
/**
 * Rounds a number to the specified number of decimal places.
 *
 * @param n - The number to round
 * @param round - Number of decimal places
 * @returns The rounded number
 */
declare const roundTo: (n: number, round: number) => number;
//#endregion
//#region src/convert/pathToAbsolute.d.ts
/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to absolute values.
 *
 * @param pathInput - The path string or PathArray
 * @returns The resulted PathArray with absolute values
 *
 * @example
 * ```ts
 * pathToAbsolute('M10 10l80 80')
 * // => [['M', 10, 10], ['L', 90, 90]]
 * ```
 */
declare const pathToAbsolute: <T extends PathArray>(pathInput: string | T) => AbsoluteArray;
//#endregion
//#region src/convert/pathToRelative.d.ts
/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to relative values.
 *
 * @param pathInput - The path string or PathArray
 * @returns The resulted PathArray with relative values
 *
 * @example
 * ```ts
 * pathToRelative('M10 10L90 90')
 * // => [['M', 10, 10], ['l', 80, 80]]
 * ```
 */
declare const pathToRelative: <T extends PathArray>(pathInput: string | T) => RelativeArray;
//#endregion
//#region src/convert/pathToCurve.d.ts
/**
 * Parses a path string or PathArray and returns a new one
 * in which all segments are converted to cubic-bezier.
 *
 * @param pathInput - The path string or PathArray
 * @returns The resulted CurveArray with all segments as cubic beziers
 *
 * @example
 * ```ts
 * pathToCurve('M10 50q15 -25 30 0')
 * // => [['M', 10, 50], ['C', 25, 25, 40, 50, 40, 50]]
 * ```
 */
declare const pathToCurve: <T extends PathArray>(pathInput: string | T) => CurveArray;
//#endregion
//#region src/convert/pathToString.d.ts
/**
 * Returns a valid `d` attribute string value created
 * by rounding values and concatenating the PathArray segments.
 *
 * @param path - The PathArray object
 * @param roundOption - Amount of decimals to round values to, or "off"
 * @returns The concatenated path string
 *
 * @example
 * ```ts
 * pathToString([['M', 10, 10], ['L', 90, 90]], 2)
 * // => 'M10 10L90 90'
 * ```
 */
declare const pathToString: <T extends PathArray>(path: T, roundOption?: number | "off") => string;
//#endregion
//#region src/parser/parsePathString.d.ts
/**
 * Parses a path string value and returns an array
 * of segments we like to call `PathArray`.
 *
 * If parameter value is already a `PathArray`,
 * return a clone of it.
 * @example
 * parsePathString("M 0 0L50 50")
 * // => [["M",0,0],["L",50,50]]
 *
 * @param pathInput the string to be parsed
 * @returns the resulted `pathArray` or error string
 */
declare const parsePathString: <T extends PathArray>(pathInput: string | T) => PathArray;
//#endregion
//#region src/parser/pathParser.d.ts
/**
 * The `PathParser` is used by the `parsePathString` static method
 * to generate a `pathArray`.
 *
 * @param pathString - The SVG path string to parse
 */
declare class PathParser {
  segments: PathArray | PathSegment[];
  pathValue: string;
  max: number;
  index: number;
  param: number;
  segmentStart: number;
  data: (string | number)[];
  err: string;
  constructor(pathString: string);
}
//#endregion
//#region src/parser/finalizeSegment.d.ts
/**
 * Breaks the parsing of a pathString once a segment is finalized.
 *
 * @param path - The PathParser instance
 */
declare const finalizeSegment: (path: PathParser) => void;
//#endregion
//#region src/parser/isArcCommand.d.ts
/**
 * Checks if the character is an A (arc-to) path command.
 *
 * @param code the character to check
 * @returns check result
 */
declare const isArcCommand: (code: number) => code is 97;
//#endregion
//#region src/parser/isDigit.d.ts
/**
 * Checks if a character is a digit.
 *
 * @param code the character to check
 * @returns check result
 */
declare const isDigit: (code: number) => code is DigitNumber;
//#endregion
//#region src/parser/isDigitStart.d.ts
/**
 * Checks if the character is or belongs to a number.
 * [0-9]|+|-|.
 *
 * @param code the character to check
 * @returns check result
 */
declare const isDigitStart: (code: number) => code is DigitNumber | 43 | 45 | 46;
//#endregion
//#region src/parser/isMoveCommand.d.ts
/**
 * Checks if the character is a MoveTo command.
 *
 * @param code the character to check
 * @returns check result
 */
declare const isMoveCommand: (code: number) => code is 109 | 77;
//#endregion
//#region src/parser/isPathCommand.d.ts
/**
 * Checks if the character is a path command.
 *
 * @param code the character to check
 * @returns check result
 */
declare const isPathCommand: (code: number) => code is PathCommandNumber;
//#endregion
//#region src/parser/isSpace.d.ts
/**
 * Checks if the character is a space.
 *
 * @param ch the character to check
 * @returns check result
 */
declare const isSpace: (ch: number) => ch is SpaceNumber;
//#endregion
//#region src/parser/scanFlag.d.ts
/**
 * Validates an A (arc-to) specific path command value.
 * Usually a `large-arc-flag` or `sweep-flag`.
 *
 * @param path - The PathParser instance
 */
declare const scanFlag: (path: PathParser) => void;
//#endregion
//#region src/parser/scanParam.d.ts
/**
 * Validates every character of the path string,
 * every path command, negative numbers or floating point numbers.
 *
 * @param path - The PathParser instance
 */
declare const scanParam: (path: PathParser) => void;
//#endregion
//#region src/parser/scanSegment.d.ts
/**
 * Scans every character in the path string to determine
 * where a segment starts and where it ends.
 *
 * @param path - The PathParser instance
 */
declare const scanSegment: (path: PathParser) => void;
//#endregion
//#region src/parser/skipSpaces.d.ts
/**
 * Points the parser to the next character in the
 * path string every time it encounters any kind of
 * space character.
 *
 * @param path - The PathParser instance
 */
declare const skipSpaces: (path: PathParser) => void;
//#endregion
//#region src/util/getPathBBox.d.ts
/**
 * Calculates the bounding box of a path.
 *
 * @param pathInput - The path string or PathArray
 * @returns An object with width, height, x, y, x2, y2, cx, cy, cz properties
 *
 * @example
 * ```ts
 * getPathBBox('M0 0L100 0L100 100L0 100Z')
 * // => { x: 0, y: 0, width: 100, height: 100, x2: 100, y2: 100, cx: 50, cy: 50, cz: 150 }
 * ```
 */
declare const getPathBBox: <T extends PathArray>(pathInput: T | string) => {
  x: number;
  y: number;
  width: number;
  height: number;
  x2: number;
  y2: number;
  cx: number;
  cy: number;
  cz: number;
};
//#endregion
//#region src/util/getTotalLength.d.ts
/**
 * Returns the total length of a path, equivalent to `shape.getTotalLength()`.
 *
 * @param pathInput - The target path string or PathArray
 * @returns The total length of the path
 *
 * @example
 * ```ts
 * getTotalLength('M0 0L100 0L100 100L0 100Z')
 * // => 300
 * ```
 */
declare const getTotalLength: <T extends PathArray>(pathInput: string | T) => number;
//#endregion
//#region src/util/getClosestPoint.d.ts
/**
 * Returns the point in path closest to a given point.
 *
 * @param pathInput target `pathArray`
 * @param point the given point
 * @returns the best match
 */
declare const getClosestPoint: (pathInput: string | PathArray, point: {
  x: number;
  y: number;
}) => {
  x: number;
  y: number;
};
//#endregion
//#region src/util/getDrawDirection.d.ts
/**
 * Check if a path is drawn clockwise and returns true if so,
 * false otherwise.
 *
 * @param path the path string or `pathArray`
 * @returns true when clockwise or false if not
 */
declare const getDrawDirection: (path: string | PathArray) => boolean;
//#endregion
//#region src/util/getPathArea.d.ts
/**
 * Returns the signed area of a shape.
 *
 * @author Jürg Lehni & Jonathan Puckey
 *
 * @see https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
 *
 * @param path - The shape PathArray
 * @returns The signed area of the shape (positive for clockwise, negative for counter-clockwise)
 *
 * @example
 * ```ts
 * getPathArea([['M', 0, 0], ['L', 100, 0], ['L', 100, 100], ['L', 0, 100], ['Z']])
 * // => -10000 (counter-clockwise square)
 * ```
 */
declare const getPathArea: <T extends PathArray | string>(path: T) => number;
//#endregion
//#region src/util/getPointAtLength.d.ts
/**
 * Returns [x,y] coordinates of a point at a given length along a path.
 *
 * @param pathInput - The PathArray or path string to look into
 * @param distance - The distance along the path
 * @returns The requested {x, y} point coordinates
 *
 * @example
 * ```ts
 * getPointAtLength('M0 0L100 0L100 100Z', 50)
 * // => { x: 50, y: 0 }
 * ```
 */
declare const getPointAtLength: <T extends PathArray>(pathInput: string | T, distance?: number) => {
  x: number;
  y: number;
};
//#endregion
//#region src/util/getPropertiesAtLength.d.ts
/**
 * Returns the segment, its index and length as well as
 * the length to that segment at a given length in a path.
 *
 * @param pathInput target `pathArray`
 * @param distance the given length
 * @returns the requested properties
 */
declare const getPropertiesAtLength: <T extends PathArray>(pathInput: string | T, distance?: number) => SegmentProperties;
//#endregion
//#region src/util/getPropertiesAtPoint.d.ts
/**
 * Returns the point and segment in path closest to a given point as well as
 * the distance to the path stroke.
 *
 * @see https://bl.ocks.org/mbostock/8027637
 *
 * @param pathInput target `pathArray`
 * @param point the given point
 * @returns the requested properties
 */
declare const getPropertiesAtPoint: <T extends PathArray>(pathInput: string | T, point: Point) => PointProperties;
//#endregion
//#region src/util/getSegmentAtLength.d.ts
/**
 * Returns the segment at a given length.
 *
 * @param pathInput the target `pathArray`
 * @param distance the distance in path to look at
 * @returns the requested segment
 */
declare const getSegmentAtLength: <T extends PathArray>(pathInput: string | T, distance?: number) => PathSegment | undefined;
//#endregion
//#region src/util/getSegmentOfPoint.d.ts
/**
 * Returns the path segment which contains a given point.
 *
 * @param path the `pathArray` to look into
 * @param point the point of the shape to look for
 * @returns the requested segment
 */
declare const getSegmentOfPoint: <T extends PathArray>(path: string | T, point: {
  x: number;
  y: number;
}) => SegmentProperties | undefined;
//#endregion
//#region src/util/isAbsoluteArray.d.ts
/**
 * Iterates an array to check if it's a `pathArray`
 * with all absolute values.
 *
 * @param path the `pathArray` to be checked
 * @returns iteration result
 */
declare const isAbsoluteArray: (path: unknown) => path is AbsoluteArray;
//#endregion
//#region src/util/isPolygonArray.d.ts
/**
 * Checks if a path is a polygon (only M, L, H, V, Z commands).
 * @param pathArray PathArray (pre-normalize if needed)
 * @returns boolean
 */
declare const isPolygonArray: (path: PathArray) => path is PolygonArray;
//#endregion
//#region src/util/isCurveArray.d.ts
/**
 * Iterates an array to check if it's a `pathArray`
 * with all C (cubic bezier) segments.
 *
 * @param path the `Array` to be checked
 * @returns iteration result
 */
declare const isCurveArray: (path: unknown) => path is CurveArray;
//#endregion
//#region src/util/isNormalizedArray.d.ts
/**
 * Iterates an array to check if it's a `pathArray`
 * with all segments in non-shorthand notation
 * with absolute values.
 *
 * @param path - the array to be checked
 * @returns true if the array is a normalized path array
 */
declare const isNormalizedArray: (path: unknown) => path is NormalArray;
//#endregion
//#region src/util/isPathArray.d.ts
/**
 * Iterates an array to check if it's an actual `pathArray`.
 *
 * @param path the `pathArray` to be checked
 * @returns iteration result
 */
declare const isPathArray: (path: unknown) => path is PathArray;
//#endregion
//#region src/util/isPointInStroke.d.ts
/**
 * Checks if a given point is in the stroke of a path.
 *
 * @param pathInput target path
 * @param point the given `{x,y}` point
 * @returns the query result
 */
declare const isPointInStroke: <T extends PathArray>(pathInput: string | T, point: {
  x: number;
  y: number;
}) => boolean;
//#endregion
//#region src/util/isRelativeArray.d.ts
/**
 * Iterates an array to check if it's a `pathArray`
 * with relative values.
 *
 * @param path the `pathArray` to be checked
 * @returns iteration result
 */
declare const isRelativeArray: (path: unknown) => path is RelativeArray;
//#endregion
//#region src/util/isValidPath.d.ts
/**
 * Parses a path string value to determine its validity
 * then returns true if it's valid or false otherwise.
 *
 * @param pathString the path string to be parsed
 * @returns the path string validity
 */
declare const isValidPath: (pathString: string) => boolean;
//#endregion
//#region src/morph/samplePolygon.d.ts
/**
 * Samples points from a path to form a polygon approximation.
 * Collects endpoints of each segment (M start + ends of L/C/etc).
 *
 * If `sampleSize` parameter is provided, it will return a polygon
 * equivalent to the original `PathArray`.
 * @param path `PolygonPathArray` or `CurvePathArray`
 * @returns Array of [x, y] points
 */
declare function samplePolygon<T extends NormalArray>(path: T): PointTuple[];
//#endregion
//#region src/util/shapeToPath.d.ts
/**
 * Returns a new `<path>` element created from attributes of a `<line>`, `<polyline>`,
 * `<polygon>`, `<rect>`, `<ellipse>`, `<circle>` or `<glyph>`. If `replace` parameter
 * is `true`, it will replace the target. The default `ownerDocument` is your current
 * `document` browser page, if you want to use in server-side using `jsdom`, you can
 * pass the `jsdom` `document` to `ownDocument`.
 *
 * It can also work with an options object, see the type below
 * @see ShapeOps
 *
 * The newly created `<path>` element keeps all non-specific
 * attributes like `class`, `fill`, etc.
 *
 * @param element - Target shape element or shape options object
 * @param replace - Option to replace target element
 * @param ownerDocument - Document for creating the element
 * @returns The newly created `<path>` element, or false if the path is invalid
 *
 * @example
 * ```ts
 * const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
 * circle.setAttribute('cx', '50')
 * circle.setAttribute('cy', '50')
 * circle.setAttribute('r', '25')
 * const path = shapeToPath(circle)
 * path.getAttribute('d')
 * // => 'M50 25A25 25 0 1 1 50 75A25 25 0 1 1 50 25Z'
 * ```
 */
declare const shapeToPath: (element: ShapeTypes | ShapeOps, replace?: boolean, ownerDocument?: Document) => SVGPathElement | false;
//#endregion
//#region src/util/shapeToPathArray.d.ts
/**
 * Returns a new `pathArray` created from attributes of a `<line>`, `<polyline>`,
 * `<polygon>`, `<rect>`, `<ellipse>`, `<circle>`, <path> or `<glyph>`.
 *
 * It can also work with an options object, see the type below
 * @see ShapeOps
 *
 * @param element target shape
 * @returns the newly created `<path>` element
 */
declare const shapeToPathArray: (element: ShapeTypes | ShapeOps) => false | PathArray;
//#endregion
//#region src/util/isMultiPath.d.ts
/**
 * Determines if an SVG path contains multiple subpaths.
 * Accepts path string or PathArray.
 * @param path - 'M10,10 L20,20 Z M30,30 L40,40' → true
 * @returns boolean
 */
declare const isMultiPath: <T extends PathArray>(path: string | T) => boolean;
//#endregion
//#region src/util/isPolylineArray.d.ts
/**
 * Checks if a path is a polyline (only M, L, H, V commands).
 * @param pathArray PathArray (pre-normalize if needed)
 * @returns boolean
 */
declare function isPolylineArray(path: PathArray): path is PolylineArray;
//#endregion
//#region src/util/isClosedPath.d.ts
/**
 * Check if a PathArray is closed, which means its last segment is a Z.
 * @param path
 * @returns true if the path is closed
 */
declare const isClosedPath: <T extends PathArray>(path: T) => boolean;
//#endregion
//#region src/process/normalizePath.d.ts
/**
 * Parses a path string or PathArray, then iterates the result for:
 * * converting segments to absolute values
 * * converting shorthand commands to their non-shorthand notation
 *
 * @param pathInput - The path string or PathArray
 * @returns The normalized PathArray
 *
 * @example
 * ```ts
 * normalizePath('M10 90s20 -80 40 -80s20 80 40 80')
 * // => [['M', 10, 90], ['C', 30, 90, 25, 10, 50, 10], ['C', 75, 10, 70, 90, 90, 90]]
 * ```
 */
declare const normalizePath: <T extends string | PathArray>(pathInput: T) => NormalArray;
//#endregion
//#region src/process/optimizePath.d.ts
/**
 * Optimizes a PathArray:
 * * converts segments to shorthand if possible
 * * selects shortest representation from absolute and relative forms
 *
 * @param pathInput - A path string or PathArray
 * @param roundOption - Number of decimal places for rounding
 * @returns The optimized PathArray
 *
 * @example
 * ```ts
 * optimizePath('M10 10L10 10L90 90', 2)
 * // => [['M', 10, 10], ['l', 0, 0], ['l', 80, 80]]
 * ```
 */
declare const optimizePath: <T extends string | PathArray>(pathInput: T, roundOption?: number) => PathArray;
//#endregion
//#region src/process/reversePath.d.ts
/**
 * Reverses all segments of a PathArray and returns a new PathArray
 * with absolute values.
 *
 * @param pathInput - The source PathArray
 * @returns The reversed PathArray
 *
 * @example
 * ```ts
 * reversePath([['M', 0, 0], ['L', 100, 0], ['L', 100, 100], ['L', 0, 100], ['Z']])
 * // => [['M', 0, 100], ['L', 0, 0], ['L', 100, 0], ['L', 100, 100], ['Z']]
 * ```
 */
declare const reversePath: <T extends PathArray>(pathInput: T) => T;
//#endregion
//#region src/process/splitPath.d.ts
/**
 * Split a path string or PathArray into an array of sub-paths.
 *
 * In the process, values are converted to absolute
 * for visual consistency.
 *
 * @param pathInput - The source path string or PathArray
 * @returns An array of sub-path PathArrays
 *
 * @example
 * ```ts
 * splitPath('M0 0L100 0ZM200 0L300 0Z')
 * // => [
 * //   [['M', 0, 0], ['L', 100, 0], ['Z']],
 * //   [['M', 200, 0], ['L', 300, 0], ['Z']]
 * // ]
 * ```
 */
declare const splitPath: <T extends PathArray>(pathInput: T | string) => T[];
//#endregion
//#region src/process/transformPath.d.ts
/**
 * Apply a 2D / 3D transformation to a PathArray.
 *
 * Since SVGElement doesn't support 3D transformation, this function
 * creates a 2D projection of the path element.
 *
 * @param pathInput - The PathArray or path string to transform
 * @param transform - The transform functions object (translate, rotate, skew, scale, origin)
 * @returns The transformed PathArray
 *
 * @example
 * ```ts
 * transformPath('M0 0L100 0L100 100L0 100Z', { translate: [10, 20], scale: 2 })
 * // => [['M', 10, 20], ['L', 210, 20], ['L', 210, 220], ['L', 10, 220], ['Z']]
 * ```
 */
declare const transformPath: <T extends PathArray>(pathInput: T | string, transform?: Partial<TransformObject>) => T | AbsoluteArray;
//#endregion
//#region src/process/absolutizeSegment.d.ts
/**
 * Returns an absolute segment of a `PathArray` object.
 *
 * @param segment the segment object
 * @param index the segment index
 * @param lastX the last known X value
 * @param lastY the last known Y value
 * @returns the absolute segment
 */
declare const absolutizeSegment: (segment: PathSegment, index: number, lastX: number, lastY: number) => AbsoluteSegment;
//#endregion
//#region src/process/arcToCubic.d.ts
/**
 * Converts A (arc-to) segments to C (cubic-bezier-to).
 *
 * For more information of where this math came from visit:
 * http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
 *
 * @param X1 the starting x position
 * @param Y1 the starting y position
 * @param RX x-radius of the arc
 * @param RY y-radius of the arc
 * @param angle x-axis-rotation of the arc
 * @param LAF large-arc-flag of the arc
 * @param SF sweep-flag of the arc
 * @param X2 the ending x position
 * @param Y2 the ending y position
 * @param recursive the parameters needed to split arc into 2 segments
 * @returns the resulting cubic-bezier segment(s)
 */
declare const arcToCubic: (X1: number, Y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, X2: number, Y2: number, recursive?: [number, number, number, number]) => number[];
//#endregion
//#region src/process/getSVGMatrix.d.ts
/**
 * Returns a transformation matrix to apply to `<path>` elements.
 *
 * @see TransformObjectValues
 *
 * @param transform the `transformObject`
 * @returns a new transformation matrix
 */
declare const getSVGMatrix: (transform: TransformObjectValues) => CSSMatrix;
//#endregion
//#region src/process/iterate.d.ts
/**
 * Iterates over a `PathArray`, executing a callback for each segment.
 * The callback can:
 * - Read current position (`x`, `y`)
 * - Modify the segment (return new segment)
 * - Stop early (return `false`)
 *
 * The iterator maintains accurate current point (`x`, `y`) and subpath start (`mx`, `my`)
 * while correctly handling relative/absolute commands, including H/V and Z.
 *
 * **Important**: If the callback returns a new segment with more coordinates (e.g., Q → C),
 * the path length may increase, and iteration will continue over new segments.
 *
 * @template T - Specific PathArray type (e.g., CurveArray, PolylineArray)
 * @param path - The source `PathArray` to iterate over
 * @param iterator - Callback function for each segment
 * @param iterator.segment - Current path segment
 * @param iterator.index - Index of current segment
 * @param iterator.x - Current X position (after applying relative offset)
 * @param iterator.y - Current Y position (after applying relative offset)
 * @returns The modified `path` (or original if no changes)
 *
 * @example
 * iterate(path, (seg, i, x, y) => {
 *   if (seg[0] === 'L') return ['C', x, y, seg[1], seg[2], seg[1], seg[2]];
 * });
 */
declare const iterate: <T extends PathArray>(path: T, iterator: IteratorCallback<T>) => T;
//#endregion
//#region src/process/lineToCubic.d.ts
/**
 * Converts an L (line-to) segment to C (cubic-bezier).
 *
 * @param x1 line start x
 * @param y1 line start y
 * @param x2 line end x
 * @param y2 line end y
 * @returns the cubic-bezier segment
 */
declare const lineToCubic: (x1: number, y1: number, x2: number, y2: number) => number[];
//#endregion
//#region src/process/normalizeSegment.d.ts
/**
 * Normalizes a single segment of a `pathArray` object.
 *
 * @param segment the segment object
 * @param params the normalization parameters
 * @returns the normalized segment
 */
declare const normalizeSegment: (segment: PathSegment, params: ParserParams) => NormalSegment;
//#endregion
//#region src/process/projection2d.d.ts
/**
 * Returns the [x,y] projected coordinates for a given an [x,y] point
 * and an [x,y,z] perspective origin point.
 *
 * Equation found here =>
 * http://en.wikipedia.org/wiki/3D_projection#Diagram
 * Details =>
 * https://stackoverflow.com/questions/23792505/predicted-rendering-of-css-3d-transformed-pixel
 *
 * @param m the transformation matrix
 * @param point2D the initial [x,y] coordinates
 * @param origin the [x,y,z] transform origin
 * @returns the projected [x,y] coordinates
 */
declare const projection2d: (m: CSSMatrix, point2D: PointTuple, origin: [number, number, number]) => PointTuple;
//#endregion
//#region src/process/quadToCubic.d.ts
/**
 * Converts a Q (quadratic-bezier) segment to C (cubic-bezier).
 *
 * @param x1 curve start x
 * @param y1 curve start y
 * @param qx control point x
 * @param qy control point y
 * @param x2 curve end x
 * @param y2 curve end y
 * @returns the cubic-bezier segment
 */
declare const quadToCubic: (x1: number, y1: number, qx: number, qy: number, x2: number, y2: number) => [number, number, number, number, number, number];
//#endregion
//#region src/process/relativizeSegment.d.ts
/**
 * Returns a relative segment of a `PathArray` object.
 *
 * @param segment the segment object
 * @param index the segment index
 * @param lastX the last known X value
 * @param lastY the last known Y value
 * @returns the relative segment
 */
declare const relativizeSegment: (segment: PathSegment, index: number, lastX: number, lastY: number) => MSegment | RelativeSegment;
//#endregion
//#region src/process/reverseCurve.d.ts
/**
 * Reverses all segments of a `pathArray`
 * which consists of only C (cubic-bezier) path commands.
 *
 * @param path the source `pathArray`
 * @returns the reversed `pathArray`
 */
declare const reverseCurve: (path: CurveArray) => CurveArray;
//#endregion
//#region src/process/roundPath.d.ts
/**
 * Rounds the values of a `pathArray` instance to
 * a specified amount of decimals and returns it.
 *
 * @param path the source `pathArray`
 * @param roundOption the amount of decimals to round numbers to
 * @returns the resulted `pathArray` with rounded values
 */
declare const roundPath: <T extends PathArray>(path: T, roundOption?: number | "off") => T;
//#endregion
//#region src/process/roundSegment.d.ts
/**
 * Rounds the numeric values of a path segment to the specified precision.
 *
 * @param segment - The path segment to round
 * @param roundOption - Number of decimal places
 * @returns The rounded segment
 */
declare const roundSegment: <T extends PathSegment>(segment: T, roundOption: number) => T;
//#endregion
//#region src/process/segmentToCubic.d.ts
/**
 * Converts any segment to C (cubic-bezier).
 *
 * @param segment the source segment
 * @param params the source segment parameters
 * @returns the cubic-bezier segment
 */
declare const segmentToCubic: (segment: PathSegment, params: ParserParams) => MSegment | CSegment;
//#endregion
//#region src/process/shortenSegment.d.ts
/**
 * Shorten a single segment of a `pathArray` object.
 *
 * @param segment the `absoluteSegment` object
 * @param normalSegment the `normalSegment` object
 * @param params the coordinates of the previous segment
 * @param prevCommand the path command of the previous segment
 * @returns the shortened segment
 */
declare const shortenSegment: (segment: AbsoluteSegment, normalSegment: NormalSegment, params: ParserParams, prevCommand: PathCommand) => ShortSegment;
//#endregion
//#region src/morph/fixPath.d.ts
/**
 * Checks a `PathArray` for an unnecessary `Z` segment
 * and removes it. The `PathArray` is modified in place.
 * In short, if the segment before `Z` extends to `M`,
 * the `Z` segment must be removed.
 *
 * The `pathInput` must be a single path, without
 * sub-paths. For multi-path `<path>` elements,
 * use `splitPath` first and apply this utility on each
 * sub-path separately.
 *
 * @param pathInput the `pathArray` source
 * @returns void
 */
declare const fixPath: <T extends PathArray>(pathInput: T | string) => void;
//#endregion
//#region src/morph/splitCubicSegment.d.ts
/**
 * Split a cubic Bézier into two cubics at parameter t [0–1].
 *
 * @param x1 - Start point X
 * @param y1 - Start point Y
 * @param x2 - First control point X
 * @param y2 - First control point Y
 * @param x3 - Second control point X
 * @param y3 - Second control point Y
 * @param x4 - End point X
 * @param y4 - End point Y
 * @param t - Parameter in range [0, 1] at which to split
 * @returns Array of two cubic segments, each as [x1,y1, x2,y2, x3,y3, x4,y4]
 */
declare function splitCubicSegment(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, t: number): [CubicCoordinates, CubicCoordinates];
//#endregion
//#region src/morph/equalizeSegments.d.ts
/**
 * Equalizes two paths for morphing (single subpath only).
 *
 * @see https://minus-ze.ro/posts/morphing-arbitrary-paths-in-svg/
 * @param path1 - First path string or PathArray
 * @param path2 - Second path string or PathArray
 * @param initialCfg - Equalization options
 * @returns Tuple of two equalized MorphPathArrays
 *
 * @example
 * ```ts
 * const [eq1, eq2] = equalizeSegments('M0 0L100 0L50 100Z', 'M0 0L100 0L100 100L0 100Z')
 * // eq1.length === eq2.length
 * ```
 */
declare const equalizeSegments: (path1: PathArray | string, path2: PathArray | string, initialCfg?: EqualizationOptions) => [MorphPathArray, MorphPathArray];
//#endregion
//#region src/morph/equalizePaths.d.ts
/**
 * Equalizes two paths for morphing (single/multi subpath).
 *
 * @see https://minus-ze.ro/posts/morphing-arbitrary-paths-in-svg/
 * @param pathInput1 - First path string or PathArray
 * @param pathInput2 - Second path string or PathArray
 * @param initialCfg - Configuration options for equalization
 * @returns Tuple of two equalized MorphPathArrays
 *
 * @example
 * ```ts
 * const [eq1, eq2] = equalizePaths('M0 0L100 0L50 100Z', 'M0 0L100 0L100 100L0 100Z')
 * // eq1.length === eq2.length — ready for morphing
 * ```
 */
declare const equalizePaths: (pathInput1: string | PathArray, pathInput2: string | PathArray, initialCfg?: {}) => [MorphPathArray, MorphPathArray];
//#endregion
//#region src/intersect/pathIntersection.d.ts
/**
 * Finds intersection points between two paths.
 *
 * @param pathInput1 - First path string or PathArray
 * @param pathInput2 - Second path string or PathArray
 * @param justCount - If true, returns the count of intersections; if false, returns the intersection points
 * @returns The number of intersections (when justCount is true) or an array of IntersectionPoint objects
 *
 * @example
 * ```ts
 * pathsIntersection('M0 50C0 0,100 0,100 50', 'M50 0C100 0,100 100,50 100', true)
 * // => 1
 * pathsIntersection('M0 50C0 0,100 0,100 50', 'M50 0C100 0,100 100,50 100', false)
 * // => [{ x: 80.4136, y: 19.5864, t1: 0.7262, t2: 0.2738 }]
 * ```
 */
declare const pathsIntersection: <T extends string | PathArray>(pathInput1: T, pathInput2: T, justCount?: boolean) => number | IntersectionPoint[];
//#endregion
//#region src/intersect/boundingBoxIntersect.d.ts
/**
 * Checks if two bounding boxes intersect.
 *
 * @param a - First bounding box as [minX, minY, maxX, maxY]
 * @param b - Second bounding box as [minX, minY, maxX, maxY]
 * @returns True if the bounding boxes overlap
 */
declare const boundingBoxIntersect: (a: BBoxMaxima, b: BBoxMaxima) => boolean;
//#endregion
//#region src/intersect/isPointInsideBBox.d.ts
/**
 * Checks if a point is inside a bounding box.
 *
 * @param bbox - The bounding box as [minX, minY, maxX, maxY]
 * @param point - The point as [x, y]
 * @returns True if the point is inside or on the edge of the bounding box
 */
declare const isPointInsideBBox: (bbox: BBoxMaxima, [x, y]: PointTuple) => boolean;
//#endregion
//#region src/main.d.ts
/**
 * Creates a new SVGPathCommander instance with the following properties:
 * * segments: `pathArray`
 * * round: number
 * * origin: [number, number, number?]
 *
 * @class
 * @author thednp <https://github.com/thednp/svg-path-commander>
 * @returns a new SVGPathCommander instance
 */
declare class SVGPathCommander {
  /** The parsed PathArray stored on the instance. */
  segments: PathArray;
  /** The rounding option used for the output path string. */
  round: number | "off";
  /** The transform origin used for path transformations. */
  origin: [number, number, number];
  /**
   * @constructor
   * @param pathValue the path string
   * @param config instance options
   */
  constructor(pathValue: string, config?: Partial<Options>);
  /**
   * Returns the path bounding box, equivalent to native `path.getBBox()`.
   *
   * @public
   * @returns the pathBBox
   */
  get bbox(): {
    x: number;
    y: number;
    width: number;
    height: number;
    x2: number;
    y2: number;
    cx: number;
    cy: number;
    cz: number;
  };
  /**
   * Returns the total path length, equivalent to native `path.getTotalLength()`.
   *
   * @public
   * @returns the path total length
   */
  get length(): number;
  /**
   * Returns the path bounding box, equivalent to native `path.getBBox()`.
   *
   * @public
   * @returns the pathBBox
   */
  getBBox(): {
    x: number;
    y: number;
    width: number;
    height: number;
    x2: number;
    y2: number;
    cx: number;
    cy: number;
    cz: number;
  };
  /**
   * Returns the total path length, equivalent to native `path.getTotalLength()`.
   *
   * @public
   * @returns the path total length
   */
  getTotalLength(): number;
  /**
   * Returns an `{x,y}` point in the path stroke at a given length,
   * equivalent to the native `path.getPointAtLength()`.
   *
   * @public
   * @param length the length
   * @returns the requested point
   */
  getPointAtLength(length: number): {
    x: number;
    y: number;
  };
  /**
   * Convert path to absolute values.
   *
   * @example
   * ```ts
   * new SVGPathCommander('M10 10l80 80').toAbsolute().toString()
   * // => 'M10 10L90 90'
   * ```
   *
   * @returns this for chaining
   * @public
   */
  toAbsolute(): this;
  /**
   * Convert path to relative values.
   *
   * @example
   * ```ts
   * new SVGPathCommander('M10 10L90 90').toRelative().toString()
   * // => 'M10 10l80 80'
   * ```
   *
   * @returns this for chaining
   * @public
   */
  toRelative(): this;
  /**
   * Convert path to cubic-bezier values. In addition, un-necessary `Z`
   * segment is removed if previous segment extends to the `M` segment.
   *
   * @example
   * ```ts
   * new SVGPathCommander('M10 50q15 -25 30 0').toCurve().toString()
   * // => 'M10 50C25 25 40 50 40 50'
   * ```
   *
   * @returns this for chaining
   * @public
   */
  toCurve(): this;
  /**
   * Reverse the order of the segments and their values.
   *
   * @example
   * ```ts
   * new SVGPathCommander('M0 0L100 0L100 100L0 100Z').reverse().toString()
   * // => 'M0 100L100 100L100 0L0 0Z'
   * ```
   *
   * @param onlySubpath - option to reverse all sub-paths except first
   * @returns this for chaining
   * @public
   */
  reverse(onlySubpath?: boolean): this;
  /**
   * Normalize path in 2 steps:
   * * convert `pathArray`(s) to absolute values
   * * convert shorthand notation to standard notation
   *
   * @example
   * ```ts
   * new SVGPathCommander('M10 90s20 -80 40 -80s20 80 40 80').normalize().toString()
   * // => 'M10 90C30 90 25 10 50 10C75 10 70 90 90 90'
   * ```
   *
   * @returns this for chaining
   * @public
   */
  normalize(): this;
  /**
   * Optimize `pathArray` values:
   * * convert segments to absolute and/or relative values
   * * select segments with shortest resulted string
   * * round values to the specified `decimals` option value
   *
   * @example
   * ```ts
   * new SVGPathCommander('M10 10L10 10L90 90').optimize().toString()
   * // => 'M10 10v0l80 80'
   * ```
   *
   * @returns this for chaining
   * @public
   */
  optimize(): this;
  /**
   * Transform path using values from an `Object` defined as `transformObject`.
   *
   * @see TransformObject for a quick reference
   *
   * @param source a `transformObject` as described above
   * @returns this for chaining
   * @public
   */
  transform(source?: Partial<TransformObject>): this;
  /**
   * Rotate path 180deg vertically.
   *
   * @example
   * ```ts
   * const path = new SVGPathCommander('M0 0L100 0L100 100L0 100Z')
   * path.flipX().toString()
   * ```
   *
   * @returns this for chaining
   * @public
   */
  flipX(): this;
  /**
   * Rotate path 180deg horizontally.
   *
   * @example
   * ```ts
   * const path = new SVGPathCommander('M0 0L100 0L100 100L0 100Z')
   * path.flipY().toString()
   * ```
   *
   * @returns this for chaining
   * @public
   */
  flipY(): this;
  /**
   * Export the current path to be used
   * for the `d` (description) attribute.
   *
   * @public
   * @returns the path string
   */
  toString(): string;
  /**
   * Remove the instance.
   *
   * @public
   * @returns void
   */
  dispose(): void;
  /** The default instance options. */
  static options: Options;
  /**
   * The DOMMatrix shim used for transformations.
   * @see https://github.com/thednp/dommatrix
   */
  static CSSMatrix: typeof CSSMatrix;
  /** The tools for elliptical arc computation. */
  static arcTools: {
    angleBetween: (v0: Point, v1: Point) => number;
    arcLength: (rx: number, ry: number, theta: number) => number;
    arcLengthAtAngle: (rx: number, ry: number, theta: number) => number;
    arcLengthBetween: (rx: number, ry: number, from: number, to: number) => number;
    arcPoint: (cx: number, cy: number, rx: number, ry: number, alpha: number, theta: number) => PointTuple;
    getArcBBox: (x1: number, y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, x: number, y: number) => [number, number, number, number];
    getArcLength: (x1: number, y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, x: number, y: number) => number;
    getArcProps: (x1: number, y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, x: number, y: number) => {
      rx: number;
      ry: number;
      startAngle: number;
      endAngle: number;
      center: {
        x: number;
        y: number;
      };
    };
    getPointAtArcLength: (x1: number, y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, x: number, y: number, distance?: number) => {
      x: number;
      y: number;
    };
  };
  /** The tools for Bezier curve computation. */
  static bezierTools: {
    bezierLength: (derivativeFn: DeriveCallback) => number;
    bezierLengthAtT: (derivativeFn: DeriveCallback, t: number) => number;
    calculateBezier: (derivativeFn: DeriveCallback, t: number) => number;
    CBEZIER_MINMAX_EPSILON: number;
    computeBezier: (points: DerivedQuadPoints | DerivedCubicPoints, t: number) => DerivedPoint;
    Cvalues: number[];
    deriveBezier: (points: QuadPoints | CubicPoints) => (DerivedQuadPoints | DerivedCubicPoints)[];
    getBezierLength: (curve: CubicCoordinates | QuadCoordinates) => number;
    getBezierLengthAtT: (curve: CubicCoordinates | QuadCoordinates, t: number) => number;
    getBezierPoints: (curve: CubicCoordinates | QuadCoordinates) => CubicPoints | QuadPoints;
    getTAtBezierLength: (curve: CubicCoordinates | QuadCoordinates, distance: number) => number;
    minmaxC: ([v1, cp1, cp2, v2]: [number, number, number, number]) => PointTuple;
    minmaxQ: ([v1, cp, v2]: [number, number, number]) => PointTuple;
    Tvalues: number[];
  };
  /** The tools for cubic Bezier computation. */
  static cubicTools: {
    getCubicBBox: (x1: number, y1: number, c1x: number, c1y: number, c2x: number, c2y: number, x2: number, y2: number) => BBoxMaxima;
    getCubicLength: (x1: number, y1: number, c1x: number, c1y: number, c2x: number, c2y: number, x2: number, y2: number) => number;
    getPointAtCubicLength: (x1: number, y1: number, c1x: number, c1y: number, c2x: number, c2y: number, x2: number, y2: number, distance?: number) => {
      x: number;
      y: number;
    };
    getPointAtCubicSegmentLength: ([x1, y1, c1x, c1y, c2x, c2y, x2, y2]: CubicCoordinates, t: number) => {
      x: number;
      y: number;
    };
  };
  /** The tools for line segment computation. */
  static lineTools: {
    getLineBBox: (x1: number, y1: number, x2: number, y2: number) => [number, number, number, number];
    getLineLength: (x1: number, y1: number, x2: number, y2: number) => number;
    getPointAtLineLength: (x1: number, y1: number, x2: number, y2: number, distance?: number) => {
      x: number;
      y: number;
    };
  };
  /** The tools for polygon computation. */
  static polygonTools: {
    polygonArea: (polygon: PointTuple[]) => number;
    polygonLength: (polygon: PointTuple[]) => number;
    polygonCentroid: (polygon: PointTuple[]) => PointTuple;
  };
  /** The tools for quadratic Bezier computation. */
  static quadTools: {
    getPointAtQuadLength: (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, distance?: number) => {
      x: number;
      y: number;
    };
    getPointAtQuadSegmentLength: ([x1, y1, cx, cy, x2, y2]: QuadCoordinates, t: number) => {
      x: number;
      y: number;
    };
    getQuadBBox: (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number) => [number, number, number, number];
    getQuadLength: (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number) => number;
  };
  /** Parses a path string value or object and returns an array */
  static pathToAbsolute: typeof pathToAbsolute;
  /** Parses a path string value or object and returns an array */
  static pathToRelative: typeof pathToRelative;
  /** Parses a path string or PathArray and returns a new one */
  static pathToCurve: typeof pathToCurve;
  /** Returns a valid `d` attribute string value created */
  static pathToString: typeof pathToString;
  /** Returns the square root of the distance */
  static distanceSquareRoot: typeof distanceSquareRoot;
  /** Returns the coordinates of a specified distance */
  static midPoint: typeof midPoint;
  /** Returns an {x,y} vector rotated by a given */
  static rotateVector: typeof rotateVector;
  /** Rounds a number to the specified number of decimal places. */
  static roundTo: typeof roundTo;
  /** Parses a path string value and returns an array */
  static parsePathString: typeof parsePathString;
  /** Breaks the parsing of a pathString once a segment is finalized. */
  static finalizeSegment: typeof finalizeSegment;
  /** Error message prefix used when a path string cannot be parsed. */
  static invalidPathValue: string;
  /** Checks if the character is an A (arc-to) path command. */
  static isArcCommand: typeof isArcCommand;
  /** Checks if a character is a digit. */
  static isDigit: typeof isDigit;
  /** Checks if the character is or belongs to a number. */
  static isDigitStart: typeof isDigitStart;
  /** Checks if the character is a MoveTo command. */
  static isMoveCommand: typeof isMoveCommand;
  /** Checks if the character is a path command. */
  static isPathCommand: typeof isPathCommand;
  /** Checks if the character is a space. */
  static isSpace: typeof isSpace;
  /** The number of parameters for each path command. */
  static paramsCount: {
    a: number;
    c: number;
    h: number;
    l: number;
    m: number;
    r: number;
    q: number;
    s: number;
    t: number;
    v: number;
    z: number;
  };
  /** Default parser parameters object used to track position state */
  static paramsParser: ParserParams;
  /** The `PathParser` is used by the `parsePathString` static method */
  static PathParser: typeof PathParser;
  /** Validates an A (arc-to) specific path command value. */
  static scanFlag: typeof scanFlag;
  /** Validates every character of the path string, */
  static scanParam: typeof scanParam;
  /** Scans every character in the path string to determine */
  static scanSegment: typeof scanSegment;
  /** Points the parser to the next character in the */
  static skipSpaces: typeof skipSpaces;
  /** Small threshold value used for floating-point distance comparisons in path calculations. */
  static distanceEpsilon: number;
  /** Checks a `PathArray` for an unnecessary `Z` segment */
  static fixPath: typeof fixPath;
  /** Returns the point in path closest to a given point. */
  static getClosestPoint: typeof getClosestPoint;
  /** Check if a path is drawn clockwise and returns true if so, */
  static getDrawDirection: typeof getDrawDirection;
  /** Returns the area of a single cubic-bezier segment. */
  static getPathArea: typeof getPathArea;
  /** Calculates the bounding box of a path. */
  static getPathBBox: typeof getPathBBox;
  /** Returns [x,y] coordinates of a point at a given length along a path. */
  static getPointAtLength: typeof getPointAtLength;
  /** Returns the segment, its index and length as well as */
  static getPropertiesAtLength: typeof getPropertiesAtLength;
  /** Returns the point and segment in path closest to a given point as well as */
  static getPropertiesAtPoint: typeof getPropertiesAtPoint;
  /** Returns the segment at a given length. */
  static getSegmentAtLength: typeof getSegmentAtLength;
  /** Returns the path segment which contains a given point. */
  static getSegmentOfPoint: typeof getSegmentOfPoint;
  /** Returns the total length of a path, equivalent to `shape.getTotalLength()`. */
  static getTotalLength: typeof getTotalLength;
  /** Iterates an array to check if it's a `pathArray` */
  static isAbsoluteArray: typeof isAbsoluteArray;
  /** Iterates an array to check if it's a `pathArray` */
  static isCurveArray: typeof isCurveArray;
  /** Checks if a path is a polygon (only M, L, H, V, Z commands). */
  static isPolygonArray: typeof isPolygonArray;
  /** Iterates an array to check if it's a `pathArray` */
  static isNormalizedArray: typeof isNormalizedArray;
  /** Iterates an array to check if it's an actual `pathArray`. */
  static isPathArray: typeof isPathArray;
  /** Checks if a given point is in the stroke of a path. */
  static isPointInStroke: typeof isPointInStroke;
  /** Iterates an array to check if it's a `pathArray` */
  static isRelativeArray: typeof isRelativeArray;
  /** Parses a path string value to determine its validity */
  static isValidPath: typeof isValidPath;
  /** Samples points from a path to form a polygon approximation. */
  static samplePolygon: typeof samplePolygon;
  /** Supported shapes and their specific parameters. */
  static shapeParams: ShapeParams;
  /** Returns a new `<path>` element created from attributes of a `<line>`, `<polyline>`, */
  static shapeToPath: typeof shapeToPath;
  /** Returns a new PathArray from line attributes. */
  static shapeToPathArray: typeof shapeToPathArray;
  /** Returns an absolute segment of a `PathArray` object. */
  static absolutizeSegment: typeof absolutizeSegment;
  /** Converts A (arc-to) segments to C (cubic-bezier-to). */
  static arcToCubic: typeof arcToCubic;
  /** Returns a transformation matrix to apply to `<path>` elements. */
  static getSVGMatrix: typeof getSVGMatrix;
  /** Iterates over a `PathArray`, executing a callback for each segment. */
  static iterate: typeof iterate;
  /** Converts an L (line-to) segment to C (cubic-bezier). */
  static lineToCubic: typeof lineToCubic;
  /** Parses a path string or PathArray, then iterates the result for: */
  static normalizePath: typeof normalizePath;
  /** Normalizes a single segment of a `pathArray` object. */
  static normalizeSegment: typeof normalizeSegment;
  /** Optimizes a PathArray: */
  static optimizePath: typeof optimizePath;
  /** Transforms a specified point using a matrix, returning a new */
  static projection2d: typeof projection2d;
  /** Converts a Q (quadratic-bezier) segment to C (cubic-bezier). */
  static quadToCubic: typeof quadToCubic;
  /** Returns a relative segment of a `PathArray` object. */
  static relativizeSegment: typeof relativizeSegment;
  /** Reverses all segments of a `pathArray` */
  static reverseCurve: typeof reverseCurve;
  /** Reverses all segments of a PathArray and returns a new PathArray */
  static reversePath: typeof reversePath;
  /** Rounds the values of a `pathArray` instance to */
  static roundPath: typeof roundPath;
  /** Rounds the numeric values of a path segment to the specified precision. */
  static roundSegment: typeof roundSegment;
  /** Converts any segment to C (cubic-bezier). */
  static segmentToCubic: typeof segmentToCubic;
  /** Shorten a single segment of a `pathArray` object. */
  static shortenSegment: typeof shortenSegment;
  /** Split a path string or PathArray into an array of sub-paths. */
  static splitPath: typeof splitPath;
  /** Equalizes two paths for morphing (single/multi subpath). */
  static equalizePaths: typeof equalizePaths;
  /** Equalizes two paths for morphing (single subpath only). */
  static equalizeSegments: typeof equalizeSegments;
  /** Split a cubic Bézier into two cubics at parameter t [0–1]. */
  static splitCubicSegment: typeof splitCubicSegment;
  /** Apply a 2D / 3D transformation to a PathArray. */
  static transformPath: typeof transformPath;
  /** Checks if a point is inside a bounding box. */
  static isPointInsideBBox: typeof isPointInsideBBox;
  /** Finds intersection points between two paths. */
  static pathsIntersection: typeof pathsIntersection;
  /** Checks if two bounding boxes intersect. */
  static boundingBoxIntersect: typeof boundingBoxIntersect;
  /** Determines if an SVG path contains multiple subpaths. */
  static isMultiPath: typeof isMultiPath;
  /** Check if a PathArray is closed, which means its last segment is a Z. */
  static isClosedPath: typeof isClosedPath;
  /** Checks if a path is a polyline (only M, L, H, V commands). */
  static isPolylineArray: typeof isPolylineArray;
  /** The library version. */
  static version: string;
}
//#endregion
export { ACommand, ASegment, AbsoluteArray, AbsoluteCommand, AbsoluteSegment, ArcCoordinates, ArcSegment, BBoxMaxima, CCommand, CSegment, CircleAttr, CloseSegment, ClosedCurveArray, CubicCoordinates, CubicPoints, CubicSegment, CurveArray, DeriveCallback, DerivedCubicPoints, DerivedPoint, DerivedQuadPoints, DigitNumber, EllipseAttr, EqualizationOptions, GlyphAttr, HCommand, HSegment, HorLineSegment, IntersectionOptions, IntersectionPoint, IteratorCallback, LCommand, LSegment, LengthFactory, LineAttr, LineCoordinates, LineSegment, MCommand, MSegment, MorphPathArray, MoveSegment, NormalArray, NormalSegment, Options, ParserParams, PathArray, PathBBox, PathCommand, PathCommandNumber, PathEqualizationOptions, PathFeature, PathSegment, PathTransform, PathsEqualizationOptions, Point, PointAtLength, PointProperties, PointTuple, PolyAttr, PolygonArray, PolylineArray, QCommand, QSegment, QuadCoordinates, QuadPoints, QuadSegment, RectAttr, RelativeArray, RelativeCommand, RelativeSegment, SCommand, SSegment, SVGPathCommander, SVGPathCommander as default, SegmentLimits, SegmentProperties, ShapeOps, ShapeParams, ShapeTags, ShapeTypes, ShortCubicSegment, ShortQuadSegment, ShortSegment, SpaceNumber, TCommand, TSegment, TransformEntries, TransformObject, TransformObjectValues, TransformProps, VCommand, VSegment, VertLineSegment, ZCommand, ZSegment, aCommand, aSegment, cCommand, cSegment, hCommand, hSegment, lCommand, lSegment, mCommand, mSegment, qCommand, qSegment, sCommand, sSegment, tCommand, tSegment, vCommand, vSegment, zCommand, zSegment };
//# sourceMappingURL=index.d.ts.map