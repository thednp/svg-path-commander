import parsePathString from '../parser/parsePathString';
import normalizePath from './normalizePath';

/**
 * Checks a `pathArray` for an unnecessary `Z` segment
 * and returns a new `pathArray` without it.
 *
 * The `pathInput` must be a single path, without
 * sub-paths. For multi-path `<path>` elements,
 * use `splitPath` first and apply this utility on each
 * sub-path separately.
 *
 * @param {SVGPath.pathArray | string} pathInput the `pathArray` source
 * @return {SVGPath.pathArray} a fixed `pathArray`
 */
export default function fixPath(pathInput) {
  const pathArray = parsePathString(pathInput);
  const normalArray = normalizePath(pathArray);
  const { length } = pathArray;
  const isClosed = normalArray.slice(-1)[0][0] === 'Z';
  const segBeforeZ = isClosed ? length - 2 : length - 1;

  const [mx, my] = normalArray[0].slice(1);
  const [x, y] = normalArray[segBeforeZ].slice(-2);

  /* istanbul ignore else */
  if (isClosed && mx === x && my === y) {
    return pathArray.slice(0, -1);
  }
  return pathArray;
}
