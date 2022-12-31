import type { PathArray } from '../types';
import pathLengthFactory from './pathLengthFactory';

/**
 * Returns [x,y] coordinates of a point at a given length of a shape.
 *
 * @param pathInput the `pathArray` to look into
 * @param distance the length of the shape to look at
 * @returns the requested {x, y} point coordinates
 */
const getPointAtLength = (pathInput: string | PathArray, distance: number): { x: number; y: number } => {
  return pathLengthFactory(pathInput, distance).point;
};
export default getPointAtLength;
