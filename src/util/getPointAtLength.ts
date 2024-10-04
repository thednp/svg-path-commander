import type { PathArray } from '../types';
import pathLengthFactory from './pathLengthFactory';
import defaultOptions from '../options/options';

/**
 * Returns [x,y] coordinates of a point at a given length of a shape.
 *
 * @param pathInput the `pathArray` to look into
 * @param distance the length of the shape to look at
 * @param sampleSize the scan resolution
 * @returns the requested {x, y} point coordinates
 */
const getPointAtLength = (
  pathInput: string | PathArray,
  distance: number,
  sampleSize: number | undefined = defaultOptions.sampleSize,
) => {
  return pathLengthFactory(pathInput, distance, sampleSize).point;
};
export default getPointAtLength;
