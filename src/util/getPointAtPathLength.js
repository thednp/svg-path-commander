import getPointAtLength from './getPointAtLength';

/**
 * Returns [x,y] coordinates of a point at a given length of a shape.
 * `pathToCurve` version.
 *
 * @deprecated
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the `pathArray` to look into
 * @param {number} distance the length of the shape to look at
 * @returns {{x: number, y: number}} the requested {x, y} point coordinates
 */
export default function getPointAtPathLength(pathInput, distance) {
  return getPointAtLength(pathInput, distance);
}
