import getPointAtSegLength from './getPointAtSegLength.js';

// returns the cubic bezier segment length
export default function getCubicSize(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
  let a = (c2x - 2 * c1x + p1x) - (p2x - 2 * c2x + c1x);
  let b = 2 * (c1x - p1x) - 2 * (c2x - c1x);
  let c = p1x - c1x;
  let t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a;
  let t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a;
  const y = [p1y, p2y];
  const x = [p1x, p2x];
  let dot;

  if (Math.abs(t1) > '1e12') t1 = 0.5;
  if (Math.abs(t2) > '1e12') t2 = 0.5;

  if (t1 > 0 && t1 < 1) {
    dot = getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
    x.push(dot.x);
    y.push(dot.y);
  }
  if (t2 > 0 && t2 < 1) {
    dot = getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
    x.push(dot.x);
    y.push(dot.y);
  }
  a = (c2y - 2 * c1y + p1y) - (p2y - 2 * c2y + c1y);
  b = 2 * (c1y - p1y) - 2 * (c2y - c1y);
  c = p1y - c1y;
  t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a;
  t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a;

  if (Math.abs(t1) > '1e12') t1 = 0.5;
  if (Math.abs(t2) > '1e12') t2 = 0.5;

  if (t1 > 0 && t1 < 1) {
    dot = getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
    x.push(dot.x);
    y.push(dot.y);
  }
  if (t2 > 0 && t2 < 1) {
    dot = getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
    x.push(dot.x);
    y.push(dot.y);
  }
  return {
    min: { x: Math.min.apply(0, x), y: Math.min.apply(0, y) },
    max: { x: Math.max.apply(0, x), y: Math.max.apply(0, y) },
  };
}
