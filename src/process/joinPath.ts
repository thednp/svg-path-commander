import type { PathArray } from "../types.ts";
import { parsePathString } from "../parser/parsePathString.ts";
import { pathToAbsolute } from "../convert/pathToAbsolute.ts";

/**
 * Joins two paths into a single path with two sub-paths.
 *
 * Both paths have to be valid paths, so they begin with a moveto command,
 * and the result holds absolute values.
 *
 * @param pathA - the first path string or `PathArray`
 * @param pathB - the second path string or `PathArray`
 * @returns the joined path
 *
 * @example
 * ```ts
 * joinPath('M0 0L100 0', 'M0 100L100 100')
 * // => [
 * // //   ['M', 0, 0], ['L', 100, 0],
 * // //   ['M', 0, 100], ['L', 100, 100]
 * // // ]
 * ```
 */
export const joinPath = (pathA: string | PathArray, pathB: string | PathArray): PathArray => {
  const first = pathToAbsolute(parsePathString(pathA));
  const second = pathToAbsolute(parsePathString(pathB));

  return [...first, ...second] as PathArray;
};
