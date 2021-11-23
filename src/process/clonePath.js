/**
 * Returns a clone of an existing `pathArray`.
 *
 * @param {SVGPC.pathArray} path the original `pathArray`
 * @returns {SVGPC.pathArray} the cloned `pathArray`
 */
export default function clonePath(path) {
  return path.map((x) => {
    if (Array.isArray(x)) {
      return clonePath(x);
    }
    return !Number.isNaN(+x) ? +x : x;
  });
}
