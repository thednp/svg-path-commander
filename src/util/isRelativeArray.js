import isPathArray from './isPathArray';

/**
 * Iterates an array to check if it's a `pathArray`
 * with relative values.
 *
 * @param {SVGPathCommander.pathArray} path the `pathArray` to be checked
 * @returns {boolean} iteration result
 */
export default function isRelativeArray(path) {
  return isPathArray(path)
    && path.slice(1).every((seg) => seg[0] === seg[0].toLowerCase());
}
