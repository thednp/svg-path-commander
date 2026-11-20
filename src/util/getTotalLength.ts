import type { PathArray } from "../types.ts";
import { measureSegments } from "./measureSegments.ts";

/**
 * Returns the total length of a path, equivalent to `shape.getTotalLength()`.
 *
 * @param pathInput - The target path string or PathArray
 * @returns the total length of the path
 *
 * @example
 * ```ts
 * getTotalLength('M0 0L100 0L100 100L0 100Z')
 * // => 300
 * ```
 */
export const getTotalLength = <T extends PathArray>(pathInput: string | T): number => {
  const measures = measureSegments(pathInput);
  const last = measures[measures.length - 1];
  return last ? last.lengthAtSegment + last.length : 0;
};
