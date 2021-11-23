import arcToCubic from './arcToCubic';
import quadToCubic from './quadToCubic';
import lineToCubic from './lineToCubic';

/**
 * Converts any segment to C (cubic-bezier).
 *
 * @param {SVGPC.pathSegment} segment the source segment
 * @param {Object.<string, number>} params the source segment parameters
 * @returns {SVGPC.pathSegment} the cubic-bezier segment
 */
export default function segmentToCubic(segment, params) {
  if ('TQ'.indexOf(segment[0]) < 0) {
    params.qx = null;
    params.qy = null;
  }

  const [s1, s2] = segment.slice(1);

  switch (segment[0]) {
    case 'M':
      params.x = s1;
      params.y = s2;
      return segment;
    case 'A':
      return ['C'].concat(arcToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))));
    case 'Q':
      params.qx = s1;
      params.qy = s2;
      return ['C'].concat(quadToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))));
    case 'L':
      return ['C'].concat(lineToCubic(params.x1, params.y1, segment[1], segment[2]));
    case 'Z':
      return ['C'].concat(lineToCubic(params.x1, params.y1, params.x, params.y));
    default:
  }
  return segment;
}
