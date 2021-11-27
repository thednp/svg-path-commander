import roundPath from './roundPath';
import pathToAbsolute from '../convert/pathToAbsolute';
import pathToRelative from '../convert/pathToRelative';

/**
 * Optimizes a `pathArray` object:
 * * convert segments to absolute and relative values
 * * create a new `pathArray` with elements with shortest segments
 * from absolute and relative `pathArray`s
 *
 * @param {string | svgpcNS.pathArray} pathInput a string or `pathArray`
 * @param {number | null} round the amount of decimals to round values to
 * @returns {svgpcNS.pathArray} the optimized `pathArray`
 */
export default function optimizePath(pathInput, round) {
  const absolutePath = roundPath(pathToAbsolute(pathInput), round);
  const relativePath = roundPath(pathToRelative(pathInput), round);

  return absolutePath.map((x, i) => {
    if (i) {
      return x.join('').length < relativePath[i].join('').length
        ? x
        : relativePath[i];
    }
    return x;
  });
}
