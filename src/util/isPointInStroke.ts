import type { PathArray } from "../types.ts";
import { getPropertiesAtPoint } from "./getPropertiesAtPoint.ts";
import DISTANCE_EPSILON from "./distanceEpsilon.ts";

/**
 * Checks if a given point is in the stroke of a path.
 *
 * @param pathInput target path
 * @param point the given `{x,y}` point
 * @returns the query result
 */
export const isPointInStroke = <T extends PathArray>(
  pathInput: string | T,
  point: { x: number; y: number },
): boolean => {
  const { distance } = getPropertiesAtPoint(pathInput, point);
  return Math.abs(distance) < DISTANCE_EPSILON; // 0.01 might be more permissive
};
