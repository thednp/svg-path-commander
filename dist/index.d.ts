import CSSMatrix from '@thednp/dommatrix';

interface SegmentProperties {
    segment: PathSegment;
    index: number;
    length: number;
    lengthAtSegment: number;
    [key: string]: any;
}
interface PointProperties {
    closest: {
        x: number;
        y: number;
    };
    distance: number;
    segment?: SegmentProperties;
}
interface LineAttr {
    type: 'line';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    [key: string]: string | number;
}
interface PolyAttr {
    type: 'polygon' | 'polyline';
    points: string;
    [key: string]: string | number;
}
interface CircleAttr {
    type: 'circle';
    cx: number;
    cy: number;
    r: number;
    [key: string]: string | number;
}
interface EllipseAttr {
    type: 'ellipse';
    cx: number;
    cy: number;
    rx: number;
    ry?: number;
    [key: string]: string | number | undefined;
}
interface RectAttr {
    type: 'rect';
    width: number;
    height: number;
    x: number;
    y: number;
    rx?: number;
    ry?: number;
    [key: string]: string | number | undefined;
}
interface GlyphAttr {
    type: 'glyph';
    d: string;
    [key: string]: string | number;
}
interface PathBBox {
    width: number;
    height: number;
    x: number;
    y: number;
    x2: number;
    y2: number;
    cx: number;
    cy: number;
    cz: number;
}
interface LengthFactory {
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
}
interface Options {
    round: 'auto' | 'off' | number;
    origin: number[];
}
interface TransformObject {
    translate: number | number[];
    rotate: number | number[];
    scale: number | number[];
    skew: number | number[];
    origin: number[];
}

type MCommand = 'M';
type mCommand = 'm';
type LCommand = 'L';
type lCommand = 'l';
type VCommand = 'V';
type vCommand = 'v';
type HCommand = 'H';
type hCommand = 'h';
type ZCommand = 'Z';
type zCommand = 'z';
type CCommand = 'C';
type cCommand = 'c';
type SCommand = 'S';
type sCommand = 's';
type QCommand = 'Q';
type qCommand = 'q';
type TCommand = 'T';
type tCommand = 't';
type ACommand = 'A';
type aCommand = 'a';
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
type AbsoluteSegment = MSegment | LSegment | VSegment | HSegment | CSegment | SSegment | QSegment | TSegment | ASegment | ZSegment;
type RelativeSegment = mSegment | lSegment | vSegment | hSegment | cSegment | sSegment | qSegment | tSegment | aSegment | zSegment;
type NormalSegment = MSegment | LSegment | CSegment | QSegment | ASegment | ZSegment;
type PathArray = [MSegment | mSegment, ...PathSegment[]];
type AbsoluteArray = [MSegment, ...AbsoluteSegment[]];
type RelativeArray = [MSegment, ...RelativeSegment[]];
type NormalArray = [MSegment, ...NormalSegment[]];
type CurveArray = [MSegment, ...CSegment[]];
type ShapeTypes = SVGPolylineElement | SVGPolygonElement | SVGLineElement | SVGEllipseElement | SVGCircleElement | SVGRectElement;
type ShapeOps = LineAttr | PolyAttr | PolyAttr | EllipseAttr | CircleAttr | RectAttr | GlyphAttr;
type TransformObjectValues = Partial<TransformObject> & {
    origin: [number, number, number];
};

/**
 * Creates a new SVGPathCommander instance with the following properties:
 * * segments: `pathArray`
 * * round: number
 * * origin: [number, number, number?]
 *
 * @class
 * @author thednp <https://github.com/thednp/svg-path-commander>
 * @returns {SVGPathCommander} a new SVGPathCommander instance
 */
declare class SVGPathCommander {
    static CSSMatrix: typeof CSSMatrix;
    static getSVGMatrix: (transform: TransformObjectValues) => CSSMatrix;
    static getPathBBox: (path?: PathArray | string) => PathBBox;
    static getPathArea: (path: PathArray) => number;
    static getTotalLength: (pathInput: string | PathArray) => number;
    static getDrawDirection: (path: string | PathArray) => boolean;
    static getPointAtLength: (pathInput: string | PathArray, distance: number) => {
        x: number;
        y: number;
    };
    static pathLengthFactory: (pathInput: string | PathArray, distance?: number) => LengthFactory;
    static getPropertiesAtLength: (pathInput: string | PathArray, distance?: number) => SegmentProperties;
    static getPropertiesAtPoint: (pathInput: string | PathArray, point: {
        x: number;
        y: number;
    }) => PointProperties;
    static polygonLength: (polygon: [number, number][]) => number;
    static polygonArea: (polygon: [number, number][]) => number;
    static getClosestPoint: (pathInput: string | PathArray, point: {
        x: number;
        y: number;
    }) => {
        x: number;
        y: number;
    };
    static getSegmentOfPoint: (path: string | PathArray, point: {
        x: number;
        y: number;
    }) => SegmentProperties | undefined;
    static getSegmentAtLength: (pathInput: string | PathArray, distance?: number) => PathSegment | undefined;
    static isPointInStroke: (pathInput: string | PathArray, point: {
        x: number;
        y: number;
    }) => boolean;
    static isValidPath: (pathString: string) => boolean;
    static isPathArray: (path: unknown) => path is PathArray;
    static isAbsoluteArray: (path: unknown) => path is AbsoluteArray;
    static isRelativeArray: (path: unknown) => path is RelativeArray;
    static isCurveArray: (path: unknown) => path is CurveArray;
    static isNormalizedArray: (path: unknown) => path is NormalArray;
    static shapeToPath: (element: ShapeTypes | ShapeOps, replace?: boolean, ownerDocument?: Document) => SVGPathElement | false;
    static shapeToPathArray: (element: ShapeTypes | ShapeOps, ownerDocument?: Document) => PathArray | false;
    static parsePathString: (pathInput: string | PathArray) => PathArray;
    static roundPath: (path: PathArray, roundOption?: number | "off") => PathArray;
    static splitPath: (pathInput: PathArray) => PathArray[];
    static splitCubic: (pts: number[]) => [CubicSegment, CubicSegment];
    static optimizePath: (pathInput: PathArray, round: "off" | number) => PathArray;
    static reverseCurve: (path: CurveArray) => CurveArray;
    static reversePath: (pathInput: PathArray) => PathArray;
    static normalizePath: (pathInput: string | PathArray) => NormalArray;
    static transformPath: (path: string | PathArray, transform?: Partial<TransformObject>) => PathArray;
    static pathToAbsolute: (pathInput: string | PathArray) => AbsoluteArray;
    static pathToRelative: (pathInput: string | PathArray) => RelativeArray;
    static pathToCurve: (pathInput: string | PathArray) => CurveArray;
    static pathToString: (path: PathArray, round?: number | "off") => string;
    segments: PathArray;
    round: number | 'off';
    origin: [number, number, number];
    /**
     * @constructor
     * @param {string} pathValue the path string
     * @param {any} config instance options
     */
    constructor(pathValue: string, config?: Partial<Options>);
    /**
     * Returns the path bounding box, equivalent to native `path.getBBox()`.
     *
     * @public
     * @returns the pathBBox
     */
    getBBox(): PathBBox;
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
}

export { SVGPathCommander as default };
