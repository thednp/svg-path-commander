import type { NormalArray, PathArray } from "../types.ts";
import { normalizePath } from "../process/normalizePath.ts";
import { buildPathLengthTable, getPointAtTable } from "./pathLengthTable.ts";

/**
 * Returns [x,y] coordinates of a point at a given length along a path.
 *
 * @param pathInput - The PathArray or path string to look into
 * @param distance - The distance along the path
 * @returns The requested {x, y} point coordinates
 *
 * @example
 * ```ts
 * getPointAtLength('M0 0L100 0L100 100Z', 50)
 * // => { x: 50, y: 0 }
 * ```
 */
export const getPointAtLength = <T extends PathArray>(
  pathInput: string | T,
  distance?: number,
): { x: number; y: number } => {
  return getPointAtNormalizedLength(normalizePath(pathInput), distance);
};

/**
 * Returns [x,y] coordinates of a point at a given length along a path
 * that is already normalized.
 *
 * The normalization is the expensive part of the lookup, so it is kept
 * out of this function: a caller that already has a normalized path does
 * not have to normalize it again for every point it looks up.
 *
 * @param path - The normalized PathArray to look into
 * @param distance - The distance along the path
 * @returns The requested {x, y} point coordinates
 */
export const getPointAtNormalizedLength = (
  path: NormalArray,
  distance?: number,
): { x: number; y: number } => {
  return getPointAtTable(buildPathLengthTable(path), distance);
};
