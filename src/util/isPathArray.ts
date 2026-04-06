import type { PathArray, PathSegment, RelativeCommand } from "../types";
import { paramsCounts } from "../parser/paramsCount";

/**
 * Iterates an array to check if it's an actual `pathArray`.
 *
 * @param path the `pathArray` to be checked
 * @returns iteration result
 */
export const isPathArray = (path: unknown): path is PathArray => {
  return (
    Array.isArray(path) &&
    path.every((seg: PathSegment) => {
      const lk = seg[0].toLowerCase() as RelativeCommand;
      return (
        paramsCounts[lk] === seg.length - 1 &&
        "achlmqstvz".includes(lk) &&
        (seg.slice(1) as unknown[]).every(Number.isFinite)
      );
    }) &&
    path.length > 0
  );
};
