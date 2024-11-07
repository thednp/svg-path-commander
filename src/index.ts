"use strict";
import CSSMatrix from "@thednp/dommatrix";
import { PathArray, PointTuple, TransformObjectValues } from "./types";
import type { Options, TransformEntries, TransformObject } from "./interface";
export * from "./types";
export * from "./interface";
import defaultOptions from "./options/options";

import pathToAbsolute from "./convert/pathToAbsolute";
import pathToRelative from "./convert/pathToRelative";
import pathToCurve from "./convert/pathToCurve";
import pathToString from "./convert/pathToString";
import * as arcTools from "./math/arcTools";
import {
  bezierLength,
  calculateBezier,
  CBEZIER_MINMAX_EPSILON,
  computeBezier,
  Cvalues,
  deriveBezier,
  getBezierLength,
  minmaxC,
  minmaxQ,
  Tvalues,
} from "./math/bezier";
import {
  getCubicBBox,
  getCubicLength,
  getPointAtCubicLength,
  getPointAtCubicSegmentLength,
} from "./math/cubicTools";
import {
  getLineBBox,
  getLineLength,
  getPointAtLineLength,
} from "./math/lineTools";
import {
  getPointAtQuadLength,
  getPointAtQuadSegmentLength,
  getQuadBBox,
  getQuadLength,
} from "./math/quadTools";
import { polygonArea, polygonLength } from "./math/polygonTools";

import distanceSquareRoot from "./math/distanceSquareRoot";
import midPoint from "./math/midPoint";
import rotateVector from "./math/rotateVector";
import roundTo from "./math/roundTo";

import error from "./parser/error";
import parsePathString from "./parser/parsePathString";
import finalizeSegment from "./parser/finalizeSegment";
import invalidPathValue from "./parser/invalidPathValue";
import isArcCommand from "./parser/isArcCommand";
import isDigit from "./parser/isDigit";
import isDigitStart from "./parser/isDigitStart";
import isMoveCommand from "./parser/isMoveCommand";
import isPathCommand from "./parser/isPathCommand";
import isSpace from "./parser/isSpace";
import paramsCount from "./parser/paramsCount";
import paramsParser from "./parser/paramsParser";
import pathParser from "./parser/pathParser";
import scanFlag from "./parser/scanFlag";
import scanParam from "./parser/scanParam";
import scanSegment from "./parser/scanSegment";
import skipSpaces from "./parser/skipSpaces";

import distanceEpsilon from "./util/distanceEpsilon";
import getClosestPoint from "./util/getClosestPoint";
import getDrawDirection from "./util/getDrawDirection";
import getPathArea from "./util/getPathArea";
import getPathBBox from "./util/getPathBBox";
import getPointAtLength from "./util/getPointAtLength";
import getPropertiesAtLength from "./util/getPropertiesAtLength";
import getPropertiesAtPoint from "./util/getPropertiesAtPoint";
import getSegmentAtLength from "./util/getSegmentAtLength";
import getSegmentOfPoint from "./util/getSegmentOfPoint";
import getTotalLength from "./util/getTotalLength";

import isAbsoluteArray from "./util/isAbsoluteArray";
import isCurveArray from "./util/isCurveArray";
import isNormalizedArray from "./util/isNormalizedArray";
import isPathArray from "./util/isPathArray";
import isPointInStroke from "./util/isPointInStroke";
import isRelativeArray from "./util/isRelativeArray";
import isValidPath from "./util/isValidPath";
import shapeParams from "./util/shapeParams";
import shapeToPath from "./util/shapeToPath";
import shapeToPathArray from "./util/shapeToPathArray";

import absolutizeSegment from "./process/absolutizeSegment";
import arcToCubic from "./process/arcToCubic";
import getSVGMatrix from "./process/getSVGMatrix";
import iterate from "./process/iterate";
import lineToCubic from "./process/lineToCubic";
import normalizePath from "./process/normalizePath";
import normalizeSegment from "./process/normalizeSegment";
import optimizePath from "./process/optimizePath";
import projection2d from "./process/projection2d";
import quadToCubic from "./process/quadToCubic";
import relativizeSegment from "./process/relativizeSegment";
import reverseCurve from "./process/reverseCurve";
import reversePath from "./process/reversePath";
import roundPath from "./process/roundPath";
import roundSegment from "./process/roundSegment";
import segmentToCubic from "./process/segmentToCubic";
import shortenSegment from "./process/shortenSegment";
import splitCubic from "./process/splitCubic";
import splitPath from "./process/splitPath";
import transformPath from "./process/transformPath";

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
  public static CSSMatrix = CSSMatrix;
  public static pathToAbsolute = pathToAbsolute;
  public static pathToRelative = pathToRelative;
  public static pathToCurve = pathToCurve;
  public static pathToString = pathToString;
  public static arcTools = arcTools;
  public static bezierTools = {
    Cvalues,
    Tvalues,
    minmaxC,
    minmaxQ,
    getBezierLength,
    bezierLength,
    calculateBezier,
    computeBezier,
    deriveBezier,
    CBEZIER_MINMAX_EPSILON,
  };
  public static cubicTools = {
    getCubicLength,
    getCubicBBox,
    getPointAtCubicLength,
    getPointAtCubicSegmentLength,
  };
  public static lineTools = {
    getPointAtLineLength,
    getLineBBox,
    getLineLength,
  };
  public static quadTools = {
    getPointAtQuadSegmentLength,
    getQuadLength,
    getQuadBBox,
    getPointAtQuadLength,
  };
  public static polygonTools = { polygonArea, polygonLength };
  public static distanceSquareRoot = distanceSquareRoot;
  public static distanceEpsilon = distanceEpsilon;
  public static midPoint = midPoint;
  public static rotateVector = rotateVector;
  public static roundTo = roundTo;
  public static finalizeSegment = finalizeSegment;
  public static invalidPathValue = invalidPathValue;
  public static isArcCommand = isArcCommand;
  public static isDigit = isDigit;
  public static isDigitStart = isDigitStart;
  public static isMoveCommand = isMoveCommand;
  public static isPathCommand = isPathCommand;
  public static isSpace = isSpace;
  public static paramsCount = paramsCount;
  public static paramsParser = paramsParser;
  public static pathParser = pathParser;
  public static scanFlag = scanFlag;
  public static scanParam = scanParam;
  public static scanSegment = scanSegment;
  public static skipSpaces = skipSpaces;
  public static getPathBBox = getPathBBox;
  public static getPathArea = getPathArea;
  public static getTotalLength = getTotalLength;
  public static getDrawDirection = getDrawDirection;
  public static getPointAtLength = getPointAtLength;
  public static getPropertiesAtLength = getPropertiesAtLength;
  public static getPropertiesAtPoint = getPropertiesAtPoint;
  public static getClosestPoint = getClosestPoint;
  public static getSegmentOfPoint = getSegmentOfPoint;
  public static getSegmentAtLength = getSegmentAtLength;
  public static isPointInStroke = isPointInStroke;
  public static isValidPath = isValidPath;
  public static isPathArray = isPathArray;
  public static isAbsoluteArray = isAbsoluteArray;
  public static isRelativeArray = isRelativeArray;
  public static isCurveArray = isCurveArray;
  public static isNormalizedArray = isNormalizedArray;
  public static shapeToPath = shapeToPath;
  public static shapeToPathArray = shapeToPathArray;
  public static shapeParams = shapeParams;
  public static parsePathString = parsePathString;
  public static absolutizeSegment = absolutizeSegment;
  public static arcToCubic = arcToCubic;
  public static getSVGMatrix = getSVGMatrix;
  public static iterate = iterate;
  public static lineToCubic = lineToCubic;
  public static normalizePath = normalizePath;
  public static normalizeSegment = normalizeSegment;
  public static optimizePath = optimizePath;
  public static projection2d = projection2d;
  public static quadToCubic = quadToCubic;
  public static relativizeSegment = relativizeSegment;
  public static reverseCurve = reverseCurve;
  public static reversePath = reversePath;
  public static roundPath = roundPath;
  public static roundSegment = roundSegment;
  public static segmentToCubic = segmentToCubic;
  public static shortenSegment = shortenSegment;
  public static splitCubic = splitCubic;
  public static splitPath = splitPath;
  public static transformPath = transformPath;
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
   * Convert path to absolute values
   *
   * @public
   */
  toAbsolute() {
    const { segments } = this;
    this.segments = pathToAbsolute(segments);
    return this;
  }

  /**
   * Convert path to relative values
   *
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
   * @param onlySubpath option to reverse all sub-paths except first
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
   * @see TransformObject for a quick refference
   *
   * @param source a `transformObject`as described above
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
        (k === "rotate" || k === "translate" || k === "origin" ||
          k === "scale") && Array.isArray(v)
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
   * Rotate path 180deg vertically
   *
   * @public
   */
  flipX() {
    const { cx, cy } = this.bbox;
    this.transform({ rotate: [0, 180, 0], origin: [cx, cy, 0] });
    return this;
  }

  /**
   * Rotate path 180deg horizontally
   *
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
   * @return the path string
   */
  toString() {
    return pathToString(this.segments, this.round);
  }

  /**
   * Remove the instance.
   *
   * @public
   * @return void
   */
  dispose() {
    Object.keys(this).forEach((key) => delete this[key as keyof typeof this]);
  }
}

export default SVGPathCommander;
