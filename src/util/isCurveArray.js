import isPathArray from './isPathArray';

/**
 * Iterates an array to check if it's a `pathArray`
 * with all C (cubic bezier) segments.
 *
 * @param {SVGPathCommander.pathArray} path the `Array` to be checked
 * @returns {boolean} iteration result
 */
export default function isCurveArray(path) {
  return isPathArray(path) && path.every((seg) => 'MC'.includes(seg[0]));
}
