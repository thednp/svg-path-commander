import distanceSquareRoot from '../math/distanceSquareRoot';

/**
 * Returns the {x,y} coordinates of a point at a
 * given length of a quad-bezier segment.
 *
 * @see https://github.com/substack/point-at-length
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} cx the control point X
 * @param {number} cy the control point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @param {number} t a [0-1] ratio
 * @returns {{x: number, y: number}} the requested {x,y} coordinates
 */
function getPointAtQuadSegmentLength(x1, y1, cx, cy, x2, y2, t) {
  const t1 = 1 - t;
  return {
    x: (t1 ** 2) * x1
      + 2 * t1 * t * cx
      + (t ** 2) * x2,
    y: (t1 ** 2) * y1
      + 2 * t1 * t * cy
      + (t ** 2) * y2,
  };
}

/**
 * Returns the Q (quadratic-bezier) segment length,
 * or an {x,y} point at a given length.
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} qx the control point X
 * @param {number} qy the control point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @param {number=} distance the distance to point
 * @returns {{x: number, y: number} | number} the segment length or point
 */
export default function segmentQuadFactory(x1, y1, qx, qy, x2, y2, distance) {
  const distanceIsNumber = typeof distance === 'number';
  const lengthMargin = 0.001;
  let x = x1; let y = y1;
  let totalLength = 0;
  let prev = [x1, y1, totalLength];
  /** @type {[number, number]} */
  let cur = [x1, y1];
  let t = 0;

  if (distanceIsNumber && distance < lengthMargin) {
    return { x, y };
  }

  const n = 100;
  for (let j = 0; j <= n; j += 1) {
    t = j / n;

    ({ x, y } = getPointAtQuadSegmentLength(x1, y1, qx, qy, x2, y2, t));
    totalLength += distanceSquareRoot(cur, [x, y]);
    cur = [x, y];

    if (distanceIsNumber && totalLength >= distance) {
      const dv = (totalLength - distance) / (totalLength - prev[2]);

      return {
        x: cur[0] * (1 - dv) + prev[0] * dv,
        y: cur[1] * (1 - dv) + prev[1] * dv,
      };
    }
    prev = [x, y, totalLength];
  }
  if (distanceIsNumber && distance >= totalLength) {
    return { x: x2, y: y2 };
  }
  return totalLength;
}
