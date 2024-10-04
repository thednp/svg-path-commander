import scanSegment from './scanSegment';
import skipSpaces from './skipSpaces';
import PathParser from './pathParser';
import isPathArray from '../util/isPathArray';
import type { PathArray } from '../types';

/**
 * Parses a path string value and returns an array
 * of segments we like to call `pathArray`.
 *
 * @param pathInput the string to be parsed
 * @returns the resulted `pathArray` or error string
 */
const parsePathString = (pathInput: string | PathArray): PathArray => {
  if (isPathArray(pathInput)) {
    return pathInput.slice(0) as PathArray;
  }

  const path = new PathParser(pathInput);

  skipSpaces(path);

  while (path.index < path.max && !path.err.length) {
    scanSegment(path);
  }

  if (path.err && path.err.length) {
    throw TypeError(path.err);
  }

  return path.segments as PathArray;
};

export default parsePathString;
