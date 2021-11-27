import distanceSquareRoot from '../math/distanceSquareRoot';

/**
 * Returns the L (line-to) segment length.
 *
 * @param {number} ax the starting point X
 * @param {number} ay the starting point Y
 * @param {number} bx the ending point X
 * @param {number} by the ending point Y
 * @returns {number} the line-to segment length
 */
export default function getSegLineLength(ax, ay, bx, by) {
  return distanceSquareRoot([ax, ay], [bx, by]);
}
