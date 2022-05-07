import defaultOptions from '../options/options';
import clonePath from './clonePath';
/**
 * Rounds the values of a `pathArray` instance to
 * a specified amount of decimals and returns it.
 *
 * @param {SVGPath.pathArray} path the source `pathArray`
 * @param {number | 'off'} roundOption the amount of decimals to round numbers to
 * @returns {SVGPath.pathArray} the resulted `pathArray` with rounded values
 */
export default function roundPath(path, roundOption) {
  let { round } = defaultOptions;
  if (roundOption === 'off' || round === 'off') return clonePath(path);
  // round = roundOption >= 1 ? roundOption : round;
  // allow for ZERO decimals
  round = roundOption >= 0 ? roundOption : round;
  // to round values to the power
  // the `round` value must be integer
  const pow = typeof round === 'number' && round >= 1 ? (10 ** round) : 1;

  return path.map((pi) => {
    const values = pi.slice(1).map(Number)
      .map((n) => (round ? (Math.round(n * pow) / pow) : Math.round(n)));
    return [pi[0], ...values];
  });
}
