import type { Point } from "../types.ts";
import { distanceToSegment } from "./distanceToSegment.ts";

/**
 * Returns the number of times a ray from a point crosses a polygon.
 *
 * The ray goes to the right, so every edge of the polygon that crosses the
 * height of the point after it is counted. The parity of the count is the
 * answer of the `evenodd` fill rule.
 *
 * @param polygon - the polygon to test
 * @param point - the point to test
 * @returns the number of crossings
 */
export const getPolygonCrossings = (polygon: Point[], point: Point): number => {
  const { x, y } = point;
  const count = polygon.length;
  let crossings = 0;

  for (let i = 0; i < count; i += 1) {
    const j = (i + 1) % count;
    const current = polygon[i];
    const next = polygon[j];
    // the edge is on one side of the height of the point, it does not cross
    if (current.y > y === next.y > y) continue;
    // the X of the edge at the height of the point
    const at = ((next.x - current.x) * (y - current.y)) / (next.y - current.y) + current.x;
    // the crossing is after the point, the ray reaches it
    if (x < at) crossings += 1;
  }

  return crossings;
};

/**
 * Returns the winding number of a polygon around a point.
 *
 * Every edge that crosses the height of the point counts, the direction of
 * the crossing decides the sign of the count. The winding number is zero
 * outside of the polygon and it is not zero inside of it, whatever the
 * direction of the polygon is, so its sign is the direction of the shape.
 *
 * @param polygon - the polygon to test
 * @param point - the point to test
 * @returns the winding number
 */
export const getPolygonWindingNumber = (polygon: Point[], point: Point): number => {
  const { x, y } = point;
  const count = polygon.length;
  let winding = 0;

  for (let i = 0; i < count; i += 1) {
    const j = (i + 1) % count;
    const current = polygon[i];
    const next = polygon[j];
    // the side of the point relative to the edge
    const side = (next.x - current.x) * (y - current.y) - (next.y - current.y) * (x - current.x);
    if (current.y <= y) {
      // an upward crossing
      if (next.y > y && side > 0) winding += 1;
    } else if (next.y <= y && side < 0) {
      // a downward crossing
      winding -= 1;
    }
  }

  return winding;
};

/**
 * Checks if a point is on the boundary of a polygon.
 *
 * @param polygon - the polygon to test
 * @param point - the point to test
 * @param epsilon - the maximum distance to the boundary
 * @returns whether the point is on the boundary
 */
export const isPointOnPolygon = (polygon: Point[], point: Point, epsilon: number): boolean => {
  const count = polygon.length;

  for (let i = 0; i < count; i += 1) {
    const j = (i + 1) % count;
    if (distanceToSegment(point, polygon[i], polygon[j]) <= epsilon) {
      return true;
    }
  }

  return false;
};
