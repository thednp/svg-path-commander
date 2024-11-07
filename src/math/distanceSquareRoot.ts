import { type PointTuple } from "../types";

/**
 * Returns the square root of the distance
 * between two given points.
 *
 * @param a the first point coordinates
 * @param b the second point coordinates
 * @returns the distance value
 */
const distanceSquareRoot = (a: PointTuple, b: PointTuple) => {
  return Math.sqrt(
    (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]),
  );
};

export default distanceSquareRoot;
