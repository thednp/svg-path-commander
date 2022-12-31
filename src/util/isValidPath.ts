import scanSegment from '../parser/scanSegment';
import skipSpaces from '../parser/skipSpaces';
import PathParser from '../parser/pathParser';

/**
 * Parses a path string value to determine its validity
 * then returns true if it's valid or false otherwise.
 *
 * @param pathString the path string to be parsed
 * @returns the path string validity
 */
const isValidPath = (pathString: string) => {
  if (typeof pathString !== 'string') {
    return false;
  }

  const path = new PathParser(pathString);

  skipSpaces(path);

  while (path.index < path.max && !path.err.length) {
    scanSegment(path);
  }

  return !path.err.length && 'mM'.includes(path.segments[0][0]);
};
export default isValidPath;
