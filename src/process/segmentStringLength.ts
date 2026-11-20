import type { PathSegment } from "../types.ts";

/**
 * Returns the length of the string representation of a path segment.
 *
 * The string of a segment is its command followed by its values, without a
 * separator, so its length is the length of the command plus the length of
 * every value. The string itself is not needed to know its length, so it is
 * not built.
 *
 * @param segment - The path segment to measure
 * @returns The length of the string of the segment
 */
export const segmentStringLength = (segment: PathSegment): number => {
  let length = String(segment[0]).length;
  for (let i = 1; i < segment.length; i += 1) {
    length += String(segment[i]).length;
  }
  return length;
};
