import type { PathArray } from '../types';
import pathFactory from './pathFactory';

/**
 * Returns the shape total length, or the equivalent to `shape.getTotalLength()`.
 *
 * The `normalizePath` version is lighter, faster, more efficient and more accurate
 * with paths that are not `curveArray`.
 *
 * @param pathInput the target `pathArray`
 * @returns the shape total length
 */
const getTotalLength = (pathInput: string | PathArray): number => {
  return pathFactory(pathInput).length;
};
export default getTotalLength;
