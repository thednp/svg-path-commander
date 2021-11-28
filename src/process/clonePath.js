/**
 * Returns a clone of an existing `pathArray`.
 *
 * @param {SVGPathCommander.pathArray | any[] | string} path the source `pathArray`
 * @returns {any} the cloned `pathArray`
 */
export default function clonePath(path) {
  return Array.isArray(path) ? path.map((x) => {
    if (Array.isArray(x)) {
      return clonePath(x);
    }
    return !Number.isNaN(+x) ? +x : x;
  }) : path;
}
