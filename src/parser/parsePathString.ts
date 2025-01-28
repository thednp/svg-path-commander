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

  // handle valid paths first
  // handle errors second
  if (!path.err.length) {
    if (path.segments.length) {
      /**
       * force absolute first M
       * getPathBBox calculation requires first segment to be absolute
       * @see https://github.com/thednp/svg-path-commander/pull/49
       */
      path.segments[0][0] = "M";
    }
  } else {
    throw TypeError(path.err);
  }

  return path.segments as PathArray;
};

export default parsePathString;
