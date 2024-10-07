import { length, minmaxC, type CubicCoordinates } from './bezier';

/**
 * Returns a {x,y} point at a given length of a CubicBezier segment.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param c1x the first control point X
 * @param c1y the first control point Y
 * @param c2x the second control point X
 * @param c2y the second control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param t a [0-1] ratio
 * @returns the point at cubic-bezier segment length
 */
const getPointAtCubicSegmentLength = ([x1, y1, c1x, c1y, c2x, c2y, x2, y2]: CubicCoordinates, t: number) => {
  const t1 = 1 - t;
  return {
    x: t1 ** 3 * x1 + 3 * t1 ** 2 * t * c1x + 3 * t1 * t ** 2 * c2x + t ** 3 * x2,
    y: t1 ** 3 * y1 + 3 * t1 ** 2 * t * c1y + 3 * t1 * t ** 2 * c2y + t ** 3 * y2,
  };
};

/**
 * Returns the properties of a CubicBezier segment.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param c1x the first control point X
 * @param c1y the first control point Y
 * @param c2x the second control point X
 * @param c2y the second control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param distance the point distance
 * @returns the segment length, point at length and the bounding box
 */
const getSegmentProperties = (
  x1: number,
  y1: number,
  c1x: number,
  c1y: number,
  c2x: number,
  c2y: number,
  x2: number,
  y2: number,
  distance?: number,
) => {
  const distanceIsNumber = typeof distance === 'number';
  let POINT = { x: x1, y: y1 };
  const getLength = () => length([x1, y1, c1x, c1y, c2x, c2y, x2, y2]);

  if (distanceIsNumber) {
    const currentLength = getLength();
    if (distance <= 0) {
      // first point already defined
    } else if (distance >= currentLength) {
      POINT = { x: x2, y: y2 };
    } else {
      POINT = getPointAtCubicSegmentLength([x1, y1, c1x, c1y, c2x, c2y, x2, y2], distance / currentLength);
    }
  }

  return {
    point: POINT,
    get length() {
      return getLength();
    },
    get bbox() {
      const cxMinMax = minmaxC([x1, c1x, c2x, x2]);
      const cyMinMax = minmaxC([y1, c1y, c2y, y2]);
      return {
        min: { x: cxMinMax[0], y: cyMinMax[0] },
        max: { x: cxMinMax[1], y: cyMinMax[1] },
      };
    },
  };
};

export default getSegmentProperties;
