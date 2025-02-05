import { getBezierLength, minmaxC } from "./bezier";
import { type CubicCoordinates } from "../types";

/**
 * Returns a point at a given length of a CubicBezier segment.
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
const getPointAtCubicSegmentLength = (
  [x1, y1, c1x, c1y, c2x, c2y, x2, y2]: CubicCoordinates,
  t: number,
) => {
  const t1 = 1 - t;
  return {
    x: t1 ** 3 * x1 + 3 * t1 ** 2 * t * c1x + 3 * t1 * t ** 2 * c2x +
      t ** 3 * x2,
    y: t1 ** 3 * y1 + 3 * t1 ** 2 * t * c1y + 3 * t1 * t ** 2 * c2y +
      t ** 3 * y2,
  };
};

/**
 * Returns the length of a CubicBezier segment.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param c1x the first control point X
 * @param c1y the first control point Y
 * @param c2x the second control point X
 * @param c2y the second control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns the CubicBezier segment length
 */
const getCubicLength = (
  x1: number,
  y1: number,
  c1x: number,
  c1y: number,
  c2x: number,
  c2y: number,
  x2: number,
  y2: number,
) => {
  return getBezierLength([x1, y1, c1x, c1y, c2x, c2y, x2, y2]);
};

/**
 * Returns the point along a CubicBezier segment at a given distance.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param c1x the first control point X
 * @param c1y the first control point Y
 * @param c2x the second control point X
 * @param c2y the second control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param distance the distance to look at
 * @returns the point at CubicBezier length
 */
const getPointAtCubicLength = (
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
  const distanceIsNumber = typeof distance === "number";
  let point = { x: x1, y: y1 };
  /* istanbul ignore else @preserve */
  if (distanceIsNumber) {
    const currentLength = getBezierLength([x1, y1, c1x, c1y, c2x, c2y, x2, y2]);
    if (distance <= 0) {
      // first point already defined
    } else if (distance >= currentLength) {
      point = { x: x2, y: y2 };
    } else {
      point = getPointAtCubicSegmentLength(
        [x1, y1, c1x, c1y, c2x, c2y, x2, y2],
        distance / currentLength,
      );
    }
  }
  return point;
};

/**
 * Returns the boundig box of a CubicBezier segment in the following format:
 * [MIN_X, MIN_Y, MAX_X, MAX_Y]
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param c1x the first control point X
 * @param c1y the first control point Y
 * @param c2x the second control point X
 * @param c2y the second control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns the extrema of the CubicBezier segment
 */
const getCubicBBox = (
  x1: number,
  y1: number,
  c1x: number,
  c1y: number,
  c2x: number,
  c2y: number,
  x2: number,
  y2: number,
) => {
  const cxMinMax = minmaxC([x1, c1x, c2x, x2]);
  const cyMinMax = minmaxC([y1, c1y, c2y, y2]);

  return [cxMinMax[0], cyMinMax[0], cxMinMax[1], cyMinMax[1]] as [
    number,
    number,
    number,
    number,
  ];
};

const cubicTools = {
  getCubicBBox,
  getCubicLength,
  getPointAtCubicLength,
  getPointAtCubicSegmentLength,
}

export {
  cubicTools,
  getCubicBBox,
  getCubicLength,
  getPointAtCubicLength,
  getPointAtCubicSegmentLength,
};
