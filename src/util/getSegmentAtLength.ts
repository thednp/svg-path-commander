import type { PathArray, PathSegment } from "../types.ts";
import { getPropertiesAtLength } from "./getPropertiesAtLength.ts";

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
