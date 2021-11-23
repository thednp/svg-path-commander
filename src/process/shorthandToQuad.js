/**
 * Returns the missing control point from an
 * T (shorthand quadratic bezier) segment.
 *
 * @param {Number} x1 curve start x
 * @param {Number} y1 curve start y
 * @param {Number} qx control point x
 * @param {Number} qy control point y
 * @param {String} prevCommand the previous path command
 * @returns {Object} the missing control point
 */
export default function shorthandToQuad(x1, y1, qx, qy, prevCommand) {
  return 'QT'.indexOf(prevCommand) > -1
    ? { qx: x1 * 2 - qx, qy: y1 * 2 - qy }
    : { qx: x1, qy: y1 };
}
