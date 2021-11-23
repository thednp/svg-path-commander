/**
 * Returns an {x,y} vector rotated by a given
 * angle in radian.
 *
 * @param {Number} x the initial vector x
 * @param {Number} y the initial vector y
 * @returns {{x: number, y: number}} the rotated vector
 */
export default function rotateVector(x, y, rad) {
  const X = x * Math.cos(rad) - y * Math.sin(rad);
  const Y = x * Math.sin(rad) + y * Math.cos(rad);
  return { x: X, y: Y };
}
