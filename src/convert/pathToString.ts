import type { PathArray } from '../types';
import roundPath from '../process/roundPath';

/**
 * Returns a valid `d` attribute string value created
 * by rounding values and concatenating the `pathArray` segments.
 *
 * @param path the `pathArray` object
 * @param round amount of decimals to round values to
 * @returns the concatenated path string
 */
const pathToString = (path: PathArray, round?: number | 'off'): string => {
  return roundPath(path, round)
    .map(x => x[0] + x.slice(1).join(' '))
    .join('');
};
export default pathToString;
