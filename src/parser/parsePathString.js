import scanSegment from './scanSegment';
import skipSpaces from './skipSpaces';
import error from './error';
import clonePath from '../process/clonePath';
import PathParser from './pathParser';
import isPathArray from '../util/isPathArray';

/**
 * Parses a path string value and returns an array
 * of segments we like to call `pathArray`.
 *
 * @param {SVGPath.pathArray | string} pathInput the string to be parsed
 * @returns {SVGPath.pathArray | string} the resulted `pathArray`
 */
export default function parsePathString(pathInput) {
  if (isPathArray(pathInput)) {
    // @ts-ignore -- isPathArray also checks if it's an `Array`
    return clonePath(pathInput);
  }

  // @ts-ignore -- pathInput is now string
  const path = new PathParser(pathInput);

  skipSpaces(path);

  while (path.index < path.max && !path.err.length) {
    scanSegment(path);
  }

  if (!path.err.length) {
    if (!'mM'.includes(path.segments[0][0])) {
      path.err = `${error}: missing M/m`;
    } else {
      path.segments[0][0] = 'M';
    }
  }

  return path.err ? path.err : path.segments;
}
