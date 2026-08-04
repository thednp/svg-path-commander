import type { PathSegment } from "./types.ts";

/** The properties of a path segment found by segment lookup utilities. */
export type SegmentProperties = {
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
export type PointProperties = {
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
export type LineAttr = {
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
export type PolyAttr = {
  /** The element type. */
  type: "polygon" | "polyline";
  /** The points attribute value. */
  points: string;
  [key: string]: string | number;
};
/** The attributes of a `<circle>` element read by `shapeToPath`. */
export type CircleAttr = {
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
export type EllipseAttr = {
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
export type RectAttr = {
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
export type GlyphAttr = {
  /** The element type. */
  type: "glyph";
  /** The path data of the glyph. */
  d: string;
  [key: string]: string | number;
};

/** The parameter names read from each SVG shape element by `shapeToPath`. */
export type ShapeParams = {
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
export type PathBBox = {
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
export type SegmentLimits = {
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
export type ParserParams = {
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
export type LengthFactory = {
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
export type Options = {
  /** The amount of decimals to round path values to, or "off" to disable rounding. */
  round: "off" | number;
  /** The transform origin used for path transformations. */
  origin: number[];
};

/** A path segment and its transformation context (command letter and coordinates). */
export type PathTransform = {
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
export type TransformObject = {
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
export type TransformProps = keyof TransformObject;
/** The entries of a `TransformObject` (key-value pairs). */
export type TransformEntries = [
  TransformProps,
  TransformObject[TransformProps],
][];
