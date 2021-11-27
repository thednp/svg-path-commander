import scanSegment from '../parser/scanSegment';
import skipSpaces from '../parser/skipSpaces';
import PathParser from '../parser/pathParser';

/**
 * Parses a path string value to determine its validity
 * then returns true if it's valid or false otherwise.
 *
 * @param {string} pathString the path string to be parsed
 * @returns {boolean} the path string validity
 */
export default function isValidPath(pathString) {
  if (typeof pathString !== 'string') {
    return false;
  }

  const path = new PathParser(pathString);

  skipSpaces(path);

  while (path.index < path.max && !path.err.length) {
    scanSegment(path);
  }

  return !path.err.length && 'mM'.includes(path.segments[0][0]);
}
