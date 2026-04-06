import type { AbsoluteArray, PathArray } from "../types";
import { parsePathString } from "../parser/parsePathString";
import { absolutizeSegment } from "../process/absolutizeSegment";
import { iterate } from "../process/iterate";

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
export const pathToAbsolute = <T extends PathArray>(pathInput: string | T) => {
  const path = parsePathString(pathInput);

  return iterate(path, absolutizeSegment) as AbsoluteArray;
};
