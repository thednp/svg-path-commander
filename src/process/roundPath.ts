import type { PathArray } from 'src/types';
import defaultOptions from '../options/options';

/**
 * Rounds the values of a `pathArray` instance to
 * a specified amount of decimals and returns it.
 *
 * @param path the source `pathArray`
 * @param roundOption the amount of decimals to round numbers to
 * @returns the resulted `pathArray` with rounded values
 */
const roundPath = (path: PathArray, roundOption?: number | 'off'): PathArray => {
  let { round } = defaultOptions;
  if (roundOption === 'off' || round === 'off') return [...path];
  // allow for ZERO decimals
  round = typeof roundOption === 'number' && roundOption >= 0 ? roundOption : round;
  // to round values to the power
  // the `round` value must be integer
  const pow = typeof round === 'number' && round >= 1 ? 10 ** round : 1;

  return path.map(pi => {
    const values = pi
      .slice(1)
      .map(Number)
      .map(n => (round ? Math.round(n * pow) / pow : Math.round(n)));
    return [pi[0], ...values];
  }) as PathArray;
};
export default roundPath;
