import roundPath from '../process/roundPath';

/**
 * Returns a valid `d` attribute string value created
 * by rounding values and concatenating the `pathArray` segments.
 *
 * @param {SVGPC.pathArray} path the `pathArray` object
 * @param {Number} round amount of decimals to round values to
 * @returns {String} the concatenated path string
 */
export default function pathToString(path, round) {
  return roundPath(path, round)
    .map((x) => x[0].concat(x.slice(1).join(' '))).join('');
}
