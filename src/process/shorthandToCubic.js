/**
 * Returns the missing control point from an
 * S (shorthand cubic bezier) segment.
 *
 * @param {number} x1 curve start x
 * @param {number} y1 curve start y
 * @param {number} x2 curve end x
 * @param {number} y2 curve end y
 * @param {string} prevCommand the previous path command
 * @returns {{x1: number, y1: number}}} the missing control point
 */
export default function shorthandToCubic(x1, y1, x2, y2, prevCommand) {
  return 'CS'.includes(prevCommand)
    ? { x1: x1 * 2 - x2, y1: y1 * 2 - y2 }
    : { x1, y1 };
}
