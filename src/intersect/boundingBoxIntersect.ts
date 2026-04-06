import type { BBoxMaxima } from "../types.ts";

import { isPointInsideBBox } from "./isPointInsideBBox.ts";

/**
 * Checks if two bounding boxes intersect.
 *
 * @param a - First bounding box as [minX, minY, maxX, maxY]
 * @param b - Second bounding box as [minX, minY, maxX, maxY]
 * @returns True if the bounding boxes overlap
 */
export const boundingBoxIntersect = (a: BBoxMaxima, b: BBoxMaxima): boolean => {
  const [ax1, ay1, ax2, ay2] = a;
  const [bx1, by1, bx2, by2] = b;
  // return ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1;
  return (
    isPointInsideBBox(b, [ax1, ay1]) ||
    isPointInsideBBox(b, [ax2, ay1]) ||
    isPointInsideBBox(b, [ax1, ay2]) ||
    isPointInsideBBox(b, [ax2, ay2]) ||
    isPointInsideBBox(a, [bx1, by1]) ||
    isPointInsideBBox(a, [bx2, by1]) ||
    isPointInsideBBox(a, [bx1, by2]) ||
    isPointInsideBBox(a, [bx2, by2]) ||
    // edge overlap without corner inside
    (ax1 < bx2 && ax1 > bx1 || bx1 < ax2 && bx1 > ax1) &&
      (ay1 < by2 && ay1 > by1 || by1 < ay2 && by1 > ay1)
  );
};
