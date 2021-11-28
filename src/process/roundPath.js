import SVGPCO from '../options/options';
import clonePath from './clonePath';
/**
 * Rounds the values of a `pathArray` instance to
 * a specified amount of decimals and returns it.
 *
 * @param {SVGPathCommander.pathArray} path the source `pathArray`
 * @param {number | boolean | null} round the amount of decimals to round numbers to
 * @returns {SVGPathCommander.pathArray} the resulted `pathArray` with rounded values
 */
export default function roundPath(path, round) {
  const { round: defaultRound, decimals: defaultDecimals } = SVGPCO;
  const decimalsOption = round && !Number.isNaN(+round) ? +round
    : defaultRound && defaultDecimals;

  if (round === false || (!defaultRound && !decimalsOption)) return clonePath(path);

  const dc = 10 ** decimalsOption;
  /** @type {SVGPathCommander.pathArray} */
  const result = [];
  const pl = path.length;
  /** @type {SVGPathCommander.pathSegment} */
  let segment;
  /** @type {number} */
  let n = 0;
  let pi = [];

  // FOR works best with TS
  for (let i = 0; i < pl; i += 1) {
    pi = path[i];
    segment = [''];
    for (let j = 0; j < pi.length; j += 1) {
      if (!j) segment[j] = pi[j];
      else {
        n = +pi[j];
        segment.push(!j || n % 1 === 0 ? n : Math.round(n * dc) / dc);
      }
    }
    result.push(segment);
  }
  return result;
}
