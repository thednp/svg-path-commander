import { length, minmaxQ, type QuadCoordinates } from './bezier';

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
const getPointAtQuadSegmentLength = ([x1, y1, cx, cy, x2, y2]: QuadCoordinates, t: number) => {
  const t1 = 1 - t;
  return {
    x: t1 ** 2 * x1 + 2 * t1 * t * cx + t ** 2 * x2,
    y: t1 ** 2 * y1 + 2 * t1 * t * cy + t ** 2 * y2,
  };
};

/**
 * Returns properties of a QuadraticBezier segment.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param cx the control point X
 * @param cy the control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param distance the point distance
 * @returns the segment length, point at length and the bounding box
 */
const getSegmentProperties = (
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number,
  distance: number | undefined,
) => {
  const distanceIsNumber = typeof distance === 'number';
  let POINT = { x: x1, y: y1 };
  const getLength = () => length([x1, y1, cx, cy, x2, y2]);

  if (distanceIsNumber) {
    const currentLength = getLength();

    if (distance <= 0) {
      // first point already defined
    } else if (distance >= currentLength) {
      POINT = { x: x2, y: y2 };
    } else {
      POINT = getPointAtQuadSegmentLength([x1, y1, cx, cy, x2, y2], distance / currentLength);
    }
  }

  return {
    point: POINT,
    get length() {
      return getLength();
    },
    get bbox() {
      const cxMinMax = minmaxQ([x1, cx, x2]);
      const cyMinMax = minmaxQ([y1, cy, y2]);
      return {
        min: { x: cxMinMax[0], y: cyMinMax[0] },
        max: { x: cxMinMax[1], y: cyMinMax[1] },
      };
    },
  };
};

export default getSegmentProperties;
