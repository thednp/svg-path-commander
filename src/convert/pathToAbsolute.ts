import type { AbsoluteArray, PathArray } from "../types.ts";
import { parsePathString } from "../parser/parsePathString.ts";
import { absolutizeSegment } from "../process/absolutizeSegment.ts";
import { iterate } from "../process/iterate.ts";

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to absolute values.
 *
 * @param pathInput - The path string or PathArray
 * @returns The resulted PathArray with absolute values
 *
 * @example
 * ```ts
 * pathToAbsolute('M10 10l80 80')
 * // => [['M', 10, 10], ['L', 90, 90]]
 * ```
 */
export const pathToAbsolute = <T extends PathArray>(
  pathInput: string | T,
): AbsoluteArray => {
  const path = parsePathString(pathInput);

  return iterate(path, absolutizeSegment) as AbsoluteArray;
};
