import parsePathString from '../parser/parsePathString';
import absolutizeSegment from '../process/absolutizeSegment';
import type { AbsoluteArray, PathArray } from '../types';
import iterate from '../process/iterate';

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to absolute values.
 *
 * @param pathInput the path string | object
 * @returns the resulted `pathArray` with absolute values
 */
const pathToAbsolute = (pathInput: string | PathArray) => {
  const path = parsePathString(pathInput);

  return iterate<AbsoluteArray>(path, absolutizeSegment);
};
export default pathToAbsolute;
