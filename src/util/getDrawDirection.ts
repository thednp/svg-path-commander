import getPathArea from "./getPathArea";
import pathToCurve from "../convert/pathToCurve";
import type { PathArray } from "../types";

/**
 * Check if a path is drawn clockwise and returns true if so,
 * false otherwise.
 *
 * @param path the path string or `pathArray`
 * @returns true when clockwise or false if not
 */
const getDrawDirection = (path: string | PathArray) => {
  return getPathArea(pathToCurve(path)) >= 0;
};

export default getDrawDirection;
