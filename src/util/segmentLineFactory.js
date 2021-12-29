import midPoint from '../math/midPoint';
import distanceSquareRoot from '../math/distanceSquareRoot';

/**
 * Returns the length of a line (L,V,H,Z) segment,
 * or a point at a given length.
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @param {number=} distance the distance to point
 * @returns {{x: number, y: number} | number} the segment length or point
 */
export default function segmentLineFactory(x1, y1, x2, y2, distance) {
  const length = distanceSquareRoot([x1, y1], [x2, y2]);
  const margin = 0.001;

  if (typeof distance === 'number') {
    if (distance < margin) {
      return { x: x1, y: y1 };
    }
    if (distance > length) {
      return { x: x2, y: y2 };
    }
    const [x, y] = midPoint([x1, y1], [x2, y2], distance / length);
    return { x, y };
  }
  return length;
}
