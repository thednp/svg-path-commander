import options from '../options/options.js';
import clonePath from './clonePath.js';

export default function roundPath(pathArray, round) {
  const decimalsOption = !Number.isNaN(+round) ? +round : options.round && options.decimals;
  let result;

  if (decimalsOption) {
    result = pathArray.map((seg) => seg.map((c) => {
      const nr = +c;
      const dc = 10 ** decimalsOption;
      if (nr) {
        return nr % 1 === 0 ? nr : Math.round(nr * dc) / dc;
      }
      return c;
    }));
  } else {
    result = clonePath(pathArray);
  }
  return result;
}
