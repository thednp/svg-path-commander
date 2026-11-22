import type { NormalArray } from "../types.ts";

/**
 * Splits a normalized path into its sub-paths.
 *
 * A sub-path begins with a moveto command, so the path is split at every
 * moveto: the close segment of a sub-path belongs to the sub-path it closes.
 *
 * @param path - the normalized path to split
 * @returns the sub-paths of the path
 *
 * @example
 * ```ts
 * splitSubPaths([["M", 0, 0], ["L", 10, 0], ["Z"], ["M", 20, 0], ["L", 30, 0]]);
 * // => [
 * //   [["M", 0, 0], ["L", 10, 0], ["Z"]],
 * //   [["M", 20, 0], ["L", 30, 0]],
 * // ]
 * ```
 */
export const splitSubPaths = (path: NormalArray): NormalArray[] => {
  const result: NormalArray[] = [];
  let current: NormalArray = [] as unknown as NormalArray;
  for (const segment of path) {
    if (segment[0] === "M") {
      // the path is not empty, so the first sub-path is never missing
      if (current.length) result.push(current);
      current = [segment] as unknown as NormalArray;
    } else {
      current.push(segment);
    }
  }
  if (current.length) result.push(current);
  return result;
};
