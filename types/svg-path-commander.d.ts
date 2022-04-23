declare module "svg-path-commander/src/parser/paramsCount" {
    export default paramsCount;
    /**
     * Segment params length
     * @type {Record<string, number>}
     */
    const paramsCount: Record<string, number>;
}
declare module "svg-path-commander/src/parser/finalizeSegment" {
    /**
     * Breaks the parsing of a pathString once a segment is finalized.
     *
     * @param {SVGPath.PathParser} path the `PathParser` instance
     */
    export default function finalizeSegment(path: SVGPath.PathParser): void;
}
declare module "svg-path-commander/src/parser/error" {
    export default error;
    const error: "SVGPathCommander error";
}
declare module "svg-path-commander/src/parser/scanFlag" {
    /**
     * Validates an A (arc-to) specific path command value.
     * Usually a `large-arc-flag` or `sweep-flag`.
     *
     * @param {SVGPath.PathParser} path the `PathParser` instance
     */
    export default function scanFlag(path: SVGPath.PathParser): void;
}
declare module "svg-path-commander/src/parser/isDigit" {
    /**
     * Checks if a character is a digit.
     *
     * @param {number} code the character to check
     * @returns {boolean} check result
     */
    export default function isDigit(code: number): boolean;
}
declare module "svg-path-commander/src/parser/invalidPathValue" {
    export default invalidPathValue;
    const invalidPathValue: "Invalid path value";
}
declare module "svg-path-commander/src/parser/scanParam" {
    /**
     * Validates every character of the path string,
     * every path command, negative numbers or floating point numbers.
     *
     * @param {SVGPath.PathParser} path the `PathParser` instance
     */
    export default function scanParam(path: SVGPath.PathParser): void;
}
declare module "svg-path-commander/src/parser/isSpace" {
    /**
     * Checks if the character is a space.
     *
     * @param {number} ch the character to check
     * @returns {boolean} check result
     */
    export default function isSpace(ch: number): boolean;
}
declare module "svg-path-commander/src/parser/skipSpaces" {
    /**
     * Points the parser to the next character in the
     * path string every time it encounters any kind of
     * space character.
     *
     * @param {SVGPath.PathParser} path the `PathParser` instance
     */
    export default function skipSpaces(path: SVGPath.PathParser): void;
}
declare module "svg-path-commander/src/parser/isPathCommand" {
    /**
     * Checks if the character is a path command.
     *
     * @param {any} code the character to check
     * @returns {boolean} check result
     */
    export default function isPathCommand(code: any): boolean;
}
declare module "svg-path-commander/src/parser/isDigitStart" {
    /**
     * Checks if the character is or belongs to a number.
     * [0-9]|+|-|.
     *
     * @param {number} code the character to check
     * @returns {boolean} check result
     */
    export default function isDigitStart(code: number): boolean;
}
declare module "svg-path-commander/src/parser/isArcCommand" {
    /**
     * Checks if the character is an A (arc-to) path command.
     *
     * @param {number} code the character to check
     * @returns {boolean} check result
     */
    export default function isArcCommand(code: number): boolean;
}
declare module "svg-path-commander/src/parser/scanSegment" {
    /**
     * Scans every character in the path string to determine
     * where a segment starts and where it ends.
     *
     * @param {SVGPath.PathParser} path the `PathParser` instance
     */
    export default function scanSegment(path: SVGPath.PathParser): void;
}
declare module "svg-path-commander/src/process/clonePath" {
    /**
     * Returns a clone of an existing `pathArray`.
     *
     * @param {SVGPath.pathArray | SVGPath.pathSegment} path the source `pathArray`
     * @returns {any} the cloned `pathArray`
     */
    export default function clonePath(path: SVGPath.pathArray | SVGPath.pathSegment): any;
}
declare module "svg-path-commander/src/parser/pathParser" {
    /**
     * The `PathParser` is used by the `parsePathString` static method
     * to generate a `pathArray`.
     *
     * @param {string} pathString
     */
    export default function PathParser(pathString: string): void;
    export default class PathParser {
        /**
         * The `PathParser` is used by the `parsePathString` static method
         * to generate a `pathArray`.
         *
         * @param {string} pathString
         */
        constructor(pathString: string);
        /** @type {SVGPath.pathArray} */
        segments: SVGPath.pathArray;
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
declare module "svg-path-commander/src/util/isPathArray" {
    /**
     * Iterates an array to check if it's an actual `pathArray`.
     *
     * @param {string | SVGPath.pathArray} path the `pathArray` to be checked
     * @returns {boolean} iteration result
     */
    export default function isPathArray(path: string | SVGPath.pathArray): boolean;
}
declare module "svg-path-commander/src/parser/parsePathString" {
    /**
     * Parses a path string value and returns an array
     * of segments we like to call `pathArray`.
     *
     * @param {SVGPath.pathArray | string} pathInput the string to be parsed
     * @returns {SVGPath.pathArray | string} the resulted `pathArray`
     */
    export default function parsePathString(pathInput: SVGPath.pathArray | string): SVGPath.pathArray | string;
}
declare module "svg-path-commander/src/util/isAbsoluteArray" {
    /**
     * Iterates an array to check if it's a `pathArray`
     * with all absolute values.
     *
     * @param {string | SVGPath.pathArray} path the `pathArray` to be checked
     * @returns {boolean} iteration result
     */
    export default function isAbsoluteArray(path: string | SVGPath.pathArray): boolean;
}
declare module "svg-path-commander/src/convert/pathToAbsolute" {
    /**
     * Parses a path string value or object and returns an array
     * of segments, all converted to absolute values.
     *
     * @param {string | SVGPath.pathArray} pathInput the path string | object
     * @returns {SVGPath.absoluteArray} the resulted `pathArray` with absolute values
     */
    export default function pathToAbsolute(pathInput: string | SVGPath.pathArray): SVGPath.absoluteArray;
}
declare module "svg-path-commander/src/util/isRelativeArray" {
    /**
     * Iterates an array to check if it's a `pathArray`
     * with relative values.
     *
     * @param {string | SVGPath.pathArray} path the `pathArray` to be checked
     * @returns {boolean} iteration result
     */
    export default function isRelativeArray(path: string | SVGPath.pathArray): boolean;
}
declare module "svg-path-commander/src/convert/pathToRelative" {
    /**
     * Parses a path string value or object and returns an array
     * of segments, all converted to relative values.
     *
     * @param {string | SVGPath.pathArray} pathInput the path string | object
     * @returns {SVGPath.relativeArray} the resulted `pathArray` with relative values
     */
    export default function pathToRelative(pathInput: string | SVGPath.pathArray): SVGPath.relativeArray;
}
declare module "svg-path-commander/src/process/fixArc" {
    /**
     * Splits an extended A (arc-to) segment into two cubic-bezier segments.
     *
     * @param {SVGPath.pathArray} path the `pathArray` this segment belongs to
     * @param {string[]} allPathCommands all previous path commands
     * @param {number} i the segment index
     */
    export default function fixArc(path: SVGPath.pathArray, allPathCommands: string[], i: number): void;
}
declare module "svg-path-commander/src/process/shorthandToQuad" {
    /**
     * Returns the missing control point from an
     * T (shorthand quadratic bezier) segment.
     *
     * @param {number} x1 curve start x
     * @param {number} y1 curve start y
     * @param {number} qx control point x
     * @param {number} qy control point y
     * @param {string} prevCommand the previous path command
     * @returns {{qx: number, qy: number}}} the missing control point
     */
    export default function shorthandToQuad(x1: number, y1: number, qx: number, qy: number, prevCommand: string): {
        qx: number;
        qy: number;
    };
}
declare module "svg-path-commander/src/process/shorthandToCubic" {
    /**
     * Returns the missing control point from an
     * S (shorthand cubic bezier) segment.
     *
     * @param {number} x1 curve start x
     * @param {number} y1 curve start y
     * @param {number} x2 curve end x
     * @param {number} y2 curve end y
     * @param {string} prevCommand the previous path command
     * @returns {{x1: number, y1: number}}} the missing control point
     */
    export default function shorthandToCubic(x1: number, y1: number, x2: number, y2: number, prevCommand: string): {
        x1: number;
        y1: number;
    };
}
declare module "svg-path-commander/src/process/normalizeSegment" {
    /**
     * Normalizes a single segment of a `pathArray` object.
     *
     * @param {SVGPath.pathSegment} segment the segment object
     * @param {any} params the coordinates of the previous segment
     * @param {string} prevCommand the path command of the previous segment
     * @returns {SVGPath.normalSegment} the normalized segment
     */
    export default function normalizeSegment(segment: SVGPath.pathSegment, params: any, prevCommand: string): SVGPath.normalSegment;
}
declare module "svg-path-commander/src/util/isNormalizedArray" {
    /**
     * Iterates an array to check if it's a `pathArray`
     * with all segments are in non-shorthand notation
     * with absolute values.
     *
     * @param {string | SVGPath.pathArray} path the `pathArray` to be checked
     * @returns {boolean} iteration result
     */
    export default function isNormalizedArray(path: string | SVGPath.pathArray): boolean;
}
declare module "svg-path-commander/src/parser/paramsParser" {
    export default paramsParser;
    /**
     * @type {SVGPath.parserParams}
     */
    const paramsParser: SVGPath.parserParams;
}
declare module "svg-path-commander/src/process/normalizePath" {
    /**
     * Normalizes a `path` object for further processing:
     * * convert segments to absolute values
     * * convert shorthand path commands to their non-shorthand notation
     *
     * @param {string | SVGPath.pathArray} pathInput the string to be parsed or 'pathArray'
     * @returns {SVGPath.normalArray} the normalized `pathArray`
     */
    export default function normalizePath(pathInput: string | SVGPath.pathArray): SVGPath.normalArray;
}
declare module "svg-path-commander/src/process/fixPath" {
    /**
     * Checks a `pathArray` for an unnecessary `Z` segment
     * and returns a new `pathArray` without it.
     *
     * The `pathInput` must be a single path, without
     * sub-paths. For multi-path `<path>` elements,
     * use `splitPath` first and apply this utility on each
     * sub-path separately.
     *
     * @param {SVGPath.pathArray | string} pathInput the `pathArray` source
     * @return {SVGPath.pathArray} a fixed `pathArray`
     */
    export default function fixPath(pathInput: SVGPath.pathArray | string): SVGPath.pathArray;
}
declare module "svg-path-commander/src/util/isCurveArray" {
    /**
     * Iterates an array to check if it's a `pathArray`
     * with all C (cubic bezier) segments.
     *
     * @param {string | SVGPath.pathArray} path the `Array` to be checked
     * @returns {boolean} iteration result
     */
    export default function isCurveArray(path: string | SVGPath.pathArray): boolean;
}
declare module "svg-path-commander/src/math/rotateVector" {
    /**
     * Returns an {x,y} vector rotated by a given
     * angle in radian.
     *
     * @param {number} x the initial vector x
     * @param {number} y the initial vector y
     * @param {number} rad the radian vector angle
     * @returns {{x: number, y: number}} the rotated vector
     */
    export default function rotateVector(x: number, y: number, rad: number): {
        x: number;
        y: number;
    };
}
declare module "svg-path-commander/src/process/arcToCubic" {
    /**
     * Converts A (arc-to) segments to C (cubic-bezier-to).
     *
     * For more information of where this math came from visit:
     * http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
     *
     * @param {number} X1 the starting x position
     * @param {number} Y1 the starting y position
     * @param {number} RX x-radius of the arc
     * @param {number} RY y-radius of the arc
     * @param {number} angle x-axis-rotation of the arc
     * @param {number} LAF large-arc-flag of the arc
     * @param {number} SF sweep-flag of the arc
     * @param {number} X2 the ending x position
     * @param {number} Y2 the ending y position
     * @param {number[]=} recursive the parameters needed to split arc into 2 segments
     * @return {number[]} the resulting cubic-bezier segment(s)
     */
    export default function arcToCubic(X1: number, Y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, X2: number, Y2: number, recursive?: number[] | undefined): number[];
}
declare module "svg-path-commander/src/process/quadToCubic" {
    /**
     * Converts a Q (quadratic-bezier) segment to C (cubic-bezier).
     *
     * @param {number} x1 curve start x
     * @param {number} y1 curve start y
     * @param {number} qx control point x
     * @param {number} qy control point y
     * @param {number} x2 curve end x
     * @param {number} y2 curve end y
     * @returns {number[]} the cubic-bezier segment
     */
    export default function quadToCubic(x1: number, y1: number, qx: number, qy: number, x2: number, y2: number): number[];
}
declare module "svg-path-commander/src/math/midPoint" {
    /**
     * Returns the coordinates of a specified distance
     * ratio between two points.
     *
     * @param {[number, number]} a the first point coordinates
     * @param {[number, number]} b the second point coordinates
     * @param {number} t the ratio
     * @returns {[number, number]} the midpoint coordinates
     */
    export default function midPoint(a: [number, number], b: [number, number], t: number): [number, number];
}
declare module "svg-path-commander/src/math/distanceSquareRoot" {
    /**
     * Returns the square root of the distance
     * between two given points.
     *
     * @param {[number, number]} a the first point coordinates
     * @param {[number, number]} b the second point coordinates
     * @returns {number} the distance value
     */
    export default function distanceSquareRoot(a: [number, number], b: [number, number]): number;
}
declare module "svg-path-commander/src/util/segmentLineFactory" {
    /**
     * Returns a {x,y} point at a given length, the total length and
     * the minimum and maximum {x,y} coordinates of a line (L,V,H,Z) segment.
     *
     * @param {number} x1 the starting point X
     * @param {number} y1 the starting point Y
     * @param {number} x2 the ending point X
     * @param {number} y2 the ending point Y
     * @param {number=} distance the distance to point
     * @returns {SVGPath.lengthFactory} the segment length, point, min & max
     */
    export default function segmentLineFactory(x1: number, y1: number, x2: number, y2: number, distance?: number | undefined): SVGPath.lengthFactory;
}
declare module "svg-path-commander/src/process/lineToCubic" {
    /**
     * Converts an L (line-to) segment to C (cubic-bezier).
     *
     * @param {number} x1 line start x
     * @param {number} y1 line start y
     * @param {number} x2 line end x
     * @param {number} y2 line end y
     * @returns {number[]} the cubic-bezier segment
     */
    export default function lineToCubic(x1: number, y1: number, x2: number, y2: number): number[];
}
declare module "svg-path-commander/src/process/segmentToCubic" {
    /**
     * Converts any segment to C (cubic-bezier).
     *
     * @param {SVGPath.pathSegment} segment the source segment
     * @param {SVGPath.parserParams} params the source segment parameters
     * @returns {SVGPath.cubicSegment | SVGPath.MSegment} the cubic-bezier segment
     */
    export default function segmentToCubic(segment: SVGPath.pathSegment, params: SVGPath.parserParams): SVGPath.cubicSegment | SVGPath.MSegment;
}
declare module "svg-path-commander/src/convert/pathToCurve" {
    /**
     * Parses a path string value or 'pathArray' and returns a new one
     * in which all segments are converted to cubic-bezier.
     *
     * In addition, un-necessary `Z` segment is removed if previous segment
     * extends to the `M` segment.
     *
     * @param {string | SVGPath.pathArray} pathInput the string to be parsed or 'pathArray'
     * @returns {SVGPath.curveArray} the resulted `pathArray` converted to cubic-bezier
     */
    export default function pathToCurve(pathInput: string | SVGPath.pathArray): SVGPath.curveArray;
}
declare module "svg-path-commander/src/options/options" {
    export default defaultOptions;
    /**
     * SVGPathCommander default options
     * @type {SVGPath.options}
     */
    const defaultOptions: SVGPath.options;
}
declare module "svg-path-commander/src/process/roundPath" {
    /**
     * Rounds the values of a `pathArray` instance to
     * a specified amount of decimals and returns it.
     *
     * @param {SVGPath.pathArray} path the source `pathArray`
     * @param {number | 'off'} roundOption the amount of decimals to round numbers to
     * @returns {SVGPath.pathArray} the resulted `pathArray` with rounded values
     */
    export default function roundPath(path: SVGPath.pathArray, roundOption: number | 'off'): SVGPath.pathArray;
}
declare module "svg-path-commander/src/convert/pathToString" {
    /**
     * Returns a valid `d` attribute string value created
     * by rounding values and concatenating the `pathArray` segments.
     *
     * @param {SVGPath.pathArray} path the `pathArray` object
     * @param {number | 'off'} round amount of decimals to round values to
     * @returns {string} the concatenated path string
     */
    export default function pathToString(path: SVGPath.pathArray, round: number | 'off'): string;
}
declare module "svg-path-commander/src/math/epsilon" {
    export default epsilon;
    /**
     * A global namespace for epsilon.
     *
     * @type {number}
     */
    const epsilon: number;
}
declare module "svg-path-commander/src/math/polygonArea" {
    /**
     * d3-polygon-area
     * https://github.com/d3/d3-polygon
     *
     * Returns the area of a polygon.
     *
     * @param {number[][]} polygon an array of coordinates
     * @returns {number} the polygon area
     */
    export default function polygonArea(polygon: number[][]): number;
}
declare module "svg-path-commander/src/math/polygonLength" {
    /**
     * d3-polygon-length
     * https://github.com/d3/d3-polygon
     *
     * Returns the perimeter of a polygon.
     *
     * @param {[number,number][]} polygon an array of coordinates
     * @returns {number} the polygon length
     */
    export default function polygonLength(polygon: [number, number][]): number;
}
declare module "svg-path-commander/src/process/getSVGMatrix" {
    /**
     * Returns a transformation matrix to apply to `<path>` elements.
     *
     * @see SVGPath.transformObject
     *
     * @param {SVGPath.transformObject} transform the `transformObject`
     * @returns {CSSMatrix} a new transformation matrix
     */
    export default function getSVGMatrix(transform: SVGPath.transformObject): CSSMatrix;
    import CSSMatrix from "dommatrix";
}
declare module "svg-path-commander/src/process/shortenSegment" {
    /**
     * Shorten a single segment of a `pathArray` object.
     *
     * @param {SVGPath.absoluteSegment} segment the `absoluteSegment` object
     * @param {SVGPath.normalSegment} normalSegment the `normalSegment` object
     * @param {any} params the coordinates of the previous segment
     * @param {string} prevCommand the path command of the previous segment
     * @returns {SVGPath.shortSegment | SVGPath.pathSegment} the shortened segment
     */
    export default function shortenSegment(segment: SVGPath.absoluteSegment, normalSegment: SVGPath.normalSegment, params: any, prevCommand: string): SVGPath.shortSegment | SVGPath.pathSegment;
}
declare module "svg-path-commander/src/process/optimizePath" {
    /**
     * Optimizes a `pathArray` object:
     * * convert segments to shorthand if possible
     * * select shortest segments from absolute and relative `pathArray`s
     *
     * TO DO
     * * implement `auto` for rounding values based on pathBBox
     * * also revers path check if it's smaller string, maybe?
     *
     * @param {SVGPath.pathArray} pathInput a string or `pathArray`
     * @param {number | 'off'} round the amount of decimals to round values to
     * @returns {SVGPath.pathArray} the optimized `pathArray`
     */
    export default function optimizePath(pathInput: SVGPath.pathArray, round: number | 'off'): SVGPath.pathArray;
}
declare module "svg-path-commander/src/process/projection2d" {
    /**
     * Returns the [x,y] projected coordinates for a given an [x,y] point
     * and an [x,y,z] perspective origin point.
     *
     * Equation found here =>
     * http://en.wikipedia.org/wiki/3D_projection#Diagram
     * Details =>
     * https://stackoverflow.com/questions/23792505/predicted-rendering-of-css-3d-transformed-pixel
     *
     * @param {SVGPath.CSSMatrix} m the transformation matrix
     * @param {[number, number]} point2D the initial [x,y] coordinates
     * @param {number[]} origin the [x,y,z] transform origin
     * @returns {[number, number]} the projected [x,y] coordinates
     */
    export default function projection2d(m: SVGPath.CSSMatrix, point2D: [number, number], origin: number[]): [number, number];
}
declare module "svg-path-commander/src/process/reverseCurve" {
    /**
     * Reverses all segments of a `pathArray`
     * which consists of only C (cubic-bezier) path commands.
     *
     * @param {SVGPath.curveArray} path the source `pathArray`
     * @returns {SVGPath.curveArray} the reversed `pathArray`
     */
    export default function reverseCurve(path: SVGPath.curveArray): SVGPath.curveArray;
}
declare module "svg-path-commander/src/process/reversePath" {
    /**
     * Reverses all segments of a `pathArray` and returns a new `pathArray` instance.
     *
     * @param {SVGPath.pathArray} pathInput the source `pathArray`
     * @returns {SVGPath.pathArray} the reversed `pathArray`
     */
    export default function reversePath(pathInput: SVGPath.pathArray): SVGPath.pathArray;
}
declare module "svg-path-commander/src/process/splitCubic" {
    /**
     * Split a cubic-bezier segment into two.
     *
     * @param {number[]} pts the cubic-bezier parameters
     * @return {SVGPath.cubicSegment[]} two new cubic-bezier segments
     */
    export default function splitCubic(pts: number[]): SVGPath.cubicSegment[];
}
declare module "svg-path-commander/src/process/splitPath" {
    /**
     * Split a path into an `Array` of sub-path strings.
     *
     * In the process, values are converted to absolute
     * for visual consistency.
     *
     * @param {SVGPath.pathArray} pathInput the source `pathArray`
     * @return {SVGPath.pathArray[]} an array with all sub-path strings
     */
    export default function splitPath(pathInput: SVGPath.pathArray): SVGPath.pathArray[];
}
declare module "svg-path-commander/src/process/transformEllipse" {
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
declare module "svg-path-commander/src/process/transformPath" {
    /**
     * Apply a 2D / 3D transformation to a `pathArray` instance.
     *
     * Since *SVGElement* doesn't support 3D transformation, this function
     * creates a 2D projection of the <path> element.
     *
     * @param {SVGPath.pathArray} path the `pathArray` to apply transformation
     * @param {SVGPath.transformObject} transform the transform functions `Object`
     * @returns {SVGPath.pathArray} the resulted `pathArray`
     */
    export default function transformPath(path: SVGPath.pathArray, transform: SVGPath.transformObject): SVGPath.pathArray;
}
declare module "svg-path-commander/src/util/getPathArea" {
    /**
     * Returns the area of a shape.
     * @author Jürg Lehni & Jonathan Puckey
     *
     * @see https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
     *
     * @param {SVGPath.pathArray} path the shape `pathArray`
     * @returns {number} the length of the cubic-bezier segment
     */
    export default function getPathArea(path: SVGPath.pathArray): number;
}
declare module "svg-path-commander/src/util/getDrawDirection" {
    /**
     * Check if a path is drawn clockwise and returns true if so,
     * false otherwise.
     *
     * @param {SVGPath.pathArray} path the path string or `pathArray`
     * @returns {boolean} true when clockwise or false if not
     */
    export default function getDrawDirection(path: SVGPath.pathArray): boolean;
}
declare module "svg-path-commander/src/util/segmentCubicFactory" {
    /**
     * Returns the length of a C (cubic-bezier) segment
     * or an {x,y} point at a given length.
     *
     * @param {number} x1 the starting point X
     * @param {number} y1 the starting point Y
     * @param {number} c1x the first control point X
     * @param {number} c1y the first control point Y
     * @param {number} c2x the second control point X
     * @param {number} c2y the second control point Y
     * @param {number} x2 the ending point X
     * @param {number} y2 the ending point Y
     * @param {number=} distance the point distance
     * @returns {SVGPath.lengthFactory} the segment length, point, min & max
     */
    export default function segmentCubicFactory(x1: number, y1: number, c1x: number, c1y: number, c2x: number, c2y: number, x2: number, y2: number, distance?: number | undefined): SVGPath.lengthFactory;
}
declare module "svg-path-commander/src/util/segmentArcFactory" {
    /**
     * Returns a {x,y} point at a given length, the total length and
     * the shape minimum and maximum {x,y} coordinates of an A (arc-to) segment.
     *
     * @param {number} X1 the starting x position
     * @param {number} Y1 the starting y position
     * @param {number} RX x-radius of the arc
     * @param {number} RY y-radius of the arc
     * @param {number} angle x-axis-rotation of the arc
     * @param {number} LAF large-arc-flag of the arc
     * @param {number} SF sweep-flag of the arc
     * @param {number} X2 the ending x position
     * @param {number} Y2 the ending y position
     * @param {number} distance the point distance
     * @returns {SVGPath.lengthFactory} the segment length, point, min & max
     */
    export default function segmentArcFactory(X1: number, Y1: number, RX: number, RY: number, angle: number, LAF: number, SF: number, X2: number, Y2: number, distance: number): SVGPath.lengthFactory;
}
declare module "svg-path-commander/src/util/segmentQuadFactory" {
    /**
     * Returns a {x,y} point at a given length, the total length and
     * the minimum and maximum {x,y} coordinates of a Q (quadratic-bezier) segment.
     *
     * @param {number} x1 the starting point X
     * @param {number} y1 the starting point Y
     * @param {number} qx the control point X
     * @param {number} qy the control point Y
     * @param {number} x2 the ending point X
     * @param {number} y2 the ending point Y
     * @param {number=} distance the distance to point
     * @returns {SVGPath.lengthFactory} the segment length, point, min & max
     */
    export default function segmentQuadFactory(x1: number, y1: number, qx: number, qy: number, x2: number, y2: number, distance?: number | undefined): SVGPath.lengthFactory;
}
declare module "svg-path-commander/src/util/pathLengthFactory" {
    /**
     * Returns a {x,y} point at a given length
     * of a shape, the shape total length and
     * the shape minimum and maximum {x,y} coordinates.
     *
     * @param {string | SVGPath.pathArray} pathInput the `pathArray` to look into
     * @param {number=} distance the length of the shape to look at
     * @returns {SVGPath.lengthFactory} the path length, point, min & max
     */
    export default function pathLengthFactory(pathInput: string | SVGPath.pathArray, distance?: number | undefined): SVGPath.lengthFactory;
}
declare module "svg-path-commander/src/util/getPathBBox" {
    /**
     * Returns the bounding box of a shape.
     *
     * @param {SVGPath.pathArray=} path the shape `pathArray`
     * @returns {SVGPath.pathBBox} the length of the cubic-bezier segment
     */
    export default function getPathBBox(path?: SVGPath.pathArray | undefined): SVGPath.pathBBox;
}
declare module "svg-path-commander/src/util/getTotalLength" {
    /**
     * Returns the shape total length, or the equivalent to `shape.getTotalLength()`.
     *
     * The `normalizePath` version is lighter, faster, more efficient and more accurate
     * with paths that are not `curveArray`.
     *
     * @param {string | SVGPath.pathArray} pathInput the target `pathArray`
     * @returns {number} the shape total length
     */
    export default function getTotalLength(pathInput: string | SVGPath.pathArray): number;
}
declare module "svg-path-commander/src/util/getPointAtLength" {
    /**
     * Returns [x,y] coordinates of a point at a given length of a shape.
     *
     * @param {string | SVGPath.pathArray} pathInput the `pathArray` to look into
     * @param {number} distance the length of the shape to look at
     * @returns {{x: number, y: number}} the requested {x, y} point coordinates
     */
    export default function getPointAtLength(pathInput: string | SVGPath.pathArray, distance: number): {
        x: number;
        y: number;
    };
}
declare module "svg-path-commander/src/util/getPropertiesAtLength" {
    /**
     * Returns the segment, its index and length as well as
     * the length to that segment at a given length in a path.
     *
     * @param {string | SVGPath.pathArray} pathInput target `pathArray`
     * @param {number=} distance the given length
     * @returns {SVGPath.segmentProperties=} the requested properties
     */
    export default function getPropertiesAtLength(pathInput: string | SVGPath.pathArray, distance?: number | undefined): SVGPath.segmentProperties | undefined;
}
declare module "svg-path-commander/src/util/getPropertiesAtPoint" {
    /**
     * Returns the point and segment in path closest to a given point as well as
     * the distance to the path stroke.
     * @see https://bl.ocks.org/mbostock/8027637
     *
     * @param {string | SVGPath.pathArray} pathInput target `pathArray`
     * @param {{x: number, y: number}} point the given point
     * @returns {SVGPath.pointProperties} the requested properties
     */
    export default function getPropertiesAtPoint(pathInput: string | SVGPath.pathArray, point: {
        x: number;
        y: number;
    }): SVGPath.pointProperties;
}
declare module "svg-path-commander/src/util/getClosestPoint" {
    /**
     * Returns the point in path closest to a given point.
     *
     * @param {string | SVGPath.pathArray} pathInput target `pathArray`
     * @param {{x: number, y: number}} point the given point
     * @returns {{x: number, y: number}} the best match
     */
    export default function getClosestPoint(pathInput: string | SVGPath.pathArray, point: {
        x: number;
        y: number;
    }): {
        x: number;
        y: number;
    };
}
declare module "svg-path-commander/src/util/getSegmentAtLength" {
    /**
     * Returns the segment at a given length.
     * @param {string | SVGPath.pathArray} pathInput the target `pathArray`
     * @param {number} distance the distance in path to look at
     * @returns {SVGPath.pathSegment?} the requested segment
     */
    export default function getSegmentAtLength(pathInput: string | SVGPath.pathArray, distance: number): SVGPath.pathSegment | null;
}
declare module "svg-path-commander/src/util/getSegmentOfPoint" {
    /**
     * Returns the path segment which contains a given point.
     *
     * @param {string | SVGPath.pathArray} path the `pathArray` to look into
     * @param {{x: number, y: number}} point the point of the shape to look for
     * @returns {SVGPath.pathSegment?} the requested segment
     */
    export default function getSegmentOfPoint(path: string | SVGPath.pathArray, point: {
        x: number;
        y: number;
    }): SVGPath.pathSegment | null;
}
declare module "svg-path-commander/src/util/isPointInStroke" {
    /**
     * Checks if a given point is in the stroke of a path.
     *
     * @param {string | SVGPath.pathArray} pathInput target path
     * @param {{x: number, y: number}} point the given `{x,y}` point
     * @returns {boolean} the query result
     */
    export default function isPointInStroke(pathInput: string | SVGPath.pathArray, point: {
        x: number;
        y: number;
    }): boolean;
}
declare module "svg-path-commander/src/util/isValidPath" {
    /**
     * Parses a path string value to determine its validity
     * then returns true if it's valid or false otherwise.
     *
     * @param {string} pathString the path string to be parsed
     * @returns {boolean} the path string validity
     */
    export default function isValidPath(pathString: string): boolean;
}
declare module "svg-path-commander/src/util/shapeToPath" {
    /**
     * Returns a new `pathArray` from line attributes.
     *
     * @param {SVGPath.lineAttr} attr shape configuration
     * @returns {SVGPath.pathArray} a new line `pathArray`
     */
    export function getLinePath(attr: SVGPath.lineAttr): SVGPath.pathArray;
    /**
     * Returns a new `pathArray` like from polyline/polygon attributes.
     *
     * @param {SVGPath.polyAttr} attr shape configuration
     * @return {SVGPath.pathArray} a new polygon/polyline `pathArray`
     */
    export function getPolyPath(attr: SVGPath.polyAttr): SVGPath.pathArray;
    /**
     * Returns a new `pathArray` from circle attributes.
     *
     * @param {SVGPath.circleAttr} attr shape configuration
     * @return {SVGPath.pathArray} a circle `pathArray`
     */
    export function getCirclePath(attr: SVGPath.circleAttr): SVGPath.pathArray;
    /**
     * Returns a new `pathArray` from ellipse attributes.
     *
     * @param {SVGPath.ellipseAttr} attr shape configuration
     * @return {SVGPath.pathArray} an ellipse `pathArray`
     */
    export function getEllipsePath(attr: SVGPath.ellipseAttr): SVGPath.pathArray;
    /**
     * Returns a new `pathArray` like from rect attributes.
     *
     * @param {SVGPath.rectAttr} attr object with properties above
     * @return {SVGPath.pathArray} a new `pathArray` from `<rect>` attributes
     */
    export function getRectanglePath(attr: SVGPath.rectAttr): SVGPath.pathArray;
    /**
     * Returns a new `<path>` element created from attributes of a `<line>`, `<polyline>`,
     * `<polygon>`, `<rect>`, `<ellipse>`, `<circle>` or `<glyph>`. If `replace` parameter
     * is `true`, it will replace the target.
     *
     * It can also work with an options object,
     * @see SVGPath.shapeOps
     *
     * The newly created `<path>` element keeps all non-specific
     * attributes like `class`, `fill`, etc.
     *
     * @param {SVGPath.shapeTypes | SVGPath.shapeOps} element target shape
     * @param {boolean=} replace option to replace target
     * @return {SVGPathElement | boolean} the newly created `<path>` element
     */
    export default function shapeToPath(element: SVGPath.shapeTypes | SVGPath.shapeOps, replace?: boolean | undefined): SVGPathElement | boolean;
}
declare module "svg-path-commander/src/version" {
    export default Version;
    /**
     * A global namespace for library version.
     * @type {string}
     */
    const Version: string;
}
declare module "svg-path-commander/src/svg-path-commander" {
    export default SVGPathCommander;
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
    class SVGPathCommander {
        /**
         * @constructor
         * @param {string} pathValue the path string
         * @param {any} config instance options
         */
        constructor(pathValue: string, config: any);
        /**
         * @type {SVGPath.pathArray}
         */
        segments: SVGPath.pathArray;
        /**
         * @type {number | 'off'}
         */
        round: number | 'off';
        origin: number[];
        /**
         * Returns the path bounding box, equivalent to native `path.getBBox()`.
         * @public
         * @returns {SVGPath.pathBBox}
         */
        public getBBox(): SVGPath.pathBBox;
        /**
         * Returns the total path length, equivalent to native `path.getTotalLength()`.
         * @public
         * @returns {number}
         */
        public getTotalLength(): number;
        /**
         * Returns an `{x,y}` point in the path stroke at a given length,
         * equivalent to the native `path.getPointAtLength()`.
         *
         * @public
         * @param {number} length the length
         * @returns {{x: number, y:number}} the requested point
         */
        public getPointAtLength(length: number): {
            x: number;
            y: number;
        };
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
         * Convert path to cubic-bezier values. In addition, un-necessary `Z`
         * segment is removed if previous segment extends to the `M` segment.
         *
         * @public
         */
        public toCurve(): SVGPathCommander;
        /**
         * Reverse the order of the segments and their values.
         * @param {boolean} onlySubpath option to reverse all sub-paths except first
         * @public
         */
        public reverse(onlySubpath: boolean): SVGPathCommander;
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
         * @see SVGPath.transformObject for a quick refference
         *
         * @param {SVGPath.transformObject} source a `transformObject`as described above
         * @public
         */
        public transform(source: SVGPath.transformObject): SVGPathCommander;
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
declare module "svg-path-commander/types/more/modules" {
    export { default as pathToAbsolute } from "svg-path-commander/src/convert/pathToAbsolute";
    export { default as pathToRelative } from "svg-path-commander/src/convert/pathToRelative";
    export { default as pathToCurve } from "svg-path-commander/src/convert/pathToCurve";
    export { default as pathToString } from "svg-path-commander/src/convert/pathToString";
    export { default as distanceSquareRoot } from "svg-path-commander/src/math/distanceSquareRoot";
    export { default as epsilon } from "svg-path-commander/src/math/epsilon";
    export { default as midPoint } from "svg-path-commander/src/math/midPoint";
    export { default as polygonArea } from "svg-path-commander/src/math/polygonArea";
    export { default as polygonLength } from "svg-path-commander/src/math/polygonLength";
    export { default as rotateVector } from "svg-path-commander/src/math/rotateVector";
    export { default as defaultOptions } from "svg-path-commander/src/options/options";
    export { default as finalizeSegment } from "svg-path-commander/src/parser/finalizeSegment";
    export { default as invalidPathValue } from "svg-path-commander/src/parser/invalidPathValue";
    export { default as isArcCommand } from "svg-path-commander/src/parser/isArcCommand";
    export { default as isDigit } from "svg-path-commander/src/parser/isDigit";
    export { default as isDigitStart } from "svg-path-commander/src/parser/isDigitStart";
    export { default as isPathCommand } from "svg-path-commander/src/parser/isPathCommand";
    export { default as isSpace } from "svg-path-commander/src/parser/isSpace";
    export { default as paramsCount } from "svg-path-commander/src/parser/paramsCount";
    export { default as paramsParser } from "svg-path-commander/src/parser/paramsParser";
    export { default as parsePathString } from "svg-path-commander/src/parser/parsePathString";
    export { default as PathParser } from "svg-path-commander/src/parser/pathParser";
    export { default as scanFlag } from "svg-path-commander/src/parser/scanFlag";
    export { default as scanParam } from "svg-path-commander/src/parser/scanParam";
    export { default as scanSegment } from "svg-path-commander/src/parser/scanSegment";
    export { default as skipSpaces } from "svg-path-commander/src/parser/skipSpaces";
    export { default as arcToCubic } from "svg-path-commander/src/process/arcToCubic";
    export { default as clonePath } from "svg-path-commander/src/process/clonePath";
    export { default as fixArc } from "svg-path-commander/src/process/fixArc";
    export { default as fixPath } from "svg-path-commander/src/process/fixPath";
    export { default as getSVGMatrix } from "svg-path-commander/src/process/getSVGMatrix";
    export { default as lineToCubic } from "svg-path-commander/src/process/lineToCubic";
    export { default as normalizePath } from "svg-path-commander/src/process/normalizePath";
    export { default as normalizeSegment } from "svg-path-commander/src/process/normalizeSegment";
    export { default as optimizePath } from "svg-path-commander/src/process/optimizePath";
    export { default as projection2d } from "svg-path-commander/src/process/projection2d";
    export { default as quadToCubic } from "svg-path-commander/src/process/quadToCubic";
    export { default as reverseCurve } from "svg-path-commander/src/process/reverseCurve";
    export { default as reversePath } from "svg-path-commander/src/process/reversePath";
    export { default as roundPath } from "svg-path-commander/src/process/roundPath";
    export { default as segmentToCubic } from "svg-path-commander/src/process/segmentToCubic";
    export { default as shortenSegment } from "svg-path-commander/src/process/shortenSegment";
    export { default as shorthandToCubic } from "svg-path-commander/src/process/shorthandToCubic";
    export { default as shorthandToQuad } from "svg-path-commander/src/process/shorthandToQuad";
    export { default as splitCubic } from "svg-path-commander/src/process/splitCubic";
    export { default as splitPath } from "svg-path-commander/src/process/splitPath";
    export { default as transformEllipse } from "svg-path-commander/src/process/transformEllipse";
    export { default as transformPath } from "svg-path-commander/src/process/transformPath";
    export { default as getDrawDirection } from "svg-path-commander/src/util/getDrawDirection";
    export { default as getPathArea } from "svg-path-commander/src/util/getPathArea";
    export { default as getPathBBox } from "svg-path-commander/src/util/getPathBBox";
    export { default as pathLengthFactory } from "svg-path-commander/src/util/pathLengthFactory";
    export { default as getTotalLength } from "svg-path-commander/src/util/getTotalLength";
    export { default as segmentLineFactory } from "svg-path-commander/src/util/segmentLineFactory";
    export { default as segmentArcFactory } from "svg-path-commander/src/util/segmentArcFactory";
    export { default as segmentCubicFactory } from "svg-path-commander/src/util/segmentCubicFactory";
    export { default as segmentQuadFactory } from "svg-path-commander/src/util/segmentQuadFactory";
    export { default as getPointAtLength } from "svg-path-commander/src/util/getPointAtLength";
    export { default as getPropertiesAtPoint } from "svg-path-commander/src/util/getPropertiesAtPoint";
    export { default as getPropertiesAtLength } from "svg-path-commander/src/util/getPropertiesAtLength";
    export { default as getClosestPoint } from "svg-path-commander/src/util/getClosestPoint";
    export { default as getSegmentAtLength } from "svg-path-commander/src/util/getSegmentAtLength";
    export { default as getSegmentOfPoint } from "svg-path-commander/src/util/getSegmentOfPoint";
    export { default as isPointInStroke } from "svg-path-commander/src/util/isPointInStroke";
    export { default as isAbsoluteArray } from "svg-path-commander/src/util/isAbsoluteArray";
    export { default as isCurveArray } from "svg-path-commander/src/util/isCurveArray";
    export { default as isNormalizedArray } from "svg-path-commander/src/util/isNormalizedArray";
    export { default as isPathArray } from "svg-path-commander/src/util/isPathArray";
    export { default as isRelativeArray } from "svg-path-commander/src/util/isRelativeArray";
    export { default as isValidPath } from "svg-path-commander/src/util/isValidPath";
    export { default as shapeToPath } from "svg-path-commander/src/util/shapeToPath";
    export { default as Version } from "svg-path-commander/src/version";
    export { default as SVGPathCommander } from "svg-path-commander/src/svg-path-commander";
}
