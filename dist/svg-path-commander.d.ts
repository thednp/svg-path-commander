import CSSMatrix from '@thednp/dommatrix';

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
    static get arcTools(): {
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
    static get bezierTools(): {
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
    static get cubicTools(): {
        getCubicBBox: (x1: number, y1: number, c1x: number, c1y: number, c2x: number, c2y: number, x2: number, y2: number) => [number, number, number, number];
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
    static get lineTools(): {
        getLineBBox: (x1: number, y1: number, x2: number, y2: number) => [number, number, number, number];
        getLineLength: (x1: number, y1: number, x2: number, y2: number) => number;
        getPointAtLineLength: (x1: number, y1: number, x2: number, y2: number, distance?: number) => {
            x: number;
            y: number;
        };
    };
    static get polygonTools(): {
        polygonArea: (polygon: PointTuple[]) => number;
        polygonLength: (polygon: PointTuple[]) => number;
    };
    static get quadTools(): {
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

export { type ACommand, type ASegment, type AbsoluteArray, type AbsoluteCommand, type AbsoluteSegment, type ArcCoordinates, type ArcSegment, type CCommand, type CSegment, type CircleAttr, type CloseSegment, type CubicCoordinates, type CubicPoints, type CubicSegment, type CurveArray, type DeriveCallback, type DerivedCubicPoints, type DerivedPoint, type DerivedQuadPoints, type DigitNumber, type EllipseAttr, type GlyphAttr, type HCommand, type HSegment, type HorLineSegment, type IteratorCallback, type LCommand, type LSegment, type LengthFactory, type LineAttr, type LineCoordinates, type LineSegment, type MCommand, type MSegment, type MoveSegment, type NormalArray, type NormalSegment, type Options, type ParserParams, type PathArray, type PathBBox, type PathCommand, type PathCommandNumber, type PathSegment, type PathTransform, type Point, type PointProperties, type PointTuple, type PolyAttr, type PolygonArray, type PolylineArray, type QCommand, type QSegment, type QuadCoordinates, type QuadPoints, type QuadSegment, type RectAttr, type RelativeArray, type RelativeCommand, type RelativeSegment, type SCommand, type SSegment, type SegmentLimits, type SegmentProperties, type ShapeOps, type ShapeParams, type ShapeTags, type ShapeTypes, type ShortCubicSegment, type ShortQuadSegment, type ShortSegment, type SpaceNumber, type TCommand, type TSegment, type TransformEntries, type TransformObject, type TransformObjectValues, type TransformProps, type VCommand, type VSegment, type VertLineSegment, type ZCommand, type ZSegment, type aCommand, type aSegment, type cCommand, type cSegment, SVGPathCommander as default, type hCommand, type hSegment, type lCommand, type lSegment, type mCommand, type mSegment, type qCommand, type qSegment, type sCommand, type sSegment, type tCommand, type tSegment, type vCommand, type vSegment, type zCommand, type zSegment };
