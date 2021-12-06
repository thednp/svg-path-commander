import roundPath from '../process/roundPath';

/**
 * Returns a valid `d` attribute string value created
 * by rounding values and concatenating the `pathArray` segments.
 *
 * @param {SVGPathCommander.pathArray} path the `pathArray` object
 * @param {any} round amount of decimals to round values to
 * @returns {string} the concatenated path string
 */
export default function pathToString(path, round) {
  return roundPath(path, round)
    .map((x) => x[0] + x.slice(1).join(' ')).join('');
}
