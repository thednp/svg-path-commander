import scanSegment from './scanSegment';
import skipSpaces from './skipSpaces';
import invalidPathValue from './invalidPathValue';
import clonePath from '../process/clonePath';
import PathParser from './pathParser';
import isPathArray from '../util/isPathArray';

/**
 * Parses a path string value and returns an array
 * of segments we like to call `pathArray`.
 *
 * @param {SVGPathCommander.pathArray | string} pathInput the string to be parsed
 * @returns {SVGPathCommander.pathArray} the resulted `pathArray`
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

  if (path.err.length) {
    // @ts-ignore
    path.segments = [];
  } else if (path.segments.length) {
    if (!'mM'.includes(path.segments[0][0])) {
      path.err = `${invalidPathValue}: missing M/m`;
      // @ts-ignore
      path.segments = [];
    } else {
      path.segments[0][0] = 'M';
    }
  }

  return path.segments;
}
