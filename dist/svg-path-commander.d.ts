import CSSMatrix from '@thednp/dommatrix';

export interface SegmentProperties {
	segment: PathSegment;
	index: number;
	length: number;
	lengthAtSegment: number;
	[key: string]: any;
}
export interface PointProperties {
	closest: {
		x: number;
		y: number;
	};
	distance: number;
	segment?: SegmentProperties;
}
export interface LineAttr {
	type: "line";
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	[key: string]: string | number;
}
export interface PolyAttr {
	type: "polygon" | "polyline";
	points: string;
	[key: string]: string | number;
}
export interface CircleAttr {
	type: "circle";
	cx: number;
	cy: number;
	r: number;
	[key: string]: string | number;
}
export interface EllipseAttr {
	type: "ellipse";
	cx: number;
	cy: number;
	rx: number;
	ry?: number;
	[key: string]: string | number | undefined;
}
export interface RectAttr {
	type: "rect";
	width: number;
	height: number;
	x: number;
	y: number;
	rx?: number;
	ry?: number;
	[key: string]: string | number | undefined;
}
export interface GlyphAttr {
	type: "glyph";
	d: string;
	[key: string]: string | number;
}
export interface PathBBox {
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
export interface LengthFactory {
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
export interface Options {
	round: "auto" | "off" | number;
	origin: number[];
}
export interface TransformObject {
	translate: number | number[];
	rotate: number | number[];
	scale: number | number[];
	skew: number | number[];
	origin: number[];
}
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
export type MSegment = [
	MCommand,
	number,
	number
];
export type mSegment = [
	mCommand,
	number,
	number
];
export type MoveSegment = MSegment | mSegment;
export type LSegment = [
	LCommand,
	number,
	number
];
export type lSegment = [
	lCommand,
	number,
	number
];
export type LineSegment = LSegment | lSegment;
export type VSegment = [
	VCommand,
	number
];
export type vSegment = [
	vCommand,
	number
];
export type VertLineSegment = vSegment | VSegment;
export type HSegment = [
	HCommand,
	number
];
export type hSegment = [
	hCommand,
	number
];
export type HorLineSegment = HSegment | hSegment;
export type ZSegment = [
	ZCommand
];
export type zSegment = [
	zCommand
];
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
export type SSegment = [
	SCommand,
	number,
	number,
	number,
	number
];
export type sSegment = [
	sCommand,
	number,
	number,
	number,
	number
];
export type ShortCubicSegment = SSegment | sSegment;
export type QSegment = [
	QCommand,
	number,
	number,
	number,
	number
];
export type qSegment = [
	qCommand,
	number,
	number,
	number,
	number
];
export type QuadSegment = QSegment | qSegment;
export type TSegment = [
	TCommand,
	number,
	number
];
export type tSegment = [
	tCommand,
	number,
	number
];
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
export type AbsoluteSegment = MSegment | LSegment | VSegment | HSegment | CSegment | SSegment | QSegment | TSegment | ASegment | ZSegment;
export type RelativeSegment = mSegment | lSegment | vSegment | hSegment | cSegment | sSegment | qSegment | tSegment | aSegment | zSegment;
export type NormalSegment = MSegment | LSegment | CSegment | QSegment | ASegment | ZSegment;
export type PathArray = [
	MSegment | mSegment,
	...PathSegment[]
];
export type AbsoluteArray = [
	MSegment,
	...AbsoluteSegment[]
];
export type RelativeArray = [
	MSegment,
	...RelativeSegment[]
];
export type NormalArray = [
	MSegment,
	...NormalSegment[]
];
export type CurveArray = [
	MSegment,
	...CSegment[]
];
export type ShapeTypes = SVGPolylineElement | SVGPolygonElement | SVGLineElement | SVGEllipseElement | SVGCircleElement | SVGRectElement;
export type ShapeOps = LineAttr | PolyAttr | PolyAttr | EllipseAttr | CircleAttr | RectAttr | GlyphAttr;
export type TransformObjectValues = Partial<TransformObject> & {
	origin: [
		number,
		number,
		number
	];
};
declare class SVGPathCommander {
	static CSSMatrix: typeof CSSMatrix;
	static getSVGMatrix: (transform: TransformObjectValues) => CSSMatrix;
	static getPathBBox: (path?: string | PathArray | undefined) => PathBBox;
	static getPathArea: (path: PathArray) => number;
	static getTotalLength: (pathInput: string | PathArray) => number;
	static getDrawDirection: (path: string | PathArray) => boolean;
	static getPointAtLength: (pathInput: string | PathArray, distance: number) => {
		x: number;
		y: number;
	};
	static pathLengthFactory: (pathInput: string | PathArray, distance?: number | undefined) => LengthFactory;
	static getPropertiesAtLength: (pathInput: string | PathArray, distance?: number | undefined) => SegmentProperties;
	static getPropertiesAtPoint: (pathInput: string | PathArray, point: {
		x: number;
		y: number;
	}) => PointProperties;
	static polygonLength: (polygon: [
		number,
		number
	][]) => number;
	static polygonArea: (polygon: [
		number,
		number
	][]) => number;
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
	static getSegmentAtLength: (pathInput: string | PathArray, distance?: number | undefined) => PathSegment | undefined;
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
	static shapeToPath: (element: ShapeTypes | ShapeOps, replace?: boolean | undefined, ownerDocument?: Document | undefined) => false | SVGPathElement;
	static shapeToPathArray: (element: ShapeTypes | ShapeOps, ownerDocument?: Document | undefined) => false | PathArray;
	static parsePathString: (pathInput: string | PathArray) => PathArray;
	static roundPath: (path: PathArray, roundOption?: number | "off" | undefined) => PathArray;
	static splitPath: (pathInput: PathArray) => PathArray[];
	static splitCubic: (pts: number[]) => [
		CubicSegment,
		CubicSegment
	];
	static optimizePath: (pathInput: PathArray, round: number | "off") => PathArray;
	static reverseCurve: (path: CurveArray) => CurveArray;
	static reversePath: (pathInput: PathArray) => PathArray;
	static normalizePath: (pathInput: string | PathArray) => NormalArray;
	static transformPath: (path: string | PathArray, transform?: Partial<TransformObject> | undefined) => PathArray;
	static pathToAbsolute: (pathInput: string | PathArray) => AbsoluteArray;
	static pathToRelative: (pathInput: string | PathArray) => RelativeArray;
	static pathToCurve: (pathInput: string | PathArray) => CurveArray;
	static pathToString: (path: PathArray, round?: number | "off" | undefined) => string;
	segments: PathArray;
	round: number | "off";
	origin: [
		number,
		number,
		number
	];
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

export {
	SVGPathCommander as default,
};

export as namespace SVGPathCommander;

export {};
