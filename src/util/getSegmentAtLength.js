import getPropertiesAtLength from './getPropertiesAtLength';

/**
 * Returns the segment at a given length.
 * @param {string | SVGPathCommander.pathArray} pathInput the target `pathArray`
 * @param {number} distance the distance in path to look at
 * @returns {SVGPathCommander.pathSegment?} the requested segment
 */
export default function getSegmentAtLength(pathInput, distance) {
  const props = getPropertiesAtLength(pathInput, distance);
  const { segment } = typeof props !== 'undefined' ? props : { segment: null };
  return segment;
}
