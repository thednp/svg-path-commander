import type { PathArray } from '../types';
import getPropertiesAtPoint from './getPropertiesAtPoint';
import DISTANCE_EPSILON from './distanceEpsilon';

/**
 * Checks if a given point is in the stroke of a path.
 *
 * @param pathInput target path
 * @param point the given `{x,y}` point
 * @returns the query result
 */
const isPointInStroke = (pathInput: string | PathArray, point: { x: number; y: number }) => {
  const { distance } = getPropertiesAtPoint(pathInput, point);
  return Math.abs(distance) < DISTANCE_EPSILON; // 0.01 might be more permissive
};
export default isPointInStroke;
