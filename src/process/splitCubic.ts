import midPoint from '../math/midPoint';
import type { CubicSegment, PointTuple } from '../types';

/**
 * Split a cubic-bezier segment into two.
 *
 * @param pts the cubic-bezier parameters
 * @param ratio the cubic-bezier parameters
 * @return two new cubic-bezier segments
 */
const splitCubic = (pts: number[], ratio = 0.5): [CubicSegment, CubicSegment] => {
  const t = ratio;
  const p0 = pts.slice(0, 2) as PointTuple;
  const p1 = pts.slice(2, 4) as PointTuple;
  const p2 = pts.slice(4, 6) as PointTuple;
  const p3 = pts.slice(6, 8) as PointTuple;
  const p4 = midPoint(p0, p1, t);
  const p5 = midPoint(p1, p2, t);
  const p6 = midPoint(p2, p3, t);
  const p7 = midPoint(p4, p5, t);
  const p8 = midPoint(p5, p6, t);
  const p9 = midPoint(p7, p8, t);

  return [
    ['C', p4[0], p4[1], p7[0], p7[1], p9[0], p9[1]],
    ['C', p8[0], p8[1], p6[0], p6[1], p3[0], p3[1]],
  ];
};
export default splitCubic;
