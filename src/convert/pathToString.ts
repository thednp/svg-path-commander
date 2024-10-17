import type { PathArray, PathSegment } from '../types';
import defaultOptions from '../options/options';
import roundTo from '../math/roundTo';

/**
 * Returns a valid `d` attribute string value created
 * by rounding values and concatenating the `pathArray` segments.
 *
 * @param path the `pathArray` object
 * @param roundOption amount of decimals to round values to
 * @returns the concatenated path string
 */
const pathToString = (path: PathArray, roundOption?: number | 'off'): string => {
  const pathLen = path.length;
  let { round } = defaultOptions;
  let segment = path[0] as PathSegment;
  let result = '';

  // allow for ZERO decimals
  round =
    roundOption === 'off'
      ? roundOption
      : typeof roundOption === 'number' && roundOption >= 0
      ? roundOption
      : typeof round === 'number' && round >= 0
      ? round
      : /* istanbul ignore next @preserve */ 'off';

  for (let i = 0; i < pathLen; i += 1) {
    segment = path[i];
    const [pathCommand] = segment;
    const values = segment.slice(1) as number[];
    result += pathCommand;
    if (round === 'off') {
      result += values.join(' ');
    } else {
      let j = 0;
      const valLen = values.length;
      while (j < valLen) {
        result += roundTo(values[j], round);
        if (j !== valLen - 1) result += ' ';
        j += 1;
      }
    }
  }

  return result;
};

export default pathToString;
