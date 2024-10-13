import type { PathArray, PathSegment } from '../types';
import defaultOptions from '../options/options';
import iterate from './iterate';

/**
 * Rounds the values of a `pathArray` instance to
 * a specified amount of decimals and returns it.
 *
 * @param path the source `pathArray`
 * @param roundOption the amount of decimals to round numbers to
 * @returns the resulted `pathArray` with rounded values
 */
const roundPath = (path: PathArray, roundOption?: number | 'off') => {
  let { round } = defaultOptions;
  if (roundOption === 'off' || round === 'off') return path.slice(0) as PathArray;
  // allow for ZERO decimals
  round = typeof roundOption === 'number' && roundOption >= 0 ? roundOption : round;
  // to round values to the power
  // the `round` value must be integer
  const pow = typeof round === 'number' && round >= 1 ? 10 ** round : 1;

  return iterate<typeof path>(path, segment => {
    const values = (segment.slice(1) as number[]).map(n => (round ? Math.round(n * pow) / pow : Math.round(n)));
    return [segment[0], ...values] as PathSegment;
  });
};
export default roundPath;
