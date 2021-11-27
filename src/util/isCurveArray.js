import isPathArray from './isPathArray';

/**
 * Iterates an array to check if it's a `pathArray`
 * with all C (cubic bezier) segments.
 *
 * @param {string | svgpcNS.pathArray} path the `Array` to be checked
 * @returns {boolean} iteration result
 */
export default function isCurveArray(path) {
  return Array.isArray(path) && isPathArray(path)
    && path.slice(1).every((seg) => seg[0] === 'C');
}
