import type { PathSegment } from "../types.ts";
import { roundTo } from "../math/roundTo.ts";

/**
 * Rounds the numeric values of a path segment to the specified precision.
 *
 * @param segment - The path segment to round
 * @param roundOption - Number of decimal places
 * @returns The rounded segment
 */
export const roundSegment = <T extends PathSegment>(segment: T, roundOption: number): T => {
  // the rounded segment is built in one pass: a copy of the segment, a map
  // over its values and a concatenation would allocate three arrays
  const result = new Array(segment.length) as unknown as T;
  for (let i = 0; i < segment.length; i += 1) {
    result[i] = (i === 0 ? segment[0] : roundTo(segment[i] as number, roundOption)) as T[number];
  }
  return result;
};
