// src/morph/fixPath.ts
import type { PathArray } from "../types";
import { parsePathString } from "../parser/parsePathString";
import { normalizePath } from "../process/normalizePath";
import { isClosedPath } from "../util/isClosedPath";

/**
 * Checks a `PathArray` for an unnecessary `Z` segment
 * and returns a new `PathArray` without it.
 * In short, if the segment before `Z` extends to `M`,
 * the `Z` segment must be removed.
 *
 * The `pathInput` must be a single path, without
 * sub-paths. For multi-path `<path>` elements,
 * use `splitPath` first and apply this utility on each
 * sub-path separately.
 *
 * @param pathInput the `pathArray` source
 * @returns void
 */
export const fixPath = <T extends PathArray>(pathInput: T | string) => {
  const pathArray = parsePathString(pathInput);

  /* istanbul ignore else */
  if (isClosedPath(pathArray)) {
    const normalArray = normalizePath(pathArray);
    const length = pathArray.length;
    const segBeforeZ = length - 2;
    const [mx, my] = normalArray[0].slice(1);
    const [x, y] = normalArray[segBeforeZ].slice(-2);

    if (mx === x && my === y) {
      pathArray.splice(length - 1, 1);
    }
  }
};
