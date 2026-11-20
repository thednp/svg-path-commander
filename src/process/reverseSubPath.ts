import type { PathArray } from "../types.ts";
import { error } from "../util/error.ts";
import { splitPath } from "./splitPath.ts";
import { reversePath } from "./reversePath.ts";

/**
 * Reverses the sub-path at a given index of a path.
 *
 * The other sub-paths are left untouched, and the result holds absolute
 * values.
 *
 * @param pathInput - the path string or `PathArray`
 * @param index - the zero-based index of the sub-path to reverse
 * @returns the path with the sub-path reversed
 *
 * @example
 * ```ts
 * reverseSubPath('M0 0L100 0ZM0 100L100 100', 1)
 * // => [
 * // //   ['M', 0, 0], ['L', 100, 0],
 * // //   ['M', 100, 100], ['L', 0, 100]
 * // // ]
 * ```
 */
export const reverseSubPath = (pathInput: string | PathArray, index: number): PathArray => {
  const subPaths = splitPath(pathInput);

  if (!Number.isInteger(index) || index < 0 || index >= subPaths.length) {
    throw TypeError(`${error}: index must be a number within the range of the sub-paths`);
  }

  const reversed = reversePath(subPaths[index] as PathArray);

  return [...subPaths.slice(0, index), reversed, ...subPaths.slice(index + 1)].flat() as PathArray;
};
