/**
 * Returns the [x,y] projected coordinates for a given an [x,y] point
 * and an [x,y,z] perspective origin point.
 *
 * Equation found here =>
 * http://en.wikipedia.org/wiki/3D_projection#Diagram
 * Details =>
 * https://stackoverflow.com/questions/23792505/predicted-rendering-of-css-3d-transformed-pixel
 *
 * @param {SVGPathCommander.CSSMatrix} m the transformation matrix
 * @param {[number, number]} point2D the initial [x,y] coordinates
 * @param {number[]} origin the initial [x,y] coordinates
 * @returns {[number, number]} the projected [x,y] coordinates
 */
export default function projection2d(m, point2D, origin) {
  const [px, py] = point2D;
  const [originX, originY, originZ] = origin;
  const point3D = m.transformPoint({
    x: px, y: py, z: 0, w: 1,
  });

  const relativePositionX = point3D.x - originX;
  const relativePositionY = point3D.y - originY;
  const relativePositionZ = point3D.z - originZ;

  return [
    relativePositionX * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originX,
    relativePositionY * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originY,
  ];
}
