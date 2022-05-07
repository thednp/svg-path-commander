import midPoint from '../math/midPoint';

/**
 * Split a cubic-bezier segment into two.
 *
 * @param {number[]} pts the cubic-bezier parameters
 * @return {SVGPath.cubicSegment[]} two new cubic-bezier segments
 */
export default function splitCubic(pts/* , ratio */) {
  const t = /* ratio || */ 0.5;
  const p0 = pts.slice(0, 2);
  const p1 = pts.slice(2, 4);
  const p2 = pts.slice(4, 6);
  const p3 = pts.slice(6, 8);
  const p4 = midPoint(p0, p1, t);
  const p5 = midPoint(p1, p2, t);
  const p6 = midPoint(p2, p3, t);
  const p7 = midPoint(p4, p5, t);
  const p8 = midPoint(p5, p6, t);
  const p9 = midPoint(p7, p8, t);

  return [
    ['C', ...p4, ...p7, ...p9],
    ['C', ...p8, ...p6, ...p3],
  ];
}
