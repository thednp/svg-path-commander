import type { PathArray } from '../types';
import getPropertiesAtPoint from './getPropertiesAtPoint';

/**
 * Returns the point in path closest to a given point.
 *
 * @param pathInput target `pathArray`
 * @param point the given point
 * @returns the best match
 */
const getClosestPoint = (pathInput: string | PathArray, point: { x: number; y: number }) => {
  return getPropertiesAtPoint(pathInput, point).closest;
};

export default getClosestPoint;
