import arcToCubic from './arcToCubic';
import quadToCubic from './quadToCubic';
import lineToCubic from './lineToCubic';

/**
 * Converts any segment to C (cubic-bezier).
 *
 * @param {SVGPathCommander.pathSegment} segment the source segment
 * @param {SVGPathCommander.parserParams} params the source segment parameters
 * @returns {SVGPathCommander.cubicSegment | SVGPathCommander.MSegment} the cubic-bezier segment
 */
export default function segmentToCubic(segment, params) {
  const [pathCommand] = segment;
  const values = segment.slice(1).map((n) => +n);
  const [x, y] = values;
  let args;
  const {
    x1: px1, y1: py1, x: px, y: py,
  } = params;

  if (!'TQ'.includes(pathCommand)) {
    params.qx = null;
    params.qy = null;
  }

  switch (pathCommand) {
    case 'M':
      params.x = x;
      params.y = y;
      return segment;
    case 'A':
      args = [px1, py1, ...values];
      // @ts-ignore -- relax, the utility will return 6 numbers
      return ['C', ...arcToCubic(...args)];
    case 'Q':
      params.qx = x;
      params.qy = y;
      args = [px1, py1, ...values];
      // @ts-ignore -- also returning 6 numbers
      return ['C', ...quadToCubic(...args)];
    case 'L':
      // @ts-ignore -- also returning 6 numbers
      return ['C', ...lineToCubic(px1, py1, x, y)];
    case 'Z':
      // @ts-ignore -- also returning 6 numbers
      return ['C', ...lineToCubic(px1, py1, px, py)];
    default:
  }
  // @ts-ignore -- we're switching `pathSegment` type
  return segment;
}
