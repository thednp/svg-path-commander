import type { PathArray, RelativeArray } from "../types.ts";
import { parsePathString } from "../parser/parsePathString.ts";
import { iterate } from "../process/iterate.ts";
import { relativizeSegment } from "../process/relativizeSegment.ts";

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to relative values.
 *
 * @param pathInput - The path string or PathArray
 * @returns The resulted PathArray with relative values
 *
 * @example
 * ```ts
 * pathToRelative('M10 10L90 90')
 * // => [['M', 10, 10], ['l', 80, 80]]
 * ```
 */
export const pathToRelative = <T extends PathArray>(
  pathInput: string | T,
): RelativeArray => {
  const path = parsePathString(pathInput);

  return iterate(path, relativizeSegment) as RelativeArray;
};
