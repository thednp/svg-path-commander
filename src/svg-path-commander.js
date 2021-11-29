import SVGPCO from './options/options';

import pathToAbsolute from './convert/pathToAbsolute';
import pathToRelative from './convert/pathToRelative';
import pathToString from './convert/pathToString';

import parsePathString from './parser/parsePathString';
import reversePath from './process/reversePath';

import clonePath from './process/clonePath';
import splitPath from './process/splitPath';
import optimizePath from './process/optimizePath';
import normalizePath from './process/normalizePath';
import transformPath from './process/transformPath';

import getPathBBox from './util/getPathBBox';
import Util from './util/util';

/**
 * Creates a new SVGPathCommander instance.
 *
 * @class SVGPathCommander
 * @author thednp <https://github.com/thednp/svg-path-commander>
 */
class SVGPathCommander {
  /**
   * @constructor
   * @param {string} pathValue the path string
   * @param {SVGPathCommander.options} config instance options
   */
  constructor(pathValue, config) {
    const options = config || {};

    let { round } = SVGPCO;
    const { round: roundOption } = options;
    if ((roundOption && +roundOption === 0) || roundOption === false) {
      round = 0;
    }

    const { decimals } = round ? (options || SVGPCO) : { decimals: false };

    // set instance options
    this.round = decimals;
    // ZERO | FALSE will disable rounding numbers

    /** @type {SVGPathCommander.pathArray} */
    this.segments = parsePathString(pathValue);

    /** * @type {string} */
    this.pathValue = pathValue;

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
   * Reverse the order of the segments and their values.
   * @param {boolean | number} onlySubpath option to reverse all sub-paths except first
   * @public
   */
  reverse(onlySubpath) {
    this.toAbsolute();

    const { segments } = this;
    const split = splitPath(this.toString());
    const subPath = split.length > 1 ? split : 0;
    /**
     * @param {import("../types").pathArray} x
     * @param {number} i
     */
    const reverser = (x, i) => {
      if (onlySubpath) {
        return i ? reversePath(x) : parsePathString(x);
      }
      return reversePath(x);
    };

    const absoluteMultiPath = subPath && clonePath(subPath).map(reverser);

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
   * @param {Object.<string, (number | number[])>} source a `transformObject`as described above
   * @public
   */
  transform(source) {
    if (!source || typeof source !== 'object' || (typeof source === 'object'
      && !['translate', 'rotate', 'skew', 'scale'].some((x) => x in source))) return this;

    const transform = source || {};
    const { segments } = this;

    // if origin is not specified
    // it's important that we have one
    if (!transform.origin) {
      const BBox = getPathBBox(segments);
      transform.origin = [+BBox.cx, +BBox.cy];
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

// Export Util to global
Object.assign(SVGPathCommander, Util);

export default SVGPathCommander;
