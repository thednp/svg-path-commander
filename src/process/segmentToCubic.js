import arcToCubic from './arcToCubic';
import quadToCubic from './quadToCubic';
import lineToCubic from './lineToCubic';

/**
 * Converts any segment to C (cubic-bezier).
 *
 * @param {svgpcNS.pathSegment} segment the source segment
 * @param {svgpcNS.parserParams} params the source segment parameters
 * @returns {svgpcNS.pathSegment} the cubic-bezier segment
 */
export default function segmentToCubic(segment, params) {
  if (!'TQ'.includes(segment[0])) {
    params.qx = null;
    params.qy = null;
  }

  const [s1, s2] = segment.slice(1);

  switch (segment[0]) {
    case 'M':
      params.x = +s1;
      params.y = +s2;
      return segment;
    case 'A':
      // @ts-ignore
      return ['C'].concat(arcToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))));
    case 'Q':
      params.qx = +s1;
      params.qy = +s2;
      // @ts-ignore
      return ['C'].concat(quadToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))));
    case 'L':
      // @ts-ignore
      return ['C'].concat(lineToCubic(params.x1, params.y1, segment[1], segment[2]));
    case 'Z':
      // @ts-ignore
      return ['C'].concat(lineToCubic(params.x1, params.y1, params.x, params.y));
    default:
  }
  return segment;
}
