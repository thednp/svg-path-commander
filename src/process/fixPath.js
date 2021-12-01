import parsePathString from '../parser/parsePathString';
import pathToAbsolute from '../convert/pathToAbsolute';

/**
 * Checks a `pathArray` for an unnecessary `Z` segment
 * and returns a new `pathArray` without it.
 *
 * The `pathInput` must be a single path, without
 * sub-paths. For multi-path `<path>` elements,
 * use `splitPath` first and apply this utility on each
 * sub-path separately.
 *
 * @param {SVGPathCommander.pathArray | string} pathInput the `pathArray` source
 * @return {SVGPathCommander.pathArray} a fixed `pathArray`
 */
export default function fixPath(pathInput) {
  const pathArray = parsePathString(pathInput);
  const absoluteArray = pathToAbsolute(pathArray);
  const { length } = pathArray;
  const isClosed = absoluteArray.slice(-1)[0][0] === 'Z';
  const segBeforeZ = isClosed ? length - 2 : length - 1;

  const [x1, y1] = absoluteArray[0].slice(1);
  const [x2, y2] = absoluteArray[segBeforeZ].slice(1);

  if (isClosed && x1 === x2 && y1 === y2) {
    return pathArray.slice(0, -1);
  }
  return pathArray;
}
