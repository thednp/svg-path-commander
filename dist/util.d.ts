/*!
* SVGPathCommander v2.2.1 (http://thednp.github.io/svg-path-commander)
* Copyright 2026 © thednp
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/
//#region src/interface.d.ts
type SegmentProperties = {
  segment: PathSegment;
  index: number;
  length: number;
  lengthAtSegment: number;
};
type PointProperties = {
  closest: {
    x: number;
    y: number;
  };
  distance: number;
  segment?: SegmentProperties;
};
type LineAttr = {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  [key: string]: string | number;
};
type PolyAttr = {
  type: "polygon" | "polyline";
  points: string;
  [key: string]: string | number;
};
type CircleAttr = {
  type: "circle";
  cx: number;
  cy: number;
  r: number;
  [key: string]: string | number;
};
type EllipseAttr = {
  type: "ellipse";
  cx: number;
  cy: number;
  rx: number;
  ry?: number;
  [key: string]: string | number | undefined;
};
type RectAttr = {
  type: "rect";
  width: number;
  height: number;
  x: number;
  y: number;
  rx?: number;
  ry?: number;
  [key: string]: string | number | undefined;
};
type GlyphAttr = {
  type: "glyph";
  d: string;
  [key: string]: string | number;
};
type ShapeParams = {
  line: ["x1", "y1", "x2", "y2"];
  circle: ["cx", "cy", "r"];
  ellipse: ["cx", "cy", "rx", "ry"];
  rect: ["width", "height", "x", "y", "rx", "ry"];
  polygon: ["points"];
  polyline: ["points"];
  glyph: ["d"];
};
type ParserParams = {
  mx: number;
  my: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
  qx: number | null;
  qy: number | null;
};
type TransformObject = {
  translate: number | number[];
  rotate: number | number[];
  scale: number | number[];
  skew: number | number[];
  origin: number[];
};
//#endregion
//#region src/types.d.ts
type SpaceNumber = 0x1680 | 0x180e | 0x2000 | 0x2001 | 0x2002 | 0x2003 | 0x2004 | 0x2005 | 0x2006 | 0x2007 | 0x2008 | 0x2009 | 0x200a | 0x202f | 0x205f | 0x3000 | 0xfeff | 0x0a | 0x0d | 0x2028 | 0x2029 | 0x20 | 0x09 | 0x0b | 0x0c | 0xa0 | 0x1680;
type PathCommandNumber = 0x6d | 0x7a | 0x6c | 0x68 | 0x76 | 0x63 | 0x73 | 0x71 | 0x74 | 0x61;
type DigitNumber = 0x30 | 0x31 | 0x32 | 0x33 | 0x34 | 0x35 | 0x36 | 0x37 | 0x38 | 0x39;
type MCommand = "M";
type mCommand = "m";
type LCommand = "L";
type lCommand = "l";
type VCommand = "V";
type vCommand = "v";
type HCommand = "H";
type hCommand = "h";
type ZCommand = "Z";
type zCommand = "z";
type CCommand = "C";
type cCommand = "c";
type SCommand = "S";
type sCommand = "s";
type QCommand = "Q";
type qCommand = "q";
type TCommand = "T";
type tCommand = "t";
type ACommand = "A";
type aCommand = "a";
type AbsoluteCommand = MCommand | LCommand | VCommand | HCommand | ZCommand | CCommand | SCommand | QCommand | TCommand | ACommand;
type RelativeCommand = mCommand | lCommand | vCommand | hCommand | zCommand | cCommand | sCommand | qCommand | tCommand | aCommand;
type PathCommand = AbsoluteCommand | RelativeCommand;
type MSegment = [MCommand, number, number];
type mSegment = [mCommand, number, number];
type MoveSegment = MSegment | mSegment;
type LSegment = [LCommand, number, number];
type lSegment = [lCommand, number, number];
type LineSegment = LSegment | lSegment;
type VSegment = [VCommand, number];
type vSegment = [vCommand, number];
type VertLineSegment = vSegment | VSegment;
type HSegment = [HCommand, number];
type hSegment = [hCommand, number];
type HorLineSegment = HSegment | hSegment;
type ZSegment = [ZCommand];
type zSegment = [zCommand];
type CloseSegment = ZSegment | zSegment;
type CSegment = [CCommand, number, number, number, number, number, number];
type cSegment = [cCommand, number, number, number, number, number, number];
type CubicSegment = CSegment | cSegment;
type SSegment = [SCommand, number, number, number, number];
type sSegment = [sCommand, number, number, number, number];
type ShortCubicSegment = SSegment | sSegment;
type QSegment = [QCommand, number, number, number, number];
type qSegment = [qCommand, number, number, number, number];
type QuadSegment = QSegment | qSegment;
type TSegment = [TCommand, number, number];
type tSegment = [tCommand, number, number];
type ShortQuadSegment = TSegment | tSegment;
type ASegment = [ACommand, number, number, number, number, number, number, number];
type aSegment = [aCommand, number, number, number, number, number, number, number];
type ArcSegment = ASegment | aSegment;
type PathSegment = MoveSegment | LineSegment | VertLineSegment | HorLineSegment | CloseSegment | CubicSegment | ShortCubicSegment | QuadSegment | ShortQuadSegment | ArcSegment;
type ShortSegment = VertLineSegment | HorLineSegment | ShortCubicSegment | ShortQuadSegment | CloseSegment;
type AbsoluteSegment = MSegment | LSegment | VSegment | HSegment | CSegment | SSegment | QSegment | TSegment | ASegment | ZSegment;
type RelativeSegment = mSegment | lSegment | vSegment | hSegment | cSegment | sSegment | qSegment | tSegment | aSegment | zSegment;
type NormalSegment = MSegment | LSegment | CSegment | QSegment | ASegment | ZSegment;
type PathArray = [MSegment | mSegment, ...PathSegment[]];
type AbsoluteArray = [MSegment, ...AbsoluteSegment[]];
type RelativeArray = [MSegment, ...RelativeSegment[]];
type NormalArray = [MSegment, ...NormalSegment[]];
type CurveArray = [MSegment, ...CSegment[]];
type ClosedCurveArray = [MSegment, ...CSegment[], ZSegment];
type PolygonArray = [MSegment, ...LSegment[], ZSegment];
type PolylineArray = [MSegment, ...LSegment[]];
type MorphPathArray = PolygonArray | PolylineArray | CurveArray | ClosedCurveArray;
type ShapeTypes = SVGPolylineElement | SVGPolygonElement | SVGLineElement | SVGEllipseElement | SVGCircleElement | SVGRectElement;
type ShapeOps = LineAttr | PolyAttr | PolyAttr | EllipseAttr | CircleAttr | RectAttr | GlyphAttr;
type TransformObjectValues = Partial<TransformObject> & {
  origin: [number, number, number];
};
type Point = {
  x: number;
  y: number;
};
type PointTuple = [number, number];
type DerivedPoint = Point & {
  t: number;
};
type QuadPoints = [Point, Point, Point, Point, Point, Point];
type CubicPoints = [Point, Point, Point, Point, Point, Point, Point, Point];
type DerivedQuadPoints = [DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint];
type DerivedCubicPoints = [DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint, DerivedPoint];
type QuadCoordinates = [number, number, number, number, number, number];
type CubicCoordinates = [number, number, number, number, number, number, number, number];
type DeriveCallback = (t: number) => Point;
type IteratorCallback<T extends PathArray, K extends keyof T = number> = (segment: PathSegment & T[K], index: number, lastX: number, lastY: number) => PathSegment | T[K] | false | void | undefined;
type BBoxMaxima = [minX: number, minY: number, maxX: number, maxY: number];
type IntersectionPoint = {
  x: number;
  y: number;
  t1: number;
  t2: number;
};
interface EqualizationOptions {
  /** @default "auto" */
  mode?: "curve" | "auto";
  sampleSize?: number;
  roundValues?: number;
  reverse?: boolean;
  close?: boolean;
  target?: number;
}
//#endregion
//#region src/math/arcTools.d.ts
declare const arcTools: {
  angleBetween: (v0: Point, v1: Point) => number;
  arcLength: (rx: number, ry: number, theta: number) => number;
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
//#endregion
//#region src/math/bezier.d.ts
declare const bezierTools: {
  bezierLength: (derivativeFn: DeriveCallback) => number;
  calculateBezier: (derivativeFn: DeriveCallback, t: number) => number;
  CBEZIER_MINMAX_EPSILON: number;
  computeBezier: (points: DerivedQuadPoints | DerivedCubicPoints, t: number) => DerivedPoint;
  Cvalues: number[];
  deriveBezier: (points: QuadPoints | CubicPoints) => (DerivedCubicPoints | DerivedQuadPoints)[];
  getBezierLength: (curve: CubicCoordinates | QuadCoordinates) => number;
  minmaxC: ([v1, cp1, cp2, v2]: [number, number, number, number]) => PointTuple;
  minmaxQ: ([v1, cp, v2]: [number, number, number]) => PointTuple;
  Tvalues: number[];
};
//#endregion
//#region src/math/cubicTools.d.ts
declare const cubicTools: {
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
//#endregion
//#region src/math/lineTools.d.ts
declare const lineTools: {
  getLineBBox: (x1: number, y1: number, x2: number, y2: number) => [number, number, number, number];
  getLineLength: (x1: number, y1: number, x2: number, y2: number) => number;
  getPointAtLineLength: (x1: number, y1: number, x2: number, y2: number, distance?: number) => {
    x: number;
    y: number;
  };
};
//#endregion
//#region src/math/quadTools.d.ts
declare const quadTools: {
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
//#endregion
//#region src/math/polygonTools.d.ts
declare const polygonTools: {
  polygonArea: (polygon: PointTuple[]) => number;
  polygonLength: (polygon: PointTuple[]) => number;
  polygonCentroid: (polygon: PointTuple[]) => PointTuple;
};
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
//#region src/parser/invalidPathValue.d.ts
/** Error message prefix used when a path string cannot be parsed. */
declare const invalidPathValue = "Invalid path value";
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
//#region src/parser/paramsCount.d.ts
/** Segment params length */
declare const paramsCounts: {
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
//#endregion
//#region src/parser/paramsParser.d.ts
/**
 * Default parser parameters object used to track position state
 * while iterating through path segments.
 */
declare const paramsParser: ParserParams;
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
//#region src/util/distanceEpsilon.d.ts
/** Small threshold value used for floating-point distance comparisons in path calculations. */
declare const DISTANCE_EPSILON = 0.00001;
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
declare const getPathArea: <T extends PathArray>(path: T) => number;
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
//#region src/util/isPolygonArray.d.ts
/**
 * Checks if a path is a polygon (only M, L, H, V, Z commands).
 * @param pathArray PathArray (pre-normalize if needed)
 * @returns boolean
 */
declare const isPolygonArray: (path: PathArray) => path is PolygonArray;
//#endregion
//#region src/util/isPolylineArray.d.ts
/**
 * Checks if a path is a polyline (only M, L, H, V commands).
 * @param pathArray PathArray (pre-normalize if needed)
 * @returns boolean
 */
declare function isPolylineArray(path: PathArray): path is PolylineArray;
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
//#region src/util/isMultiPath.d.ts
/**
 * Determines if an SVG path contains multiple subpaths.
 * Accepts path string or PathArray.
 * @param path - 'M10,10 L20,20 Z M30,30 L40,40' → true
 * @returns boolean
 */
declare const isMultiPath: <T extends PathArray>(path: string | T) => boolean;
//#endregion
//#region src/util/isClosedPath.d.ts
/**
 * Check if a PathArray is closed, which means its last segment is a Z.
 * @param path
 * @returns true if the path is closed
 */
declare const isClosedPath: <T extends PathArray>(path: T) => boolean;
//#endregion
//#region src/util/shapeParams.d.ts
/**
 * Supported shapes and their specific parameters.
 */
declare const shapeParams: ShapeParams;
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
declare const normalizePath: (pathInput: string | PathArray) => NormalArray;
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
declare const optimizePath: <T extends PathArray>(pathInput: T, roundOption?: number) => PathArray;
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
 * // => [{ x: 50, y: 25, t1: 0.5, t2: 0.5 }]
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
export { PathParser, absolutizeSegment, arcToCubic, arcTools, bezierTools, boundingBoxIntersect, cubicTools, DISTANCE_EPSILON as distanceEpsilon, distanceSquareRoot, equalizePaths, equalizeSegments, finalizeSegment, fixPath, getClosestPoint, getDrawDirection, getPathArea, getPathBBox, getPointAtLength, getPropertiesAtLength, getPropertiesAtPoint, getSVGMatrix, getSegmentAtLength, getSegmentOfPoint, getTotalLength, invalidPathValue, isAbsoluteArray, isArcCommand, isClosedPath, isCurveArray, isDigit, isDigitStart, isMoveCommand, isMultiPath, isNormalizedArray, isPathArray, isPathCommand, isPointInStroke, isPointInsideBBox, isPolygonArray, isPolylineArray, isRelativeArray, isSpace, isValidPath, iterate, lineToCubic, lineTools, midPoint, normalizePath, normalizeSegment, optimizePath, paramsCounts, paramsParser, parsePathString, pathToAbsolute, pathToCurve, pathToRelative, pathToString, pathsIntersection, polygonTools, projection2d, quadToCubic, quadTools, relativizeSegment, reverseCurve, reversePath, rotateVector, roundPath, roundSegment, roundTo, scanFlag, scanParam, scanSegment, segmentToCubic, shapeParams, shapeToPath, shapeToPathArray, shortenSegment, skipSpaces, splitCubicSegment, splitPath, transformPath };
//# sourceMappingURL=util.d.ts.map