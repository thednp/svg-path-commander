declare module "options/options" {
    export default SVGPCO;
    /**
     * SVGPathCommander default options
     *
     * @type {Object.<string, (boolean | number | number[])>}
     */
    const SVGPCO: {
        [x: string]: (boolean | number | number[]);
    };
}
declare module "process/fixArc" {
    /**
     * Splits an extended A (arc-to) segment into two cubic-bezier segments.
     *
     * @param {SVGPC.pathArray} path the `pathArray` this segment belongs to
     * @param {string[]} allPathCommands all previous path commands
     * @param {Number} i the index of the segment
     */
    export default function fixArc(path: import("../types/types").pathArray, allPathCommands: string[], i: number): void;
}
declare module "parser/paramsCount" {
    export default paramsCount;
    /**
     * @type {Object.<string, number>}
     */
    const paramsCount: {
        [x: string]: number;
    };
}
declare module "util/isPathArray" {
    /**
     * Iterates an array to check if it's an actual `pathArray`.
     *
     * @param {SVGPC.pathArray} path the `pathArray` to be checked
     * @returns {boolean} iteration result
     */
    export default function isPathArray(path: import("../types/types").pathArray): boolean;
}
declare module "util/isCurveArray" {
    /**
     * Iterates an array to check if it's a `pathArray`
     * with all C (cubic bezier) segments.
     *
     * @param {SVGPC.pathArray} path the `Array` to be checked
     * @returns {boolean} iteration result
     */
    export default function isCurveArray(path: import("../types/types").pathArray): boolean;
}
declare module "process/clonePath" {
    /**
     * Returns a clone of an existing `pathArray`.
     *
     * @param {SVGPC.pathArray} path the original `pathArray`
     * @returns {SVGPC.pathArray} the cloned `pathArray`
     */
    export default function clonePath(path: import("../types/types").pathArray): import("../types/types").pathArray;
}
declare module "parser/finalizeSegment" {
    /**
     * Breaks the parsing of a pathString once a segment is finalized.
     *
     * @param {SVGPC.parserPathArray} path the `parserPathArray` instance
     */
    export default function finalizeSegment(path: SVGPC.parserPathArray): void;
}
declare module "parser/invalidPathValue" {
    export default invalidPathValue;
    const invalidPathValue: "Invalid path value";
}
declare module "parser/scanFlag" {
    /**
     * Validates an A (arc-to) specific path command value.
     * Usually a `large-arc-flag` or `sweep-flag`.
     *
     * @param {SVGPC.parserPathArray} path the `parserPathArray` instance
     */
    export default function scanFlag(path: SVGPC.parserPathArray): void;
}
declare module "parser/isDigit" {
    /**
     * Checks if a character is a digit.
     *
     * @param {string} code the character to check
     * @returns {boolean} check result
     */
    export default function isDigit(code: string): boolean;
}
declare module "parser/scanParam" {
    /**
     * Validates every character of the path string,
     * every path command, negative numbers or floating point numbers.
     *
     * @param {SVGPC.parserPathArray} path the `parserPathArray` instance
     */
    export default function scanParam(path: SVGPC.parserPathArray): void;
}
declare module "parser/isSpace" {
    /**
     * Checks if the character is a space.
     *
     * @param {string} code the character to check
     * @returns {boolean} check result
     */
    export default function isSpace(code: string): boolean;
}
declare module "parser/skipSpaces" {
    /**
     * Points the parser to the next character in the
     * path string every time it encounters any kind of
     * space character.
     *
     * @param {SVGPC.parserPathArray} path the `parserPathArray` instance
     */
    export default function skipSpaces(path: SVGPC.parserPathArray): void;
}
declare module "parser/isPathCommand" {
    /**
     * Checks if the character is a path command.
     *
     * @param {string} code the character to check
     * @returns {boolean} check result
     */
    export default function isPathCommand(code: string): boolean;
}
declare module "parser/isDigitStart" {
    /**
     * Checks if the character is or belongs to a number.
     * [0-9]|+|-|.
     *
     * @param {string} code the character to check
     * @returns {boolean} check result
     */
    export default function isDigitStart(code: string): boolean;
}
declare module "parser/isArcCommand" {
    /**
     * Checks if the character is an A (arc-to) path command.
     *
     * @param {string} code the character to check
     * @returns {boolean} check result
     */
    export default function isArcCommand(code: string): boolean;
}
declare module "parser/scanSegment" {
    /**
     * Scans every character in the path string to determine
     * where a segment starts and where it ends.
     *
     * @param {SVGPC.parserPathArray} path the `parserPathArray` instance
     */
    export default function scanSegment(path: SVGPC.parserPathArray): void;
}
declare module "parser/svgPathArray" {
    /**
     * The `parserPathArray` used by the parser.
     *
     * @param {string} pathString
     */
    export default function SVGPathArray(pathString: string): void;
    export default class SVGPathArray {
        /**
         * The `parserPathArray` used by the parser.
         *
         * @param {string} pathString
         */
        constructor(pathString: string);
        /** @type {[string, ...number[]][]} */
        segments: [string, ...number[]][];
        /** @type {string} */
        pathValue: string;
        /** @type {number} */
        max: number;
        /** @type {number} */
        index: number;
        /** @type {number} */
        param: number;
        /** @type {number} */
        segmentStart: number;
        /** @type {any} */
        data: any;
        /** @type {string} */
        err: string;
    }
}
declare module "parser/parsePathString" {
    /**
     * Parses a path string value and returns an array
     * of segments we like to call `pathArray`.
     *
     * @param {string | SVGPC.pathArray} pathInput the string to be parsed
     * @returns {SVGPC.pathArray} the resulted `pathArray`
     */
    export default function parsePathString(pathInput: string | import("../types/types").pathArray): import("../types/types").pathArray;
}
declare module "util/isAbsoluteArray" {
    /**
     * Iterates an array to check if it's a `pathArray`
     * with all absolute values.
     *
     * @param {SVGPC.pathArray} path the `pathArray` to be checked
     * @returns {boolean} iteration result
     */
    export default function isAbsoluteArray(path: import("../types/types").pathArray): boolean;
}
declare module "convert/pathToAbsolute" {
    /**
     * Parses a path string value or object and returns an array
     * of segments, all converted to absolute values.
     *
     * @param {string | SVGPC.pathArray} pathInput the path string | object
     * @returns {SVGPC.pathArray} the resulted `pathArray` with absolute values
     */
    export default function pathToAbsolute(pathInput: string | import("../types/types").pathArray): import("../types/types").pathArray;
}
declare module "process/shorthandToQuad" {
    /**
     * Returns the missing control point from an
     * T (shorthand quadratic bezier) segment.
     *
     * @param {Number} x1 curve start x
     * @param {Number} y1 curve start y
     * @param {Number} qx control point x
     * @param {Number} qy control point y
     * @param {String} prevCommand the previous path command
     * @returns {Object} the missing control point
     */
    export default function shorthandToQuad(x1: number, y1: number, qx: number, qy: number, prevCommand: string): Object;
}
declare module "process/shorthandToCubic" {
    /**
     * Returns the missing control point from an
     * S (shorthand cubic bezier) segment.
     *
     * @param {Number} x1 curve start x
     * @param {Number} y1 curve start y
     * @param {Number} x2 curve end x
     * @param {Number} y2 curve end y
     * @param {String} prevCommand the previous path command
     * @returns {Object} the missing control point
     */
    export default function shorthandToCubic(x1: number, y1: number, x2: number, y2: number, prevCommand: string): Object;
}
declare module "process/normalizeSegment" {
    /**
     * Normalizes a single segment of a `pathArray` object.
     *
     * @param {SVGPC.pathSegment} segment the segment object
     * @param {Object} params the coordinates of the previous segment
     * @param {String} prevCommand the path command of the previous segment
     * @returns {SVGPC.pathSegment} the normalized segment
     */
    export default function normalizeSegment(segment: import("../types/types").pathSegment, params: Object, prevCommand: string): import("../types/types").pathSegment;
}
declare module "util/isNormalizedArray" {
    /**
     * Iterates an array to check if it's a `pathArray`
     * with all segments are in non-shorthand notation
     * with absolute values.
     *
     * @param {SVGPC.pathArray} path the `pathArray` to be checked
     * @returns {boolean} iteration result
     */
    export default function isNormalizedArray(path: import("../types/types").pathArray): boolean;
}
declare module "process/normalizePath" {
    /**
     * Normalizes a `path` object for further processing:
     * * convert segments to absolute values
     * * convert shorthand path commands to their non-shorthand notation
     *
     * @param {String | SVGPC.pathArray} pathInput the string to be parsed or 'pathArray'
     * @returns {SVGPC.pathArray} the normalized `pathArray`
     */
    export default function normalizePath(pathInput: string | import("../types/types").pathArray): import("../types/types").pathArray;
}
declare module "math/rotateVector" {
    /**
     * Returns an {x,y} vector rotated by a given
     * angle in radian.
     *
     * @param {Number} x the initial vector x
     * @param {Number} y the initial vector y
     * @returns {{x: number, y: number}} the rotated vector
     */
    export default function rotateVector(x: number, y: number, rad: any): {
        x: number;
        y: number;
    };
}
declare module "process/arcToCubic" {
    /**
     * Converts A (arc-to) segments to C (cubic-bezier-to).
     *
     * For more information of where this math came from visit:
     * http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
     *
     * @param {Number} x1 the starting x position
     * @param {Number} y1 the starting y position
     * @param {Number} rx x-radius of the arc
     * @param {Number} ry y-radius of the arc
     * @param {Number} angle x-axis-rotation of the arc
     * @param {Number} LAF large-arc-flag of the arc
     * @param {Number} SF sweep-flag of the arc
     * @param {Number} x2 the ending x position
     * @param {Number} y2 the ending y position
     * @param {Number[] | null} recursive the parameters needed to split arc into 2 segments
     * @return {Number[] | Number[][]} the resulting cubic-bezier segment(s)
     */
    export default function arcToCubic(x1: number, y1: number, rx: number, ry: number, angle: number, LAF: number, SF: number, x2: number, y2: number, recursive: number[] | null): number[] | number[][];
}
declare module "process/quadToCubic" {
    /**
     * Converts a Q (quadratic-bezier) segment to C (cubic-bezier).
     *
     * @param {Number} x1 curve start x
     * @param {Number} y1 curve start y
     * @param {Number} qx control point x
     * @param {Number} qy control point y
     * @param {Number} x2 curve end x
     * @param {Number} y2 curve end y
     * @returns {Number[]} the cubic-bezier segment
     */
    export default function quadToCubic(x1: number, y1: number, qx: number, qy: number, x2: number, y2: number): number[];
}
declare module "util/getPointAtSegLength" {
    /**
     * Returns the {x,y} coordinates of a point at a
     * given length of a cubic-bezier segment.
     *
     * @param {Number} p1x the starting point X
     * @param {Number} p1y the starting point Y
     * @param {Number} c1x the first control point X
     * @param {Number} c1y the first control point Y
     * @param {Number} c2x the second control point X
     * @param {Number} c2y the second control point Y
     * @param {Number} px2 the ending point X
     * @param {Number} py2 the ending point Y
     * @param {Number} t a [0-1] ratio
     * @returns {{x: number, y: number}} the requested {x,y} coordinates
     */
    export default function getPointAtSegLength(p1x: number, p1y: number, c1x: number, c1y: number, c2x: number, c2y: number, p2x: any, p2y: any, t: number): {
        x: number;
        y: number;
    };
}
declare module "math/midPoint" {
    /**
     * Returns the coordinates of a specified distance
     * ratio between two points.
     *
     * @param {Number[]} a the first point coordinates
     * @param {Number[]} b the second point coordinates
     * @param {Number} t the ratio
     * @returns {Number[]} the midpoint coordinates
     */
    export default function midPoint(a: number[], b: number[], t: number): number[];
}
declare module "process/lineToCubic" {
    /**
     * Converts an L (line-to) segment to C (cubic-bezier).
     *
     * @param {Number} x1 line start x
     * @param {Number} y1 line start y
     * @param {Number} x2 line end x
     * @param {Number} y2 line end y
     * @returns {Number[]} the cubic-bezier segment
     */
    export default function lineToCubic(x1: number, y1: number, x2: number, y2: number): number[];
}
declare module "process/segmentToCubic" {
    /**
     * Converts any segment to C (cubic-bezier).
     *
     * @param {SVGPC.pathSegment} segment the source segment
     * @param {Object.<string, number>} params the source segment parameters
     * @returns {SVGPC.pathSegment} the cubic-bezier segment
     */
    export default function segmentToCubic(segment: import("../types/types").pathSegment, params: {
        [x: string]: number;
    }): import("../types/types").pathSegment;
}
declare module "convert/pathToCurve" {
    /**
     * Parses a path string value or 'pathArray' and returns a new one
     * in which all segments are converted to cubic-bezier.
     *
     * @param {String | SVGPC.pathArray} pathInput the string to be parsed or object
     * @returns {SVGPC.pathArray} the resulted `pathArray` converted to cubic-bezier
     */
    export default function pathToCurve(pathInput: string | import("../types/types").pathArray): import("../types/types").pathArray;
}
declare module "util/getPathArea" {
    /**
     * Returns the area of a shape.
     * @author Jürg Lehni & Jonathan Puckey
     *
     * => https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
     *
     * @param {SVGPC.pathArray} path the shape `pathArray`
     * @returns {SVGPC.pathBBox} the length of the cubic-bezier segment
     */
    export default function getPathArea(path: import("../types/types").pathArray): SVGPC.pathBBox;
}
declare module "util/getSegCubicLength" {
    /**
     * Returns the C (cubic-bezier) segment length.
     *
     * @param {Number} x1 the starting point X
     * @param {Number} y1 the starting point Y
     * @param {Number} x2 the first control point X
     * @param {Number} y2 the first control point Y
     * @param {Number} x3 the second control point X
     * @param {Number} y3 the second control point Y
     * @param {Number} x4 the ending point X
     * @param {Number} y4 the ending point Y
     * @param {Number} z a [0-1] ratio
     * @returns {Number} the cubic-bezier segment length
     */
    export default function getSegCubicLength(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, z: number): number;
}
declare module "util/getPathLength" {
    /**
     * Returns the shape total length,
     * or the equivalent to `shape.getTotalLength()`
     * pathToCurve version
     *
     * @param {SVGPC.pathArray} path the ending point Y
     * @returns {Number} the shape total length
     */
    export default function getPathLength(path: import("../types/types").pathArray): number;
}
declare module "util/getDrawDirection" {
    /**
     * Check if a path is drawn clockwise and returns true if so,
     * false otherwise.
     *
     * @param {string | SVGPC.pathArray} path the path string or `pathArray`
     * @returns {boolean} true when clockwise or false if not
     */
    export default function getDrawDirection(path: string | import("../types/types").pathArray): boolean;
}
declare module "util/getPointAtLength" {
    /**
     * Returns [x,y] coordinates of a point at a given length of a shape.
     *
     * @param {string | SVGPC.pathArray} path the `pathArray` to look into
     * @param {Number} length the length of the shape to look at
     * @returns {Number[]} the requested [x,y] coordinates
     */
    export default function getPointAtLength(path: string | import("../types/types").pathArray, length: number): number[];
}
declare module "util/getCubicSize" {
    /**
     * Returns the cubic-bezier segment length.
     *
     * @param {number} p1x the starting point X
     * @param {number} p1y the starting point Y
     * @param {number} c1x the first control point X
     * @param {number} c1y the first control point Y
     * @param {number} c2x the second control point X
     * @param {number} c2y the second control point Y
     * @param {number} p2x the ending point X
     * @param {number} p2y the ending point Y
     * @returns {SVGPC.segmentLimits} the length of the cubic-bezier segment
     */
    export default function getCubicSize(p1x: number, p1y: number, c1x: number, c1y: number, c2x: number, c2y: number, p2x: number, p2y: number): SVGPC.segmentLimits;
}
declare module "util/getPathBBox" {
    /**
     * Returns the bounding box of a shape.
     *
     * @param {SVGPC.pathArray} path the shape `pathArray`
     * @returns {SVGPC.pathBBox} the length of the cubic-bezier segment
     */
    export default function getPathBBox(path: import("../types/types").pathArray): SVGPC.pathBBox;
}
declare module "util/isValidPath" {
    /**
     * Parses a path string value to determine its validity
     * then returns true if it's valid or false otherwise.
     *
     * @param {string} pathString the path string to be parsed
     * @returns {boolean} the path string validity
     */
    export default function isValidPath(pathString: string): boolean;
}
declare module "util/isRelativeArray" {
    /**
     * Iterates an array to check if it's a `pathArray`
     * with relative values.
     *
     * @param {SVGPC.pathArray} path the `pathArray` to be checked
     * @returns {boolean} iteration result
     */
    export default function isRelativeArray(path: import("../types/types").pathArray): boolean;
}
declare module "process/roundPath" {
    /**
     * Rounds the values of a `pathArray` instance to
     * a specified amount of decimals and returns it.
     *
     * @param {SVGPC.pathArray} path the source `pathArray`
     * @param {Number | null} round the amount of decimals to round numbers to
     * @returns {SVGPC.pathArray} the resulted `pathArray` with rounded values
     */
    export default function roundPath(path: import("../types/types").pathArray, round: number | null): import("../types/types").pathArray;
}
declare module "convert/pathToString" {
    /**
     * Returns a valid `d` attribute string value created
     * by rounding values and concatenating the `pathArray` segments.
     *
     * @param {SVGPC.pathArray} path the `pathArray` object
     * @param {Number} round amount of decimals to round values to
     * @returns {String} the concatenated path string
     */
    export default function pathToString(path: import("../types/types").pathArray, round: number): string;
}
declare module "util/shapeToPath" {
    /**
     * Returns a new `pathArray` from line attributes.
     *
     * @param {SVGPC.lineAttr} attr shape configuration
     * @return {SVGPC.pathArray} a new line `pathArray`
     */
    export function getLinePath(attr: SVGPC.lineAttr): import("../types/types").pathArray;
    /**
     * Returns a new `pathArray` like from polyline/polygon attributes.
     *
     * @param {SVGPC.polyAttr} attr shape configuration
     * @return {SVGPC.pathArray} a new polygon/polyline `pathArray`
     */
    export function getPolyPath(attr: SVGPC.polyAttr): import("../types/types").pathArray;
    /**
     * Returns a new `pathArray` from circle/ellipse attributes.
     *
     * @param {SVGPC.ellipseAttr | SVGPC.circleAttr} attr shape configuration
     * @return {SVGPC.pathArray} a circle/ellipse `pathArray`
     */
    export function getEllipsePath(attr: SVGPC.ellipseAttr | SVGPC.circleAttr): import("../types/types").pathArray;
    /**
     * Returns a new `pathArray` like from rect attributes.
     *
     * @param {SVGPC.rectAttr} attr object with properties above
     * @return {SVGPC.pathArray} a new `pathArray` from `<rect>` attributes
     */
    export function getRectanglePath(attr: SVGPC.rectAttr): import("../types/types").pathArray;
    /**
     * Returns a new `<path>` element created from attributes of a `<line>`, `<polyline>`,
     * `<polygon>`, `<rect>`, `<ellipse>`, `<circle>` or `<glyph>`. If `replace` parameter
     * is `true`, it will replace the target.
     *
     * The newly created `<path>` element keeps all non-specific
     * attributes like `class`, `fill`, etc.
     *
     * @param {SVGPC.shapeTypes} element target shape
     * @param {boolean} replace option to replace target
     * @return {?SVGPathElement} the newly created `<path>` element
     */
    export default function shapeToPath(element: SVGPC.shapeTypes, replace: boolean): SVGPathElement | null;
}
declare module "process/splitPath" {
    /**
     * Split a path into an `Array` of sub-path strings.
     *
     * In the process, values are converted to absolute
     * for visual consistency.
     *
     * @param {Object | String} pathInput the cubic-bezier parameters
     * @return {Object} an array with all sub-path strings
     */
    export default function splitPath(pathInput: Object | string): Object;
}
declare module "convert/pathToRelative" {
    /**
     * Parses a path string value or object and returns an array
     * of segments, all converted to relative values.
     *
     * @param {string | SVGPC.pathArray} pathInput the path string | object
     * @returns {SVGPC.pathArray} the resulted `pathArray` with relative values
     */
    export default function pathToRelative(pathInput: string | import("../types/types").pathArray): import("../types/types").pathArray;
}
declare module "process/optimizePath" {
    /**
     * Optimizes a `pathArray` object:
     * * convert segments to absolute and relative values
     * * create a new `pathArray` with elements with shortest segments
     * from absolute and relative `pathArray`s
     *
     * @param {string | SVGPC.pathArray} pathInput a string or `pathArray`
     * @param {number} round the amount of decimals to round values to
     * @returns {SVGPC.pathArray} the optimized `pathArray`
     */
    export default function optimizePath(pathInput: string | import("../types/types").pathArray, round: number): import("../types/types").pathArray;
}
declare module "process/reverseCurve" {
    /**
     * Reverses all segments and their values from a `pathArray`
     * which consists of only C (cubic-bezier) path commands.
     *
     * @param {SVGPC.pathArray} path the source `pathArray`
     * @returns {SVGPC.pathArray} the reversed `pathArray`
     */
    export default function reverseCurve(path: import("../types/types").pathArray): import("../types/types").pathArray;
}
declare module "process/reversePath" {
    /**
     * Reverses all segments and their values of a `pathArray`
     * and returns a new instance.
     *
     * @param {SVGPC.pathArray} pathInput the source `pathArray`
     * @returns {SVGPC.pathArray} the reversed `pathArray`
     */
    export default function reversePath(pathInput: import("../types/types").pathArray): import("../types/types").pathArray;
}
declare module "math/epsilon" {
    export default epsilon;
    /**
     * A global namespace for epsilon.
     *
     * @type {Number}
     */
    const epsilon: number;
}
declare module "process/getSVGMatrix" {
    /**
     * Returns a transformation matrix to apply to `<path>` elements.
     *
     * @param {SVGPC.transformObject} transform the `transformObject`
     * @returns {CSSMatrix} a new transformation matrix
     */
    export default function getSVGMatrix(transform: SVGPC.transformObject): CSSMatrix;
    import CSSMatrix from "dommatrix";
}
declare module "process/transformEllipse" {
    /**
     * Apply a 2D transformation matrix to an ellipse.
     *
     * @param {number[]} m the 2D transformation matrix
     * @param {number} rx ellipse radius X
     * @param {number} ry ellipse radius Y
     * @param {number} ax ellipse rotation angle
     */
    export default function transformEllipse(m: number[], rx: number, ry: number, ax: number): {
        rx: number;
        ry: number;
        ax: number;
    };
}
declare module "process/projection2d" {
    /**
     * Returns the [x,y] projected coordinates for a given an [x,y] point
     * and an [x,y,z] perspective origin point.
     *
     * Equation found here =>
     * http://en.wikipedia.org/wiki/3D_projection#Diagram
     * Details =>
     * https://stackoverflow.com/questions/23792505/predicted-rendering-of-css-3d-transformed-pixel
     *
     * @param {number[]} m the transformation matrix
     * @param {Number[]} point2D the initial [x,y] coordinates
     * @returns {Number[]} the projected [x,y] coordinates
     */
    export default function projection2d(m: number[], point2D: number[], origin: any): number[];
}
declare module "process/transformPath" {
    /**
     * Apply a 2D / 3D transformation to a `pathArray` instance.
     *
     * Since *SVGElement* doesn't support 3D transformation, this function
     * creates a 2D projection of the <path> element.
     *
     * @param {SVGPC.pathArray} path the `pathArray` to apply transformation
     * @param {SVGPC.transformObject} transform the transform functions `Object`
     * @returns {SVGPC.pathArray} the resulted `pathArray`
     */
    export default function transformPath(path: import("../types/types").pathArray, transform: SVGPC.transformObject): import("../types/types").pathArray;
}
declare module "util/util" {
    export default Util;
    namespace Util {
        export { CSSMatrix };
        export { parsePathString };
        export { isPathArray };
        export { isCurveArray };
        export { isAbsoluteArray };
        export { isRelativeArray };
        export { isNormalizedArray };
        export { isValidPath };
        export { pathToAbsolute };
        export { pathToRelative };
        export { pathToCurve };
        export { pathToString };
        export { getDrawDirection };
        export { getPathArea };
        export { getPathBBox };
        export { getPathLength };
        export { getPointAtLength };
        export { clonePath };
        export { splitPath };
        export { roundPath };
        export { optimizePath };
        export { reverseCurve };
        export { reversePath };
        export { normalizePath };
        export { transformPath };
        export { getSVGMatrix };
        export { shapeToPath };
        export { SVGPCO as options };
    }
    import CSSMatrix from "dommatrix";
    import parsePathString from "parser/parsePathString";
    import isPathArray from "util/isPathArray";
    import isCurveArray from "util/isCurveArray";
    import isAbsoluteArray from "util/isAbsoluteArray";
    import isRelativeArray from "util/isRelativeArray";
    import isNormalizedArray from "util/isNormalizedArray";
    import isValidPath from "util/isValidPath";
    import pathToAbsolute from "convert/pathToAbsolute";
    import pathToRelative from "convert/pathToRelative";
    import pathToCurve from "convert/pathToCurve";
    import pathToString from "convert/pathToString";
    import getDrawDirection from "util/getDrawDirection";
    import getPathArea from "util/getPathArea";
    import getPathBBox from "util/getPathBBox";
    import getPathLength from "util/getPathLength";
    import getPointAtLength from "util/getPointAtLength";
    import clonePath from "process/clonePath";
    import splitPath from "process/splitPath";
    import roundPath from "process/roundPath";
    import optimizePath from "process/optimizePath";
    import reverseCurve from "process/reverseCurve";
    import reversePath from "process/reversePath";
    import normalizePath from "process/normalizePath";
    import transformPath from "process/transformPath";
    import getSVGMatrix from "process/getSVGMatrix";
    import shapeToPath from "util/shapeToPath";
    import SVGPCO from "options/options";
}
declare module "class/svg-path-commander" {
    /**
     * Creates a new SVGPathCommander instance.
     *
     * @author thednp <https://github.com/thednp/svg-path-commander>
     */
    export default class SVGPathCommander {
        /**
         * @param {string} pathValue the path string
         * @param {object} config instance options
         */
        constructor(pathValue: string, config: object);
        /** @type {number | boolean | undefined} */
        round: number | boolean | undefined;
        /** @type {SVGPC.pathArray} */
        segments: import("../types/types").pathArray;
        /** * @type {string} */
        pathValue: string;
        /**
         * Convert path to absolute values
         * @public
         */
        public toAbsolute(): SVGPathCommander;
        /**
         * Convert path to relative values
         * @public
         */
        public toRelative(): SVGPathCommander;
        /**
         * Reverse the order of the segments and their values.
         * @param {boolean | number} onlySubpath option to reverse all sub-paths except first
         * @public
         */
        public reverse(onlySubpath: boolean | number): SVGPathCommander;
        /**
         * Normalize path in 2 steps:
         * * convert `pathArray`(s) to absolute values
         * * convert shorthand notation to standard notation
         * @public
         */
        public normalize(): SVGPathCommander;
        /**
         * Optimize `pathArray` values:
         * * convert segments to absolute and/or relative values
         * * select segments with shortest resulted string
         * * round values to the specified `decimals` option value
         * @public
         */
        public optimize(): SVGPathCommander;
        /**
         * Transform path using values from an `Object` defined as `transformObject`.
         * @see SVGPC.transformObject for a quick refference
         *
         * @param {SVGPC.transformObject} source a `transformObject`as described above
         * @public
         */
        public transform(source: SVGPC.transformObject): SVGPathCommander;
        /**
         * Rotate path 180deg horizontally
         * @public
         */
        public flipX(): SVGPathCommander;
        /**
         * Rotate path 180deg vertically
         * @public
         */
        public flipY(): SVGPathCommander;
        /**
         * Export the current path to be used
         * for the `d` (description) attribute.
         * @public
         * @return {String} the path string
         */
        public toString(): string;
    }
}
declare module "index" {
    export default SVGPathCommander;
    /**
     * shows types in src/ sources
     */
    export type SVGPC = typeof import("../types/types");
    import SVGPathCommander from "class/svg-path-commander";
}
declare module "math/distanceSquareRoot" {
    /**
     * Returns the square root of the distance
     * between two given points.
     *
     * @param {Number[][]} a the first point coordinates
     * @param {Number[][]} b the second point coordinates
     * @returns {Number} the distance value
     */
    export default function distanceSquareRoot(a: number[][], b: number[][]): number;
}
declare module "math/polygonArea" {
    /**
     * d3-polygon-area
     * https://github.com/d3/d3-polygon
     *
     * Returns the area of a polygon.
     *
     * @param {Number[][]} polygon an array of coordinates
     * @returns {Number} the polygon area
     */
    export default function polygonArea(polygon: number[][]): number;
}
declare module "math/polygonLength" {
    /**
     * d3-polygon-length
     * https://github.com/d3/d3-polygon
     *
     * Returns the perimeter of a polygon.
     *
     * @param {Number[][]} polygon an array of coordinates
     * @returns {Number} the polygon length
     */
    export default function polygonLength(polygon: number[][]): number;
}
declare module "process/splitCubic" {
    /**
     * Split a cubic-bezier segment into two.
     *
     * @param {Number[]} pts the cubic-bezier parameters
     * @return {Object} two new cubic-bezier segments
     */
    export default function splitCubic(pts: number[]): Object;
}
declare module "util/createPath" {
    /**
     * Returns a new `<path>` from a `<glyph>` element, only using its `d` attribute,
     * all other attributes are ignored.
     *
     * If `pathInput` is a valid path string, will create a `<path>` and return it.
     *
     * @deprecated use shapeToPath
     * @see shapeToPath a new and more flexible utility
     *
     * @param {SVGElement | String} pathInput a `<glyph>` element or path string
     * @returns {SVGPathElement} a new `<path>` element
     */
    export default function createPath(pathInput: SVGElement | string): SVGPathElement;
}
declare module "util/getSegArcLength" {
    /**
     * Returns the A (arc-to) segment length.
     *
     * @param {Number[]} arguments the arc-to coordinates
     * @returns {Number} the arc-to segment length
     */
    export default function getSegArcLength(...args: any[]): number;
}
declare module "util/getSegLineLength" {
    /**
     * Returns the L (line-to) segment length.
     *
     * @param {Number} ax the starting point X
     * @param {Number} ay the starting point Y
     * @param {Number} bx the ending point X
     * @param {Number} by the ending point Y
     * @returns {Number} the line-to segment length
     */
    export default function getSegLineLength(ax: number, ay: number, bx: number, by: number): number;
}
declare module "util/getSegQuadLength" {
    /**
     * Returns the Q (quadratic-bezier) segment length.
     * https://gist.github.com/tunght13488/6744e77c242cc7a94859#gistcomment-2047251
     *
     * @param {Number} x1 the starting point X
     * @param {Number} y1 the starting point Y
     * @param {Number} qx the control point X
     * @param {Number} qy the control point Y
     * @param {Number} x2 the ending point X
     * @param {Number} y2 the ending point Y
     * @param {Number} z a [0-1] ratio
     * @returns {Number} the quadratic-bezier segment length
     */
    export default function getSegQuadLength(x1: number, y1: number, qx: number, qy: number, x2: number, y2: number): number;
}
