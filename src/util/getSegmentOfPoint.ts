import defaultOptions from '../options/options';
import type { SegmentProperties } from '../interface';
import type { PathArray } from '../types';
import getPropertiesAtPoint from './getPropertiesAtPoint';

/**
 * Returns the path segment which contains a given point.
 *
 * @param path the `pathArray` to look into
 * @param point the point of the shape to look for
 * @param sampleSize the scan resolution
 * @returns the requested segment
 */
const getSegmentOfPoint = (
  path: string | PathArray,
  point: { x: number; y: number },
  sampleSize: number | undefined = defaultOptions.sampleSize,
): SegmentProperties | undefined => {
  return getPropertiesAtPoint(path, point, sampleSize).segment;
};
export default getSegmentOfPoint;
