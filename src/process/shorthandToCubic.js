/**
 * Returns the missing control point from an
 * S (shorthand cubic bezier) segment.
 *
 * @param {Number} x1 curve start x
 * @param {Number} y1 curve start y
 * @param {Number} x2 curve end x
 * @param {Number} y2 curve end y
 * @param {String} prevCommand the previous path command
 * @returns {Object} the missing control point
 */
export default function shorthandToCubic(x1, y1, x2, y2, prevCommand) {
  return 'CS'.indexOf(prevCommand) > -1
    ? { x1: x1 * 2 - x2, y1: y1 * 2 - y2 }
    : { x1, y1 };
}
