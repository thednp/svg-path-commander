import { getPathArea } from "./getPathArea.ts";
import { pathToCurve } from "../convert/pathToCurve.ts";
import type { PathArray } from "../types.ts";

/**
 * Check if a path is drawn clockwise and returns true if so,
 * false otherwise.
 *
 * @param path the path string or `pathArray`
 * @returns true when clockwise or false if not
 */
export const getDrawDirection = (path: string | PathArray): boolean => {
  return getPathArea(pathToCurve(path)) >= 0;
};
