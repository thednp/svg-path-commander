import type { NormalArray } from "../types";
import { isAbsoluteArray } from "./isAbsoluteArray";

/**
 * Iterates an array to check if it's a `pathArray`
 * with all segments in non-shorthand notation
 * with absolute values.
 *
 * @param path - the array to be checked
 * @returns true if the array is a normalized path array
 */
export const isNormalizedArray = (path: unknown): path is NormalArray => {
  // `isAbsoluteArray` also checks if it's `Array`
  return isAbsoluteArray(path) && path.every(([pc]) => "ACLMQZ".includes(pc));
};
