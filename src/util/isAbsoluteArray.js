import isPathArray from './isPathArray';

/**
 * Iterates an array to check if it's a `pathArray`
 * with all absolute values.
 *
 * @param {string | SVGPathCommander.pathArray} path the `pathArray` to be checked
 * @returns {boolean} iteration result
 */
export default function isAbsoluteArray(path) {
  return isPathArray(path)
    // @ts-ignore -- `isPathArray` also checks if it's `Array`
    && path.every((x) => x[0] === x[0].toUpperCase());
}
