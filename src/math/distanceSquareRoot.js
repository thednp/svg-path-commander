/**
 * Returns the square root of the distance
 * between two given points.
 *
 * @param {Number[][]} a the first point coordinates
 * @param {Number[][]} b the second point coordinates
 * @returns {Number} the distance value
 */
export default function distanceSquareRoot(a, b) {
  return Math.sqrt(
    (a[0] - b[0]) * (a[0] - b[0])
    + (a[1] - b[1]) * (a[1] - b[1]),
  );
}
