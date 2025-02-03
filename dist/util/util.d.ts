declare module "interface" {
    import type { PathSegment } from "types";
    export type SegmentProperties = {
        segment: PathSegment;
        index: number;
        length: number;
        lengthAtSegment: number;
    };
    export type PointProperties = {
        closest: {
            x: number;
            y: number;
        };
        distance: number;
        segment?: SegmentProperties;
    };
    export type LineAttr = {
        type: "line";
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        [key: string]: string | number;
    };
    export type PolyAttr = {
        type: "polygon" | "polyline";
        points: string;
        [key: string]: string | number;
    };
    export type CircleAttr = {
        type: "circle";
        cx: number;
        cy: number;
        r: number;
        [key: string]: string | number;
    };
    export type EllipseAttr = {
        type: "ellipse";
        cx: number;
        cy: number;
        rx: number;
        ry?: number;
        [key: string]: string | number | undefined;
    };
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
    export type GlyphAttr = {
        type: "glyph";
        d: string;
        [key: string]: string | number;
    };
    export type ShapeParams = {
        line: ["x1", "y1", "x2", "y2"];
        circle: ["cx", "cy", "r"];
        ellipse: ["cx", "cy", "rx", "ry"];
        rect: ["width", "height", "x", "y", "rx", "ry"];
        polygon: ["points"];
        polyline: ["points"];
        glyph: ["d"];
    };
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
    export type SegmentLimits = {
        min: {
            x: number;
            y: number;
        };
        max: {
            x: number;
            y: number;
        };
    };
    export type ParserParams = {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        x: number;
        y: number;
        qx: number | null;
        qy: number | null;
    };
    export type LengthFactory = {
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
    export type Options = {
        round: "off" | number;
        origin: number[];
    };
    export type PathTransform = {
        s: PathSegment;
        c: string;
        x: number;
        y: number;
    };
    export type TransformObject = {
        translate: number | number[];
        rotate: number | number[];
        scale: number | number[];
        skew: number | number[];
        origin: number[];
    };
    export type TransformProps = keyof TransformObject;
    export type TransformEntries = [
        TransformProps,
        TransformObject[TransformProps]
    ][];
}
declare module "types" {
    import type { CircleAttr, EllipseAttr, GlyphAttr, LineAttr, PolyAttr, RectAttr, TransformObject } from "interface";
    export type SpaceNumber = 0x1680 | 0x180e | 0x2000 | 0x2001 | 0x2002 | 0x2003 | 0x2004 | 0x2005 | 0x2006 | 0x2007 | 0x2008 | 0x2009 | 0x200a | 0x202f | 0x205f | 0x3000 | 0xfeff | 0x0a | 0x0d | 0x2028 | 0x2029 | 0x20 | 0x09 | 0x0b | 0x0c | 0xa0 | 0x1680;
    export type PathCommandNumber = 0x6d | 0x7a | 0x6c | 0x68 | 0x76 | 0x63 | 0x73 | 0x71 | 0x74 | 0x61;
    export type DigitNumber = 0x30 | 0x31 | 0x32 | 0x33 | 0x34 | 0x35 | 0x36 | 0x37 | 0x38 | 0x39;
    export type MCommand = "M";
    export type mCommand = "m";
    export type LCommand = "L";
    export type lCommand = "l";
    export type VCommand = "V";
    export type vCommand = "v";
    export type HCommand = "H";
    export type hCommand = "h";
    export type ZCommand = "Z";
    export type zCommand = "z";
    export type CCommand = "C";
    export type cCommand = "c";
    export type SCommand = "S";
    export type sCommand = "s";
    export type QCommand = "Q";
    export type qCommand = "q";
    export type TCommand = "T";
    export type tCommand = "t";
    export type ACommand = "A";
    export type aCommand = "a";
    export type AbsoluteCommand = MCommand | LCommand | VCommand | HCommand | ZCommand | CCommand | SCommand | QCommand | TCommand | ACommand;
    export type RelativeCommand = mCommand | lCommand | vCommand | hCommand | zCommand | cCommand | sCommand | qCommand | tCommand | aCommand;
    export type PathCommand = AbsoluteCommand | RelativeCommand;
    export type MSegment = [MCommand, number, number];
    export type mSegment = [mCommand, number, number];
    export type MoveSegment = MSegment | mSegment;
    export type LSegment = [LCommand, number, number];
    export type lSegment = [lCommand, number, number];
    export type LineSegment = LSegment | lSegment;
    export type VSegment = [VCommand, number];
    export type vSegment = [vCommand, number];
    export type VertLineSegment = vSegment | VSegment;
    export type HSegment = [HCommand, number];
    export type hSegment = [hCommand, number];
    export type HorLineSegment = HSegment | hSegment;
    export type ZSegment = [ZCommand];
    export type zSegment = [zCommand];
    export type CloseSegment = ZSegment | zSegment;
    export type CSegment = [
        CCommand,
        number,
        number,
        number,
        number,
        number,
        number
    ];
    export type cSegment = [
        cCommand,
        number,
        number,
        number,
        number,
        number,
        number
    ];
    export type CubicSegment = CSegment | cSegment;
    export type SSegment = [SCommand, number, number, number, number];
    export type sSegment = [sCommand, number, number, number, number];
    export type ShortCubicSegment = SSegment | sSegment;
    export type QSegment = [QCommand, number, number, number, number];
    export type qSegment = [qCommand, number, number, number, number];
    export type QuadSegment = QSegment | qSegment;
    export type TSegment = [TCommand, number, number];
    export type tSegment = [tCommand, number, number];
    export type ShortQuadSegment = TSegment | tSegment;
    export type ASegment = [
        ACommand,
        number,
        number,
        number,
        number,
        number,
        number,
        number
    ];
    export type aSegment = [
        aCommand,
        number,
        number,
        number,
        number,
        number,
        number,
        number
    ];
    export type ArcSegment = ASegment | aSegment;
    export type PathSegment = MoveSegment | LineSegment | VertLineSegment | HorLineSegment | CloseSegment | CubicSegment | ShortCubicSegment | QuadSegment | ShortQuadSegment | ArcSegment;
    export type ShortSegment = VertLineSegment | HorLineSegment | ShortCubicSegment | ShortQuadSegment | CloseSegment;
    export type AbsoluteSegment = MSegment | LSegment | VSegment | HSegment | CSegment | SSegment | QSegment | TSegment | ASegment | ZSegment;
    export type RelativeSegment = mSegment | lSegment | vSegment | hSegment | cSegment | sSegment | qSegment | tSegment | aSegment | zSegment;
    export type NormalSegment = MSegment | LSegment | CSegment | QSegment | ASegment | ZSegment;
    export type PathArray = [MSegment | mSegment, ...PathSegment[]];
    export type AbsoluteArray = [MSegment, ...AbsoluteSegment[]];
    export type RelativeArray = [MSegment, ...RelativeSegment[]];
    export type NormalArray = [MSegment, ...NormalSegment[]];
    export type CurveArray = [MSegment, ...CSegment[]];
    export type PolygonArray = [MSegment, ...LSegment[], ZSegment];
    export type PolylineArray = [MSegment, ...LSegment[]];
    export type ShapeTypes = SVGPolylineElement | SVGPolygonElement | SVGLineElement | SVGEllipseElement | SVGCircleElement | SVGRectElement;
    export type ShapeTags = "line" | "polyline" | "polygon" | "ellipse" | "circle" | "rect" | "glyph";
    export type ShapeOps = LineAttr | PolyAttr | PolyAttr | EllipseAttr | CircleAttr | RectAttr | GlyphAttr;
    export type TransformObjectValues = Partial<TransformObject> & {
        origin: [number, number, number];
    };
    export type Point = {
        x: number;
        y: number;
    };
    export type PointTuple = [number, number];
    export type DerivedPoint = Point & {
        t: number;
    };
    export type QuadPoints = [Point, Point, Point, Point, Point, Point];
    export type CubicPoints = [
        Point,
        Point,
        Point,
        Point,
        Point,
        Point,
        Point,
        Point
    ];
    export type DerivedQuadPoints = [
        DerivedPoint,
        DerivedPoint,
        DerivedPoint,
        DerivedPoint,
        DerivedPoint,
        DerivedPoint
    ];
    export type DerivedCubicPoints = [
        DerivedPoint,
        DerivedPoint,
        DerivedPoint,
        DerivedPoint,
        DerivedPoint,
        DerivedPoint,
        DerivedPoint,
        DerivedPoint
    ];
    export type QuadCoordinates = [number, number, number, number, number, number];
    export type CubicCoordinates = [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number
    ];
    export type ArcCoordinates = [
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
    export type LineCoordinates = [number, number, number, number];
    export type DeriveCallback = (t: number) => Point;
    export type IteratorCallback = (segment: PathSegment, index: number, lastX: number, lastY: number) => PathSegment | false | void | undefined;
}
declare module "math/midPoint" {
    import { PointTuple } from "types";
    /**
     * Returns the coordinates of a specified distance
     * ratio between two points.
     *
     * @param a the first point coordinates
     * @param b the second point coordinates
     * @param t the ratio
     * @returns the midpoint coordinates
     */
    const midPoint: (a: PointTuple, b: PointTuple, t: number) => PointTuple;
    export default midPoint;
}
declare module "math/distanceSquareRoot" {
    import { type PointTuple } from "types";
    /**
     * Returns the square root of the distance
     * between two given points.
     *
     * @param a the first point coordinates
     * @param b the second point coordinates
     * @returns the distance value
     */
    const distanceSquareRoot: (a: PointTuple, b: PointTuple) => number;
    export default distanceSquareRoot;
}
declare module "math/lineTools" {
    /**
     * Returns length for line segments (MoveTo, LineTo).
     *
     * @param x1 the starting point X
     * @param y1 the starting point Y
     * @param x2 the ending point X
     * @param y2 the ending point Y
     * @returns the line segment length
     */
    const getLineLength: (x1: number, y1: number, x2: number, y2: number) => number;
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
    const getPointAtLineLength: (x1: number, y1: number, x2: number, y2: number, distance?: number) => {
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
    const getLineBBox: (x1: number, y1: number, x2: number, y2: number) => [number, number, number, number];
    export { getLineBBox, getLineLength, getPointAtLineLength };
}
declare module "math/arcTools" {
    import type { Point, PointTuple } from "types";
    /**
     * Returns the Arc segment length.
     * @param rx radius along X axis
     * @param ry radius along Y axis
     * @param theta the angle in radians
     * @returns the arc length
     */
    const arcLength: (rx: number, ry: number, theta: number) => number;
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
    const arcPoint: (cx: number, cy: number, rx: number, ry: number, alpha: number, theta: number) => PointTuple;
    /**
     * Returns the angle between two points.
     * @param v0 starting point
     * @param v1 ending point
     * @returns the angle in radian
     */
    const angleBetween: (v0: Point, v1: Point) => number;
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
    const getArcProps: (x1: number, y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, x: number, y: number) => {
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
    const getArcLength: (x1: number, y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, x: number, y: number) => number;
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
    const getPointAtArcLength: (x1: number, y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, x: number, y: number, distance?: number) => {
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
    const getArcBBox: (x1: number, y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, x: number, y: number) => [number, number, number, number];
    export { angleBetween, arcLength, arcPoint, getArcBBox, getArcLength, getArcProps, getPointAtArcLength, };
}
declare module "math/bezier" {
    import type { CubicCoordinates, CubicPoints, DeriveCallback, DerivedCubicPoints, DerivedPoint, DerivedQuadPoints, PointTuple, QuadCoordinates, QuadPoints } from "types";
    /**
     * Tools from bezier.js by Mike 'Pomax' Kamermans
     * @see https://github.com/Pomax/bezierjs
     */
    const Tvalues: number[];
    const Cvalues: number[];
    /**
     * @param points
     * @returns
     */
    const deriveBezier: (points: QuadPoints | CubicPoints) => (DerivedQuadPoints | DerivedCubicPoints)[];
    /**
     * @param points
     * @param t
     */
    const computeBezier: (points: DerivedQuadPoints | DerivedCubicPoints, t: number) => DerivedPoint;
    const calculateBezier: (derivativeFn: DeriveCallback, t: number) => number;
    const bezierLength: (derivativeFn: DeriveCallback) => number;
    /**
     * Returns the length of CubicBezier / Quad segment.
     * @param curve cubic / quad bezier segment
     */
    const getBezierLength: (curve: CubicCoordinates | QuadCoordinates) => number;
    const CBEZIER_MINMAX_EPSILON = 1e-8;
    /**
     * Returns the most extreme points in a Quad Bezier segment.
     * @param A an array which consist of X/Y values
     */
    const minmaxQ: ([v1, cp, v2]: [number, number, number]) => PointTuple;
    /**
     * Returns the most extreme points in a Cubic Bezier segment.
     * @param A an array which consist of X/Y values
     * @see https://github.com/kpym/SVGPathy/blob/acd1a50c626b36d81969f6e98e8602e128ba4302/lib/box.js#L127
     */
    const minmaxC: ([v1, cp1, cp2, v2]: [number, number, number, number]) => PointTuple;
    export { bezierLength, calculateBezier, CBEZIER_MINMAX_EPSILON, computeBezier, Cvalues, deriveBezier, getBezierLength, minmaxC, minmaxQ, Tvalues, };
}
declare module "math/cubicTools" {
    import { type CubicCoordinates } from "types";
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
    const getPointAtCubicSegmentLength: ([x1, y1, c1x, c1y, c2x, c2y, x2, y2]: CubicCoordinates, t: number) => {
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
    const getCubicLength: (x1: number, y1: number, c1x: number, c1y: number, c2x: number, c2y: number, x2: number, y2: number) => number;
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
    const getPointAtCubicLength: (x1: number, y1: number, c1x: number, c1y: number, c2x: number, c2y: number, x2: number, y2: number, distance?: number) => {
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
    const getCubicBBox: (x1: number, y1: number, c1x: number, c1y: number, c2x: number, c2y: number, x2: number, y2: number) => [number, number, number, number];
    export { getCubicBBox, getCubicLength, getPointAtCubicLength, getPointAtCubicSegmentLength, };
}
declare module "math/quadTools" {
    import { type QuadCoordinates } from "types";
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
    const getPointAtQuadSegmentLength: ([x1, y1, cx, cy, x2, y2]: QuadCoordinates, t: number) => {
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
    const getQuadLength: (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number) => number;
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
    const getPointAtQuadLength: (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, distance?: number) => {
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
    const getQuadBBox: (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number) => [number, number, number, number];
    export { getPointAtQuadLength, getPointAtQuadSegmentLength, getQuadBBox, getQuadLength, };
}
declare module "math/polygonTools" {
    import { type PointTuple } from "types";
    /**
     * d3-polygon-area
     * https://github.com/d3/d3-polygon
     *
     * Returns the area of a polygon.
     *
     * @param polygon an array of coordinates
     * @returns the polygon area
     */
    const polygonArea: (polygon: PointTuple[]) => number;
    /**
     * d3-polygon-length
     * https://github.com/d3/d3-polygon
     *
     * Returns the perimeter of a polygon.
     *
     * @param polygon an array of coordinates
     * @returns the polygon length
     */
    const polygonLength: (polygon: PointTuple[]) => number;
    export { polygonArea, polygonLength };
}
declare module "parser/paramsCount" {
    /** Segment params length */
    const paramsCount: {
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
    export default paramsCount;
}
declare module "parser/pathParser" {
    import type { PathArray, PathSegment } from "types";
    /**
     * The `PathParser` is used by the `parsePathString` static method
     * to generate a `pathArray`.
     *
     * @param pathString
     */
    export default class PathParser {
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
}
declare module "parser/finalizeSegment" {
    import PathParser from "parser/pathParser";
    /**
     * Breaks the parsing of a pathString once a segment is finalized.
     *
     * @param path the `PathParser` instance
     */
    const finalizeSegment: (path: PathParser) => void;
    export default finalizeSegment;
}
declare module "parser/error" {
    const error = "SVGPathCommander Error";
    export default error;
}
declare module "parser/scanFlag" {
    import type PathParser from "parser/pathParser";
    /**
     * Validates an A (arc-to) specific path command value.
     * Usually a `large-arc-flag` or `sweep-flag`.
     *
     * @param path the `PathParser` instance
     */
    const scanFlag: (path: PathParser) => void;
    export default scanFlag;
}
declare module "parser/isDigit" {
    import { DigitNumber } from "types";
    /**
     * Checks if a character is a digit.
     *
     * @param code the character to check
     * @returns check result
     */
    const isDigit: (code: number) => code is DigitNumber;
    export default isDigit;
}
declare module "parser/invalidPathValue" {
    const invalidPathValue = "Invalid path value";
    export default invalidPathValue;
}
declare module "parser/scanParam" {
    import type PathParser from "parser/pathParser";
    /**
     * Validates every character of the path string,
     * every path command, negative numbers or floating point numbers.
     *
     * @param path the `PathParser` instance
     */
    const scanParam: (path: PathParser) => void;
    export default scanParam;
}
declare module "parser/isSpace" {
    import type { SpaceNumber } from "types";
    /**
     * Checks if the character is a space.
     *
     * @param ch the character to check
     * @returns check result
     */
    const isSpace: (ch: number) => ch is SpaceNumber;
    export default isSpace;
}
declare module "parser/skipSpaces" {
    import type PathParser from "parser/pathParser";
    /**
     * Points the parser to the next character in the
     * path string every time it encounters any kind of
     * space character.
     *
     * @param path the `PathParser` instance
     */
    const skipSpaces: (path: PathParser) => void;
    export default skipSpaces;
}
declare module "parser/isPathCommand" {
    import type { PathCommandNumber } from "types";
    /**
     * Checks if the character is a path command.
     *
     * @param code the character to check
     * @returns check result
     */
    const isPathCommand: (code: number) => code is PathCommandNumber;
    export default isPathCommand;
}
declare module "parser/isDigitStart" {
    import type { DigitNumber } from "types";
    /**
     * Checks if the character is or belongs to a number.
     * [0-9]|+|-|.
     *
     * @param code the character to check
     * @returns check result
     */
    const isDigitStart: (code: number) => code is DigitNumber | 43 | 45 | 46;
    export default isDigitStart;
}
declare module "parser/isArcCommand" {
    /**
     * Checks if the character is an A (arc-to) path command.
     *
     * @param code the character to check
     * @returns check result
     */
    const isArcCommand: (code: number) => code is 97;
    export default isArcCommand;
}
declare module "parser/isMoveCommand" {
    /**
     * Checks if the character is a MoveTo command.
     *
     * @param code the character to check
     * @returns check result
     */
    const isMoveCommand: (code: number) => code is 109 | 77;
    export default isMoveCommand;
}
declare module "parser/scanSegment" {
    import type PathParser from "parser/pathParser";
    /**
     * Scans every character in the path string to determine
     * where a segment starts and where it ends.
     *
     * @param path the `PathParser` instance
     */
    const scanSegment: (path: PathParser) => void;
    export default scanSegment;
}
declare module "parser/parsePathString" {
    import type { PathArray } from "types";
    /**
     * Parses a path string value and returns an array
     * of segments we like to call `pathArray`.
     *
     * @param pathInput the string to be parsed
     * @returns the resulted `pathArray` or error string
     */
    const parsePathString: <T extends PathArray>(pathInput: string | T) => PathArray;
    export default parsePathString;
}
declare module "process/absolutizeSegment" {
    import type { AbsoluteSegment, PathSegment } from "types";
    /**
     * Returns an absolute segment of a `PathArray` object.
     *
     * @param segment the segment object
     * @param index the segment index
     * @param lastX the last known X value
     * @param lastY the last known Y value
     * @returns the absolute segment
     */
    const absolutizeSegment: (segment: PathSegment, index: number, lastX: number, lastY: number) => AbsoluteSegment;
    export default absolutizeSegment;
}
declare module "process/iterate" {
    import type { IteratorCallback, PathArray } from "types";
    const iterate: <T extends PathArray>(path: PathArray, iterator: IteratorCallback) => T;
    export default iterate;
}
declare module "convert/pathToAbsolute" {
    import type { AbsoluteArray, PathArray } from "types";
    /**
     * Parses a path string value or object and returns an array
     * of segments, all converted to absolute values.
     *
     * @param pathInput the path string | object
     * @returns the resulted `pathArray` with absolute values
     */
    const pathToAbsolute: (pathInput: string | PathArray) => AbsoluteArray;
    export default pathToAbsolute;
}
declare module "process/relativizeSegment" {
    import type { MSegment, PathSegment, RelativeSegment } from "types";
    /**
     * Returns a relative segment of a `PathArray` object.
     *
     * @param segment the segment object
     * @param index the segment index
     * @param lastX the last known X value
     * @param lastY the last known Y value
     * @returns the relative segment
     */
    const relativizeSegment: (segment: PathSegment, index: number, lastX: number, lastY: number) => MSegment | RelativeSegment;
    export default relativizeSegment;
}
declare module "convert/pathToRelative" {
    import type { PathArray, RelativeArray } from "types";
    /**
     * Parses a path string value or object and returns an array
     * of segments, all converted to relative values.
     *
     * @param pathInput the path string | object
     * @returns the resulted `pathArray` with relative values
     */
    const pathToRelative: (pathInput: string | PathArray) => RelativeArray;
    export default pathToRelative;
}
declare module "math/rotateVector" {
    /**
     * Returns an {x,y} vector rotated by a given
     * angle in radian.
     *
     * @param x the initial vector x
     * @param y the initial vector y
     * @param rad the radian vector angle
     * @returns the rotated vector
     */
    const rotateVector: (x: number, y: number, rad: number) => {
        x: number;
        y: number;
    };
    export default rotateVector;
}
declare module "process/arcToCubic" {
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
    const arcToCubic: (X1: number, Y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, X2: number, Y2: number, recursive?: [number, number, number, number]) => number[];
    export default arcToCubic;
}
declare module "process/quadToCubic" {
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
    const quadToCubic: (x1: number, y1: number, qx: number, qy: number, x2: number, y2: number) => [number, number, number, number, number, number];
    export default quadToCubic;
}
declare module "process/lineToCubic" {
    /**
     * Converts an L (line-to) segment to C (cubic-bezier).
     *
     * @param x1 line start x
     * @param y1 line start y
     * @param x2 line end x
     * @param y2 line end y
     * @returns the cubic-bezier segment
     */
    const lineToCubic: (x1: number, y1: number, x2: number, y2: number) => number[];
    export default lineToCubic;
}
declare module "process/segmentToCubic" {
    import type { CSegment, MSegment, PathSegment } from "types";
    import type { ParserParams } from "interface";
    /**
     * Converts any segment to C (cubic-bezier).
     *
     * @param segment the source segment
     * @param params the source segment parameters
     * @returns the cubic-bezier segment
     */
    const segmentToCubic: (segment: PathSegment, params: ParserParams) => MSegment | CSegment;
    export default segmentToCubic;
}
declare module "process/normalizeSegment" {
    import type { ParserParams } from "interface";
    import type { NormalSegment, PathSegment } from "types";
    /**
     * Normalizes a single segment of a `pathArray` object.
     *
     * @param segment the segment object
     * @param params the normalization parameters
     * @returns the normalized segment
     */
    const normalizeSegment: (segment: PathSegment, params: ParserParams) => NormalSegment;
    export default normalizeSegment;
}
declare module "parser/paramsParser" {
    import type { ParserParams } from "interface";
    const paramsParser: ParserParams;
    export default paramsParser;
}
declare module "convert/pathToCurve" {
    import { CurveArray, PathArray } from "types";
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
    const pathToCurve: (pathInput: string | PathArray) => CurveArray;
    export default pathToCurve;
}
declare module "options/options" {
    import { Options } from "interface";
    /** SVGPathCommander default options */
    const defaultOptions: Options;
    export default defaultOptions;
}
declare module "math/roundTo" {
    const roundTo: (n: number, round: number) => number;
    export default roundTo;
}
declare module "convert/pathToString" {
    import type { PathArray } from "types";
    /**
     * Returns a valid `d` attribute string value created
     * by rounding values and concatenating the `pathArray` segments.
     *
     * @param path the `pathArray` object
     * @param roundOption amount of decimals to round values to
     * @returns the concatenated path string
     */
    const pathToString: (path: PathArray, roundOption?: number | "off") => string;
    export default pathToString;
}
declare module "util/distanceEpsilon" {
    const DISTANCE_EPSILON = 0.00001;
    export default DISTANCE_EPSILON;
}
declare module "process/normalizePath" {
    import type { NormalArray, PathArray } from "types";
    /**
     * Normalizes a `pathArray` object for further processing:
     * * convert segments to absolute values
     * * convert shorthand path commands to their non-shorthand notation
     *
     * @param pathInput the string to be parsed or 'pathArray'
     * @returns the normalized `pathArray`
     */
    const normalizePath: (pathInput: string | PathArray) => NormalArray;
    export default normalizePath;
}
declare module "util/getPointAtLength" {
    import type { PathArray } from "types";
    /**
     * Returns [x,y] coordinates of a point at a given length of a shape.
     *
     * @param pathInput the `pathArray` to look into
     * @param distance the length of the shape to look at
     * @returns the requested {x, y} point coordinates
     */
    const getPointAtLength: (pathInput: string | PathArray, distance?: number) => {
        x: number;
        y: number;
    };
    export default getPointAtLength;
}
declare module "util/getTotalLength" {
    import type { PathArray } from "types";
    /**
     * Returns the shape total length, or the equivalent to `shape.getTotalLength()`.
     *
     * @param pathInput the target `pathArray`
     * @returns the shape total length
     */
    const getTotalLength: (pathInput: string | PathArray) => number;
    export default getTotalLength;
}
declare module "util/getPropertiesAtLength" {
    import type { PathArray } from "types";
    import type { SegmentProperties } from "interface";
    /**
     * Returns the segment, its index and length as well as
     * the length to that segment at a given length in a path.
     *
     * @param pathInput target `pathArray`
     * @param distance the given length
     * @returns the requested properties
     */
    const getPropertiesAtLength: (pathInput: string | PathArray, distance?: number) => SegmentProperties;
    export default getPropertiesAtLength;
}
declare module "util/getPropertiesAtPoint" {
    import type { PathArray, Point } from "types";
    import type { PointProperties } from "interface";
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
    const getPropertiesAtPoint: (pathInput: string | PathArray, point: Point) => PointProperties;
    export default getPropertiesAtPoint;
}
declare module "util/getClosestPoint" {
    import type { PathArray } from "types";
    /**
     * Returns the point in path closest to a given point.
     *
     * @param pathInput target `pathArray`
     * @param point the given point
     * @returns the best match
     */
    const getClosestPoint: (pathInput: string | PathArray, point: {
        x: number;
        y: number;
    }) => {
        x: number;
        y: number;
    };
    export default getClosestPoint;
}
declare module "util/getPathArea" {
    import type { PathArray } from "types";
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
    const getPathArea: (path: PathArray) => number;
    export default getPathArea;
}
declare module "util/getDrawDirection" {
    import type { PathArray } from "types";
    /**
     * Check if a path is drawn clockwise and returns true if so,
     * false otherwise.
     *
     * @param path the path string or `pathArray`
     * @returns true when clockwise or false if not
     */
    const getDrawDirection: (path: string | PathArray) => boolean;
    export default getDrawDirection;
}
declare module "util/getPathBBox" {
    import { PathArray } from "types";
    const getPathBBox: (pathInput: PathArray | string) => {
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
    export default getPathBBox;
}
declare module "util/getSegmentAtLength" {
    import type { PathArray, PathSegment } from "types";
    /**
     * Returns the segment at a given length.
     *
     * @param pathInput the target `pathArray`
     * @param distance the distance in path to look at
     * @returns the requested segment
     */
    const getSegmentAtLength: (pathInput: string | PathArray, distance?: number) => PathSegment | undefined;
    export default getSegmentAtLength;
}
declare module "util/getSegmentOfPoint" {
    import type { SegmentProperties } from "interface";
    import type { PathArray } from "types";
    /**
     * Returns the path segment which contains a given point.
     *
     * @param path the `pathArray` to look into
     * @param point the point of the shape to look for
     * @returns the requested segment
     */
    const getSegmentOfPoint: (path: string | PathArray, point: {
        x: number;
        y: number;
    }) => SegmentProperties | undefined;
    export default getSegmentOfPoint;
}
declare module "util/isPathArray" {
    import type { PathArray } from "types";
    /**
     * Iterates an array to check if it's an actual `pathArray`.
     *
     * @param path the `pathArray` to be checked
     * @returns iteration result
     */
    const isPathArray: (path: unknown) => path is PathArray;
    export default isPathArray;
}
declare module "util/isAbsoluteArray" {
    import type { AbsoluteArray } from "types";
    /**
     * Iterates an array to check if it's a `pathArray`
     * with all absolute values.
     *
     * @param path the `pathArray` to be checked
     * @returns iteration result
     */
    const isAbsoluteArray: (path: unknown) => path is AbsoluteArray;
    export default isAbsoluteArray;
}
declare module "util/isNormalizedArray" {
    import type { NormalArray } from "types";
    /**
     * Iterates an array to check if it's a `pathArray`
     * with all segments are in non-shorthand notation
     * with absolute values.
     *
     * @param {string | SVGPath.pathArray} path the `pathArray` to be checked
     * @returns {boolean} iteration result
     */
    const isNormalizedArray: (path: unknown) => path is NormalArray;
    export default isNormalizedArray;
}
declare module "util/isCurveArray" {
    import { CurveArray } from "types";
    /**
     * Iterates an array to check if it's a `pathArray`
     * with all C (cubic bezier) segments.
     *
     * @param path the `Array` to be checked
     * @returns iteration result
     */
    const isCurveArray: (path: unknown) => path is CurveArray;
    export default isCurveArray;
}
declare module "util/isPointInStroke" {
    import type { PathArray } from "types";
    /**
     * Checks if a given point is in the stroke of a path.
     *
     * @param pathInput target path
     * @param point the given `{x,y}` point
     * @returns the query result
     */
    const isPointInStroke: (pathInput: string | PathArray, point: {
        x: number;
        y: number;
    }) => boolean;
    export default isPointInStroke;
}
declare module "util/isRelativeArray" {
    import type { RelativeArray } from "types";
    /**
     * Iterates an array to check if it's a `pathArray`
     * with relative values.
     *
     * @param path the `pathArray` to be checked
     * @returns iteration result
     */
    const isRelativeArray: (path: unknown) => path is RelativeArray;
    export default isRelativeArray;
}
declare module "util/isValidPath" {
    /**
     * Parses a path string value to determine its validity
     * then returns true if it's valid or false otherwise.
     *
     * @param pathString the path string to be parsed
     * @returns the path string validity
     */
    const isValidPath: (pathString: string) => boolean;
    export default isValidPath;
}
declare module "util/shapeParams" {
    import type { ShapeParams } from "interface";
    /**
     * Supported shapes and their specific parameters.
     */
    const shapeParams: ShapeParams;
    export default shapeParams;
}
declare module "util/isElement" {
    const isElement: (node?: unknown) => node is Element;
    export default isElement;
}
declare module "util/shapeToPathArray" {
    import type { CircleAttr, EllipseAttr, LineAttr, PolyAttr, RectAttr } from "interface";
    import type { PathArray, ShapeOps, ShapeTypes } from "types";
    /**
     * Returns a new `pathArray` from line attributes.
     *
     * @param attr shape configuration
     * @returns a new line `pathArray`
     */
    export const getLinePath: (attr: LineAttr) => PathArray;
    /**
     * Returns a new `pathArray` like from polyline/polygon attributes.
     *
     * @param attr shape configuration
     * @return a new polygon/polyline `pathArray`
     */
    export const getPolyPath: (attr: PolyAttr) => PathArray;
    /**
     * Returns a new `pathArray` from circle attributes.
     *
     * @param attr shape configuration
     * @return a circle `pathArray`
     */
    export const getCirclePath: (attr: CircleAttr) => PathArray;
    /**
     * Returns a new `pathArray` from ellipse attributes.
     *
     * @param attr shape configuration
     * @return an ellipse `pathArray`
     */
    export const getEllipsePath: (attr: EllipseAttr) => PathArray;
    /**
     * Returns a new `pathArray` like from rect attributes.
     *
     * @param attr object with properties above
     * @return a new `pathArray` from `<rect>` attributes
     */
    export const getRectanglePath: (attr: RectAttr) => PathArray;
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
    const shapeToPathArray: (element: ShapeTypes | ShapeOps) => false | PathArray;
    export default shapeToPathArray;
}
declare module "util/shapeToPath" {
    import type { ShapeOps, ShapeTypes } from "types";
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
    const shapeToPath: (element: ShapeTypes | ShapeOps, replace?: boolean, ownerDocument?: Document) => SVGPathElement | false;
    export default shapeToPath;
}
declare module "process/getSVGMatrix" {
    import CSSMatrix from "@thednp/dommatrix";
    import type { TransformObjectValues } from "types";
    /**
     * Returns a transformation matrix to apply to `<path>` elements.
     *
     * @see TransformObjectValues
     *
     * @param transform the `transformObject`
     * @returns a new transformation matrix
     */
    const getSVGMatrix: (transform: TransformObjectValues) => CSSMatrix;
    export default getSVGMatrix;
}
declare module "process/shortenSegment" {
    import type { ParserParams } from "interface";
    import type { AbsoluteSegment, NormalSegment, PathCommand, ShortSegment } from "types";
    /**
     * Shorten a single segment of a `pathArray` object.
     *
     * @param segment the `absoluteSegment` object
     * @param normalSegment the `normalSegment` object
     * @param params the coordinates of the previous segment
     * @param prevCommand the path command of the previous segment
     * @returns the shortened segment
     */
    const shortenSegment: (segment: AbsoluteSegment, normalSegment: NormalSegment, params: ParserParams, prevCommand: PathCommand) => ShortSegment;
    export default shortenSegment;
}
declare module "process/roundSegment" {
    import type { PathSegment } from "types";
    const roundSegment: <T extends PathSegment>(segment: T, roundOption: number) => T;
    export default roundSegment;
}
declare module "process/optimizePath" {
    import type { PathArray } from "types";
    /**
     * Optimizes a `pathArray` object:
     * * convert segments to shorthand if possible
     * * select shortest segments from absolute and relative `pathArray`s
     *
     * @param pathInput a string or `pathArray`
     * @param roundOption the amount of decimals to round values to
     * @returns the optimized `pathArray`
     */
    const optimizePath: (pathInput: PathArray, roundOption?: number) => PathArray;
    export default optimizePath;
}
declare module "process/projection2d" {
    import CSSMatrix from "@thednp/dommatrix";
    import { type PointTuple } from "types";
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
    const projection2d: (m: CSSMatrix, point2D: PointTuple, origin: [number, number, number]) => PointTuple;
    export default projection2d;
}
declare module "process/reverseCurve" {
    import type { CurveArray } from "types";
    /**
     * Reverses all segments of a `pathArray`
     * which consists of only C (cubic-bezier) path commands.
     *
     * @param path the source `pathArray`
     * @returns the reversed `pathArray`
     */
    const reverseCurve: (path: CurveArray) => CurveArray;
    export default reverseCurve;
}
declare module "process/reversePath" {
    import type { PathArray } from "types";
    /**
     * Reverses all segments of a `pathArray` and returns a new `pathArray` instance
     * with absolute values.
     *
     * @param pathInput the source `pathArray`
     * @returns the reversed `pathArray`
     */
    const reversePath: (pathInput: PathArray) => PathArray;
    export default reversePath;
}
declare module "process/roundPath" {
    import type { PathArray } from "types";
    /**
     * Rounds the values of a `pathArray` instance to
     * a specified amount of decimals and returns it.
     *
     * @param path the source `pathArray`
     * @param roundOption the amount of decimals to round numbers to
     * @returns the resulted `pathArray` with rounded values
     */
    const roundPath: (path: PathArray, roundOption?: number | "off") => PathArray;
    export default roundPath;
}
declare module "process/splitCubic" {
    import type { CubicSegment } from "types";
    /**
     * Split a cubic-bezier segment into two.
     *
     * @param pts the cubic-bezier parameters
     * @param ratio the cubic-bezier parameters
     * @return two new cubic-bezier segments
     */
    const splitCubic: (pts: number[], ratio?: number) => [CubicSegment, CubicSegment];
    export default splitCubic;
}
declare module "process/splitPath" {
    import type { PathArray } from "types";
    /**
     * Split a path into an `Array` of sub-path strings.
     *
     * In the process, values are converted to absolute
     * for visual consistency.
     *
     * @param pathInput the source `pathArray`
     * @return an array with all sub-path strings
     */
    const splitPath: (pathInput: PathArray) => PathArray[];
    export default splitPath;
}
declare module "process/transformPath" {
    import type { PathArray } from "types";
    import type { TransformObject } from "interface";
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
    const transformPath: (pathInput: PathArray | string, transform?: Partial<TransformObject>) => PathArray;
    export default transformPath;
}
declare module "util" {
    export { default as CSSMatrix } from "@thednp/dommatrix";
    import * as arcTools from "math/arcTools";
    import * as bezierTools from "math/bezier";
    import * as cubicTools from "math/cubicTools";
    import * as lineTools from "math/lineTools";
    import * as quadTools from "math/quadTools";
    import * as polygonTools from "math/polygonTools";
    export { arcTools, bezierTools, cubicTools, lineTools, quadTools, polygonTools };
    export { default as pathToAbsolute } from "convert/pathToAbsolute";
    export { default as pathToRelative } from "convert/pathToRelative";
    export { default as pathToCurve } from "convert/pathToCurve";
    export { default as pathToString } from "convert/pathToString";
    export { default as distanceSquareRoot } from "math/distanceSquareRoot";
    export { default as midPoint } from "math/midPoint";
    export { default as rotateVector } from "math/rotateVector";
    export { default as roundTo } from "math/roundTo";
    export { default as parsePathString } from "parser/parsePathString";
    export { default as finalizeSegment } from "parser/finalizeSegment";
    export { default as invalidPathValue } from "parser/invalidPathValue";
    export { default as isArcCommand } from "parser/isArcCommand";
    export { default as isDigit } from "parser/isDigit";
    export { default as isDigitStart } from "parser/isDigitStart";
    export { default as isMoveCommand } from "parser/isMoveCommand";
    export { default as isPathCommand } from "parser/isPathCommand";
    export { default as isSpace } from "parser/isSpace";
    export { default as paramsCount } from "parser/paramsCount";
    export { default as paramsParser } from "parser/paramsParser";
    export { default as pathParser } from "parser/pathParser";
    export { default as scanFlag } from "parser/scanFlag";
    export { default as scanParam } from "parser/scanParam";
    export { default as scanSegment } from "parser/scanSegment";
    export { default as skipSpaces } from "parser/skipSpaces";
    export { default as distanceEpsilon } from "util/distanceEpsilon";
    export { default as getClosestPoint } from "util/getClosestPoint";
    export { default as getDrawDirection } from "util/getDrawDirection";
    export { default as getPathArea } from "util/getPathArea";
    export { default as getPathBBox } from "util/getPathBBox";
    export { default as getPointAtLength } from "util/getPointAtLength";
    export { default as getPropertiesAtLength } from "util/getPropertiesAtLength";
    export { default as getPropertiesAtPoint } from "util/getPropertiesAtPoint";
    export { default as getSegmentAtLength } from "util/getSegmentAtLength";
    export { default as getSegmentOfPoint } from "util/getSegmentOfPoint";
    export { default as getTotalLength } from "util/getTotalLength";
    export { default as isAbsoluteArray } from "util/isAbsoluteArray";
    export { default as isCurveArray } from "util/isCurveArray";
    export { default as isNormalizedArray } from "util/isNormalizedArray";
    export { default as isPathArray } from "util/isPathArray";
    export { default as isPointInStroke } from "util/isPointInStroke";
    export { default as isRelativeArray } from "util/isRelativeArray";
    export { default as isValidPath } from "util/isValidPath";
    export { default as shapeParams } from "util/shapeParams";
    export { default as shapeToPath } from "util/shapeToPath";
    export { default as shapeToPathArray } from "util/shapeToPathArray";
    export { default as absolutizeSegment } from "process/absolutizeSegment";
    export { default as arcToCubic } from "process/arcToCubic";
    export { default as getSVGMatrix } from "process/getSVGMatrix";
    export { default as iterate } from "process/iterate";
    export { default as lineToCubic } from "process/lineToCubic";
    export { default as normalizePath } from "process/normalizePath";
    export { default as normalizeSegment } from "process/normalizeSegment";
    export { default as optimizePath } from "process/optimizePath";
    export { default as projection2d } from "process/projection2d";
    export { default as quadToCubic } from "process/quadToCubic";
    export { default as relativizeSegment } from "process/relativizeSegment";
    export { default as reverseCurve } from "process/reverseCurve";
    export { default as reversePath } from "process/reversePath";
    export { default as roundPath } from "process/roundPath";
    export { default as roundSegment } from "process/roundSegment";
    export { default as segmentToCubic } from "process/segmentToCubic";
    export { default as shortenSegment } from "process/shortenSegment";
    export { default as splitCubic } from "process/splitCubic";
    export { default as splitPath } from "process/splitPath";
    export { default as transformPath } from "process/transformPath";
}
