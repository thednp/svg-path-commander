import type { BBoxMaxima, PointTuple } from "../types.ts";

/**
 * Checks if a point is inside a bounding box.
 *
 * @param bbox - The bounding box as [minX, minY, maxX, maxY]
 * @param point - The point as [x, y]
 * @returns True if the point is inside or on the edge of the bounding box
 */
export const isPointInsideBBox = (
  bbox: BBoxMaxima,
  [x, y]: PointTuple,
): boolean => {
  const [minX, minY, maxX, maxY] = bbox;
  return x >= minX && x <= maxX && y >= minY && y <= maxY;
};
