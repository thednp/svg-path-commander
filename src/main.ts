"use strict";
import pkg from "../package.json" with { type: "json" };
import CSSMatrix from "@thednp/dommatrix";
import { arcTools } from "./math/arcTools.ts";
import { bezierTools } from "./math/bezier.ts";
import { cubicTools } from "./math/cubicTools.ts";
import { lineTools } from "./math/lineTools.ts";
import { quadTools } from "./math/quadTools.ts";
import { polygonTools } from "./math/polygonTools.ts";

import { distanceSquareRoot } from "./math/distanceSquareRoot.ts";
import { midPoint } from "./math/midPoint.ts";
import { rotateVector } from "./math/rotateVector.ts";
import { roundTo } from "./math/roundTo.ts";

import type { PathArray, PointTuple, TransformObjectValues } from "./types.ts";
import type {
  Options,
  TransformEntries,
  TransformObject,
} from "./interface.ts";
import { defaultOptions } from "./options/options.ts";

import { pathToAbsolute } from "./convert/pathToAbsolute.ts";
import { pathToRelative } from "./convert/pathToRelative.ts";
import { pathToCurve } from "./convert/pathToCurve.ts";
import { pathToString } from "./convert/pathToString.ts";

import { error } from "./util/error.ts";
import { parsePathString } from "./parser/parsePathString.ts";
import { finalizeSegment } from "./parser/finalizeSegment.ts";
import { invalidPathValue } from "./parser/invalidPathValue.ts";
import { isArcCommand } from "./parser/isArcCommand.ts";
import { isDigit } from "./parser/isDigit.ts";
import { isDigitStart } from "./parser/isDigitStart.ts";
import { isMoveCommand } from "./parser/isMoveCommand.ts";
import { isPathCommand } from "./parser/isPathCommand.ts";
import { isSpace } from "./parser/isSpace.ts";
import { paramsCounts } from "./parser/paramsCount.ts";
import { paramsParser } from "./parser/paramsParser.ts";
import { PathParser } from "./parser/pathParser.ts";
import { scanFlag } from "./parser/scanFlag.ts";
import { scanParam } from "./parser/scanParam.ts";
import { scanSegment } from "./parser/scanSegment.ts";
import { skipSpaces } from "./parser/skipSpaces.ts";
import { getPathBBox } from "./util/getPathBBox.ts";
import { getTotalLength } from "./util/getTotalLength.ts";
import { getClosestPoint } from "./util/getClosestPoint.ts";
import { getDrawDirection } from "./util/getDrawDirection.ts";
import { getPathArea } from "./util/getPathArea.ts";
import { getPointAtLength } from "./util/getPointAtLength.ts";
import { getPropertiesAtLength } from "./util/getPropertiesAtLength.ts";
import { getPropertiesAtPoint } from "./util/getPropertiesAtPoint.ts";
import { getSegmentAtLength } from "./util/getSegmentAtLength.ts";
import { getSegmentOfPoint } from "./util/getSegmentOfPoint.ts";
import { isAbsoluteArray } from "./util/isAbsoluteArray.ts";
import { isPolygonArray } from "./util/isPolygonArray.ts";
import { isCurveArray } from "./util/isCurveArray.ts";
import { isNormalizedArray } from "./util/isNormalizedArray.ts";
import { isPathArray } from "./util/isPathArray.ts";
import { isPointInStroke } from "./util/isPointInStroke.ts";
import { isRelativeArray } from "./util/isRelativeArray.ts";
import { isValidPath } from "./util/isValidPath.ts";
import { samplePolygon } from "./morph/samplePolygon.ts";
import { shapeParams } from "./util/shapeParams.ts";
import { shapeToPath } from "./util/shapeToPath.ts";
import { shapeToPathArray } from "./util/shapeToPathArray.ts";
import { isMultiPath } from "./util/isMultiPath.ts";
import { isPolylineArray } from "./util/isPolylineArray.ts";
import { isClosedPath } from "./util/isClosedPath.ts";

import { normalizePath } from "./process/normalizePath.ts";
import { optimizePath } from "./process/optimizePath.ts";
import { reversePath } from "./process/reversePath.ts";
import { splitPath } from "./process/splitPath.ts";
import { transformPath } from "./process/transformPath.ts";
import { absolutizeSegment } from "./process/absolutizeSegment.ts";
import { arcToCubic } from "./process/arcToCubic.ts";
import { getSVGMatrix } from "./process/getSVGMatrix.ts";
import { iterate } from "./process/iterate.ts";
import { lineToCubic } from "./process/lineToCubic.ts";
import { normalizeSegment } from "./process/normalizeSegment.ts";
import { projection2d } from "./process/projection2d.ts";
import { quadToCubic } from "./process/quadToCubic.ts";
import { relativizeSegment } from "./process/relativizeSegment.ts";
import { reverseCurve } from "./process/reverseCurve.ts";
import { roundPath } from "./process/roundPath.ts";
import { roundSegment } from "./process/roundSegment.ts";
import { segmentToCubic } from "./process/segmentToCubic.ts";
import { shortenSegment } from "./process/shortenSegment.ts";

import { fixPath } from "./morph/fixPath.ts";
import { splitCubicSegment } from "./morph/splitCubicSegment.ts";
import { equalizeSegments } from "./morph/equalizeSegments.ts";
import { equalizePaths } from "./morph/equalizePaths.ts";
import { pathsIntersection } from "./intersect/pathIntersection.ts";
import { boundingBoxIntersect } from "./intersect/boundingBoxIntersect.ts";
import { isPointInsideBBox } from "./intersect/isPointInsideBBox.ts";
import distanceEpsilon from "./util/distanceEpsilon.ts";

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
export class SVGPathCommander {
  /** The parsed PathArray stored on the instance. */
  declare segments: PathArray;
  /** The rounding option used for the output path string. */
  declare round: number | "off";
  /** The transform origin used for path transformations. */
  declare origin: [number, number, number];

  /**
   * @constructor
   * @param pathValue the path string
   * @param config instance options
   */
  constructor(pathValue: string, config?: Partial<Options>) {
    const instanceOptions = config || {};
    const undefPath = typeof pathValue === "undefined";

    if (undefPath || !pathValue.length) {
      throw TypeError(
        `${error}: "pathValue" is ${undefPath ? "undefined" : "empty"}`,
      );
    }

    this.segments = parsePathString(pathValue);

    // // set instance options.round
    const { round: roundOption, origin: originOption } = instanceOptions;
    let round: number | "off";

    if (Number.isInteger(roundOption) || roundOption === "off") {
      round = roundOption as number | "off";
    } else {
      round = defaultOptions.round as number;
    }

    // set instance options.origin
    // the SVGPathCommander class will always override the default origin
    let origin = defaultOptions.origin as [number, number, number];
    /* istanbul ignore else @preserve */
    if (Array.isArray(originOption) && originOption.length >= 2) {
      const [originX, originY, originZ] = originOption.map(Number);
      origin = [
        !Number.isNaN(originX) ? originX : 0,
        !Number.isNaN(originY) ? originY : 0,
        !Number.isNaN(originZ) ? originZ : 0,
      ];
    }

    this.round = round;
    this.origin = origin;

    return this;
  }
  /**
   * Returns the path bounding box, equivalent to native `path.getBBox()`.
   *
   * @public
   * @returns the pathBBox
   */
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
  } {
    return getPathBBox(this.segments);
  }
  /**
   * Returns the total path length, equivalent to native `path.getTotalLength()`.
   *
   * @public
   * @returns the path total length
   */
  get length(): number {
    return getTotalLength(this.segments);
  }

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
  } {
    return this.bbox;
  }

  /**
   * Returns the total path length, equivalent to native `path.getTotalLength()`.
   *
   * @public
   * @returns the path total length
   */
  getTotalLength(): number {
    return this.length;
  }

  /**
   * Returns an `{x,y}` point in the path stroke at a given length,
   * equivalent to the native `path.getPointAtLength()`.
   *
   * @public
   * @param length the length
   * @returns the requested point
   */
  getPointAtLength(length: number): { x: number; y: number } {
    return getPointAtLength(this.segments, length);
  }

  /**
   * Convert path to absolute values.
   *
   * @example
   * ```ts
   * new SVGPathCommander('M10 10l80 80').toAbsolute().toString()
   * // => 'M10 10L90 90'
   * ```
   *
   * @returns this for chaining
   * @public
   */
  toAbsolute(): this {
    const { segments } = this;
    this.segments = pathToAbsolute(segments);
    return this;
  }

  /**
   * Convert path to relative values.
   *
   * @example
   * ```ts
   * new SVGPathCommander('M10 10L90 90').toRelative().toString()
   * // => 'M10 10l80 80'
   * ```
   *
   * @returns this for chaining
   * @public
   */
  toRelative(): this {
    const { segments } = this;
    this.segments = pathToRelative(segments);
    return this;
  }

  /**
   * Convert path to cubic-bezier values. In addition, un-necessary `Z`
   * segment is removed if previous segment extends to the `M` segment.
   *
   * @example
   * ```ts
   * new SVGPathCommander('M10 50q15 -25 30 0').toCurve().toString()
   * // => 'M10 50C25 25 40 50 40 50'
   * ```
   *
   * @returns this for chaining
   * @public
   */
  toCurve(): this {
    const { segments } = this;
    this.segments = pathToCurve(segments);
    return this;
  }

  /**
   * Reverse the order of the segments and their values.
   *
   * @example
   * ```ts
   * new SVGPathCommander('M0 0L100 0L100 100L0 100Z').reverse().toString()
   * // => 'M0 100L100 100L100 0L0 0Z'
   * ```
   *
   * @param onlySubpath - option to reverse all sub-paths except first
   * @returns this for chaining
   * @public
   */
  reverse(onlySubpath?: boolean): this {
    const { segments } = this;
    const split = splitPath(segments);
    const subPath = split.length > 1 ? split : false;

    const absoluteMultiPath = subPath
      ? subPath.map((x, i) => {
        if (onlySubpath) {
          return i ? reversePath(x) : x.slice(0);
        }
        return reversePath(x);
      })
      : segments.slice(0);

    let path = [] as unknown as PathArray;
    if (subPath) {
      path = absoluteMultiPath.flat(1) as PathArray;
    } else {
      path = onlySubpath ? segments : reversePath(segments);
    }

    this.segments = path.slice(0) as PathArray;
    return this;
  }

  /**
   * Normalize path in 2 steps:
   * * convert `pathArray`(s) to absolute values
   * * convert shorthand notation to standard notation
   *
   * @example
   * ```ts
   * new SVGPathCommander('M10 90s20 -80 40 -80s20 80 40 80').normalize().toString()
   * // => 'M10 90C30 90 25 10 50 10C75 10 70 90 90 90'
   * ```
   *
   * @returns this for chaining
   * @public
   */
  normalize(): this {
    const { segments } = this;
    this.segments = normalizePath(segments);
    return this;
  }

  /**
   * Optimize `pathArray` values:
   * * convert segments to absolute and/or relative values
   * * select segments with shortest resulted string
   * * round values to the specified `decimals` option value
   *
   * @example
   * ```ts
   * new SVGPathCommander('M10 10L10 10L90 90').optimize().toString()
   * // => 'M10 10v0l80 80'
   * ```
   *
   * @returns this for chaining
   * @public
   */
  optimize(): this {
    const { segments } = this;
    const round = this.round === "off" ? 2 : this.round;

    this.segments = optimizePath(segments, round);
    return this;
  }

  /**
   * Transform path using values from an `Object` defined as `transformObject`.
   *
   * @see TransformObject for a quick reference
   *
   * @param source a `transformObject` as described above
   * @returns this for chaining
   * @public
   */
  transform(source?: Partial<TransformObject>): this {
    if (
      !source ||
      typeof source !== "object" ||
      (typeof source === "object" &&
        !["translate", "rotate", "skew", "scale"].some((x) => x in source))
    ) {
      return this;
    }

    const {
      segments,
      origin: [cx, cy, cz],
    } = this;
    const transform = {} as TransformObjectValues;
    for (const [k, v] of Object.entries(source) as TransformEntries) {
      // istanbul ignore else @preserve
      if (k === "skew" && Array.isArray(v)) {
        transform[k] = v.map(Number) as PointTuple;
      } else if (
        (k === "rotate" ||
          k === "translate" ||
          k === "origin" ||
          k === "scale") &&
        Array.isArray(v)
      ) {
        transform[k] = v.map(Number) as [number, number, number];
      } else if (k !== "origin" && typeof Number(v) === "number") {
        transform[k] = Number(v);
      }
    }

    // if origin is not specified
    // it's important that we have one
    const { origin } = transform;

    if (Array.isArray(origin) && origin.length >= 2) {
      const [originX, originY, originZ] = origin.map(Number);
      transform.origin = [
        !Number.isNaN(originX) ? originX : cx,
        !Number.isNaN(originY) ? originY : cy,
        originZ || cz,
      ];
    } else {
      transform.origin = [cx, cy, cz];
    }

    this.segments = transformPath(segments, transform);
    return this;
  }

  /**
   * Rotate path 180deg vertically.
   *
   * @example
   * ```ts
   * const path = new SVGPathCommander('M0 0L100 0L100 100L0 100Z')
   * path.flipX().toString()
   * ```
   *
   * @returns this for chaining
   * @public
   */
  flipX(): this {
    const { cx, cy } = this.bbox;
    this.transform({ rotate: [0, 180, 0], origin: [cx, cy, 0] });
    return this;
  }

  /**
   * Rotate path 180deg horizontally.
   *
   * @example
   * ```ts
   * const path = new SVGPathCommander('M0 0L100 0L100 100L0 100Z')
   * path.flipY().toString()
   * ```
   *
   * @returns this for chaining
   * @public
   */
  flipY(): this {
    const { cx, cy } = this.bbox;
    this.transform({ rotate: [180, 0, 0], origin: [cx, cy, 0] });
    return this;
  }

  /**
   * Export the current path to be used
   * for the `d` (description) attribute.
   *
   * @public
   * @returns the path string
   */
  toString(): string {
    return pathToString(this.segments, this.round);
  }

  /**
   * Remove the instance.
   *
   * @public
   * @returns void
   */
  dispose() {
    Object.keys(this).forEach((key) => delete this[key as keyof typeof this]);
  }

  /** The default instance options. */
  static options = defaultOptions;
  /**
   * The DOMMatrix shim used for transformations.
   * @see https://github.com/thednp/dommatrix
   */
  static CSSMatrix = CSSMatrix;
  /** The tools for elliptical arc computation. */
  static arcTools = arcTools;
  /** The tools for Bezier curve computation. */
  static bezierTools = bezierTools;
  /** The tools for cubic Bezier computation. */
  static cubicTools = cubicTools;
  /** The tools for line segment computation. */
  static lineTools = lineTools;
  /** The tools for polygon computation. */
  static polygonTools = polygonTools;
  /** The tools for quadratic Bezier computation. */
  static quadTools = quadTools;

  /** Parses a path string value or object and returns an array */
  static pathToAbsolute = pathToAbsolute;
  /** Parses a path string value or object and returns an array */
  static pathToRelative = pathToRelative;
  /** Parses a path string or PathArray and returns a new one */
  static pathToCurve = pathToCurve;
  /** Returns a valid `d` attribute string value created */
  static pathToString = pathToString;

  /** Returns the square root of the distance */
  static distanceSquareRoot = distanceSquareRoot;
  /** Returns the coordinates of a specified distance */
  static midPoint = midPoint;
  /** Returns an {x,y} vector rotated by a given */
  static rotateVector = rotateVector;
  /** Rounds a number to the specified number of decimal places. */
  static roundTo = roundTo;

  /** Parses a path string value and returns an array */
  static parsePathString = parsePathString;
  /** Breaks the parsing of a pathString once a segment is finalized. */
  static finalizeSegment = finalizeSegment;
  /** Error message prefix used when a path string cannot be parsed. */
  static invalidPathValue = invalidPathValue;

  /** Checks if the character is an A (arc-to) path command. */
  static isArcCommand = isArcCommand;
  /** Checks if a character is a digit. */
  static isDigit = isDigit;
  /** Checks if the character is or belongs to a number. */
  static isDigitStart = isDigitStart;
  /** Checks if the character is a MoveTo command. */
  static isMoveCommand = isMoveCommand;
  /** Checks if the character is a path command. */
  static isPathCommand = isPathCommand;
  /** Checks if the character is a space. */
  static isSpace = isSpace;

  /** The number of parameters for each path command. */
  static paramsCount = paramsCounts;
  /** Default parser parameters object used to track position state */
  static paramsParser = paramsParser;
  /** The `PathParser` is used by the `parsePathString` static method */
  static PathParser = PathParser;
  /** Validates an A (arc-to) specific path command value. */
  static scanFlag = scanFlag;
  /** Validates every character of the path string, */
  static scanParam = scanParam;
  /** Scans every character in the path string to determine */
  static scanSegment = scanSegment;
  /** Points the parser to the next character in the */
  static skipSpaces = skipSpaces;

  /** Small threshold value used for floating-point distance comparisons in path calculations. */
  static distanceEpsilon = distanceEpsilon;

  /** Checks a `PathArray` for an unnecessary `Z` segment */
  static fixPath = fixPath;
  /** Returns the point in path closest to a given point. */
  static getClosestPoint = getClosestPoint;
  /** Check if a path is drawn clockwise and returns true if so, */
  static getDrawDirection = getDrawDirection;
  /** Returns the area of a single cubic-bezier segment. */
  static getPathArea = getPathArea;
  /** Calculates the bounding box of a path. */
  static getPathBBox = getPathBBox;
  /** Returns [x,y] coordinates of a point at a given length along a path. */
  static getPointAtLength = getPointAtLength;
  /** Returns the segment, its index and length as well as */
  static getPropertiesAtLength = getPropertiesAtLength;
  /** Returns the point and segment in path closest to a given point as well as */
  static getPropertiesAtPoint = getPropertiesAtPoint;
  /** Returns the segment at a given length. */
  static getSegmentAtLength = getSegmentAtLength;
  /** Returns the path segment which contains a given point. */
  static getSegmentOfPoint = getSegmentOfPoint;
  /** Returns the total length of a path, equivalent to `shape.getTotalLength()`. */
  static getTotalLength = getTotalLength;

  /** Iterates an array to check if it's a `pathArray` */
  static isAbsoluteArray = isAbsoluteArray;
  /** Iterates an array to check if it's a `pathArray` */
  static isCurveArray = isCurveArray;
  /** Checks if a path is a polygon (only M, L, H, V, Z commands). */
  static isPolygonArray = isPolygonArray;
  /** Iterates an array to check if it's a `pathArray` */
  static isNormalizedArray = isNormalizedArray;
  /** Iterates an array to check if it's an actual `pathArray`. */
  static isPathArray = isPathArray;
  /** Checks if a given point is in the stroke of a path. */
  static isPointInStroke = isPointInStroke;
  /** Iterates an array to check if it's a `pathArray` */
  static isRelativeArray = isRelativeArray;
  /** Parses a path string value to determine its validity */
  static isValidPath = isValidPath;

  /** Samples points from a path to form a polygon approximation. */
  static samplePolygon = samplePolygon;
  /** Supported shapes and their specific parameters. */
  static shapeParams = shapeParams;
  /** Returns a new `<path>` element created from attributes of a `<line>`, `<polyline>`, */
  static shapeToPath = shapeToPath;
  /** Returns a new PathArray from line attributes. */
  static shapeToPathArray = shapeToPathArray;

  /** Returns an absolute segment of a `PathArray` object. */
  static absolutizeSegment = absolutizeSegment;
  /** Converts A (arc-to) segments to C (cubic-bezier-to). */
  static arcToCubic = arcToCubic;
  /** Returns a transformation matrix to apply to `<path>` elements. */
  static getSVGMatrix = getSVGMatrix;
  /** Iterates over a `PathArray`, executing a callback for each segment. */
  static iterate = iterate;
  /** Converts an L (line-to) segment to C (cubic-bezier). */
  static lineToCubic = lineToCubic;
  /** Parses a path string or PathArray, then iterates the result for: */
  static normalizePath = normalizePath;
  /** Normalizes a single segment of a `pathArray` object. */
  static normalizeSegment = normalizeSegment;
  /** Optimizes a PathArray: */
  static optimizePath = optimizePath;
  /** Transforms a specified point using a matrix, returning a new */
  static projection2d = projection2d;
  /** Converts a Q (quadratic-bezier) segment to C (cubic-bezier). */
  static quadToCubic = quadToCubic;
  /** Returns a relative segment of a `PathArray` object. */
  static relativizeSegment = relativizeSegment;
  /** Reverses all segments of a `pathArray` */
  static reverseCurve = reverseCurve;
  /** Reverses all segments of a PathArray and returns a new PathArray */
  static reversePath = reversePath;
  /** Rounds the values of a `pathArray` instance to */
  static roundPath = roundPath;
  /** Rounds the numeric values of a path segment to the specified precision. */
  static roundSegment = roundSegment;
  /** Converts any segment to C (cubic-bezier). */
  static segmentToCubic = segmentToCubic;
  /** Shorten a single segment of a `pathArray` object. */
  static shortenSegment = shortenSegment;
  /** Split a path string or PathArray into an array of sub-paths. */
  static splitPath = splitPath;
  /** Equalizes two paths for morphing (single/multi subpath). */
  static equalizePaths = equalizePaths;
  /** Equalizes two paths for morphing (single subpath only). */
  static equalizeSegments = equalizeSegments;
  /** Split a cubic Bézier into two cubics at parameter t [0–1]. */
  static splitCubicSegment = splitCubicSegment;
  /** Apply a 2D / 3D transformation to a PathArray. */
  static transformPath = transformPath;
  /** Checks if a point is inside a bounding box. */
  static isPointInsideBBox = isPointInsideBBox;
  /** Finds intersection points between two paths. */
  static pathsIntersection = pathsIntersection;
  /** Checks if two bounding boxes intersect. */
  static boundingBoxIntersect = boundingBoxIntersect;
  /** Determines if an SVG path contains multiple subpaths. */
  static isMultiPath = isMultiPath;
  /** Check if a PathArray is closed, which means its last segment is a Z. */
  static isClosedPath = isClosedPath;
  /** Checks if a path is a polyline (only M, L, H, V commands). */
  static isPolylineArray = isPolylineArray;
  /** The library version. */
  static version = pkg.version;
}

export default SVGPathCommander;
