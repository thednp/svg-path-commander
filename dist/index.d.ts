/*!
* SVGPathCommander v2.2.0 (http://thednp.github.io/svg-path-commander)
* Copyright 2026 © thednp
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/
import CSSMatrix from "@thednp/dommatrix";

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
type PathBBox = {
  width: number;
  height: number;
  x: number;
  y: number;
  x2: number;
  y2: number;
  cx: number;
  cy: number;
  cz: number;
};
type SegmentLimits = {
  min: {
    x: number;
    y: number;
  };
  max: {
    x: number;
    y: number;
  };
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
type LengthFactory = {
  length: number;
  point: {
    x: number;
    y: number;
  };
  min: {
    x: number;
    y: number;
  };
  max: {
    x: number;
    y: number;
  };
};
type Options = {
  round: "off" | number;
  origin: number[];
};
type PathTransform = {
  s: PathSegment;
  c: string;
  x: number;
  y: number;
};
type TransformObject = {
  translate: number | number[];
  rotate: number | number[];
  scale: number | number[];
  skew: number | number[];
  origin: number[];
};
type TransformProps = keyof TransformObject;
type TransformEntries = [TransformProps, TransformObject[TransformProps]][];
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
type ShapeTags = "line" | "polyline" | "polygon" | "ellipse" | "circle" | "rect" | "glyph";
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
type ArcCoordinates = [number, number, number, number, number, number, number, number, number];
type LineCoordinates = [number, number, number, number];
type DeriveCallback = (t: number) => Point;
type IteratorCallback<T extends PathArray, K extends keyof T = number> = (segment: PathSegment & T[K], index: number, lastX: number, lastY: number) => PathSegment | T[K] | false | void | undefined;
type BBoxMaxima = [minX: number, minY: number, maxX: number, maxY: number];
type PointAtLength = {
  x: number;
  y: number;
  t: number;
};
type IntersectionPoint = {
  x: number;
  y: number;
  t1: number;
  t2: number;
};
interface IntersectionOptions {
  justCount?: boolean;
  epsilon?: number;
}
interface PathEqualizationOptions {
  /** @default "auto" */
  mode?: "line" | "curve" | "auto";
  sampleSize?: number;
  roundValues?: number;
  close?: boolean;
}
interface EqualizationOptions {
  /** @default "auto" */
  mode?: "curve" | "auto";
  sampleSize?: number;
  roundValues?: number;
  reverse?: boolean;
  close?: boolean;
  target?: number;
}
type PathsEqualizationOptions = Omit<EqualizationOptions, "reverse" | "target">;
interface PathFeature {
  isPoly: boolean;
  path: NormalArray;
  size: number;
  area: number;
  signedArea: number;
  bbox: PathBBox;
}
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
//#region src/util/isPolylineArray.d.ts
/**
 * Checks if a path is a polyline (only M, L, H, V commands).
 * @param pathArray PathArray (pre-normalize if needed)
 * @returns boolean
 */
declare function isPolylineArray(path: PathArray): path is PolylineArray;
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
  segments: PathArray;
  round: number | "off";
  origin: [number, number, number];
  /**
   * @constructor
   * @param pathValue the path string
   * @param config instance options
   */
  constructor(pathValue: string, config?: Partial<Options>);
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
   * // => 'M0 100L0 0L100 0L100 100Z'
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
   * // => 'M10 10l0 0 80 80'
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
  static options: Options;
  static CSSMatrix: typeof CSSMatrix;
  static arcTools: {
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
  static bezierTools: {
    bezierLength: (derivativeFn: DeriveCallback) => number;
    calculateBezier: (derivativeFn: DeriveCallback, t: number) => number;
    CBEZIER_MINMAX_EPSILON: number;
    computeBezier: (points: DerivedQuadPoints | DerivedCubicPoints, t: number) => DerivedPoint;
    Cvalues: number[];
    deriveBezier: (points: QuadPoints | CubicPoints) => (DerivedQuadPoints | DerivedCubicPoints)[];
    getBezierLength: (curve: CubicCoordinates | QuadCoordinates) => number;
    minmaxC: ([v1, cp1, cp2, v2]: [number, number, number, number]) => PointTuple;
    minmaxQ: ([v1, cp, v2]: [number, number, number]) => PointTuple;
    Tvalues: number[];
  };
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
  static lineTools: {
    getLineBBox: (x1: number, y1: number, x2: number, y2: number) => [number, number, number, number];
    getLineLength: (x1: number, y1: number, x2: number, y2: number) => number;
    getPointAtLineLength: (x1: number, y1: number, x2: number, y2: number, distance?: number) => {
      x: number;
      y: number;
    };
  };
  static polygonTools: {
    polygonArea: (polygon: PointTuple[]) => number;
    polygonLength: (polygon: PointTuple[]) => number;
    polygonCentroid: (polygon: PointTuple[]) => PointTuple;
  };
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
  static pathToAbsolute: <T extends PathArray>(pathInput: string | T) => AbsoluteArray;
  static pathToRelative: <T extends PathArray>(pathInput: string | T) => RelativeArray;
  static pathToCurve: <T extends PathArray>(pathInput: string | T) => CurveArray;
  static pathToString: <T extends PathArray>(path: T, roundOption?: number | "off") => string;
  static distanceSquareRoot: (a: PointTuple, b: PointTuple) => number;
  static midPoint: ([ax, ay]: PointTuple, [bx, by]: PointTuple, t: number) => PointTuple;
  static rotateVector: (x: number, y: number, rad: number) => {
    x: number;
    y: number;
  };
  static roundTo: (n: number, round: number) => number;
  static parsePathString: <T extends PathArray>(pathInput: string | T) => PathArray;
  static finalizeSegment: (path: PathParser) => void;
  static invalidPathValue: string;
  static isArcCommand: (code: number) => code is 97;
  static isDigit: (code: number) => code is DigitNumber;
  static isDigitStart: (code: number) => code is DigitNumber | 43 | 45 | 46;
  static isMoveCommand: (code: number) => code is 109 | 77;
  static isPathCommand: (code: number) => code is PathCommandNumber;
  static isSpace: (ch: number) => ch is SpaceNumber;
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
  static paramsParser: ParserParams;
  static PathParser: typeof PathParser;
  static scanFlag: (path: PathParser) => void;
  static scanParam: (path: PathParser) => void;
  static scanSegment: (path: PathParser) => void;
  static skipSpaces: (path: PathParser) => void;
  static distanceEpsilon: number;
  static fixPath: <T extends PathArray>(pathInput: T | string) => void;
  static getClosestPoint: (pathInput: string | PathArray, point: {
    x: number;
    y: number;
  }) => {
    x: number;
    y: number;
  };
  static getDrawDirection: (path: string | PathArray) => boolean;
  static getPathArea: <T extends PathArray>(path: T) => number;
  static getPathBBox: <T extends PathArray>(pathInput: T | string) => {
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
  static getPointAtLength: <T extends PathArray>(pathInput: string | T, distance?: number) => {
    x: number;
    y: number;
  };
  static getPropertiesAtLength: <T extends PathArray>(pathInput: string | T, distance?: number) => SegmentProperties;
  static getPropertiesAtPoint: <T extends PathArray>(pathInput: string | T, point: Point) => PointProperties;
  static getSegmentAtLength: <T extends PathArray>(pathInput: string | T, distance?: number) => PathSegment | undefined;
  static getSegmentOfPoint: <T extends PathArray>(path: string | T, point: {
    x: number;
    y: number;
  }) => SegmentProperties | undefined;
  static getTotalLength: <T extends PathArray>(pathInput: string | T) => number;
  static isAbsoluteArray: (path: unknown) => path is AbsoluteArray;
  static isCurveArray: (path: unknown) => path is CurveArray;
  static isPolygonArray: (path: PathArray) => path is PolygonArray;
  static isNormalizedArray: (path: unknown) => path is NormalArray;
  static isPathArray: (path: unknown) => path is PathArray;
  static isPointInStroke: <T extends PathArray>(pathInput: string | T, point: {
    x: number;
    y: number;
  }) => boolean;
  static isRelativeArray: (path: unknown) => path is RelativeArray;
  static isValidPath: (pathString: string) => boolean;
  static samplePolygon: typeof samplePolygon;
  static shapeParams: ShapeParams;
  static shapeToPath: (element: ShapeTypes | ShapeOps, replace?: boolean, ownerDocument?: Document) => SVGPathElement | false;
  static shapeToPathArray: (element: ShapeTypes | ShapeOps) => false | PathArray;
  static absolutizeSegment: (segment: PathSegment, index: number, lastX: number, lastY: number) => AbsoluteSegment;
  static arcToCubic: (X1: number, Y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, X2: number, Y2: number, recursive?: [number, number, number, number]) => number[];
  static getSVGMatrix: (transform: TransformObjectValues) => CSSMatrix;
  static iterate: <T extends PathArray>(path: T, iterator: IteratorCallback<T>) => T;
  static lineToCubic: (x1: number, y1: number, x2: number, y2: number) => number[];
  static normalizePath: (pathInput: string | PathArray) => NormalArray;
  static normalizeSegment: (segment: PathSegment, params: ParserParams) => NormalSegment;
  static optimizePath: <T extends PathArray>(pathInput: T, roundOption?: number) => PathArray;
  static projection2d: (m: CSSMatrix, point2D: PointTuple, origin: [number, number, number]) => PointTuple;
  static quadToCubic: (x1: number, y1: number, qx: number, qy: number, x2: number, y2: number) => [number, number, number, number, number, number];
  static relativizeSegment: (segment: PathSegment, index: number, lastX: number, lastY: number) => MSegment | RelativeSegment;
  static reverseCurve: (path: CurveArray) => CurveArray;
  static reversePath: <T extends PathArray>(pathInput: T) => T;
  static roundPath: <T extends PathArray>(path: T, roundOption?: number | "off") => T;
  static roundSegment: <T extends PathSegment>(segment: T, roundOption: number) => T;
  static segmentToCubic: (segment: PathSegment, params: ParserParams) => MSegment | CSegment;
  static shortenSegment: (segment: AbsoluteSegment, normalSegment: NormalSegment, params: ParserParams, prevCommand: PathCommand) => ShortSegment;
  static splitPath: <T extends PathArray>(pathInput: T | string) => T[];
  static equalizePaths: (pathInput1: string | PathArray, pathInput2: string | PathArray, initialCfg?: {}) => [MorphPathArray, MorphPathArray];
  static equalizeSegments: (path1: PathArray | string, path2: PathArray | string, initialCfg?: EqualizationOptions) => [MorphPathArray, MorphPathArray];
  static splitCubicSegment: typeof splitCubicSegment;
  static transformPath: <T extends PathArray>(pathInput: T | string, transform?: Partial<TransformObject>) => T | AbsoluteArray;
  static isPointInsideBBox: (bbox: BBoxMaxima, [x, y]: PointTuple) => boolean;
  static pathsIntersection: <T extends string | PathArray>(pathInput1: T, pathInput2: T, justCount?: boolean) => number | IntersectionPoint[];
  static boundingBoxIntersect: (a: BBoxMaxima, b: BBoxMaxima) => boolean;
  static isMultiPath: <T extends PathArray>(path: string | T) => boolean;
  static isClosedPath: <T extends PathArray>(path: T) => boolean;
  static isPolylineArray: typeof isPolylineArray;
  static version: string;
}
//#endregion
export { ACommand, ASegment, AbsoluteArray, AbsoluteCommand, AbsoluteSegment, ArcCoordinates, ArcSegment, BBoxMaxima, CCommand, CSegment, CircleAttr, CloseSegment, ClosedCurveArray, CubicCoordinates, CubicPoints, CubicSegment, CurveArray, DeriveCallback, DerivedCubicPoints, DerivedPoint, DerivedQuadPoints, DigitNumber, EllipseAttr, EqualizationOptions, GlyphAttr, HCommand, HSegment, HorLineSegment, IntersectionOptions, IntersectionPoint, IteratorCallback, LCommand, LSegment, LengthFactory, LineAttr, LineCoordinates, LineSegment, MCommand, MSegment, MorphPathArray, MoveSegment, NormalArray, NormalSegment, Options, ParserParams, PathArray, PathBBox, PathCommand, PathCommandNumber, PathEqualizationOptions, PathFeature, PathSegment, PathTransform, PathsEqualizationOptions, Point, PointAtLength, PointProperties, PointTuple, PolyAttr, PolygonArray, PolylineArray, QCommand, QSegment, QuadCoordinates, QuadPoints, QuadSegment, RectAttr, RelativeArray, RelativeCommand, RelativeSegment, SCommand, SSegment, SegmentLimits, SegmentProperties, ShapeOps, ShapeParams, ShapeTags, ShapeTypes, ShortCubicSegment, ShortQuadSegment, ShortSegment, SpaceNumber, TCommand, TSegment, TransformEntries, TransformObject, TransformObjectValues, TransformProps, VCommand, VSegment, VertLineSegment, ZCommand, ZSegment, aCommand, aSegment, cCommand, cSegment, SVGPathCommander as default, hCommand, hSegment, lCommand, lSegment, mCommand, mSegment, qCommand, qSegment, sCommand, sSegment, tCommand, tSegment, vCommand, vSegment, zCommand, zSegment };
//# sourceMappingURL=index.d.ts.map