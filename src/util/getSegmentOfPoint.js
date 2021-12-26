import getPropertiesAtPoint from './getPropertiesAtPoint';

/**
 * Returns the path segment which contains a given point.
 *
 * @param {string | SVGPathCommander.pathArray} path the `pathArray` to look into
 * @param {{x: number, y: number}} point the point of the shape to look for
 * @returns {SVGPathCommander.pathSegment?} the requested segment
 */
export default function getSegmentOfPoint(path, point) {
  const props = getPropertiesAtPoint(path, point);
  const { segment } = props;
  return typeof segment !== 'undefined' ? segment.segment : null;
}
