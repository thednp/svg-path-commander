import midPoint from '../math/midPoint';
import distanceSquareRoot from '../math/distanceSquareRoot';

/**
 * Returns a {x,y} point at a given length, the total length and
 * the minimum and maximum {x,y} coordinates of a line (L,V,H,Z) segment.
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @param {number=} distance the distance to point
 * @returns {SVGPath.lengthFactory} the segment length, point, min & max
 */
export default function segmentLineFactory(x1, y1, x2, y2, distance) {
  const length = distanceSquareRoot([x1, y1], [x2, y2]);
  let point = { x: 0, y: 0 };

  /* istanbul ignore else */
  if (typeof distance === 'number') {
    if (distance <= 0) {
      point = { x: x1, y: y1 };
    } else if (distance >= length) {
      point = { x: x2, y: y2 };
    } else {
      const [x, y] = midPoint([x1, y1], [x2, y2], distance / length);
      point = { x, y };
    }
  }

  return {
    length,
    point,
    min: {
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
    },
    max: {
      x: Math.max(x1, x2),
      y: Math.max(y1, y2),
    },
  };
}
