import type {
  CircleAttr,
  EllipseAttr,
  GlyphAttr,
  LineAttr,
  PathBBox,
  PolyAttr,
  RectAttr,
  TransformObject,
} from "./interface.ts";

/** Whitespace character codes recognized by the SVG path string tokenizer. */
export type SpaceNumber =
  | 0x1680
  | 0x180e
  | 0x2000
  | 0x2001
  | 0x2002
  | 0x2003
  | 0x2004
  | 0x2005
  | 0x2006
  | 0x2007
  | 0x2008
  | 0x2009
  | 0x200a
  | 0x202f
  | 0x205f
  | 0x3000
  | 0xfeff
  | 0x0a
  | 0x0d
  | 0x2028
  | 0x2029
  | 0x20
  | 0x09
  | 0x0b
  | 0x0c
  | 0xa0
  | 0x1680;

/** Character codes of all SVG path command letters. */
export type PathCommandNumber =
  | 0x6d
  | 0x7a
  | 0x6c
  | 0x68
  | 0x76
  | 0x63
  | 0x73
  | 0x71
  | 0x74
  | 0x61;

/** Character codes of the decimal digits 0-9. */
export type DigitNumber =
  | 0x30
  | 0x31
  | 0x32
  | 0x33
  | 0x34
  | 0x35
  | 0x36
  | 0x37
  | 0x38
  | 0x39;

// custom types
/** The absolute moveto command letter. */
export type MCommand = "M";
/** The relative moveto command letter. */
export type mCommand = "m";

/** The absolute lineto command letter. */
export type LCommand = "L";
/** The relative lineto command letter. */
export type lCommand = "l";

/** The absolute vertical lineto command letter. */
export type VCommand = "V";
/** The relative vertical lineto command letter. */
export type vCommand = "v";

/** The absolute horizontal lineto command letter. */
export type HCommand = "H";
/** The relative horizontal lineto command letter. */
export type hCommand = "h";

/** The absolute closepath command letter. */
export type ZCommand = "Z";
/** The relative closepath command letter. */
export type zCommand = "z";

/** The absolute cubic Bezier command letter. */
export type CCommand = "C";
/** The relative cubic Bezier command letter. */
export type cCommand = "c";

/** The absolute smooth cubic Bezier command letter. */
export type SCommand = "S";
/** The relative smooth cubic Bezier command letter. */
export type sCommand = "s";

/** The absolute quadratic Bezier command letter. */
export type QCommand = "Q";
/** The relative quadratic Bezier command letter. */
export type qCommand = "q";

/** The absolute smooth quadratic Bezier command letter. */
export type TCommand = "T";
/** The relative smooth quadratic Bezier command letter. */
export type tCommand = "t";

/** The absolute elliptical arc command letter. */
export type ACommand = "A";
/** The relative elliptical arc command letter. */
export type aCommand = "a";

/** The union of all absolute path command letters. */
export type AbsoluteCommand =
  | MCommand
  | LCommand
  | VCommand
  | HCommand
  | ZCommand
  | CCommand
  | SCommand
  | QCommand
  | TCommand
  | ACommand;

/** The union of all relative path command letters. */
export type RelativeCommand =
  | mCommand
  | lCommand
  | vCommand
  | hCommand
  | zCommand
  | cCommand
  | sCommand
  | qCommand
  | tCommand
  | aCommand;

/** Any SVG path command letter, absolute or relative. */
export type PathCommand = AbsoluteCommand | RelativeCommand;

/** The absolute moveto segment tuple `[M, x, y]`. */
export type MSegment = [MCommand, number, number];
/** The relative moveto segment tuple `[m, dx, dy]`. */
export type mSegment = [mCommand, number, number];
/** The moveto segment, absolute or relative. */
export type MoveSegment = MSegment | mSegment;

/** The absolute lineto segment tuple `[L, x, y]`. */
export type LSegment = [LCommand, number, number];
/** The relative lineto segment tuple `[l, dx, dy]`. */
export type lSegment = [lCommand, number, number];
/** The lineto segment, absolute or relative. */
export type LineSegment = LSegment | lSegment;

/** The absolute vertical lineto segment tuple `[V, y]`. */
export type VSegment = [VCommand, number];
/** The relative vertical lineto segment tuple `[v, dy]`. */
export type vSegment = [vCommand, number];
/** The vertical lineto segment, absolute or relative. */
export type VertLineSegment = vSegment | VSegment;

/** The absolute horizontal lineto segment tuple `[H, x]`. */
export type HSegment = [HCommand, number];
/** The relative horizontal lineto segment tuple `[h, dx]`. */
export type hSegment = [hCommand, number];
/** The horizontal lineto segment, absolute or relative. */
export type HorLineSegment = HSegment | hSegment;

/** The absolute closepath segment tuple `[Z]`. */
export type ZSegment = [ZCommand];
/** The relative closepath segment tuple `[z]`. */
export type zSegment = [zCommand];
/** The closepath segment, absolute or relative. */
export type CloseSegment = ZSegment | zSegment;

/** The absolute cubic Bezier segment tuple `[C, x1, y1, x2, y2, x, y]`. */
export type CSegment = [
  CCommand,
  number,
  number,
  number,
  number,
  number,
  number,
];
/** The relative cubic Bezier segment tuple `[c, dx1, dy1, dx2, dy2, dx, dy]`. */
export type cSegment = [
  cCommand,
  number,
  number,
  number,
  number,
  number,
  number,
];
/** The cubic Bezier segment, absolute or relative. */
export type CubicSegment = CSegment | cSegment;

/** The absolute smooth cubic Bezier segment tuple `[S, x2, y2, x, y]`. */
export type SSegment = [SCommand, number, number, number, number];
/** The relative smooth cubic Bezier segment tuple `[s, dx2, dy2, dx, dy]`. */
export type sSegment = [sCommand, number, number, number, number];
/** The smooth cubic Bezier segment, absolute or relative. */
export type ShortCubicSegment = SSegment | sSegment;

/** The absolute quadratic Bezier segment tuple `[Q, x1, y1, x, y]`. */
export type QSegment = [QCommand, number, number, number, number];
/** The relative quadratic Bezier segment tuple `[q, dx1, dy1, dx, dy]`. */
export type qSegment = [qCommand, number, number, number, number];
/** The quadratic Bezier segment, absolute or relative. */
export type QuadSegment = QSegment | qSegment;

/** The absolute smooth quadratic Bezier segment tuple `[T, x, y]`. */
export type TSegment = [TCommand, number, number];
/** The relative smooth quadratic Bezier segment tuple `[t, dx, dy]`. */
export type tSegment = [tCommand, number, number];
/** The smooth quadratic Bezier segment, absolute or relative. */
export type ShortQuadSegment = TSegment | tSegment;

/** The absolute elliptical arc segment tuple `[A, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y]`. */
export type ASegment = [
  ACommand,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];
/** The relative elliptical arc segment tuple `[a, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, dx, dy]`. */
export type aSegment = [
  aCommand,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];
/** The elliptical arc segment, absolute or relative. */
export type ArcSegment = ASegment | aSegment;

/** Any SVG path command segment. */
export type PathSegment =
  | MoveSegment
  | LineSegment
  | VertLineSegment
  | HorLineSegment
  | CloseSegment
  | CubicSegment
  | ShortCubicSegment
  | QuadSegment
  | ShortQuadSegment
  | ArcSegment;

/** Any shorthand or single-coordinate path segment. */
export type ShortSegment =
  | VertLineSegment
  | HorLineSegment
  | ShortCubicSegment
  | ShortQuadSegment
  | CloseSegment;

/** Any absolute path command segment. */
export type AbsoluteSegment =
  | MSegment
  | LSegment
  | VSegment
  | HSegment
  | CSegment
  | SSegment
  | QSegment
  | TSegment
  | ASegment
  | ZSegment;

/** Any relative path command segment. */
export type RelativeSegment =
  | mSegment
  | lSegment
  | vSegment
  | hSegment
  | cSegment
  | sSegment
  | qSegment
  | tSegment
  | aSegment
  | zSegment;

/** The path segments used by the normalized form (no shorthand commands). */
export type NormalSegment =
  | MSegment
  | LSegment
  | CSegment
  | QSegment
  | ASegment
  | ZSegment;

/** A parsed SVG path string as an array of path segments. */
export type PathArray = [MSegment | mSegment, ...PathSegment[]];
/** A `PathArray` with only absolute path segments. */
export type AbsoluteArray = [MSegment, ...AbsoluteSegment[]];
/** A `PathArray` with only relative path segments. */
export type RelativeArray = [MSegment, ...RelativeSegment[]];
/** A `PathArray` with only normalized segments (no shorthand commands). */
export type NormalArray = [MSegment, ...NormalSegment[]];
/** A `PathArray` with only moveto and cubic Bezier segments. */
export type CurveArray = [MSegment, ...CSegment[]];
/** A `CurveArray` ending with a closepath segment. */
export type ClosedCurveArray = [MSegment, ...CSegment[], ZSegment];
/** A `PathArray` describing a closed polygon (moveto, lineto and closepath). */
export type PolygonArray = [MSegment, ...LSegment[], ZSegment];
/** A `PathArray` describing an open polyline (moveto and lineto). */
export type PolylineArray = [MSegment, ...LSegment[]];
/** The `PathArray` shapes supported by path morphing. */
export type MorphPathArray =
  | PolygonArray
  | PolylineArray
  | CurveArray
  | ClosedCurveArray;

/** The SVG element types that can be converted to a path. */
export type ShapeTypes =
  | SVGPolylineElement
  | SVGPolygonElement
  | SVGLineElement
  | SVGEllipseElement
  | SVGCircleElement
  | SVGRectElement;

/** The tag names of the SVG elements that can be converted to a path. */
export type ShapeTags =
  | "line"
  | "polyline"
  | "polygon"
  | "ellipse"
  | "circle"
  | "rect"
  | "glyph";

/** The shape attributes mapped to each supported SVG element type. */
export type ShapeOps =
  | LineAttr
  | PolyAttr
  | PolyAttr
  | EllipseAttr
  | CircleAttr
  | RectAttr
  | GlyphAttr;

/** A `TransformObject` with a required 3D origin. */
export type TransformObjectValues = Partial<TransformObject> & {
  /** The transform origin. */
  origin: [number, number, number];
};

/** A 2D point with `x` and `y` coordinates. */
export type Point = {
  /** The X coordinate. */
  x: number;
  /** The Y coordinate. */
  y: number;
};

/** A 2D point as a tuple `[x, y]`. */
export type PointTuple = [number, number];

/** A `Point` with a `t` parameter (a point on a curve at ratio `t`). */
export type DerivedPoint = Point & {
  /** The parameter ratio in `[0-1]`. */
  t: number;
};
/** The six points of a quadratic Bezier curve (on-curve and off-curve control points). */
export type QuadPoints = [Point, Point, Point, Point, Point, Point];
/** The eight points of a cubic Bezier curve (on-curve and off-curve control points). */
export type CubicPoints = [
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
  Point,
];
/** The six derived points of a quadratic Bezier curve, each with a `t` parameter. */
export type DerivedQuadPoints = [
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
];
/** The eight derived points of a cubic Bezier curve, each with a `t` parameter. */
export type DerivedCubicPoints = [
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
  DerivedPoint,
];
/** The six coordinates of a quadratic Bezier segment `[x1, y1, cx, cy, x, y]`. */
export type QuadCoordinates = [number, number, number, number, number, number];
/** The eight coordinates of a cubic Bezier segment. */
export type CubicCoordinates = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];
/** The coordinates of an arc segment (the eight numbers after the command letter). */
export type ArcCoordinates = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];
/** The four coordinates of a line segment `[x1, y1, x2, y2]`. */
export type LineCoordinates = [number, number, number, number];

/** A function that derives a point on a curve at a given `t` ratio. */
export type DeriveCallback = (t: number) => Point;

/** A callback invoked for each segment while iterating over a `PathArray`. */
export type IteratorCallback<
  T extends PathArray,
  K extends keyof T = number,
> = (
  segment: PathSegment & T[K],
  index: number,
  lastX: number,
  lastY: number,
) => PathSegment | T[K] | false | void | undefined;

/** The bounding box extremes `[minX, minY, maxX, maxY]`. */
export type BBoxMaxima = [
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
];
/** A point on the path at a given length, including the `t` ratio. */
export type PointAtLength = {
  /** The X coordinate. */
  x: number;
  /** The Y coordinate. */
  y: number;
  /** The parameter ratio in `[0-1]`. */
  t: number;
};
/** An intersection point between two curves, including both `t` ratios. */
export type IntersectionPoint = {
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
export interface IntersectionOptions {
  /** Whether to only count the intersections without computing points. */
  justCount?: boolean;
  /** The epsilon value used for precision. */
  epsilon?: number;
}

/** Options for equalizing a single path to a given segment count. */
export interface PathEqualizationOptions {
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
export interface EqualizationOptions {
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
export type PathsEqualizationOptions = Omit<
  EqualizationOptions,
  "reverse" | "target"
>;

/** The geometric features of a path used for matching during morphing. */
export interface PathFeature {
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
