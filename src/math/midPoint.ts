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
const midPoint = (a: PointTuple, b: PointTuple, t: number): PointTuple => {
  const [ax, ay] = a;
  const [bx, by] = b;
  return [ax + (bx - ax) * t, ay + (by - ay) * t];
};

export default midPoint;
