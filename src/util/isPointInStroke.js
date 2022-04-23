import getPropertiesAtPoint from './getPropertiesAtPoint';

/**
 * Checks if a given point is in the stroke of a path.
 *
 * @param {string | SVGPath.pathArray} pathInput target path
 * @param {{x: number, y: number}} point the given `{x,y}` point
 * @returns {boolean} the query result
 */
export default function isPointInStroke(pathInput, point) {
  const { distance } = getPropertiesAtPoint(pathInput, point);
  return Math.abs(distance) < 0.001; // 0.01 might be more permissive
}
