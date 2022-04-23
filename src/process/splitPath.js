/**
 * Split a path into an `Array` of sub-path strings.
 *
 * In the process, values are converted to absolute
 * for visual consistency.
 *
 * @param {SVGPath.pathArray} pathInput the source `pathArray`
 * @return {SVGPath.pathArray[]} an array with all sub-path strings
 */
export default function splitPath(pathInput) {
  /** @type {SVGPath.pathArray[]} */
  const composite = [];
  /** @type {SVGPath.pathArray} */
  let path;
  let pi = -1;

  pathInput.forEach((seg) => {
    if (seg[0] === 'M') {
      path = [seg];
      pi += 1;
    } else {
      path = [...path, seg];
    }
    composite[pi] = path;
  });

  return composite;
}
