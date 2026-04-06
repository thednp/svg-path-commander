import type { PathArray, PathSegment } from "../types";
import { getPropertiesAtLength } from "./getPropertiesAtLength";

/**
 * Returns the segment at a given length.
 *
 * @param pathInput the target `pathArray`
 * @param distance the distance in path to look at
 * @returns the requested segment
 */
export const getSegmentAtLength = <T extends PathArray>(
  pathInput: string | T,
  distance?: number,
): PathSegment | undefined => {
  return getPropertiesAtLength(pathInput, distance).segment;
};
