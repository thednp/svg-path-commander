import type { NormalArray, PathArray } from "../types.ts";
import { normalizeSegment } from "./normalizeSegment.ts";
import { parsePathString } from "../parser/parsePathString.ts";
import { paramsParser } from "../parser/paramsParser.ts";
import { iterate } from "./iterate.ts";

/**
 * Parses a path string or PathArray, then iterates the result for:
 * * converting segments to absolute values
 * * converting shorthand commands to their non-shorthand notation
 *
 * @param pathInput - The path string or PathArray
 * @returns The normalized PathArray
 *
 * @example
 * ```ts
 * normalizePath('M10 90s20 -80 40 -80s20 80 40 80')
 * // => [['M', 10, 90], ['C', 30, 90, 25, 10, 50, 10], ['C', 75, 10, 70, 90, 90, 90]]
 * ```
 */
export const normalizePath = <T extends string | PathArray>(
  pathInput: T,
): NormalArray => {
  const path = parsePathString(pathInput);
  const params = { ...paramsParser };

  return iterate(path, (seg, _, lastX, lastY) => {
    params.x = lastX;
    params.y = lastY;
    const result = normalizeSegment(seg, params);

    const seglen = result.length;
    params.x1 = +result[seglen - 2];
    params.y1 = +result[seglen - 1];
    params.x2 = +result[seglen - 4] || params.x1;
    params.y2 = +result[seglen - 3] || params.y1;

    return result;
  }) as NormalArray;
};
