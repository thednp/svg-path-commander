/**
 * Returns the missing control point from an
 * T (shorthand quadratic bezier) segment.
 *
 * @param {number} x1 curve start x
 * @param {number} y1 curve start y
 * @param {number} qx control point x
 * @param {number} qy control point y
 * @param {string} prevCommand the previous path command
 * @returns {{qx: number, qy: number}}} the missing control point
 */
export default function shorthandToQuad(x1, y1, qx, qy, prevCommand) {
  return 'QT'.includes(prevCommand)
    ? { qx: x1 * 2 - qx, qy: y1 * 2 - qy }
    : { qx: x1, qy: y1 };
}
