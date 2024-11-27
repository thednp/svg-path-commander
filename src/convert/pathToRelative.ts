import type { PathArray, RelativeArray } from "../types";
import parsePathString from "../parser/parsePathString";
import iterate from "../process/iterate";
import relativizeSegment from "../process/relativizeSegment";

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to relative values.
 *
 * @param pathInput the path string | object
 * @returns the resulted `pathArray` with relative values
 */
const pathToRelative = (pathInput: string | PathArray): RelativeArray => {
  const path = parsePathString(pathInput);

  return iterate<RelativeArray>(path, relativizeSegment);
};
export default pathToRelative;
