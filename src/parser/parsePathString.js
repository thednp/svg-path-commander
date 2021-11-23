import scanSegment from './scanSegment';
import skipSpaces from './skipSpaces';
import invalidPathValue from './invalidPathValue';
import clonePath from '../process/clonePath';
import SVGPathArray from './svgPathArray';
import isPathArray from '../util/isPathArray';

/**
 * Parses a path string value and returns an array
 * of segments we like to call `pathArray`.
 *
 * @param {string | SVGPC.pathArray} pathInput the string to be parsed
 * @returns {SVGPC.pathArray} the resulted `pathArray`
 */
export default function parsePathString(pathInput) {
  if (isPathArray(pathInput)) {
    return clonePath(pathInput);
  }

  const path = new SVGPathArray(pathInput);

  skipSpaces(path);

  while (path.index < path.max && !path.err.length) {
    scanSegment(path);
  }

  if (path.err.length) {
    path.segments = [];
  } else if (path.segments.length) {
    if ('mM'.indexOf(path.segments[0][0]) < 0) {
      path.err = `${invalidPathValue}: missing M/m`;
      path.segments = [];
    } else {
      path.segments[0][0] = 'M';
    }
  }

  return path.segments;
}
