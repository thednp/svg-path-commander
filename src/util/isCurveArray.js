import isPathArray from './isPathArray';

/**
 * Iterates an array to check if it's a `pathArray`
 * with all C (cubic bezier) segments.
 *
 * @param {string | SVGPathCommander.pathArray} path the `Array` to be checked
 * @returns {boolean} iteration result
 */
export default function isCurveArray(path) {
  // @ts-ignore -- `isPathArray` also checks if it's `Array`
  return isPathArray(path) && path.every((seg) => 'MC'.includes(seg[0]));
}
