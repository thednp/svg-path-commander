import { Translate } from 'dommatrix/src/dommatrix';

/**
 * Transforms a specified point using a matrix, returning a new
 * Tuple *Object* comprising of the transformed point.
 * Neither the matrix nor the original point are altered.
 *
 * @copyright thednp © 2021
 *
 * @param {SVGPath.CSSMatrix} M CSSMatrix instance
 * @param {[number, number, number, number]} v Tuple
 * @return {[number, number, number, number]} the resulting Tuple
 */
function translatePoint(M, v) {
  let m = Translate(...v);

  [,,, m.m44] = v;
  m = M.multiply(m);

  return [m.m41, m.m42, m.m43, m.m44];
}

/**
 * Returns the [x,y] projected coordinates for a given an [x,y] point
 * and an [x,y,z] perspective origin point.
 *
 * Equation found here =>
 * http://en.wikipedia.org/wiki/3D_projection#Diagram
 * Details =>
 * https://stackoverflow.com/questions/23792505/predicted-rendering-of-css-3d-transformed-pixel
 *
 * @param {SVGPath.CSSMatrix} m the transformation matrix
 * @param {[number, number]} point2D the initial [x,y] coordinates
 * @param {number[]} origin the [x,y,z] transform origin
 * @returns {[number, number]} the projected [x,y] coordinates
 */
export default function projection2d(m, point2D, origin) {
  const [originX, originY, originZ] = origin;
  const [x, y, z] = translatePoint(m, [...point2D, 0, 1]);

  const relativePositionX = x - originX;
  const relativePositionY = y - originY;
  const relativePositionZ = z - originZ;

  return [
    // protect against division by ZERO
    relativePositionX * (Math.abs(originZ) / Math.abs(relativePositionZ) || 1) + originX,
    relativePositionY * (Math.abs(originZ) / Math.abs(relativePositionZ) || 1) + originY,
  ];
}
