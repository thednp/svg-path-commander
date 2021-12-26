import pathLengthFactory from './pathLengthFactory';

/**
 * Returns [x,y] coordinates of a point at a given length of a shape.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the `pathArray` to look into
 * @param {number} distance the length of the shape to look at
 * @returns {{x: number, y: number}} the requested {x, y} point coordinates
 */
export default function getPointAtLength(pathInput, distance) {
  // @ts-ignore
  return pathLengthFactory(pathInput, distance);
}
