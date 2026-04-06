import { distanceSquareRoot } from "./distanceSquareRoot";
import { type PointTuple } from "../types";

/**
 * d3-polygon-area
 * @see https://github.com/d3/d3-polygon
 *
 * Returns the area of a polygon.
 *
 * @param polygon Array of [x, y]
 * @returns Signed area
 */
const polygonArea = (polygon: PointTuple[]) => {
  const n = polygon.length;
  let i = -1;
  let a: PointTuple;
  let b = polygon[n - 1];
  let area = 0;

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

/**
 * Computes the centroid (geometric center) of a polygon.
 * Uses average of all endpoint coordinates (robust for polygons and curves).
 *
 * @param polygon A polygon with consists of [x, y] tuples
 * @returns [x, y] centroid
 */
const polygonCentroid = (polygon: PointTuple[]): PointTuple => {
  if (polygon.length === 0) return [0, 0];

  let sumX = 0;
  let sumY = 0;

  for (const [x, y] of polygon) {
    sumX += x;
    sumY += y;
  }

  const count = polygon.length;
  return [sumX / count, sumY / count];
};

const polygonTools = {
  polygonArea,
  polygonLength,
  polygonCentroid,
};

export { polygonArea, polygonCentroid, polygonLength, polygonTools };
