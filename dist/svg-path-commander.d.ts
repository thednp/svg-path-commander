import * as arcTools from './math/arcTools';
import * as bezierTools from './math/bezier';
import * as cubicTools from './math/cubicTools';
import { default as default_10 } from './math/roundTo';
import { default as default_11 } from './parser/parsePathString';
import { default as default_12 } from './parser/finalizeSegment';
import { default as default_13 } from './parser/invalidPathValue';
import { default as default_14 } from './parser/isArcCommand';
import { default as default_15 } from './parser/isDigit';
import { default as default_16 } from './parser/isDigitStart';
import { default as default_17 } from './parser/isMoveCommand';
import { default as default_18 } from './parser/isPathCommand';
import { default as default_19 } from './parser/isSpace';
import { default as default_2 } from '@thednp/dommatrix';
import { default as default_20 } from './parser/paramsCount';
import { default as default_21 } from './parser/paramsParser';
import { default as default_22 } from './parser/pathParser';
import { default as default_23 } from './parser/scanFlag';
import { default as default_24 } from './parser/scanParam';
import { default as default_25 } from './parser/scanSegment';
import { default as default_26 } from './parser/skipSpaces';
import { default as default_27 } from './util/distanceEpsilon';
import { default as default_28 } from './util/getClosestPoint';
import { default as default_29 } from './util/getDrawDirection';
import { default as default_3 } from './convert/pathToAbsolute';
import { default as default_30 } from './util/getPathArea';
import { default as default_31 } from './util/getPathBBox';
import { default as default_32 } from './util/getPointAtLength';
import { default as default_33 } from './util/getPropertiesAtLength';
import { default as default_34 } from './util/getPropertiesAtPoint';
import { default as default_35 } from './util/getSegmentAtLength';
import { default as default_36 } from './util/getSegmentOfPoint';
import { default as default_37 } from './util/getTotalLength';
import { default as default_38 } from './util/isAbsoluteArray';
import { default as default_39 } from './util/isCurveArray';
import { default as default_4 } from './convert/pathToRelative';
import { default as default_40 } from './util/isNormalizedArray';
import { default as default_41 } from './util/isPathArray';
import { default as default_42 } from './util/isPointInStroke';
import { default as default_43 } from './util/isRelativeArray';
import { default as default_44 } from './util/isValidPath';
import { default as default_45 } from './util/shapeParams';
import { default as default_46 } from './util/shapeToPath';
import { default as default_47 } from './util/shapeToPathArray';
import { default as default_48 } from './process/absolutizeSegment';
import { default as default_49 } from './process/arcToCubic';
import { default as default_5 } from './convert/pathToCurve';
import { default as default_50 } from './process/getSVGMatrix';
import { default as default_51 } from './process/iterate';
import { default as default_52 } from './process/lineToCubic';
import { default as default_53 } from './process/normalizePath';
import { default as default_54 } from './process/normalizeSegment';
import { default as default_55 } from './process/optimizePath';
import { default as default_56 } from './process/projection2d';
import { default as default_57 } from './process/quadToCubic';
import { default as default_58 } from './process/relativizeSegment';
import { default as default_59 } from './process/reverseCurve';
import { default as default_6 } from './convert/pathToString';
import { default as default_60 } from './process/reversePath';
import { default as default_61 } from './process/roundPath';
import { default as default_62 } from './process/roundSegment';
import { default as default_63 } from './process/segmentToCubic';
import { default as default_64 } from './process/shortenSegment';
import { default as default_65 } from './process/splitCubic';
import { default as default_66 } from './process/splitPath';
import { default as default_67 } from './process/transformPath';
import { default as default_7 } from './math/distanceSquareRoot';
import { default as default_8 } from './math/midPoint';
import { default as default_9 } from './math/rotateVector';
import * as lineTools from './math/lineTools';
import * as polygonTools from './math/polygonTools';
import * as quadTools from './math/quadTools';

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

declare const defaultExport: typeof SVGPathCommander & typeof util;
export default defaultExport;

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

declare namespace util {
    export {
        default_2 as CSSMatrix,
        arcTools,
        bezierTools,
        cubicTools,
        lineTools,
        quadTools,
        polygonTools,
        default_3 as pathToAbsolute,
        default_4 as pathToRelative,
        default_5 as pathToCurve,
        default_6 as pathToString,
        default_7 as distanceSquareRoot,
        default_8 as midPoint,
        default_9 as rotateVector,
        default_10 as roundTo,
        default_11 as parsePathString,
        default_12 as finalizeSegment,
        default_13 as invalidPathValue,
        default_14 as isArcCommand,
        default_15 as isDigit,
        default_16 as isDigitStart,
        default_17 as isMoveCommand,
        default_18 as isPathCommand,
        default_19 as isSpace,
        default_20 as paramsCount,
        default_21 as paramsParser,
        default_22 as pathParser,
        default_23 as scanFlag,
        default_24 as scanParam,
        default_25 as scanSegment,
        default_26 as skipSpaces,
        default_27 as distanceEpsilon,
        default_28 as getClosestPoint,
        default_29 as getDrawDirection,
        default_30 as getPathArea,
        default_31 as getPathBBox,
        default_32 as getPointAtLength,
        default_33 as getPropertiesAtLength,
        default_34 as getPropertiesAtPoint,
        default_35 as getSegmentAtLength,
        default_36 as getSegmentOfPoint,
        default_37 as getTotalLength,
        default_38 as isAbsoluteArray,
        default_39 as isCurveArray,
        default_40 as isNormalizedArray,
        default_41 as isPathArray,
        default_42 as isPointInStroke,
        default_43 as isRelativeArray,
        default_44 as isValidPath,
        default_45 as shapeParams,
        default_46 as shapeToPath,
        default_47 as shapeToPathArray,
        default_48 as absolutizeSegment,
        default_49 as arcToCubic,
        default_50 as getSVGMatrix,
        default_51 as iterate,
        default_52 as lineToCubic,
        default_53 as normalizePath,
        default_54 as normalizeSegment,
        default_55 as optimizePath,
        default_56 as projection2d,
        default_57 as quadToCubic,
        default_58 as relativizeSegment,
        default_59 as reverseCurve,
        default_60 as reversePath,
        default_61 as roundPath,
        default_62 as roundSegment,
        default_63 as segmentToCubic,
        default_64 as shortenSegment,
        default_65 as splitCubic,
        default_66 as splitPath,
        default_67 as transformPath
    }
}

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
