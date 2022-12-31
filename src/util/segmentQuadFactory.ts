import { LengthFactory } from 'src/interface';
import distanceSquareRoot from '../math/distanceSquareRoot';

/**
 * Returns the {x,y} coordinates of a point at a
 * given length of a quadratic-bezier segment.
 *
 * @see https://github.com/substack/point-at-length
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param cx the control point X
 * @param cy the control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param t a [0-1] ratio
 * @returns the requested {x,y} coordinates
 */
const getPointAtQuadSegmentLength = (
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number,
  t: number,
): { x: number; y: number } => {
  const t1 = 1 - t;
  return {
    x: t1 ** 2 * x1 + 2 * t1 * t * cx + t ** 2 * x2,
    y: t1 ** 2 * y1 + 2 * t1 * t * cy + t ** 2 * y2,
  };
};

/**
 * Returns a {x,y} point at a given length, the total length and
 * the minimum and maximum {x,y} coordinates of a Q (quadratic-bezier) segment.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param qx the control point X
 * @param qy the control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param distance the distance to point
 * @returns the segment length, point, min & max
 */
const segmentQuadFactory = (
  x1: number,
  y1: number,
  qx: number,
  qy: number,
  x2: number,
  y2: number,
  distance?: number,
): LengthFactory => {
  const distanceIsNumber = typeof distance === 'number';
  let x = x1;
  let y = y1;
  let LENGTH = 0;
  let prev = [x, y, LENGTH];
  let cur = [x, y] as [number, number];
  let t = 0;
  let POINT = { x: 0, y: 0 };
  let POINTS = [{ x, y }];

  if (distanceIsNumber && distance <= 0) {
    POINT = { x, y };
  }

  const sampleSize = 300;
  for (let j = 0; j <= sampleSize; j += 1) {
    t = j / sampleSize;

    ({ x, y } = getPointAtQuadSegmentLength(x1, y1, qx, qy, x2, y2, t));
    POINTS = [...POINTS, { x, y }];
    LENGTH += distanceSquareRoot(cur, [x, y]);
    cur = [x, y];

    if (distanceIsNumber && LENGTH > distance && distance > prev[2]) {
      const dv = (LENGTH - distance) / (LENGTH - prev[2]);

      POINT = {
        x: cur[0] * (1 - dv) + prev[0] * dv,
        y: cur[1] * (1 - dv) + prev[1] * dv,
      };
    }
    prev = [x, y, LENGTH];
  }

  /* istanbul ignore else */
  if (distanceIsNumber && distance >= LENGTH) {
    POINT = { x: x2, y: y2 };
  }

  return {
    length: LENGTH,
    point: POINT,
    min: {
      x: Math.min(...POINTS.map(n => n.x)),
      y: Math.min(...POINTS.map(n => n.y)),
    },
    max: {
      x: Math.max(...POINTS.map(n => n.x)),
      y: Math.max(...POINTS.map(n => n.y)),
    },
  };
};
export default segmentQuadFactory;
