/**
 * Converts a Q (quadratic-bezier) segment to C (cubic-bezier).
 *
 * @param {Number} x1 curve start x
 * @param {Number} y1 curve start y
 * @param {Number} qx control point x
 * @param {Number} qy control point y
 * @param {Number} x2 curve end x
 * @param {Number} y2 curve end y
 * @returns {Number[]} the cubic-bezier segment
 */
export default function quadToCubic(x1, y1, qx, qy, x2, y2) {
  const r13 = 1 / 3;
  const r23 = 2 / 3;
  return [
    r13 * x1 + r23 * qx, // cpx1
    r13 * y1 + r23 * qy, // cpy1
    r13 * x2 + r23 * qx, // cpx2
    r13 * y2 + r23 * qy, // cpy2
    x2, y2, // x,y
  ];
}
