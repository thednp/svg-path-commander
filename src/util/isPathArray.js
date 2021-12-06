import paramsCount from '../parser/paramsCount';

/**
 * Iterates an array to check if it's an actual `pathArray`.
 *
 * @param {string | SVGPathCommander.pathArray} path the `pathArray` to be checked
 * @returns {boolean} iteration result
 */
export default function isPathArray(path) {
  return Array.isArray(path) && path.every((seg) => {
    const lk = seg[0].toLowerCase();
    return paramsCount[lk] === seg.length - 1 && 'achlmqstvz'.includes(lk);
  });
}
