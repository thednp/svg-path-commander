import type { SegmentProperties } from "../interface";
import type { PathArray } from "../types";
import { getPropertiesAtPoint } from "./getPropertiesAtPoint";

/**
 * Returns the path segment which contains a given point.
 *
 * @param path the `pathArray` to look into
 * @param point the point of the shape to look for
 * @returns the requested segment
 */
export const getSegmentOfPoint = <T extends PathArray>(
  path: string | T,
  point: { x: number; y: number },
): SegmentProperties | undefined => {
  return getPropertiesAtPoint(path, point).segment;
};
