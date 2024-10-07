import type { PathArray } from '../types';
import pathFactory from './pathFactory';

/**
 * Returns [x,y] coordinates of a point at a given length of a shape.
 *
 * @param pathInput the `pathArray` to look into
 * @param distance the length of the shape to look at
 * @returns the requested {x, y} point coordinates
 */
const getPointAtLength = (pathInput: string | PathArray, distance: number) => {
  return pathFactory(pathInput, distance).point;
};
export default getPointAtLength;
