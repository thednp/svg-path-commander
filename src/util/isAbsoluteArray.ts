import type { AbsoluteArray } from '../types';
import isPathArray from './isPathArray';

/**
 * Iterates an array to check if it's a `pathArray`
 * with all absolute values.
 *
 * @param path the `pathArray` to be checked
 * @returns iteration result
 */
const isAbsoluteArray = (path: unknown): path is AbsoluteArray => {
  return (
    isPathArray(path) &&
    // `isPathArray` also checks if it's `Array`
    path.every(([x]) => x === x.toUpperCase())
  );
};
export default isAbsoluteArray;
