import type { PathArray, Point } from "../types.ts";
import type { StrokeOptions } from "../interface.ts";
import { getPropertiesAtPoint } from "./getPropertiesAtPoint.ts";
import { error } from "./error.ts";
import DISTANCE_EPSILON from "./distanceEpsilon.ts";

/**
 * Checks if a given point is in the stroke of a path.
 *
 * Without a width the point has to be on the path itself, within the
 * distance epsilon of it. With a width the stroke is the band around the
 * path: the point is in the stroke when it is at most half the width away
 * from the path. The ends of an open path are treated as if the stroke had
 * round caps, so a point beyond the end of the path is in the stroke too.
 *
 * @param pathInput target path
 * @param point the given `{x,y}` point
 * @param options the options of the test
 * @returns the query result
 *
 * @example
 * ```ts
 * isPointInStroke('M0 0L100 0', { x: 50, y: 0 });
 * // => true
 * isPointInStroke('M0 0L100 0', { x: 50, y: 5 }, { width: 10 });
 * // => true
 * ```
 */
export const isPointInStroke = <T extends PathArray>(
  pathInput: string | T,
  point: Point,
  options?: StrokeOptions,
): boolean => {
  const { width = 0 } = options ?? {};

  if (typeof width !== "number" || !Number.isFinite(width) || width < 0) {
    throw TypeError(`${error}: width must be a number greater than or equal to 0`);
  }

  const { distance } = getPropertiesAtPoint(pathInput, point);

  // without a width the point has to be on the path itself
  if (!width) return distance < DISTANCE_EPSILON;

  // the stroke is the band around the path
  return distance <= width / 2;
};
