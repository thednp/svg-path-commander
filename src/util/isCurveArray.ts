import { CurveArray } from "../types";
import isNormalizedArray from "./isNormalizedArray";

/**
 * Iterates an array to check if it's a `pathArray`
 * with all C (cubic bezier) segments.
 *
 * @param path the `Array` to be checked
 * @returns iteration result
 */
const isCurveArray = (path: unknown): path is CurveArray => {
  // `isPathArray` also checks if it's `Array`
  return isNormalizedArray(path) && path.every(([pc]) => "MC".includes(pc));
};
export default isCurveArray;
