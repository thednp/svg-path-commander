import scanSegment from './scanSegment';
import skipSpaces from './skipSpaces';
import clonePath from '../process/clonePath';
import PathParser from './pathParser';
import isPathArray from '../util/isPathArray';

/**
 * Parses a path string value and returns an array
 * of segments we like to call `pathArray`.
 *
 * @param {SVGPath.pathArray | string} pathInput the string to be parsed
 * @returns {SVGPath.pathArray | string} the resulted `pathArray` or error string
 */
export default function parsePathString(pathInput) {
  if (isPathArray(pathInput)) {
    return clonePath(pathInput);
  }

  const path = new PathParser(pathInput);

  skipSpaces(path);

  while (path.index < path.max && !path.err.length) {
    scanSegment(path);
  }

  return path.err ? path.err : path.segments;
}
