import arcToCubic from './arcToCubic';
import quadToCubic from './quadToCubic';
import lineToCubic from './lineToCubic';

/**
 * Converts any segment to C (cubic-bezier).
 *
 * @param {SVGPathCommander.pathSegment} segment the source segment
 * @param {SVGPathCommander.parserParams} params the source segment parameters
 * @returns {SVGPathCommander.pathSegment} the cubic-bezier segment
 */
export default function segmentToCubic(segment, params) {
  if (!'TQ'.includes(segment[0])) {
    params.qx = null;
    params.qy = null;
  }

  const values = segment.slice(1).map(Number);
  const [x, y] = values;
  const {
    x1: px1, y1: py1, x: px, y: py,
  } = params;

  switch (segment[0]) {
    case 'M':
      params.x = x;
      params.y = y;
      return segment;
    case 'A':
      // @ts-ignore
      // return ['C'].concat(arcToCubic.apply(0, [px1, py1].concat(segment.slice(1))));
      return ['C', ...arcToCubic(...[px1, py1, ...values])];
    case 'Q':
      params.qx = x;
      params.qy = y;
      // @ts-ignore
      // return ['C'].concat(quadToCubic.apply(0, [px1, py1].concat(segment.slice(1))));
      return ['C', ...quadToCubic(...[px1, py1, ...values])];
    case 'L':

      // return ['C'].concat(lineToCubic(px1, py1, x, y));
      return ['C', ...lineToCubic(px1, py1, x, y)];
    case 'Z':
      // return ['C'].concat(lineToCubic(px1, py1, px, py));
      return ['C', ...lineToCubic(px1, py1, px, py)];
    default:
  }
  return segment;
}
