import paramsCount from '../parser/paramsCount';
import isPathArray from './isPathArray';

/**
 * Iterates an array to check if it's a `pathArray`
 * with all segments are in non-shorthand notation
 * with absolute values.
 *
 * @param {string | svgpcNS.pathArray} path the `pathArray` to be checked
 * @returns {boolean} iteration result
 */
export default function isNormalizedArray(path) {
  return Array.isArray(path) && isPathArray(path) && path.every((seg) => {
    const lk = seg[0].toLowerCase();
    return paramsCount[lk] === seg.length - 1 && ('ACLMQZ').includes(seg[0]); // achlmqstvz
  });
}
