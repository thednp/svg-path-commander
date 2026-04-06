import type { PathCommand, PathSegment } from "../types";
import { roundTo } from "../math/roundTo";

/**
 * Rounds the numeric values of a path segment to the specified precision.
 *
 * @param segment - The path segment to round
 * @param roundOption - Number of decimal places
 * @returns The rounded segment
 */
export const roundSegment = <T extends PathSegment>(
  segment: T,
  roundOption: number,
) => {
  const values = (segment.slice(1) as number[]).map((n) =>
    roundTo(n, roundOption)
  );
  return [segment[0] as PathCommand | number].concat(values) as T;
};
