import defaultOptions from '../options/options';
import type { PathArray, PathSegment } from '../types';
import getPropertiesAtLength from './getPropertiesAtLength';

/**
 * Returns the segment at a given length.
 *
 * @param pathInput the target `pathArray`
 * @param distance the distance in path to look at
 * @param sampleSize the scan resolution
 * @returns the requested segment
 */
const getSegmentAtLength = (
  pathInput: string | PathArray,
  distance?: number,
  sampleSize: number = defaultOptions.sampleSize,
): PathSegment | undefined => {
  return getPropertiesAtLength(pathInput, distance, sampleSize).segment;
};

export default getSegmentAtLength;
