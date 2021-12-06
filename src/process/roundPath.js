import defaultOptions from '../options/options';
import clonePath from './clonePath';
/**
 * Rounds the values of a `pathArray` instance to
 * a specified amount of decimals and returns it.
 *
 * @param {SVGPathCommander.pathArray} path the source `pathArray`
 * @param {number | boolean} roundOption the amount of decimals to round numbers to
 * @returns {SVGPathCommander.pathArray} the resulted `pathArray` with rounded values
 */
export default function roundPath(path, roundOption) {
  let { round } = defaultOptions;
  if (roundOption === false || round === false) return clonePath(path);
  round = roundOption >= 1 ? roundOption : round;
  // to round values to the power
  // the `round` value must be integer
  // @ts-ignore
  const pow = round >= 1 ? (10 ** round) : 1;

  // @ts-ignore -- `pathSegment[]` is `pathArray`
  return path.map((pi) => {
    const values = pi.slice(1).map(Number)
      .map((n) => (n % 1 === 0 ? n : Math.round(n * pow) / pow));
    return [pi[0], ...values];
  });
}
