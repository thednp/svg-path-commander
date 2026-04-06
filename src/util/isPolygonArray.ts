import { isNormalizedArray } from "./isNormalizedArray";
import { PathArray, PolygonArray } from "../types";
/**
 * Checks if a path is a polygon (only M, L, H, V, Z commands).
 * @param pathArray PathArray (pre-normalize if needed)
 * @returns boolean
 */
export const isPolygonArray = (path: PathArray): path is PolygonArray => {
  return isNormalizedArray(path) && path.every(([pc]) => "MLVHZ".includes(pc));
};
