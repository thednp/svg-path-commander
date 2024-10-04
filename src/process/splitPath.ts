import type { PathArray } from '../types';

/**
 * Split a path into an `Array` of sub-path strings.
 *
 * In the process, values are converted to absolute
 * for visual consistency.
 *
 * @param pathInput the source `pathArray`
 * @return {SVGPath.pathArray[]} an array with all sub-path strings
 */
const splitPath = (pathInput: PathArray): PathArray[] => {
  const composite = [] as PathArray[];
  let path: PathArray;
  let pi = -1;

  pathInput.forEach(seg => {
    if (seg[0] === 'M') {
      path = [seg];
      pi += 1;
    } else {
      path.push(seg);
    }
    composite[pi] = path;
  });

  return composite;
};
export default splitPath;
