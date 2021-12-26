import getPropertiesAtPoint from './getPropertiesAtPoint';

/**
 * Returns the point in path closest to a given point.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput target `pathArray`
 * @param {{x: number, y: number}} point the given point
 * @returns {{x: number, y: number}} the best match
 */
export default function getClosestPoint(pathInput, point) {
  return getPropertiesAtPoint(pathInput, point).closest;
}
