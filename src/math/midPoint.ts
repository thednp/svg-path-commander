import { PointTuple } from "../types";

/**
 * Returns the coordinates of a specified distance
 * ratio between two points.
 *
 * @param a the first point coordinates
 * @param b the second point coordinates
 * @param t the ratio
 * @returns the midpoint coordinates
 */
export const midPoint = (
  [ax, ay]: PointTuple,
  [bx, by]: PointTuple,
  t: number,
): PointTuple => {
  return [ax + (bx - ax) * t, ay + (by - ay) * t];
};
