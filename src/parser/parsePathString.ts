import scanSegment from "./scanSegment";
import skipSpaces from "./skipSpaces";
import PathParser from "./pathParser";
import type { PathArray } from "../types";

/**
 * Parses a path string value and returns an array
 * of segments we like to call `pathArray`.
 *
 * @param pathInput the string to be parsed
 * @returns the resulted `pathArray` or error string
 */
const parsePathString = <T extends PathArray>(pathInput: string | T) => {
  if (typeof pathInput !== "string") {
    return pathInput.slice(0) as typeof pathInput;
  }

  const path = new PathParser(pathInput);

  skipSpaces(path);

  while (path.index < path.max && !path.err.length) {
    scanSegment(path);
  }

  if (path?.err.length) {
    throw TypeError(path.err);
  }

  return path.segments as PathArray;
};

export default parsePathString;
