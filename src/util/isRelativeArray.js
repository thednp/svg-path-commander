import isPathArray from './isPathArray';

/**
 * Iterates an array to check if it's a `pathArray`
 * with relative values.
 *
 * @param {string | SVGPath.pathArray} path the `pathArray` to be checked
 * @returns {boolean} iteration result
 */
export default function isRelativeArray(path) {
  return isPathArray(path)
    // `isPathArray` checks if it's `Array`
    && path.slice(1).every(([pc]) => pc === pc.toLowerCase());
}
