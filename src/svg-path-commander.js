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

import getPathBBox from './util/getPathBBox';

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

    /**
     * @type {SVGPathCommander.pathArray}
     */
    this.segments = parsePathString(pathValue);
    const BBox = getPathBBox(this.segments);
    const {
      width,
      height,
      cx,
      cy,
      cz,
    } = BBox;

    // set instance options.round
    let { round, origin } = defaultOptions;
    const { round: roundOption, origin: originOption } = instanceOptions;

    if (roundOption === 'auto') {
      const pathScale = (`${Math.floor(Math.max(width, height))}`).length;
      round = pathScale >= 4 ? 0 : 4 - pathScale;
    } else if ((Number.isInteger(roundOption) && roundOption >= 1) || roundOption === false) {
      round = roundOption;
    }

    // set instance options.origin
    if (Array.isArray(originOption) && originOption.length >= 2) {
      const [originX, originY, originZ] = originOption.map(Number);
      origin = [
        !Number.isNaN(originX) ? originX : cx,
        !Number.isNaN(originY) ? originY : cy,
        originZ || cz,
      ];
    } else {
      origin = [cx, cy, cz];
    }

    /**
     * @type {number | boolean}
     * @default 4
     */
    this.round = round;
    this.origin = origin;

    return this;
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
   * @param {boolean | number} onlySubpath option to reverse all sub-paths except first
   * @public
   */
  reverse(onlySubpath) {
    this.toAbsolute();

    const { segments } = this;
    const split = splitPath(this.toString());
    const subPath = split.length > 1 ? split : 0;

    // @ts-ignore
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
   * @see SVGPathCommander.transformObject for a quick refference
   *
   * @param {SVGPathCommander.transformObject} source a `transformObject`as described above
   * @public
   */
  transform(source) {
    if (!source || typeof source !== 'object' || (typeof source === 'object'
      && !['translate', 'rotate', 'skew', 'scale'].some((x) => x in source))) return this;

    /** @type {SVGPathCommander.transformObject} */
    const transform = {};
    Object.keys(source).forEach((fn) => {
      // @ts-ignore
      transform[fn] = Array.isArray(source[fn]) ? [...source[fn]] : Number(source[fn]);
    });
    const { segments } = this;

    // if origin is not specified
    // it's important that we have one
    const { origin } = transform;
    if (origin && origin.length >= 2) {
      const [originX, originY, originZ] = origin.map(Number);
      const [cx, cy, cz] = this.origin;
      transform.origin = [
        !Number.isNaN(originX) ? originX : cx,
        !Number.isNaN(originY) ? originY : cy,
        originZ || cz,
      ];
    } else {
      // @ts-ignore
      transform.origin = { ...this.origin };
    }

    this.segments = transformPath(segments, transform);
    return this;
  }

  /**
   * Rotate path 180deg horizontally
   * @public
   */
  flipX() {
    this.transform({ rotate: [180, 0, 0] });
    return this;
  }

  /**
   * Rotate path 180deg vertically
   * @public
   */
  flipY() {
    this.transform({ rotate: [0, 180, 0] });
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
