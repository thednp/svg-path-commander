import distanceSquareRoot from './distanceSquareRoot';
import { type PointTuple } from '../types';

/**
 * d3-polygon-area
 * https://github.com/d3/d3-polygon
 *
 * Returns the area of a polygon.
 *
 * @param polygon an array of coordinates
 * @returns the polygon area
 */
const polygonArea = (polygon: PointTuple[]) => {
  const n = polygon.length;
  let i = -1;
  let a: PointTuple;
  let b = polygon[n - 1];
  let area = 0;

  /* eslint-disable-next-line */
  while (++i < n) {
    a = b;
    b = polygon[i];
    area += a[1] * b[0] - a[0] * b[1];
  }

  return area / 2;
};

/**
 * d3-polygon-length
 * https://github.com/d3/d3-polygon
 *
 * Returns the perimeter of a polygon.
 *
 * @param polygon an array of coordinates
 * @returns the polygon length
 */
const polygonLength = (polygon: PointTuple[]) => {
  return polygon.reduce((length, point, i) => {
    if (i) {
      return length + distanceSquareRoot(polygon[i - 1], point);
    }
    return 0;
  }, 0);
};

export { polygonArea, polygonLength };
