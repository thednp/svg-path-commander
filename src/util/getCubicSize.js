import segmentCubicFactory from './segmentCubicFactory';

/**
 * Returns the cubic-bezier segment bounding box.
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} c1x the first control point X
 * @param {number} c1y the first control point Y
 * @param {number} c2x the second control point X
 * @param {number} c2y the second control point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @returns {SVGPathCommander.segmentLimits} the bounding box of the cubic-bezier segment
 */
export default function getCubicSize(x1, y1, c1x, c1y, c2x, c2y, x2, y2) {
  let a = (c2x - 2 * c1x + x1) - (x2 - 2 * c2x + c1x);
  let b = 2 * (c1x - x1) - 2 * (c2x - c1x);
  let c = x1 - c1x;
  let t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a;
  let t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a;
  const X = [x1, x2];
  const Y = [y1, y2];
  let x = 0;
  let y = 0;

  if (Math.abs(t1) > 1e12) t1 = 0.5;
  if (Math.abs(t2) > 1e12) t2 = 0.5;

  if (t1 > 0 && t1 < 1) {
    // @ts-ignore
    ({ x, y } = segmentCubicFactory(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t1));
    X.push(x);
    Y.push(y);
  }
  if (t2 > 0 && t2 < 1) {
    // @ts-ignore
    ({ x, y } = segmentCubicFactory(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t2));
    X.push(x);
    Y.push(y);
  }
  a = (c2y - 2 * c1y + y1) - (y2 - 2 * c2y + c1y);
  b = 2 * (c1y - y1) - 2 * (c2y - c1y);
  c = y1 - c1y;
  t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a;
  t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a;
  if (Math.abs(t1) > 1e12) t1 = 0.5;
  if (Math.abs(t2) > 1e12) t2 = 0.5;

  if (t1 > 0 && t1 < 1) {
    // @ts-ignore
    ({ x, y } = segmentCubicFactory(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t1));
    X.push(x);
    Y.push(y);
  }
  if (t2 > 0 && t2 < 1) {
    // @ts-ignore
    ({ x, y } = segmentCubicFactory(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t2));
    X.push(x);
    Y.push(y);
  }
  return {
    min: { x: Math.min(...X), y: Math.min(...Y) },
    max: { x: Math.max(...X), y: Math.max(...Y) },
  };
}
