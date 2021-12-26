// import getPointAtSegCubicLength from './getPointAtSegCubicLength';
import segmentCubicFactory from './segmentCubicFactory';

/**
 * Returns the cubic-bezier segment length.
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} c1x the first control point X
 * @param {number} c1y the first control point Y
 * @param {number} c2x the second control point X
 * @param {number} c2y the second control point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @returns {SVGPathCommander.segmentLimits} the length of the cubic-bezier segment
 */
export default function getCubicSize(x1, y1, c1x, c1y, c2x, c2y, x2, y2) {
  let a = (c2x - 2 * c1x + x1) - (x2 - 2 * c2x + c1x);
  let b = 2 * (c1x - x1) - 2 * (c2x - c1x);
  let c = x1 - c1x;
  let t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a;
  let t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a;
  const y = [y1, y2];
  const x = [x1, x2];
  let dot;

  if (Math.abs(t1) > 1e12) t1 = 0.5;
  if (Math.abs(t2) > 1e12) t2 = 0.5;

  if (t1 > 0 && t1 < 1) {
    dot = segmentCubicFactory(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t1);
    // @ts-ignore
    x.push(dot.x); y.push(dot.y);
  }
  if (t2 > 0 && t2 < 1) {
    dot = segmentCubicFactory(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t2);
    // @ts-ignore
    x.push(dot.x); y.push(dot.y);
  }
  a = (c2y - 2 * c1y + y1) - (y2 - 2 * c2y + c1y);
  b = 2 * (c1y - y1) - 2 * (c2y - c1y);
  c = y1 - c1y;
  t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a;
  t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a;
  if (Math.abs(t1) > 1e12) t1 = 0.5;
  if (Math.abs(t2) > 1e12) t2 = 0.5;

  if (t1 > 0 && t1 < 1) {
    dot = segmentCubicFactory(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t1);
    // @ts-ignore
    x.push(dot.x); y.push(dot.y);
  }
  if (t2 > 0 && t2 < 1) {
    dot = segmentCubicFactory(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t2);
    // @ts-ignore
    x.push(dot.x); y.push(dot.y);
  }
  return {
    min: { x: Math.min(...x), y: Math.min(...y) },
    max: { x: Math.max(...x), y: Math.max(...y) },
  };
}
