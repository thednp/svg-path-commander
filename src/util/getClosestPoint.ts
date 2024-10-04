import defaultOptions from '../options/options';
import type { PathArray } from '../types';
import getPropertiesAtPoint from './getPropertiesAtPoint';

/**
 * Returns the point in path closest to a given point.
 *
 * @param pathInput target `pathArray`
 * @param point the given point
 * @param sampleSize the scan resolution
 * @returns the best match
 */
const getClosestPoint = (
  pathInput: string | PathArray,
  point: { x: number; y: number },
  sampleSize: number | undefined = defaultOptions.sampleSize,
) => {
  return getPropertiesAtPoint(pathInput, point, sampleSize).closest;
};

export default getClosestPoint;
