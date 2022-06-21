import segmentLineFactory from '../util/segmentLineFactory';
import midPoint from '../math/midPoint';

/**
 * Converts an L (line-to) segment to C (cubic-bezier).
 *
 * @param {number} x1 line start x
 * @param {number} y1 line start y
 * @param {number} x2 line end x
 * @param {number} y2 line end y
 * @returns {number[]} the cubic-bezier segment
 */
export default function lineToCubic(x1, y1, x2, y2) {
  const t = 0.5;
  /** @type {[number, number]} */
  const p0 = [x1, y1];
  /** @type {[number, number]} */
  const p1 = [x2, y2];
  const p2 = midPoint(p0, p1, t);
  const p3 = midPoint(p1, p2, t);
  const p4 = midPoint(p2, p3, t);
  const p5 = midPoint(p3, p4, t);
  const p6 = midPoint(p4, p5, t);
  const seg1 = [...p0, ...p2, ...p4, ...p6, t];
  const cp1 = segmentLineFactory(...seg1).point;
  const seg2 = [...p6, ...p5, ...p3, ...p1, 0];
  const cp2 = segmentLineFactory(...seg2).point;

  return [cp1.x, cp1.y, cp2.x, cp2.y, x2, y2];
}
