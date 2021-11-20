import SVGPCO from '../options/options.js';

import pathToAbsolute from '../convert/pathToAbsolute.js';
import pathToRelative from '../convert/pathToRelative.js';
import pathToString from '../convert/pathToString.js';

import parsePathString from '../process/parsePathString.js';
import reversePath from '../process/reversePath.js';

import clonePath from '../process/clonePath.js';
import splitPath from '../process/splitPath.js';
import optimizePath from '../process/optimizePath.js';
import normalizePath from '../process/normalizePath.js';
import transformPath from '../process/transformPath.js';
import getPathBBox from '../util/getPathBBox.js';

/**
 * Creates a new SVGPathCommander instance.
 * @class
 */
export default class SVGPathCommander {
  /**
   * @constructor
   * @param {String} pathValue the path string
   * @param {Object} config instance options
   */
  constructor(pathValue, config) {
    const options = config || {};
    // check for either true or > 0
    // const roundOption = +options.round === 0 || options.round === false ? 0 : SVGPCO.round;
    const  { round } = SVGPCO;
    let { round: roundOption } = SVGPCO;
    if (+roundOption === 0 || roundOption === false) {
      round = 0;
    }

    const { decimals } = round && (options || SVGPCO);
    const { origin } = options;

    // set instance options
    /**
     * @type {Boolean | Number}
     */
    this.round = round === 0 ? 0 : decimals;
    // ZERO | FALSE will disable rounding numbers

    if (origin) {
      const { x, y } = origin;
      if ([x, y].every((n) => !Number.isNaN(n))) {
        /**
         * @type {Object | null}
         */
        this.origin = origin;
      }
    }

    /**
     * @type {Object}
     */
    this.segments = parsePathString(pathValue);

    /**
     * @type {String}
     */
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
   * Reverse path
   * @param {Boolean | Number} onlySubpath option to reverse all pathArray(s) except first
   * @public
   */
  reverse(onlySubpath) {
    this.toAbsolute();

    const { segments } = this;
    const subPath = splitPath(this.pathValue).length > 1 && splitPath(this.toString());
    const absoluteMultiPath = subPath && clonePath(subPath)
      .map((x, i) => {
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
   * * convert pathArray(s) to absolute values
   * * convert shorthand notation to standard notation
   * @public
   */
  normalize() {
    const { segments } = this;
    this.segments = normalizePath(segments);
    return this;
  }

  /**
   * Optimize pathArray values:
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
   * Transform path using values from an `Object`
   * with the following structure:
   *
   * {
   *   origin:    {x, y, z},
   *   translate: {x, y, z},
   *   rotate:    {x, y, z},
   *   skew:      {x, y, z},
   *   scale:     {x, y, z}
   * }
   * @param {Object} source a transform `Object`as described above
   * @public
   */
  transform(source) {
    const transformObject = source || {};
    const { segments } = this;

    // if origin is not specified
    // it's important that we have one
    if (!transformObject.origin) {
      const BBox = getPathBBox(segments);
      transformObject.origin = [BBox.cx, BBox.cy, BBox.cx];
    }

    this.segments = transformPath(segments, transformObject);
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
