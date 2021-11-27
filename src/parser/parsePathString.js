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
 * @param {svgpcNS.pathArray | string} pathInput the string to be parsed
 * @returns {svgpcNS.pathArray} the resulted `pathArray`
 */
export default function parsePathString(pathInput) {
  if (isPathArray(pathInput)) {
    return clonePath(pathInput);
  }

  const path = new PathParser(`${pathInput}`); // TS expects string

  skipSpaces(path);

  while (path.index < path.max && !path.err.length) {
    scanSegment(path);
  }

  if (path.err.length) {
    path.segments = [];
  } else if (path.segments.length) {
    if (!'mM'.includes(path.segments[0][0])) {
      path.err = `${invalidPathValue}: missing M/m`;
      path.segments = [];
    } else {
      path.segments[0][0] = 'M';
    }
  }

  return path.segments;
}
