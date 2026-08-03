import { scanSegment } from "../parser/scanSegment.ts";
import { skipSpaces } from "../parser/skipSpaces.ts";
import { PathParser } from "../parser/pathParser.ts";

/**
 * Parses a path string value to determine its validity
 * then returns true if it's valid or false otherwise.
 *
 * @param pathString the path string to be parsed
 * @returns the path string validity
 */
export const isValidPath = (pathString: string): boolean => {
  if (typeof pathString !== "string" || !pathString.length) {
    return false;
  }

  const path = new PathParser(pathString);

  skipSpaces(path);

  while (path.index < path.max && !path.err.length) {
    scanSegment(path);
  }

  return !path.err.length && "mM".includes(path.segments[0][0]);
};
