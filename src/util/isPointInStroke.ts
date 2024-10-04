import defaultOptions from '../options/options';
import type { PathArray } from '../types';
import getPropertiesAtPoint from './getPropertiesAtPoint';

/**
 * Checks if a given point is in the stroke of a path.
 *
 * @param pathInput target path
 * @param point the given `{x,y}` point
 * @param sampleSize the scan resolution
 * @returns the query result
 */
const isPointInStroke = (
  pathInput: string | PathArray,
  point: { x: number; y: number },
  sampleSize: number = defaultOptions.sampleSize,
) => {
  const { distance } = getPropertiesAtPoint(pathInput, point, sampleSize);
  return Math.abs(distance) < 0.001; // 0.01 might be more permissive
};
export default isPointInStroke;
