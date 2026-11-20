import { scanSegment } from "./scanSegment.ts";
import { skipSpaces } from "./skipSpaces.ts";
import { PathParser } from "./pathParser.ts";
import type { MSegment, PathArray } from "../types.ts";
import { error } from "../util/error.ts";

/**
 * Parses a path string value and returns an array
 * of segments we like to call `PathArray`.
 *
 * If parameter value is already a `PathArray`,
 * return a clone of it.
 *
 * A path must begin with a moveto command, so a path that starts with another
 * command is in error. A leading relative moveto is a pair of absolute
 * coordinates, so it is rewritten as an absolute one.
 *
 * @example
 * parsePathString("M 0 0L50 50")
 * // => [["M",0,0],["L",50,50]]
 *
 * @param pathInput the string to be parsed
 * @returns the resulted `pathArray` or error string
 */
export const parsePathString = <T extends PathArray>(pathInput: string | T): PathArray => {
  let path: PathArray;

  if (typeof pathInput !== "string") {
    path = pathInput.slice(0) as T;
  } else {
    const parser = new PathParser(pathInput);

    skipSpaces(parser);

    while (parser.index < parser.max && !parser.err.length) {
      scanSegment(parser);
    }

    // handle errors first
    if (parser.err.length) {
      throw TypeError(parser.err);
    }

    path = parser.segments as PathArray;
  }

  const first = path[0];
  // an empty path has no first segment
  if (!first) return path;

  // a malformed segment is reported by its index
  if (typeof first[0] !== "string") {
    throw new TypeError(`${error}: invalid path segment at index 0`);
  }

  if (first[0] === "m") {
    /**
     * force absolute first M
     * getPathBBox calculation requires first segment to be absolute
     * @see https://github.com/thednp/svg-path-commander/pull/49
     */
    // the copy keeps the caller's array untouched
    path[0] = ["M", first[1], first[2]] as MSegment;
  } else if (first[0] !== "M") {
    throw new TypeError(`${error}: path data must begin with a moveto command`);
  }

  return path;
};
