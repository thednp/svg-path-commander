import { isNormalizedArray } from "./isNormalizedArray.ts";
import type { PathArray, PolygonArray } from "../types.ts";
/**
 * Checks if a path is a polygon (only M, L, H, V, Z commands).
 * @param pathArray PathArray (pre-normalize if needed)
 * @returns boolean
 */
export const isPolygonArray = (path: PathArray): path is PolygonArray => {
  return isNormalizedArray(path) && path.every(([pc]) => "MLVHZ".includes(pc));
};
