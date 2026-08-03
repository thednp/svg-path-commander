import type { PathArray } from "../types.ts";
import { getPropertiesAtPoint } from "./getPropertiesAtPoint.ts";

/**
 * Returns the point in path closest to a given point.
 *
 * @param pathInput target `pathArray`
 * @param point the given point
 * @returns the best match
 */
export const getClosestPoint = (
  pathInput: string | PathArray,
  point: { x: number; y: number },
): { x: number; y: number } => {
  return getPropertiesAtPoint(pathInput, point).closest;
};
