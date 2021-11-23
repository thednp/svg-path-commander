import SVGPCO from '../options/options';
import clonePath from './clonePath';

/**
 * Rounds the values of a `pathArray` instance to
 * a specified amount of decimals and returns it.
 *
 * @param {SVGPC.pathArray} path the source `pathArray`
 * @param {Number | null} round the amount of decimals to round numbers to
 * @returns {SVGPC.pathArray} the resulted `pathArray` with rounded values
 */
export default function roundPath(path, round) {
  const { round: defaultRound, decimals: defaultDecimals } = SVGPCO;
  const decimalsOption = !Number.isNaN(+round) ? +round : defaultRound && defaultDecimals;

  return !decimalsOption
    ? clonePath(path)
    : path.map((seg) => seg.map((c) => {
      const nr = +c;
      const dc = 10 ** decimalsOption;
      if (nr) {
        return nr % 1 === 0 ? nr : Math.round(nr * dc) / dc;
      }
      return c;
    }));
}
