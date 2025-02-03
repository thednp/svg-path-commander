import { AbsoluteArray as AbsoluteArray_2 } from './types';
import { AbsoluteSegment as AbsoluteSegment_2 } from './types';
import * as arcTools from './math/arcTools';
import * as bezierTools from './math/bezier';
import { CSegment as CSegment_2 } from './types';
import { CubicSegment as CubicSegment_2 } from './types';
import * as cubicTools from './math/cubicTools';
import { CurveArray as CurveArray_2 } from './types';
import { default as default_2 } from '@thednp/dommatrix';
import { default as default_3 } from './parser/pathParser';
import { DigitNumber as DigitNumber_2 } from './types';
import { IteratorCallback as IteratorCallback_2 } from './types';
import * as lineTools from './math/lineTools';
import { MSegment as MSegment_2 } from './types';
import { NormalArray as NormalArray_2 } from './types';
import { NormalSegment as NormalSegment_2 } from './types';
import { ParserParams as ParserParams_2 } from './interface';
import { PathCommand as PathCommand_2 } from './types';
import { PathCommandNumber as PathCommandNumber_2 } from './types';
import { PathSegment as PathSegment_2 } from './types';
import { Point as Point_2 } from './types';
import { PointProperties as PointProperties_2 } from './interface';
import * as polygonTools from './math/polygonTools';
import * as quadTools from './math/quadTools';
import { RelativeArray as RelativeArray_2 } from './types';
import { RelativeSegment as RelativeSegment_2 } from './types';
import { SegmentProperties as SegmentProperties_2 } from './interface';
import { ShapeOps as ShapeOps_2 } from './types';
import { ShapeParams as ShapeParams_2 } from './interface';
import { ShapeTypes as ShapeTypes_2 } from './types';
import { ShortSegment as ShortSegment_2 } from './types';
import { SpaceNumber as SpaceNumber_2 } from './types';

export declare type AbsoluteArray = [MSegment, ...AbsoluteSegment[]];

export declare type AbsoluteCommand = MCommand | LCommand | VCommand | HCommand | ZCommand | CCommand | SCommand | QCommand | TCommand | ACommand;

export declare type AbsoluteSegment = MSegment | LSegment | VSegment | HSegment | CSegment | SSegment | QSegment | TSegment | ASegment | ZSegment;

export declare type ACommand = "A";

export declare type aCommand = "a";

export declare type ArcCoordinates = [
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

export declare type ArcSegment = ASegment | aSegment;

export declare type ASegment = [
ACommand,
number,
number,
number,
number,
number,
number,
number
];

export declare type aSegment = [
aCommand,
number,
number,
number,
number,
number,
number,
number
];

export declare type CCommand = "C";

export declare type cCommand = "c";

export declare type CircleAttr = {
    type: "circle";
    cx: number;
    cy: number;
    r: number;
    [key: string]: string | number;
};

export declare type CloseSegment = ZSegment | zSegment;

export declare type CSegment = [
CCommand,
number,
number,
number,
number,
number,
number
];

export declare type cSegment = [
cCommand,
number,
number,
number,
number,
number,
number
];

export declare type CubicCoordinates = [
number,
number,
number,
number,
number,
number,
number,
number
];

export declare type CubicPoints = [
Point,
Point,
Point,
Point,
Point,
Point,
Point,
Point
];

export declare type CubicSegment = CSegment | cSegment;

export declare type CurveArray = [MSegment, ...CSegment[]];

declare const _default: typeof SVGPathCommander_2 & {
    absolutizeSegment: (segment: PathSegment_2, index: number, lastX: number, lastY: number) => AbsoluteSegment_2;
    arcToCubic: (X1: number, Y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, X2: number, Y2: number, recursive?: [number, number, number, number]) => number[];
    arcTools: typeof arcTools;
    bezierTools: typeof bezierTools;
    CSSMatrix: typeof default_2;
    cubicTools: typeof cubicTools;
    distanceEpsilon: number;
    distanceSquareRoot: (a: PointTuple, b: PointTuple) => number;
    finalizeSegment: (path: default_3) => void;
    getClosestPoint: (pathInput: string | PathArray, point: {
        x: number;
        y: number;
    }) => {
        x: number;
        y: number;
    };
    getDrawDirection: (path: string | PathArray) => boolean;
    getPathArea: (path: PathArray) => number;
    getPathBBox: (pathInput: PathArray | string) => {
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
    getPointAtLength: (pathInput: string | PathArray, distance?: number) => {
        x: number;
        y: number;
    };
    getPropertiesAtLength: (pathInput: string | PathArray, distance?: number) => SegmentProperties_2;
    getPropertiesAtPoint: (pathInput: string | PathArray, point: Point_2) => PointProperties_2;
    getSegmentAtLength: (pathInput: string | PathArray, distance?: number) => PathSegment_2 | undefined;
    getSegmentOfPoint: (path: string | PathArray, point: {
        x: number;
        y: number;
    }) => SegmentProperties_2 | undefined;
    getSVGMatrix: (transform: TransformObjectValues) => default_2;
    getTotalLength: (pathInput: string | PathArray) => number;
    invalidPathValue: string;
    isAbsoluteArray: (path: unknown) => path is AbsoluteArray_2;
    isArcCommand: (code: number) => code is 97;
    isCurveArray: (path: unknown) => path is CurveArray_2;
    isDigit: (code: number) => code is DigitNumber_2;
    isDigitStart: (code: number) => code is DigitNumber_2 | 43 | 45 | 46;
    isMoveCommand: (code: number) => code is 109 | 77;
    isNormalizedArray: (path: unknown) => path is NormalArray_2;
    isPathArray: (path: unknown) => path is PathArray;
    isPathCommand: (code: number) => code is PathCommandNumber_2;
    isPointInStroke: (pathInput: string | PathArray, point: {
        x: number;
        y: number;
    }) => boolean;
    isRelativeArray: (path: unknown) => path is RelativeArray_2;
    isSpace: (ch: number) => ch is SpaceNumber_2;
    isValidPath: (pathString: string) => boolean;
    iterate: <T extends PathArray>(path: PathArray, iterator: IteratorCallback_2) => T;
    lineToCubic: (x1: number, y1: number, x2: number, y2: number) => number[];
    lineTools: typeof lineTools;
    midPoint: (a: PointTuple, b: PointTuple, t: number) => PointTuple;
    normalizePath: (pathInput: string | PathArray) => NormalArray_2;
    normalizeSegment: (segment: PathSegment_2, params: ParserParams_2) => NormalSegment_2;
    optimizePath: (pathInput: PathArray, roundOption?: number) => PathArray;
    paramsCount: {
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
    paramsParser: ParserParams_2;
    parsePathString: <T extends PathArray>(pathInput: string | T) => PathArray;
    pathParser: typeof default_3;
    pathToAbsolute: (pathInput: string | PathArray) => AbsoluteArray_2;
    pathToCurve: (pathInput: string | PathArray) => CurveArray_2;
    pathToRelative: (pathInput: string | PathArray) => RelativeArray_2;
    pathToString: (path: PathArray, roundOption?: number | "off") => string;
    polygonTools: typeof polygonTools;
    projection2d: (m: default_2, point2D: PointTuple, origin: [number, number, number]) => PointTuple;
    quadToCubic: (x1: number, y1: number, qx: number, qy: number, x2: number, y2: number) => [number, number, number, number, number, number];
    quadTools: typeof quadTools;
    relativizeSegment: (segment: PathSegment_2, index: number, lastX: number, lastY: number) => MSegment_2 | RelativeSegment_2;
    reverseCurve: (path: CurveArray_2) => CurveArray_2;
    reversePath: (pathInput: PathArray) => PathArray;
    rotateVector: (x: number, y: number, rad: number) => {
        x: number;
        y: number;
    };
    roundPath: (path: PathArray, roundOption?: number | "off") => PathArray;
    roundSegment: <T extends PathSegment_2>(segment: T, roundOption: number) => T;
    roundTo: (n: number, round: number) => number;
    scanFlag: (path: default_3) => void;
    scanParam: (path: default_3) => void;
    scanSegment: (path: default_3) => void;
    segmentToCubic: (segment: PathSegment_2, params: ParserParams_2) => MSegment_2 | CSegment_2;
    shapeParams: ShapeParams_2;
    shapeToPath: (element: ShapeTypes_2 | ShapeOps_2, replace?: boolean, ownerDocument?: Document) => SVGPathElement | false;
    shapeToPathArray: (element: ShapeTypes_2 | ShapeOps_2) => false | PathArray;
    shortenSegment: (segment: AbsoluteSegment_2, normalSegment: NormalSegment_2, params: ParserParams_2, prevCommand: PathCommand_2) => ShortSegment_2;
    skipSpaces: (path: default_3) => void;
    splitCubic: (pts: number[], ratio?: number) => [CubicSegment_2, CubicSegment_2];
    splitPath: (pathInput: PathArray) => PathArray[];
    transformPath: (pathInput: PathArray | string, transform?: Partial<TransformObject>) => PathArray;
};
export default _default;

export declare type DeriveCallback = (t: number) => Point;

export declare type DerivedCubicPoints = [
DerivedPoint,
DerivedPoint,
DerivedPoint,
DerivedPoint,
DerivedPoint,
DerivedPoint,
DerivedPoint,
DerivedPoint
];

export declare type DerivedPoint = Point & {
    t: number;
};

export declare type DerivedQuadPoints = [
DerivedPoint,
DerivedPoint,
DerivedPoint,
DerivedPoint,
DerivedPoint,
DerivedPoint
];

export declare type DigitNumber = 0x30 | 0x31 | 0x32 | 0x33 | 0x34 | 0x35 | 0x36 | 0x37 | 0x38 | 0x39;

export declare type EllipseAttr = {
    type: "ellipse";
    cx: number;
    cy: number;
    rx: number;
    ry?: number;
    [key: string]: string | number | undefined;
};

export declare type GlyphAttr = {
    type: "glyph";
    d: string;
    [key: string]: string | number;
};

export declare type HCommand = "H";

export declare type hCommand = "h";

export declare type HorLineSegment = HSegment | hSegment;

export declare type HSegment = [HCommand, number];

export declare type hSegment = [hCommand, number];

export declare type IteratorCallback = (segment: PathSegment, index: number, lastX: number, lastY: number) => PathSegment | false | void | undefined;

export declare type LCommand = "L";

export declare type lCommand = "l";

export declare type LengthFactory = {
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

export declare type LineAttr = {
    type: "line";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    [key: string]: string | number;
};

export declare type LineCoordinates = [number, number, number, number];

export declare type LineSegment = LSegment | lSegment;

export declare type LSegment = [LCommand, number, number];

export declare type lSegment = [lCommand, number, number];

export declare type MCommand = "M";

export declare type mCommand = "m";

export declare type MoveSegment = MSegment | mSegment;

export declare type MSegment = [MCommand, number, number];

export declare type mSegment = [mCommand, number, number];

export declare type NormalArray = [MSegment, ...NormalSegment[]];

export declare type NormalSegment = MSegment | LSegment | CSegment | QSegment | ASegment | ZSegment;

export declare type Options = {
    round: "off" | number;
    origin: number[];
};

export declare type ParserParams = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x: number;
    y: number;
    qx: number | null;
    qy: number | null;
};

export declare type PathArray = [MSegment | mSegment, ...PathSegment[]];

export declare type PathBBox = {
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

export declare type PathCommand = AbsoluteCommand | RelativeCommand;

export declare type PathCommandNumber = 0x6d | 0x7a | 0x6c | 0x68 | 0x76 | 0x63 | 0x73 | 0x71 | 0x74 | 0x61;

export declare type PathSegment = MoveSegment | LineSegment | VertLineSegment | HorLineSegment | CloseSegment | CubicSegment | ShortCubicSegment | QuadSegment | ShortQuadSegment | ArcSegment;

export declare type PathTransform = {
    s: PathSegment;
    c: string;
    x: number;
    y: number;
};

export declare type Point = {
    x: number;
    y: number;
};

export declare type PointProperties = {
    closest: {
        x: number;
        y: number;
    };
    distance: number;
    segment?: SegmentProperties;
};

export declare type PointTuple = [number, number];

export declare type PolyAttr = {
    type: "polygon" | "polyline";
    points: string;
    [key: string]: string | number;
};

export declare type PolygonArray = [MSegment, ...LSegment[], ZSegment];

export declare type PolylineArray = [MSegment, ...LSegment[]];

export declare type QCommand = "Q";

export declare type qCommand = "q";

export declare type QSegment = [QCommand, number, number, number, number];

export declare type qSegment = [qCommand, number, number, number, number];

export declare type QuadCoordinates = [number, number, number, number, number, number];

export declare type QuadPoints = [Point, Point, Point, Point, Point, Point];

export declare type QuadSegment = QSegment | qSegment;

export declare type RectAttr = {
    type: "rect";
    width: number;
    height: number;
    x: number;
    y: number;
    rx?: number;
    ry?: number;
    [key: string]: string | number | undefined;
};

export declare type RelativeArray = [MSegment, ...RelativeSegment[]];

export declare type RelativeCommand = mCommand | lCommand | vCommand | hCommand | zCommand | cCommand | sCommand | qCommand | tCommand | aCommand;

export declare type RelativeSegment = mSegment | lSegment | vSegment | hSegment | cSegment | sSegment | qSegment | tSegment | aSegment | zSegment;

export declare type SCommand = "S";

export declare type sCommand = "s";

export declare type SegmentLimits = {
    min: {
        x: number;
        y: number;
    };
    max: {
        x: number;
        y: number;
    };
};

export declare type SegmentProperties = {
    segment: PathSegment;
    index: number;
    length: number;
    lengthAtSegment: number;
};

export declare type ShapeOps = LineAttr | PolyAttr | PolyAttr | EllipseAttr | CircleAttr | RectAttr | GlyphAttr;

export declare type ShapeParams = {
    line: ["x1", "y1", "x2", "y2"];
    circle: ["cx", "cy", "r"];
    ellipse: ["cx", "cy", "rx", "ry"];
    rect: ["width", "height", "x", "y", "rx", "ry"];
    polygon: ["points"];
    polyline: ["points"];
    glyph: ["d"];
};

export declare type ShapeTags = "line" | "polyline" | "polygon" | "ellipse" | "circle" | "rect" | "glyph";

export declare type ShapeTypes = SVGPolylineElement | SVGPolygonElement | SVGLineElement | SVGEllipseElement | SVGCircleElement | SVGRectElement;

export declare type ShortCubicSegment = SSegment | sSegment;

export declare type ShortQuadSegment = TSegment | tSegment;

export declare type ShortSegment = VertLineSegment | HorLineSegment | ShortCubicSegment | ShortQuadSegment | CloseSegment;

export declare type SpaceNumber = 0x1680 | 0x180e | 0x2000 | 0x2001 | 0x2002 | 0x2003 | 0x2004 | 0x2005 | 0x2006 | 0x2007 | 0x2008 | 0x2009 | 0x200a | 0x202f | 0x205f | 0x3000 | 0xfeff | 0x0a | 0x0d | 0x2028 | 0x2029 | 0x20 | 0x09 | 0x0b | 0x0c | 0xa0 | 0x1680;

export declare type SSegment = [SCommand, number, number, number, number];

export declare type sSegment = [sCommand, number, number, number, number];

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
declare class SVGPathCommander_2 {
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

export declare type TCommand = "T";

export declare type tCommand = "t";

export declare type TransformEntries = [
TransformProps,
TransformObject[TransformProps]
][];

export declare type TransformObject = {
    translate: number | number[];
    rotate: number | number[];
    scale: number | number[];
    skew: number | number[];
    origin: number[];
};

export declare type TransformObjectValues = Partial<TransformObject> & {
    origin: [number, number, number];
};

export declare type TransformProps = keyof TransformObject;

export declare type TSegment = [TCommand, number, number];

export declare type tSegment = [tCommand, number, number];

export declare type VCommand = "V";

export declare type vCommand = "v";

export declare type VertLineSegment = vSegment | VSegment;

export declare type VSegment = [VCommand, number];

export declare type vSegment = [vCommand, number];

export declare type ZCommand = "Z";

export declare type zCommand = "z";

export declare type ZSegment = [ZCommand];

export declare type zSegment = [zCommand];

export { }


declare namespace shapes {
    let initial: string[];
    let normalized: string[];
    let optimized: string[];
    let relative: string[];
    let absolute: string[];
    let curve: string[];
    let scaled: string[];
    let translated: string[];
    let length: number[];
    let pointAt50: {
        x: number;
        y: number;
    }[];
}


declare namespace simpleShapes {
    let initial: string[];
    let normalized: string[];
    let transformed: string[];
    let scaled3d: string[];
    let skewedX: string[];
    let skewedY: string[];
    let reversed: string[];
    let length: number[];
    let width: number[];
    let height: number[];
    let pointAt0: {
        x: number;
        y: number;
    }[];
    let pointAt400: {
        x: number;
        y: number;
    }[];
    let pointAt50: {
        x: number;
        y: number;
    }[];
}
