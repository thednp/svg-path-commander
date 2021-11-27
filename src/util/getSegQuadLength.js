/**
 * Returns the Q (quadratic-bezier) segment length.
 * https://gist.github.com/tunght13488/6744e77c242cc7a94859#gistcomment-2047251
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} qx the control point X
 * @param {number} qy the control point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @param {number} z a [0-1] ratio
 * @returns {number} the quadratic-bezier segment length
 */
export default function getSegQuadLength(x1, y1, qx, qy, x2, y2) {
  const ax = x1 - 2 * qx + x2;
  const ay = y1 - 2 * qy + y2;
  const bx = 2 * qx - 2 * x1;
  const by = 2 * qy - 2 * y1;
  const A = 4 * (ax * ax + ay * ay);
  const B = 4 * (ax * bx + ay * by);
  const C = bx * bx + by * by;

  const Sabc = 2 * Math.sqrt(A + B + C);
  const A_2 = Math.sqrt(A);
  const A_32 = 2 * A * A_2;
  const C_2 = 2 * Math.sqrt(C);
  const BA = B / A_2;

  return (A_32 * Sabc + A_2 * B * (Sabc - C_2) + (4 * C * A - B * B)
    * Math.log((2 * A_2 + BA + Sabc) / (BA + C_2))) / (4 * A_32);
}
