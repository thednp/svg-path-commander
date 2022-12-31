import CSSMatrix from '@thednp/dommatrix';

/**
 * Transforms a specified point using a matrix, returning a new
 * Tuple *Object* comprising of the transformed point.
 * Neither the matrix nor the original point are altered.
 *
 * @copyright thednp © 2021
 *
 * @param cssm CSSMatrix instance
 * @param v Tuple
 * @return the resulting Tuple
 */
const translatePoint = (cssm: CSSMatrix, v: [number, number, number, number]): [number, number, number, number] => {
  let m = CSSMatrix.Translate(...(v.slice(0, -1) as [number, number, number]));

  [, , , m.m44] = v;
  m = cssm.multiply(m);

  return [m.m41, m.m42, m.m43, m.m44];
};

/**
 * Returns the [x,y] projected coordinates for a given an [x,y] point
 * and an [x,y,z] perspective origin point.
 *
 * Equation found here =>
 * http://en.wikipedia.org/wiki/3D_projection#Diagram
 * Details =>
 * https://stackoverflow.com/questions/23792505/predicted-rendering-of-css-3d-transformed-pixel
 *
 * @param m the transformation matrix
 * @param point2D the initial [x,y] coordinates
 * @param origin the [x,y,z] transform origin
 * @returns the projected [x,y] coordinates
 */
const projection2d = (m: CSSMatrix, point2D: [number, number], origin: [number, number, number]): [number, number] => {
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
};
export default projection2d;
