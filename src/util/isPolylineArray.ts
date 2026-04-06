import { isNormalizedArray } from "./isNormalizedArray";
import { PathArray, PolylineArray } from "../types";
/**
 * Checks if a path is a polyline (only M, L, H, V commands).
 * @param pathArray PathArray (pre-normalize if needed)
 * @returns boolean
 */
export function isPolylineArray(path: PathArray): path is PolylineArray {
  return isNormalizedArray(path) && path.every(([pc]) => "MLVH".includes(pc));
}
