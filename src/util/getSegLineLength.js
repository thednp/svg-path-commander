import distanceSquareRoot from '../math/distanceSquareRoot';

/**
 * Returns the L (line-to) segment length.
 *
 * @param {Number} ax the starting point X
 * @param {Number} ay the starting point Y
 * @param {Number} bx the ending point X
 * @param {Number} by the ending point Y
 * @returns {Number} the line-to segment length
 */
export default function getSegLineLength(ax, ay, bx, by) {
  return distanceSquareRoot([ax, ay], [bx, by]);
}
