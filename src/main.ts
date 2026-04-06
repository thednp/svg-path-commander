"use strict";
import { version } from "../package.json";
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
class SVGPathCommander {
  // declare class properties
  declare segments: PathArray;
  declare round: number | "off";
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
  get bbox() {
    return getPathBBox(this.segments);
  }
  get length() {
    return getTotalLength(this.segments);
  }

  /**
   * Returns the path bounding box, equivalent to native `path.getBBox()`.
   *
   * @public
   * @returns the pathBBox
   */
  getBBox() {
    return this.bbox;
  }

  /**
   * Returns the total path length, equivalent to native `path.getTotalLength()`.
   *
   * @public
   * @returns the path total length
   */
  getTotalLength() {
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
  getPointAtLength(length: number) {
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
  toAbsolute() {
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
  toRelative() {
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
  toCurve() {
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
   * // => 'M0 100L0 0L100 0L100 100Z'
   * ```
   *
   * @param onlySubpath - option to reverse all sub-paths except first
   * @returns this for chaining
   * @public
   */
  reverse(onlySubpath?: boolean) {
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
  normalize() {
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
   * // => 'M10 10l0 0 80 80'
   * ```
   *
   * @returns this for chaining
   * @public
   */
  optimize() {
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
  transform(source?: Partial<TransformObject>) {
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
  flipX() {
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
  flipY() {
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
  toString() {
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

  static options = defaultOptions;
  static CSSMatrix = CSSMatrix;
  static arcTools = arcTools;
  static bezierTools = bezierTools;
  static cubicTools = cubicTools;
  static lineTools = lineTools;
  static polygonTools = polygonTools;
  static quadTools = quadTools;

  static pathToAbsolute = pathToAbsolute;
  static pathToRelative = pathToRelative;
  static pathToCurve = pathToCurve;
  static pathToString = pathToString;

  static distanceSquareRoot = distanceSquareRoot;
  static midPoint = midPoint;
  static rotateVector = rotateVector;
  static roundTo = roundTo;

  static parsePathString = parsePathString;
  static finalizeSegment = finalizeSegment;
  static invalidPathValue = invalidPathValue;

  static isArcCommand = isArcCommand;
  static isDigit = isDigit;
  static isDigitStart = isDigitStart;
  static isMoveCommand = isMoveCommand;
  static isPathCommand = isPathCommand;
  static isSpace = isSpace;

  static paramsCount = paramsCounts;
  static paramsParser = paramsParser;
  static PathParser = PathParser;
  static scanFlag = scanFlag;
  static scanParam = scanParam;
  static scanSegment = scanSegment;
  static skipSpaces = skipSpaces;

  static distanceEpsilon = distanceEpsilon;

  static fixPath = fixPath;
  static getClosestPoint = getClosestPoint;
  static getDrawDirection = getDrawDirection;
  static getPathArea = getPathArea;
  static getPathBBox = getPathBBox;
  static getPointAtLength = getPointAtLength;
  static getPropertiesAtLength = getPropertiesAtLength;
  static getPropertiesAtPoint = getPropertiesAtPoint;
  static getSegmentAtLength = getSegmentAtLength;
  static getSegmentOfPoint = getSegmentOfPoint;
  static getTotalLength = getTotalLength;

  static isAbsoluteArray = isAbsoluteArray;
  static isCurveArray = isCurveArray;
  static isPolygonArray = isPolygonArray;
  static isNormalizedArray = isNormalizedArray;
  static isPathArray = isPathArray;
  static isPointInStroke = isPointInStroke;
  static isRelativeArray = isRelativeArray;
  static isValidPath = isValidPath;

  static samplePolygon = samplePolygon;
  static shapeParams = shapeParams;
  static shapeToPath = shapeToPath;
  static shapeToPathArray = shapeToPathArray;

  static absolutizeSegment = absolutizeSegment;
  static arcToCubic = arcToCubic;
  static getSVGMatrix = getSVGMatrix;
  static iterate = iterate;
  static lineToCubic = lineToCubic;
  static normalizePath = normalizePath;
  static normalizeSegment = normalizeSegment;
  static optimizePath = optimizePath;
  static projection2d = projection2d;
  static quadToCubic = quadToCubic;
  static relativizeSegment = relativizeSegment;
  static reverseCurve = reverseCurve;
  static reversePath = reversePath;
  static roundPath = roundPath;
  static roundSegment = roundSegment;
  static segmentToCubic = segmentToCubic;
  static shortenSegment = shortenSegment;
  static splitPath = splitPath;
  static equalizePaths = equalizePaths;
  static equalizeSegments = equalizeSegments;
  static splitCubicSegment = splitCubicSegment;
  static transformPath = transformPath;
  static isPointInsideBBox = isPointInsideBBox;
  static pathsIntersection = pathsIntersection;
  static boundingBoxIntersect = boundingBoxIntersect;
  static isMultiPath = isMultiPath;
  static isClosedPath = isClosedPath;
  static isPolylineArray = isPolylineArray;
  static version = version;
}

export default SVGPathCommander;
