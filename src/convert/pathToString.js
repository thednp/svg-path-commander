import roundPath from '../process/roundPath';

/**
 * Returns a valid `d` attribute string value created
 * by rounding values and concatenating the `pathArray` segments.
 *
 * @param {SVGPath.pathArray} path the `pathArray` object
 * @param {number | 'off'} round amount of decimals to round values to
 * @returns {string} the concatenated path string
 */
export default function pathToString(path, round) {
  return roundPath(path, round)
    .map((x) => x[0] + x.slice(1).join(' ')).join('');
}
