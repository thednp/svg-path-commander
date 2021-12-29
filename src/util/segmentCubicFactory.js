import distanceSquareRoot from '../math/distanceSquareRoot';

/**
 * Returns a point at a given length of a C (cubic-bezier) segment.
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} c1x the first control point X
 * @param {number} c1y the first control point Y
 * @param {number} c2x the second control point X
 * @param {number} c2y the second control point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @param {number} t a [0-1] ratio
 * @returns {{x: number, y: number}} the cubic-bezier segment length
 */
function getPointAtCubicSegmentLength(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t) {
  const t1 = 1 - t;
  return {
    x: (t1 ** 3) * x1
      + 3 * (t1 ** 2) * t * c1x
      + 3 * t1 * (t ** 2) * c2x
      + (t ** 3) * x2,
    y: (t1 ** 3) * y1
      + 3 * (t1 ** 2) * t * c1y
      + 3 * t1 * (t ** 2) * c2y
      + (t ** 3) * y2,
  };
}

/**
 * Returns the length of a C (cubic-bezier) segment,
 * or an {x,y} point at a given length.
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} c1x the first control point X
 * @param {number} c1y the first control point Y
 * @param {number} c2x the second control point X
 * @param {number} c2y the second control point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @param {number=} distance the point distance
 * @returns {{x: number, y: number} | number} the segment length or point
 */
export default function segmentCubicFactory(x1, y1, c1x, c1y, c2x, c2y, x2, y2, distance) {
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

    ({ x, y } = getPointAtCubicSegmentLength(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t));
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
