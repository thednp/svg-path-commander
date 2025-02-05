import { getBezierLength, minmaxQ } from "./bezier";
import { type QuadCoordinates } from "../types";

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
const getPointAtQuadSegmentLength = (
  [x1, y1, cx, cy, x2, y2]: QuadCoordinates,
  t: number,
) => {
  const t1 = 1 - t;
  return {
    x: t1 ** 2 * x1 + 2 * t1 * t * cx + t ** 2 * x2,
    y: t1 ** 2 * y1 + 2 * t1 * t * cy + t ** 2 * y2,
  };
};

/**
 * Returns the length of a QuadraticBezier segment.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param cx the control point X
 * @param cy the control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns the QuadraticBezier segment length
 */
const getQuadLength = (
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number,
) => {
  return getBezierLength([x1, y1, cx, cy, x2, y2]);
};

/**
 * Returns the point along a QuadraticBezier segment at a given distance.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param cx the control point X
 * @param cy the control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param distance the distance to look at
 * @returns the point at QuadraticBezier length
 */
const getPointAtQuadLength = (
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number,
  distance?: number,
) => {
  const distanceIsNumber = typeof distance === "number";
  let point = { x: x1, y: y1 };

  /* istanbul ignore else @preserve */
  if (distanceIsNumber) {
    const currentLength = getBezierLength([x1, y1, cx, cy, x2, y2]);
    if (distance <= 0) {
      // first point already defined
    } else if (distance >= currentLength) {
      point = { x: x2, y: y2 };
    } else {
      point = getPointAtQuadSegmentLength(
        [x1, y1, cx, cy, x2, y2],
        distance / currentLength,
      );
    }
  }
  return point;
};

/**
 * Returns the boundig box of a QuadraticBezier segment in the following format:
 * [MIN_X, MIN_Y, MAX_X, MAX_Y]
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param cx the control point X
 * @param cy the control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns the extrema of the QuadraticBezier segment
 */
const getQuadBBox = (
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number,
) => {
  const cxMinMax = minmaxQ([x1, cx, x2]);
  const cyMinMax = minmaxQ([y1, cy, y2]);
  return [cxMinMax[0], cyMinMax[0], cxMinMax[1], cyMinMax[1]] as [
    number,
    number,
    number,
    number,
  ];
};
const quadTools = {
  getPointAtQuadLength,
  getPointAtQuadSegmentLength,
  getQuadBBox,
  getQuadLength,
}

export {
  quadTools,
  getPointAtQuadLength,
  getPointAtQuadSegmentLength,
  getQuadBBox,
  getQuadLength,
};
