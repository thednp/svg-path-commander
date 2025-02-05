import CSSMatrix from '@thednp/dommatrix';
export { default as CSSMatrix } from '@thednp/dommatrix';

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
type CSegment = [
    CCommand,
    number,
    number,
    number,
    number,
    number,
    number
];
type cSegment = [
    cCommand,
    number,
    number,
    number,
    number,
    number,
    number
];
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
type ASegment = [
    ACommand,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
type aSegment = [
    aCommand,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
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
type PolygonArray = [MSegment, ...LSegment[], ZSegment];
type PolylineArray = [MSegment, ...LSegment[]];
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
type CubicPoints = [
    Point,
    Point,
    Point,
    Point,
    Point,
    Point,
    Point,
    Point
];
type DerivedQuadPoints = [
    DerivedPoint,
    DerivedPoint,
    DerivedPoint,
    DerivedPoint,
    DerivedPoint,
    DerivedPoint
];
type DerivedCubicPoints = [
    DerivedPoint,
    DerivedPoint,
    DerivedPoint,
    DerivedPoint,
    DerivedPoint,
    DerivedPoint,
    DerivedPoint,
    DerivedPoint
];
type QuadCoordinates = [number, number, number, number, number, number];
type CubicCoordinates = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
type ArcCoordinates = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
type LineCoordinates = [number, number, number, number];
type DeriveCallback = (t: number) => Point;
type IteratorCallback = (segment: PathSegment, index: number, lastX: number, lastY: number) => PathSegment | false | void | undefined;

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
type TransformEntries = [
    TransformProps,
    TransformObject[TransformProps]
][];

/**
 * Returns the Arc segment length.
 * @param rx radius along X axis
 * @param ry radius along Y axis
 * @param theta the angle in radians
 * @returns the arc length
 */
declare const arcLength: (rx: number, ry: number, theta: number) => number;
/**
 * Find point on ellipse at given angle around ellipse (theta);
 * @param cx the center X
 * @param cy the center Y
 * @param rx the radius X
 * @param ry the radius Y
 * @param alpha the arc rotation angle in radians
 * @param theta the arc sweep angle in radians
 * @returns a point around ellipse at given angle
 */
declare const arcPoint: (cx: number, cy: number, rx: number, ry: number, alpha: number, theta: number) => PointTuple;
/**
 * Returns the angle between two points.
 * @param v0 starting point
 * @param v1 ending point
 * @returns the angle in radian
 */
declare const angleBetween: (v0: Point, v1: Point) => number;
/**
 * Returns the following properties for an Arc segment: center, start angle,
 * end angle, and radiuses on X and Y axis.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param RX the radius on X axis
 * @param RY the radius on Y axis
 * @param angle the ellipse rotation in degrees
 * @param LAF the large arc flag
 * @param SF the sweep flag
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns properties specific to Arc segments
 */
declare const getArcProps: (x1: number, y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, x: number, y: number) => {
    rx: number;
    ry: number;
    startAngle: number;
    endAngle: number;
    center: {
        x: number;
        y: number;
    };
};
/**
 * Returns the length of an Arc segment.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param c1x the first control point X
 * @param c1y the first control point Y
 * @param c2x the second control point X
 * @param c2y the second control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns the length of the Arc segment
 */
declare const getArcLength: (x1: number, y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, x: number, y: number) => number;
/**
 * Returns a point along an Arc segment at a given distance.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param RX the radius on X axis
 * @param RY the radius on Y axis
 * @param angle the ellipse rotation in degrees
 * @param LAF the large arc flag
 * @param SF the sweep flag
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param distance a [0-1] ratio
 * @returns a point along the Arc segment
 */
declare const getPointAtArcLength: (x1: number, y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, x: number, y: number, distance?: number) => {
    x: number;
    y: number;
};
/**
 * Returns the extrema for an Arc segment in the following format:
 * [MIN_X, MIN_Y, MAX_X, MAX_Y]
 *
 * @see https://github.com/herrstrietzel/svg-pathdata-getbbox
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param RX the radius on X axis
 * @param RY the radius on Y axis
 * @param angle the ellipse rotation in degrees
 * @param LAF the large arc flag
 * @param SF the sweep flag
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns the extrema of the Arc segment
 */
declare const getArcBBox: (x1: number, y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, x: number, y: number) => [number, number, number, number];

declare const arcTools_angleBetween: typeof angleBetween;
declare const arcTools_arcLength: typeof arcLength;
declare const arcTools_arcPoint: typeof arcPoint;
declare const arcTools_getArcBBox: typeof getArcBBox;
declare const arcTools_getArcLength: typeof getArcLength;
declare const arcTools_getArcProps: typeof getArcProps;
declare const arcTools_getPointAtArcLength: typeof getPointAtArcLength;
declare namespace arcTools {
  export { arcTools_angleBetween as angleBetween, arcTools_arcLength as arcLength, arcTools_arcPoint as arcPoint, arcTools_getArcBBox as getArcBBox, arcTools_getArcLength as getArcLength, arcTools_getArcProps as getArcProps, arcTools_getPointAtArcLength as getPointAtArcLength };
}

/**
 * Tools from bezier.js by Mike 'Pomax' Kamermans
 * @see https://github.com/Pomax/bezierjs
 */
declare const Tvalues: number[];
declare const Cvalues: number[];
/**
 * @param points
 * @returns
 */
declare const deriveBezier: (points: QuadPoints | CubicPoints) => (DerivedQuadPoints | DerivedCubicPoints)[];
/**
 * @param points
 * @param t
 */
declare const computeBezier: (points: DerivedQuadPoints | DerivedCubicPoints, t: number) => DerivedPoint;
declare const calculateBezier: (derivativeFn: DeriveCallback, t: number) => number;
declare const bezierLength: (derivativeFn: DeriveCallback) => number;
/**
 * Returns the length of CubicBezier / Quad segment.
 * @param curve cubic / quad bezier segment
 */
declare const getBezierLength: (curve: CubicCoordinates | QuadCoordinates) => number;
declare const CBEZIER_MINMAX_EPSILON = 1e-8;
/**
 * Returns the most extreme points in a Quad Bezier segment.
 * @param A an array which consist of X/Y values
 */
declare const minmaxQ: ([v1, cp, v2]: [number, number, number]) => PointTuple;
/**
 * Returns the most extreme points in a Cubic Bezier segment.
 * @param A an array which consist of X/Y values
 * @see https://github.com/kpym/SVGPathy/blob/acd1a50c626b36d81969f6e98e8602e128ba4302/lib/box.js#L127
 */
declare const minmaxC: ([v1, cp1, cp2, v2]: [number, number, number, number]) => PointTuple;

declare const bezierTools_CBEZIER_MINMAX_EPSILON: typeof CBEZIER_MINMAX_EPSILON;
declare const bezierTools_Cvalues: typeof Cvalues;
declare const bezierTools_Tvalues: typeof Tvalues;
declare const bezierTools_bezierLength: typeof bezierLength;
declare const bezierTools_calculateBezier: typeof calculateBezier;
declare const bezierTools_computeBezier: typeof computeBezier;
declare const bezierTools_deriveBezier: typeof deriveBezier;
declare const bezierTools_getBezierLength: typeof getBezierLength;
declare const bezierTools_minmaxC: typeof minmaxC;
declare const bezierTools_minmaxQ: typeof minmaxQ;
declare namespace bezierTools {
  export { bezierTools_CBEZIER_MINMAX_EPSILON as CBEZIER_MINMAX_EPSILON, bezierTools_Cvalues as Cvalues, bezierTools_Tvalues as Tvalues, bezierTools_bezierLength as bezierLength, bezierTools_calculateBezier as calculateBezier, bezierTools_computeBezier as computeBezier, bezierTools_deriveBezier as deriveBezier, bezierTools_getBezierLength as getBezierLength, bezierTools_minmaxC as minmaxC, bezierTools_minmaxQ as minmaxQ };
}

/**
 * Returns a point at a given length of a CubicBezier segment.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param c1x the first control point X
 * @param c1y the first control point Y
 * @param c2x the second control point X
 * @param c2y the second control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param t a [0-1] ratio
 * @returns the point at cubic-bezier segment length
 */
declare const getPointAtCubicSegmentLength: ([x1, y1, c1x, c1y, c2x, c2y, x2, y2]: CubicCoordinates, t: number) => {
    x: number;
    y: number;
};
/**
 * Returns the length of a CubicBezier segment.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param c1x the first control point X
 * @param c1y the first control point Y
 * @param c2x the second control point X
 * @param c2y the second control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns the CubicBezier segment length
 */
declare const getCubicLength: (x1: number, y1: number, c1x: number, c1y: number, c2x: number, c2y: number, x2: number, y2: number) => number;
/**
 * Returns the point along a CubicBezier segment at a given distance.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param c1x the first control point X
 * @param c1y the first control point Y
 * @param c2x the second control point X
 * @param c2y the second control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param distance the distance to look at
 * @returns the point at CubicBezier length
 */
declare const getPointAtCubicLength: (x1: number, y1: number, c1x: number, c1y: number, c2x: number, c2y: number, x2: number, y2: number, distance?: number) => {
    x: number;
    y: number;
};
/**
 * Returns the boundig box of a CubicBezier segment in the following format:
 * [MIN_X, MIN_Y, MAX_X, MAX_Y]
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param c1x the first control point X
 * @param c1y the first control point Y
 * @param c2x the second control point X
 * @param c2y the second control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns the extrema of the CubicBezier segment
 */
declare const getCubicBBox: (x1: number, y1: number, c1x: number, c1y: number, c2x: number, c2y: number, x2: number, y2: number) => [number, number, number, number];

declare const cubicTools_getCubicBBox: typeof getCubicBBox;
declare const cubicTools_getCubicLength: typeof getCubicLength;
declare const cubicTools_getPointAtCubicLength: typeof getPointAtCubicLength;
declare const cubicTools_getPointAtCubicSegmentLength: typeof getPointAtCubicSegmentLength;
declare namespace cubicTools {
  export { cubicTools_getCubicBBox as getCubicBBox, cubicTools_getCubicLength as getCubicLength, cubicTools_getPointAtCubicLength as getPointAtCubicLength, cubicTools_getPointAtCubicSegmentLength as getPointAtCubicSegmentLength };
}

/**
 * Returns length for line segments (MoveTo, LineTo).
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns the line segment length
 */
declare const getLineLength: (x1: number, y1: number, x2: number, y2: number) => number;
/**
 * Returns a point along the line segments (MoveTo, LineTo).
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param distance the distance to point in [0-1] range
 * @returns the point at length
 */
declare const getPointAtLineLength: (x1: number, y1: number, x2: number, y2: number, distance?: number) => {
    x: number;
    y: number;
};
/**
 * Returns bounding box for line segments (MoveTo, LineTo).
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param distance the distance to point in [0-1] range
 * @returns the extrema for line segments
 */
declare const getLineBBox: (x1: number, y1: number, x2: number, y2: number) => [number, number, number, number];

declare const lineTools_getLineBBox: typeof getLineBBox;
declare const lineTools_getLineLength: typeof getLineLength;
declare const lineTools_getPointAtLineLength: typeof getPointAtLineLength;
declare namespace lineTools {
  export { lineTools_getLineBBox as getLineBBox, lineTools_getLineLength as getLineLength, lineTools_getPointAtLineLength as getPointAtLineLength };
}

/**
 * Returns the {x,y} coordinates of a point at a
 * given length of a quadratic-bezier segment.
 *
 * @see https://github.com/substack/point-at-length
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param cx the control point X
 * @param cy the control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param t a [0-1] ratio
 * @returns the requested {x,y} coordinates
 */
declare const getPointAtQuadSegmentLength: ([x1, y1, cx, cy, x2, y2]: QuadCoordinates, t: number) => {
    x: number;
    y: number;
};
/**
 * Returns the length of a QuadraticBezier segment.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param cx the control point X
 * @param cy the control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns the QuadraticBezier segment length
 */
declare const getQuadLength: (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number) => number;
/**
 * Returns the point along a QuadraticBezier segment at a given distance.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param cx the control point X
 * @param cy the control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param distance the distance to look at
 * @returns the point at QuadraticBezier length
 */
declare const getPointAtQuadLength: (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, distance?: number) => {
    x: number;
    y: number;
};
/**
 * Returns the boundig box of a QuadraticBezier segment in the following format:
 * [MIN_X, MIN_Y, MAX_X, MAX_Y]
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param cx the control point X
 * @param cy the control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns the extrema of the QuadraticBezier segment
 */
declare const getQuadBBox: (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number) => [number, number, number, number];

declare const quadTools_getPointAtQuadLength: typeof getPointAtQuadLength;
declare const quadTools_getPointAtQuadSegmentLength: typeof getPointAtQuadSegmentLength;
declare const quadTools_getQuadBBox: typeof getQuadBBox;
declare const quadTools_getQuadLength: typeof getQuadLength;
declare namespace quadTools {
  export { quadTools_getPointAtQuadLength as getPointAtQuadLength, quadTools_getPointAtQuadSegmentLength as getPointAtQuadSegmentLength, quadTools_getQuadBBox as getQuadBBox, quadTools_getQuadLength as getQuadLength };
}

/**
 * d3-polygon-area
 * https://github.com/d3/d3-polygon
 *
 * Returns the area of a polygon.
 *
 * @param polygon an array of coordinates
 * @returns the polygon area
 */
declare const polygonArea: (polygon: PointTuple[]) => number;
/**
 * d3-polygon-length
 * https://github.com/d3/d3-polygon
 *
 * Returns the perimeter of a polygon.
 *
 * @param polygon an array of coordinates
 * @returns the polygon length
 */
declare const polygonLength: (polygon: PointTuple[]) => number;

declare const polygonTools_polygonArea: typeof polygonArea;
declare const polygonTools_polygonLength: typeof polygonLength;
declare namespace polygonTools {
  export { polygonTools_polygonArea as polygonArea, polygonTools_polygonLength as polygonLength };
}

/**
 * Returns the square root of the distance
 * between two given points.
 *
 * @param a the first point coordinates
 * @param b the second point coordinates
 * @returns the distance value
 */
declare const distanceSquareRoot: (a: PointTuple, b: PointTuple) => number;

/**
 * Returns the coordinates of a specified distance
 * ratio between two points.
 *
 * @param a the first point coordinates
 * @param b the second point coordinates
 * @param t the ratio
 * @returns the midpoint coordinates
 */
declare const midPoint: (a: PointTuple, b: PointTuple, t: number) => PointTuple;

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

declare const roundTo: (n: number, round: number) => number;

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to absolute values.
 *
 * @param pathInput the path string | object
 * @returns the resulted `pathArray` with absolute values
 */
declare const pathToAbsolute: (pathInput: string | PathArray) => AbsoluteArray;

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to relative values.
 *
 * @param pathInput the path string | object
 * @returns the resulted `pathArray` with relative values
 */
declare const pathToRelative: (pathInput: string | PathArray) => RelativeArray;

/**
 * Parses a path string value or 'pathArray' and returns a new one
 * in which all segments are converted to cubic-bezier.
 *
 * In addition, un-necessary `Z` segment is removed if previous segment
 * extends to the `M` segment.
 *
 * @param pathInput the string to be parsed or 'pathArray'
 * @returns the resulted `pathArray` converted to cubic-bezier
 */
declare const pathToCurve: (pathInput: string | PathArray) => CurveArray;

/**
 * Returns a valid `d` attribute string value created
 * by rounding values and concatenating the `pathArray` segments.
 *
 * @param path the `pathArray` object
 * @param roundOption amount of decimals to round values to
 * @returns the concatenated path string
 */
declare const pathToString: (path: PathArray, roundOption?: number | "off") => string;

/**
 * Parses a path string value and returns an array
 * of segments we like to call `pathArray`.
 *
 * @param pathInput the string to be parsed
 * @returns the resulted `pathArray` or error string
 */
declare const parsePathString: <T extends PathArray>(pathInput: string | T) => PathArray;

/**
 * The `PathParser` is used by the `parsePathString` static method
 * to generate a `pathArray`.
 *
 * @param pathString
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

/**
 * Breaks the parsing of a pathString once a segment is finalized.
 *
 * @param path the `PathParser` instance
 */
declare const finalizeSegment: (path: PathParser) => void;

declare const invalidPathValue = "Invalid path value";

/**
 * Checks if the character is an A (arc-to) path command.
 *
 * @param code the character to check
 * @returns check result
 */
declare const isArcCommand: (code: number) => code is 97;

/**
 * Checks if a character is a digit.
 *
 * @param code the character to check
 * @returns check result
 */
declare const isDigit: (code: number) => code is DigitNumber;

/**
 * Checks if the character is or belongs to a number.
 * [0-9]|+|-|.
 *
 * @param code the character to check
 * @returns check result
 */
declare const isDigitStart: (code: number) => code is DigitNumber | 43 | 45 | 46;

/**
 * Checks if the character is a MoveTo command.
 *
 * @param code the character to check
 * @returns check result
 */
declare const isMoveCommand: (code: number) => code is 109 | 77;

/**
 * Checks if the character is a path command.
 *
 * @param code the character to check
 * @returns check result
 */
declare const isPathCommand: (code: number) => code is PathCommandNumber;

/**
 * Checks if the character is a space.
 *
 * @param ch the character to check
 * @returns check result
 */
declare const isSpace: (ch: number) => ch is SpaceNumber;

/** Segment params length */
declare const paramsCount: {
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

declare const paramsParser: ParserParams;

/**
 * Validates an A (arc-to) specific path command value.
 * Usually a `large-arc-flag` or `sweep-flag`.
 *
 * @param path the `PathParser` instance
 */
declare const scanFlag: (path: PathParser) => void;

/**
 * Validates every character of the path string,
 * every path command, negative numbers or floating point numbers.
 *
 * @param path the `PathParser` instance
 */
declare const scanParam: (path: PathParser) => void;

/**
 * Scans every character in the path string to determine
 * where a segment starts and where it ends.
 *
 * @param path the `PathParser` instance
 */
declare const scanSegment: (path: PathParser) => void;

/**
 * Points the parser to the next character in the
 * path string every time it encounters any kind of
 * space character.
 *
 * @param path the `PathParser` instance
 */
declare const skipSpaces: (path: PathParser) => void;

declare const getPathBBox: (pathInput: PathArray | string) => {
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
 * Returns the shape total length, or the equivalent to `shape.getTotalLength()`.
 *
 * @param pathInput the target `pathArray`
 * @returns the shape total length
 */
declare const getTotalLength: (pathInput: string | PathArray) => number;

declare const DISTANCE_EPSILON = 0.00001;

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

/**
 * Check if a path is drawn clockwise and returns true if so,
 * false otherwise.
 *
 * @param path the path string or `pathArray`
 * @returns true when clockwise or false if not
 */
declare const getDrawDirection: (path: string | PathArray) => boolean;

/**
 * Returns the area of a shape.
 *
 * @author Jürg Lehni & Jonathan Puckey
 *
 * @see https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
 *
 * @param path the shape `pathArray`
 * @returns the length of the cubic-bezier segment
 */
declare const getPathArea: (path: PathArray) => number;

/**
 * Returns [x,y] coordinates of a point at a given length of a shape.
 *
 * @param pathInput the `pathArray` to look into
 * @param distance the length of the shape to look at
 * @returns the requested {x, y} point coordinates
 */
declare const getPointAtLength: (pathInput: string | PathArray, distance?: number) => {
    x: number;
    y: number;
};

/**
 * Returns the segment, its index and length as well as
 * the length to that segment at a given length in a path.
 *
 * @param pathInput target `pathArray`
 * @param distance the given length
 * @returns the requested properties
 */
declare const getPropertiesAtLength: (pathInput: string | PathArray, distance?: number) => SegmentProperties;

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
declare const getPropertiesAtPoint: (pathInput: string | PathArray, point: Point) => PointProperties;

/**
 * Returns the segment at a given length.
 *
 * @param pathInput the target `pathArray`
 * @param distance the distance in path to look at
 * @returns the requested segment
 */
declare const getSegmentAtLength: (pathInput: string | PathArray, distance?: number) => PathSegment | undefined;

/**
 * Returns the path segment which contains a given point.
 *
 * @param path the `pathArray` to look into
 * @param point the point of the shape to look for
 * @returns the requested segment
 */
declare const getSegmentOfPoint: (path: string | PathArray, point: {
    x: number;
    y: number;
}) => SegmentProperties | undefined;

/**
 * Iterates an array to check if it's a `pathArray`
 * with all absolute values.
 *
 * @param path the `pathArray` to be checked
 * @returns iteration result
 */
declare const isAbsoluteArray: (path: unknown) => path is AbsoluteArray;

/**
 * Iterates an array to check if it's a `pathArray`
 * with all C (cubic bezier) segments.
 *
 * @param path the `Array` to be checked
 * @returns iteration result
 */
declare const isCurveArray: (path: unknown) => path is CurveArray;

/**
 * Iterates an array to check if it's a `pathArray`
 * with all segments are in non-shorthand notation
 * with absolute values.
 *
 * @param {string | SVGPath.pathArray} path the `pathArray` to be checked
 * @returns {boolean} iteration result
 */
declare const isNormalizedArray: (path: unknown) => path is NormalArray;

/**
 * Iterates an array to check if it's an actual `pathArray`.
 *
 * @param path the `pathArray` to be checked
 * @returns iteration result
 */
declare const isPathArray: (path: unknown) => path is PathArray;

/**
 * Checks if a given point is in the stroke of a path.
 *
 * @param pathInput target path
 * @param point the given `{x,y}` point
 * @returns the query result
 */
declare const isPointInStroke: (pathInput: string | PathArray, point: {
    x: number;
    y: number;
}) => boolean;

/**
 * Iterates an array to check if it's a `pathArray`
 * with relative values.
 *
 * @param path the `pathArray` to be checked
 * @returns iteration result
 */
declare const isRelativeArray: (path: unknown) => path is RelativeArray;

/**
 * Parses a path string value to determine its validity
 * then returns true if it's valid or false otherwise.
 *
 * @param pathString the path string to be parsed
 * @returns the path string validity
 */
declare const isValidPath: (pathString: string) => boolean;

/**
 * Supported shapes and their specific parameters.
 */
declare const shapeParams: ShapeParams;

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
 * @param element target shape
 * @param replace option to replace target
 * @param ownerDocument document for create element
 * @return the newly created `<path>` element
 */
declare const shapeToPath: (element: ShapeTypes | ShapeOps, replace?: boolean, ownerDocument?: Document) => SVGPathElement | false;

/**
 * Returns a new `pathArray` created from attributes of a `<line>`, `<polyline>`,
 * `<polygon>`, `<rect>`, `<ellipse>`, `<circle>`, <path> or `<glyph>`.
 *
 * It can also work with an options object, see the type below
 * @see ShapeOps
 *
 * @param element target shape
 * @return the newly created `<path>` element
 */
declare const shapeToPathArray: (element: ShapeTypes | ShapeOps) => false | PathArray;

/**
 * Normalizes a `pathArray` object for further processing:
 * * convert segments to absolute values
 * * convert shorthand path commands to their non-shorthand notation
 *
 * @param pathInput the string to be parsed or 'pathArray'
 * @returns the normalized `pathArray`
 */
declare const normalizePath: (pathInput: string | PathArray) => NormalArray;

/**
 * Optimizes a `pathArray` object:
 * * convert segments to shorthand if possible
 * * select shortest segments from absolute and relative `pathArray`s
 *
 * @param pathInput a string or `pathArray`
 * @param roundOption the amount of decimals to round values to
 * @returns the optimized `pathArray`
 */
declare const optimizePath: (pathInput: PathArray, roundOption?: number) => PathArray;

/**
 * Reverses all segments of a `pathArray` and returns a new `pathArray` instance
 * with absolute values.
 *
 * @param pathInput the source `pathArray`
 * @returns the reversed `pathArray`
 */
declare const reversePath: (pathInput: PathArray) => PathArray;

/**
 * Split a path into an `Array` of sub-path strings.
 *
 * In the process, values are converted to absolute
 * for visual consistency.
 *
 * @param pathInput the source `pathArray`
 * @return an array with all sub-path strings
 */
declare const splitPath: (pathInput: PathArray) => PathArray[];

/**
 * Apply a 2D / 3D transformation to a `pathArray` instance.
 *
 * Since *SVGElement* doesn't support 3D transformation, this function
 * creates a 2D projection of the <path> element.
 *
 * @param path the `pathArray` to apply transformation
 * @param transform the transform functions `Object`
 * @returns the resulted `pathArray`
 */
declare const transformPath: (pathInput: PathArray | string, transform?: Partial<TransformObject>) => PathArray;

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
 * @return the resulting cubic-bezier segment(s)
 */
declare const arcToCubic: (X1: number, Y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, X2: number, Y2: number, recursive?: [number, number, number, number]) => number[];

/**
 * Returns a transformation matrix to apply to `<path>` elements.
 *
 * @see TransformObjectValues
 *
 * @param transform the `transformObject`
 * @returns a new transformation matrix
 */
declare const getSVGMatrix: (transform: TransformObjectValues) => CSSMatrix;

declare const iterate: <T extends PathArray>(path: PathArray, iterator: IteratorCallback) => T;

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

/**
 * Normalizes a single segment of a `pathArray` object.
 *
 * @param segment the segment object
 * @param params the normalization parameters
 * @returns the normalized segment
 */
declare const normalizeSegment: (segment: PathSegment, params: ParserParams) => NormalSegment;

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

/**
 * Reverses all segments of a `pathArray`
 * which consists of only C (cubic-bezier) path commands.
 *
 * @param path the source `pathArray`
 * @returns the reversed `pathArray`
 */
declare const reverseCurve: (path: CurveArray) => CurveArray;

/**
 * Rounds the values of a `pathArray` instance to
 * a specified amount of decimals and returns it.
 *
 * @param path the source `pathArray`
 * @param roundOption the amount of decimals to round numbers to
 * @returns the resulted `pathArray` with rounded values
 */
declare const roundPath: (path: PathArray, roundOption?: number | "off") => PathArray;

declare const roundSegment: <T extends PathSegment>(segment: T, roundOption: number) => T;

/**
 * Converts any segment to C (cubic-bezier).
 *
 * @param segment the source segment
 * @param params the source segment parameters
 * @returns the cubic-bezier segment
 */
declare const segmentToCubic: (segment: PathSegment, params: ParserParams) => MSegment | CSegment;

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

/**
 * Split a cubic-bezier segment into two.
 *
 * @param pts the cubic-bezier parameters
 * @param ratio the cubic-bezier parameters
 * @return two new cubic-bezier segments
 */
declare const splitCubic: (pts: number[], ratio?: number) => [CubicSegment, CubicSegment];

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
     * Convert path to absolute values
     *
     * @public
     */
    toAbsolute(): this;
    /**
     * Convert path to relative values
     *
     * @public
     */
    toRelative(): this;
    /**
     * Convert path to cubic-bezier values. In addition, un-necessary `Z`
     * segment is removed if previous segment extends to the `M` segment.
     *
     * @public
     */
    toCurve(): this;
    /**
     * Reverse the order of the segments and their values.
     *
     * @param onlySubpath option to reverse all sub-paths except first
     * @public
     */
    reverse(onlySubpath?: boolean): this;
    /**
     * Normalize path in 2 steps:
     * * convert `pathArray`(s) to absolute values
     * * convert shorthand notation to standard notation
     *
     * @public
     */
    normalize(): this;
    /**
     * Optimize `pathArray` values:
     * * convert segments to absolute and/or relative values
     * * select segments with shortest resulted string
     * * round values to the specified `decimals` option value
     *
     * @public
     */
    optimize(): this;
    /**
     * Transform path using values from an `Object` defined as `transformObject`.
     *
     * @see TransformObject for a quick refference
     *
     * @param source a `transformObject`as described above
     * @public
     */
    transform(source?: Partial<TransformObject>): this;
    /**
     * Rotate path 180deg vertically
     *
     * @public
     */
    flipX(): this;
    /**
     * Rotate path 180deg horizontally
     *
     * @public
     */
    flipY(): this;
    /**
     * Export the current path to be used
     * for the `d` (description) attribute.
     *
     * @public
     * @return the path string
     */
    toString(): string;
    /**
     * Remove the instance.
     *
     * @public
     * @return void
     */
    dispose(): void;
    static get CSSMatrix(): typeof CSSMatrix;
    static get arcTools(): typeof arcTools;
    static get bezierTools(): typeof bezierTools;
    static get cubicTools(): typeof cubicTools;
    static get lineTools(): typeof lineTools;
    static get polygonTools(): typeof polygonTools;
    static get quadTools(): typeof quadTools;
    static get pathToAbsolute(): (pathInput: string | PathArray) => AbsoluteArray;
    static get pathToRelative(): (pathInput: string | PathArray) => RelativeArray;
    static get pathToCurve(): (pathInput: string | PathArray) => CurveArray;
    static get pathToString(): (path: PathArray, roundOption?: number | "off") => string;
    static get distanceSquareRoot(): (a: PointTuple, b: PointTuple) => number;
    static get midPoint(): (a: PointTuple, b: PointTuple, t: number) => PointTuple;
    static get rotateVector(): (x: number, y: number, rad: number) => {
        x: number;
        y: number;
    };
    static get roundTo(): (n: number, round: number) => number;
    static get parsePathString(): <T extends PathArray>(pathInput: string | T) => PathArray;
    static get finalizeSegment(): (path: PathParser) => void;
    static get invalidPathValue(): string;
    static get isArcCommand(): (code: number) => code is 97;
    static get isDigit(): (code: number) => code is DigitNumber;
    static get isDigitStart(): (code: number) => code is DigitNumber | 43 | 45 | 46;
    static get isMoveCommand(): (code: number) => code is 109 | 77;
    static get isPathCommand(): (code: number) => code is PathCommandNumber;
    static get isSpace(): (ch: number) => ch is SpaceNumber;
    static get paramsCount(): {
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
    static get paramsParser(): ParserParams;
    static get pathParser(): typeof PathParser;
    static get scanFlag(): (path: PathParser) => void;
    static get scanParam(): (path: PathParser) => void;
    static get scanSegment(): (path: PathParser) => void;
    static get skipSpaces(): (path: PathParser) => void;
    static get distanceEpsilon(): number;
    static get getClosestPoint(): (pathInput: string | PathArray, point: {
        x: number;
        y: number;
    }) => {
        x: number;
        y: number;
    };
    static get getDrawDirection(): (path: string | PathArray) => boolean;
    static get getPathArea(): (path: PathArray) => number;
    static get getPathBBox(): (pathInput: PathArray | string) => {
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
    static get getPointAtLength(): (pathInput: string | PathArray, distance?: number) => {
        x: number;
        y: number;
    };
    static get getPropertiesAtLength(): (pathInput: string | PathArray, distance?: number) => SegmentProperties;
    static get getPropertiesAtPoint(): (pathInput: string | PathArray, point: Point) => PointProperties;
    static get getSegmentAtLength(): (pathInput: string | PathArray, distance?: number) => PathSegment | undefined;
    static get getSegmentOfPoint(): (path: string | PathArray, point: {
        x: number;
        y: number;
    }) => SegmentProperties | undefined;
    static get getTotalLength(): (pathInput: string | PathArray) => number;
    static get isAbsoluteArray(): (path: unknown) => path is AbsoluteArray;
    static get isCurveArray(): (path: unknown) => path is CurveArray;
    static get isNormalizedArray(): (path: unknown) => path is NormalArray;
    static get isPathArray(): (path: unknown) => path is PathArray;
    static get isPointInStroke(): (pathInput: string | PathArray, point: {
        x: number;
        y: number;
    }) => boolean;
    static get isRelativeArray(): (path: unknown) => path is RelativeArray;
    static get isValidPath(): (pathString: string) => boolean;
    static get shapeParams(): ShapeParams;
    static get shapeToPath(): (element: ShapeTypes | ShapeOps, replace?: boolean, ownerDocument?: Document) => SVGPathElement | false;
    static get shapeToPathArray(): (element: ShapeTypes | ShapeOps) => false | PathArray;
    static get absolutizeSegment(): (segment: PathSegment, index: number, lastX: number, lastY: number) => AbsoluteSegment;
    static get arcToCubic(): (X1: number, Y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, X2: number, Y2: number, recursive?: [number, number, number, number]) => number[];
    static get getSVGMatrix(): (transform: TransformObjectValues) => CSSMatrix;
    static get iterate(): <T extends PathArray>(path: PathArray, iterator: IteratorCallback) => T;
    static get lineToCubic(): (x1: number, y1: number, x2: number, y2: number) => number[];
    static get normalizePath(): (pathInput: string | PathArray) => NormalArray;
    static get normalizeSegment(): (segment: PathSegment, params: ParserParams) => NormalSegment;
    static get optimizePath(): (pathInput: PathArray, roundOption?: number) => PathArray;
    static get projection2d(): (m: CSSMatrix, point2D: PointTuple, origin: [number, number, number]) => PointTuple;
    static get quadToCubic(): (x1: number, y1: number, qx: number, qy: number, x2: number, y2: number) => [number, number, number, number, number, number];
    static get relativizeSegment(): (segment: PathSegment, index: number, lastX: number, lastY: number) => MSegment | RelativeSegment;
    static get reverseCurve(): (path: CurveArray) => CurveArray;
    static get reversePath(): (pathInput: PathArray) => PathArray;
    static get roundPath(): (path: PathArray, roundOption?: number | "off") => PathArray;
    static get roundSegment(): <T extends PathSegment>(segment: T, roundOption: number) => T;
    static get segmentToCubic(): (segment: PathSegment, params: ParserParams) => MSegment | CSegment;
    static get shortenSegment(): (segment: AbsoluteSegment, normalSegment: NormalSegment, params: ParserParams, prevCommand: PathCommand) => ShortSegment;
    static get splitCubic(): (pts: number[], ratio?: number) => [CubicSegment, CubicSegment];
    static get splitPath(): (pathInput: PathArray) => PathArray[];
    static get transformPath(): (pathInput: PathArray | string, transform?: Partial<TransformObject>) => PathArray;
}

export { type ACommand, type ASegment, type AbsoluteArray, type AbsoluteCommand, type AbsoluteSegment, type ArcCoordinates, type ArcSegment, type CCommand, type CSegment, type CircleAttr, type CloseSegment, type CubicCoordinates, type CubicPoints, type CubicSegment, type CurveArray, type DeriveCallback, type DerivedCubicPoints, type DerivedPoint, type DerivedQuadPoints, type DigitNumber, type EllipseAttr, type GlyphAttr, type HCommand, type HSegment, type HorLineSegment, type IteratorCallback, type LCommand, type LSegment, type LengthFactory, type LineAttr, type LineCoordinates, type LineSegment, type MCommand, type MSegment, type MoveSegment, type NormalArray, type NormalSegment, type Options, type ParserParams, type PathArray, type PathBBox, type PathCommand, type PathCommandNumber, type PathSegment, type PathTransform, type Point, type PointProperties, type PointTuple, type PolyAttr, type PolygonArray, type PolylineArray, type QCommand, type QSegment, type QuadCoordinates, type QuadPoints, type QuadSegment, type RectAttr, type RelativeArray, type RelativeCommand, type RelativeSegment, type SCommand, type SSegment, type SegmentLimits, type SegmentProperties, type ShapeOps, type ShapeParams, type ShapeTags, type ShapeTypes, type ShortCubicSegment, type ShortQuadSegment, type ShortSegment, type SpaceNumber, type TCommand, type TSegment, type TransformEntries, type TransformObject, type TransformObjectValues, type TransformProps, type VCommand, type VSegment, type VertLineSegment, type ZCommand, type ZSegment, type aCommand, type aSegment, absolutizeSegment, arcToCubic, arcTools, bezierTools, type cCommand, type cSegment, cubicTools, SVGPathCommander as default, DISTANCE_EPSILON as distanceEpsilon, distanceSquareRoot, finalizeSegment, getClosestPoint, getDrawDirection, getPathArea, getPathBBox, getPointAtLength, getPropertiesAtLength, getPropertiesAtPoint, getSVGMatrix, getSegmentAtLength, getSegmentOfPoint, getTotalLength, type hCommand, type hSegment, invalidPathValue, isAbsoluteArray, isArcCommand, isCurveArray, isDigit, isDigitStart, isMoveCommand, isNormalizedArray, isPathArray, isPathCommand, isPointInStroke, isRelativeArray, isSpace, isValidPath, iterate, type lCommand, type lSegment, lineToCubic, lineTools, type mCommand, type mSegment, midPoint, normalizePath, normalizeSegment, optimizePath, paramsCount, paramsParser, parsePathString, PathParser as pathParser, pathToAbsolute, pathToCurve, pathToRelative, pathToString, polygonTools, projection2d, type qCommand, type qSegment, quadToCubic, quadTools, relativizeSegment, reverseCurve, reversePath, rotateVector, roundPath, roundSegment, roundTo, type sCommand, type sSegment, scanFlag, scanParam, scanSegment, segmentToCubic, shapeParams, shapeToPath, shapeToPathArray, shortenSegment, skipSpaces, splitCubic, splitPath, type tCommand, type tSegment, transformPath, type vCommand, type vSegment, type zCommand, type zSegment };
