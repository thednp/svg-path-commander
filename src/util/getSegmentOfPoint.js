import getPropertiesAtPoint from './getPropertiesAtPoint';

/**
 * Returns the path segment which contains a given point.
 *
 * @param {string | SVGPath.pathArray} path the `pathArray` to look into
 * @param {{x: number, y: number}} point the point of the shape to look for
 * @returns {SVGPath.pathSegment?} the requested segment
 */
export default function getSegmentOfPoint(path, point) {
  return getPropertiesAtPoint(path, point).segment;
}
