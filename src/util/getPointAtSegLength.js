/**
 * Returns the {x,y} coordinates of a point at a
 * given length of a cubic-bezier segment.
 *
 * @param {Number} p1x the starting point X
 * @param {Number} p1y the starting point Y
 * @param {Number} c1x the first control point X
 * @param {Number} c1y the first control point Y
 * @param {Number} c2x the second control point X
 * @param {Number} c2y the second control point Y
 * @param {Number} px2 the ending point X
 * @param {Number} py2 the ending point Y
 * @param {Number} t a [0-1] ratio
 * @returns {{x: number, y: number}} the requested {x,y} coordinates
 */
export default function getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
  const t1 = 1 - t;
  return {
    x: (t1 ** 3) * p1x
      + t1 * t1 * 3 * t * c1x
      + t1 * 3 * t * t * c2x
      + (t ** 3) * p2x,
    y: (t1 ** 3) * p1y
      + t1 * t1 * 3 * t * c1y
      + t1 * 3 * t * t * c2y
      + (t ** 3) * p2y,
  };
}
