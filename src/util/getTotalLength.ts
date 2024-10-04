import type { PathArray } from '../types';
import pathLengthFactory from './pathLengthFactory';
import defaultOptions from '../options/options';

/**
 * Returns the shape total length, or the equivalent to `shape.getTotalLength()`.
 *
 * The `normalizePath` version is lighter, faster, more efficient and more accurate
 * with paths that are not `curveArray`.
 *
 * @param pathInput the target `pathArray`
 * @param sampleSize the scan resolution
 * @returns the shape total length
 */
const getTotalLength = (
  pathInput: string | PathArray,
  sampleSize: number | undefined = defaultOptions.sampleSize,
): number => {
  return pathLengthFactory(pathInput, undefined, sampleSize).length;
};
export default getTotalLength;
