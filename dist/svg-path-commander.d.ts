import CSSMatrix from '@thednp/dommatrix';

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

declare const bezier_CBEZIER_MINMAX_EPSILON: typeof CBEZIER_MINMAX_EPSILON;
declare const bezier_Cvalues: typeof Cvalues;
declare const bezier_Tvalues: typeof Tvalues;
declare const bezier_bezierLength: typeof bezierLength;
declare const bezier_calculateBezier: typeof calculateBezier;
declare const bezier_computeBezier: typeof computeBezier;
declare const bezier_deriveBezier: typeof deriveBezier;
declare const bezier_getBezierLength: typeof getBezierLength;
declare const bezier_minmaxC: typeof minmaxC;
declare const bezier_minmaxQ: typeof minmaxQ;
declare namespace bezier {
  export { bezier_CBEZIER_MINMAX_EPSILON as CBEZIER_MINMAX_EPSILON, bezier_Cvalues as Cvalues, bezier_Tvalues as Tvalues, bezier_bezierLength as bezierLength, bezier_calculateBezier as calculateBezier, bezier_computeBezier as computeBezier, bezier_deriveBezier as deriveBezier, bezier_getBezierLength as getBezierLength, bezier_minmaxC as minmaxC, bezier_minmaxQ as minmaxQ };
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
 * Returns the shape total length, or the equivalent to `shape.getTotalLength()`.
 *
 * @param pathInput the target `pathArray`
 * @returns the shape total length
 */
declare const getTotalLength: (pathInput: string | PathArray) => number;

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
 * Normalizes a `pathArray` object for further processing:
 * * convert segments to absolute values
 * * convert shorthand path commands to their non-shorthand notation
 *
 * @param pathInput the string to be parsed or 'pathArray'
 * @returns the normalized `pathArray`
 */
declare const normalizePath: (pathInput: string | PathArray) => NormalArray;

/**
 * Normalizes a single segment of a `pathArray` object.
 *
 * @param segment the segment object
 * @param params the normalization parameters
 * @returns the normalized segment
 */
declare const normalizeSegment: (segment: PathSegment, params: ParserParams) => NormalSegment;

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
 * Reverses all segments of a `pathArray` and returns a new `pathArray` instance
 * with absolute values.
 *
 * @param pathInput the source `pathArray`
 * @returns the reversed `pathArray`
 */
declare const reversePath: (pathInput: PathArray) => PathArray;

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

declare const util_CSSMatrix: typeof CSSMatrix;
declare const util_absolutizeSegment: typeof absolutizeSegment;
declare const util_arcToCubic: typeof arcToCubic;
declare const util_arcTools: typeof arcTools;
declare const util_cubicTools: typeof cubicTools;
declare const util_distanceSquareRoot: typeof distanceSquareRoot;
declare const util_finalizeSegment: typeof finalizeSegment;
declare const util_getClosestPoint: typeof getClosestPoint;
declare const util_getDrawDirection: typeof getDrawDirection;
declare const util_getPathArea: typeof getPathArea;
declare const util_getPathBBox: typeof getPathBBox;
declare const util_getPointAtLength: typeof getPointAtLength;
declare const util_getPropertiesAtLength: typeof getPropertiesAtLength;
declare const util_getPropertiesAtPoint: typeof getPropertiesAtPoint;
declare const util_getSVGMatrix: typeof getSVGMatrix;
declare const util_getSegmentAtLength: typeof getSegmentAtLength;
declare const util_getSegmentOfPoint: typeof getSegmentOfPoint;
declare const util_getTotalLength: typeof getTotalLength;
declare const util_invalidPathValue: typeof invalidPathValue;
declare const util_isAbsoluteArray: typeof isAbsoluteArray;
declare const util_isArcCommand: typeof isArcCommand;
declare const util_isCurveArray: typeof isCurveArray;
declare const util_isDigit: typeof isDigit;
declare const util_isDigitStart: typeof isDigitStart;
declare const util_isMoveCommand: typeof isMoveCommand;
declare const util_isNormalizedArray: typeof isNormalizedArray;
declare const util_isPathArray: typeof isPathArray;
declare const util_isPathCommand: typeof isPathCommand;
declare const util_isPointInStroke: typeof isPointInStroke;
declare const util_isRelativeArray: typeof isRelativeArray;
declare const util_isSpace: typeof isSpace;
declare const util_isValidPath: typeof isValidPath;
declare const util_iterate: typeof iterate;
declare const util_lineToCubic: typeof lineToCubic;
declare const util_lineTools: typeof lineTools;
declare const util_midPoint: typeof midPoint;
declare const util_normalizePath: typeof normalizePath;
declare const util_normalizeSegment: typeof normalizeSegment;
declare const util_optimizePath: typeof optimizePath;
declare const util_paramsCount: typeof paramsCount;
declare const util_paramsParser: typeof paramsParser;
declare const util_parsePathString: typeof parsePathString;
declare const util_pathToAbsolute: typeof pathToAbsolute;
declare const util_pathToCurve: typeof pathToCurve;
declare const util_pathToRelative: typeof pathToRelative;
declare const util_pathToString: typeof pathToString;
declare const util_polygonTools: typeof polygonTools;
declare const util_projection2d: typeof projection2d;
declare const util_quadToCubic: typeof quadToCubic;
declare const util_quadTools: typeof quadTools;
declare const util_relativizeSegment: typeof relativizeSegment;
declare const util_reverseCurve: typeof reverseCurve;
declare const util_reversePath: typeof reversePath;
declare const util_rotateVector: typeof rotateVector;
declare const util_roundPath: typeof roundPath;
declare const util_roundSegment: typeof roundSegment;
declare const util_roundTo: typeof roundTo;
declare const util_scanFlag: typeof scanFlag;
declare const util_scanParam: typeof scanParam;
declare const util_scanSegment: typeof scanSegment;
declare const util_segmentToCubic: typeof segmentToCubic;
declare const util_shapeParams: typeof shapeParams;
declare const util_shapeToPath: typeof shapeToPath;
declare const util_shapeToPathArray: typeof shapeToPathArray;
declare const util_shortenSegment: typeof shortenSegment;
declare const util_skipSpaces: typeof skipSpaces;
declare const util_splitCubic: typeof splitCubic;
declare const util_splitPath: typeof splitPath;
declare const util_transformPath: typeof transformPath;
declare namespace util {
  export { util_CSSMatrix as CSSMatrix, util_absolutizeSegment as absolutizeSegment, util_arcToCubic as arcToCubic, util_arcTools as arcTools, bezier as bezierTools, util_cubicTools as cubicTools, DISTANCE_EPSILON as distanceEpsilon, util_distanceSquareRoot as distanceSquareRoot, util_finalizeSegment as finalizeSegment, util_getClosestPoint as getClosestPoint, util_getDrawDirection as getDrawDirection, util_getPathArea as getPathArea, util_getPathBBox as getPathBBox, util_getPointAtLength as getPointAtLength, util_getPropertiesAtLength as getPropertiesAtLength, util_getPropertiesAtPoint as getPropertiesAtPoint, util_getSVGMatrix as getSVGMatrix, util_getSegmentAtLength as getSegmentAtLength, util_getSegmentOfPoint as getSegmentOfPoint, util_getTotalLength as getTotalLength, util_invalidPathValue as invalidPathValue, util_isAbsoluteArray as isAbsoluteArray, util_isArcCommand as isArcCommand, util_isCurveArray as isCurveArray, util_isDigit as isDigit, util_isDigitStart as isDigitStart, util_isMoveCommand as isMoveCommand, util_isNormalizedArray as isNormalizedArray, util_isPathArray as isPathArray, util_isPathCommand as isPathCommand, util_isPointInStroke as isPointInStroke, util_isRelativeArray as isRelativeArray, util_isSpace as isSpace, util_isValidPath as isValidPath, util_iterate as iterate, util_lineToCubic as lineToCubic, util_lineTools as lineTools, util_midPoint as midPoint, util_normalizePath as normalizePath, util_normalizeSegment as normalizeSegment, util_optimizePath as optimizePath, util_paramsCount as paramsCount, util_paramsParser as paramsParser, util_parsePathString as parsePathString, PathParser as pathParser, util_pathToAbsolute as pathToAbsolute, util_pathToCurve as pathToCurve, util_pathToRelative as pathToRelative, util_pathToString as pathToString, util_polygonTools as polygonTools, util_projection2d as projection2d, util_quadToCubic as quadToCubic, util_quadTools as quadTools, util_relativizeSegment as relativizeSegment, util_reverseCurve as reverseCurve, util_reversePath as reversePath, util_rotateVector as rotateVector, util_roundPath as roundPath, util_roundSegment as roundSegment, util_roundTo as roundTo, util_scanFlag as scanFlag, util_scanParam as scanParam, util_scanSegment as scanSegment, util_segmentToCubic as segmentToCubic, util_shapeParams as shapeParams, util_shapeToPath as shapeToPath, util_shapeToPathArray as shapeToPathArray, util_shortenSegment as shortenSegment, util_skipSpaces as skipSpaces, util_splitCubic as splitCubic, util_splitPath as splitPath, util_transformPath as transformPath };
}

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
}
declare const defaultExport: typeof SVGPathCommander & typeof util;

export { type ACommand, type ASegment, type AbsoluteArray, type AbsoluteCommand, type AbsoluteSegment, type ArcCoordinates, type ArcSegment, type CCommand, type CSegment, type CircleAttr, type CloseSegment, type CubicCoordinates, type CubicPoints, type CubicSegment, type CurveArray, type DeriveCallback, type DerivedCubicPoints, type DerivedPoint, type DerivedQuadPoints, type DigitNumber, type EllipseAttr, type GlyphAttr, type HCommand, type HSegment, type HorLineSegment, type IteratorCallback, type LCommand, type LSegment, type LengthFactory, type LineAttr, type LineCoordinates, type LineSegment, type MCommand, type MSegment, type MoveSegment, type NormalArray, type NormalSegment, type Options, type ParserParams, type PathArray, type PathBBox, type PathCommand, type PathCommandNumber, type PathSegment, type PathTransform, type Point, type PointProperties, type PointTuple, type PolyAttr, type PolygonArray, type PolylineArray, type QCommand, type QSegment, type QuadCoordinates, type QuadPoints, type QuadSegment, type RectAttr, type RelativeArray, type RelativeCommand, type RelativeSegment, type SCommand, type SSegment, type SegmentLimits, type SegmentProperties, type ShapeOps, type ShapeParams, type ShapeTags, type ShapeTypes, type ShortCubicSegment, type ShortQuadSegment, type ShortSegment, type SpaceNumber, type TCommand, type TSegment, type TransformEntries, type TransformObject, type TransformObjectValues, type TransformProps, type VCommand, type VSegment, type VertLineSegment, type ZCommand, type ZSegment, type aCommand, type aSegment, type cCommand, type cSegment, defaultExport as default, type hCommand, type hSegment, type lCommand, type lSegment, type mCommand, type mSegment, type qCommand, type qSegment, type sCommand, type sSegment, type tCommand, type tSegment, type vCommand, type vSegment, type zCommand, type zSegment };
