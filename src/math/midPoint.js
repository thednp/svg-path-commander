/**
 * Returns the coordinates of a specified distance
 * ratio between two points.
 *
 * @param {Number[]} a the first point coordinates
 * @param {Number[]} b the second point coordinates
 * @param {Number} t the ratio
 * @returns {Number[]} the midpoint coordinates
 */
export default function midPoint(a, b, t) {
  const [ax, ay] = a; const [bx, by] = b;
  return [ax + (bx - ax) * t, ay + (by - ay) * t];
}
