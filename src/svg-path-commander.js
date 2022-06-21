import defaultOptions from './options/options';

import pathToAbsolute from './convert/pathToAbsolute';
import pathToRelative from './convert/pathToRelative';
import pathToCurve from './convert/pathToCurve';
import pathToString from './convert/pathToString';

import parsePathString from './parser/parsePathString';
import reversePath from './process/reversePath';

import clonePath from './process/clonePath';
import splitPath from './process/splitPath';
import optimizePath from './process/optimizePath';
import normalizePath from './process/normalizePath';
import transformPath from './process/transformPath';

import error from './parser/error';

import getPathBBox from './util/getPathBBox';
import getTotalLength from './util/getTotalLength';
import getPointAtLength from './util/getPointAtLength';

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
  constructor(pathValue, config) {
    const instanceOptions = config || {};

    const undefPath = typeof pathValue === 'undefined';

    if (undefPath || !pathValue.length) {
      throw TypeError(`${error}: "pathValue" is ${undefPath ? 'undefined' : 'empty'}`);
    }

    const segments = parsePathString(pathValue);
    if (typeof segments === 'string') {
      throw TypeError(segments);
    }

    /**
     * @type {SVGPath.pathArray}
     */
    this.segments = segments;

    const {
      width, height, cx, cy, cz,
    } = this.getBBox();

    // set instance options.round
    const { round: roundOption, origin: originOption } = instanceOptions;
    let round;

    if (roundOption === 'auto') {
      const pathScale = (`${Math.floor(Math.max(width, height))}`).length;
      round = pathScale >= 4 ? 0 : 4 - pathScale;
    } else if (Number.isInteger(roundOption) || roundOption === 'off') {
      round = roundOption;
    } else {
      ({ round } = defaultOptions);
    }

    // set instance options.origin
    // the SVGPathCommander class will always override the default origin
    let origin;
    if (Array.isArray(originOption) && originOption.length >= 2) {
      const [originX, originY, originZ] = originOption.map(Number);
      origin = [
        !Number.isNaN(originX) ? originX : cx,
        !Number.isNaN(originY) ? originY : cy,
        !Number.isNaN(originZ) ? originZ : cz,
      ];
    } else {
      origin = [cx, cy, cz];
    }

    /** @type {number | 'off'} */
    this.round = round;
    /** @type {[number, number, number=]} */
    this.origin = origin;

    return this;
  }

  /**
   * Returns the path bounding box, equivalent to native `path.getBBox()`.
   * @public
   * @returns {SVGPath.pathBBox}
   */
  getBBox() {
    return getPathBBox(this.segments);
  }

  /**
   * Returns the total path length, equivalent to native `path.getTotalLength()`.
   * @public
   * @returns {number}
   */
  getTotalLength() {
    return getTotalLength(this.segments);
  }

  /**
   * Returns an `{x,y}` point in the path stroke at a given length,
   * equivalent to the native `path.getPointAtLength()`.
   *
   * @public
   * @param {number} length the length
   * @returns {{x: number, y:number}} the requested point
   */
  getPointAtLength(length) {
    return getPointAtLength(this.segments, length);
  }

  /**
   * Convert path to absolute values
   * @public
   */
  toAbsolute() {
    const { segments } = this;
    this.segments = pathToAbsolute(segments);
    return this;
  }

  /**
   * Convert path to relative values
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
   * @param {boolean} onlySubpath option to reverse all sub-paths except first
   * @public
   */
  reverse(onlySubpath) {
    this.toAbsolute();

    const { segments } = this;
    const split = splitPath(segments);
    const subPath = split.length > 1 ? split : 0;

    const absoluteMultiPath = subPath && clonePath(subPath).map((x, i) => {
      if (onlySubpath) {
        return i ? reversePath(x) : parsePathString(x);
      }
      return reversePath(x);
    });

    let path = [];
    if (subPath) {
      path = absoluteMultiPath.flat(1);
    } else {
      path = onlySubpath ? segments : reversePath(segments);
    }

    this.segments = clonePath(path);
    return this;
  }

  /**
   * Normalize path in 2 steps:
   * * convert `pathArray`(s) to absolute values
   * * convert shorthand notation to standard notation
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
   * @public
   */
  optimize() {
    const { segments } = this;

    this.segments = optimizePath(segments, this.round);
    return this;
  }

  /**
   * Transform path using values from an `Object` defined as `transformObject`.
   * @see SVGPath.transformObject for a quick refference
   *
   * @param {SVGPath.transformObject} source a `transformObject`as described above
   * @public
   */
  transform(source) {
    if (!source || typeof source !== 'object' || (typeof source === 'object'
      && !['translate', 'rotate', 'skew', 'scale'].some((x) => x in source))) return this;

    /** @type {SVGPath.transformObject} */
    const transform = {};
    Object.keys(source).forEach((fn) => {
      transform[fn] = Array.isArray(source[fn]) ? [...source[fn]] : Number(source[fn]);
    });
    const { segments } = this;

    // if origin is not specified
    // it's important that we have one
    const [cx, cy, cz] = this.origin;
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
   * @public
   */
  flipX() {
    this.transform({ rotate: [0, 180, 0] });
    return this;
  }

  /**
   * Rotate path 180deg horizontally
   * @public
   */
  flipY() {
    this.transform({ rotate: [180, 0, 0] });
    return this;
  }

  /**
   * Export the current path to be used
   * for the `d` (description) attribute.
   * @public
   * @return {String} the path string
   */
  toString() {
    return pathToString(this.segments, this.round);
  }
}

export default SVGPathCommander;
