import type { PathSegment } from "./types.ts";

/** The properties of a path segment found by segment lookup utilities. */
export type SegmentProperties = {
  segment: PathSegment;
  index: number;
  length: number;
  lengthAtSegment: number;
  // point: Point;
  // [key: string]: any;
};

/** The closest point on the path to a given point, with the distance and optional segment. */
export type PointProperties = {
  closest: {
    x: number;
    y: number;
  };
  distance: number;
  segment?: SegmentProperties;
};

/** The attributes of a `<line>` element read by `shapeToPath`. */
export type LineAttr = {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  [key: string]: string | number;
};
/** The attributes of a `<polygon>` or `<polyline>` element read by `shapeToPath`. */
export type PolyAttr = {
  type: "polygon" | "polyline";
  points: string;
  [key: string]: string | number;
};
/** The attributes of a `<circle>` element read by `shapeToPath`. */
export type CircleAttr = {
  type: "circle";
  cx: number;
  cy: number;
  r: number;
  [key: string]: string | number;
};
/** The attributes of an `<ellipse>` element read by `shapeToPath`. */
export type EllipseAttr = {
  type: "ellipse";
  cx: number;
  cy: number;
  rx: number;
  ry?: number;
  [key: string]: string | number | undefined;
};
/** The attributes of a `<rect>` element read by `shapeToPath`. */
export type RectAttr = {
  type: "rect";
  width: number;
  height: number;
  x: number;
  y: number;
  rx?: number;
  ry?: number;
  [key: string]: string | number | undefined;
};
/** The attributes of a `<glyph>` element read by `shapeToPath`. */
export type GlyphAttr = {
  type: "glyph";
  d: string;
  [key: string]: string | number;
};

/** The parameter names read from each SVG shape element by `shapeToPath`. */
export type ShapeParams = {
  line: ["x1", "y1", "x2", "y2"];
  circle: ["cx", "cy", "r"];
  ellipse: ["cx", "cy", "rx", "ry"];
  rect: ["width", "height", "x", "y", "rx", "ry"];
  polygon: ["points"];
  polyline: ["points"];
  glyph: ["d"];
};

/** The bounding box of a path, equivalent to the native `getBBox()` result. */
export type PathBBox = {
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
/** The minimum and maximum points of a segment bounding box. */
export type SegmentLimits = {
  min: { x: number; y: number };
  max: { x: number; y: number };
};

/** The current state tracked by the SVG path string parser. */
export type ParserParams = {
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

/** The result of a length computation factory: length, point and segment limits. */
export type LengthFactory = {
  length: number;
  point: { x: number; y: number };
  min: { x: number; y: number };
  max: { x: number; y: number };
};

/** The `SVGPathCommander` instance options. */
export type Options = {
  round: "off" | number;
  origin: number[];
};

/** A path segment and its transformation context (command letter and coordinates). */
export type PathTransform = {
  s: PathSegment;
  c: string;
  x: number;
  y: number;
};

/** A transform function object with translate, rotate, scale, skew and origin. */
export type TransformObject = {
  translate: number | number[];
  rotate: number | number[];
  scale: number | number[];
  skew: number | number[];
  origin: number[];
};

/** The keys of a `TransformObject`. */
export type TransformProps = keyof TransformObject;
/** The entries of a `TransformObject` (key-value pairs). */
export type TransformEntries = [
  TransformProps,
  TransformObject[TransformProps],
][];
