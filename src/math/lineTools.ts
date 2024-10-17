import midPoint from './midPoint';
import distanceSquareRoot from './distanceSquareRoot';

/**
 * Returns length for line segments (MoveTo, LineTo).
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns the line segment length
 */
const getLineLength = (x1: number, y1: number, x2: number, y2: number) => {
  return distanceSquareRoot([x1, y1], [x2, y2]);
};

/**
 * Returns a point along the line segments (MoveTo, LineTo).
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param distance the distance to point in [0-1] range
 * @returns the point at length
 */
const getPointAtLineLength = (x1: number, y1: number, x2: number, y2: number, distance?: number) => {
  let point = { x: x1, y: y1 };

  /* istanbul ignore else @preserve */
  if (typeof distance === 'number') {
    const length = distanceSquareRoot([x1, y1], [x2, y2]);
    if (distance <= 0) {
      point = { x: x1, y: y1 };
    } else if (distance >= length) {
      point = { x: x2, y: y2 };
    } else {
      const [x, y] = midPoint([x1, y1], [x2, y2], distance / length);
      point = { x, y };
    }
  }
  return point;
};

/**
 * Returns bounding box for line segments (MoveTo, LineTo).
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param distance the distance to point in [0-1] range
 * @returns the extrema for line segments
 */
const getLineBBox = (x1: number, y1: number, x2: number, y2: number) => {
  const { min, max } = Math;
  return {
    min: {
      x: min(x1, x2),
      y: min(y1, y2),
    },
    max: {
      x: max(x1, x2),
      y: max(y1, y2),
    },
  };
};

export { getPointAtLineLength, getLineBBox, getLineLength };
