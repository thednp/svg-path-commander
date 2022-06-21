import isNormalizedArray from './isNormalizedArray';

/**
 * Iterates an array to check if it's a `pathArray`
 * with all C (cubic bezier) segments.
 *
 * @param {string | SVGPath.pathArray} path the `Array` to be checked
 * @returns {boolean} iteration result
 */
export default function isCurveArray(path) {
  // `isPathArray` also checks if it's `Array`
  return isNormalizedArray(path) && path.every(([pc]) => 'MC'.includes(pc));
}
