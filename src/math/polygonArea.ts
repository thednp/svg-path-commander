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
const polygonArea = (polygon: PointTuple[]): number => {
  const n = polygon.length;
  let i = -1;
  let a;
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

export default polygonArea;
