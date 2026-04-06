import { type PathArray } from "../types";
import { error } from "./error";
import { isPathArray } from "./isPathArray";

/**
 * Determines if an SVG path contains multiple subpaths.
 * Accepts path string or PathArray.
 * @param path - 'M10,10 L20,20 Z M30,30 L40,40' → true
 * @returns boolean
 */
export const isMultiPath = <T extends PathArray>(
  path: string | T,
): boolean => {
  if (typeof path === "string") {
    // Count all 'M' and 'm' occurrences
    const matches = path.match(/[Mm]/g);
    return matches ? matches.length > 1 : false;
  }

  // istanbul ignore else
  if (isPathArray(path)) {
    let moveCount = 0;
    for (const segment of path) {
      if (segment[0].toUpperCase() === "M") {
        moveCount++;
        if (moveCount > 1) return true;
      }
    }
    return false;
  }

  throw new TypeError(error + ": expected string or PathArray");
};
