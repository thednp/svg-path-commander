import type { RelativeArray } from "../types.ts";
import { isPathArray } from "./isPathArray.ts";

/**
 * Iterates an array to check if it's a `pathArray`
 * with relative values.
 *
 * @param path the `pathArray` to be checked
 * @returns iteration result
 */
export const isRelativeArray = (path: unknown): path is RelativeArray => {
  return (
    isPathArray(path) &&
    // `isPathArray` checks if it's `Array`
    path.slice(1).every(([pc]) => pc === pc.toLowerCase())
  );
};
