import getPropertiesAtPoint from './getPropertiesAtPoint';

/**
 * Checks if a given point is in the stroke of a path.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput target path
 * @param {{x: number, y: number}} point
 * @returns {boolean} the query result
 */
export default function isPointInStroke(pathInput, point) {
  const { distance } = getPropertiesAtPoint(pathInput, point);
  return Math.abs(distance) < 0.01;
}
