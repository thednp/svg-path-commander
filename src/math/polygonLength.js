import distanceSquareRoot from './distanceSquareRoot';

/**
 * d3-polygon-length
 * https://github.com/d3/d3-polygon
 *
 * Returns the perimeter of a polygon.
 *
 * @param {[number,number][]} polygon an array of coordinates
 * @returns {number} the polygon length
 */
export default function polygonLength(polygon) {
  return polygon.reduce((length, point, i) => {
    if (i) {
      return length + distanceSquareRoot(polygon[i - 1], point);
    }
    return 0;
  }, 0);
}
